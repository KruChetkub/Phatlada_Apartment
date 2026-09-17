import { describe, expect, it } from 'vitest';
import {
  formatBaht,
  formatBahtText,
  formatRent,
  formatThaiDateLong,
  formatThaiDateShort,
  formatThaiTime,
  formatRelativeTh,
  formatChangePct,
  stripThaiTitle,
  getAvatarInitial,
} from '../src/lib/format';

describe('format.ts', () => {
  it('formats Baht currency with symbol', () => {
    expect(formatBaht(126500)).toBe('฿ 126,500');
    expect(formatBaht(3500)).toBe('฿ 3,500');
  });

  it('formats Baht text', () => {
    expect(formatBahtText(3500)).toBe('3,500 บาท');
  });

  it('formats rent per month', () => {
    expect(formatRent(3800)).toBe('3,800 บาท/เดือน');
  });

  it('formats Thai dates in Buddhist era', () => {
    // 2025-09-11 -> 2568
    const date = new Date('2025-09-11T13:12:00Z');
    expect(formatThaiDateLong(date)).toContain('2568');
    expect(formatThaiDateLong(date)).toContain('กันยายน');
    expect(formatThaiDateShort(date)).toContain('2568');
    expect(formatThaiDateShort(date)).toContain('ก.ย.');
  });

  it('formats Thai time with น.', () => {
    const date = new Date('2025-09-11T13:12:00Z'); // 20:12 in Bangkok (+7)
    expect(formatThaiTime(date)).toBe('20:12 น.');
  });

  it('formats relative time in Thai', () => {
    const base = new Date('2025-09-11T13:12:00Z');
    const justNow = new Date('2025-09-11T13:11:40Z');
    const minAgo = new Date('2025-09-11T13:05:00Z');
    const hoursAgo = new Date('2025-09-11T12:12:00Z');
    const daysAgo = new Date('2025-09-09T13:12:00Z');

    expect(formatRelativeTh(justNow, base)).toBe('เมื่อสักครู่');
    expect(formatRelativeTh(minAgo, base)).toBe('7 นาทีที่แล้ว');
    expect(formatRelativeTh(hoursAgo, base)).toBe('1 ชม.ที่แล้ว');
    expect(formatRelativeTh(daysAgo, base)).toBe('2 วันที่แล้ว');
  });

  it('formats percentage change with arrows', () => {
    expect(formatChangePct(12)).toBe('↑ 12%');
    expect(formatChangePct(-3)).toBe('↓ 3%');
    expect(formatChangePct(null)).toBe('—');
  });

  it('strips Thai title from name and extracts avatar initial', () => {
    expect(stripThaiTitle('น.ส.วราภรณ์ ใจดี')).toBe('วราภรณ์ ใจดี');
    expect(stripThaiTitle('นายศักดิ์ชัย แสนสุข')).toBe('ศักดิ์ชัย แสนสุข');
    expect(stripThaiTitle('นางสมศรี บุญมี')).toBe('สมศรี บุญมี');
    expect(getAvatarInitial('น.ส.วราภรณ์ ใจดี')).toBe('ว');
    expect(getAvatarInitial('นายศักดิ์ชัย แสนสุข')).toBe('ศ');
  });
});

