import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface DormSettings {
  dormitoryId: string;
  dormitoryName: string;
  address: string;
  phone: string;
  phone2?: string;
  taxId: string;
  plan: 'FREE' | 'PREMIUM';

  // Billing & Utilities
  waterRatePerUnit: number;
  electricRatePerUnit: number;
  commonFeeMonthly: number;
  billingCycleDay: number;
  dueDay: number;
  lateFeePerDay: number;

  // Bank & Payment
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  promptPayId: string;

  // User Profile
  userDisplayName: string;
  userEmail: string;
  userPhone: string;
  userRole: 'OWNER' | 'MANAGER' | 'STAFF';

  // Landing Page Rates & Promo
  landingStartingPrice: number;
  landingDailyPrice: number;
  landingOriginalPrice: number;
  landingPromoText: string;

  // Preferences
  notifyNewMaintenance: boolean;
  notifyPaymentReceived: boolean;
  notifyLeaseExpiringDays: number;

  // Security & Session
  autoLogoutEnabled: boolean;
  autoLogoutMinutes: number;
  clearCookiesOnLogout: boolean;
}

export const defaultSettings: DormSettings = {
  dormitoryId: '7a4f08df-e922-4ba7-b3ad-3fb45ff64f88',
  dormitoryName: 'ภัทร์ลดา อพาร์ทเมนท์',
  address: '79 หมู่ 7 เวียง อำเภอ เชียงของ เชียงราย 57140',
  phone: '087 188 9122',
  phone2: '0918517221',
  taxId: '0105559999999',
  plan: 'PREMIUM',

  waterRatePerUnit: 18,
  electricRatePerUnit: 8,
  commonFeeMonthly: 0,
  billingCycleDay: 25,
  dueDay: 5,
  lateFeePerDay: 50,

  bankName: 'ธนาคารกสิกรไทย',
  bankAccountNumber: '',
  bankAccountName: '',
  promptPayId: '',

  userDisplayName: 'คุณเชษฐ์ (เจ้าของหอพัก)',
  userEmail: 'chetnarak2531@gmail.com',
  userPhone: '087 188 9122',
  userRole: 'OWNER',

  landingStartingPrice: 3500,
  landingDailyPrice: 500,
  landingOriginalPrice: 4000,
  landingPromoText: 'โปรโมชั่นห้องใหม่: จองวันนี้รับส่วนลดค่าประกันและฟรี Wi-Fi ทันที',

  notifyNewMaintenance: true,
  notifyPaymentReceived: true,
  notifyLeaseExpiringDays: 30,

  autoLogoutEnabled: true,
  autoLogoutMinutes: 30,
  clearCookiesOnLogout: true,
};

const SETTINGS_STORAGE_KEY = 'phatlada_system_settings';

export function getLocalSettings(): DormSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY) || localStorage.getItem('dormplus_system_settings');
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getOrEnsureDormitoryId(): Promise<string> {
  const local = getLocalSettings();
  if (local.dormitoryId && UUID_REGEX.test(local.dormitoryId)) {
    return local.dormitoryId;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: existing } = await supabase.from('dormitories').select('id').limit(1);
      if (existing && existing.length > 0) {
        local.dormitoryId = existing[0].id;
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(local));
        return existing[0].id;
      }

      const { data: inserted, error: insertErr } = await supabase
        .from('dormitories')
        .insert({
          name: local.dormitoryName || 'ภัทร์ลดา อพาร์ทเมนท์',
          plan: local.plan || 'PREMIUM',
        })
        .select('id')
        .single();

      if (!insertErr && inserted) {
        local.dormitoryId = inserted.id;
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(local));
        return inserted.id;
      }
    } catch (err) {
      console.warn('Supabase ensure dormitory error:', err);
    }
  }

  return local.dormitoryId || crypto.randomUUID();
}

