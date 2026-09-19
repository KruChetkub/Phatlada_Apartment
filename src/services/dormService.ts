import { Dormitory, PlanType } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getLocalSettings } from './settingsService';

const DORM_LIST_STORAGE_KEY = 'phatlada_dormitories_list';
const ACTIVE_DORM_STORAGE_KEY = 'phatlada_active_dorm_id';

export function getLocalDormitories(): Dormitory[] {
  const currentSettings = getLocalSettings();
  const defaultList: Dormitory[] = [
    {
      id: currentSettings.dormitoryId || 'default-dorm',
      name: currentSettings.dormitoryName || 'หอพักของฉัน',
      plan: currentSettings.plan || 'PREMIUM',
      createdAt: new Date().toISOString(),
    },
  ];

  try {
    const raw = localStorage.getItem(DORM_LIST_STORAGE_KEY) || localStorage.getItem('dormplus_dormitories_list');
    if (!raw) return defaultList;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultList;
  } catch {
    return defaultList;
  }
}

export function saveLocalDormitories(list: Dormitory[]): void {
  localStorage.setItem(DORM_LIST_STORAGE_KEY, JSON.stringify(list));
}

export function getActiveDormitoryId(): string {
  const list = getLocalDormitories();
  const saved = localStorage.getItem(ACTIVE_DORM_STORAGE_KEY) || localStorage.getItem('dormplus_active_dorm_id');
  if (saved && list.some((d) => d.id === saved)) return saved;
  return list[0]?.id || 'default-dorm';
}

export function setActiveDormitoryId(dormId: string): void {
  localStorage.setItem(ACTIVE_DORM_STORAGE_KEY, dormId);
  const list = getLocalDormitories();
  const target = list.find((d) => d.id === dormId);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('phatlada_dormitory_switched', {
        detail: target || { id: dormId, name: 'หอพักที่เลือก' },
      })
    );
  }
}

export async function fetchDormitories(): Promise<Dormitory[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('dormitories').select('*').order('created_at', { ascending: true });
    if (!error && data && data.length > 0) {
      const dorms: Dormitory[] = data.map((d) => ({
        id: d.id,
        name: d.name,
        plan: d.plan,
        createdAt: d.created_at,
      }));
      saveLocalDormitories(dorms);
      return dorms;
    }
  }
  return getLocalDormitories();
}

export async function createDormitory(input: {
  name: string;
  plan?: PlanType;
}): Promise<Dormitory> {
  const newDorm: Dormitory = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    plan: input.plan || 'PREMIUM',
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    await supabase.from('dormitories').insert([
      {
        id: newDorm.id,
        name: newDorm.name,
        plan: newDorm.plan,
      },
    ]);
  }

  const list = getLocalDormitories();
  const updated = [...list, newDorm];
  saveLocalDormitories(updated);
  setActiveDormitoryId(newDorm.id);
  return newDorm;
}

