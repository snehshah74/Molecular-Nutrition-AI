/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_API_URL: string
  readonly VITE_AI_INTEGRATIONS_URL: string
  readonly VITE_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
