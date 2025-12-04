"use client";
import Link from "next/link";
import Navbar from "../components/Navbar";
// No scroll or useRef needed
import { getCourses } from "./courses-list";

export default function Home() {
  const courses = getCourses();

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-purple-100">
        <div className="w-full max-w-3xl mx-auto text-center mb-10">
          <span className="text-6xl mb-4 block">🎸</span>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-lg">Cours disponibles</h1>
          <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
            Sélectionne un cours pour commencer à jouer !
          </p>
        </div>
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group block"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="w-16 h-16 bg-linear-to-br from-blue-200 to-purple-200 rounded-xl flex items-center justify-center text-3xl mb-4">
                  🎸
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {course.title || course.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {course.description}
                </p>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-gray-500">
                    Niveau : {course.level || 'N/A'}
                  </span>
                  <svg 
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}