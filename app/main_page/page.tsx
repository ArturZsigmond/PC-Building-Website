"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login_page");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl mb-6 text-purple-400">Welcome to your Dashboard</h1>

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
        <button className="bg-indigo-600 text-white mb-4 p-4 rounded w-64">
          Gallery
        </button>
      </Link>

      <Link href="/build_page">
        <button className="bg-purple-600 text-white mb-4 p-4 rounded w-64">
          Build Your Dream PC
        </button>
      </Link>
    </div>
  );
}
