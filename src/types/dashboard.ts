import { NotificationType, PlanType, RoomStatus, UserRole } from './database';

export interface DashboardSummary {
  dormitory: {
    id: string;
    name: string;
    plan: PlanType;
  };
  user: {
    displayName: string;
    role: UserRole;
    avatarUrl?: string | null;
  };
  unreadNotifications: number;
  rooms: {
    total: number;
    occupied: number;
    vacant: number;
    occupancyPct: number;
  };
  tenants: {
    total: number;
    male: number;
    female: number;
  };
  finance: {
    income: { value: number; changePct: number | null }; // Baht
    expense: { value: number; changePct: number | null }; // Baht
    profit: { value: number; changePct: number | null }; // Baht
    chart: Array<{
      period: string; // "2025-07"
      income: number; // Baht
      expense: number; // Baht
    }>;
  };
  maintenance: {
    open: number;
    inProgress: number;
    pending: number;
  };
  latestRooms: Array<{
    id: string;
    number: string;
    floor: number;
    monthlyRent: number; // Baht
    status: RoomStatus;
    coverImageUrl?: string | null;
    tenantName?: string | null;
    leaseEndDate?: string | null;
  }>;
  recentPayments: Array<{
    id: string;
    tenantName: string;
    avatarUrl?: string | null;
    roomNumber: string;
    amount: number; // Baht
    status: 'PAID' | 'PENDING' | 'OVERDUE';
    paidAt: string;
  }>;
  notifications: Array<{
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    href?: string | null;
    readAt?: string | null;
    createdAt: string;
  }>;
}

