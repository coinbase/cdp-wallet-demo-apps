/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CDP_PROJECT_ID: string;
  readonly VITE_CDP_BASE_PATH?: string;
  readonly VITE_USE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  var Buffer: typeof import("buffer").Buffer;
}
