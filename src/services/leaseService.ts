import { Lease, LeaseStatus } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { secureStorage } from '../lib/secureStorage';
import { updateRoom } from './roomService';

export interface LeaseWithDetails extends Lease {
  roomNumber?: string;
  tenantName?: string;
}

const LOCAL_STORAGE_KEY = 'phatlada_real_leases';

function getLocalLeases(): LeaseWithDetails[] {
  const data = secureStorage.getItem<LeaseWithDetails[]>(LOCAL_STORAGE_KEY) || 
               secureStorage.getItem<LeaseWithDetails[]>('dormplus_real_leases');
  return Array.isArray(data) ? data : [];
}

function saveLocalLeases(leases: LeaseWithDetails[]): void {
  secureStorage.setItem(LOCAL_STORAGE_KEY, leases);
}

export async function fetchLeases(): Promise<LeaseWithDetails[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('leases')
      .select('*, rooms(number), tenants(title, first_name, last_name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((l) => ({
      id: l.id,
      roomId: l.room_id,
      tenantId: l.tenant_id,
      startDate: l.start_date,
      endDate: l.end_date,
      rent: l.rent,
      deposit: l.deposit,
      status: l.status,
      createdAt: l.created_at,
      roomNumber: l.rooms?.number,
      tenantName: l.tenants
        ? `${l.tenants.title || ''}${l.tenants.first_name} ${l.tenants.last_name}`
        : undefined,
    }));
  }
  return getLocalLeases();
}

export async function createLease(lease: {
  roomId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  rent: number; // satang
  deposit: number; // satang
  roomNumber?: string;
  tenantName?: string;
}): Promise<LeaseWithDetails> {
  const newLease: LeaseWithDetails = {
    id: crypto.randomUUID(),
    roomId: lease.roomId,
    tenantId: lease.tenantId,
    startDate: lease.startDate,
    endDate: lease.endDate,
    rent: lease.rent,
    deposit: lease.deposit,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    roomNumber: lease.roomNumber,
    tenantName: lease.tenantName,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('leases')
      .insert([
        {
          id: newLease.id,
          room_id: newLease.roomId,
          tenant_id: newLease.tenantId,
          start_date: newLease.startDate,
          end_date: newLease.endDate,
          rent: newLease.rent,
          deposit: newLease.deposit,
          status: 'ACTIVE',
        },
      ])
      .select()
      .single();
    if (error) throw error;
    await updateRoom(lease.roomId, { status: 'OCCUPIED' });
    return {
      ...newLease,
      id: data.id,
    };
  }

  const list = getLocalLeases();
  list.unshift(newLease);
  saveLocalLeases(list);
  await updateRoom(lease.roomId, { status: 'OCCUPIED' });
  return newLease;
}

export async function updateLeaseStatus(
  id: string,
  roomId: string,
  status: LeaseStatus
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('leases').update({ status }).eq('id', id);
    if (error) throw error;
    if (status !== 'ACTIVE') {
      await updateRoom(roomId, { status: 'VACANT' });
    }
    return;
  }

  const list = getLocalLeases().map((l) => (l.id === id ? { ...l, status } : l));
  saveLocalLeases(list);
  if (status !== 'ACTIVE') {
    await updateRoom(roomId, { status: 'VACANT' });
  }
}

export async function deleteLease(id: string, roomId?: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('leases').delete().eq('id', id);
    if (error) throw error;
    if (roomId) await updateRoom(roomId, { status: 'VACANT' });
    return;
  }

  const list = getLocalLeases().filter((l) => l.id !== id);
  saveLocalLeases(list);
  if (roomId) await updateRoom(roomId, { status: 'VACANT' });
}

