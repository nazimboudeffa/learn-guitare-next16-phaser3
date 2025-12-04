"use client";
import { useState, useEffect, useRef } from "react";
// MenuScene is dynamically imported below, no need for static import
// Remove top-level imports for Phaser and scenes
// Import your scene here
// import CoursesPracticeScene from "@/src/scene"; // Adjust path as needed


export interface CourseNote {
  string: string;
  time: number;
  fret?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  notes: CourseNote[];
}

type PhaserGameProps = {
  courseKey: string;
  course: Course;
  listening?: boolean;
};

export default function PhaserGame({ courseKey, course, listening }: Readonly<PhaserGameProps>) {
  const gameRef = useRef<HTMLDivElement | null>(null);
  const phaserInstance = useRef<Phaser.Game | null>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });

  useEffect(() => {
    function updateDimensions() {
      const isMobile = window.innerWidth < 700;
      const width = isMobile ? window.innerWidth : 900;
      const height = isMobile ? window.innerHeight : 600;
      setDimensions({ width, height });
    }
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!listening) return;
      const Phaser = (await import("phaser")).default ?? (await import("phaser"));
      const { MenuScene } = await import("./CourseScene.js");
      const CourseScene = (await import("./CourseScene.js")).default;
      const StatsScene = (await import("./StatsScene.js")).default;
      if (!isMounted) return;
      const config = {
        type: Phaser.AUTO,
        width: dimensions.width,
        height: dimensions.height,
        parent: gameRef.current,
        backgroundColor: "#222",
        scene: [MenuScene, CourseScene, StatsScene],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };
      phaserInstance.current = new Phaser.Game(config);
      phaserInstance.current.scene.start('MenuScene', {
        course: course,
        courseKey: courseKey
      });
    })();
    return () => {
      isMounted = false;
      if (phaserInstance.current) {
        phaserInstance.current.destroy(true);
        phaserInstance.current = null;
      }
    };
  }, [courseKey, course, listening, dimensions]);

  if (!listening) return null;
  return (
    <div style={{ position: "relative", width: dimensions.width, height: dimensions.height, maxWidth: '100vw', maxHeight: '100vh', margin: "0 auto" }}>
      <div ref={gameRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}