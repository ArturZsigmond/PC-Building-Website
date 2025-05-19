"use client";
import React from "react";

import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`)
      .then((res) => res.json())
      .then((data) => setFiles(data.files || []));
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl mb-6 text-indigo-400">🎥 PC Unboxing Gallery</h1>

      {files.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {files.map((file) => (
            <div key={file} className="bg-gray-800 p-4 rounded shadow-md">
              <video controls className="w-full mb-2">
                <source src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${file}`} />
                Your browser does not support video playback.
              </video>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${file}`}
                download
                className="text-blue-400 underline"
              >
                ⬇️ Download {file}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
