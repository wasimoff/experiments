<script setup lang="ts">
import { ref } from "vue";
import HelloWorld from './components/HelloWorld.vue'
import { Greeter, workerping } from "../lib/greeting.ts";
const greeter = new Greeter();
const pong = ref();
workerping().then(r => pong.value = r);
</script>

<template>
  <pre>{{ greeter.hello("Browser") }}</pre>
  <pre>pong: {{ pong }}</pre>
  <HelloWorld msg="Deno + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>../lib/greeting.ts
