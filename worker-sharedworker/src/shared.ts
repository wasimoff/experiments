/// <reference lib="webworker" />
export {};
const worker: SharedWorkerGlobalScope = self as any;

// ---- initialize shared worker ---- //

function now() { return new Date().toLocaleString(); };
const prefix = [ "%c SharedWorker ", "background-color: violet;" ];

// time of inception
const spawned = now();
console.log(...prefix, "spawned at", spawned);

// keep references to open tabs
type TabConnection = { id: number, established: string, port: MessagePort };
const connections: TabConnection[] = [];
let connectionCounter = 1;

// serialize connections for sending in a message
function serializeConnections(): { [id: number]: string } {
  return connections.reduce((conns, c) => Object.assign(conns, { [c.id]: c.established }), { });
};

// send well-formatted messages on the port
function post(port: MessagePort, type: EventMessageTypes, payload: PayloadType<typeof type>) {
  port.postMessage({ type, payload });
};

// send messages to all open ports
function broadcast(type: EventMessageTypes, payload: PayloadType<typeof type>) {
  for (let conn of connections) post(conn.port, type, payload);
};


// for each opened connection ...
worker.onconnect = (ev) => {

  // track this connection
  const port = ev.ports[0];
  const id = connectionCounter++;
  let conn: TabConnection = { id, port, established: now() };
  connections.push(conn);
  console.log(...prefix, "New Connection:", conn);

  // greetings, this message must not be lost
  post(port, "hello", "world");
  post(port, "connection", { id, now: now(), spawned, connections: serializeConnections() });
  broadcast("connections", serializeConnections());

  // function to close this port
  const ctx = new AbortController();
  function close() {
    if (timeout) clearTimeout(timeout);
    connections.splice(connections.findIndex(p => p.id === id), 1);
    ctx.abort(); port.close();
    broadcast("connections", serializeConnections());
  };
  
  // add a listener with keepalive timeout
  let timeout: number;
  function keepalive(ms: number = 2000) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      close();
      console.error(...prefix, `port ${id} timed out!`)
    }, ms);
  };
  port.addEventListener("message", ({ data }) => {
    if (data === "keepalive") keepalive();
  });

  // handle incoming messages
  port.addEventListener("message", ({ data }) => {
    switch (data) {
      case "keepalive":
        keepalive();
        break;

      case "connections":
        keepalive();
        post(port, "connection", { id, now: now(), spawned, connections: serializeConnections() });
        break;

      case "close":
        close();
        broadcast("connections", serializeConnections());
        break;

      default:
        break;
    };
  }, { signal: ctx.signal });
  port.start();

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

// ---- typings for messages ---- //

export type EventMessage<K, T> = { type: K, payload: T };
export type EventMessages = EvmConnection | EvmConnectionBroastcast | EvmHelloWorld;

// type-checked payload type to a specific type key
type PayloadType<T> = EventMessages extends { type: T, payload: infer P } ? P : never;

// type-checked list of possible type keys
export type EventMessageTypes = EventMessages extends { type: infer k } ? k : never;
export const EventMessageTypes: EventMessageTypes[] = [
  "connection", "connections", "hello"
] as const;

export type EvmHelloWorld = EventMessage<"hello", "world">;

export type EvmConnection = EventMessage<"connection", {
  id: number, spawned: string, now: string, connections: ReturnType<typeof serializeConnections>
}>;

export type EvmConnectionBroastcast = EventMessage<"connections", ReturnType<typeof serializeConnections>>;