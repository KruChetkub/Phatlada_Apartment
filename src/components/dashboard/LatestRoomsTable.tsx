import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BedDouble } from 'lucide-react';
import { DashboardSummary } from '../../types/dashboard';
import { formatRent, formatThaiDateShort } from '../../lib/format';

interface LatestRoomsTableProps {
  rooms: DashboardSummary['latestRooms'];
}

export const LatestRoomsTable: React.FC<LatestRoomsTableProps> = ({ rooms }) => {
  return (
    <div className="rounded-lg bg-surface p-5 sm:p-6 shadow-card border border-line">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">ห้องพักล่าสุด</h2>
          <p className="text-xs text-ink-muted mt-0.5">รายการห้องพักอัปเดตล่าสุด</p>
        </div>
        <Link
          to="/rooms"
          className="text-xs font-medium text-primary hover:underline"
        >
          ดูทั้งหมด
        </Link>
      </div>

      {/* Table / List */}
      {rooms.length === 0 ? (
        <div className="py-8 text-center text-xs text-ink-muted">
          ยังไม่มีข้อมูลห้องพักในระบบ{' '}
          <Link to="/rooms" className="text-primary font-medium hover:underline ml-1">
            + เพิ่มห้องพักแรก
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {rooms.map((room) => {
          const isOccupied = room.status === 'OCCUPIED';

          return (
            <Link
              key={room.id}
              to={`/rooms`}
              className="group flex items-center justify-between py-3.5 px-1.5 transition hover:bg-[#F7FAF9] rounded-md"
            >
              {/* Left: Thumbnail & Room Details */}
              <div className="flex items-center space-x-3.5">
                <div className="flex h-10 w-14 items-center justify-center rounded-sm bg-bg border border-line text-ink-muted group-hover:text-primary transition-colors">
                  <BedDouble className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-ink">
                      ห้อง {room.number}
                    </span>
                    <span className="text-xs text-ink-muted">
                      ชั้น {room.floor} | {formatRent(room.monthlyRent)}
                    </span>
                  </div>

                  <div className="mt-0.5 text-xs text-ink-secondary">
                    {isOccupied && room.tenantName ? (
                      <span>
                        ผู้เช่า: {room.tenantName}
                        {room.leaseEndDate && (
                          <span className="text-ink-muted">
                            {' '}(หมดสัญญา: {formatThaiDateShort(room.leaseEndDate)})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-ink-muted">ไม่มีผู้เช่า</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Status Badge & Chevron */}
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    isOccupied
                      ? 'bg-tone-green-soft text-[#1E8A5A]'
                      : 'bg-tone-blue-soft text-[#3B82F6]'
                  }`}
                >
                  {isOccupied ? 'มีผู้เช่า' : 'ว่าง'}
                </span>

                <ChevronRight className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </Link>
          );
        })}
      </div>
      )}
    </div>
  );
};

