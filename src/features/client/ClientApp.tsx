import { Switch } from "radix-ui";
import { useState } from "react";
import { clientId } from "../../rpc/client.js";
import styles from "./ClientApp.module.css";

export function ClientApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const externalId = urlParams.get("externalId");
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const handleToggleConnection = () => {
    setIsConnected((prev) => !prev);
  };

  const handleClose = () => {
    if (!externalId) {
      return;
    }

    window.parent.postMessage(
      {
        type: "CLOSE_CLIENT",
        clientId: externalId,
      },
      "*"
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.clientId} data-testid="client-app-id">
            {clientId}
          </span>
          {externalId && (
            <button
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close client"
              data-testid="client-app-close-btn"
            >
              ×
            </button>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.toggleSection}>
            <Switch.Root
              className={`${styles.switch} ${
                isConnected ? styles.on : styles.off
              }`}
              checked={isConnected}
              onCheckedChange={handleToggleConnection}
              data-testid="client-app-connection-switch"
            >
              <Switch.Thumb className={styles.thumb} />
            </Switch.Root>
            <span
              className={styles.statusText}
              data-testid="client-app-status-text"
            >
              {isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
