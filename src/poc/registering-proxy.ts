export interface Registerable {
  register: () => Promise<void>;
}

export class Registrar<T extends Registerable> {
  private registerPromise: Promise<void> | null = null;
  private isRegistered = false;
  private client: T;

  constructor(client: T) {
    this.client = client;
  }

  async ensureRegistered(): Promise<void> {
    if (this.isRegistered) return;

    if (this.registerPromise) {
      await this.registerPromise;
      return;
    }

    this.registerPromise = this.client.register();
    await this.registerPromise;
    this.isRegistered = true;
  }

  getClient(): T {
    return this.client;
  }

  getRegistrationStatus(): boolean {
    return this.isRegistered;
  }

  getRegistrationPromise(): Promise<void> | null {
    return this.registerPromise;
  }
}

export function createAutoRegisterProxy<T extends Registerable>(
  registrar: Registrar<T>
): T {
  const client = registrar.getClient();

  return new Proxy(client, {
    get(target, prop: string | symbol) {
      const value = target[prop as keyof T];

      // If it's not a function, return as-is
      if (typeof value !== "function") {
        return value;
      }

      // If it's the register method, return it directly
      if (prop === "register") {
        return value;
      }

      // For all other methods, wrap them to ensure registration
      return async function (...args: unknown[]) {
        await registrar.ensureRegistered();
        return value.apply(target, args);
      };
    },
  }) as T;
}

// Convenience function for the common case
export function createAutoRegisterProxyFor<T extends Registerable>(
  client: T
): T {
  return createAutoRegisterProxy(new Registrar(client));
}

// Example interfaces
export interface Client extends Registerable {
  register: () => Promise<void>;
  operation1: () => Promise<void>;
  operation2: () => void;
  operation3: (foo: string) => Promise<number>;
}

// Mock registrar for testing
export class MockRegistrar<T extends Registerable> extends Registrar<T> {
  public ensureRegisteredCallCount = 0;
  public mockRegistered = false;

  async ensureRegistered(): Promise<void> {
    this.ensureRegisteredCallCount++;
    if (this.mockRegistered) return;

    // For testing, we can control when registration happens
    await super.ensureRegistered();
    this.mockRegistered = true;
  }
}
