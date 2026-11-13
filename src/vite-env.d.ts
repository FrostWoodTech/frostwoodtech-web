/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  /** Unset until a real Google OAuth Client ID is provisioned. */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  /** "false" switches the public site to the API; anything else (or unset) serves static data. */
  readonly VITE_USE_STATIC_DATA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
