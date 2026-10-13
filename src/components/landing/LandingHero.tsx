import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Wifi,
  Sparkles,
  Phone,
  Play,
  Waves,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getLocalSettings, fetchSettings, DormSettings } from '../../services/settingsService';
import { formatPhone } from '../../lib/format';
import { useLanguage } from '../../contexts/LanguageContext';

export interface HeroSlide {
  id: number;
  src: string;
  title: string;
  subtitle: string;
  tag: string;
  galleryIndex: number;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 0,
    src: '/1.jpg',
    title: 'ภัทร์ลดา อพาร์ทเมนท์',
    subtitle: 'อาคาร 2 ชั้น บรรยากาศเงียบสงบ สะอาด ปลอดภัย',
    tag: 'อาคารภายนอก',
    galleryIndex: 0,
  },
  {
    id: 1,
    src: '/rooms/room-1.jpg',
    title: 'ห้องพักสไตล์ฟ้าคราม โปร่งสบาย',
    subtitle: 'เตียง 5 ฟุต โต๊ะทำงานริมระเบียงส่วนตัว แสงธรรมชาติ',
    tag: 'ห้องนอนฟ้าคราม',
    galleryIndex: 0,
  },
  {
    id: 2,
    src: '/rooms/room-2.jpg',
    title: 'ห้องพักสไตล์วอร์มมอคค่า อบอุ่น',
    subtitle: 'แอร์เย็นฉ่ำ ผ้าม่านทึบแสง 100% โต๊ะเครื่องแป้ง',
    tag: 'ห้องนอนมอคค่า',
    galleryIndex: 1,
  },
  {
    id: 3,
    src: '/rooms/room-3.jpg',
    title: 'ห้องพักสไตล์เซจกรีน ธรรมชาติ',
    subtitle: 'โทนธรรมชาติผ่อนคลาย สะอาด ร่มรื่น พร้อมเข้าอยู่',
    tag: 'ห้องนอนเซจกรีน',
    galleryIndex: 2,
  },
];

