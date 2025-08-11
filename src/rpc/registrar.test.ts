import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  Registrar,
  createAutoRegisterProxy,
  createAutoRegisterProxyFor,
} from "./registrar";
import type { Registerable } from "./types";

// Mock client for testing
class MockRpcClient implements Registerable {
  private registered = false;
  public registerCallCount = 0;
  public methodCallCount = 0;

  async register(): Promise<void> {
    this.registerCallCount++;
    this.registered = true;
  }

  async someMethod(): Promise<string> {
    this.methodCallCount++;
    return "method result";
  }

  getRegistered(): boolean {
    return this.registered;
  }
}

describe("Registrar", () => {
  let mockClient: MockRpcClient;
  let registrar: Registrar<MockRpcClient>;

  beforeEach(() => {
    mockClient = new MockRpcClient();
    registrar = new Registrar(mockClient);
  });

  it("should create registrar with client", () => {
    expect(registrar.getClient()).toBe(mockClient);
    expect(registrar.getRegistrationStatus()).toBe(false);
    expect(registrar.getRegistrationPromise()).toBe(null);
  });

  it("should register client on first ensureRegistered call", async () => {
    await registrar.ensureRegistered();

    expect(mockClient.registerCallCount).toBe(1);
    expect(registrar.getRegistrationStatus()).toBe(true);
  });

  it("should not register again if already registered", async () => {
    await registrar.ensureRegistered();
    await registrar.ensureRegistered();

    expect(mockClient.registerCallCount).toBe(1);
  });

  it("should handle concurrent registration attempts", async () => {
    const promises = [
      registrar.ensureRegistered(),
      registrar.ensureRegistered(),
      registrar.ensureRegistered(),
    ];

    await Promise.all(promises);
    expect(mockClient.registerCallCount).toBe(1);
  });

  it("should handle registration errors", async () => {
    const errorClient = {
      register: vi.fn().mockRejectedValue(new Error("Registration failed")),
    } as unknown as Registerable;

    const errorRegistrar = new Registrar(errorClient);

    await expect(errorRegistrar.ensureRegistered()).rejects.toThrow(
      "RPC client registration failed: Registration failed"
    );
    expect(errorRegistrar.getRegistrationStatus()).toBe(false);
  });
});

describe("createAutoRegisterProxy", () => {
  let mockClient: MockRpcClient;
  let registrar: Registrar<MockRpcClient>;
  let proxy: MockRpcClient;

  beforeEach(() => {
    mockClient = new MockRpcClient();
    registrar = new Registrar(mockClient);
    proxy = createAutoRegisterProxy(registrar);
  });

  it("should preserve method behavior after auto-registration", async () => {
    // Initially not registered
    expect(mockClient.getRegistered()).toBe(false);

    // Call a method that should trigger auto-registration
    await proxy.someMethod();
    expect(mockClient.registerCallCount).toBe(1);
    expect(mockClient.getRegistered()).toBe(true);
  });
  it("should return register method directly", async () => {
    await proxy.register();
    expect(mockClient.registerCallCount).toBe(1);
  });

  it("should auto-register before calling other methods", async () => {
    const result = await proxy.someMethod();

    expect(mockClient.registerCallCount).toBe(1);
    expect(mockClient.methodCallCount).toBe(1);
    expect(result).toBe("method result");
  });

  it("should only register once for multiple method calls", async () => {
    await proxy.someMethod();
    await proxy.someMethod();

    expect(mockClient.registerCallCount).toBe(1);
    expect(mockClient.methodCallCount).toBe(2);
  });

  it("should handle method call errors", async () => {
    const errorClient = {
      register: vi.fn().mockResolvedValue(undefined),
      errorMethod: vi.fn().mockRejectedValue(new Error("Method failed")),
    } as unknown as Registerable & { errorMethod: () => Promise<void> };

    const errorProxy = createAutoRegisterProxy(new Registrar(errorClient));

    await expect(errorProxy.errorMethod()).rejects.toThrow("Method failed");
  });
});

describe("createAutoRegisterProxyFor", () => {
  it("should create proxy with new registrar", async () => {
    const mockClient = new MockRpcClient();
    const proxy = createAutoRegisterProxyFor(mockClient);

    await proxy.someMethod();

    expect(mockClient.registerCallCount).toBe(1);
    expect(mockClient.methodCallCount).toBe(1);
  });
});
