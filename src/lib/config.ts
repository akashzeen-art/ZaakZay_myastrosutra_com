import { BRAND } from "./brand";

declare const __API_BASE_URL__: string;

function resolveApiBaseUrl(): string {
  const built =
    typeof __API_BASE_URL__ !== "undefined" ? __API_BASE_URL__ : "/api/v1";

  if (typeof window === "undefined") {
    return built;
  }

  const { hostname } = window.location;
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";

  // Phone on same Wi‑Fi hitting Vite dev server must not call localhost:8000
  if (import.meta.env.DEV && !isLocalHost) {
    return `http://${hostname}:8000/api/v1`;
  }

  return built;
}

export const API_CONFIG = {
  get BASE_URL() {
    return resolveApiBaseUrl();
  },
  TIMEOUT: 120000,
  RETRY_ATTEMPTS: 3,
} as const;

export const APP_CONFIG = {
  NAME: BRAND.NAME,
  VERSION: "1.0.0",
  ENVIRONMENT: import.meta.env.MODE,
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

export const FEATURES = {
  // Default ON — this app runs without Spring Boot. Set VITE_USE_MOCK_API=false to use a real backend.
  MOCK_API: import.meta.env.VITE_USE_MOCK_API !== "false",
  STANDALONE: import.meta.env.VITE_STANDALONE !== "false",
  OPENAI: true,
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  // TEMPORARY: payment gateway APIs disabled — use demo/local subscription for now.
  // Re-enable with: import.meta.env.VITE_ENABLE_PAYMENTS !== "false"
  PAYMENTS: false,
  // PAYMENTS: import.meta.env.VITE_ENABLE_PAYMENTS !== "false",
} as const;

export const PAYMENT_CONFIG = {
  // Same-origin path — Vite proxies this in dev; production uses myastrosutra.online nginx.
  // TEMPORARY: payment APIs commented out in services; keep config for easy re-enable.
  BASE_URL: import.meta.env.VITE_PAYMENT_API_URL || "/api/payment",
  DEFAULT_PORTAL_ID: import.meta.env.VITE_PORTAL_ID || "1002",
  UPSTREAM: "https://myastrosutra.online",
} as const;

function resolveOpenAIProxyUrl(): string {
  const fromEnv = import.meta.env.VITE_OPENAI_PROXY_URL?.trim();
  if (fromEnv) return fromEnv;

  // Local: Vite middleware proxies this (no nginx needed)
  if (import.meta.env.DEV) return "/openai-proxy.php";

  // Vercel production: serverless function at api/openai/chat-completions.ts
  // (PHP proxy is for nginx hosts only)
  return "/api/openai/chat-completions";
}

export const OPENAI_CONFIG = {
  get PROXY_URL() {
    return resolveOpenAIProxyUrl();
  },
  MODEL: import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini",
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "myastrosutra_token",
  REFRESH_TOKEN: "myastrosutra_refresh_token",
  USER_DATA: "myastrosutra_user",
  SETTINGS: "myastrosutra_settings",
  SUBSCRIPTION: "myastrosutra_subscription",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/auth/signup/",
    LOGIN: "/auth/login/",
    LOGOUT: "/auth/logout/",
    REFRESH: "/auth/refresh/",
    ME: "/auth/me/",
    CHANGE_PASSWORD: "/auth/password/change/",
    RESET_PASSWORD: "/auth/password/reset/",
    DASHBOARD: "/auth/dashboard/",
  },
  READINGS: {
    LIST: "/readings/list/",
    CREATE: "/readings/",
    DETAIL: (id: string) => `/readings/${id}/`,
    PALM_UPLOAD: "/readings/palm/upload/",
    PALM_ANALYZE: "/readings/palm/analyze/",
    PALM_ANALYZE_NEW: "/palm-reading/analyze/",
    ASTROLOGY_CREATE: "/readings/astrology/",
    SAVE_UNIFIED: "/readings/save/",
  },
  PREDICTIONS: { GET: "/predictions/get/" },
  DASHBOARD: { REALTIME: "/auth/dashboard/realtime/" },
  PLANS: { UPGRADE: "/auth/upgrade-plan/" },
  ASTROLOGY: {
    BIRTH_CHART: "/astrology/birth-chart/",
    COMPATIBILITY: "/astrology/compatibility/",
    DAILY_HOROSCOPE: "/astrology/daily-horoscope/",
  },
  NUMEROLOGY: {
    CREATE: "/numerology",
    STATUS: (id: string) => `/numerology/${id}/status`,
    RESULT: (id: string) => `/numerology/${id}/result`,
  },
  SUBSCRIPTIONS: {
    PLANS: "/subscriptions/plans/",
    SUBSCRIBE: "/subscriptions/subscribe/",
    CANCEL: "/subscriptions/cancel/",
    PAYMENT_METHODS: "/subscriptions/payment-methods/",
  },
  ANALYTICS: {
    USER_STATS: "/analytics/user-stats/",
    READINGS_HISTORY: "/analytics/readings-history/",
  },
} as const;

export default API_CONFIG;
