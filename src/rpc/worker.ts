import * as Comlink from 'comlink';
import { RpcWorker } from './RpcWorker';

const rpcWorker = new RpcWorker();

declare const self: SharedWorkerGlobalScope;

self.addEventListener('connect', (event) => {
  const port = event.ports[0];
  Comlink.expose(rpcWorker, port);
});