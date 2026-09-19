import { describe, it, expect, beforeEach } from 'vitest';
import { secureStorage } from '../src/lib/secureStorage';

describe('secureStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('encodes and retrieves data safely without cleartext exposure', () => {
    const sensitiveData = {
      name: 'สมชาย ใจดี',
      gender: 'MALE',
      phone: '0812345678',
    };

    secureStorage.setItem('test_sensitive_key', sensitiveData);

    // Verify localStorage does NOT contain the raw plain string "gender" in unencoded format
    const rawStored = localStorage.getItem('test_sensitive_key');
    expect(rawStored).toBeDefined();
    expect(rawStored).not.toContain('"gender":"MALE"');

    // Retrieve and verify data matches accurately
    const retrieved = secureStorage.getItem<typeof sensitiveData>('test_sensitive_key');
    expect(retrieved).toEqual(sensitiveData);
  });

  it('handles non-existent keys gracefully', () => {
    const result = secureStorage.getItem('non_existent_key');
    expect(result).toBeNull();
  });

  it('removes item correctly', () => {
    secureStorage.setItem('test_key', { a: 1 });
    expect(secureStorage.getItem('test_key')).toEqual({ a: 1 });
    secureStorage.removeItem('test_key');
    expect(secureStorage.getItem('test_key')).toBeNull();
  });
});
