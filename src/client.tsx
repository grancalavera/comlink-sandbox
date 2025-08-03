import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "jotai";
import { ClientApp } from "./features/client/ClientApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <ClientApp />
    </Provider>
  </StrictMode>
);
