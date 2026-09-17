import React from 'react';
import {
  ShieldCheck,
  Wifi,
  Sparkles,
  Phone,
  Play,
  Waves,
  Building,
  Car,
  CheckCircle2,
} from 'lucide-react';

interface LandingHeroProps {
  onOpenBooking: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-bg overflow-hidden select-none py-6 sm:py-10">
      {/* Background Image /1.jpg displayed purely with no artificial gradients or filters */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-[center_left_20%] sm:bg-left scale-100"
        style={{ backgroundImage: "url('/1.jpg')" }}
      />

      {/* Main Content Container - Flushed to the far RIGHT corner */}
      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-3 sm:px-6 lg:pr-8 lg:pl-4 flex justify-end">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl p-5 sm:p-7 lg:p-8 shadow-2xl shadow-black/10 ring-1 ring-black/5 text-left space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="tracking-wide">ภัทร์ลดา อพาร์ทเมนท์ • PHATLADA</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink tracking-tight leading-[1.18] font-prompt">
            สัมผัสชีวิตที่ลงตัว <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tone-blue-solid to-primary">
              อบอุ่น โปร่งสบาย และสดใสในทุกวัน
            </span>
          </h1>

          {/* Narrative Paragraph */}
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
            พื้นที่พักผ่อนที่ออกแบบมาเพื่อความสุขของคุณ บรรยากาศเงียบสงบ สะอาด โปร่งสบาย ร่มรื่น และปลอดภัย เฟอร์นิเจอร์ครบชุดพร้อมเข้าอยู่ ทำเลเดินทางสะดวก ใกล้สิ่งอำนวยความสะดวก พร้อมการบริการด้วยใจและระบบดิจิทัลตลอด 24 ชั่วโมง
          </p>

          {/* Pricing Highlight & Promotion */}
          <div className="pt-1 space-y-1 border-t border-line/60">
            <div className="flex items-baseline space-x-2.5 pt-1.5">
              <span className="text-2xl sm:text-3xl font-black text-ink font-prompt">
                ฿3,800
              </span>
              <span className="text-sm sm:text-base text-ink-muted line-through">
                ฿4,500
              </span>
              <span className="text-xs text-ink-secondary font-medium">
                / เดือน
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-xs font-semibold text-tone-green-solid">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tone-green-solid opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tone-green-solid" />
              </span>
              <span>โปรโมชั่นห้องใหม่: จองวันนี้รับส่วนลดค่าประกันและฟรี Wi-Fi ทันที</span>
            </div>
          </div>

          {/* Dual Action Buttons */}
          <div className="pt-1 flex flex-wrap items-center gap-2.5">
            {/* Primary Button */}
            <button
              onClick={onOpenBooking}
              className="rounded-full bg-gradient-to-r from-primary to-tone-blue-solid hover:from-primary/90 hover:to-tone-blue-solid/90 text-white font-bold px-6 py-3 text-xs sm:text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Phone className="h-4 w-4" />
              <span>นัดหมายเข้าชมห้องพัก</span>
            </button>

            {/* Secondary Button */}
            <a
              href="#rooms"
              className="rounded-full bg-surface hover:bg-bg border border-line text-ink font-semibold px-5 py-3 text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all flex items-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="h-3.5 w-3.5 fill-primary text-primary" />
              <span>ดูประเภทห้อง & ราคา</span>
            </a>
          </div>

          {/* Bottom Features & Trust Badges */}
          <div className="pt-3 border-t border-line/60">
            <p className="text-[11px] font-semibold text-ink-secondary mb-2">
              มาตรฐานความสะดวกสบายและความปลอดภัยครบครัน:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-bg border border-line/50 text-ink text-[11px] font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>CCTV 24 ชม.</span>
              </div>

              <div className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-bg border border-line/50 text-ink text-[11px] font-medium">
                <Waves className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>เครื่องซักผ้า-ตู้น้ำ</span>
              </div>

              <div className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-bg border border-line/50 text-ink text-[11px] font-medium">
                <Building className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>ลิฟต์โดยสาร</span>
              </div>

              <div className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-bg border border-line/50 text-ink text-[11px] font-medium">
                <Car className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>ที่จอดรถสะดวก</span>
              </div>

              <div className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-bg border border-line/50 text-ink text-[11px] font-medium">
                <Wifi className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>ฟรี Wi-Fi แรง</span>
              </div>

              <div className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-bg border border-line/50 text-ink text-[11px] font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-tone-green-solid shrink-0" />
                <span>เฟอร์นิเจอร์ครบ</span>
              </div>
            </div>

            <div className="mt-3 flex items-center space-x-2 text-[11px] text-ink-muted">
              <span>
                สอบถามด่วน โทร:{' '}
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
