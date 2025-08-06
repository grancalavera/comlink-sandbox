import type { WithIndexedOperations } from '../lib/rpc-types';

export interface RpcClient {
  registerClient: () => Promise<void>;
}

export type RpcWorker = WithIndexedOperations<RpcClient>;