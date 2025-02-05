#!/usr/bin/env -S deno run --allow-ffi --allow-env

// polyfill the WebRTC API
import webrtc from 'webrtc-polyfill';
for (const [k, fn] of Object.entries(webrtc)) if (k !== "default") globalThis[k] ??= fn;

// import the simple-peer wrapper
import SimplePeer from "simple-peer";

// are we initiator or not?
let args: string[] = globalThis["Deno"].args;
const init = args.length >= 1 && args[0] === "init";
console.log("Initiator:", init);
if (!init) console.log("Hint: use 'init' as first argument for initiator.");

const peer = new SimplePeer({
  initiator: init,
  trickle: false, // wait for a single offer
  objectMode: true,
});

// wrap signalling offer in a promise
const signal = new Promise<void>(resolve => peer.on("signal", data => {
  console.log(JSON.stringify(data));
  resolve();
}));

// wrap connection success in a promise
const connected = new Promise<void>(resolve => peer.on("connect", () => {
  console.log("Established channel:", peer.channelName);
  resolve();
}));

// print errors and received messages immediately
peer.on("error", err => console.error("ERROR:", err));
peer.on("data", data => console.log(`${peer.remoteAddress} says:`, data));

// parse other peer's offer
function incoming() {
  const offer = prompt("Enter other peer's offer:");
  if (offer === null) throw "Need an offer!";
  offer.split("\n").forEach(line => peer.signal(JSON.parse(line)));
  console.log("OK");
}

// if we're the initiator, wait for the offer to print before reading
if (init) await signal;

// read other peer's offer
incoming();

// await connection and start chatting
await connected;
setInterval(() => peer.send(String(new Date())), 5000);
