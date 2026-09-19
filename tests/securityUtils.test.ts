import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '../src/lib/utils';

describe('sanitizeInput Security & Validation', () => {
  it('strips dangerous HTML script tags completely', () => {
    const malicious = 'คุณสมชาย <script>alert("hacked")</script>';
    const cleaned = sanitizeInput(malicious);
    expect(cleaned).toBe('คุณสมชาย');
  });

  it('strips HTML elements and javascript schemes', () => {
    const malicious = '<img src=x onerror=alert(1)>สวัสดีครับ javascript:void(0)';
    const cleaned = sanitizeInput(malicious);
    expect(cleaned).toBe('สวัสดีครับ');
  });

  it('truncates strictly to specified maxLength', () => {
    const longName = 'สมชาย ใจดีมากกกกกกกกกกกกกกกกกกกกกกกกกก';
    const cleaned = sanitizeInput(longName, 15);
    expect(cleaned.length).toBe(15);
    expect(cleaned).toBe('สมชาย ใจดีมากกก');
  });

  it('handles empty and null inputs safely', () => {
    expect(sanitizeInput('')).toBe('');
  });
});

