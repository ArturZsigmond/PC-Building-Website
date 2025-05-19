import { getQueue, clearQueue, QueuedOperation } from "./offlineQueue";


export async function syncOfflineQueue() {
  const queue = getQueue();
  if (!queue.length) return;

  const token = localStorage.getItem("token");
  if (!token) return;

  const remainingQueue: QueuedOperation[] = [];

  for (const op of queue) {
    try {
      if (op.type === "add") {
        await fetch("{process.env.NEXT_PUBLIC_API_URL}/api/builds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(op.data),
        });
      } else if (op.type === "update" && op.id !== undefined) {
        await fetch(`{process.env.NEXT_PUBLIC_API_URL}/api/builds/${op.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(op.data),
        });
      } else if (op.type === "delete" && op.id !== undefined) {
        await fetch(`{process.env.NEXT_PUBLIC_API_URL}/api/builds/${op.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
} catch (err) {
  console.warn("Offline queue sync failed", err, op);
  remainingQueue.push(op);
}

  }

  // Store any operations that failed again
  if (remainingQueue.length) {
    localStorage.setItem("offlineQueue", JSON.stringify(remainingQueue));
  } else {
    clearQueue();
  }
}
