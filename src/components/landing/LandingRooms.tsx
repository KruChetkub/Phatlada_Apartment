import React, { useState, useEffect } from 'react';
import { Check, Phone, Sparkles, Calendar, Moon } from 'lucide-react';
import { getLocalSettings, fetchSettings, DormSettings } from '../../services/settingsService';
import { useLanguage } from '../../contexts/LanguageContext';

interface LandingRoomsProps {
  onSelectRoom: (roomTitle: string) => void;
}

export const LandingRooms: React.FC<LandingRoomsProps> = ({ onSelectRoom }) => {
  const [settings, setSettings] = useState<DormSettings>(getLocalSettings);
  const { t } = useLanguage();

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

  const monthlyPriceFormatted = Number(settings.landingStartingPrice || 3800).toLocaleString();
  const dailyPriceFormatted = Number(settings.landingDailyPrice || 500).toLocaleString();
  const originalPriceFormatted = Number(settings.landingOriginalPrice || 0).toLocaleString();

  // Shared standard air amenities from current locale
  const sharedAmenities = [
    t.rooms.amenityAir,
    t.rooms.amenityBed,
    t.rooms.amenityWardrobe,
    t.rooms.amenityWaterHeater,
    t.rooms.amenityBalcony,
    t.rooms.amenityWifi,
  ];

  return (
    <section id="rooms" className="py-16 sm:py-24 bg-surface border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">
            {t.rooms.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink font-prompt">
            {t.rooms.title}
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary">
            {t.rooms.subtitle}
          </p>
        </div>

        {/* 2 Comparison Cards (Monthly vs Daily) Centered and Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          
          {/* Card 1: ห้องแอร์มาตรฐาน (รายเดือน) */}
          <div className="rounded-3xl border-2 border-primary bg-white shadow-card-hover relative ring-4 ring-primary/10 flex flex-col justify-between transition-all hover:scale-[1.01]">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t.rooms.monthlyBadge}</span>
            </span>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{t.rooms.roomSizeMonthly}</span>
                </span>
                <div className="flex items-baseline space-x-1.5">
                  {Number(settings.landingOriginalPrice) > 0 && (
                    <span className="text-xs sm:text-sm text-ink-muted line-through">
                      ฿{originalPriceFormatted}
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-black text-ink font-prompt">
                    ฿{monthlyPriceFormatted}
                  </span>
                  <span className="text-xs text-ink-secondary font-medium">{t.rooms.perMonth}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-ink mb-2 font-prompt">
                {t.rooms.monthlyTitle}
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-6">
                {t.rooms.monthlyDesc}
              </p>

              <div className="space-y-2.5 pt-5 border-t border-line">
                <span className="text-xs font-bold text-ink block mb-3">
                  {t.rooms.amenitiesHeader}
                </span>
                {sharedAmenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-ink-secondary">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{amenity}</span>
                  </div>
                ))}
                <div className="flex items-start space-x-2.5 text-xs text-tone-green-solid font-medium pt-1">
                  <Check className="h-4 w-4 text-tone-green-solid flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{t.rooms.monthlyHighlight}</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0">
              <button
                onClick={() => onSelectRoom(t.rooms.monthlyTitle)}
                className="w-full py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                <span>{t.rooms.bookMonthlyBtn}</span>
              </button>
            </div>
          </div>

          {/* Card 2: ห้องแอร์มาตรฐาน (รายวัน) */}
          <div className="rounded-3xl border border-line bg-white shadow-card hover:border-line-dark hover:shadow-card-hover relative flex flex-col justify-between transition-all hover:scale-[1.01]">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-surface-secondary text-ink border border-line text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap">
              <Moon className="h-3.5 w-3.5 text-tone-blue-solid" />
              <span>{t.rooms.dailyBadge}</span>
            </span>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-tone-blue-solid bg-tone-blue-soft px-3 py-1 rounded-full flex items-center gap-1">
                  <Moon className="h-3.5 w-3.5" />
                  <span>{t.rooms.roomSizeDaily}</span>
                </span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-ink font-prompt">
                    ฿{dailyPriceFormatted}
                  </span>
                  <span className="text-xs text-ink-secondary font-medium">{t.rooms.perDay}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-ink mb-2 font-prompt">
                {t.rooms.dailyTitle}
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed mb-6">
                {t.rooms.dailyDesc}
              </p>

              <div className="space-y-2.5 pt-5 border-t border-line">
                <span className="text-xs font-bold text-ink block mb-3">
                  {t.rooms.amenitiesHeader}
                </span>
                {sharedAmenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-ink-secondary">
                    <Check className="h-4 w-4 text-tone-blue-solid flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{amenity}</span>
                  </div>
                ))}
                <div className="flex items-start space-x-2.5 text-xs text-tone-blue-solid font-medium pt-1">
                  <Check className="h-4 w-4 text-tone-blue-solid flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{t.rooms.dailyHighlight}</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 pt-0">
              <button
                onClick={() => onSelectRoom(t.rooms.dailyTitle)}
                className="w-full py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold bg-surface hover:bg-bg text-ink border border-line hover:border-line-dark shadow-xs hover:shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                <span>{t.rooms.inquireDailyBtn}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Informative Terms Note */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-bg border border-line max-w-3xl mx-auto text-center text-xs text-ink-secondary leading-relaxed">
          💡 <span className="font-bold text-ink">{t.rooms.termsNoticeTitle}</span> {t.rooms.termsNoticeText}
        </div>
      </div>
    </section>
  );
};
