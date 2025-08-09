import { describe, test, expect, vi } from "vitest";
import {
  createAutoRegisterProxy,
  createAutoRegisterProxyFor,
} from "./registering-proxy";
import { MockRegistrar } from "../lib-test/MockRegistrar";
import type { Client } from "../lib-test/fixtures";

describe("Auto Register Proxy", () => {
  test("should call register before operations using convenience function", async () => {
    const registerMock = vi.fn();
    const operation1Mock = vi.fn();

    const client: Client = {
      register: registerMock,
      operation1: operation1Mock,
      operation2: () => {},
      operation3: async () => 0,
    };

    const proxy = createAutoRegisterProxyFor(client);

    expect(registerMock).not.toHaveBeenCalled();
    expect(operation1Mock).not.toHaveBeenCalled();

    await proxy.operation1();

    expect(registerMock).toHaveBeenCalledTimes(1);
    expect(operation1Mock).toHaveBeenCalledTimes(1);
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

    expect(mockRegistrar.ensureRegisteredSpy).toHaveBeenCalledTimes(0);
    expect(mockRegistrar.getRegistrationStatus()).toBe(false);

    await proxy.operation1();

    expect(mockRegistrar.ensureRegisteredSpy).toHaveBeenCalledTimes(1);
    expect(mockRegistrar.getRegistrationStatus()).toBe(true);

    // Call again to verify ensureRegistered is called again but registration status remains true
    await proxy.operation1();
    expect(mockRegistrar.ensureRegisteredSpy).toHaveBeenCalledTimes(2);
    expect(mockRegistrar.getRegistrationStatus()).toBe(true);
  });

  test("should only register once with convenience function", async () => {
    const registerMock = vi.fn();

    const client: Client = {
      register: registerMock,
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

    expect(registerMock).toHaveBeenCalledTimes(1);
  });

  test("should preserve method signatures and return values", async () => {
    const registerMock = vi.fn();
    const operation3Mock = vi.fn().mockImplementation(async (input: string) => {
      return input.length * 2;
    });

    const client: Client = {
      register: registerMock,
      operation1: async () => {},
      operation2: () => {},
      operation3: operation3Mock,
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
    expect(operation3Mock).toHaveBeenCalledWith("test");
  });

  test("should not intercept register method calls", async () => {
    const registerMock = vi.fn();

    const client: Client = {
      register: registerMock,
      operation1: async () => {},
      operation2: () => {},
      operation3: async () => 0,
    };

    const proxy = createAutoRegisterProxyFor(client);

    // Calling register directly should not trigger auto-registration
    await proxy.register();
    expect(registerMock).toHaveBeenCalledTimes(1);

    // Calling register again should increment the count
    await proxy.register();
    expect(registerMock).toHaveBeenCalledTimes(2);
  });

  test("should handle sync and async methods correctly", async () => {
    const registerMock = vi.fn();
    const operation1Mock = vi.fn();
    const operation2Mock = vi.fn();

    const client: Client = {
      register: registerMock,
      operation1: operation1Mock,
      operation2: operation2Mock,
      operation3: async () => 0,
    };

    const proxy = createAutoRegisterProxyFor(client);

    // Test sync method - proxy wraps it in async, so we need to await
    await proxy.operation2();
    expect(registerMock).toHaveBeenCalledTimes(1);
    expect(operation2Mock).toHaveBeenCalledTimes(1);

    // Create fresh proxy for async test
    const freshRegisterMock = vi.fn();
    const freshClient: Client = {
      register: freshRegisterMock,
      operation1: operation1Mock,
      operation2: () => {},
      operation3: async () => 0,
    };

    const freshProxy = createAutoRegisterProxyFor(freshClient);

    // Test async method
    await freshProxy.operation1();
    expect(freshRegisterMock).toHaveBeenCalledTimes(1);
    expect(operation1Mock).toHaveBeenCalledTimes(1);
  });
  test("should preserve method context and arguments", async () => {
    const registerMock = vi.fn();
    const operation3Mock = vi.fn().mockImplementation(async (input: string) => {
      return input.length;
    });

    const client: Client = {
      register: registerMock,
      operation1: async () => {},
      operation2: () => {},
      operation3: operation3Mock,
    };

    const proxy = createAutoRegisterProxyFor(client);

    const result = await proxy.operation3("hello world");
    expect(result).toBe(11); // "hello world".length
    expect(operation3Mock).toHaveBeenCalledWith("hello world");
    expect(registerMock).toHaveBeenCalledTimes(1);
  });
});
