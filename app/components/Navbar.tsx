import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-center py-4 bg-white shadow-md mb-8">
      <ul className="flex gap-8 text-lg font-semibold">
        <li>
          <Link href="/" className="hover:text-gray-700 transition flex items-center">
            <span className="mr-1 text-xl">🏠</span> Home
          </Link>
        </li>
        <li>
          <Link href="/courses" className="hover:text-blue-600 transition">Courses</Link>
        </li>
        <li>
          <Link href="/songs" className="hover:text-purple-600 transition">Songs</Link>
        </li>
        <li>
          <Link href="/games" className="hover:text-green-600 transition">Games</Link>
        </li>
      </ul>
    </nav>
  );
}
