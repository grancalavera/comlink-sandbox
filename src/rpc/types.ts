export interface RpcContract {
  echo(message: string): Promise<string>;
  registerClient(clientId: string): void;
}
