<script setup lang="ts">

import { ref } from "vue";
import { reader as itreader } from "it-reader";
import { decode as dechunker, encode as chunker } from "it-length-prefixed";

// run `yarn proto` to recreate from .proto file
import { Writer } from "protobufjs";
import { Counter } from "./messages.js";
import { decodeMultiStream, Encoder as MessagePackEncoder } from "@msgpack/msgpack";

const messages = ref<string[]>([]);

// WebSocket bench: protobuf
async function benchWebsocketProto() {

  const conn = new WebSocket("wss://localhost:4080/websocket/bench/proto", []);
  conn.addEventListener("open", ev => console.log("WebSocket connected", ev));
  const done = new Promise<void>(done => {
    conn.addEventListener("close", ev => {
      console.log("WebSocket closed", ev);
      done();
    });
  });

  // counter benchmark, just reply with the enclosed counter + 1
  conn.addEventListener("message", async ev => {
    if (ev.data instanceof Blob) {
      const counter = Counter.decode(new Uint8Array(await ev.data.arrayBuffer()));
      counter.seq += 1; // increment in-place
      conn.send(Counter.encode(counter).finish());
    };
  });
  return done;

};

// WebSocket bench: json
async function benchWebsocketJson() {

const conn = new WebSocket("wss://localhost:4080/websocket/bench/json", []);
conn.addEventListener("open", ev => console.log("WebSocket connected", ev));
const done = new Promise<void>(done => {
    conn.addEventListener("close", ev => {
      console.log("WebSocket closed", ev);
      done();
    });
  });

  // counter benchmark, just reply with the enclosed counter + 1
  conn.addEventListener("message", async ev => {
    if (typeof ev.data == "string") {
      const counter = JSON.parse(ev.data);
      if (counter.seq == undefined || Number.isNaN(counter.seq)) counter.seq = 0;
      counter.seq += 1; // increment in-place
      conn.send(JSON.stringify(counter));
    };
  });
  return done;

};

// WebTransport
const certhash = "67bff5aa00658e343b7e2d157b9860472749a9f8633555c1bcd80e925e309404";
async function benchWebtransportProto() {

  const conn = new WebTransport("https://localhost:4443/webtransport/bench/proto", {
    serverCertificateHashes: [{
      algorithm: "sha-256",
      value: Uint8Array.from(certhash.match(/../g)!.map(b => parseInt(b, 16))),
    }],
  });
  await conn.ready;
  console.log("connected to webtransport", conn)
  conn.closed.then(() => console.log("webtransport closed"));

  for await (const s of conn.incomingBidirectionalStreams as any) {
    let stream: WebTransportBidirectionalStream = s;
    console.log("BidirectionalStream opened", stream);
    let writer = stream.writable.getWriter();
    for await (const chunk of dechunker.fromReader(itreader(stream.readable as any))) {
      const counter = Counter.decode(chunk.slice());
      if (counter.seq == undefined || Number.isNaN(counter.seq)) counter.seq = 0;
      counter.seq += 1; // increment in-place
      let w = new Writer();
      Counter.encodeDelimited(counter, w);
      writer.write(w.finish());
    }
  }
  
};

async function benchWebtransportMessagepack() {

const conn = new WebTransport("https://localhost:4443/webtransport/bench/msgp", {
  serverCertificateHashes: [{
    algorithm: "sha-256",
    value: Uint8Array.from(certhash.match(/../g)!.map(b => parseInt(b, 16))),
  }],
});
await conn.ready;
console.log("connected to webtransport", conn)
conn.closed.then(() => console.log("webtransport closed"));

for await (const s of conn.incomingBidirectionalStreams as any) {
  let stream: WebTransportBidirectionalStream = s;
  console.log("BidirectionalStream opened", stream);
  const msgpack = new MessagePackEncoder({ useBigInt64: true, initialBufferSize: 65536 });
  let writer = stream.writable.getWriter();
  for await (const m of decodeMultiStream(stream.readable)) {
    let message: { Seq: number, Noise: Uint8Array } = m as any;
    if (message.Seq == undefined || Number.isNaN(message.Seq)) message.Seq = 0;
    message.Seq += 1; // increment in-place
    writer.write(msgpack.encode(message));
  };
}

};

// run both after another
(async () => {
  await benchWebsocketProto();
  await benchWebsocketJson();
  try { await benchWebtransportProto(); } catch {};
  try { await benchWebtransportMessagepack(); } catch {};
})();


</script>

<template>
  <h1>Hello, World!</h1>
  <ul>
    <li v-for="m of messages">{{ m }}</li>
  </ul>
</template>

<style scoped>

</style>
