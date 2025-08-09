import { describe, test, expect } from "vitest";
import {
  createAutoRegisterProxy,
  createAutoRegisterProxyFor,
  MockRegistrar,
} from "./registering-proxy";
import type { Client } from "./registering-proxy";

describe("Auto Register Proxy", () => {
  test("should call register before operations using convenience function", async () => {
    let registerCalled = false;
    let op1Called = false;

    const client: Client = {
      register: async () => {
        registerCalled = true;
      },
      operation1: async () => {
        op1Called = true;
      },
      operation2: () => {},
      operation3: async () => 0,
    };

    const proxy = createAutoRegisterProxyFor(client);

    expect(registerCalled).toBe(false);
    expect(op1Called).toBe(false);

    await proxy.operation1();

    expect(registerCalled).toBe(true);
    expect(op1Called).toBe(true);
  });

  test("should track ensureRegistered calls with MockRegistrar", async () => {
    const client: Client = {
      register: async () => {},
      operation1: async () => {},
      operation2: () => {},
      operation3: async () => 0,
    };

    const mockRegistrar = new MockRegistrar(client);
    const proxy = createAutoRegisterProxy(mockRegistrar);

    expect(mockRegistrar.ensureRegisteredCallCount).toBe(0);
    expect(mockRegistrar.getRegistrationStatus()).toBe(false);

    await proxy.operation1();

    expect(mockRegistrar.ensureRegisteredCallCount).toBe(1);
    expect(mockRegistrar.getRegistrationStatus()).toBe(true);

    // Call again to verify ensureRegistered is called again but registration status remains true
    await proxy.operation1();
    expect(mockRegistrar.ensureRegisteredCallCount).toBe(2);
    expect(mockRegistrar.getRegistrationStatus()).toBe(true);
  });

  test("should only register once with convenience function", async () => {
    let registerCallCount = 0;

    const client: Client = {
      register: async () => {
        registerCallCount++;
      },
      operation1: async () => {},
      operation2: () => {},
      operation3: async (foo: string) => foo.length,
    };

    const proxy = createAutoRegisterProxyFor(client);

    // Multiple operations should only trigger registration once
    await proxy.operation1();
    await proxy.operation3("hello");
    proxy.operation2();
    await proxy.operation1();

    expect(registerCallCount).toBe(1);
  });

  test("should preserve method signatures and return values", async () => {
    const client: Client = {
      register: async () => {},
      operation1: async () => {},
      operation2: () => {},
      operation3: async (input: string) => {
        return input.length * 2;
      },
    };

    const proxy = createAutoRegisterProxyFor(client);

    // Test async void method
    const result1 = await proxy.operation1();
    expect(result1).toBeUndefined();

    // Test sync void method - proxy wraps it in async, so it returns a promise
    const result2 = await proxy.operation2();
    expect(result2).toBeUndefined();

    // Test async method with parameters and return value
    const result3 = await proxy.operation3("test");
    expect(result3).toBe(8); // "test".length * 2
    expect(typeof result3).toBe("number");
  });

  test("should not intercept register method calls", async () => {
    let registerCallCount = 0;

    const client: Client = {
      register: async () => {
        registerCallCount++;
      },
      operation1: async () => {},
      operation2: () => {},
      operation3: async () => 0,
    };

    const proxy = createAutoRegisterProxyFor(client);

    // Calling register directly should not trigger auto-registration
    await proxy.register();
    expect(registerCallCount).toBe(1);

    // Calling register again should increment the count
    await proxy.register();
    expect(registerCallCount).toBe(2);
  });

  test("should handle sync and async methods correctly", async () => {
    let registerCalled = false;
    let syncCalled = false;
    let asyncCalled = false;

    const client: Client = {
      register: async () => {
        registerCalled = true;
      },
      operation1: async () => {
        asyncCalled = true;
      },
      operation2: () => {
        syncCalled = true;
      },
      operation3: async () => 0,
    };

    const proxy = createAutoRegisterProxyFor(client);

    // Test sync method - proxy wraps it in async, so we need to await
    await proxy.operation2();
    expect(registerCalled).toBe(true);
    expect(syncCalled).toBe(true);

    // Reset for async test
    registerCalled = false;
    asyncCalled = false;

    const freshProxy = createAutoRegisterProxyFor(client);

    // Test async method
    await freshProxy.operation1();
    expect(registerCalled).toBe(true);
    expect(asyncCalled).toBe(true);
  });
  test("should preserve method context and arguments", async () => {
    const client: Client = {
      register: async () => {},
      operation1: async () => {},
      operation2: () => {},
      operation3: async (input: string) => {
        return input.length;
      },
    };

    const proxy = createAutoRegisterProxyFor(client);

    const result = await proxy.operation3("hello world");
    expect(result).toBe(11); // "hello world".length
  });
});
