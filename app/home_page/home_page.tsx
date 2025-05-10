"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const handleAdminAccess = () => setShowModal(true);

  const checkAdminPassword = () => {
    if (adminPassword === "adminpass") {
      setShowModal(false);
      router.push("/admin_page");
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col justify-center items-center space-y-6">
      <h1 className="text-4xl font-bold mb-8 text-purple-400">Welcome to PC Builder</h1>

      <button
        className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded text-xl w-64"
        onClick={() => router.push("/login_page")}
      >
        Log In
      </button>

      <button
        className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded text-xl w-64"
        onClick={() => router.push("/register_page")}
      >
        Register
      </button>

      <button
        className="bg-purple-900 hover:bg-purple-700 px-6 py-3 rounded text-xl w-64"
        onClick={handleAdminAccess}
      >
        Admin Mode
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-md space-y-4">
            <h2 className="text-xl text-purple-400">Enter Admin Password</h2>
            <input
              type="password"
              className="w-full p-2 rounded text-black"
              placeholder="Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded"
                onClick={checkAdminPassword}
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
