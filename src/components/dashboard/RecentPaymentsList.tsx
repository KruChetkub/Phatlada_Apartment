import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardSummary } from '../../types/dashboard';
import {
  formatSatang,
  formatThaiDateShort,
  formatThaiTime,
  getAvatarInitial,
} from '../../lib/format';

interface RecentPaymentsListProps {
  payments: DashboardSummary['recentPayments'];
}

export const RecentPaymentsList: React.FC<RecentPaymentsListProps> = ({ payments }) => {
  return (
    <div className="rounded-lg bg-surface p-5 sm:p-6 shadow-card border border-line">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">การชำระค่าเช่าล่าสุด</h2>
          <p className="text-xs text-ink-muted mt-0.5">รายการรับชำระเงินเรียงตามเวลา</p>
        </div>
        <Link
          to="/finance"
          className="text-xs font-medium text-primary hover:underline"
        >
          ดูทั้งหมด
        </Link>
      </div>

      {/* List */}
      {payments.length === 0 ? (
        <div className="py-8 text-center text-xs text-ink-muted">
          ยังไม่มีรายการชำระเงินในระบบ{' '}
          <Link to="/finance" className="text-primary font-medium hover:underline ml-1">
            + บันทึกค่าเช่า
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {payments.map((payment) => {
          const initial = getAvatarInitial(payment.tenantName);

          return (
            <div
              key={payment.id}
              className="flex items-center justify-between py-3 px-1 hover:bg-[#F7FAF9] rounded-md transition"
            >
              {/* Left: Avatar + Details */}
              <div className="flex items-center space-x-3">
                {payment.avatarUrl ? (
                  <img
                    src={payment.avatarUrl}
                    alt={payment.tenantName}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tone-blue-soft text-tone-blue-solid font-semibold text-xs shadow-2xs">
                    {initial}
                  </div>
                )}

                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-ink leading-tight">
                    {payment.tenantName}
                  </h4>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    ห้อง {payment.roomNumber} | {formatSatang(payment.amount)} |{' '}
                    {formatThaiDateShort(payment.paidAt)}{' '}
                    {formatThaiTime(payment.paidAt)}
                  </p>
                </div>
              </div>

              {/* Right: Badge */}
              <span className="inline-flex items-center rounded-full bg-tone-green-soft px-2.5 py-0.5 text-xs font-medium text-tone-green-solid">
                ชำระแล้ว
              </span>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};

