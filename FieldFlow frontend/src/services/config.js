// Centralized service config — auto-detects production environment
// On Vercel (production), always use real API. Locally, respect .env.local setting.
const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
export const USE_API = isProduction || import.meta.env.VITE_USE_API === 'true';