interface LandingHeroProps {
  onOpenBooking: () => void;
  onOpenGallery?: (index?: number) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onOpenBooking, onOpenGallery }) => {
  const [settings, setSettings] = useState<DormSettings>(getLocalSettings);
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const mobileThumbnailsRef = useRef<HTMLDivElement>(null);

  // Auto-slide every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Keep active thumbnail centered in mobile scroll
  useEffect(() => {
    if (mobileThumbnailsRef.current) {
      const activeEl = mobileThumbnailsRef.current.children[activeSlide] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeSlide]);

  useEffect(() => {
    fetchSettings().then((s) => setSettings(s)).catch(() => {});

    const handleUpdate = () => {
      setSettings(getLocalSettings());
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'phatlada_system_settings' || e.key === 'dormplus_system_settings') {
        setSettings(getLocalSettings());
      }
    };

    window.addEventListener('phatlada_settings_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('phatlada_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const renderCardContent = () => (
    <div className="bg-white/95 backdrop-blur-md border border-white/80 rounded-3xl p-5 sm:p-7 lg:p-8 shadow-2xl shadow-black/10 ring-1 ring-black/5 text-left space-y-4">
      {/* Top Pill Badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-xs">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="tracking-wide">{settings.dormitoryName || 'ภัทร์ลดา อพาร์ทเมนท์'} • PHATLADA</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink tracking-tight leading-[1.22] font-prompt">
        <span className="block">{t.hero.headline1}</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tone-blue-solid to-primary">
          <span className="inline-block">{t.hero.headline2}</span>{' '}
          <span className="inline-block">{t.hero.headline3}</span>
        </span>
      </h1>

      {/* Narrative Paragraph */}
      <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
        {t.hero.description}
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
            {t.hero.perMonth}
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
          <span>{t.hero.bookTourBtn}</span>
        </button>

        <a
          href="#rooms"
          className="justify-center rounded-full bg-surface hover:bg-bg border border-line text-ink font-semibold px-5 py-3 text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all flex items-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Play className="h-3.5 w-3.5 fill-primary text-primary" />
          <span>{t.hero.viewRoomsBtn}</span>
        </a>
      </div>

      {/* Bottom Features & Trust Badges */}
      <div className="pt-3 border-t border-line/60">
        <p className="text-[11px] font-semibold text-ink-secondary mb-2">
          {t.hero.amenitiesTitle}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-bg border border-line/50 text-ink text-[11px] font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{t.hero.cctv}</span>
          </div>

          <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-bg border border-line/50 text-ink text-[11px] font-medium">
            <Waves className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{t.hero.laundry}</span>
          </div>

          <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-bg border border-line/50 text-ink text-[11px] font-medium">
            <Car className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{t.hero.parking}</span>
          </div>

          <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-bg border border-line/50 text-ink text-[11px] font-medium">
            <Wifi className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{t.hero.wifi}</span>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center space-x-1.5 p-2 rounded-xl bg-bg border border-line/50 text-ink text-[11px] font-medium justify-center sm:justify-start">
            <CheckCircle2 className="h-3.5 w-3.5 text-tone-green-solid shrink-0" />
            <span>{t.hero.furnished}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center space-x-2 text-[11px] text-ink-muted">
          <span>
            {t.hero.callInquiry}{' '}
            {[settings.phone, settings.phone2]
              .flatMap((p) => (p ? p.split(/[,/]/) : []))
              .map((p) => p.trim())
              .filter(Boolean)
              .map((p, idx) => {
                const tel = p.replace(/\D/g, '');
                const formatted = formatPhone(p);
                return (
                  <span key={idx}>
                    {idx > 0 && <span className="text-ink-muted mr-1.5">, </span>}
                    <a href={`tel:${tel}`} className="text-primary font-bold hover:underline">
                      {formatted}
                    </a>
                  </span>
                );
              })}{' '}
            {t.hero.welcomeEveryday}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative bg-bg select-none">
      {/* DESKTOP VIEW (lg and up): Fullscreen Hero with auto-slide background and thumbnail strip at bottom-left */}
      <div
        className="hidden lg:flex relative min-h-[calc(100vh-80px)] items-center justify-end overflow-hidden py-10 px-8 xl:px-12"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Slide Images with smooth crossfade */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          {HERO_SLIDES.map((slide, idx) => (
            <img
              key={slide.id}
              src={slide.src}
              alt={slide.title}
              width={1448}
              height={1086}
              className={`absolute inset-0 w-full h-full object-cover object-[left_30%] transition-all duration-1000 ease-out ${
                idx === activeSlide
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
            />
          ))}
          {/* Subtle gradient overlay to enhance card and thumbnail contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 z-10 pointer-events-none" />
        </div>

        {/* Desktop Left-Bottom: Thumbnail Strip (ตรงตามตัวอย่างภาพแนบ มีภาพตัวอย่างเรียงด้านล่าง เลื่อนอัตโนมัติ/คลิกเลือกได้) */}
        <div className="absolute left-8 xl:left-12 bottom-8 z-20 max-w-xl bg-black/65 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="flex items-center justify-between mb-2 px-1 text-white text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold flex items-center gap-1.5 font-prompt">
                <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                <span>{HERO_SLIDES[activeSlide].title}</span>
              </span>
              <span className="text-white/60 text-[11px]">({activeSlide + 1}/{HERO_SLIDES.length})</span>
            </div>

            {/* Prev / Next buttons */}
            <div className="flex items-center space-x-1.5">
              {onOpenGallery && (
                <button
                  onClick={() => onOpenGallery(HERO_SLIDES[activeSlide].galleryIndex)}
                  className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition cursor-pointer flex items-center gap-1 mr-1"
                  title="ดูภาพขยายเต็มจอ"
                >
                  <span>🔍 ขยาย</span>
                </button>
              )}
              <button
                onClick={() => setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                aria-label="ภาพก่อนหน้า"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                aria-label="ภาพถัดไป"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Row of 4 Thumbnails */}
          <div className="flex items-center gap-2.5">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === activeSlide;
              return (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`group relative rounded-xl overflow-hidden w-24 aspect-[4/3] border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-primary ring-2 ring-primary/50 scale-105 shadow-lg opacity-100'
                      : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-90'
                  }`}
                >
                  <img
                    src={slide.src}
                    alt={slide.tag}
                    width={1448}
                    height={1086}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 px-1 py-0.5 bg-black/80">
                    <span className="text-[9px] font-bold text-white block truncate text-center font-prompt">
                      {slide.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Info Card */}
        <div className="relative z-20 w-full lg:max-w-[490px] xl:max-w-xl animate-in fade-in slide-in-from-right-4 duration-300">
          {renderCardContent()}
        </div>
      </div>

      {/* MOBILE & TABLET VIEW (< lg): Stack Layout with Carousel on Top + Thumbnails Directly Underneath (ตรงตามตัวอย่างภาพแนบ) */}
      <div className="lg:hidden flex flex-col bg-bg">
        {/* 1. Main Featured Photo Viewport (1448x1086 = 4:3) with Slide Transitions */}
        <div
          className="relative w-full aspect-[4/3] max-h-[560px] overflow-hidden bg-black select-none group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Main Image with smooth crossfade */}
          {HERO_SLIDES.map((slide, idx) => (
            <img
              key={slide.id}
              src={slide.src}
              alt={slide.title}
              width={1448}
              height={1086}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                idx === activeSlide
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
            />
          ))}

          {/* Left Arrow Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
            }}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition active:scale-95 cursor-pointer shadow-md"
            aria-label="ภาพก่อนหน้า"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 transition active:scale-95 cursor-pointer shadow-md"
            aria-label="ภาพถัดไป"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Top-Left Expand Badge */}
          {onOpenGallery && (
            <button
              onClick={() => onOpenGallery(HERO_SLIDES[activeSlide].galleryIndex)}
              className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold transition active:scale-95 cursor-pointer"
              title="ดูภาพขยายเต็มจอ"
            >
              <span>🔍 ดูภาพขยาย</span>
            </button>
          )}

          {/* Top-Right Badge: Active Slide Counter & Tag */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold">
            <span className="text-primary font-bold">{activeSlide + 1}</span>
            <span>/</span>
            <span>{HERO_SLIDES.length}</span>
            <span className="mx-0.5">•</span>
            <span className="truncate max-w-[120px] font-prompt">{HERO_SLIDES[activeSlide].tag}</span>
          </div>

          {/* Bottom Caption Overlay */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-3.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
            <p className="text-xs font-bold drop-shadow-sm font-prompt line-clamp-1">
              {HERO_SLIDES[activeSlide].title}
            </p>
            <p className="text-[11px] text-white/80 line-clamp-1">
              {HERO_SLIDES[activeSlide].subtitle}
            </p>
          </div>
        </div>

        {/* 2. THUMBNAIL PREVIEWS DIRECTLY UNDERNEATH (ภาพตัวอย่างใต้ภาพ คล้ายตัวอย่าง Baiyoke Sky Hotel) */}
        <div className="bg-surface border-y border-line py-2 px-3 sm:px-4">
          {/* Horizontal scrollable thumbnails strip */}
          <div
            ref={mobileThumbnailsRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 scroll-smooth"
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === activeSlide;
              return (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`relative flex-shrink-0 w-24 sm:w-28 rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-primary ring-2 ring-primary/40 shadow-md scale-[1.03] opacity-100'
                      : 'border-line/70 hover:border-primary/50 opacity-60 hover:opacity-90'
                  }`}
                >
                  <img
                    src={slide.src}
                    alt={slide.tag}
                    width={1448}
                    height={1086}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 px-1 py-0.5 bg-black/75 backdrop-blur-[2px]">
                    <span className="text-[9px] font-bold text-white block truncate text-center font-prompt">
                      {slide.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Card placed cleanly below photo & thumbnails with no overlap */}
        <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-xl mx-auto w-full">
          {renderCardContent()}
        </div>
      </div>
    </section>
  );
};
