"use client";
import { useParams, notFound } from "next/navigation";
import { getCourses } from "../courses-list/index";
import PhaserGame from "./PhaserGame";
import { useState, useEffect, useRef } from "react";
import { startAudio, stopAudio } from "../../audio";


export default function CoursePage() {
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const courses = getCourses();
  const params = useParams();
  const course = courses.find((c) => c.id === params.slug);

  const [listening, setListening] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<{ stop: () => void } | null>(null);

  if (!course) return notFound();

  // Ensure course has all required properties for PhaserGame
  const completeCourse = {
    id: course.id ?? "",
    notes: course.notes ?? [],
    title: course.title ?? course.name ?? "Untitled Course",
    description: course.description ?? "",
    level: course.level ?? "",
    ...course,
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {completeCourse.title || completeCourse.name}
        </h1>
        <p className="text-lg text-gray-600">
          {completeCourse.description}
        </p>
      </header>
      <div className="flex flex-col items-center gap-4">
        <button
          className="px-6 py-3 rounded-lg bg-blue-500 text-white font-bold shadow hover:bg-blue-600 transition"
          onClick={async () => {
            setAudioError(null);
            if (listening) {
              stopAudio();
              audioRef.current = null;
              setListening(false);
            } else {
              try {
                audioRef.current = await startAudio(({ pitch, clarity }: { pitch: number; clarity: number }) => {
                  console.log('Pitch détecté, dispatch pitch:', pitch, clarity);
                  globalThis.dispatchEvent(new CustomEvent('pitch', { detail: { pitch, clarity } }));
                });
                setListening(true);
              } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'activation du micro.";
                setAudioError(errorMessage);
              }
            }
          }}
        >
          {listening ? "Arrêter d'écouter" : "Écouter"}
        </button>
        {audioError && (
          <div className="text-red-500 font-bold mt-2 text-center">
            {audioError}
          </div>
        )}
        <div className="flex justify-center items-center w-full" style={{ minHeight: 600 }}>
          <PhaserGame courseKey={completeCourse.id ?? ""} course={completeCourse} listening={listening} />
        </div>
      </div>
    </div>
  );
}
