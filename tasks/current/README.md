# Implement basic RPC system with Comlink

## Description

Create a minimal RPC (Remote Procedure Call) system using Comlink to facilitate communication between SharedWorkers and the main thread. Use a class-based approach with separate binding files for clean separation of concerns.

## Interface Design

Start with a simple `RpcClient` interface containing one operation:

```typescript
interface RpcClient {
  registerClient: () => Promise<void>;
}
```

The worker-side interface is derived using a generic utility type:

```typescript
type RpcWorker = WithIndexedOperations<RpcClient>;
// Results in: { registerClient: (clientId: string) => Promise<void> }
```

## Worker Implementation Details

- Worker abstracts away MessagePort access using UUID-based client registration
- Client UUID is internal implementation detail (hidden from RpcClient interface)
- RpcWorker operations are indexed by clientId parameter to manage multiple clients

## Architecture

### File Structure:

- `src/lib/rpc-types.ts` - Generic `WithIndexedOperations<T>` utility type
- `src/rpc/types.ts` - RpcClient interface and RpcWorker type definition
- `src/rpc/RpcClient.ts` - Main thread RPC client class (business logic)
- `src/rpc/RpcWorker.ts` - Worker thread RPC worker class (business logic)
- `src/rpc/client.ts` - Creates RpcClient instance and Comlink binding (plumbing)
- `src/rpc/worker.ts` - Creates RpcWorker instance and Comlink exposure (plumbing)

This separates business logic (classes) from Comlink plumbing (binding files).

### Constructor Design

**RpcClient class**: Takes a Comlink-wrapped remote directly, avoiding unnecessary abstraction layers.

```typescript
class RpcClient {
  constructor(private remote: Remote<RpcWorker>) {}
}
```

**RpcWorker class**: Plain class with no dependencies, focuses on business logic only.

```typescript
class RpcWorker {
  constructor() {
    // Business logic initialization only
  }
}
```

### Binding File Responsibilities

**client.ts**: Creates SharedWorker, uses Comlink.wrap() on worker.port, passes wrapped remote to RpcClient constructor.

**worker.ts**: Creates RpcWorker instance, uses Comlink.expose() to make it available to clients, handles SharedWorker port connections.

## Checklist

- [ ] Install comlink dependency
- [ ] Create generic `WithIndexedOperations<T>` utility type (`src/lib/rpc-types.ts`)
- [ ] Create RpcClient interface and RpcWorker type definition (`src/rpc/types.ts`)
- [ ] Implement RpcClient class for main thread logic (`src/rpc/RpcClient.ts`)
- [ ] Implement RpcWorker class for worker thread logic (`src/rpc/RpcWorker.ts`)
- [ ] Create client.ts binding file with Comlink connection
- [ ] Create worker.ts binding file with Comlink exposure
- [ ] Update TypeScript configuration for WebWorker lib support
- [ ] Test basic RPC communication between main thread and SharedWorker
