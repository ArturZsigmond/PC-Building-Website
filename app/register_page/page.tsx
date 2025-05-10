"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdminMode = searchParams.get("admin") === "true";

  const handleLogin = async () => {
    setError("");

    const res = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Login failed");
      return;
    }

    const data = await res.json();

    document.cookie = `token=${data.token}; path=/`;
    localStorage.setItem("token", data.token);

    // Decode token to check user role
    const [, payload] = data.token.split(".");
    const decoded = JSON.parse(atob(payload));

    if (decoded.role === "ADMIN") {
      router.push("/admin_page");
    } else {
      router.push("/build_page");
    }
  };

  return (
    <div className="p-8 text-white max-w-md mx-auto">
      <h1 className="text-2xl mb-4">{isAdminMode ? "Admin Login" : "Login"}</h1>
      <input
        className="w-full p-2 mb-2 text-black"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 mb-2 text-black"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="bg-purple-600 w-full p-2 rounded">
        Login
      </button>
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
}
