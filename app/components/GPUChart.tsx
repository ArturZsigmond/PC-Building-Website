"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function GPUChart() {
  const [data, setData] = useState<{ gpu: string; count: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/builds/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Unauthorized or server error while fetching stats");
          return;
        }

        const gpuCounts = await res.json();
        const chartData = Object.entries(gpuCounts)
          .map(([gpu, count]) => ({
            gpu,
            count: Number(count) || 0, // fallback to 0 if NaN
          }))
          .filter((entry) => entry.gpu && !isNaN(entry.count));

        setData(chartData);
      } catch (err) {
        console.error("Failed to load GPU stats", err);
      }
    };

    fetchStats();
  }, []);

  const colors: Record<string, string> = {
    "RTX 5090": "#FFD700",
    "RTX 5080": "#00BFFF",
    "GTX 690": "#A9A9A9",
  };

  return (
    <div className="w-full mt-8 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-white text-center text-xl font-semibold mb-4">
        GPU Usage in Builds
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 40, right: 30 }}
        >
          <XAxis type="number" stroke="#ccc" />
          <YAxis type="category" dataKey="gpu" stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="count" radius={[0, 10, 10, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[entry.gpu] || "#8884d8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
