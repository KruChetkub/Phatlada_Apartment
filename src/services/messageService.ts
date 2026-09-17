import { MessageItem } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'dormplus_real_messages';

function getLocalMessages(): MessageItem[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLocalMessages(items: MessageItem[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
}

export async function fetchMessages(): Promise<MessageItem[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch messages failed, fallback to local:', error);
      return getLocalMessages();
    }
    return (data || []).map((m) => ({
      id: m.id,
      dormitoryId: m.dormitory_id,
      recipientType: m.recipient_type,
      recipientId: m.recipient_id,
      recipientName: m.recipient_name,
      senderRole: m.sender_role,
      senderName: m.sender_name,
      title: m.title,
      content: m.content,
      isRead: m.is_read,
      priority: m.priority,
      createdAt: m.created_at,
    }));
  }
  return getLocalMessages();
}

export async function createMessage(input: {
  dormitoryId?: string;
  recipientType: 'ALL' | 'ROOM' | 'TENANT';
  recipientId?: string | null;
  recipientName?: string | null;
  senderRole?: 'OWNER' | 'MANAGER' | 'STAFF';
  senderName?: string;
  title: string;
  content: string;
  priority?: 'NORMAL' | 'URGENT';
}): Promise<MessageItem> {
  const newMessage: MessageItem = {
    id: crypto.randomUUID(),
    dormitoryId: input.dormitoryId || 'default-dorm',
    recipientType: input.recipientType,
    recipientId: input.recipientId || null,
    recipientName: input.recipientName || null,
    senderRole: input.senderRole || 'OWNER',
    senderName: input.senderName || 'ผู้ดูแลหอพัก',
    title: input.title.trim(),
    content: input.content.trim(),
    isRead: false,
    priority: input.priority || 'NORMAL',
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('messages').insert([
      {
        id: newMessage.id,
        dormitory_id: newMessage.dormitoryId,
        recipient_type: newMessage.recipientType,
        recipient_id: newMessage.recipientId,
        recipient_name: newMessage.recipientName,
        sender_role: newMessage.senderRole,
        sender_name: newMessage.senderName,
        title: newMessage.title,
        content: newMessage.content,
        is_read: newMessage.isRead,
        priority: newMessage.priority,
        created_at: newMessage.createdAt,
      },
    ]);
    if (error) {
      console.warn('Supabase insert message failed, saved locally:', error);
    }
  }

  const list = getLocalMessages();
  saveLocalMessages([newMessage, ...list]);
  return newMessage;
}

export async function markMessageAsRead(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('messages').update({ is_read: true }).eq('id', id);
  }
  const list = getLocalMessages();
  const updated = list.map((m) => (m.id === id ? { ...m, isRead: true } : m));
  saveLocalMessages(updated);
}

export async function toggleMessageRead(id: string): Promise<void> {
  const list = getLocalMessages();
  const target = list.find((m) => m.id === id);
  const nextVal = target ? !target.isRead : true;

  if (isSupabaseConfigured && supabase) {
    await supabase.from('messages').update({ is_read: nextVal }).eq('id', id);
  }
  const updated = list.map((m) => (m.id === id ? { ...m, isRead: nextVal } : m));
  saveLocalMessages(updated);
}

export async function deleteMessage(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('messages').delete().eq('id', id);
  }
  const list = getLocalMessages();
  const updated = list.filter((m) => m.id !== id);
  saveLocalMessages(updated);
}

