import type { WithIndexedOperations } from "../lib/rpc-types";

export interface Registerable {
  register: () => Promise<void>;
}

export interface RpcClient {
  registerClient: () => Promise<void>;
  ping: () => Promise<string>;
  getStatus: () => Promise<{ clientId: string; connected: boolean }>;
}

export type RpcWorker = WithIndexedOperations<RpcClient>;
