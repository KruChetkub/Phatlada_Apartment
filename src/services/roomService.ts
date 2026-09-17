import { Room, RoomStatus } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'dormplus_real_rooms';

function getLocalRooms(): Room[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLocalRooms(rooms: Room[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rooms));
}

export async function fetchRooms(): Promise<Room[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('number', { ascending: true });
    if (error) throw error;
    return (data || []).map((r) => ({
      id: r.id,
      dormitoryId: r.dormitory_id,
      number: r.number,
      floor: r.floor,
      monthlyRent: r.monthly_rent,
      status: r.status,
      coverImageUrl: r.cover_image_url,
      updatedAt: r.updated_at,
    }));
  }
  return getLocalRooms();
}

export async function createRoom(room: {
  number: string;
  floor: number;
  monthlyRent: number; // satang
  status?: RoomStatus;
}): Promise<Room> {
  const newRoom: Room = {
    id: crypto.randomUUID(),
    dormitoryId: 'default-dorm',
    number: room.number,
    floor: room.floor,
    monthlyRent: room.monthlyRent,
    status: room.status || 'VACANT',
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('rooms')
      .insert([
        {
          id: newRoom.id,
          dormitory_id: '00000000-0000-0000-0000-000000000002',
          number: newRoom.number,
          floor: newRoom.floor,
          monthly_rent: newRoom.monthlyRent,
          status: newRoom.status,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      dormitoryId: data.dormitory_id,
      number: data.number,
      floor: data.floor,
      monthlyRent: data.monthly_rent,
      status: data.status,
      updatedAt: data.updated_at,
    };
  }

  const list = getLocalRooms();
  list.push(newRoom);
  saveLocalRooms(list);
  return newRoom;
}

export async function updateRoom(
  id: string,
  updates: Partial<Omit<Room, 'id' | 'dormitoryId'>>
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.number !== undefined) dbUpdates.number = updates.number;
    if (updates.floor !== undefined) dbUpdates.floor = updates.floor;
    if (updates.monthlyRent !== undefined) dbUpdates.monthly_rent = updates.monthlyRent;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    dbUpdates.updated_at = new Date().toISOString();

    const { error } = await supabase.from('rooms').update(dbUpdates).eq('id', id);
    if (error) throw error;
    return;
  }

  const list = getLocalRooms().map((r) =>
    r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
  );
  saveLocalRooms(list);
}

export async function deleteRoom(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  const list = getLocalRooms().filter((r) => r.id !== id);
  saveLocalRooms(list);
}

