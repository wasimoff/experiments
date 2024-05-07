// bare minimum worker, which simply sends the payload back
// mostly kept around as a template for new workers
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

import { expose } from "comlink";

export class ComlinkWorker {

    // styled prefix for console logging with an orange background
    get prefix() { return [ `%c Worker `, 'background: #00c4a7; color: black;' ]; }

    // the "work" function that is done for every call
    work(str) {
        if (true) console.log(...this.prefix, "work on:", str);
        return str; // NOP
    }

    // return a string array in reverse order
    reverse(str) { return str.reverse(); };

}
let instance = new ComlinkWorker();

expose(instance);
postMessage({ ready: true });