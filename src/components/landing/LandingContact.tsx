import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  ArrowUpRight,
  Navigation,
} from 'lucide-react';
import { getLocalSettings, fetchSettings, DormSettings } from '../../services/settingsService';
import { formatPhone } from '../../lib/format';
import { useLanguage } from '../../contexts/LanguageContext';

interface LandingContactProps {
  onOpenBooking: () => void;
}

export const LandingContact: React.FC<LandingContactProps> = ({ onOpenBooking }) => {
  const [settings, setSettings] = useState<DormSettings>(() => getLocalSettings());
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

  const fullAddress = settings.address || '79 หมู่ 7 เวียง อำเภอ เชียงของ เชียงราย 57140';
  const googleMapsShareUrl = 'https://maps.app.goo.gl/E2qLGRGJMNUEMSzE7';

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">
            {t.contact.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink font-prompt">
            {t.contact.title}
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Details Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-line shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-ink mb-1 font-prompt">
                  {settings.dormitoryName || 'ภัทร์ลดา อพาร์ทเมนท์'}
                </h3>
                <p className="text-xs text-ink-secondary">{t.contact.subHeading}</p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Address */}
                <div className="flex items-start space-x-3 text-ink">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block mb-0.5">{t.contact.addressLabel}</span>
                    <p className="text-ink-secondary leading-relaxed font-medium">
                      {fullAddress}
                    </p>
                    <p className="text-[11px] text-primary font-mono mt-0.5">
                      Plus Code: 7C27+44 ตำบล เวียง อำเภอ เชียงของ เชียงราย
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3 text-ink">
                  <div className="p-2.5 rounded-xl bg-tone-green-soft text-tone-green-solid flex-shrink-0 mt-0.5">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block mb-0.5">{t.contact.phoneLabel}</span>
                    <div className="flex flex-wrap items-center">
                      {[settings.phone, settings.phone2]
                        .flatMap((p) => (p ? p.split(/[,/]/) : []))
                        .map((p) => p.trim())
                        .filter(Boolean)
                        .map((p, idx) => {
                          const tel = p.replace(/\D/g, '');
                          const formatted = formatPhone(p);
                          return (
                            <span key={idx} className="inline-flex items-center">
                              {idx > 0 && <span className="text-ink-secondary mr-2">, </span>}
                              <a
                                href={`tel:${tel}`}
                                className="text-primary font-mono text-base font-bold hover:underline"
                              >
                                {formatted}
                              </a>
                            </span>
                          );
                        })}
                    </div>
                    <span className="text-[11px] text-ink-secondary block mt-0.5">
                      {t.contact.phoneHint}
                    </span>
                  </div>
                </div>

                {/* Operating hours */}
                <div className="flex items-start space-x-3 text-ink">
                  <div className="p-2.5 rounded-xl bg-tone-amber-soft text-tone-amber-solid flex-shrink-0 mt-0.5">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-ink block mb-0.5">{t.contact.hoursLabel}</span>
                    <p className="text-ink-secondary">{t.contact.hoursValue}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{t.contact.bookViewingBtn}</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Interactive Google Map Section */}
          <div id="location" className="p-6 sm:p-8 rounded-2xl bg-bg border border-line flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-ink flex items-center space-x-2 font-prompt">
                  <Navigation className="h-4 w-4 text-primary" />
                  <span>{t.contact.mapTitle}</span>
                </h3>
                <a
                  href={googleMapsShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-primary font-semibold hover:underline"
                >
                  <span>{t.contact.openMaps}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Embedded Google Maps with Click-to-Navigate Overlay */}
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-line shadow-sm bg-surface relative group">
                <iframe
                  src="https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s20.2503358,100.4079899!6i16!3m1!1sth!5m1!1sth"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t.contact.mapIframeTitle}
                  className="w-full h-full pointer-events-none select-none border-0"
                />

                {/* Direct Navigation Click Overlay */}
                <a
                  href={googleMapsShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10 flex items-end justify-center p-3.5 bg-black/0 hover:bg-black/10 transition cursor-pointer"
                  title={t.contact.clickToNavigate}
                >
                  <div className="bg-white/95 backdrop-blur-md text-ink px-4 py-2 rounded-xl shadow-md border border-line flex items-center space-x-2 text-xs font-bold group-hover:scale-105 transition-transform">
                    <Navigation className="h-4 w-4 text-primary" />
                    <span>{t.contact.clickToNavigate}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                  </div>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-secondary bg-surface p-3.5 rounded-xl border border-line">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{t.contact.gpsCoordinates}</span>
              </div>
              <a
                href={googleMapsShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary font-bold hover:underline shrink-0"
              >
                {t.contact.gpsNavigateBtn}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
