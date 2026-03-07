const DEFAULT_API_PORT = "5115";
const LOCALHOST_FALLBACK = `http://localhost:${DEFAULT_API_PORT}`;

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (envUrl) {
    return envUrl;
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:${DEFAULT_API_PORT}`;
  }

  return LOCALHOST_FALLBACK;
}
