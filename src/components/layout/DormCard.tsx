import React from 'react';
import { Home } from 'lucide-react';
import { PlanType } from '../../types/database';

interface DormCardProps {
  name: string;
  roomCount: number;
  tenantCount: number;
  plan: PlanType;
  onClick?: () => void;
}

export const DormCard: React.FC<DormCardProps> = ({
  name,
  roomCount,
  tenantCount,
  plan,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`mx-3 mt-auto rounded-md bg-sidebar-card p-3.5 text-white shadow-sm transition ${
        onClick ? 'cursor-pointer hover:bg-white/10 hover:shadow-md' : ''
      }`}
      title={onClick ? 'คลิกเพื่อสลับหรือเพิ่มหอพัก' : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white">
            <Home className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold leading-tight">{name}</h4>
            <p className="mt-0.5 text-[11px] text-white/70">
              ห้องพัก {roomCount} ห้อง | ผู้เช่า {tenantCount} คน
            </p>
          </div>
        </div>
        {plan === 'PREMIUM' && (
          <span className="inline-flex items-center rounded-full bg-primary-soft/90 px-2 py-0.5 text-[10px] font-medium text-primary">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
            Premium
          </span>
        )}
      </div>
    </div>
  );
};

