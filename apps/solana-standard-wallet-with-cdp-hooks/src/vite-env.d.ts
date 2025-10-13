/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CDP_PROJECT_ID: string;
  readonly VITE_CDP_CREATE_SOLANA_ACCOUNT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
