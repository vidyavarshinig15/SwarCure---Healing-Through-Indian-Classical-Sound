/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_SOUND_COLLECTIONS: string
  readonly VITE_ENABLE_COMMUNITY_FEATURES: string
  readonly VITE_ANALYTICS_ID: string
  // Add any other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
