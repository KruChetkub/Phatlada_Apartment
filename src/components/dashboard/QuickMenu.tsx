import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  ReceiptText,
  Wrench,
  FilePlus,
  FileBarChart,
  Settings,
} from 'lucide-react';

interface QuickMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  colorBg: string;
  colorText: string;
  path: string;
}

const QUICK_ACTIONS: QuickMenuItem[] = [
  {
    id: 'add-tenant',
    label: 'เพิ่มผู้เช่า',
    icon: UserPlus,
    colorBg: 'bg-tone-green-solid',
    colorText: 'text-white',
    path: '/tenants/new',
  },
  {
    id: 'record-rent',
    label: 'บันทึกค่าเช่า',
    icon: ReceiptText,
    colorBg: 'bg-tone-blue-solid',
    colorText: 'text-white',
    path: '/finance/payments/new',
  },
  {
    id: 'maintenance',
    label: 'แจ้งซ่อม',
    icon: Wrench,
    colorBg: 'bg-tone-purple-solid',
    colorText: 'text-white',
    path: '/maintenance/new',
  },
  {
    id: 'create-lease',
    label: 'สร้างสัญญาเช่า',
    icon: FilePlus,
    colorBg: 'bg-tone-orange-solid',
    colorText: 'text-white',
    path: '/leases/new',
  },
  {
    id: 'view-reports',
    label: 'ดูรายงาน',
    icon: FileBarChart,
    colorBg: 'bg-tone-teal-solid',
    colorText: 'text-white',
    path: '/reports',
  },
  {
    id: 'settings',
    label: 'ตั้งค่า',
    icon: Settings,
    colorBg: 'bg-tone-gray-solid',
    colorText: 'text-white',
    path: '/settings',
  },
];

export const QuickMenu: React.FC = () => {
  return (
    <div className="rounded-lg bg-surface p-5 shadow-card border border-line">
      <div>
        <h2 className="text-base font-semibold text-ink">เมนูด่วน</h2>
        <p className="text-xs text-ink-muted">ทางลัดงานที่ทำบ่อย</p>
      </div>

      <div className="mt-3.5 grid grid-cols-3 gap-2.5">
        {QUICK_ACTIONS.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.path}
              className="group flex flex-col items-center justify-center rounded-md border border-line bg-white p-3 text-center shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-md ${item.colorBg} ${item.colorText} shadow-2xs transition-transform group-hover:scale-105`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="mt-2 text-xs font-medium text-ink group-hover:text-primary transition-colors">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

