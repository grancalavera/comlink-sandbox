export interface Observer<T> {
  next: (value: T) => void;
  error?: (error: unknown) => void;
  complete?: () => void;
}

export interface Subscription {
  unsubscribe: () => void;
}

export interface RpcContract {
  echo(message: string): Promise<string>;
  registerClient(clientId: string): void;
  getCounterValue(): number;
  subscribe(clientId: string, observer: Observer<number>): Subscription;
}
