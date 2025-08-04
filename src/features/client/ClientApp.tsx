import { Switch } from "radix-ui";
import { clientId, useConnection } from "../../rpc/client.js";
import { rpcClient } from "../../rpc/connection-state.js";
import * as Comlink from "comlink";
import { useState, useEffect } from "react";
import styles from "./ClientApp.module.css";

export function ClientApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const externalId = urlParams.get("externalId");
  const { connect, disconnect, isConnected } = useConnection();
  const [counterValue, setCounterValue] = useState<number | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<{ unsubscribe: () => void } | null>(null);

  const handleToggleConnection = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const handleSubscriptionToggle = async () => {
    if (isSubscribed && subscription) {
      subscription.unsubscribe();
      setSubscription(null);
      setIsSubscribed(false);
      setCounterValue(null);
    } else {
      try {
        const currentValue = await rpcClient.getCounterValue();
        setCounterValue(currentValue);

        const sub = await rpcClient.subscribe(clientId, Comlink.proxy({
          next: (value: number) => {
            setCounterValue(value);
          },
          error: (error: unknown) => {
            console.error("Subscription error:", error);
          },
          complete: () => {
            console.log("Subscription completed");
          }
        }));

        setSubscription(sub);
        setIsSubscribed(true);
      } catch (error) {
        console.error("Failed to subscribe:", error);
      }
    }
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [subscription]);

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

          <div className={styles.toggleSection}>
            <Switch.Root
              className={`${styles.switch} ${
                isSubscribed ? styles.on : styles.off
              }`}
              checked={isSubscribed}
              onCheckedChange={handleSubscriptionToggle}
              data-testid="client-app-subscription-switch"
            >
              <Switch.Thumb className={styles.thumb} />
            </Switch.Root>
            <span
              className={styles.statusText}
              data-testid="client-app-subscription-text"
            >
              {isSubscribed ? "Subscribed" : "Not Subscribed"}
            </span>
          </div>

          {counterValue !== null && (
            <div className={styles.counterSection}>
              <span data-testid="client-app-counter-value">
                Counter: {counterValue}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
