"use client";
import { useEffect, useState } from "react";

interface MonitoredUser {
  email: string;
  reason: string;
}

interface GpuStat {
  gpu: string;
  avgPrice: number;
  count: number;
}

export default function AdminPage() {
  const [monitored, setMonitored] = useState<MonitoredUser[]>([]);
  const [gpuStats, setGpuStats] = useState<GpuStat[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch monitored users safely
    fetch("http://localhost:4000/api/monitored", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch monitored users");
        return res.json();
      })
      .then(setMonitored)
      .catch((err) => {
        console.error("Monitored fetch error:", err.message);
      });

    // Fetch GPU stats safely
    fetch("http://localhost:4000/api/stats/heavy", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch GPU stats");
        return res.json();
      })
      .then(setGpuStats)
      .catch((err) => {
        console.error("GPU stats fetch error:", err.message);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 space-y-16">
      <h1 className="text-4xl text-purple-400 mb-2">Admin Dashboard</h1>

      {/* GPU Stats */}
      <section>
        <h2 className="text-2xl text-purple-300 mb-4">GPU Build Statistics</h2>
        <table className="w-full bg-gray-800 rounded-md overflow-hidden">
          <thead className="bg-gray-700 text-left">
            <tr>
              <th className="p-3">GPU</th>
              <th className="p-3">Average Price</th>
              <th className="p-3">Build Count</th>
            </tr>
          </thead>
          <tbody>
            {gpuStats.map((stat) => (
              <tr key={stat.gpu} className="border-t border-gray-700">
                <td className="p-3">{stat.gpu}</td>
                <td className="p-3">${stat.avgPrice}</td>
                <td className="p-3">{stat.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Monitored Users */}
      <section>
        <h2 className="text-2xl text-purple-300 mb-4">Monitored Users</h2>
        {monitored.length === 0 ? (
          <p className="text-gray-400">No suspicious users detected.</p>
        ) : (
          <div className="space-y-4">
            {monitored.map((user, i) => (
              <div
                key={i}
                className="p-4 border border-purple-500 rounded-md bg-gray-800 shadow-md"
              >
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Reason:</strong> {user.reason}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
