const QUEUE_KEY = "offlineQueue";

export type OperationType = "add" | "update" | "delete";

export interface QueuedOperation {
  type: OperationType;
  data?: any;         
  index?: number;
}

export function addToQueue(operation: QueuedOperation) {
  if (!operation || !operation.type || (operation.type !== "delete" && !operation.data)) {
    console.warn("Invalid operation, not queued:", operation);
    return;
  }

  const queue = getQueue();
  queue.push(operation);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}


export function getQueue(): QueuedOperation[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}
