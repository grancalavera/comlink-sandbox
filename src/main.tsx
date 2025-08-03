import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "jotai";
import { Dashboard } from "./features/dashboard/Dashboard";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <Dashboard />
    </Provider>
  </StrictMode>
);
