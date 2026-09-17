import React from 'react';
import { ShieldCheck, Wifi, Sparkles, ArrowRight, Phone, Eye, CheckCircle2 } from 'lucide-react';

interface LandingHeroProps {
  onOpenBooking: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onOpenBooking }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-bg to-white py-16 sm:py-24">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-primary/10 via-tone-blue-soft/20 to-primary/5 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-primary/20 shadow-xs">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary">
              ยินดีต้อนรับสู่ ภัทร์ลดาอพาร์ทเมนท์ (Phatlada Apartment)
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight font-prompt leading-tight sm:leading-tight">
            ความสุขและความสงบในการพักอาศัย{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tone-blue-solid to-primary">
              น่าอยู่ ปลอดภัย เหมือนบ้าน
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-2xl mx-auto">
            อพาร์ตเมนต์คุณภาพ บรรยากาศเงียบสงบ สะอาด โปร่งสบาย พร้อมสิ่งอำนวยความสะดวกครบครัน เฟอร์นิเจอร์พร้อมเข้าอยู่ และการบริหารจัดการด้วยระบบดิจิทัลทันสมัย
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm shadow-md hover:shadow-lg transition group"
            >
              <Phone className="h-4 w-4" />
              <span>นัดหมายเข้าชมห้องจริง</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <a
              href="#rooms"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-white hover:bg-bg text-ink border border-line font-semibold text-sm shadow-xs transition"
            >
              <Eye className="h-4 w-4 text-primary" />
              <span>ดูประเภทห้องและราคา</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 border-t border-line/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/70 border border-line/60">
              <CheckCircle2 className="h-5 w-5 text-tone-green-solid flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-ink block">พร้อมเข้าอยู่</span>
                <span className="text-[11px] text-ink-secondary">เฟอร์นิเจอร์ครบชุด</span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/70 border border-line/60">
              <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-ink block">ปลอดภัย 24 ชม.</span>
                <span className="text-[11px] text-ink-secondary">คีย์การ์ด & CCTV</span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/70 border border-line/60">
              <Wifi className="h-5 w-5 text-tone-blue-solid flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-ink block">ฟรีอินเทอร์เน็ต</span>
                <span className="text-[11px] text-ink-secondary">Wi-Fi ความเร็วสูง</span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white/70 border border-line/60">
              <Sparkles className="h-5 w-5 text-tone-amber-solid flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-ink block">ระบบบิลออนไลน์</span>
                <span className="text-[11px] text-ink-secondary">สแกน QR จ่ายสะดวก</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
