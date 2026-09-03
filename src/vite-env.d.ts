/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MIDNIGHT_NETWORK: string;
  readonly VITE_INDEXER_URL: string;
  readonly VITE_PROOF_SERVER_URL: string;
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_DEFAULT_AGE_THRESHOLD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
