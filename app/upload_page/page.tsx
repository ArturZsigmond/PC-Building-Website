"use client";
import React from "react";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      setUploadStatus(" Upload successful!");
    } catch {
      setUploadStatus(" Upload failed. Check server or file size.");
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl mb-4 text-purple-400">Upload Your PC Unboxing Video</h1>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded"
      >
        Upload
      </button>

      {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
    </div>
  );
}
