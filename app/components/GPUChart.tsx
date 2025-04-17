"use client";
import React from "react";


import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function GPUChart() {
  const [data, setData] = useState<{ gpu: string; count: number }[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/builds/stats")
      .then((res) => res.json())
      .then((gpuCounts) => {
        const chartData = Object.entries(gpuCounts).map(([gpu, count]) => ({
          gpu,
          count: Number(count),
        }));
        setData(chartData);
      });
  }, []);

  const colors: Record<string, string> = {
    "RTX 5090": "#FFD700",
    "RTX 5080": "#00BFFF",
    "GTX 690": "#A9A9A9",
  };

  return (
    <div className="w-full mt-8 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-white text-center text-xl font-semibold mb-4">GPU Usage in Builds</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 40, right: 30 }}>
          <XAxis type="number" stroke="#ccc" />
          <YAxis type="category" dataKey="gpu" stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="count" radius={[0, 10, 10, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[entry.gpu] || "#8884d8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
