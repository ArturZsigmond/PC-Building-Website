"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [needs2FA, setNeeds2FA] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Build payload with optional token
    const payload: Record<string, string> = { email, password };
    if (needs2FA) {
      payload.token = token;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      const data = (await res.json()) as { needs2fa?: boolean; error?: string; token?: string };

      if (res.status === 206 && data.needs2fa) {
        setNeeds2FA(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Success: store token and redirect
      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        setError("Login succeeded but no token received");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded shadow-md space-y-4 w-80"
      >
        <h1 className="text-2xl font-bold text-purple-400 text-center">Log In</h1>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {needs2FA && (
          <div>
            <label className="block mb-1">2FA Code</label>
            <input
              type="text"
              className="w-full p-2 rounded text-black"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              maxLength={6}
              required
            />
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded text-xl"
        >
          {loading ? "Please wait..." : needs2FA ? "Verify & Log In" : "Log In"}
        </button>
      </form>
    </div>
  );
}
