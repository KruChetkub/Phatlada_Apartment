import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, X } from 'lucide-react';

const STORAGE_KEY = 'phatlada_promo_dismissed';

export const PromoCard: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('dormplus_promo_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#EEF7F2] to-white p-5 shadow-card border border-primary/20">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 rounded-full p-1 text-ink-muted transition hover:bg-black/5 hover:text-ink"
        aria-label="ปิดการ์ดแนะนำ"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Brand Icon & Pill */}
      <div className="flex items-center space-x-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white shadow-2xs">
          <Home className="h-4 w-4" />
        </div>
        <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          ด้วย Phatlada
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-3 text-lg font-bold leading-snug text-ink">
        หอพักของคุณ <br />
        จัดการได้ง่ายขึ้น
      </h3>
      <p className="mt-1 text-xs text-ink-secondary">
        เรียนรู้ฟังก์ชันการใช้งานทั้งหมดเพื่อเพิ่มประสิทธิภาพการจัดการหอพัก
      </p>

      {/* Button */}
      <div className="mt-4">
        <Link
          to="/help"
          className="inline-flex items-center space-x-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover"
        >
          <span>ดูวิธีใช้งาน</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Subtle background building graphics */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-20 -mr-2 -mb-2">
        <svg width="120" height="90" viewBox="0 0 120 90" fill="currentColor" className="text-primary">
          <rect x="10" y="20" width="40" height="70" rx="3" />
          <rect x="55" y="5" width="45" height="85" rx="3" />
          <rect x="18" y="30" width="8" height="10" rx="1" fill="#fff" />
          <rect x="34" y="30" width="8" height="10" rx="1" fill="#fff" />
          <rect x="65" y="18" width="10" height="12" rx="1" fill="#fff" />
          <rect x="82" y="18" width="10" height="12" rx="1" fill="#fff" />
        </svg>
      </div>
    </div>
  );
};

