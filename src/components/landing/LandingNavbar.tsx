import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Menu, X, Phone } from 'lucide-react';

interface LandingNavbarProps {
  onOpenBooking: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onOpenBooking }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScrollToTop = () => {
    setMobileOpen(false);
    if (window.location.pathname === '/') {
      if (window.location.hash) {
        window.history.pushState(null, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-line shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={handleScrollToTop}
          className="flex items-center space-x-2.5 sm:space-x-3 group"
          aria-label="กลับสู่หน้าแรกและเลื่อนขึ้นบนสุด"
        >
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-primary to-tone-blue-solid flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform font-bold shrink-0">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <span className="text-base sm:text-xl font-extrabold text-ink tracking-tight block font-prompt leading-tight">
              <span className="block sm:inline">ภัทร์ลดา</span>{' '}
              <span className="block sm:inline">อพาร์ทเมนท์</span>
            </span>
            <span className="text-[10px] sm:text-xs text-primary font-semibold tracking-wider block uppercase font-sans mt-0.5 sm:mt-0">
              Phatlada Apartment
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs sm:text-sm font-medium text-ink-secondary">
          <a href="#rooms" className="hover:text-primary transition">
            ประเภทห้องพัก
          </a>
          <a href="#facilities" className="hover:text-primary transition">
            สิ่งอำนวยความสะดวก
          </a>
          <a href="#location" className="hover:text-primary transition">
            ทำเลที่ตั้ง
          </a>
          <a href="#contact" className="hover:text-primary transition">
            ติดต่อเรา
          </a>
        </nav>

        {/* Desktop Action Button: Focused entirely on booking/inquiry */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-full shadow-sm hover:shadow transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>นัดดูห้องพัก</span>
          </button>
        </div>

        {/* Mobile Actions: Clean booking CTA + Hamburger toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={onOpenBooking}
            className="px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-full flex items-center space-x-1.5 transition"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>นัดดูห้อง</span>
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-ink-secondary hover:text-ink focus:outline-none"
            aria-label="เมนู"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-b border-line px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <a
            href="#rooms"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-ink hover:text-primary"
          >
            ประเภทห้องพัก & ค่าเช่า
          </a>
          <a
            href="#facilities"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-ink hover:text-primary"
          >
            สิ่งอำนวยความสะดวก
          </a>
          <a
            href="#location"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-ink hover:text-primary"
          >
            แผนที่และการเดินทาง
          </a>
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-ink hover:text-primary"
          >
            ติดต่อสอบถาม
          </a>

          <div className="pt-3 border-t border-line flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 text-center text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>นัดหมายเข้าชมห้องพัก</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
