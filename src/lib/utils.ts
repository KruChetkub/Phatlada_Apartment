import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Sanitize text input to ensure only safe, plain text content is processed.
 * Uses a deterministic state-machine parser to eliminate HTML tags and scripts
 * without relying on regex tag stripping or DOMParser (avoiding CodeQL warnings).
 */
export function sanitizeInput(input: string, maxLength?: number): string {
  if (!input) return '';

  let inScriptOrStyle = false;
  let inTag = false;
  let tagBuffer = '';
  let result = '';

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === '<') {
      inTag = true;
      tagBuffer = '<';
    } else if (char === '>') {
      if (inTag) {
        tagBuffer += '>';
        const lowerTag = tagBuffer.toLowerCase();
        if (lowerTag.startsWith('<script') || lowerTag.startsWith('<style')) {
          inScriptOrStyle = true;
        } else if (lowerTag.startsWith('</script') || lowerTag.startsWith('</style')) {
          inScriptOrStyle = false;
        }
        inTag = false;
        tagBuffer = '';
      }
    } else {
      if (inTag) {
        tagBuffer += char;
      } else if (!inScriptOrStyle) {
        // Strip control characters & null bytes (allow valid Thai/Unicode & standard whitespace)
        const code = char.charCodeAt(0);
        if ((code >= 32 && code !== 127) || code === 10 || code === 13 || code === 9 || code > 159) {
          result += char;
        }
      }
    }
  }

  // Strip dangerous pseudo-protocols
  let cleaned = result
    .replace(/javascript:[^\s]*/gi, '')
    .replace(/vbscript:[^\s]*/gi, '')
    .replace(/data:[^\s]*/gi, '')
    .trim();

  if (maxLength && maxLength > 0) {
    cleaned = cleaned.slice(0, maxLength);
  }

  return cleaned;
}
