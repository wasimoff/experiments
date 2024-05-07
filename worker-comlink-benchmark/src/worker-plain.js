// bare minimum worker, which simply sends the payload back
// mostly kept around as a template for new workers
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

export class PlainWorker {

    // styled prefix for console logging with an orange background
    get prefix() { return [ `%c Worker `, 'background: #00c4a7; color: black;' ]; }

    // the "work" function that is done for every call
    work(str) {
        if (true) console.log(...this.prefix, "plain, work on:", str);
        return str; // NOP
    }

    // return a string array in reverse order
    reverse(str) { return str.reverse(); };

}
let instance = new PlainWorker();

// add a manual listener to reply outside of comlink
addEventListener("message", (event) => {
    if (event.data && event.data.id !== null && event.data.str) {
        let { id, str } = event.data;
        postMessage({ id, str: instance.work(str) });
    };
});