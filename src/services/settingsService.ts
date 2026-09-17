import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface DormSettings {
  dormitoryId: string;
  dormitoryName: string;
  address: string;
  phone: string;
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

  // Preferences
  notifyNewMaintenance: boolean;
  notifyPaymentReceived: boolean;
  notifyLeaseExpiringDays: number;
}

export const defaultSettings: DormSettings = {
  dormitoryId: 'default-dorm',
  dormitoryName: 'ภัทร์ลดาอพาร์ทเมนท์',
  address: 'เลขที่ 516 ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.นครราชสีมา',
  phone: '081-234-5678',
  taxId: '',
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

  userDisplayName: 'คุณเจ้าของหอพัก',
  userEmail: '',
  userPhone: '',
  userRole: 'OWNER',

  notifyNewMaintenance: true,
  notifyPaymentReceived: true,
  notifyLeaseExpiringDays: 30,
};

const SETTINGS_STORAGE_KEY = 'dormplus_system_settings';

export function getLocalSettings(): DormSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export async function fetchSettings(): Promise<DormSettings> {
  const local = getLocalSettings();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('dormitories')
        .select('id, name, plan')
        .limit(1)
        .single();
      if (!error && data) {
        return {
          ...local,
          dormitoryId: data.id,
          dormitoryName: data.name,
          plan: data.plan,
        };
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
      await supabase
        .from('dormitories')
        .update({ name: merged.dormitoryName, plan: merged.plan })
        .eq('id', merged.dormitoryId);
    } catch (err) {
      console.warn('Supabase update dormitory error:', err);
    }
  }

  // Dispatch custom event to notify components (Topbar, Sidebar)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dormplus_settings_updated', { detail: merged }));
  }

  return merged;
}

export function exportBackupJson(): string {
  const backup = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    settings: getLocalSettings(),
    rooms: localStorage.getItem('dormplus_real_rooms') || '[]',
    tenants: localStorage.getItem('dormplus_real_tenants') || '[]',
    leases: localStorage.getItem('dormplus_real_leases') || '[]',
    payments: localStorage.getItem('dormplus_real_payments') || '[]',
    expenses: localStorage.getItem('dormplus_real_expenses') || '[]',
    maintenance: localStorage.getItem('dormplus_real_maintenance') || '[]',
    messages: localStorage.getItem('dormplus_real_messages') || '[]',
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
      localStorage.setItem('dormplus_real_rooms', typeof parsed.rooms === 'string' ? parsed.rooms : JSON.stringify(parsed.rooms));
    }
    if (parsed.tenants) {
      localStorage.setItem('dormplus_real_tenants', typeof parsed.tenants === 'string' ? parsed.tenants : JSON.stringify(parsed.tenants));
    }
    if (parsed.leases) {
      localStorage.setItem('dormplus_real_leases', typeof parsed.leases === 'string' ? parsed.leases : JSON.stringify(parsed.leases));
    }
    if (parsed.payments) {
      localStorage.setItem('dormplus_real_payments', typeof parsed.payments === 'string' ? parsed.payments : JSON.stringify(parsed.payments));
    }
    if (parsed.expenses) {
      localStorage.setItem('dormplus_real_expenses', typeof parsed.expenses === 'string' ? parsed.expenses : JSON.stringify(parsed.expenses));
    }
    if (parsed.maintenance) {
      localStorage.setItem('dormplus_real_maintenance', typeof parsed.maintenance === 'string' ? parsed.maintenance : JSON.stringify(parsed.maintenance));
    }
    if (parsed.messages) {
      localStorage.setItem('dormplus_real_messages', typeof parsed.messages === 'string' ? parsed.messages : JSON.stringify(parsed.messages));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dormplus_settings_updated', { detail: parsed.settings }));
    }
    return true;
  } catch (err) {
    console.error('Import backup failed:', err);
    return false;
  }
}

export function resetAllData(): void {
  const keys = [
    'dormplus_real_rooms',
    'dormplus_real_tenants',
    'dormplus_real_leases',
    'dormplus_real_payments',
    'dormplus_real_expenses',
    'dormplus_real_maintenance',
    'dormplus_real_messages',
    SETTINGS_STORAGE_KEY,
  ];
  keys.forEach((k) => localStorage.removeItem(k));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dormplus_settings_updated', { detail: defaultSettings }));
  }
}

