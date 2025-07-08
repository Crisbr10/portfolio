/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_RESEND_API_KEY: string;
  readonly PUBLIC_RESEND_FROM_EMAIL: string;
  readonly PUBLIC_RESEND_TO_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
