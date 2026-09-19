import { NotificationItem, NotificationType } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getOrEnsureDormitoryId } from './settingsService';

const NOTIF_STORAGE_KEY = 'phatlada_real_notifications';

export function getLocalNotifications(): NotificationItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY) || localStorage.getItem('dormplus_real_notifications');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalNotifications(items: NotificationItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

/**
 * Fetch all notifications from Supabase or local storage,
 * and auto-synchronize with recent messages/inquiries/maintenance.
 */
export async function fetchNotifications(): Promise<NotificationItem[]> {
  let dbItems: NotificationItem[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        dbItems = data.map((n) => ({
          id: n.id,
          dormitoryId: n.dormitory_id,
          type: n.type as NotificationType,
          title: n.title,
          body: n.body,
          href: n.href,
          readAt: n.read_at,
          createdAt: n.created_at,
        }));
      }
    } catch {
      // ignore
    }
  }

  // Combine with local items to avoid losing locally created notifications
  const localItems = getLocalNotifications();
  const itemMap = new Map<string, NotificationItem>();
  [...dbItems, ...localItems].forEach((item) => {
    if (!itemMap.has(item.id)) {
      itemMap.set(item.id, item);
    }
  });

  const allNotifications = Array.from(itemMap.values());

  // Auto-sync notifications from recent messages/booking inquiries
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (messages && messages.length > 0) {
        messages.forEach((msg) => {
          const exists = allNotifications.some(
            (n) => n.id === `notif-msg-${msg.id}` || n.title === msg.title
          );
          if (!exists) {
            const newNotif: NotificationItem = {
              id: `notif-msg-${msg.id}`,
              dormitoryId: msg.dormitory_id,
              type: 'ROOM_AVAILABLE',
              title: msg.title || 'มีข้อความ/การนัดหมายใหม่',
              body: msg.content ? msg.content.slice(0, 120) : '',
              href: '/messages',
              readAt: msg.is_read ? new Date().toISOString() : null,
              createdAt: msg.created_at || new Date().toISOString(),
            };
            allNotifications.unshift(newNotif);
          }
        });
      }
    } catch {
      // ignore
    }
  }

  // Sort descending by date
  allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  saveLocalNotifications(allNotifications);
  return allNotifications;
}

/**
 * Get total count of unread notifications
 */
export async function getUnreadNotificationsCount(): Promise<number> {
  try {
    const list = await fetchNotifications();
    return list.filter((n) => !n.readAt).length;
  } catch {
    const local = getLocalNotifications();
    return local.filter((n) => !n.readAt).length;
  }
}

/**
 * Create a new notification and broadcast event
 */
export async function createNotification(input: {
  dormitoryId?: string;
  type: NotificationType;
  title: string;
  body: string;
  href?: string;
}): Promise<NotificationItem> {
  const dormId = input.dormitoryId || (await getOrEnsureDormitoryId());
  const newNotif: NotificationItem = {
    id: crypto.randomUUID(),
    dormitoryId: dormId,
    type: input.type,
    title: input.title.trim(),
    body: input.body.trim(),
    href: input.href || null,
    readAt: null,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('notifications').insert([
        {
          id: newNotif.id,
          dormitory_id: newNotif.dormitoryId,
          type: newNotif.type,
          title: newNotif.title,
          body: newNotif.body,
          href: newNotif.href,
          created_at: newNotif.createdAt,
        },
      ]);
    } catch {
      // If RLS blocks insert, save locally
    }
  }

  const list = getLocalNotifications();
  const updated = [newNotif, ...list];
  saveLocalNotifications(updated);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('phatlada_notifications_updated', {
        detail: { count: updated.filter((n) => !n.readAt).length },
      })
    );
  }

  return newNotif;
}

/**
 * Mark a single notification as read/unread
 */
export async function toggleNotificationRead(id: string): Promise<void> {
  const list = getLocalNotifications();
  const target = list.find((n) => n.id === id);
  const nextVal = target?.readAt ? null : new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('notifications').update({ read_at: nextVal }).eq('id', id);
    } catch {
      // ignore
    }
  }

  const updated = list.map((n) => (n.id === id ? { ...n, readAt: nextVal } : n));
  saveLocalNotifications(updated);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('phatlada_notifications_updated', {
        detail: { count: updated.filter((n) => !n.readAt).length },
      })
    );
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('notifications').update({ read_at: now }).is('read_at', null);
    } catch {
      // ignore
    }
  }

  const list = getLocalNotifications();
  const updated = list.map((n) => ({ ...n, readAt: n.readAt || now }));
  saveLocalNotifications(updated);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('phatlada_notifications_updated', {
        detail: { count: 0 },
      })
    );
  }
}
