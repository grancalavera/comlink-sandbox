import * as Comlink from 'comlink';
import { RpcClient } from './RpcClient';
import type { RpcWorker } from './types';

const worker = new SharedWorker(new URL('./worker.ts', import.meta.url), {
  type: 'module',
});

const remote = Comlink.wrap<RpcWorker>(worker.port);

export const rpcClient = new RpcClient(remote);