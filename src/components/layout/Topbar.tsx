import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  MessageSquare,
  ChevronDown,
  Menu,
  LogOut,
  Settings,
} from 'lucide-react';
import { UserRole } from '../../types/database';
import { getAvatarInitial } from '../../lib/format';

interface TopbarProps {
  user: {
    displayName: string;
    role: UserRole;
    avatarUrl?: string | null;
  };
  unreadCount?: number;
  unreadMessagesCount?: number;
  onOpenMobileMenu?: () => void;
  onOpenLogoutModal?: () => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: 'เจ้าของหอพัก',
  MANAGER: 'ผู้จัดการ',
  STAFF: 'เจ้าหน้าที่',
};

export const Topbar: React.FC<TopbarProps> = ({
  user,
  unreadCount = 0,
  unreadMessagesCount = 0,
  onOpenMobileMenu,
  onOpenLogoutModal,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const roleLabel = ROLE_LABELS[user.role] || 'ผู้ใช้งาน';
  const initial = getAvatarInitial(user.displayName);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 w-full items-center justify-between px-4 sm:px-6 relative z-30">
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
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-ink-secondary shadow-card transition hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={
            unreadMessagesCount > 0
              ? `กล่องข้อความ ${unreadMessagesCount} ข้อความใหม่`
              : 'กล่องข้อความ'
          }
        >
          <MessageSquare className="h-5 w-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-tone-red-solid px-1 text-[11px] font-semibold text-white shadow-sm">
              {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
            </span>
          )}
        </Link>

        {/* User Profile Card with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-3 rounded-xl bg-surface px-3 py-1.5 shadow-card transition hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-primary"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
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

            <ChevronDown className={`h-4 w-4 text-ink-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface p-2 shadow-xl border border-line animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="px-3 py-2.5 border-b border-line mb-1">
                <p className="text-xs font-semibold text-ink truncate">{user.displayName}</p>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-tone-green-solid" />
                  <span className="text-[11px] text-ink-muted">{roleLabel}</span>
                </div>
              </div>

              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-ink-secondary hover:text-ink hover:bg-bg-subtle rounded-xl transition"
              >
                <Settings className="h-4 w-4 text-ink-muted" />
                <span>ตั้งค่าระบบและบัญชี</span>
              </Link>

              <div className="my-1 border-t border-line" />

              <button
                onClick={() => {
                  setProfileOpen(false);
                  if (onOpenLogoutModal) onOpenLogoutModal();
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-tone-red-solid hover:bg-tone-red-soft rounded-xl transition text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

