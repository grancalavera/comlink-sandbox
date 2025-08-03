import { atom } from "jotai";
import * as Comlink from "comlink";
import type { RpcContract } from "./types.js";

// Connection states based on the state machine
export type ConnectionState = "idle" | "connected" | "disconnected";

// Base connection state atom
export const connectionStateAtom = atom<ConnectionState>("idle");

// Derived atom for connection status (boolean for compatibility)
export const isConnectedAtom = atom(
  (get) => get(connectionStateAtom) === "connected"
);

// SharedWorker and RPC client setup
const worker = new SharedWorker(new URL("./worker.ts", import.meta.url), {
  type: "module",
  name: "shared-worker-network-rpc",
});

worker.port.start();

export const clientId = crypto.randomUUID();
const rpcClient = Comlink.wrap<RpcContract>(worker.port);

// State transition atom with side effects
export const connectionTransitionAtom = atom(
  (get) => get(connectionStateAtom),
  async (get, set, newState: ConnectionState) => {
    const currentState = get(connectionStateAtom);

    // Only register client on first connection (idle -> connected)
    if (currentState === "idle" && newState === "connected") {
      // Use navigator locks for registration
      navigator.locks.request(clientId, () => {
        rpcClient.registerClient(clientId);
        return new Promise<void>(() => {}); // Keep lock indefinitely
      });
    }

    set(connectionStateAtom, newState);
  }
);

// These functions are not meant to be called directly
// Instead, use the useConnection hook in components
