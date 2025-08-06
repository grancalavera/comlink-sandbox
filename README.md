# Comlink Sandbox

This is a sandbox for experimenting with Comlink, a library for creating remote procedure calls between web workers and the main thread.

## Core Idea

- This application allows to interact between a SharedWorker and the ports connected to it.
- The main goal of the application is to explore techniques to detect when a port has disconnected from the SharedWorker.

## The Application

### Dashboard

- Allows to load client instances.
- Displays information about the system.
- Is the main application and the main vite entry point.

### Client

- Is an additional vite entry point.
- Is loaded into the dashboard using an iframe.

## RPC Architecture

This application implements an RPC (Remote Procedure Call) abstraction layer to facilitate communication between SharedWorkers and the main thread using [Comlink](https://github.com/GoogleChromeLabs/comlink).

### Design Approach

- **Interface-driven**: Communication is specified through TypeScript interfaces that define clear API contracts.
- **Comlink abstraction**: Uses Comlink as the underlying layer for seamless RPC communication between main thread and SharedWorkers.
- **Incremental implementation**: Starting with a simple interface and building up functionality piece by piece.

### Architecture Components

1. **Main Thread Interface**: Defines the API that main thread clients use to communicate with the SharedWorker.
2. **Worker Interface**: Derived interface that specifies the implementation contract for the worker thread.
3. **Client Implementation**: Class implementing the main thread side of the RPC communication.
4. **Remote Implementation**: Class implementing the worker thread side of the RPC communication.

### Current Implementation

Starting with a minimal `RpcClient` interface:

```typescript
interface RpcClient {
  registerClient: () => Promise<void>
}
```

This foundation will be expanded incrementally to support more complex operations as the system evolves.
