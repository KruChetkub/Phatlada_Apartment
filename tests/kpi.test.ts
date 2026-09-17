import { describe, expect, it } from 'vitest';
import {
  calculateOccupancyPct,
  calculateChangePct,
  calculateProfit,
  calculateMaintenanceOpen,
  getTrendColor,
} from '../src/lib/kpi';

describe('kpi.ts', () => {
  it('calculates occupancy percentage according to SPEC.md §5', () => {
    // 42 / 48 * 100 = 87.5 -> 88
    expect(calculateOccupancyPct(42, 48)).toBe(88);
    expect(calculateOccupancyPct(0, 48)).toBe(0);
    expect(calculateOccupancyPct(48, 48)).toBe(100);
  });

  it('calculates percentage changes correctly matching seed data', () => {
    // Income: Jul 105,200, Aug 112,900, Sep 126,500
    // (126500 - 112900) / 112900 = 0.12046 -> 12%
    expect(calculateChangePct(126500, 112900)).toBe(12);

    // Expense: Aug 49,800, Sep 52,300
    // (52300 - 49800) / 49800 = 0.0502 -> 5%
    expect(calculateChangePct(52300, 49800)).toBe(5);

    // Profit: Aug (112900 - 49800) = 63100, Sep (126500 - 52300) = 74200
    // (74200 - 63100) / 63100 = 0.1759 -> 18%
    expect(calculateChangePct(74200, 63100)).toBe(18);

    // Edge case: previous is 0
    expect(calculateChangePct(10000, 0)).toBeNull();
  });

  it('calculates net profit', () => {
    expect(calculateProfit(126500, 52300)).toBe(74200);
  });

  it('calculates open maintenance tickets', () => {
    expect(calculateMaintenanceOpen(2, 1)).toBe(3);
  });

  it('determines trend colors appropriately', () => {
    // Income up is green
    expect(getTrendColor('INCOME', 12)).toBe('green');
    // Income down is red
    expect(getTrendColor('INCOME', -5)).toBe('red');
    // Expense up is red
    expect(getTrendColor('EXPENSE', 5)).toBe('red');
    // Expense down is green
    expect(getTrendColor('EXPENSE', -5)).toBe('green');
    // Neutral
    expect(getTrendColor('INCOME', null)).toBe('muted');
  });
});

