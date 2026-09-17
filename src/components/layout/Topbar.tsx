import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare, ChevronDown, Menu, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types/database';
import { getAvatarInitial } from '../../lib/format';

interface TopbarProps {
  user: {
    displayName: string;
    role: UserRole;
    avatarUrl?: string | null;
  };
  unreadCount?: number;
  onOpenMobileMenu?: () => void;
  onOpenRoleModal?: () => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: 'เจ้าของหอพัก',
  MANAGER: 'ผู้จัดการ',
  STAFF: 'เจ้าหน้าที่',
};

export const Topbar: React.FC<TopbarProps> = ({
  user,
  unreadCount = 0,
  onOpenMobileMenu,
  onOpenRoleModal,
}) => {
  const roleLabel = ROLE_LABELS[user.role] || 'ผู้ใช้งาน';
  const initial = getAvatarInitial(user.displayName);

  return (
    <header className="flex h-16 w-full items-center justify-between px-4 sm:px-6">
      {/* Mobile Menu Hamburger */}
      <div className="flex items-center lg:hidden">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="เปิดเมนูนำทาง"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Right Side Actions & Profile */}
      <div className="ml-auto flex items-center space-x-2.5 sm:space-x-3">
        {/* Security Role Switcher Badge */}
        {onOpenRoleModal && (
          <button
            onClick={onOpenRoleModal}
            title="คลิกเพื่อสลับบทบาท หรือดูสิทธิ์ความปลอดภัย RLS"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition shadow-xs"
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">สิทธิ์:</span>
            <span>{roleLabel}</span>
          </button>
        )}

        {/* Notification Bell */}
        <Link
          to="/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-ink-secondary shadow-card transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={
            unreadCount > 0
              ? `การแจ้งเตือน ${unreadCount} รายการ`
              : 'การแจ้งเตือน'
          }
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-tone-red-solid px-1 text-[11px] font-semibold text-white shadow-sm">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        {/* Message Square Button */}
        <Link
          to="/messages"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-ink-secondary shadow-card transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="กล่องข้อความ"
        >
          <MessageSquare className="h-5 w-5" />
        </Link>

        {/* User Profile Card */}
        <div className="flex cursor-pointer items-center space-x-3 rounded-xl bg-surface px-3 py-1.5 shadow-card transition hover:shadow-card-hover">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tone-blue-soft text-tone-blue-solid font-semibold text-sm">
              {initial}
            </div>
          )}

          <div className="hidden text-left md:block">
            <h5 className="text-[14px] font-medium leading-tight text-ink">
              {user.displayName}
            </h5>
            <p className="text-[12px] text-ink-muted leading-tight mt-0.5">
              {roleLabel}
            </p>
          </div>

          <ChevronDown className="h-4 w-4 text-ink-muted" />
        </div>
      </div>
    </header>
  );
};

