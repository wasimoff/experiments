/// <reference lib="webworker" />
export {};
const worker: SharedWorkerGlobalScope = self as any;

import Work from "./worker?worker&inline";
let w = new Work();
// let w = new Worker(new URL("./worker", import.meta.url), { type: 'module' });
w.postMessage("SHARED SPAWN");

let spawn = new Date();
let latest = spawn;
let counter = 1;

type Connection = { id: number, port: MessagePort }
let ports: Connection[] = [];

type Update = { spawn: Date, latest: Date, id: number, message: string, now: Date };

worker.onconnect = (ev) => {
  const port = ev.ports[0];
  const id = counter++;
  latest = new Date();

  ports.push({ id, port });
  const post = (message: string) => port.postMessage({ spawn, latest, id, now: new Date(), message } as Update);

  const close = () => {
    abort.abort();
    port.close();
    ports.splice(ports.findIndex(p => p.id === id), 1);
  };

  post("HELO");

  let abort = new AbortController();
  let timeout: number;
  function rearm() {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(close, 2000);
  };
  rearm();

  port.addEventListener("message", ({ data }) => {
    if (typeof data !== "string") console.error("not a string", data);
    switch (data) {
      case "pong":
        rearm();
        break;
      case "list":
        rearm();
        post(`have ${ports.length} connections`);
        break;
      case "close":
        close();
        break;
      default:
        break;
    };
  }, { signal: abort.signal });

  port.addEventListener("messageerror", (ev) => {
    console.warn("message error", ev);
  }, { signal: abort.signal });

  port.start();
  setInterval(() => port.postMessage("ping"), 1000);

};