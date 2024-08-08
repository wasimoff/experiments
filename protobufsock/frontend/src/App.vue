<script setup lang="ts">

import { ref } from "vue";
import { reader as itreader } from "it-reader";
import { decode as dechunker } from "it-length-prefixed";
import { Envelope, HelloRequest } from "./messages.js";

const messages = ref<string[]>([]);

// WebSocket
(async () => {

  const conn = new WebSocket("wss://localhost:4080/websocket", []);
  conn.addEventListener("open", ev => console.log("WebSocket connected", ev));
  conn.addEventListener("close", ev => console.log("WebSocket closed", ev));

  conn.addEventListener("message", async ev => {
    if (ev.data instanceof Blob) {
      const letter = Envelope.decode(new Uint8Array(await ev.data.arrayBuffer()));
      const request = HelloRequest.decode(letter.payload?.value as Uint8Array)
      messages.value = [
        `chunk received: { id: ${letter.id}, type: ${letter.type}, payload: ${JSON.stringify(request)} }`,
        ...messages.value.slice(0, 2),
      ];
    }
    ev.data
    console.log("message received", ev)
    // ev.ty
  })

})();

// WebTransport
(async () => {

  const certhash = "5bd358175650b15d8eac6f61933b719f52b8f080d1864ab4bf78bc8c5507ec87";
  const conn = new WebTransport("https://localhost:4443/webtransport", {
    serverCertificateHashes: [{
      algorithm: "sha-256",
      value: Uint8Array.from(certhash.match(/../g)!.map(b => parseInt(b, 16))),
    }],
    requireUnreliable: true,
  });
  await conn.ready;
  messages.value.push("Connected to WebTransport!");

  for await (const s of conn.incomingBidirectionalStreams as any) {
    let stream: WebTransportBidirectionalStream = s;
    console.log(stream.readable)
    // wrap in it-reader and varint chunker
    for await (const chunk of dechunker.fromReader(itreader(stream.readable as any))) {
      // console.log(chunk);
      const letter = Envelope.decode(chunk.slice());
      const request = HelloRequest.decode(letter.payload?.value as Uint8Array)
      messages.value = [
        `chunk received: { id: ${letter.id}, type: ${letter.type}, payload: ${JSON.stringify(request)} }`,
        ...messages.value.slice(0, 2),
      ];
      console.log(letter, request);
    }

  }
  
})//();

</script>

<template>
  <h1>Hello, World!</h1>
  <ul>
    <li v-for="m of messages">{{ m }}</li>
  </ul>
</template>

<style scoped>

</style>
