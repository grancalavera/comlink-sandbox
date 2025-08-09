import type { Registerable } from "../poc/registering-proxy";

export interface Client extends Registerable {
  register: () => Promise<void>;
  operation1: () => Promise<void>;
  operation2: () => void;
  operation3: (foo: string) => Promise<number>;
}
