export class RpcWorker {
  constructor() {
    // Business logic initialization only
  }

  async registerClient(clientId: string): Promise<void> {
    console.log(`Client registered: ${clientId}`);
    // Store the client ID for future operations
    // In a real implementation, you might store additional client metadata
  }
}