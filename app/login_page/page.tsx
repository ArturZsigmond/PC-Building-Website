"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
    const token = data.token;

    // Save token
    document.cookie = `token=${token}; path=/`;
    localStorage.setItem("token", token);

    // Decode token to check role
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.role === "ADMIN") {
      router.push("/admin_page");
    } else {
      router.push("/main_page");

    }
  };

  return (
    <div className="p-8 text-white max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>
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
