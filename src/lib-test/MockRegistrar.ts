import { vi } from "vitest";
import { Registrar } from "../poc/registering-proxy";
import type { Registerable } from "../poc/registering-proxy";

export class MockRegistrar<T extends Registerable> extends Registrar<T> {
  public ensureRegisteredSpy = vi.fn();
  private mockRegistered = false;

  async ensureRegistered(): Promise<void> {
    this.ensureRegisteredSpy();
    if (this.mockRegistered) return;

    await super.ensureRegistered();
    this.mockRegistered = true;
  }

  reset() {
    this.ensureRegisteredSpy.mockClear();
    this.mockRegistered = false;
  }
}
