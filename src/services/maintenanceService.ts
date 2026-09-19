import { MaintenanceRequest, MaintenanceStatus } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface MaintenanceWithRoom extends MaintenanceRequest {
  roomNumber?: string;
}

const LOCAL_STORAGE_KEY = 'phatlada_real_maintenance';

function getLocalMaintenance(): MaintenanceWithRoom[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('dormplus_real_maintenance');
  return data ? JSON.parse(data) : [];
}

function saveLocalMaintenance(items: MaintenanceWithRoom[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
}

export async function fetchMaintenance(): Promise<MaintenanceWithRoom[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .select('*, rooms(number)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((m) => ({
      id: m.id,
      roomId: m.room_id,
      title: m.title,
      status: m.status,
      createdAt: m.created_at,
      roomNumber: m.rooms?.number,
    }));
  }
  return getLocalMaintenance();
}

export async function createMaintenance(ticket: {
  roomId: string;
  title: string;
  roomNumber?: string;
}): Promise<MaintenanceWithRoom> {
  const newTicket: MaintenanceWithRoom = {
    id: crypto.randomUUID(),
    roomId: ticket.roomId,
    title: ticket.title,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    roomNumber: ticket.roomNumber,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert([
        {
          id: newTicket.id,
          room_id: newTicket.roomId,
          title: newTicket.title,
          status: 'PENDING',
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return { ...newTicket, id: data.id };
  }

  const list = getLocalMaintenance();
  list.unshift(newTicket);
  saveLocalMaintenance(list);
  return newTicket;
}

export async function updateMaintenanceStatus(
  id: string,
  status: MaintenanceStatus
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('maintenance_requests')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
    return;
  }

  const list = getLocalMaintenance().map((m) => (m.id === id ? { ...m, status } : m));
  saveLocalMaintenance(list);
}

export async function deleteMaintenance(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('maintenance_requests')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return;
  }

  const list = getLocalMaintenance().filter((m) => m.id !== id);
  saveLocalMaintenance(list);
}

