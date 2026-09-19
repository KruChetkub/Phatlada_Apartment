/**
 * Secure Storage Utility
 * Encodes/obfuscates data before storing into web storage
 * to prevent cleartext exposure of sensitive PII (Personally Identifiable Information).
 */

function encodePayload(data: unknown): string {
  try {
    const json = JSON.stringify(data);
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      return window.btoa(encodeURIComponent(json));
    }
    return json;
  } catch {
    return '';
  }
}

function decodePayload<T>(encoded: string | null): T | null {
  if (!encoded) return null;
  try {
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      const decodedJson = decodeURIComponent(window.atob(encoded));
      return JSON.parse(decodedJson);
    }
  } catch {
    // Fallback in case raw JSON was stored in earlier versions
    try {
      return JSON.parse(encoded);
    } catch {
      return null;
    }
  }
  return null;
}

export const secureStorage = {
  setItem(key: string, value: unknown): void {
    if (typeof window === 'undefined') return;
    const encoded = encodePayload(value);
    localStorage.setItem(key, encoded);
  },

  getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(key);
    return decodePayload<T>(raw);
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

