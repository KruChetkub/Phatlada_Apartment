// Database Entity Types matching Supabase Schema & SPEC.md §4

export type RoomStatus = 'OCCUPIED' | 'VACANT';
export type Gender = 'MALE' | 'FEMALE' | 'UNSPECIFIED';
export type LeaseStatus = 'ACTIVE' | 'ENDED' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';
export type MaintenanceStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type NotificationType =
  | 'MAINTENANCE_NEW'
  | 'PAYMENT_RECEIVED'
  | 'LEASE_EXPIRING'
  | 'ROOM_AVAILABLE';
export type PlanType = 'FREE' | 'PREMIUM';
export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  role: UserRole;
  createdAt: string;
}

export interface Dormitory {
  id: string;
  name: string;
  plan: PlanType;
  createdAt: string;
}

export interface Room {
  id: string;
  dormitoryId: string;
  number: string;
  floor: number;
  monthlyRent: number; // satang
  status: RoomStatus;
  coverImageUrl?: string | null;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  title: string; // "น.ส." | "นาย" | "นาง"
  firstName: string;
  lastName: string;
  gender: Gender;
  phone?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface Lease {
  id: string;
  roomId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  rent: number; // satang
  deposit: number; // satang
  status: LeaseStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  leaseId: string;
  amount: number; // satang
  period: string; // "2025-09"
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
}

export interface Expense {
  id: string;
  dormitoryId: string;
  category: string;
  amount: number; // satang
  spentAt: string;
  note?: string | null;
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string;
  roomId: string;
  title: string;
  status: MaintenanceStatus;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  dormitoryId: string;
  type: NotificationType;
  title: string;
  body: string;
  href?: string | null;
  readAt?: string | null;
  createdAt: string;
}

export type MessageRecipientType = 'ALL' | 'ROOM' | 'TENANT';
export type MessagePriority = 'NORMAL' | 'URGENT';

export interface MessageItem {
  id: string;
  dormitoryId: string;
  recipientType: MessageRecipientType;
  recipientId?: string | null;
  recipientName?: string | null;
  senderRole: UserRole;
  senderName: string;
  title: string;
  content: string;
  isRead: boolean;
  priority: MessagePriority;
  createdAt: string;
}

