<script setup lang="ts">

import { ref } from "vue";
import { decode as dechunker } from "it-length-prefixed";

// run `yarn proto` to recreate from .proto file
import { Writer as pbWriter } from "protobufjs";
import { Counter } from "./messages.js";
import { Encoder, decodeMultiStream, encode, decode } from "@msgpack/msgpack";
// check protobufjs vs. protobuf-es
import { toBinary, fromBinary } from "@bufbuild/protobuf";
import { sizeDelimitedDecodeStream, sizeDelimitedEncode } from "@bufbuild/protobuf/wire";
import { CounterSchema } from "./genpb/messages_pb";

const measure = "https://localhost:4080/measure"
const wsurl = "wss://localhost:4080"
const wturl = "https://localhost:4443"
const certhash = "8a437f3ee80e686fab1bb7d694a22d904be893ce7e7be2f9bf8ee5bfe1bdb25c";
const serverCertificateHashes = [{ algorithm: "sha-256",
value: Uint8Array.from(certhash.match(/../g)!.map(b => parseInt(b, 16))),
}];


// WebSocket + Protobuf
async function benchWebsocketProtobufjs() {

  const conn = new WebSocket(`${wsurl}/websocket/protobuf?key=websocket/protobufjs`, []);
  conn.binaryType = "arraybuffer";
  conn.addEventListener("open", ev => console.debug("connected", (<any>ev.target).url));
  const done = new Promise<void>(done => conn.addEventListener("close", ev => {
    console.debug("closed", (<any>ev.target).url); done();
  }));
  // counter benchmark, just reply with the enclosed counter + 1
  conn.addEventListener("message", async ev => {
    if (ev.data instanceof ArrayBuffer) {
      const counter = Counter.decode(new Uint8Array(ev.data));
      counter.seq += 1; // increment in-place
      conn.send(Counter.encode(counter).finish());
    };
  });
  return done;

};
async function benchWebsocketProtobufES() {

  const conn = new WebSocket(`${wsurl}/websocket/protobuf?key=websocket/protobuf-es`, []);
  conn.binaryType = "arraybuffer";
  conn.addEventListener("open", ev => console.debug("connected", (<any>ev.target).url));
  const done = new Promise<void>(done => conn.addEventListener("close", ev => {
    console.debug("closed", (<any>ev.target).url); done();
  }));
  // counter benchmark, just reply with the enclosed counter + 1
  conn.addEventListener("message", async ev => {
    if (ev.data instanceof ArrayBuffer) {
      const counter = fromBinary(CounterSchema, new Uint8Array(ev.data));
      counter.seq += BigInt(1); // increment in-place
      conn.send(toBinary(CounterSchema, counter));
    };
  });
  return done;

};

