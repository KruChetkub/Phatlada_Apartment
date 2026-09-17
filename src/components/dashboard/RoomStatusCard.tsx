import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChevronRight } from 'lucide-react';
import { DashboardSummary } from '../../types/dashboard';

interface RoomStatusCardProps {
  rooms: DashboardSummary['rooms'];
}

export const RoomStatusCard: React.FC<RoomStatusCardProps> = ({ rooms }) => {
  const data = rooms.total > 0 ? [
    { name: 'มีผู้เช่า', value: rooms.occupied, color: '#1E8A5A' },
    { name: 'ว่าง', value: rooms.vacant, color: '#C9DCE8' },
  ] : [
    { name: 'ไม่มีห้อง', value: 1, color: '#E6ECEA' },
  ];

  const occupiedPct = rooms.occupancyPct;
  const vacantPct = 100 - occupiedPct;

  return (
    <div className="flex flex-col justify-between rounded-lg bg-surface p-5 sm:p-6 shadow-card border border-line">
      <div>
        <h2 className="text-lg font-semibold text-ink">สถานะห้องพัก</h2>
        <p className="text-xs text-ink-muted mt-0.5">สัดส่วนห้องพักปัจจุบัน</p>
      </div>

      <div className="my-4 flex flex-col sm:flex-row items-center justify-around gap-6">
        {/* Donut Chart with Center Text */}
        <div className="relative h-36 w-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={66}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] text-ink-muted font-normal">ทั้งหมด</span>
            <span className="text-[17px] font-bold text-ink leading-tight">
              {rooms.total} ห้อง
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-primary flex-shrink-0"></span>
            <span className="font-medium text-ink">มีผู้เช่า</span>
            <span className="text-ink-secondary">
              {rooms.occupied} ({occupiedPct}%)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-[#C9DCE8] flex-shrink-0"></span>
            <span className="font-medium text-ink">ว่าง</span>
            <span className="text-ink-secondary">
              {rooms.vacant} ({vacantPct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Button link */}
      <div className="pt-2">
        <Link
          to="/rooms"
          className="flex w-full items-center justify-center space-x-1.5 rounded-md bg-primary-soft py-2.5 px-4 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
        >
          <span>ดูรายละเอียดห้องพัก</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

