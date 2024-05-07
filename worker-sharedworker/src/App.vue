<script setup lang="ts">
import { ref } from 'vue';

import { SharedProvider } from './library';
// const SharedProvider = () => import("./library");

// store messages from sharedworker
let message = ref("");

// SharedProvider().then(sp => {
  let shared = new SharedProvider(data => message.value = data);
  setInterval(() => shared.list(), 1000);
// })


</script>

<template>
  <h1>SharedProvider</h1>
  <pre>{{ message }}</pre>
</template>

<style scoped>

</style>
