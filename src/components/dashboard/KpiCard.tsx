import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Users,
  CircleDollarSign,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { DashboardSummary } from '../../types/dashboard';
import { formatBaht, formatChangePct } from '../../lib/format';

interface KpiCardsProps {
  data: DashboardSummary;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ data }) => {
  const kpis = [
    {
      id: 'rooms',
      title: 'ห้องทั้งหมด',
      value: `${data.rooms.total}`,
      unit: 'ห้อง',
      subtitle: `ว่าง ${data.rooms.vacant} ห้อง | มีผู้เช่า ${data.rooms.occupied} ห้อง`,
      icon: Home,
      link: '/rooms',
      tone: {
        bg: 'bg-tone-green-soft',
        iconBg: 'bg-tone-green-solid',
        iconColor: 'text-white',
      },
    },
    {
      id: 'tenants',
      title: 'ผู้เช่าทั้งหมด',
      value: `${data.tenants.total}`,
      unit: 'คน',
      subtitle: `ชาย ${data.tenants.male} คน | หญิง ${data.tenants.female} คน`,
      icon: Users,
      link: '/tenants',
      tone: {
        bg: 'bg-tone-blue-soft',
        iconBg: 'bg-tone-blue-solid',
        iconColor: 'text-white',
      },
    },
    {
      id: 'income',
      title: 'รายได้เดือนนี้',
      value: formatBaht(data.finance.income.value),
      unit: '',
      subtitle: (
        <span className="flex items-center space-x-1 text-tone-green-solid font-medium">
          <span>{formatChangePct(data.finance.income.changePct)}</span>
          <span className="text-ink-muted">จากเดือนที่แล้ว</span>
        </span>
      ),
      icon: CircleDollarSign,
      link: '/finance',
      tone: {
        bg: 'bg-tone-orange-soft',
        iconBg: 'bg-tone-orange-solid',
        iconColor: 'text-white',
      },
    },
    {
      id: 'maintenance',
      title: 'แจ้งซ่อมค้าง',
      value: `${data.maintenance.open}`,
      unit: 'รายการ',
      subtitle: `กำลังดำเนินการ ${data.maintenance.inProgress} | รอรับ ${data.maintenance.pending}`,
      icon: AlertTriangle,
      link: '/maintenance',
      tone: {
        bg: 'bg-tone-red-soft',
        iconBg: 'bg-tone-red-solid',
        iconColor: 'text-white',
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Link
            key={kpi.id}
            to={kpi.link}
            className={`group flex flex-col justify-between rounded-lg p-5 ${kpi.tone.bg} border border-line shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-primary`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-md ${kpi.tone.iconBg} ${kpi.tone.iconColor} shadow-sm`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex items-center text-ink-muted group-hover:text-primary transition-colors">
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>

            <div className="mt-3">
              <span className="text-sm font-medium text-ink-secondary">
                {kpi.title}
              </span>
              <div className="mt-1 flex items-baseline space-x-1.5">
                <span className="text-2xl font-bold tracking-tight text-ink">
                  {kpi.value}
                </span>
                {kpi.unit && (
                  <span className="text-sm font-medium text-ink-secondary">
                    {kpi.unit}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 border-t border-line/60 pt-2.5 text-xs text-ink-secondary">
              {kpi.subtitle}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

