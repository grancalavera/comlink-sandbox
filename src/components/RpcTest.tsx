import { useState } from "react";
import { rpcClient } from "../rpc/client";

export function RpcTest() {
  const [status, setStatus] = useState<string>("Not connected");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTestRpc = async () => {
    setIsLoading(true);
    setStatus("Connecting...");

    try {
      await rpcClient.register();
      setStatus("Successfully registered client!");
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "20px" }}>
      <h3>RPC System Test</h3>
      <p>Status: {status}</p>
      <button onClick={handleTestRpc} disabled={isLoading}>
        {isLoading ? "Testing..." : "Test RPC Communication"}
      </button>
    </div>
  );
}
