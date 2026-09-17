import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, LayoutDashboard, Menu, X, Phone } from 'lucide-react';

interface LandingNavbarProps {
  onOpenBooking: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onOpenBooking }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/75 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-neutral-950 shadow-md group-hover:scale-105 transition-transform font-bold">
            <Building2 className="h-5 w-5 text-neutral-950" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight block font-prompt leading-tight">
              ภัทร์ลดาอพาร์ทเมนท์
            </span>
            <span className="text-[10px] sm:text-[11px] text-cyan-400 font-semibold tracking-wider block uppercase font-sans">
              Phatlada Apartment
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs sm:text-sm font-medium text-neutral-300">
          <a href="#rooms" className="hover:text-white transition">
            ประเภทห้องพัก
          </a>
          <a href="#facilities" className="hover:text-white transition">
            สิ่งอำนวยความสะดวก
          </a>
          <a href="#smart" className="hover:text-white transition">
            ระบบอัจฉริยะ
          </a>
          <a href="#location" className="hover:text-white transition">
            ทำเลที่ตั้ง
          </a>
          <a href="#contact" className="hover:text-white transition">
            ติดต่อเรา
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-neutral-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-full transition"
          >
            <Phone className="h-3.5 w-3.5 text-cyan-400" />
            <span>นัดดูห้องพัก</span>
          </button>

          <Link
            to="/login"
            className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-bold text-white bg-white/15 hover:bg-white/25 border border-white/25 rounded-full shadow-sm backdrop-blur-xs transition"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-cyan-400" />
            <span>เข้าสู่ระบบ (Login)</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <Link
            to="/login"
            className="p-2 text-cyan-400 bg-white/10 rounded-lg"
            title="เข้าสู่ระบบผู้ดูแล"
          >
            <LayoutDashboard className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-neutral-300 hover:text-white focus:outline-none"
            aria-label="เมนู"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-neutral-900/95 border-b border-white/10 px-4 pt-3 pb-5 space-y-3 backdrop-blur-xl animate-in slide-in-from-top-2">
          <a
            href="#rooms"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-neutral-200 hover:text-white"
          >
            ประเภทห้องพัก & ค่าเช่า
          </a>
          <a
            href="#facilities"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-neutral-200 hover:text-white"
          >
            สิ่งอำนวยความสะดวก
          </a>
          <a
            href="#smart"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-neutral-200 hover:text-white"
          >
            ระบบดิจิทัล & บิลออนไลน์
          </a>
          <a
            href="#location"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-neutral-200 hover:text-white"
          >
            แผนที่และการเดินทาง
          </a>
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-neutral-200 hover:text-white"
          >
            ติดต่อสอบถาม
          </a>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-neutral-950 bg-cyan-400 rounded-xl"
            >
              นัดดูห้องพักจริง
            </button>
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-white/15 border border-white/20 rounded-xl flex items-center justify-center space-x-2"
            >
              <LayoutDashboard className="h-4 w-4 text-cyan-400" />
              <span>เข้าสู่ระบบจัดการผู้ดูแล (Login)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
