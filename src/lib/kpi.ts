// Pure KPI calculation functions adhering to RULES.md §5 and SPEC.md §5

/**
 * Calculate occupancy percentage: round(occupied / total * 100)
 * Example: 42 / 48 * 100 = 87.5 -> 88
 */
export function calculateOccupancyPct(occupied: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((occupied / total) * 100);
}

/**
 * Calculate percentage change between current period and previous period
 * formula: round((current - previous) / previous * 100)
 * Returns null if previous is 0 or non-existent
 */
export function calculateChangePct(current: number, previous: number): number | null {
  if (previous <= 0) {
    return null;
  }
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Calculate profit: income - expense
 */
export function calculateProfit(income: number, expense: number): number {
  return income - expense;
}

/**
 * Calculate total open maintenance requests: inProgress + pending
 */
export function calculateMaintenanceOpen(inProgress: number, pending: number): number {
  return inProgress + pending;
}

/**
 * Get trend status for KPI values:
 * For income/profit: up = positive (green), down = negative (red)
 * For expense: up = negative (red), down = positive (green)
 */
export function getTrendColor(
  type: 'INCOME' | 'EXPENSE' | 'PROFIT',
  pct: number | null | undefined
): 'green' | 'red' | 'muted' {
  if (pct === null || pct === undefined || pct === 0) {
    return 'muted';
  }

  if (type === 'EXPENSE') {
    return pct > 0 ? 'red' : 'green';
  }

  return pct > 0 ? 'green' : 'red';
}

