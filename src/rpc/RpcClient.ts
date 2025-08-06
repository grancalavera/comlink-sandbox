import type { Remote } from 'comlink';
import type { RpcWorker } from './types';
import { generateUUID } from '../utils/uuid';

export class RpcClient {
  private clientId: string;
  private remote: Remote<RpcWorker>;

  constructor(remote: Remote<RpcWorker>) {
    this.remote = remote;
    this.clientId = generateUUID();
  }

  async registerClient(): Promise<void> {
    await this.remote.registerClient(this.clientId);
  }
}