interface ImportMetaEnv {
  readonly VITE_OPENROUTER_KEY?: string;
  readonly VITE_OPENROUTER_REF?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
