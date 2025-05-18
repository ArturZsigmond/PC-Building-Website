"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Build, BuildData } from "../types/Build";

export default function StatsChart({ builds }: { builds: BuildData[] }) {
  // Count builds per GPU
  const data = [
    { gpu: "RTX 5080", count: builds.filter(b => b.gpu === "RTX 5080").length },
    { gpu: "RTX 5090", count: builds.filter(b => b.gpu === "RTX 5090").length },
    { gpu: "GTX 690", count: builds.filter(b => b.gpu === "GTX 690").length },
  ];

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg mt-8">
      <h2 className="text-xl mb-4 text-purple-400">GPU Usage Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="gpu" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#a855f7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
