import { Greeter } from "../frontend/lib/greeting.ts";

const g = new Greeter();
console.log(g.hello("Deno"));

import { workerping } from "../frontend/lib/greeting.ts";
console.log("pong:", await workerping());