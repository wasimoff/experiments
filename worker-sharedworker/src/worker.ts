/// <reference lib="webworker" />
export {};
const worker: WorkerGlobalScope = self as any;

onmessage = ({ data }) => {
  console.log("WORKER", data);
}