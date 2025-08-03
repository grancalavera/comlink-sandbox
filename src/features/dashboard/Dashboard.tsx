import styles from "./Dashboard.module.css";

export function Dashboard() {
  const handleAddNewClient = () => {
    console.log("Add new client clicked");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Client Dashboard</h1>
        <button className={styles.addButton} onClick={handleAddNewClient} data-testid="dashboard-add-client-btn">
          <span className={styles.addIcon}>+</span>
          Add New Client
        </button>
      </header>
      
      <main className={styles.main}>
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage} data-testid="dashboard-empty-message">
            No clients yet. Click "Add New Client" to get started.
          </p>
        </div>
      </main>
    </div>
  );
}