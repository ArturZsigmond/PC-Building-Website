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

interface UserLog {
  email: string;
  action: string;
  buildGpu: string;
  timestamp: string;
}

export default function AdminPage() {
  const [monitored, setMonitored] = useState<MonitoredUser[]>([]);
  const [gpuStats, setGpuStats] = useState<GpuStat[]>([]);
  const [logs, setLogs] = useState<UserLog[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/monitored`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setMonitored)
      .catch((err) => console.error("Monitored fetch error:", err.message));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/heavy`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setGpuStats)
      .catch((err) => console.error("GPU stats fetch error:", err.message));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setLogs)
      .catch((err) => console.error("Logs fetch error:", err.message));
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

      {/* User Activity Logs */}
      <section>
        <h2 className="text-2xl text-purple-300 mb-4">Recent User Activity</h2>
        {logs.length === 0 ? (
          <p className="text-gray-400">No activity logs found.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log, index) => (
              <li
                key={index}
                className="p-3 bg-gray-800 rounded border border-purple-500"
              >
                <p><strong>User:</strong> {log.email}</p>
                <p><strong>Action:</strong> {log.action}</p>
                <p><strong>GPU:</strong> {log.buildGpu}</p>
                <p><strong>Time:</strong> {new Date(log.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
