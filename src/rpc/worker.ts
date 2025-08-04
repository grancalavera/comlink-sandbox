import * as Comlink from "comlink";
import type { RpcContract, Observer, Subscription } from "./types.js";

declare const self: SharedWorkerGlobalScope;

class ComlinkWorker implements RpcContract {
  private counter = 0;
  private subscribers = new Set<string>();
  private callbacks = new Map<string, Observer<number>>();
  private intervalId: ReturnType<typeof setInterval> | null = null;

  registerClient(clientId: string): void {
    console.log(`Worker registered client: ${clientId}`);
    navigator.locks.request(clientId, async () => {
      console.log(`Worker client closed: ${clientId}`);
      // Auto-cleanup subscriptions on disconnect
      this.unsubscribe(clientId);
    });
  }

  async echo(message: string): Promise<string> {
    console.log(`Worker received: ${message}`);
    return `WORKER: ${message}`;
  }

  getCounterValue(): number {
    return this.counter;
  }

  subscribe(clientId: string, observer: Observer<number>): Subscription {
    this.subscribers.add(clientId);
    this.callbacks.set(clientId, observer);

    // Start counter if first subscriber
    if (this.subscribers.size === 1) {
      this.startCounter();
    }

    const subscription = {
      unsubscribe: () => this.unsubscribe(clientId)
    };

    return Comlink.proxy(subscription);
  }

  private unsubscribe(clientId: string): void {
    this.subscribers.delete(clientId);
    this.callbacks.delete(clientId);

    // Stop counter if no subscribers left
    if (this.subscribers.size === 0) {
      this.stopCounter();
    }
  }

  private startCounter(): void {
    if (this.intervalId !== null) return;

    this.intervalId = setInterval(() => {
      this.counter++;
      this.notifyAllSubscribers();
    }, 1000);
  }

  private stopCounter(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private notifyAllSubscribers(): void {
    for (const [clientId, observer] of this.callbacks) {
      try {
        observer.next(this.counter);
      } catch (error) {
        console.error(`Failed to notify subscriber ${clientId}:`, error);
        observer.error?.(error);
        // Auto-cleanup failed subscribers
        this.unsubscribe(clientId);
      }
    }
  }
}

const api = new ComlinkWorker();

self.addEventListener("connect", (event) => {
  const port = event.ports[0];
  port.start();
  Comlink.expose(api, port);
});
