import { DashboardSummary } from '../types/dashboard';
import { fetchRooms } from './roomService';
import { fetchTenants } from './tenantService';
import { fetchPayments, fetchExpenses } from './financeService';
import { fetchMaintenance } from './maintenanceService';
import { fetchNotifications } from './notificationService';
import { calculateOccupancyPct, calculateProfit, calculateChangePct } from '../lib/kpi';
import { satangToBaht } from '../lib/format';

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  try {
    const [rooms, tenants, payments, expenses, maintenance, notifications] = await Promise.all([
      fetchRooms(),
      fetchTenants(),
      fetchPayments(),
      fetchExpenses(),
      fetchMaintenance(),
      fetchNotifications().catch(() => []),
    ]);

    // Calculate Room Stats
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r) => r.status === 'OCCUPIED').length;
    const vacantRooms = totalRooms - occupiedRooms;
    const occupancyPct = calculateOccupancyPct(occupiedRooms, totalRooms);

    // Calculate Tenant Stats
    const totalTenants = tenants.length;
    const maleTenants = tenants.filter((t) => t.gender === 'MALE').length;
    const femaleTenants = tenants.filter((t) => t.gender === 'FEMALE').length;

    // Calculate Current Month Finance (using Asia/Bangkok)
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const paidPaymentsThisMonth = payments.filter(
      (p) => p.status === 'PAID' && p.paidAt && p.paidAt.startsWith(currentMonthKey)
    );
    const expensesThisMonth = expenses.filter(
      (e) => e.spentAt && e.spentAt.startsWith(currentMonthKey)
    );

    const incomeSatang = paidPaymentsThisMonth.reduce((sum, p) => sum + p.amount, 0);
    const expenseSatang = expensesThisMonth.reduce((sum, e) => sum + e.amount, 0);
    const profitSatang = incomeSatang - expenseSatang;

    const incomeBaht = satangToBaht(incomeSatang);
    const expenseBaht = satangToBaht(expenseSatang);
    const profitBaht = satangToBaht(profitSatang);

    // Build 3-month Chart
    const chartMonths = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const mPaid = payments
        .filter((p) => p.status === 'PAID' && p.paidAt && p.paidAt.startsWith(mKey))
        .reduce((sum, p) => sum + p.amount, 0);
      const mExp = expenses
        .filter((e) => e.spentAt && e.spentAt.startsWith(mKey))
        .reduce((sum, e) => sum + e.amount, 0);

      chartMonths.push({
        period: mKey,
        income: satangToBaht(mPaid),
        expense: satangToBaht(mExp),
      });
    }

    // Previous month comparison
    const prevMonth = chartMonths[1];
    const currMonth = chartMonths[2];
    const incomeChange = prevMonth ? calculateChangePct(currMonth.income, prevMonth.income) : null;
    const expenseChange = prevMonth ? calculateChangePct(currMonth.expense, prevMonth.expense) : null;
    const prevProfit = prevMonth ? calculateProfit(prevMonth.income, prevMonth.expense) : 0;
    const profitChange = prevProfit ? calculateChangePct(profitBaht, prevProfit) : null;

    // Maintenance Stats
    const inProgressCount = maintenance.filter((m) => m.status === 'IN_PROGRESS').length;
    const pendingCount = maintenance.filter((m) => m.status === 'PENDING').length;
    const openMaintenance = inProgressCount + pendingCount;

    return {
      dormitory: {
        id: 'main-dorm',
        name: 'หอพักของฉัน',
        plan: 'PREMIUM',
      },
      user: {
        displayName: 'คุณเจ้าของหอพัก',
        role: 'OWNER',
        avatarUrl: null,
      },
      unreadNotifications: notifications.filter((n) => !n.readAt).length,
      rooms: {
        total: totalRooms,
        occupied: occupiedRooms,
        vacant: vacantRooms,
        occupancyPct,
      },
      tenants: {
        total: totalTenants,
        male: maleTenants,
        female: femaleTenants,
      },
      finance: {
        income: { value: incomeBaht, changePct: incomeChange },
        expense: { value: expenseBaht, changePct: expenseChange },
        profit: { value: profitBaht, changePct: profitChange },
        chart: chartMonths,
      },
      maintenance: {
        open: openMaintenance,
        inProgress: inProgressCount,
        pending: pendingCount,
      },
      latestRooms: rooms.slice(0, 5).map((r) => ({
        id: r.id,
        number: r.number,
        floor: r.floor,
        monthlyRent: satangToBaht(r.monthlyRent),
        status: r.status,
        coverImageUrl: r.coverImageUrl,
        tenantName: r.status === 'OCCUPIED' ? 'มีผู้เช่า' : null,
        leaseEndDate: null,
      })),
      recentPayments: payments.slice(0, 5).map((p) => ({
        id: p.id,
        tenantName: p.tenantName || 'ผู้เช่า',
        avatarUrl: null,
        roomNumber: p.roomNumber || '-',
        amount: satangToBaht(p.amount),
        status: p.status,
        paidAt: p.paidAt || p.createdAt,
      })),
      notifications: notifications.slice(0, 10),
    };
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
}
