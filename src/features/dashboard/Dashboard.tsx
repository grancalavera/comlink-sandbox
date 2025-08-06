import { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { RpcTest } from "../../components/RpcTest";

interface Client {
  id: string;
}

export function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);

  const handleAddNewClient = () => {
    const newClient: Client = {
      id: crypto.randomUUID(),
    };
    setClients(prev => [...prev, newClient]);
  };

  const removeClient = (clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
  };

  useEffect(() => {
    const handleClientMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { type, clientId } = event.data;
      if (type === "CLOSE_CLIENT") {
        removeClient(clientId);
      }
    };

    window.addEventListener("message", handleClientMessage);
    return () => window.removeEventListener("message", handleClientMessage);
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Client Dashboard</h1>
        <button
          className={styles.addButton}
          onClick={handleAddNewClient}
          data-testid="dashboard-add-client-btn"
        >
          <span className={styles.addIcon}>+</span>
          Add New Client
        </button>
      </header>

      <RpcTest />

      <main className={styles.main}>
        {clients.length === 0 ? (
          <div className={styles.emptyState}>
            <p
              className={styles.emptyMessage}
              data-testid="dashboard-empty-message"
            >
              No clients yet. Click "Add New Client" to get started.
            </p>
          </div>
        ) : (
          <div
            className={styles.clientGrid}
            data-testid="dashboard-client-grid"
          >
            {clients.map(client => (
              <div key={client.id} className={styles.clientCard}>
                <iframe
                  src={`/client.html?externalId=${client.id}`}
                  className={styles.clientIframe}
                  title={`Client ${client.id}`}
                  data-testid={`dashboard-client-iframe-${client.id}`}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