export async function fetchSettings(): Promise<DormSettings> {
  const local = getLocalSettings();
  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Fetch dormitory record
      const { data: dormData, error: dormError } = await supabase
        .from('dormitories')
        .select('*')
        .limit(1);

      // 2. Fetch min room rent
      let minRoomRentBaht: number | null = null;
      try {
        const { data: roomData } = await supabase
          .from('rooms')
          .select('monthly_rent')
          .order('monthly_rent', { ascending: true })
          .limit(1);

        if (roomData && roomData.length > 0 && roomData[0].monthly_rent) {
          minRoomRentBaht = Math.round(roomData[0].monthly_rent / 100);
        }
      } catch {
        // ignore room query error
      }

      // 3. Fetch admin user from public.users
      let dbUser: Record<string, unknown> | null = null;
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .limit(1);
        if (userData && userData.length > 0) {
          dbUser = userData[0] as Record<string, unknown>;
        }
      } catch {
        // ignore users query error
      }

      if (!dormError && dormData && dormData.length > 0) {
        const dorm = dormData[0] as Record<string, unknown>;
        let remoteSettings: Partial<DormSettings> = {};

        if (dorm.settings) {
          if (typeof dorm.settings === 'string') {
            try {
              remoteSettings = JSON.parse(dorm.settings);
            } catch {
              remoteSettings = {};
            }
          } else if (typeof dorm.settings === 'object' && dorm.settings !== null) {
            remoteSettings = dorm.settings as Partial<DormSettings>;
          }
        }

        const updated: DormSettings = {
          ...defaultSettings,
          ...local,
          ...remoteSettings,
          dormitoryId: (dorm.id as string) || local.dormitoryId,
          dormitoryName: (dorm.name as string) || (remoteSettings.dormitoryName as string) || local.dormitoryName,
          plan: ((dorm.plan as 'FREE' | 'PREMIUM') || (remoteSettings.plan as 'FREE' | 'PREMIUM') || local.plan) as 'FREE' | 'PREMIUM',
          userDisplayName: (dbUser?.display_name as string) || defaultSettings.userDisplayName,
          userEmail: (dbUser?.email as string) || defaultSettings.userEmail,
          userRole: ((dbUser?.role as 'OWNER' | 'MANAGER' | 'STAFF') || defaultSettings.userRole) as 'OWNER' | 'MANAGER' | 'STAFF',
        };

        if (minRoomRentBaht && minRoomRentBaht > 0) {
          updated.landingStartingPrice = minRoomRentBaht;
        }

        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('phatlada_settings_updated', { detail: updated }));
        }

        return updated;
      }
    } catch {
      // ignore, fallback to local
    }
  }
  return local;
}

export async function saveSettings(updates: Partial<DormSettings>): Promise<DormSettings> {
  const current = getLocalSettings();
  const merged: DormSettings = { ...current, ...updates };

  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));

  if (isSupabaseConfigured && supabase) {
    try {
      // Sync user profile if updated
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          await supabase.from('users').upsert({
            id: sessionData.session.user.id,
            email: merged.userEmail || sessionData.session.user.email,
            display_name: merged.userDisplayName,
            role: merged.userRole,
          });
        }
      } catch {
        // ignore user sync error
      }

      // 1. If we have a valid UUID for dormitoryId, update it
      if (merged.dormitoryId && UUID_REGEX.test(merged.dormitoryId)) {
        const { error: updateErr } = await supabase
          .from('dormitories')
          .update({
            name: merged.dormitoryName,
            plan: merged.plan,
            settings: merged,
          })
          .eq('id', merged.dormitoryId);

        if (updateErr) {
          // If 'settings' column doesn't exist, fallback to updating name and plan only
          await supabase
            .from('dormitories')
            .update({ name: merged.dormitoryName, plan: merged.plan })
            .eq('id', merged.dormitoryId);
        }
      } else {
        // 2. Check if a dormitory already exists in Supabase
        const { data: existing } = await supabase
          .from('dormitories')
          .select('id')
          .limit(1);

        if (existing && existing.length > 0) {
          merged.dormitoryId = existing[0].id;
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));

          const { error: updateErr } = await supabase
            .from('dormitories')
            .update({
              name: merged.dormitoryName,
              plan: merged.plan,
              settings: merged,
            })
            .eq('id', existing[0].id);

          if (updateErr) {
            await supabase
              .from('dormitories')
              .update({ name: merged.dormitoryName, plan: merged.plan })
              .eq('id', existing[0].id);
          }
        } else {
          // 3. No dormitory exists yet -> insert the initial one
          const { data: inserted, error: insertErr } = await supabase
            .from('dormitories')
            .insert({
              name: merged.dormitoryName || 'ภัทร์ลดา อพาร์ทเมนท์',
              plan: merged.plan || 'PREMIUM',
              settings: merged,
            })
            .select('id, name, plan')
            .single();

          if (insertErr) {
            const { data: fallbackInserted } = await supabase
              .from('dormitories')
              .insert({
                name: merged.dormitoryName || 'ภัทร์ลดา อพาร์ทเมนท์',
                plan: merged.plan || 'PREMIUM',
              })
              .select('id, name, plan')
              .single();

            if (fallbackInserted) {
              merged.dormitoryId = fallbackInserted.id;
              localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
            }
          } else if (inserted) {
            merged.dormitoryId = inserted.id;
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
          }
        }
      }
    } catch (err) {
      console.warn('Supabase sync settings error:', err);
    }
  }

  // Dispatch custom event to notify components (Topbar, Sidebar, Landing components)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('phatlada_settings_updated', { detail: merged }));
  }

  return merged;
}

