"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState<string>("");
  const [setupError, setSetupError] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [twoFaEnabled, setTwoFaEnabled] = useState<boolean>(false);

  // Ensure we have a base API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || window.location.origin;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login_page");
      return;
    }

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: { twoFactorEnabled: boolean }) => setTwoFaEnabled(data.twoFactorEnabled))
      .catch(() => {});
  }, [router]);

  const handleSetup2FA = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSetupError("Not authenticated");
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/2fa/setup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { qrDataUrl, error } = await res.json();
      if (res.ok) {
        setQrDataUrl(qrDataUrl);
        setSetupError(null);
      } else {
        setSetupError(error || "Failed to setup 2FA");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setSetupError(message);
    }
  };

  const handleVerify2FA = async () => {
    const tokenStr = localStorage.getItem("token");
    if (!tokenStr) {
      setVerifyError("Not authenticated");
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/2fa/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenStr}`,
          },
          body: JSON.stringify({ token: totpCode }),
        }
      );
      const { success, error } = await res.json();
      if (res.ok && success) {
        setTwoFaEnabled(true);
        setQrDataUrl(null);
        setTotpCode("");
        setVerifyError(null);
      } else {
        setVerifyError(error || "Invalid code");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setVerifyError(message);
    }
  };

  const explode = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated");
      return;
    }

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
      await fetch(
        `${API_URL}/builds`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(build),
        }
      );
    }

    alert("Explode complete! Wait up to 1 minute for admin dashboard to update.");
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center p-6 space-y-6">
      <h1 className="text-4xl font-bold text-purple-400">
        Welcome to your Dashboard
      </h1>

      {/* 2FA Section */}
      <div className="w-full max-w-md p-4 bg-gray-800 rounded space-y-4">
        {twoFaEnabled ? (
          <p className="text-green-400">
            ✅ Two-Factor Authentication is enabled.
          </p>
        ) : qrDataUrl ? (
          <>
            <p>Scan this QR code with your Authenticator app:</p>
            <img
              src={qrDataUrl}
              alt="2FA QR Code"
              className="mx-auto"
            />
            <div className="flex flex-col">
              <label>Enter 6-digit code:</label>
              <input
                type="text"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                className="p-2 rounded text-black mt-1"
              />
            </div>
            <button
              onClick={handleVerify2FA}
              className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Verify & Enable
            </button>
            {verifyError && <p className="text-red-400">{verifyError}</p>}
          </>
        ) : (
          <>
            <button
              onClick={handleSetup2FA}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Enable Two-Factor Authentication
            </button>
            {setupError && <p className="text-red-400">{setupError}</p>}
          </>
        )}
      </div>

      {/* Main Actions */}
      <Link href="/my_builds_page">
        <button className="w-64 bg-gray-600 hover:bg-gray-800 px-6 py-3 rounded text-xl">
          My Builds
        </button>
      </Link>

      <Link href="/build_page">
        <button className="w-64 bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded text-xl">
          Build Your Dream PC
        </button>
      </Link>

      <button
        onClick={explode}
        className="w-64 bg-red-700 hover:bg-red-800 px-6 py-3 rounded text-xl"
      >
        💥 Explode (Trigger Suspicious Activity)
      </button>
    </div>
  );
}
