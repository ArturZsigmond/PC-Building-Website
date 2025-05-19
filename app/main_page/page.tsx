"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login_page");
  }, [router]);

  const explode = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authenticated");

    const payloads = Array.from({ length: 25 }).map(() => {
      const CPUS = ["Intel", "AMD"];
      const RAMS = ["16GB", "32GB"];
      const GPUS = ["RTX 5080", "RTX 5090", "GTX 690"];
      const CASES = ["case1.jpg", "case2.jpg", "case3.jpg", "case4.jpg"];

      const cpu = CPUS[Math.floor(Math.random() * CPUS.length)];
      const ram = RAMS[Math.floor(Math.random() * RAMS.length)];
      const gpu = GPUS[Math.floor(Math.random() * GPUS.length)];
      const pcCase = CASES[Math.floor(Math.random() * CASES.length)];
      const price = 10;

      return { cpu, ram, gpu, case: pcCase, price };
    });

    for (const build of payloads) {
      await fetch("{process.env.NEXT_PUBLIC_API_URL}/api/builds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(build),
      });
    }

    alert("Explode complete! Wait up to 1 minute for admin dashboard to update.");
  };
//bg-gray-800 p-6 rounded shadow-md space-y-4
  return (
    <div className="h-screen bg-gray-0 text-white flex flex-col justify-center items-center space-y-6">
      <h1 className="text-4xl font-bold text-purple-400 mb-8">
        Welcome to your Dashboard
      </h1>

      <Link href="/my_builds_page">
        <button className="bg-gray-600 hover:bg-gray-800 px-6 py-3 rounded text-xl w-64">
          My Builds
        </button>
      </Link>

      <Link href="/upload_page">
        <button className="bg-purple-700 hover:bg-blue-700 px-6 py-3 rounded text-xl w-64">
          Upload PC Unboxing
        </button>
      </Link>

      <Link href="/gallery_page">
        <button className="bg-gray-600 hover:bg-indigo-700 px-6 py-3 rounded text-xl w-64">
          Gallery
        </button>
      </Link>

      <Link href="/build_page">
        <button className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded text-xl w-64">
          Build Your Dream PC
        </button>
      </Link>

      <button
        onClick={explode}
        className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded text-xl w-64 mt-4"
      >
        💥 Explode (Trigger Suspicious Activity)
      </button>
    </div>
  );
}
