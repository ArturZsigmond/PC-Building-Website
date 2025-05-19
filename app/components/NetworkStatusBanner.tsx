"use client";
import React from "react";


import { useEffect, useState } from "react";
import { getQueue, clearQueue } from "../utils/offlineQueue";

async function syncQueue() {
  const queue = getQueue();

  for (const op of queue) {
    try {
      if (op.type === "add") {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/builds`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(op.data),
        });
      } else if (op.type === "update" && op.id !== undefined) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/builds/${op.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(op.data),
        });
      } else if (op.type === "delete" && op.id !== undefined) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/builds/${op.id}`, {
          method: "DELETE",
        });
      }
    } catch (err) {
      console.error(" Sync failed for", op, err);
      return;
    }
  }

  clearQueue();
}

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [serverUp, setServerUp] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const online = navigator.onLine;
      setIsOnline(online);

      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        setServerUp(res.ok);
        if (online && res.ok) {
          syncQueue(); 
        }
      } catch {
        setServerUp(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);

    window.addEventListener("online", checkStatus);
    window.addEventListener("offline", checkStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", checkStatus);
      window.removeEventListener("offline", checkStatus);
    };
  }, []);

  if (isOnline && serverUp) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {!isOnline && (
        <div className="bg-red-600 text-white text-center p-2">
           No Internet Connection
        </div>
      )}
      {isOnline && !serverUp && (
        <div className="bg-yellow-500 text-black text-center p-2">
           Server is down. Changes will be saved locally.
        </div>
      )}
    </div>
  );
}
