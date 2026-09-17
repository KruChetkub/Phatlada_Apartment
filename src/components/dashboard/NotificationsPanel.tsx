import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  CircleDollarSign,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { DashboardSummary } from '../../types/dashboard';
import { NotificationType } from '../../types/database';
import { formatRelativeTh } from '../../lib/format';

interface NotificationsPanelProps {
  notifications: DashboardSummary['notifications'];
}

const NOTIF_CONFIG: Record<
  NotificationType,
  {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
  }
> = {
  MAINTENANCE_NEW: {
    icon: Wrench,
    iconBg: 'bg-tone-red-solid',
    iconColor: 'text-white',
  },
  PAYMENT_RECEIVED: {
    icon: CircleDollarSign,
    iconBg: 'bg-tone-green-solid',
    iconColor: 'text-white',
  },
  LEASE_EXPIRING: {
    icon: FileText,
    iconBg: 'bg-tone-blue-solid',
    iconColor: 'text-white',
  },
  ROOM_AVAILABLE: {
    icon: AlertTriangle,
    iconBg: 'bg-tone-orange-solid',
    iconColor: 'text-white',
  },
};

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
}) => {
  return (
    <div className="rounded-lg bg-surface p-5 shadow-card border border-line">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-3.5">
        <div>
          <h2 className="text-base font-semibold text-ink">การแจ้งเตือน</h2>
          <p className="text-xs text-ink-muted">ความเคลื่อนไหวล่าสุด</p>
        </div>
        <Link
          to="/notifications"
          className="text-xs font-medium text-primary hover:underline"
        >
          ดูทั้งหมด
        </Link>
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="py-6 text-center text-xs text-ink-muted">
          ยังไม่มีการแจ้งเตือนใหม่ในขณะนี้
        </div>
      ) : (
        <div className="mt-2 divide-y divide-line/60">
          {notifications.map((item) => {
            const config = NOTIF_CONFIG[item.type] || NOTIF_CONFIG.MAINTENANCE_NEW;
            const Icon = config.icon;
            const isUnread = !item.readAt;

            return (
              <Link
                key={item.id}
                to={item.href || '/'}
                className="flex items-start space-x-3 py-3 px-1 hover:bg-[#F7FAF9] rounded-md transition group"
              >
                {/* Icon */}
                <div
                  className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${config.iconBg} ${config.iconColor} shadow-2xs`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4
                      className={`text-xs sm:text-sm leading-tight text-ink ${
                        isUnread ? 'font-semibold' : 'font-medium'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-ink-muted whitespace-nowrap ml-2">
                      {formatRelativeTh(item.createdAt, new Date())}
                    </span>
                  </div>
                  <p className="text-xs text-ink-secondary mt-0.5 truncate">
                    {item.body}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

