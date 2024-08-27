// very simple class, just to have something to import
export class Greeter {
  hello(name: string) { return `Hello, ${name}!`; };
};

export function workerping() {

  if (window["SharedWorker"] !== undefined) {

    const worker = new SharedWorker(new URL("./worker.ts", import.meta.url), { type: "module" });
    const promise = new Promise(resolve => {
      worker.port.addEventListener("message", ({ data }) => {
        resolve(data);
      }, { once: true });
      worker.port.start();
    });
    worker.port.postMessage("ping");
    return promise;

  } else {

    const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    const promise = new Promise(resolve => {
      worker.addEventListener("message", ({ data }) => {
        resolve(data);
      }, { once: true });
    });
    worker.postMessage("ping");
    return promise;

  };

};