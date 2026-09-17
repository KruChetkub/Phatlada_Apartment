import { describe, expect, it } from 'vitest';

describe('Thai Buddhist Era (พ.ศ.) calculation logic', () => {
  it('correctly converts CE year to Buddhist Era (พ.ศ. = ค.ศ. + 543)', () => {
    const ceYear = 2026;
    const beYear = ceYear + 543;
    expect(beYear).toBe(2569);

    const ce2025 = 2025;
    expect(ce2025 + 543).toBe(2568);
  });

  it('formats dates in Buddhist Era using Intl.DateTimeFormat', () => {
    const d = new Date('2026-09-17T00:00:00Z');
    const formatted = new Intl.DateTimeFormat('th-TH', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);

    expect(formatted).toContain('2569');
    expect(formatted).toContain('กันยายน');
    expect(formatted).toContain('17');
  });
});

