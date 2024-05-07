/// <reference lib="webworker" />
export {};
const worker: WorkerGlobalScope = self as any;

onmessage = ({ data: index }) => {
  console.log("%c Worker ", "background-color: cyan;", `#${index} spawned`);
}