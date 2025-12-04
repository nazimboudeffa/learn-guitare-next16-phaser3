
"use client";
import Link from "next/link";
// No scroll or useRef needed

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-start p-0">
      {/* Hero Section */}
      <section className="w-full py-16 px-4 flex flex-col items-center text-center bg-linear-to-br from-blue-200 to-purple-200">
        <div className="mb-6">
          <span className="inline-block text-6xl mb-4">🎸</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 drop-shadow-lg">Learn Guitare</h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-6 max-w-2xl mx-auto">
            Apprends la guitare de façon interactive, ludique et progressive. Explore des cours, des chansons et des jeux pour progresser à ton rythme !
          </p>
          <Link href="/courses" className="inline-block px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition">Commencer un cours</Link>
        </div>
      </section>

      {/* Cards Section */}
      <section className="w-full max-w-5xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Courses Card */}
        <Link href="/courses" className="group block">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-1">
            <span className="text-5xl mb-4">🎓</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Courses</h2>
            <p className="text-gray-600 mb-4">Des exercices interactifs pour apprendre la guitare.</p>
            <span className="inline-block px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold text-sm">Explorer les cours</span>
          </div>
        </Link>
        {/* Songs Card */}
        <Link href="/songs" className="group block">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-1">
            <span className="text-5xl mb-4">🎵</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">Songs</h2>
            <p className="text-gray-600 mb-4">Joue et découvre des chansons célèbres adaptées à ton niveau.</p>
            <span className="inline-block px-4 py-2 rounded bg-purple-100 text-purple-700 font-semibold text-sm">Découvrir les chansons</span>
          </div>
        </Link>
        {/* Games Card */}
        <Link href="/games" className="group block">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-1">
            <span className="text-5xl mb-4">🎮</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">Games</h2>
            <p className="text-gray-600 mb-4">Améliore ta technique avec des mini-jeux musicaux.</p>
            <span className="inline-block px-4 py-2 rounded bg-green-100 text-green-700 font-semibold text-sm">Jouer et progresser</span>
          </div>
        </Link>
      </section>
    </main>
  );
}
