import { UserRole } from '../types/database';
import { getLocalSettings } from './settingsService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AuthSession {
  userId: string;
  displayName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  session?: AuthSession;
}

const AUTH_ROLE_STORAGE_KEY = 'dormplus_current_user_role';
const AUTH_LOGGED_IN_KEY = 'dormplus_auth_logged_in';
const AUTH_USER_DATA_KEY = 'dormplus_auth_user_data';

export const DEMO_USERS: Record<UserRole, { email: string; displayName: string; role: UserRole }> = {
  OWNER: {
    email: 'owner@phatlada.com',
    displayName: 'คุณภัทร์ลดา (เจ้าของหอพัก)',
    role: 'OWNER',
  },
  MANAGER: {
    email: 'manager@phatlada.com',
    displayName: 'คุณสมชาย (ผู้จัดการ)',
    role: 'MANAGER',
  },
  STAFF: {
    email: 'staff@phatlada.com',
    displayName: 'ช่างวิชัย (เจ้าหน้าที่หน้างาน)',
    role: 'STAFF',
  },
};

/**
 * Check if the user is currently authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_LOGGED_IN_KEY) === 'true';
}

/**
 * Get current user role
 */
export function getCurrentUserRole(): UserRole {
  if (typeof window === 'undefined') return 'OWNER';
  const saved = localStorage.getItem(AUTH_ROLE_STORAGE_KEY);
  if (saved === 'OWNER' || saved === 'MANAGER' || saved === 'STAFF') {
    return saved as UserRole;
  }
  const settings = getLocalSettings();
  return settings.userRole || 'OWNER';
}

/**
 * Set user role and trigger reactive event
 */
export function setCurrentUserRole(role: UserRole): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_ROLE_STORAGE_KEY, role);
  window.dispatchEvent(new CustomEvent('dormplus_auth_changed', { detail: { role } }));
}

/**
 * Get current session object
 */
export function getCurrentSession(): AuthSession {
  const role = getCurrentUserRole();
  const settings = getLocalSettings();

  if (typeof window !== 'undefined') {
    try {
      const savedUserStr = localStorage.getItem(AUTH_USER_DATA_KEY);
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        return {
          userId: savedUser.userId || 'usr-local',
          displayName: savedUser.displayName || settings.userDisplayName || DEMO_USERS[role].displayName,
          email: savedUser.email || DEMO_USERS[role].email,
          role,
          avatarUrl: savedUser.avatarUrl || null,
        };
      }
    } catch {
      // Ignore parse error and fallback
    }
  }

  const demo = DEMO_USERS[role];
  return {
    userId: 'usr-default',
    displayName: settings.userDisplayName || demo.displayName,
    email: settings.userEmail || demo.email,
    role,
    avatarUrl: null,
  };
}

/**
 * Sign in using email and password
 */
export async function loginWithEmail(email: string, password: string): Promise<LoginResult> {
  const trimmedEmail = email.trim().toLowerCase();

  // Try real Supabase Auth first if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (!error && data.user) {
        const userRole = (data.user.user_metadata?.role as UserRole) || 'OWNER';
        const session: AuthSession = {
          userId: data.user.id,
          displayName: data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || 'ผู้ใช้งาน',
          email: data.user.email || trimmedEmail,
          role: userRole,
          avatarUrl: data.user.user_metadata?.avatar_url || null,
        };

        saveLocalSession(session);
        return { success: true, session };
      }
      // If error from Supabase, return its message
      return {
        success: false,
        error: error ? error.message : 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
      return { success: false, error: msg };
    }
  }

  // Fallback / Demo Account Verification (when Supabase credentials not set or local evaluation)
  if (!password || password.length < 6) {
    return {
      success: false,
      error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร',
    };
  }

  // Check matching demo accounts or allow standard login
  let matchedRole: UserRole = 'OWNER';
  if (trimmedEmail.includes('manager')) {
    matchedRole = 'MANAGER';
  } else if (trimmedEmail.includes('staff')) {
    matchedRole = 'STAFF';
  }

  const demoUser = DEMO_USERS[matchedRole];
  const session: AuthSession = {
    userId: `usr-${matchedRole.toLowerCase()}`,
    displayName: demoUser.displayName,
    email: trimmedEmail,
    role: matchedRole,
    avatarUrl: null,
  };

  saveLocalSession(session);
  return { success: true, session };
}

/**
 * Quick Login with a demo role
 */
export function loginAsDemo(role: UserRole): AuthSession {
  const demo = DEMO_USERS[role];
  const session: AuthSession = {
    userId: `usr-demo-${role.toLowerCase()}`,
    displayName: demo.displayName,
    email: demo.email,
    role,
    avatarUrl: null,
  };

  saveLocalSession(session);
  return session;
}

/**
 * Save session data to local storage and notify app
 */
function saveLocalSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_LOGGED_IN_KEY, 'true');
  localStorage.setItem(AUTH_ROLE_STORAGE_KEY, session.role);
  localStorage.setItem(AUTH_USER_DATA_KEY, JSON.stringify(session));

  window.dispatchEvent(
    new CustomEvent('dormplus_auth_changed', {
      detail: { session, role: session.role, isAuthenticated: true },
    })
  );
}

/**
 * Sign out user and clear session
 */
export async function logout(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore Supabase sign out error
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_LOGGED_IN_KEY);
    localStorage.removeItem(AUTH_USER_DATA_KEY);
    window.dispatchEvent(
      new CustomEvent('dormplus_auth_changed', {
        detail: { isAuthenticated: false, loggedOut: true },
      })
    );
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes('@')) {
    return { success: false, message: 'กรุณาระบุอีเมลที่ถูกต้อง' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) {
        return { success: false, message: error.message };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ไม่สามารถส่งลิงก์รีเซ็ตรหัสผ่านได้';
      return { success: false, message: msg };
    }
  }

  return {
    success: true,
    message: `ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${trimmed} เรียบร้อยแล้ว (โปรดตรวจสอบในกล่องจดหมายของคุณ)`,
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
