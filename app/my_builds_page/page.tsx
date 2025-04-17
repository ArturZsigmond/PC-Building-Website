"use client";
import React from "react";

import { useState, useEffect } from "react";
import BuildCard from "../components/BuildCard";
import GPUChart from "../components/GPUChart";
import { addToQueue } from "../utils/offlineQueue";

export default function MyBuilds() {
  const [builds, setBuilds] = useState<any[]>([]);
  const [cpuFilter, setCpuFilter] = useState<string>("");
  const [gpuFilter, setGpuFilter] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [buildsPerPage, setBuildsPerPage] = useState(3);

  useEffect(() => {
    fetch("http://localhost:4000/api/builds")
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => setBuilds(data))
      .catch((err) => {
        console.error("Failed to fetch builds", err);
      });
  }, []);

  const filteredBuilds = builds.filter(
    (build) =>
      (!cpuFilter || build.cpu === cpuFilter) &&
      (!gpuFilter || build.gpu === gpuFilter)
  );

  const sortedBuilds = sort
    ? [...filteredBuilds].sort((a, b) =>
        sort === "16GB"
          ? parseInt(a.ram) - parseInt(b.ram)
          : parseInt(b.ram) - parseInt(a.ram)
      )
    : filteredBuilds;

  const totalPages = Math.ceil(sortedBuilds.length / buildsPerPage);

  useEffect(() => {
    const target = document.getElementById("scroll-trigger");
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [currentPage, buildsPerPage, sortedBuilds.length]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");
  
    socket.onmessage = (event) => {
      const newBuild = JSON.parse(event.data);
      setBuilds((prev) => [...prev, newBuild]);
    };
  
    return () => socket.close();
  }, []);  

  const handleDelete = async (index: number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/builds/${index}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");
    } catch {
      addToQueue({ type: "delete", index });
      alert("⚠️ You're offline or the server is down. This delete will sync later.");
    }

    setBuilds(builds.filter((_, i) => i !== index));
  };

  const handleUpdate = async (index: number, updatedBuild: any) => {
    try {
      const res = await fetch(`http://localhost:4000/api/builds/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBuild),
      });

      if (!res.ok) throw new Error("Update failed");
    } catch {
      addToQueue({ type: "update", data: updatedBuild, index });
      alert("⚠️ You're offline or the server is down. This update will sync later.");
    }

    const updatedBuilds = [...builds];
    updatedBuilds[index] = updatedBuild;
    setBuilds(updatedBuilds);
  };

  const prices = sortedBuilds.map((b) => b.price);
  const sortedPrices = [...prices].sort((a, b) => a - b);

  const getHighlight = (price: number) => {
    const index = sortedPrices.indexOf(price);
    const percentile = (index / sortedPrices.length) * 100;

    if (percentile < 30) return "min";
    if (percentile < 70) return "avg";
    return "max";
  };

  const paginatedBuilds = sortedBuilds.slice(
    0,
    currentPage * buildsPerPage
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl text-purple-400 mb-4">My Builds</h1>

      <label>Filter by CPU:</label>
      <select
        className="p-2 bg-gray-700 text-white rounded"
        onChange={(e) => {
          setCpuFilter(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="">All</option>
        <option value="Intel">Intel</option>
        <option value="AMD">AMD</option>
      </select>

      <label className="ml-4">Filter by GPU:</label>
      <select
        className="p-2 bg-gray-700 text-white rounded"
        onChange={(e) => {
          setGpuFilter(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="">All</option>
        <option value="RTX 5080">RTX 5080</option>
        <option value="RTX 5090">RTX 5090</option>
        <option value="GTX 690">GTX 690</option>
      </select>

      <label className="ml-4">Sort by RAM:</label>
      <select
        className="p-2 bg-gray-700 text-white rounded"
        onChange={(e) => {
          setSort(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="">None</option>
        <option value="16GB">16GB First</option>
        <option value="32GB">32GB First</option>
      </select>

      <label className="ml-4">Builds per page:</label>
      <select
        className="p-2 bg-gray-700 text-white rounded"
        value={buildsPerPage}
        onChange={(e) => {
          setBuildsPerPage(parseInt(e.target.value));
          setCurrentPage(1);
        }}
      >
        <option value={3}>3</option>
        <option value={6}>6</option>
        <option value={10}>10</option>
      </select>

      {/* Render Builds */}
      {paginatedBuilds.map((build, index) => {
        const highlight = getHighlight(build.price);
        return (
          <BuildCard
            key={index}
            build={build}
            index={index}
            onDelete={() => handleDelete(index)}
            onUpdate={(updatedBuild) => handleUpdate(index, updatedBuild)}
            highlight={highlight}
          />
        );
      })}

      {/* Trigger Element for Infinite Scroll */}
      <div id="scroll-trigger" className="h-12" />

      {/* GPU Chart */}
      <div className="mt-12">
        <GPUChart key={builds.length} />
      </div>
    </div>
  );
}
