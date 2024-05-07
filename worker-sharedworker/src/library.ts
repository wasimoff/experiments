import Worker from "./shared?sharedworker&inline";

export class SharedProvider {

  private worker = new Worker();
  // private worker = new SharedWorker(new URL("./shared", import.meta.url), { type: 'module' });

  private listener: (s: string) => void;

  constructor(fn: (s: string) => void) {
    const port = this.worker.port;
    this.listener = fn;
    port.addEventListener("message", ({ data }) => {
      if (data === "ping") port.postMessage("pong");
      else if (this.listener) this.listener(data as string);
    });
    port.start();
  };

  public list() {
    this.worker.port.postMessage("list");
  };

}