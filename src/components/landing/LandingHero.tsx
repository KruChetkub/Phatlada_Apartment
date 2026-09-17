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
    <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-bg overflow-hidden select-none py-8 sm:py-12">
      {/* Background Image /1.jpg placed with natural light & high clarity */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-[center_left_30%] sm:bg-left scale-100 transition-transform duration-700"
        style={{ backgroundImage: "url('/1.jpg')" }}
      />

      {/* Bright, Warm & Sunlit Ambient Gradient Overlays (No dark shadows) */}
      {/* 1. Soft Right Gradient: Gently illuminates the text area on the right while leaving the photo bright on the left */}
      <div className="absolute inset-0 z-1 bg-gradient-to-l from-white/95 via-white/80 via-45% to-white/10 sm:to-transparent" />

      {/* 2. Top & Bottom Subtle Blends */}
      <div className="absolute inset-x-0 top-0 h-24 z-1 bg-gradient-to-b from-white/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 z-1 bg-gradient-to-t from-bg via-bg/40 to-transparent" />

      {/* Main Content Container - Text positioned on the RIGHT side */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-end">
        <div className="w-full max-w-xl lg:max-w-2xl bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-primary/10 ring-1 ring-black/5 text-left space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
          
          {/* Top Pill Badge - Fresh & Inviting */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-xs">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="tracking-wide">ภัทร์ลดา อพาร์ทเมนท์ • อบอุ่น สบาย น่าอยู่ เหมือนบ้าน</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight leading-[1.18] font-prompt">
            สัมผัสชีวิตที่ลงตัว <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tone-blue-solid to-primary">
              อบอุ่น โปร่งสบาย และสดใสในทุกวัน
            </span>
          </h1>

          {/* Narrative Paragraph */}
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-xl">
            พื้นที่พักผ่อนที่ออกแบบมาเพื่อความสุขของคุณ บรรยากาศเงียบสงบ สะอาด โปร่งสบาย ร่มรื่น และปลอดภัย เฟอร์นิเจอร์ครบชุดพร้อมเข้าอยู่ ทำเลเดินทางสะดวก ใกล้สิ่งอำนวยความสะดวก พร้อมการบริการด้วยใจและระบบดิจิทัลตลอด 24 ชั่วโมง
          </p>

          {/* Pricing Highlight & Promotion */}
          <div className="pt-1 space-y-1.5 border-t border-line/60">
            <div className="flex items-baseline space-x-3 pt-2">
              <span className="text-3xl sm:text-4xl font-black text-ink font-prompt">
                ฿3,800
              </span>
              <span className="text-base sm:text-lg text-ink-muted line-through">
                ฿4,500
              </span>
              <span className="text-xs sm:text-sm text-ink-secondary font-medium">
                / เดือน
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-tone-green-solid">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tone-green-solid opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tone-green-solid" />
              </span>
              <span>โปรโมชั่นห้องใหม่: จองวันนี้รับส่วนลดค่าประกันและฟรี Wi-Fi ทันที</span>
            </div>
          </div>

          {/* Dual Action Buttons (Vibrant & Welcoming) */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {/* Primary Button */}
            <button
              onClick={onOpenBooking}
              className="rounded-full bg-gradient-to-r from-primary to-tone-blue-solid hover:from-primary/90 hover:to-tone-blue-solid/90 text-white font-bold px-7 py-3.5 text-sm sm:text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Phone className="h-4 w-4" />
              <span>นัดหมายเข้าชมห้องพัก</span>
            </button>

            {/* Secondary Button */}
            <a
              href="#rooms"
              className="rounded-full bg-surface hover:bg-bg border border-line text-ink font-semibold px-6 py-3.5 text-sm sm:text-base shadow-xs hover:shadow-sm transition-all flex items-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="h-4 w-4 fill-primary text-primary" />
              <span>ดูประเภทห้อง & สิ่งอำนวยความสะดวก</span>
            </a>
          </div>

          {/* Bottom Features & Trust Badges */}
          <div className="pt-4 border-t border-line/60">
            <p className="text-xs font-semibold text-ink-secondary mb-3">
              มาตรฐานความสะดวกสบายและความปลอดภัยครบครัน:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="flex items-center space-x-2 p-2 rounded-xl bg-bg border border-line/50 text-ink text-xs font-medium">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>กล้อง CCTV 24 ชม.</span>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-xl bg-bg border border-line/50 text-ink text-xs font-medium">
                <KeyRound className="h-4 w-4 text-primary shrink-0" />
                <span>ประตูคีย์การ์ด</span>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-xl bg-bg border border-line/50 text-ink text-xs font-medium">
                <Building className="h-4 w-4 text-primary shrink-0" />
                <span>ลิฟต์โดยสาร</span>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-xl bg-bg border border-line/50 text-ink text-xs font-medium">
                <Car className="h-4 w-4 text-primary shrink-0" />
                <span>ที่จอดรถสะดวกสบาย</span>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-xl bg-bg border border-line/50 text-ink text-xs font-medium">
                <Wifi className="h-4 w-4 text-primary shrink-0" />
                <span>ฟรี Wi-Fi ความเร็วสูง</span>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-xl bg-bg border border-line/50 text-ink text-xs font-medium">
                <CheckCircle2 className="h-4 w-4 text-tone-green-solid shrink-0" />
                <span>เฟอร์นิเจอร์พร้อมอยู่</span>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-2 text-xs text-ink-muted">
              <span>
                สอบถามข้อมูลเพิ่มเติม โทร:{' '}
                <a href="tel:0818940000" className="text-primary font-bold hover:underline">
                  081-894-XXXX
                </a>{' '}
                หรือ Line ID:{' '}
                <span className="text-primary font-bold">@phatlada</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
