import { useState } from "react";
import styles from "./ClientApp.module.css";

export function ClientApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const externalId = urlParams.get("externalId");
  const [clientId] = useState(() => Math.random().toString(36).substring(7));

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
      </div>
    </div>
  );
}
