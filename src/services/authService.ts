import { UserRole } from '../types/database';
import { getLocalSettings } from './settingsService';

export interface AuthSession {
  userId: string;
  displayName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
}

const AUTH_ROLE_STORAGE_KEY = 'dormplus_current_user_role';

export function getCurrentUserRole(): UserRole {
  const saved = localStorage.getItem(AUTH_ROLE_STORAGE_KEY);
  if (saved === 'OWNER' || saved === 'MANAGER' || saved === 'STAFF') {
    return saved as UserRole;
  }
  const settings = getLocalSettings();
  return settings.userRole || 'OWNER';
}

export function setCurrentUserRole(role: UserRole): void {
  localStorage.setItem(AUTH_ROLE_STORAGE_KEY, role);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dormplus_auth_changed', { detail: { role } }));
  }
}

export function getCurrentSession(): AuthSession {
  const settings = getLocalSettings();
  const role = getCurrentUserRole();
  return {
    userId: 'usr-default',
    displayName: settings.userDisplayName || 'คุณเจ้าของหอพัก',
    email: settings.userEmail || 'owner@dormplus.com',
    role,
    avatarUrl: null,
  };
}

// Role Permissions Matrix
export function canManageSettings(role: UserRole = getCurrentUserRole()): boolean {
  return role === 'OWNER';
}

export function canManageFinances(role: UserRole = getCurrentUserRole()): boolean {
  return role === 'OWNER' || role === 'MANAGER';
}

export function canManageRoomsAndLeases(role: UserRole = getCurrentUserRole()): boolean {
  return role === 'OWNER' || role === 'MANAGER';
}

export function canRecordMeters(role: UserRole = getCurrentUserRole()): boolean {
  return role === 'OWNER' || role === 'MANAGER' || role === 'STAFF';
}

export function canManageMaintenance(role: UserRole = getCurrentUserRole()): boolean {
  return role === 'OWNER' || role === 'MANAGER' || role === 'STAFF';
}

