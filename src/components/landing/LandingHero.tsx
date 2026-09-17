import React from 'react';
import {
  ShieldCheck,
  Wifi,
  Sparkles,
  Phone,
  Play,
  KeyRound,
  Building,
  Car,
  CheckCircle2,
} from 'lucide-react';

interface LandingHeroProps {
  onOpenBooking: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-black overflow-hidden select-none">
      {/* Background Image /1.jpg with high visual priority */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-right lg:bg-[center_right_10%] scale-100 transition-transform duration-1000"
        style={{ backgroundImage: "url('/1.jpg')" }}
      />

      {/* Cinematic Dark Gradient Overlays (Matches Reference Image) */}
      {/* 1. Left to Right Gradient - Dark solid on text area, fades smoothly towards photo */}
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-black via-black/90 via-35% md:via-black/75 to-black/30 lg:to-transparent" />

      {/* 2. Top Vignette - Blends smoothly with sticky navbar */}
      <div className="absolute inset-x-0 top-0 h-32 z-1 bg-gradient-to-b from-black/80 to-transparent" />

      {/* 3. Bottom Vignette - Blends into subsequent sections */}
      <div className="absolute inset-x-0 bottom-0 h-40 z-1 bg-gradient-to-t from-black via-black/80 to-transparent" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="max-w-2xl text-left space-y-6">
          {/* Top Brand Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-white shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span className="tracking-wide">ภัทร์ลดา อพาร์ทเมนท์ • PHATLADA APARTMENT</span>
          </div>

          {/* Huge Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] font-prompt">
            สัมผัสชีวิตที่ลงตัว <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
              อบอุ่น และปลอดภัย
            </span>
          </h1>

          {/* Subtitle / Descriptive Paragraph */}
          <p className="text-sm sm:text-base lg:text-lg text-neutral-300 leading-relaxed font-normal max-w-xl">
            พื้นที่พักผ่อนที่ลงตัวสำหรับคนรุ่นใหม่และคนทำงาน สะอาด สงบ เป็นส่วนตัว เฟอร์นิเจอร์ครบครันพร้อมเข้าอยู่ ทำเลเดินทางสะดวก ใกล้แหล่งอำนวยความสะดวก พร้อมการดูแลด้วยระบบดิจิทัลตลอด 24 ชั่วโมง
          </p>

          {/* Price Highlight & Promotional Tag */}
          <div className="pt-2 space-y-2">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl sm:text-4xl font-black text-white font-prompt">
                ฿3,800
              </span>
              <span className="text-base sm:text-lg text-neutral-500 line-through">
                ฿4,500
              </span>
              <span className="text-xs sm:text-sm text-neutral-400 font-medium">
                / เดือน
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-emerald-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>โปรโมชั่นพิเศษเปิดจองห้องพัก จองวันนี้รับส่วนลดค่าประกันห้องทันที</span>
            </div>
          </div>

          {/* Dual Action Buttons (Styled Exactly Like Reference Image) */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5 sm:gap-4">
            {/* Primary Glowing Button (Buy Course Style -> นัดดูห้องพัก) */}
            <button
              onClick={onOpenBooking}
              className="rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-neutral-950 font-bold px-8 py-3.5 text-sm sm:text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Phone className="h-4 w-4" />
              <span>นัดหมายเข้าชมห้องพัก</span>
            </button>

            {/* Secondary Translucent Button (Watch Intro Style -> ดูประเภทห้อง) */}
            <a
              href="#rooms"
              className="rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-7 py-3.5 text-sm sm:text-base backdrop-blur-md transition-all flex items-center space-x-2.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="h-4 w-4 fill-white text-white" />
              <span>ดูประเภทห้อง & สิ่งอำนวยความสะดวก</span>
            </a>
          </div>

          {/* Bottom Trust & Feature Badges (Social Proof Style) */}
          <div className="pt-8 border-t border-white/15">
            <p className="text-xs text-neutral-400 mb-3.5 font-medium">
              มาตรฐานความปลอดภัยและการอยู่อาศัยที่คุณวางใจได้:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              <div className="flex items-center space-x-2 text-neutral-300">
                <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-medium">กล้อง CCTV 24 ชม.</span>
              </div>

              <div className="flex items-center space-x-2 text-neutral-300">
                <KeyRound className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-medium">ประตูคีย์การ์ด</span>
              </div>

              <div className="flex items-center space-x-2 text-neutral-300">
                <Building className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-medium">ลิฟต์โดยสาร</span>
              </div>

              <div className="flex items-center space-x-2 text-neutral-300">
                <Car className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-medium">ที่จอดรถยนต์/มอเตอร์ไซค์</span>
              </div>

              <div className="flex items-center space-x-2 text-neutral-300">
                <Wifi className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-medium">ฟรี Wi-Fi ความเร็วสูง</span>
              </div>
            </div>

            <div className="mt-5 flex items-center space-x-2 text-xs text-neutral-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>
                สอบถามข้อมูลเพิ่มเติม หรือโทรสอบถามด่วน:{' '}
                <a href="tel:0818940000" className="text-white hover:text-cyan-400 underline font-semibold transition">
                  081-894-XXXX
                </a>{' '}
                หรือ Line ID:{' '}
                <span className="text-white font-semibold">@phatlada</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