export function exportBackupJson(): string {
  const backup = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    settings: getLocalSettings(),
    rooms: localStorage.getItem('phatlada_real_rooms') || localStorage.getItem('dormplus_real_rooms') || '[]',
    tenants: localStorage.getItem('phatlada_real_tenants') || localStorage.getItem('dormplus_real_tenants') || '[]',
    leases: localStorage.getItem('phatlada_real_leases') || localStorage.getItem('dormplus_real_leases') || '[]',
    payments: localStorage.getItem('phatlada_real_payments') || localStorage.getItem('dormplus_real_payments') || '[]',
    expenses: localStorage.getItem('phatlada_real_expenses') || localStorage.getItem('dormplus_real_expenses') || '[]',
    maintenance: localStorage.getItem('phatlada_real_maintenance') || localStorage.getItem('dormplus_real_maintenance') || '[]',
    messages: localStorage.getItem('phatlada_real_messages') || localStorage.getItem('dormplus_real_messages') || '[]',
  };
  return JSON.stringify(backup, null, 2);
}

export function importBackupJson(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.version) return false;

    if (parsed.settings) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(parsed.settings));
    }
    if (parsed.rooms) {
      localStorage.setItem('phatlada_real_rooms', typeof parsed.rooms === 'string' ? parsed.rooms : JSON.stringify(parsed.rooms));
    }
    if (parsed.tenants) {
      localStorage.setItem('phatlada_real_tenants', typeof parsed.tenants === 'string' ? parsed.tenants : JSON.stringify(parsed.tenants));
    }
    if (parsed.leases) {
      localStorage.setItem('phatlada_real_leases', typeof parsed.leases === 'string' ? parsed.leases : JSON.stringify(parsed.leases));
    }
    if (parsed.payments) {
      localStorage.setItem('phatlada_real_payments', typeof parsed.payments === 'string' ? parsed.payments : JSON.stringify(parsed.payments));
    }
    if (parsed.expenses) {
      localStorage.setItem('phatlada_real_expenses', typeof parsed.expenses === 'string' ? parsed.expenses : JSON.stringify(parsed.expenses));
    }
    if (parsed.maintenance) {
      localStorage.setItem('phatlada_real_maintenance', typeof parsed.maintenance === 'string' ? parsed.maintenance : JSON.stringify(parsed.maintenance));
    }
    if (parsed.messages) {
      localStorage.setItem('phatlada_real_messages', typeof parsed.messages === 'string' ? parsed.messages : JSON.stringify(parsed.messages));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('phatlada_settings_updated', { detail: parsed.settings }));
    }
    return true;
  } catch (err) {
    console.error('Import backup failed:', err);
    return false;
  }
}

export function resetAllData(): void {
  const keys = [
    'phatlada_real_rooms',
    'phatlada_real_tenants',
    'phatlada_real_leases',
    'phatlada_real_payments',
    'phatlada_real_expenses',
    'phatlada_real_maintenance',
    'phatlada_real_messages',
    'dormplus_real_rooms',
    'dormplus_real_tenants',
    'dormplus_real_leases',
    'dormplus_real_payments',
    'dormplus_real_expenses',
    'dormplus_real_maintenance',
    'dormplus_real_messages',
    SETTINGS_STORAGE_KEY,
    'dormplus_system_settings',
  ];
  keys.forEach((k) => localStorage.removeItem(k));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('phatlada_settings_updated', { detail: defaultSettings }));
  }
}

