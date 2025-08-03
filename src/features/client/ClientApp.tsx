import { useState, useEffect } from "react";
import { Switch } from "radix-ui";
import type { ClientState } from "./types";
import styles from "./ClientApp.module.css";

export function ClientApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('clientId') || crypto.randomUUID();
  
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
    window.parent.postMessage({
      type: 'CLOSE_CLIENT',
      clientId: client.id
    }, '*');
  };

  useEffect(() => {
    // TODO: Set up SharedWorker connection
    console.log("Client initialized:", client.id);
  }, [client.id]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.clientId} data-testid="client-app-id">{client.id}</span>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close client"
            data-testid="client-app-close-btn"
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
              data-testid="client-app-connection-switch"
            >
              <Switch.Thumb className={styles.thumb} />
            </Switch.Root>
            <span className={styles.statusText} data-testid="client-app-status-text">
              {client.isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
