import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

import { wrap } from "comlink";

// ComlinkWorker
const comlink = wrap(new Worker(new URL("@/worker-comlink", import.meta.url), { type: "module" }));

// PlainWorker
const worker = new Worker(new URL("@/worker-plain", import.meta.url), { type: "module" });


const iterations = 10000;
let t0;

// --- serial tests --- //

t0 = performance.now();
for (let i = 0; i < iterations; i++) {
    await comlink.work("Hello, World!");
}
console.log(`Serial, Comlink, ${iterations} iterations took ${performance.now() - t0} ms.`);

let resolver;
let done = new Promise((r) => { resolver = r; });
let abort = new AbortController();
function send(i) { worker.postMessage({ id: i, str: "Hello, World!" }); }
t0 = performance.now();
worker.addEventListener("message", (event) => {
    if (event.data && event.data.id !== null && event.data.str) {
        if (event.data.id < iterations-1) {
            send(event.data.id + 1);
        } else {
            abort.abort("done");
            resolver();
        }
    };
}, { signal: abort.signal });
send(0);
await done;
console.log(`Serial, Plain, ${iterations} iterations took ${performance.now() - t0} ms.`);


// --- parallel tests --- //

t0 = performance.now();
let promises = Array(iterations).fill(null);
for (let i = 0; i < iterations; i++) {
    promises[i] = comlink.work("Hello, World!")
};
await Promise.all(promises);
console.log(`Parallel, Comlink, ${iterations} iterations took ${performance.now() - t0} ms.`);


abort = new AbortController();
let resolvers = Array(iterations).fill(null);
t0 = performance.now();
worker.addEventListener("message", (event) => {
    if (event.data && event.data.id !== null && event.data.str) {
        resolvers[event.data.id]();
    };
}, { signal: abort.signal });
for (let i = 0; i < iterations; i++) {
    promises[i] = new Promise((r) => { resolvers[i] = r; });
    send(i);
};
await Promise.all(promises);
console.log(`Parallel, Plain, ${iterations} iterations took ${performance.now() - t0} ms.`);