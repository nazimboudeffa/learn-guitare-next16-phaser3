"use client";
import { useEffect, useRef } from "react";
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
  console.log('PhaserGame received course:', course);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!listening) return;
      const Phaser = (await import("phaser")).default ?? (await import("phaser"));
      const { MenuScene } = await import("../../CourseScene.js");
      const CourseScene = (await import("../../CourseScene.js")).default;
      const StatsScene = (await import("../../StatsScene.js")).default;
      if (!isMounted) return;
      const config = {
        type: Phaser.AUTO,
        width: 900,
        height: 600,
        parent: gameRef.current,
        backgroundColor: "#222",
        scene: [MenuScene, CourseScene, StatsScene],
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
  }, [courseKey, course, listening]);

  if (!listening) return null;
  return (
    <div style={{ position: "relative", width: 900, height: 600, margin: "0 auto" }}>
      <div ref={gameRef} style={{ width: 900, height: 600 }} />
    </div>
  );
}