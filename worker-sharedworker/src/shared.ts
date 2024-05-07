/// <reference lib="webworker" />
export {};
const worker: SharedWorkerGlobalScope = self as any;

const now = () => new Date().toLocaleString();

// ---- initialize shared worker ---- //

const prefix = [ "%c SharedWorker ", "background-color: violet;" ];

// time of inception
const spawned = now();
console.log(...prefix, "spawned at", spawned);

// keep references to open tabs
const connections: { id: number, time: string, port: MessagePort }[] = [];
let conn_index = 1;
worker.onconnect = (ev) => {

  // track connection
  const port = ev.ports[0];
  const id = conn_index++;
  const time = now();
  connections.push({ id, time, port });
  console.log(...prefix, "new connection", { id, time });

  // shorthand to send messages
  const message = (message: any) => port.postMessage({ id, spawned, now: now(), message });
  message("Hello, World!");

  // close this port
  const close = () => { ctx.abort(); port.close(); connections.splice(connections.findIndex(p => p.id === id), 1); };

  // add a listener with keepalive timeout
  const ctx = new AbortController();
  let timer: number;
  const keepalive = () => { if (timer) clearTimeout(timer); timer = setTimeout(close, 2000); };
  keepalive();

  port.addEventListener("message", ({ data }) => {
    if (typeof data !== "string") console.error("not a string", data);
    keepalive();
    if (data === "list") message({ "connections": connections.reduce((acc, c) => Object.assign(acc, { [c.id]: c.time }), { }) });
    if (data === "close") close();
  }, { signal: ctx.signal });

  port.start();
  setInterval(() => port.postMessage("ping"), 1000);

};


// ---- spawn worker pool ---- //

import Worker from "./worker?worker&inline";
// let w = new Worker(new URL("./worker", import.meta.url), { type: 'module' });
let workers = [];
for (let index = 0; index < Math.ceil(navigator.hardwareConcurrency/4); index++) {
  let w = new Worker();
  w.postMessage(index);
  workers.push(w);
}