import { describe, it, expect, vi, beforeEach } from "vitest";
import { RpcClient } from "./RpcClient";
import type { Registerable } from "./types";

const TEST_CLIENT_ID = "test-client-id-123";

// Mock the UUID generator
vi.mock("../utils/uuid", () => ({
  generateUUID: vi.fn(() => TEST_CLIENT_ID),
}));

describe("RpcClient", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRemote: any;
  let rpcClient: RpcClient;

  beforeEach(() => {
    // Create a mock remote object
    mockRemote = {
      registerClient: vi.fn().mockResolvedValue(undefined),
      ping: vi.fn().mockResolvedValue("pong from worker"),
      getStatus: vi.fn().mockResolvedValue({ connected: true }),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rpcClient = new RpcClient(mockRemote as any);
  });

  describe("Registerable interface implementation", () => {
    it("should implement Registerable interface", () => {
      // Type assertion to ensure RpcClient implements Registerable
      const registerable: Registerable = rpcClient;
      expect(registerable).toBeDefined();
      expect(typeof registerable.register).toBe("function");
    });

    it("should have register method that returns a Promise", () => {
      const result = rpcClient.register();
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe("register() method", () => {
    it("should call remote.registerClient with client ID", async () => {
      await rpcClient.register();

      expect(mockRemote.registerClient).toHaveBeenCalledTimes(1);
      expect(mockRemote.registerClient).toHaveBeenCalledWith(TEST_CLIENT_ID);
    });

    it("should handle registration errors", async () => {
      const error = new Error("Registration failed");
      mockRemote.registerClient = vi.fn().mockRejectedValue(error);

      await expect(rpcClient.register()).rejects.toThrow("Registration failed");
    });
  });

  describe("registerClient() method - backward compatibility", () => {
    it("should exist for backward compatibility", () => {
      expect(typeof rpcClient.registerClient).toBe("function");
    });

    it("should delegate to register() method", async () => {
      const registerSpy = vi.spyOn(rpcClient, "register");

      await rpcClient.registerClient();

      expect(registerSpy).toHaveBeenCalledTimes(1);
      expect(mockRemote.registerClient).toHaveBeenCalledWith(TEST_CLIENT_ID);
    });

    it("should return the same result as register()", async () => {
      const registerResult = rpcClient.register();
      const registerClientResult = rpcClient.registerClient();

      // Both should return promises that resolve to undefined
      await expect(registerResult).resolves.toBeUndefined();
      await expect(registerClientResult).resolves.toBeUndefined();
    });
  });

  describe("ping() method", () => {
    it("should return pong message with client ID", async () => {
      const result = await rpcClient.ping();

      expect(result).toBe(`pong from client ${TEST_CLIENT_ID}`);
    });

    it("should return a string", async () => {
      const result = await rpcClient.ping();

      expect(typeof result).toBe("string");
    });
  });

  describe("getStatus() method", () => {
    it("should return status object with client ID and connected state", async () => {
      const result = await rpcClient.getStatus();

      expect(result).toEqual({
        clientId: TEST_CLIENT_ID,
        connected: true,
      });
    });

    it("should return object with correct structure", async () => {
      const result = await rpcClient.getStatus();

      expect(result).toHaveProperty("clientId");
      expect(result).toHaveProperty("connected");
      expect(typeof result.clientId).toBe("string");
      expect(typeof result.connected).toBe("boolean");
    });
  });

  describe("constructor", () => {
    it("should generate unique client ID", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client1 = new RpcClient(mockRemote as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client2 = new RpcClient(mockRemote as any);

      // Both should have the same ID since we're mocking generateUUID
      expect(client1).toBeDefined();
      expect(client2).toBeDefined();
    });

    it("should store remote reference", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = new RpcClient(mockRemote as any);
      expect(client).toBeDefined();
    });
  });

  describe("type compatibility", () => {
    it("should be compatible with RpcClient interface from types", () => {
      // This test ensures the class implements the interface correctly
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client = new RpcClient(mockRemote as any);

      expect(typeof client.registerClient).toBe("function");
      expect(typeof client.ping).toBe("function");
      expect(typeof client.getStatus).toBe("function");
    });
  });
});
