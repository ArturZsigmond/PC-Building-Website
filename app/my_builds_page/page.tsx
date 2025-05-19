"use client";
import React, { useState, useEffect } from "react";
import BuildCard from "../components/BuildCard";
import GPUChart from "../components/GPUChart";
import { addToQueue } from "../utils/offlineQueue";
import { syncOfflineQueue } from "../utils/syncQueue";
import type { Build} from "../types/Build";

export default function MyBuilds() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [cpuFilter, setCpuFilter] = useState<string>("");
  const [gpuFilter, setGpuFilter] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [buildsPerPage, setBuildsPerPage] = useState(3);

  useEffect(() => {
    syncOfflineQueue();
  }, []);

  useEffect(() => {
    const fetchBuilds = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/builds`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        setBuilds(data);
      } catch (err) {
        console.error("Failed to fetch builds", err);
      }
    };

    fetchBuilds();
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
  }, [currentPage, buildsPerPage, sortedBuilds.length, totalPages]);

  useEffect(() => {
   const socket = new WebSocket(`${process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, "ws")}`);


    socket.onmessage = (event) => {
      const newBuild = JSON.parse(event.data);
      setBuilds((prev) => [...prev, newBuild]);
    };

    return () => socket.close();
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/builds/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");
    } catch {
      addToQueue({ type: "delete", id });
      alert("You're offline or the server is down. This delete will sync later.");
    }

    setBuilds(builds.filter((b) => b.id !== id));
  };

  const handleUpdate = async (id: string, updatedBuild: Build) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/builds/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBuild),
      });

      if (!res.ok) throw new Error("Update failed");
    } catch {
      addToQueue({ type: "update", data: updatedBuild, id });
      alert("You're offline or the server is down. This update will sync later.");
    }

    setBuilds((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedBuild } : b))
    );
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

  const paginatedBuilds = sortedBuilds.slice(0, currentPage * buildsPerPage);

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

      {paginatedBuilds.map((build) => {
        const highlight = getHighlight(build.price);
        return (
          <BuildCard
            key={build.id}
            build={build}
            onDelete={() => handleDelete(build.id)}
            onUpdate={(updatedBuild) => handleUpdate(build.id, updatedBuild)}
            highlight={highlight}
          />
        );
      })}

      <div id="scroll-trigger" className="h-12" />
      <div className="mt-12">
        <GPUChart key={builds.length} />
      </div>
    </div>
  );
}
