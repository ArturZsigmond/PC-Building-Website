"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BuildCard({ build, onDelete, onUpdate, highlight }: { build: any; onDelete: (id: number) => void; onUpdate: (updatedBuild: any) => void; highlight?: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [cpu, setCpu] = useState(build.cpu);
  const [ram, setRam] = useState(build.ram);
  const [gpu, setGpu] = useState(build.gpu);

  const borderClass =
    highlight === "max"
      ? "border-red-500"
      : highlight === "min"
      ? "border-green-500"
      : highlight === "avg"
      ? "border-yellow-400"
      : "border-transparent";

  const chartData = [
    { part: "CPU", price: cpu === "Intel" ? 565 : 550 },
    { part: "RAM", price: ram === "16GB" ? 200 : 375 },
    { part: "GPU", price: gpu === "RTX 5090" ? 2100 : gpu === "RTX 5080" ? 1595 : 0 },
    { part: "Case", price: build.case === "case1.jpg" ? 200 : build.case === "case2.jpg" ? 235 : build.case === "case3.jpg" ? 185 : 230 }
  ];

  return (
    <div className={`relative group bg-gray-900 p-4 rounded-lg shadow-lg text-white transition-transform duration-300 hover:scale-105 max-w-lg mx-auto border-4 ${borderClass}`}>
      <div className="relative w-full">
        <img src={`/${build.case}`} className="opacity-100 group-hover:opacity-0 transition-opacity duration-300 w-full h-48 object-cover rounded-md" />

        {/* Specs appear on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center bg-black/80 text-white p-4">
          {isEditing ? (
            <>
              <label>CPU:</label>
              <select className="p-2 bg-gray-700 text-white rounded" value={cpu} onChange={(e) => setCpu(e.target.value)}>
                <option value="Intel">Intel</option>
                <option value="AMD">AMD</option>
              </select>

              <label>RAM:</label>
              <select className="p-2 bg-gray-700 text-white rounded" value={ram} onChange={(e) => setRam(e.target.value)}>
                <option value="16GB">16GB</option>
                <option value="32GB">32GB</option>
              </select>

              <label>GPU:</label>
              <select className="p-2 bg-gray-700 text-white rounded" value={gpu} onChange={(e) => setGpu(e.target.value)}>
                <option value="RTX 5080">RTX 5080</option>
                <option value="RTX 5090">RTX 5090</option>
                <option value="GTX 690">GTX 690</option>
              </select>

              <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full" onClick={() => { 
                onUpdate({ ...build, cpu, ram, gpu }); 
                setIsEditing(false);
              }}>
                Save
              </button>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold">{build.cpu} - {build.gpu}</h2>
              <p>RAM: {build.ram}</p>
              <p>Case: {build.case}</p>
              <p>Price: ${build.price}</p>
              <div className="w-full h-48 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="part" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Bar dataKey="price" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-2">
        <button className="bg-yellow-500 hover:bg-yellow-700 text-white p-2 rounded" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white p-2 rounded" onClick={() => onDelete(build.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
