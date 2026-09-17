import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { formatThaiDateLong, formatThaiTime } from '../../lib/format';

interface HeroBannerProps {
  userName: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ userName }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg bg-surface p-6 shadow-card border border-line">
      <div className="relative z-10 max-w-xl">
        <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
          สวัสดีครับ {userName} 👋
        </h1>
        <p className="mt-1.5 text-sm sm:text-[15px] text-ink-secondary">
          ตรวจสอบข้อมูลหอพัก และจัดการทุกอย่างได้ในที่เดียว
        </p>

        {/* Date and Time Row */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-ink-muted">
          <div className="inline-flex items-center space-x-1.5 rounded-md bg-bg px-3 py-1.5 font-medium text-ink-secondary">
            <Calendar className="h-4 w-4 text-primary" />
            <span>
              วันนี้ <strong className="text-ink font-semibold">{formatThaiDateLong(currentDate)}</strong>
            </span>
          </div>

          <div className="inline-flex items-center space-x-1.5 rounded-md bg-bg px-3 py-1.5 font-medium text-ink-secondary">
            <Clock className="h-4 w-4 text-primary" />
            <span>
              เวลา <strong className="text-ink font-semibold">{formatThaiTime(currentDate)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Building illustration on the right */}
      <div className="absolute right-0 top-0 bottom-0 hidden w-1/3 md:flex items-center justify-end pointer-events-none select-none">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent z-10" />
        <svg
          viewBox="0 0 240 160"
          className="h-full w-auto text-primary/10 fill-current opacity-80"
          aria-hidden="true"
        >
          <rect x="20" y="30" width="70" height="130" rx="4" />
          <rect x="35" y="45" width="12" height="15" rx="1" fill="#fff" opacity="0.6" />
          <rect x="60" y="45" width="12" height="15" rx="1" fill="#fff" opacity="0.6" />
          <rect x="35" y="70" width="12" height="15" rx="1" fill="#fff" opacity="0.6" />
          <rect x="60" y="70" width="12" height="15" rx="1" fill="#fff" opacity="0.6" />
          <rect x="35" y="95" width="12" height="15" rx="1" fill="#fff" opacity="0.6" />
          <rect x="60" y="95" width="12" height="15" rx="1" fill="#fff" opacity="0.6" />
          <rect x="45" y="130" width="20" height="30" rx="2" fill="#fff" opacity="0.8" />

          <rect x="100" y="10" width="85" height="150" rx="4" fill="#1E8A5A" opacity="0.15" />
          <rect x="115" y="25" width="16" height="16" rx="1" fill="#fff" opacity="0.6" />
          <rect x="150" y="25" width="16" height="16" rx="1" fill="#fff" opacity="0.6" />
          <rect x="115" y="52" width="16" height="16" rx="1" fill="#fff" opacity="0.6" />
          <rect x="150" y="52" width="16" height="16" rx="1" fill="#fff" opacity="0.6" />
          <rect x="115" y="80" width="16" height="16" rx="1" fill="#fff" opacity="0.6" />
          <rect x="150" y="80" width="16" height="16" rx="1" fill="#fff" opacity="0.6" />
          <rect x="115" y="108" width="16" height="16" rx="1" fill="#fff" opacity="0.6" />
          <rect x="150" y="108" width="16" height="16" rx="1" fill="#fff" opacity="0.6" />

          <circle cx="195" cy="115" r="16" fill="#22A06B" opacity="0.2" />
          <circle cx="215" cy="125" r="12" fill="#22A06B" opacity="0.2" />
        </svg>
      </div>
    </div>
  );
};

