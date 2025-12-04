
"use client";
import Link from "next/link";
// No scroll or useRef needed
import { getCourses } from "./courses-list";

export default function Home() {
  const courses = getCourses();

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="w-full">
        <header className="mb-3 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Cours disponibles
          </h1>
          <p className="text-xl text-gray-600">
            Sélectionne un cours pour commencer à jouer !
          </p>
        </header>
      </div>

      {/* Courses Section - Horizontal Scroll */}
      <section className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group block"
            >
              <div className="bg-white rounded-2xl shadow-md p-6 transition-all hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="w-16 h-16 bg-linear-to-br from-blue-200 to-purple-200 rounded-xl flex items-center justify-center text-3xl mb-4">
                  🎸
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {course.title || course.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
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
        </div>
      </section>
    </main>
  );
}