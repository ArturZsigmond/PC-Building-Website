"use client";
import { useState } from "react";
import type {BuildData } from "../types/Build";

export default function BuildForm({ onSubmit }: { onSubmit: (data: BuildData) => void }) {
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState("");
  const [gpu, setGpu] = useState("");
  const [pcCase, setPcCase] = useState("");

  // Store last selected part for display
  const [lastSelectedPart, setLastSelectedPart] = useState<string | null>(null);

  // Image mapping for selections
  const selectedImages: { [key: string]: string } = {
    Intel: "/intel.jpg",
    AMD: "/amd.jpg",
    "16GB": "/16.jpg",
    "32GB": "/32.jpg",
    "RTX 5080": "/5080.jpg",
    "RTX 5090": "/5090.jpg",
    "GTX 690": "/690.jpg",
    "case1.jpg": "/case1.jpg",
    "case2.jpg": "/case2.jpg",
    "case3.jpg": "/case3.jpg",
    "case4.jpg": "/case4.jpg",
  };

  // Function to update selection and preview
  const handleSelection = (type: string, value: string) => {
    if (!value) return;
    setLastSelectedPart(selectedImages[value] || null);

    if (type === "cpu") setCpu(value);
    if (type === "ram") setRam(value);
    if (type === "gpu") setGpu(value);
    if (type === "case") setPcCase(value);
  };

  return (
    <div className="flex justify-between w-full p-8">
      {/* Left Side - Form */}
      <div className="w-1/2 flex flex-col space-y-4">
        <h1 className="text-2xl text-purple-400">Build Your Dream PC</h1>

        <label>CPU:</label>
        <select className="p-2 bg-gray-700 text-white rounded" onChange={(e) => handleSelection("cpu", e.target.value)}>
          <option value="">Select CPU</option>
          <option value="Intel">Intel</option>
          <option value="AMD">AMD</option>
        </select>

        <label>RAM:</label>
        <select className="p-2 bg-gray-700 text-black rounded" onChange={(e) => handleSelection("ram", e.target.value)}>
          <option value="">Select RAM</option>
          <option value="16GB">16GB</option>
          <option value="32GB">32GB</option>
        </select>

        <label>GPU:</label>
        <select className="p-2 bg-gray-700 text-white rounded" onChange={(e) => handleSelection("gpu", e.target.value)}>
          <option value="">Select GPU</option>
          <option value="RTX 5080">RTX 5080</option>
          <option value="RTX 5090">RTX 5090</option>
          <option value="GTX 690">GTX 690</option>
        </select>

        <label>Case:</label>
        <div className="flex space-x-4">
          {["case1.jpg", "case2.jpg", "case3.jpg", "case4.jpg"].map((img) => (
            <img
              key={img}
              src={`/${img}`} alt="" 
              className={`w-20 cursor-pointer ${pcCase === img ? "border-4 border-purple-400" : ""}`}
              onClick={() => handleSelection("case", img)}
            />
          ))}
        </div>

        <button
          className="mt-4 bg-green-600 hover:bg-green-700 text-white p-4 rounded w-full"
          onClick={() => onSubmit({ cpu, ram, gpu, case: pcCase })}
          disabled={!cpu || !ram || !gpu || !pcCase}
        >
          Build It!
        </button>
      </div>

      {/* Right Side - Last Selected Image Preview */}
      <div className="w-1/2 flex flex-col items-center">
        {lastSelectedPart ? (
          <img src={lastSelectedPart} alt="" className="w-48 border-4 border-purple-400 p-2 rounded-md shadow-lg" />
        ) : (
          <p className="text-gray-400">Select a part to preview</p>
        )}
      </div>
    </div>
  );
}
