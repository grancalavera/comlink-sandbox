# Proxy RPC Client Registration POC

This POC demonstrates an automatic client registration system using JavaScript Proxy. It ensures that any client implementing the `Registerable` interface will automatically call its `register()` method before executing any other operations.

## Core Concepts

### Registerable Interface

Any client that needs automatic registration must implement:

```typescript
interface Registerable {
  register: () => Promise<void>;
}
```

### Registrar Class

Manages the registration state and ensures registration happens only once:

- Tracks registration status
- Handles concurrent registration attempts
- Provides access to the underlying client

### Auto-Register Proxy

Uses JavaScript Proxy to intercept method calls and automatically trigger registration before executing the actual method.

## Usage

### Simple Usage (Recommended)

```typescript
import { createAutoRegisterProxyFor } from "./registering-proxy";

const client: Client = {
  register: async () => {
    console.log("Registering client...");
    // Registration logic here
  },
  operation1: async () => console.log("Operation 1"),
  operation2: () => console.log("Operation 2"),
  operation3: async (input: string) => input.length,
};

// Create auto-registering proxy
const autoClient = createAutoRegisterProxyFor(client);

// These calls will automatically trigger registration first
await autoClient.operation1(); // Triggers registration, then executes
autoClient.operation2(); // Registration already done, executes directly
const result = await autoClient.operation3("test"); // Returns: 4
```

### Advanced Usage with Registrar

```typescript
import { Registrar, createAutoRegisterProxy } from "./registering-proxy";

const registrar = new Registrar(client);
const proxy = createAutoRegisterProxy(registrar);

// Access registrar for testing/monitoring
console.log("Registration status:", registrar.getRegistrationStatus());
await proxy.operation1();
console.log("Registration status:", registrar.getRegistrationStatus());
```

## Key Features

1. **Automatic Registration**: All method calls (except `register`) automatically trigger registration
2. **Single Registration**: Registration happens only once, even with concurrent calls
3. **Type Safety**: Full TypeScript support with preserved method signatures
4. **Method Preservation**: Both sync and async methods work correctly
5. **Return Value Preservation**: Original return types and values are maintained

## Testing

The POC includes comprehensive tests:

- **Basic functionality**: Verify registration happens automatically
- **Single registration**: Ensure registration only occurs once
- **Method signatures**: Confirm all method types are preserved
- **Concurrent calls**: Test proper handling of simultaneous operations

Run tests:

```typescript
import { runAllTests } from "./registering-proxy-test";
await runAllTests();
```

## Implementation Details

The proxy intercepts all property access on the client object:

1. **Non-functions**: Returned as-is
2. **register method**: Returned directly (no wrapping)
3. **Other methods**: Wrapped to call `ensureRegistered()` first

The `Registrar` class handles the registration lifecycle:

- Prevents duplicate registration attempts
- Manages async registration promises
- Provides status monitoring capabilities

## Use Cases

This pattern is useful for:

- RPC clients that need authentication/handshake before operations
- Service clients requiring initialization
- Any scenario where setup must happen before method execution
- Testing scenarios where registration behavior needs monitoring
