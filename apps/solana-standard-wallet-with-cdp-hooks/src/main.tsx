import { Buffer } from "buffer";

import { CDPReactProvider } from "@coinbase/cdp-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "./index.css";

const config = {
  projectId: import.meta.env.VITE_CDP_PROJECT_ID,
  basePath: import.meta.env.VITE_CDP_BASE_PATH,
  useMock: import.meta.env.VITE_USE_MOCK === "true",
  solana: {
    createOnLogin: true,
  },
};

(globalThis as any).Buffer = Buffer;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CDPReactProvider config={config}>
      <App />
    </CDPReactProvider>
  </StrictMode>,
);
