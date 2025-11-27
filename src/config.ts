const env = (import.meta as any).env ?? {};

export const USE_SIMPLE_AUTOCOMPLETE =
  String(env.VITE_SIMPLE_AUTOCOMPLETE ?? 'false').toLowerCase() === 'true';


