import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Wifi,
  Sparkles,
  Phone,
  Play,
  Waves,
  Car,
  CheckCircle2,
} from 'lucide-react';
import { getLocalSettings, DormSettings } from '../../services/settingsService';

interface LandingHeroProps {
  onOpenBooking: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onOpenBooking }) => {
  const [settings, setSettings] = useState<DormSettings>(getLocalSettings);

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getLocalSettings());
    };
    window.addEventListener('phatlada_settings_updated', handleUpdate);
    return () => window.removeEventListener('phatlada_settings_updated', handleUpdate);
  }, []);

  const phoneDisplay = settings.phone || '087 188 9122';
  const phoneTel = phoneDisplay.replace(/[^\d+]/g, '') || '0871889122';

  const renderCardContent = () => (
    <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl p-5 sm:p-7 lg:p-8 shadow-2xl shadow-black/10 ring-1 ring-black/5 text-left space-y-4">
      {/* Top Pill Badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-xs">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="tracking-wide">{settings.dormitoryName || 'ภัทร์ลดา อพาร์ทเมนท์'} • PHATLADA</span>
      </div>

      {/* Main Headline - Fixed Thai line wrapping so words never orphan */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink tracking-tight leading-[1.22] font-prompt">
        <span className="block whitespace-nowrap">สัมผัสชีวิตที่ลงตัว</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tone-blue-solid to-primary">
          <span className="inline-block whitespace-nowrap">อบอุ่น โปร่งสบาย</span>{' '}
          <span className="inline-block whitespace-nowrap">และสดใสในทุกวัน</span>
        </span>
      </h1>

      {/* Narrative Paragraph */}
      <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
        พื้นที่พักผ่อนที่ออกแบบมาเพื่อความสุขของคุณ บรรยากาศเงียบสงบ สะอาด โปร่งสบาย ร่มรื่น และปลอดภัย เฟอร์นิเจอร์ครบชุดพร้อมเข้าอยู่ ทำเลเดินทางสะดวก ใกล้สิ่งอำนวยความสะดวก พร้อมการบริการด้วยใจและระบบดิจิทัลตลอด 24 ชั่วโมง
      </p>

      {/* Pricing Highlight & Promotion - Configurable from Settings */}
      <div className="pt-1 space-y-1 border-t border-line/60">
        <div className="flex items-baseline space-x-2.5 pt-1.5">
          <span className="text-2xl sm:text-3xl font-black text-ink font-prompt">
            ฿{Number(settings.landingStartingPrice || 3800).toLocaleString()}
          </span>
          {Number(settings.landingOriginalPrice) > 0 && (
            <span className="text-sm sm:text-base text-ink-muted line-through">
              ฿{Number(settings.landingOriginalPrice).toLocaleString()}
            </span>
          )}
          <span className="text-xs text-ink-secondary font-medium">
            / เดือน
          </span>
        </div>

        {settings.landingPromoText && (
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-tone-green-solid">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tone-green-solid opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tone-green-solid" />
            </span>
            <span className="leading-tight">{settings.landingPromoText}</span>
          </div>
        )}
      </div>

      {/* Dual Action Buttons */}
      <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <button
          onClick={onOpenBooking}
          className="justify-center rounded-full bg-gradient-to-r from-primary to-tone-blue-solid hover:from-primary/90 hover:to-tone-blue-solid/90 text-white font-bold px-6 py-3 text-xs sm:text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 cursor-pointer"
        >
          <Phone className="h-4 w-4" />
          <span>นัดหมายเข้าชมห้องพัก</span>
        </button>

        <a
          href="#rooms"
          className="justify-center rounded-full bg-surface hover:bg-bg border border-line text-ink font-semibold px-5 py-3 text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all flex items-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
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
          <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-bg border border-line/50 text-ink text-[11px] font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>CCTV 24 ชม.</span>
          </div>

          <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-bg border border-line/50 text-ink text-[11px] font-medium">
            <Waves className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>เครื่องซักผ้า-ตู้น้ำ</span>
          </div>

          <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-bg border border-line/50 text-ink text-[11px] font-medium">
            <Car className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>ที่จอดรถสะดวก</span>
          </div>

          <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-bg border border-line/50 text-ink text-[11px] font-medium">
            <Wifi className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>ฟรี Wi-Fi แรง</span>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center space-x-1.5 p-2 rounded-xl bg-bg border border-line/50 text-ink text-[11px] font-medium justify-center sm:justify-start">
            <CheckCircle2 className="h-3.5 w-3.5 text-tone-green-solid shrink-0" />
            <span>เฟอร์นิเจอร์ครบ</span>
          </div>
        </div>

        <div className="mt-3 flex items-center space-x-2 text-[11px] text-ink-muted">
          <span>
            สอบถามด่วน โทร:{' '}
            <a href={`tel:${phoneTel}`} className="text-primary font-bold hover:underline">
              {phoneDisplay}
            </a> (ยินดีต้อนรับทุกวัน)
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative bg-bg select-none">
      {/* DESKTOP VIEW (lg and up): Fullscreen Hero with /1.jpg on left and card on right */}
      <div className="hidden lg:flex relative min-h-[calc(100vh-80px)] items-center justify-end overflow-hidden py-10 px-8">
        <div
          className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-left scale-100"
          style={{ backgroundImage: "url('/1.jpg')" }}
        />
        <div className="relative z-10 w-full max-w-xl animate-in fade-in slide-in-from-right-4 duration-300">
          {renderCardContent()}
        </div>
      </div>

      {/* MOBILE & TABLET VIEW (< lg): Stack Layout - Photo on top 100% unobstructed, Card stacked cleanly below */}
      <div className="lg:hidden flex flex-col bg-bg">
        {/* Top: 100% unobstructed photo of the apartment */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] sm:max-h-[420px] overflow-hidden bg-surface">
          <img
            src="/1.jpg"
            alt={settings.dormitoryName || 'ภัทร์ลดา อพาร์ทเมนท์'}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Bottom: Card placed cleanly below photo with no overlap */}
        <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-xl mx-auto w-full">
          {renderCardContent()}
        </div>
      </div>
    </section>
  );
};
