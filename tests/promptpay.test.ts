import { describe, it, expect } from 'vitest';
import { generatePromptPayPayload, formatPromptPayTarget } from '../src/lib/promptpay';

describe('promptpay.ts', () => {
  it('formats Thai mobile numbers correctly to 13 digits 0066...', () => {
    const res = formatPromptPayTarget('0812345678');
    expect(res.type).toBe('PHONE');
    expect(res.value).toBe('0066812345678');
  });

  it('formats Citizen/Tax ID correctly to 13 digits', () => {
    const res = formatPromptPayTarget('1234567890123');
    expect(res.type).toBe('NAT_ID');
    expect(res.value).toBe('1234567890123');
  });

  it('generates valid static PromptPay payload with checksum', () => {
    const payload = generatePromptPayPayload('0812345678');
    expect(payload.startsWith('000201010211')).toBe(true);
    expect(payload.includes('A000000677010111')).toBe(true);
    expect(payload.includes('6304')).toBe(true);
    // Checksum is 4 hex chars at end
    expect(payload.length).toBeGreaterThan(50);
  });

  it('generates valid dynamic PromptPay payload with amount', () => {
    const payload = generatePromptPayPayload('0812345678', 3500.5);
    expect(payload.startsWith('000201010212')).toBe(true);
    expect(payload.includes('54073500.50')).toBe(true);
  });
});

