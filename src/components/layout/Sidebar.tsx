import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  BedDouble,
  Users,
  FileText,
  CircleDollarSign,
  Gauge,
  Wrench,
  FileBarChart,
  MessageSquareMore,
  Bell,
  Settings,
  HelpCircle,
  Globe,
  X,
} from 'lucide-react';
import { DormCard } from './DormCard';
import { TaglineDecoration } from './TaglineDecoration';
import { PlanType } from '../../types/database';

interface SidebarProps {
  dormitory: {
    name: string;
    roomCount: number;
    tenantCount: number;
    plan: PlanType;
  };
  isOpen?: boolean;
  onClose?: () => void;
  onOpenDormSwitch?: () => void;
}

const MENU_ITEMS = [
  { id: 'dashboard', label: 'หน้าหลักระบบจัดการ', icon: Home, path: '/dashboard' },
  { id: 'rooms', label: 'ห้องพัก', icon: BedDouble, path: '/rooms' },
  { id: 'tenants', label: 'ผู้เช่า', icon: Users, path: '/tenants' },
  { id: 'leases', label: 'สัญญาเช่า', icon: FileText, path: '/leases' },
  { id: 'invoices', label: 'บิล & มิเตอร์น้ำไฟ', icon: Gauge, path: '/invoices' },
  { id: 'finance', label: 'การเงิน', icon: CircleDollarSign, path: '/finance' },
  { id: 'maintenance', label: 'แจ้งซ่อม / บำรุงรักษา', icon: Wrench, path: '/maintenance' },
  { id: 'reports', label: 'รายงาน', icon: FileBarChart, path: '/reports' },
  { id: 'messages', label: 'ข้อความ', icon: MessageSquareMore, path: '/messages' },
  { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell, path: '/notifications' },
  { id: 'settings', label: 'ตั้งค่า', icon: Settings, path: '/settings' },
  { id: 'help', label: 'วิธีใช้งานระบบ', icon: HelpCircle, path: '/help' },
  { id: 'landing', label: 'ดูหน้าเว็บหอพัก', icon: Globe, path: '/' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  dormitory,
  isOpen = false,
  onClose,
  onOpenDormSwitch,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-[252px] flex-col bg-gradient-to-b from-sidebar-from to-sidebar-to text-sidebar-text shadow-xl transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand Logo */}
        <div className="flex h-20 items-center justify-between px-5">
          <Link to="/" title="คลิกเพื่อดูหน้าเว็บไซต์หอพัก" className="flex items-center space-x-3 hover:opacity-90 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white shadow-inner">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-[22px] font-semibold tracking-tight text-white">
                Phatlada
              </span>
              <p className="text-[12px] text-white/70">
                จัดการหอพัก...ให้ง่ายขึ้น
              </p>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="ปิดเมนูนำทาง"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 scrollbar-none">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex h-11 items-center space-x-3 rounded-md px-3.5 text-[14px] font-medium transition-colors ${
                    isActive
                      ? 'bg-sidebar-active text-white shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0 opacity-90 group-hover:opacity-100" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Dormitory Info & Tagline */}
        <div className="pb-3 pt-1 border-t border-white/10">
          <DormCard
            name={dormitory.name}
            roomCount={dormitory.roomCount}
            tenantCount={dormitory.tenantCount}
            plan={dormitory.plan}
            onClick={onOpenDormSwitch}
          />
          <TaglineDecoration />
        </div>
      </aside>
    </>
  );
};

