import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Sanitize text input to ensure only safe, plain text content is processed.
 * Uses standard DOM parsing and node filtering to eliminate script/HTML injection.
 */
export function sanitizeInput(input: string, maxLength?: number): string {
  if (!input) return '';

  let text = input;

  // In browser environment, securely parse HTML and remove executable elements
  if (typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(input, 'text/html');
      const dangerousTags = doc.querySelectorAll('script, style, iframe, object, embed');
      dangerousTags.forEach((el) => el.remove());
      text = doc.body.textContent || '';
    } catch {
      // Fallback
    }
  }

  // Strip any remaining angle brackets and javascript URI schemes
  let cleaned = text
    .replace(/[<>]/g, '')
    .replace(/javascript:[^\s]*/gi, '')
    .trim();

  if (maxLength && maxLength > 0) {
    cleaned = cleaned.slice(0, maxLength);
  }

  return cleaned;
}
