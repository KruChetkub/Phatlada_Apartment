import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Sanitize text input to protect against XSS and injection attacks
 */
export function sanitizeInput(input: string, maxLength?: number): string {
  if (!input) return '';
  // Strip HTML tags, script tags, and javascript: pseudo-protocols
  let cleaned = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:[^\s]*/gi, '')
    .trim();
  if (maxLength && maxLength > 0) {
    cleaned = cleaned.slice(0, maxLength);
  }
  return cleaned;
}
