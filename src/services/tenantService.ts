import { Tenant, Gender } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'phatlada_real_tenants';

function getLocalTenants(): Tenant[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('dormplus_real_tenants');
  return data ? JSON.parse(data) : [];
}

function saveLocalTenants(tenants: Tenant[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tenants));
}

export async function fetchTenants(): Promise<Tenant[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((t) => ({
      id: t.id,
      title: t.title,
      firstName: t.first_name,
      lastName: t.last_name,
      gender: t.gender,
      phone: t.phone,
      avatarUrl: t.avatar_url,
      createdAt: t.created_at,
    }));
  }
  return getLocalTenants();
}

export async function createTenant(tenant: {
  title: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  phone?: string;
}): Promise<Tenant> {
  const newTenant: Tenant = {
    id: crypto.randomUUID(),
    title: tenant.title,
    firstName: tenant.firstName,
    lastName: tenant.lastName,
    gender: tenant.gender,
    phone: tenant.phone || null,
    avatarUrl: null,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('tenants')
      .insert([
        {
          id: newTenant.id,
          title: newTenant.title,
          first_name: newTenant.firstName,
          last_name: newTenant.lastName,
          gender: newTenant.gender,
          phone: newTenant.phone,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      firstName: data.first_name,
      lastName: data.last_name,
      gender: data.gender,
      phone: data.phone,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
    };
  }

  const list = getLocalTenants();
  list.unshift(newTenant);
  saveLocalTenants(list);
  return newTenant;
}

export async function updateTenant(
  id: string,
  updates: Partial<Omit<Tenant, 'id' | 'createdAt'>>
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
    if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;

    const { error } = await supabase.from('tenants').update(dbUpdates).eq('id', id);
    if (error) throw error;
    return;
  }

  const list = getLocalTenants().map((t) =>
    t.id === id ? { ...t, ...updates } : t
  );
  saveLocalTenants(list);
}

export async function deleteTenant(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('tenants').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  const list = getLocalTenants().filter((t) => t.id !== id);
  saveLocalTenants(list);
}

