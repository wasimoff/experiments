/// <reference lib="webworker" />
declare var self: SharedWorkerGlobalScope | DedicatedWorkerGlobalScope;
export {};

function pingpong(message: any) {
  console.log("pingpong:", message);
  if (message === "ping") return {
    self: self.constructor.name,
    postMessage: "postMessage" in Object.keys(self),
    reply: "pong",
  };
  throw "invalid ping";
};

console.log("spawned a new worker!");

if (self.constructor.name === "SharedWorkerGlobalScope" && self instanceof SharedWorkerGlobalScope) {
  console.warn("we are shared"); // sharedworker
  let w = self as SharedWorkerGlobalScope;

  w.addEventListener("connect", ({ ports }) => {
    const port = ports[0];
    port.addEventListener("message", ({ data }) => {
      port.postMessage(pingpong(data));
    });
    port.start();
  });

} else if (self.constructor.name === "DedicatedWorkerGlobalScope" && self instanceof DedicatedWorkerGlobalScope) {
  console.warn("we are dedicated"); // normal worker
  let w = self;

  w.addEventListener("message", ({ data }) => {
    w.postMessage(pingpong(data));
  });

} else {

  throw new Error("oops, are we running in a worker at all?")

};