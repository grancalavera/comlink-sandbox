import type { Remote } from "comlink";
import type { RpcWorker, Registerable } from "./types";
import { generateUUID } from "../utils/uuid";

export class RpcClient implements Registerable {
  private clientId: string;
  private remote: Remote<RpcWorker>;

  constructor(remote: Remote<RpcWorker>) {
    this.remote = remote;
    this.clientId = generateUUID();
  }

  async register(): Promise<void> {
    await this.remote.registerClient(this.clientId);
  }

  async registerClient(): Promise<void> {
    return this.register();
  }

  async ping(): Promise<string> {
    return `pong from client ${this.clientId}`;
  }

  async getStatus(): Promise<{ clientId: string; connected: boolean }> {
    return {
      clientId: this.clientId,
      connected: true,
    };
  }
}
