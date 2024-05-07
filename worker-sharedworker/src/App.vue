<script setup lang="ts">
import { ref } from 'vue';

// store messages from sharedworker
let message = ref("");

import Shared from "./shared?sharedworker&inline";
// let shared = new SharedWorker(new URL("./shared", import.meta.url), { type: 'module' });
let shared = new Shared();
let port = shared.port;
port.addEventListener("message", ({ data }) => {
  if (data === "ping") {
    port.postMessage("pong");
    return;
  };
  // console.log(data);
  message.value = data;
});
port.start();

setInterval(() => port.postMessage("list"), 1000);

</script>

<template>
  <h1>Hello, World!</h1>
  <pre>{{ message }}</pre>
</template>

<style scoped>

</style>
