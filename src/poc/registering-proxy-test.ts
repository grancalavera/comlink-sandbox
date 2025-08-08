import {
  createAutoRegisterProxy,
  createAutoRegisterProxyFor,
  MockRegistrar,
} from "./registering-proxy";
import type { Client } from "./registering-proxy";

// Example usage and testing
export async function example() {
  console.log("--- Standard Usage (Convenience Function) ---");
  const client: Client = {
    register: async () => {
      console.log("Registering...");
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log("Registered!");
    },
    operation1: async () => console.log("Operation 1"),
    operation2: () => console.log("Operation 2"),
    operation3: async (foo: string) => {
      console.log(`Operation 3: ${foo}`);
      return 42;
    },
  };

  // Simple usage with convenience function
  const autoClient = createAutoRegisterProxyFor(client);
  await autoClient.operation1();
  autoClient.operation2();

  console.log("\n--- Testing with Explicit Registrar ---");
  const testClient: Client = {
    register: async () => {
      console.log("Test client registering...");
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log("Test client registered!");
    },
    operation1: async () => console.log("Test Op 1"),
    operation2: () => console.log("Test Op 2"),
    operation3: async (foo: string) => {
      console.log(`Test Op 3: ${foo}`);
      return 99;
    },
  };

  // Testing usage - use mock registrar for testing
  const mockRegistrar = new MockRegistrar(testClient);
  const testProxy = createAutoRegisterProxy(mockRegistrar);

  await testProxy.operation1();
  console.log(
    `ensureRegistered called ${mockRegistrar.ensureRegisteredCallCount} times`
  );

  testProxy.operation2();
  console.log(
    `ensureRegistered called ${mockRegistrar.ensureRegisteredCallCount} times total`
  );

  const result = await testProxy.operation3("test");
  console.log(
    `Result: ${result}, ensureRegistered called ${mockRegistrar.ensureRegisteredCallCount} times total`
  );

  // You can also check registration status
  console.log(`Registration status: ${mockRegistrar.getRegistrationStatus()}`);

  // Create a new registrar for fresh testing
  const freshRegistrar = new MockRegistrar(testClient);
  console.log(
    `Fresh registrar registration status: ${freshRegistrar.getRegistrationStatus()}`
  );
}

// Simple unit test example
export async function unitTest() {
  console.log("--- Unit Test Example ---");

  let registerCalled = false;
  let op1Called = false;

  const mockClient: Client = {
    register: async () => {
      registerCalled = true;
      console.log("✓ register() was called");
    },
    operation1: async () => {
      op1Called = true;
      console.log("✓ operation1() was called");
    },
    operation2: () => {},
    operation3: async () => 0,
  };

  const registrar = new MockRegistrar(mockClient);
  const proxy = createAutoRegisterProxy(registrar);

  console.log("Before calling operation1:");
  console.log(`  - register called: ${registerCalled}`);
  console.log(`  - operation1 called: ${op1Called}`);
  console.log(
    `  - ensureRegistered call count: ${registrar.ensureRegisteredCallCount}`
  );

  await proxy.operation1();

  console.log("After calling operation1:");
  console.log(`  - register called: ${registerCalled}`);
  console.log(`  - operation1 called: ${op1Called}`);
  console.log(
    `  - ensureRegistered call count: ${registrar.ensureRegisteredCallCount}`
  );
  console.log(`  - registration status: ${registrar.getRegistrationStatus()}`);

  // Call again to verify register is only called once
  await proxy.operation1();
  console.log(`After second operation1 call:`);
  console.log(
    `  - ensureRegistered call count: ${registrar.ensureRegisteredCallCount}`
  );
}

// Test scenario to verify registration only happens once
export async function testRegistrationOnlyOnce() {
  console.log("--- Test Registration Only Happens Once ---");

  let registerCallCount = 0;

  const client: Client = {
    register: async () => {
      registerCallCount++;
      console.log(`Register called (count: ${registerCallCount})`);
    },
    operation1: async () => console.log("Operation 1 executed"),
    operation2: () => console.log("Operation 2 executed"),
    operation3: async (foo: string) => {
      console.log(`Operation 3 executed with: ${foo}`);
      return foo.length;
    },
  };

  const proxy = createAutoRegisterProxyFor(client);

  // Multiple operations should only trigger registration once
  await proxy.operation1();
  await proxy.operation3("hello");
  proxy.operation2();
  await proxy.operation1();

  console.log(`Final register call count: ${registerCallCount}`);
  console.log("Expected: 1 (registration should only happen once)");
}

// Test to verify method signatures and return values are preserved
export async function testMethodSignatures() {
  console.log("--- Test Method Signatures and Return Values ---");

  const client: Client = {
    register: async () => {
      console.log("Registration complete");
    },
    operation1: async () => {
      console.log("Async operation completed");
    },
    operation2: () => {
      console.log("Sync operation completed");
    },
    operation3: async (input: string) => {
      const result = input.length * 2;
      console.log(`Processing "${input}" -> ${result}`);
      return result;
    },
  };

  const proxy = createAutoRegisterProxyFor(client);

  // Test async void method
  await proxy.operation1();

  // Test sync void method
  proxy.operation2();

  // Test async method with parameters and return value
  const result = await proxy.operation3("test");
  console.log(`Returned value: ${result}`);
  console.log(`Type check: ${typeof result === "number" ? "PASS" : "FAIL"}`);
}

// Run all tests if this file is executed directly
export async function runAllTests() {
  await example();
  console.log("\n" + "=".repeat(50) + "\n");

  await unitTest();
  console.log("\n" + "=".repeat(50) + "\n");

  await testRegistrationOnlyOnce();
  console.log("\n" + "=".repeat(50) + "\n");

  await testMethodSignatures();
}
