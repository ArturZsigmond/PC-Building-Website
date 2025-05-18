const QUEUE_KEY = "offlineQueue";

export type OperationType = "add" | "update" | "delete";

export interface BuildData {
  processor: string;
  ram: string;
  gpu: string;
  case: string;
}

export interface QueuedOperation {
  type: OperationType;
  data?: BuildData;
  id?: string;
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
