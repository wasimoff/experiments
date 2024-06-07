import Shared from "./shared?sharedworker&inline";
import { type EventMessages, EventMessageTypes } from "./shared";
import { Observable } from "observable-fns";

export class SharedProvider {

  // create inline sharedworker
  private worker = new Shared();
  // private worker = new SharedWorker(new URL("./shared", import.meta.url), { type: 'module' });

  get events() {
    return new Observable<EventMessages>(subscriber => {
      this.worker.port.addEventListener("message", ({ data }: { data: EventMessages }) => {
        if (EventMessageTypes.includes(data.type)) subscriber.next(data);
      });
      this.worker.port.start();
    });
  }

  constructor() {
    // handle ping-pong immediately
    this.worker.port.addEventListener("message", ({ data }: { data: EventMessages }) => {
      if (!EventMessageTypes.includes(data.type)) console.debug("unknown message type:", data);
    });
  };

  // ask the worker to send us a list of connections
  public list() { this.worker.port.postMessage("connections"); };
  
  // send keepalives to the worker
  public keepalive() { this.worker.port.postMessage("keepalive"); };

  // send close message to the worker
  public close() { this.worker.port.postMessage("close"); };

}


