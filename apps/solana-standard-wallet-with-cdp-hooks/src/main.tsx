import { Buffer } from "buffer";

import { CDPReactProvider } from "@coinbase/cdp-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "./index.css";

const config = {
  projectId: import.meta.env.VITE_CDP_PROJECT_ID,
  solana: {
    createOnLogin: import.meta.env.VITE_CDP_CREATE_SOLANA_ACCOUNT === "true",
  },
};

(globalThis as typeof globalThis & { Buffer: typeof Buffer }).Buffer = Buffer;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CDPReactProvider config={config}>
      <App />
    </CDPReactProvider>
  </StrictMode>,
);
