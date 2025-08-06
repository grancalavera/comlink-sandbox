export type WithIndexedOperations<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => infer Return
    ? (clientId: string, ...args: Args) => Return
    : T[K];
};