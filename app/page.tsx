import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-6">ARTUR'S PC BUILDER</h1>
      
      <Link href="/my_builds_page">
        <button className="bg-gray-800 text-white mb-4 p-4 rounded w-64">
          My Builds
        </button>
      </Link>
      <Link href="/upload_page">
      <button className="bg-blue-600 text-white mb-4 p-4 rounded w-64">
      Upload PC Unboxing
      </button>
      </Link>

      <Link href="/gallery_page">
      <button className="bg-indigo-600 text-white p-4 rounded w-64">
      Gallery
      </button>
      </Link>
      
      <Link href="/build_page">
        <button className="bg-purple-600 text-white p-4 rounded w-64">
          Build Your Dream PC
        </button>
      </Link>
    </div>
  );
}
