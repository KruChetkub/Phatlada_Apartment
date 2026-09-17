import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Wrench,
  Search,
  CheckCheck,
  Clock,
} from 'lucide-react';
import { NotificationItem, NotificationType } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { formatThaiDateShort, formatThaiTime, formatRelativeTh } from '../lib/format';
import { EmptyState } from '../components/common/EmptyState';

const NOTIF_STORAGE_KEY = 'dormplus_real_notifications';

function getLocalNotifications(): NotificationItem[] {
  const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveLocalNotifications(items: NotificationItem[]): void {
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(items));
}

type NotifFilter = 'ALL' | 'MAINTENANCE_NEW' | 'PAYMENT_RECEIVED' | 'LEASE_EXPIRING' | 'UNREAD';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<NotifFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          const mapped = data.map((n) => ({
            id: n.id,
            dormitoryId: n.dormitory_id,
            type: n.type as NotificationType,
            title: n.title,
            body: n.body,
            href: n.href,
            readAt: n.read_at,
            createdAt: n.created_at,
          }));
          setNotifications(mapped);
          saveLocalNotifications(mapped);
          return;
        }
      }
      setNotifications(getLocalNotifications());
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.readAt).length;
    const maintenance = notifications.filter((n) => n.type === 'MAINTENANCE_NEW').length;
    const payments = notifications.filter((n) => n.type === 'PAYMENT_RECEIVED').length;
    const leases = notifications.filter((n) => n.type === 'LEASE_EXPIRING').length;
    return { total, unread, maintenance, payments, leases };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === 'UNREAD' && n.readAt) return false;
      if (activeFilter !== 'ALL' && activeFilter !== 'UNREAD' && n.type !== activeFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
      }
      return true;
    });
  }, [notifications, activeFilter, searchQuery]);

  const handleMarkAllAsRead = async () => {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      await supabase.from('notifications').update({ read_at: now }).is('read_at', null);
    }
    const updated = notifications.map((n) => ({ ...n, readAt: n.readAt || now }));
    setNotifications(updated);
    saveLocalNotifications(updated);
  };

  const handleToggleRead = async (id: string) => {
    const target = notifications.find((n) => n.id === id);
    const nextVal = target?.readAt ? null : new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      await supabase.from('notifications').update({ read_at: nextVal }).eq('id', id);
    }
    const updated = notifications.map((n) => (n.id === id ? { ...n, readAt: nextVal } : n));
    setNotifications(updated);
    saveLocalNotifications(updated);
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'MAINTENANCE_NEW':
        return <Wrench className="h-4 w-4 text-tone-amber-solid" />;
      case 'PAYMENT_RECEIVED':
        return <DollarSign className="h-4 w-4 text-tone-green-solid" />;
      case 'LEASE_EXPIRING':
        return <AlertTriangle className="h-4 w-4 text-tone-red-solid" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            <span>ศูนย์การแจ้งเตือน (Notifications)</span>
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            ติดตามความเคลื่อนไหว งานแจ้งซ่อม ยอดชำระเงิน และการต่อสัญญาเช่า
          </p>
        </div>

        {stats.unread > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center space-x-1.5 bg-surface hover:bg-bg text-ink border border-line px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition self-start sm:self-auto"
          >
            <CheckCheck className="h-4 w-4 text-primary" />
            <span>ทำเครื่องหมายว่าอ่านแล้วทั้งหมด</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3 rounded-xl border border-line">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeFilter === 'ALL'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface-secondary'
            }`}
          >
            ทั้งหมด ({stats.total})
          </button>
          <button
            onClick={() => setActiveFilter('UNREAD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeFilter === 'UNREAD'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface-secondary'
            }`}
          >
            ยังไม่อ่าน ({stats.unread})
          </button>
          <button
            onClick={() => setActiveFilter('MAINTENANCE_NEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeFilter === 'MAINTENANCE_NEW'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface-secondary'
            }`}
          >
            แจ้งซ่อม ({stats.maintenance})
          </button>
          <button
            onClick={() => setActiveFilter('PAYMENT_RECEIVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeFilter === 'PAYMENT_RECEIVED'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface-secondary'
            }`}
          >
            การชำระเงิน ({stats.payments})
          </button>
          <button
            onClick={() => setActiveFilter('LEASE_EXPIRING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeFilter === 'LEASE_EXPIRING'
                ? 'bg-primary text-white'
                : 'text-ink-secondary hover:text-ink hover:bg-surface-secondary'
            }`}
          >
            สัญญาเช่า ({stats.leases})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-secondary" />
          <input
            type="text"
            placeholder="ค้นหาการแจ้งเตือน..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-bg border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-ink"
          />
        </div>
      </div>

      {/* Notifications Feed */}
      {loading ? (
        <div className="py-12 text-center text-ink-secondary text-sm">กำลังโหลดการแจ้งเตือน...</div>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={searchQuery ? 'ไม่พบการแจ้งเตือนที่ตรงกับการค้นหา' : 'ยังไม่มีการแจ้งเตือนในขณะนี้'}
          description="เมื่อมีรายการแจ้งซ่อม ชำระเงิน หรือสัญญาเช่าใกล้หมดอายุ ระบบจะแสดงการแจ้งเตือนที่นี่โดยอัตโนมัติ"
        />
      ) : (
        <div className="space-y-2.5">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleToggleRead(notif.id)}
              className={`p-4 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition ${
                notif.readAt
                  ? 'bg-surface border-line hover:border-line-dark'
                  : 'bg-primary/[0.04] border-primary/30 shadow-xs'
              }`}
            >
              <div className="flex items-start space-x-3 min-w-0">
                <div className="p-2 rounded-xl bg-bg border border-line flex-shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className={`text-xs font-bold ${notif.readAt ? 'text-ink' : 'text-primary'}`}>
                      {notif.title}
                    </h4>
                    {!notif.readAt && (
                      <span className="h-2 w-2 rounded-full bg-tone-red-solid flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-ink-secondary mt-0.5">{notif.body}</p>
                  <span className="text-[11px] text-ink-secondary flex items-center gap-1 mt-1.5">
                    <Clock className="h-3 w-3" />
                    <span>{formatRelativeTh(notif.createdAt)}</span>
                    <span>•</span>
                    <span>
                      {formatThaiDateShort(notif.createdAt)} เวลา {formatThaiTime(notif.createdAt)}
                    </span>
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleRead(notif.id);
                }}
                title={notif.readAt ? 'ทำเครื่องหมายว่ายังไม่อ่าน' : 'ทำเครื่องหมายว่าอ่านแล้ว'}
                className="p-1.5 rounded-lg text-ink-secondary hover:text-primary transition flex-shrink-0"
              >
                <CheckCircle2
                  className={`h-4 w-4 ${notif.readAt ? 'text-tone-green-solid' : 'text-ink-secondary'}`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
