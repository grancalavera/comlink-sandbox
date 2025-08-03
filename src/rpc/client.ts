import * as Comlink from "comlink";
import type { RpcContract } from "./types.js";

const worker = new SharedWorker(new URL("./worker.ts", import.meta.url), {
  type: "module",
  name: "shared-worker-network-rpc",
});

worker.port.start();

export const clientId = crypto.randomUUID();
export const rpcClient = Comlink.wrap<RpcContract>(worker.port);

navigator.locks.request(clientId, () => {
  rpcClient.registerClient(clientId);
  return new Promise<void>(() => {});
});
