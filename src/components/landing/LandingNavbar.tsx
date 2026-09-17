import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, LayoutDashboard, Menu, X, Phone } from 'lucide-react';

interface LandingNavbarProps {
  onOpenBooking: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onOpenBooking }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-line shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-tone-blue-solid flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform font-bold">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold text-ink tracking-tight block font-prompt leading-tight">
              ภัทร์ลดา อพาร์ทเมนท์
            </span>
            <span className="text-[11px] sm:text-xs text-primary font-semibold tracking-wider block uppercase font-sans">
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

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full transition"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>นัดดูห้องพัก</span>
          </button>

          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-full shadow-sm hover:shadow transition"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>เข้าสู่ระบบ (Login)</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <Link
            to="/login"
            className="p-2 text-primary bg-primary/10 rounded-lg"
            title="เข้าสู่ระบบผู้ดูแล"
          >
            <LayoutDashboard className="h-5 w-5" />
          </Link>
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
              className="w-full py-2.5 text-center text-xs font-semibold text-primary bg-primary/10 rounded-xl"
            >
              นัดดูห้องพักจริง
            </button>
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-primary rounded-xl flex items-center justify-center space-x-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>เข้าสู่ระบบจัดการผู้ดูแล (Login)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