// WebSocket + JSON
async function benchWebsocketJson() {

  const conn = new WebSocket(`${wsurl}/websocket/json`, []);
  conn.binaryType = "arraybuffer";
  conn.addEventListener("open", ev => console.debug("connected", (<any>ev.target).url));
  const done = new Promise<void>(done => conn.addEventListener("close", ev => {
    console.debug("closed", (<any>ev.target).url); done();
  }));
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

// WebSocket + MessagePack
async function benchWebsocketMessagepack() {

  const conn = new WebSocket(`${wsurl}/websocket/messagepack`, []);
  conn.binaryType = "arraybuffer";
  conn.addEventListener("open", ev => console.debug("connected", (<any>ev.target).url));
  const done = new Promise<void>(done => conn.addEventListener("close", ev => {
    console.debug("closed", (<any>ev.target).url); done();
  }));
  // counter benchmark, just reply with the enclosed counter + 1
  conn.addEventListener("message", async ev => {
    if (ev.data instanceof ArrayBuffer) {
      const counter = decode(ev.data) as { Seq: number, Noise: Uint8Array };
      counter.Seq += 1; // increment in-place
      conn.send(encode(counter));
    };
  });
  return done;

};

// WebTransport + Protobuf
async function benchWebtransportProtobufjs() {

  const url = `${wturl}/webtransport/protobuf?key=webtransport/protobufjs`;
  const conn = new WebTransport(url, { serverCertificateHashes });
  await conn.ready; console.debug("connected", url);
  conn.closed.catch(() => {}).finally(() => console.debug("closed", url));

  try {
    // accept a bidirectional stream for benchmark
    for await (const s of conn.incomingBidirectionalStreams as any) {
      const stream: WebTransportBidirectionalStream = s;
      const writer = stream.writable.getWriter();
      const pbw = new pbWriter();
      // for await (const chunk of dechunker.fromReader(itreader(stream.readable as any))) {
      for await (const chunk of dechunker(stream.readable as unknown as AsyncIterable<Uint8Array>)) {
        const counter = Counter.decode(chunk.slice());
        if (counter.seq == undefined || Number.isNaN(counter.seq)) counter.seq = 0;
        counter.seq += 1; // increment in-place
        pbw.reset(); Counter.encodeDelimited(counter, pbw);
        writer.write(pbw.finish());
      }
    }
  } catch { };
};

async function benchWebtransportProtobufES() {

  const url = `${wturl}/webtransport/protobuf?key=webtransport/protobuf-es`;
  const conn = new WebTransport(url, { serverCertificateHashes });
  await conn.ready; console.debug("connected", url);
  conn.closed.catch(() => {}).finally(() => console.debug("closed", url));

  try {
    // accept a bidirectional stream for benchmark
    for await (const s of conn.incomingBidirectionalStreams as any) {
      const stream: WebTransportBidirectionalStream = s;
      const writer = stream.writable.getWriter();
      for await (const counter of sizeDelimitedDecodeStream(CounterSchema, stream.readable as any)) {
        if (counter.seq == undefined || Number.isNaN(counter.seq)) counter.seq = BigInt(0);
        counter.seq += BigInt(1); // increment in-place
        writer.write(sizeDelimitedEncode(CounterSchema, counter));
      }
    }
  } catch { };
};

// WebTransport + Messagepack
async function benchWebtransportMessagepack() {

  const url = `${wturl}/webtransport/messagepack`;
  const conn = new WebTransport(url, { serverCertificateHashes });
  await conn.ready; console.debug("connected", url);
  conn.closed.catch(() => {}).finally(() => console.debug("closed", url));

  try {
    // accept a bidirectional stream for benchmark
    for await (const s of conn.incomingBidirectionalStreams as any) {
      const stream: WebTransportBidirectionalStream = s;
      const writer = stream.writable.getWriter();
      const msgpack = new Encoder({ useBigInt64: true, initialBufferSize: 65536 });
      for await (const chunk of decodeMultiStream(stream.readable)) {
        let counter = chunk as { Seq: number, Noise: Uint8Array };
        if (counter.Seq == undefined || Number.isNaN(counter.Seq)) counter.Seq = 0;
        counter.Seq += 1; // increment in-place
        writer.write(msgpack.encode(counter));
      };
    }
  } catch { };
};

// run the benchmarks
const countTo = ref(200);
const addNoise = ref(0);
const results = ref<Awaited<ReturnType<typeof benchmark>>[]>([]);
async function benchmark(count = countTo.value, noise = addNoise.value) {

  let delay = async () => new Promise(r => setTimeout(r, 100));
  await fetch(`${measure}/new?count=${count}&noise=${noise}`); await delay();

  // await benchWebsocketJson(); await delay();
  // await benchWebsocketMessagepack(); await delay();
  await benchWebsocketProtobufjs(); await delay();
  await benchWebsocketProtobufES(); await delay();
  // await benchWebtransportMessagepack(); await delay();
  await benchWebtransportProtobufjs(); await delay();
  await benchWebtransportProtobufES(); await delay();

  let res = await fetch(`${measure}/dump`);
  return await res.json() as {
    addNoise: number,
    countTo: number,
    "ws+json": number,
    "ws+msgp": number,
    "ws+proto": number,
    "wt+msgp": number,
    "wt+proto": number,
  };
};
(globalThis as any).benchmark = benchmark;

// called from button
async function benchy() {
  results.value.unshift(await benchmark());
};

// run combinations from browser console
async function benchmatrix(args: [number, number][], repetitions: number) {
  let results: Awaited<ReturnType<typeof benchmark>>[] = [];
  let start = new Date();
  for await (let [c, n] of args) {
    for (let i = 0; i < repetitions; i++) {
      console.log(`benchmark(count: ${c}, noise: ${n}) (${i})`);
      results.push(await benchmark(c, n));
      await new Promise(r => setTimeout(r, 200));
    };
  };
  return { start, args, repetitions, wturl, wsurl, results };
}
(globalThis as any).benchmatrix = benchmatrix;

</script>

<template>
  <h1>Hello, World!</h1>
  Open the console and push the button to start.
  <p>
    countTo:
    <input type="number" v-model="countTo" name="Count">
  </p>
  <p>
    addNoise:
    <input type="number" v-model="addNoise" name="Count"> bytes
  </p>
  <button @click="benchy">run benchmarks</button>
  <pre>{{ results }}</pre>
</template>

<style scoped>

</style>
