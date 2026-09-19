import { UserRole } from '../types/database';
import { getLocalSettings } from './settingsService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { secureStorage } from '../lib/secureStorage';

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

const AUTH_ROLE_STORAGE_KEY = 'phatlada_current_user_role';
const AUTH_LOGGED_IN_KEY = 'phatlada_auth_logged_in';
const AUTH_USER_DATA_KEY = 'phatlada_auth_user_data';

export const DEMO_USERS: Record<UserRole, { email: string; displayName: string; role: UserRole }> = {
  OWNER: {
    email: 'chetnarak2531@gmail.com',
    displayName: 'คุณเชษฐ์ (เจ้าของหอพัก)',
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
  return secureStorage.getItem<string>(AUTH_LOGGED_IN_KEY) === 'true' || 
         localStorage.getItem(AUTH_LOGGED_IN_KEY) === 'true' || 
         localStorage.getItem('dormplus_auth_logged_in') === 'true';
}

/**
 * Get current user role
 */
export function getCurrentUserRole(): UserRole {
  if (typeof window === 'undefined') return 'OWNER';
  const saved = secureStorage.getItem<string>(AUTH_ROLE_STORAGE_KEY) || 
                localStorage.getItem(AUTH_ROLE_STORAGE_KEY) || 
                localStorage.getItem('dormplus_current_user_role');
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
  secureStorage.setItem(AUTH_ROLE_STORAGE_KEY, role);
  window.dispatchEvent(new CustomEvent('phatlada_auth_changed', { detail: { role } }));
}

/**
 * Get current session object
 */
export function getCurrentSession(): AuthSession {
  const role = getCurrentUserRole();
  const settings = getLocalSettings();

  if (typeof window !== 'undefined') {
    try {
      const savedUser = secureStorage.getItem<{
        userId?: string;
        displayName?: string;
        email?: string;
        avatarUrl?: string | null;
      }>(AUTH_USER_DATA_KEY);
      if (savedUser) {
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
        let userRole = (data.user.user_metadata?.role as UserRole) || 'OWNER';
        let displayName = data.user.user_metadata?.display_name || (trimmedEmail === 'chetnarak2531@gmail.com' ? 'คุณเชษฐ์ (เจ้าของหอพัก)' : 'ผู้ใช้งาน');

        // Check or upsert to public.users table in Supabase
        try {
          const { data: dbUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (dbUser) {
            displayName = dbUser.display_name || displayName;
            userRole = (dbUser.role as UserRole) || userRole;
          } else {
            await supabase.from('users').upsert({
              id: data.user.id,
              email: data.user.email || trimmedEmail,
              display_name: displayName,
              role: userRole,
            });
          }
        } catch (dbErr) {
          console.warn('Sync public.users error:', dbErr);
        }

        const session: AuthSession = {
          userId: data.user.id,
          displayName,
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
  secureStorage.setItem(AUTH_LOGGED_IN_KEY, 'true');
  secureStorage.setItem(AUTH_ROLE_STORAGE_KEY, session.role);
  secureStorage.setItem(AUTH_USER_DATA_KEY, session);

  window.dispatchEvent(
    new CustomEvent('phatlada_auth_changed', {
      detail: { session, role: session.role, isAuthenticated: true },
    })
  );
}

/**
 * Clear all browser cookies to prevent session/cookie hijacking
 */
export function clearAllCookies(): void {
  if (typeof document === 'undefined') return;
  const cookies = document.cookie.split(';');
  const hostname = window.location.hostname;
  const hostParts = hostname.split('.');

  for (const c of cookies) {
    const eqPos = c.indexOf('=');
    const name = eqPos > -1 ? c.substring(0, eqPos).trim() : c.trim();
    if (!name) continue;

    // Clear without domain (current path & root path)
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=;SameSite=Lax`;

    // Clear with domain variations
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${hostname};SameSite=Lax`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${hostname};SameSite=Lax`;

    if (hostParts.length > 2) {
      const rootDomain = hostParts.slice(-2).join('.');
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${rootDomain};SameSite=Lax`;
    }
  }
}

/**
 * Sign out user, revoke server tokens, and clear all local session tokens & cookies
 */
export async function logout(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      // Revoke all refresh tokens on Supabase backend so old cookies/tokens cannot be reused
      await supabase.auth.signOut({ scope: 'global' });
    } catch {
      // Ignore Supabase sign out error
    }
  }

  if (typeof window !== 'undefined') {
    // 1. Wipe all browser cookies
    clearAllCookies();

    // 2. Clear Supabase auth tokens & session keys from localStorage
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith('sb-') ||
            key.includes('auth') ||
            key.includes('session') ||
            key.includes('token') ||
            key.includes('user_role') ||
            key.includes('user_data'))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore storage errors
    }

    // 3. Clear session storage completely
    try {
      sessionStorage.clear();
    } catch {
      // Ignore session storage errors
    }

    // 4. Clear secure storage & specific legacy keys
    secureStorage.removeItem(AUTH_LOGGED_IN_KEY);
    secureStorage.removeItem(AUTH_ROLE_STORAGE_KEY);
    secureStorage.removeItem(AUTH_USER_DATA_KEY);
    localStorage.removeItem(AUTH_LOGGED_IN_KEY);
    localStorage.removeItem(AUTH_ROLE_STORAGE_KEY);
    localStorage.removeItem(AUTH_USER_DATA_KEY);
    localStorage.removeItem('dormplus_auth_logged_in');
    localStorage.removeItem('dormplus_auth_user_data');
    localStorage.removeItem('dormplus_current_user_role');

    // 5. Notify app of logout
    window.dispatchEvent(
      new CustomEvent('phatlada_auth_changed', {
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
