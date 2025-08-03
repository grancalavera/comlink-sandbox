import * as Comlink from "comlink";
import type { RpcContract } from "./types.js";

declare const self: SharedWorkerGlobalScope;

class ComlinkWorker implements RpcContract {
  registerClient(clientId: string): void {
    console.log(`Worker registered client: ${clientId}`);
    navigator.locks.request(clientId, async () => {
      console.log(`Worker client closed: ${clientId}`);
    });
  }

  async echo(message: string): Promise<string> {
    console.log(`Worker received: ${message}`);
    return `WORKER: ${message}`;
  }
}

const api = new ComlinkWorker();

self.addEventListener("connect", (event) => {
  const port = event.ports[0];
  port.start();
  Comlink.expose(api, port);
});
