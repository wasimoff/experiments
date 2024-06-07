<script setup lang="ts">
import { ref } from 'vue';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

import { SharedProvider } from './library';
// const SharedProvider = () => import("./library");

// store messages from sharedworker
let hello = ref("");
let message = ref({});
let connections = ref({});

const shared = new SharedProvider();
shared.events.subscribe(event => {
  switch (event.type) {
    case "connection":
      message.value = {
        "your_id": event.payload.id,
        "worker_spawned": event.payload.spawned,
        "now": event.payload.now,
      };
      break;

    case "connections":
      connections.value = event.payload;
      break;
  
    case "hello":
      hello.value = "Hello, World!";
      break;

    default:
      break;
  };
});

setInterval(() => shared.list(), 1000);
setInterval(() => shared.keepalive(), 1000);

window.addEventListener("beforeunload", () => shared.close());


</script>

<template>
  <h1>SharedProvider</h1>
  <pre>{{ hello }}</pre>
  <pre>{{ message }}</pre>
  Other Connections:
  <pre>{{ connections }}</pre>
</template>

<style scoped>

</style>
