import { useState, useEffect } from "react";
import { Switch } from "radix-ui";
import type { ClientState } from "./types";
import styles from "./ClientApp.module.css";

const clientId = crypto.randomUUID();

export function ClientApp() {
  const [client, setClient] = useState<ClientState>(() => ({
    id: clientId,
    isConnected: true,
  }));

  const handleToggleConnection = () => {
    setClient((prev) => ({
      ...prev,
      isConnected: !prev.isConnected,
    }));
  };

  const handleClose = () => {
    // In a real implementation, this would communicate with the parent window
    console.log("Client close requested");
  };

  useEffect(() => {
    // TODO: Set up SharedWorker connection
    console.log("Client initialized:", client.id);
  }, [client.id]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.clientId}>{client.id}</span>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close client"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.toggleSection}>
            <Switch.Root
              className={`${styles.switch} ${
                client.isConnected ? styles.on : styles.off
              }`}
              checked={client.isConnected}
              onCheckedChange={handleToggleConnection}
            >
              <Switch.Thumb className={styles.thumb} />
            </Switch.Root>
            <span className={styles.statusText}>
              {client.isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
