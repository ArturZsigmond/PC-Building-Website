"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col justify-center items-center space-y-6">
      <h1 className="text-4xl font-bold mb-8 text-purple-400">Welcome to PC Builder</h1>
      <button
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-xl w-64"
        onClick={() => router.push("/login_page")}
      >
        Log In
      </button>
      <button
        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded text-xl w-64"
        onClick={() => router.push("/register_page")}
      >
        Register
      </button>
      <button
        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-xl w-64"
        onClick={() => router.push("/login_page?admin=true")}
      >
        Admin Mode
      </button>
    </div>
  );
}
