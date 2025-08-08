# Proxy RPC client registration POC

## Description

Imagine I have a typescript interface:

```typescript
interface Client {
  register: () => Promise<void>;
  operation1: () => Promise<void>;
  operation2: () => void;
  operation3: (foo: string) => Promise<number>;
}
```

I want to build a class that:

- Takes an instance of that interface, lets name it client
- Implements that interface itself mechanically using a Proxy
- Using the proxy, automatically calls `client.register()` on every method call (except register) , awaits for the promise to resolve, then calls the underlying method of the same name in `client.register()` and returns the whatever that method returns.

I don't want to have to replicate all the methods, I want to use a https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy to do that work for me. So that I can pass different implementations of interfaces that all implement this:

```typescript
interface Registerable {
  register: () => Promise<void>;
}
```

And I don't have to write the proxies by hand.


Reference implementation made by one of your siblings:

```typescript
interface Registerable {
  register: () => Promise<void>
}

class Registrar<T extends Registerable> {
  private registerPromise: Promise<void> | null = null
  private isRegistered = false
  private client: T

  constructor(client: T) {
    this.client = client
  }

  async ensureRegistered(): Promise<void> {
    if (this.isRegistered) return
    
    if (this.registerPromise) {
      await this.registerPromise
      return
    }
    
    this.registerPromise = this.client.register()
    await this.registerPromise
    this.isRegistered = true
  }

  getClient(): T {
    return this.client
  }

  getRegistrationStatus(): boolean {
    return this.isRegistered
  }

  getRegistrationPromise(): Promise<void> | null {
    return this.registerPromise
  }
}

function createAutoRegisterProxy<T extends Registerable>(
  registrar: Registrar<T>
): T {
  const client = registrar.getClient()

  return new Proxy(client, {
    get(target, prop: string | symbol) {
      const value = target[prop as keyof T]
      
      // If it's not a function, return as-is
      if (typeof value !== 'function') {
        return value
      }
      
      // If it's the register method, return it directly
      if (prop === 'register') {
        return value
      }
      
      // For all other methods, wrap them to ensure registration
      return async function(...args: any[]) {
        await registrar.ensureRegistered()
        return value.apply(target, args)
      }
    }
  }) as T
}

// Convenience function for the common case
function createAutoRegisterProxyFor<T extends Registerable>(client: T): T {
  return createAutoRegisterProxy(new Registrar(client))
}

// Example interfaces
interface Client extends Registerable {
  register: () => Promise<void>
  operation1: () => Promise<void>
  operation2: () => void
  operation3: (foo: string) => Promise<number>
}

// Unit test examples
class MockRegistrar<T extends Registerable> extends Registrar<T> {
  public ensureRegisteredCallCount = 0
  public mockRegistered = false

  async ensureRegistered(): Promise<void> {
    this.ensureRegisteredCallCount++
    if (this.mockRegistered) return
    
    // For testing, we can control when registration happens
    await super.ensureRegistered()
    this.mockRegistered = true
  }
}

// Example usage and testing
async function example() {
  console.log('--- Standard Usage (Convenience Function) ---')
  const client: Client = {
    register: async () => {
      console.log('Registering...')
      await new Promise(resolve => setTimeout(resolve, 50))
      console.log('Registered!')
    },
    operation1: async () => console.log('Operation 1'),
    operation2: () => console.log('Operation 2'),
    operation3: async (foo: string) => {
      console.log(`Operation 3: ${foo}`)
      return 42
    }
  }

  // Simple usage with convenience function
  const autoClient = createAutoRegisterProxyFor(client)
  await autoClient.operation1()
  autoClient.operation2()

  console.log('\n--- Testing with Explicit Registrar ---')
  const testClient: Client = {
    register: async () => {
      console.log('Test client registering...')
      await new Promise(resolve => setTimeout(resolve, 50))
      console.log('Test client registered!')
    },
    operation1: async () => console.log('Test Op 1'),
    operation2: () => console.log('Test Op 2'),
    operation3: async (foo: string) => {
      console.log(`Test Op 3: ${foo}`)
      return 99
    }
  }

  // Testing usage - use mock registrar for testing
  const mockRegistrar = new MockRegistrar(testClient)
  const testProxy = createAutoRegisterProxy(mockRegistrar)
  
  await testProxy.operation1()
  console.log(`ensureRegistered called ${mockRegistrar.ensureRegisteredCallCount} times`)
  
  testProxy.operation2()
  console.log(`ensureRegistered called ${mockRegistrar.ensureRegisteredCallCount} times total`)
  
  const result = await testProxy.operation3('test')
  console.log(`Result: ${result}, ensureRegistered called ${mockRegistrar.ensureRegisteredCallCount} times total`)

  // You can also check registration status
  console.log(`Registration status: ${mockRegistrar.getRegistrationStatus()}`)
  
  // Create a new registrar for fresh testing
  const freshRegistrar = new MockRegistrar(testClient)
  const freshProxy = createAutoRegisterProxy(freshRegistrar)
  console.log(`Fresh registrar registration status: ${freshRegistrar.getRegistrationStatus()}`)
}
}

// Simple unit test example
async function unitTest() {
  console.log('--- Unit Test Example ---')
  
  let registerCalled = false
  let op1Called = false
  
  const mockClient: Client = {
    register: async () => {
      registerCalled = true
      console.log('✓ register() was called')
    },
    operation1: async () => {
      op1Called = true
      console.log('✓ operation1() was called')
    },
    operation2: () => {},
    operation3: async () => 0
  }
  
  const registrar = new MockRegistrar(mockClient)
  const proxy = createAutoRegisterProxy(registrar)
  
  console.log('Before calling operation1:')
  console.log(`  - register called: ${registerCalled}`)
  console.log(`  - operation1 called: ${op1Called}`)
  console.log(`  - ensureRegistered call count: ${registrar.ensureRegisteredCallCount}`)
  
  await proxy.operation1()
  
  console.log('After calling operation1:')
  console.log(`  - register called: ${registerCalled}`)
  console.log(`  - operation1 called: ${op1Called}`)
  console.log(`  - ensureRegistered call count: ${registrar.ensureRegisteredCallCount}`)
  console.log(`  - registration status: ${registrar.getRegistrationStatus()}`)
  
  // Call again to verify register is only called once
  await proxy.operation1()
  console.log(`After second operation1 call:`)
  console.log(`  - ensureRegistered call count: ${registrar.ensureRegisteredCallCount}`)
}

// Uncomment to run examples
// example().catch(console.error)
// unitTest().catch(console.error)
```

## Checklist

- [ ] Create `src/poc/` directory for POC implementation
- [ ] Define the `Registerable` interface with `register()` method
- [ ] Create the example `Client` interface for testing
- [ ] Implement `RegisteringProxy` class that:
  - [ ] Takes any object implementing `Registerable`
  - [ ] Uses JavaScript Proxy to intercept method calls
  - [ ] Automatically calls `register()` before each method (except register itself)
  - [ ] Forwards the original method call after registration
  - [ ] Preserves method signatures and return types
- [ ] Create a concrete implementation of `Client` interface for testing
- [ ] Write test scenarios to verify:
  - [ ] Registration is called automatically before operations
  - [ ] Method signatures are preserved
  - [ ] Return values work correctly
  - [ ] Async/sync methods both work
  - [ ] Multiple calls only register once if needed
- [ ] Add TypeScript types to ensure type safety
- [ ] Document the POC with usage examples
