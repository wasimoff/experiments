<script setup lang="ts">
import { ref, type Ref } from 'vue';

// generate some random ID for ourselves
let id = self.crypto.randomUUID().substring(0, 6);

// received messages
type Message = { id: string, date: Date, msg: string };
let messages: Ref<Message[]> = ref([]);

// use two channels to receive our own messages as well
let rxchan = new BroadcastChannel("hello");
let txchan = new BroadcastChannel("hello");
rxchan.addEventListener("message", ev => {
  console.log("received", ev)
  messages.value.push(ev.data as Message);
});

// simple form to send messages
let input = ref("Hello, World!");
function send() {
  if (input.value == "") return;
  txchan.postMessage({ id, date: new Date(), msg: input.value } as Message);
  input.value = "";
};

</script>

<template>
  <h1>BroadcastChannel Chat</h1>
  <p>My ID: <span style="color: green; font-family: monospace;">{{ id }}</span></p>

  <form v-on:submit.prevent>
    <input type="text" v-model="input">
    <button @click="send">send</button>
  </form>

  <!-- {{ messages }} -->
  <div>
    <h2>Messages:</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="message in messages">
          <td :style="{ 'color': message.id === id ? 'green' : 'red' }">{{ message.id }}</td>
          <td>{{ message.date.toISOString() }}</td>
          <td>{{ message.msg }}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<style scoped>

table, td, th {
  border: 1px solid black;
}
th {
  font-weight: bold;
}
th, td {
  padding: 0.2em 1em;
}
td:first-child {
  font-family: monospace;
}

</style>
