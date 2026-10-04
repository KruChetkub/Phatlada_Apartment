import React from 'react';
import { ShieldCheck, Wifi, Car, Waves } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LandingFacilities: React.FC = () => {
  const { t } = useLanguage();

  const facilities = [
    {
      icon: ShieldCheck,
      title: t.facilities.cctvTitle,
      desc: t.facilities.cctvDesc,
      color: 'text-primary bg-primary/10',
    },
    {
      icon: Wifi,
      title: t.facilities.wifiTitle,
      desc: t.facilities.wifiDesc,
      color: 'text-tone-blue-solid bg-tone-blue-soft',
    },
    {
      icon: Car,
      title: t.facilities.parkingTitle,
      desc: t.facilities.parkingDesc,
      color: 'text-tone-green-solid bg-tone-green-soft',
    },
    {
      icon: Waves,
      title: t.facilities.laundryTitle,
      desc: t.facilities.laundryDesc,
      color: 'text-tone-amber-solid bg-tone-amber-soft',
    },
  ];

  return (
    <section id="facilities" className="py-16 sm:py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-primary tracking-wider uppercase">
            {t.facilities.badge}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ink font-prompt">
            {t.facilities.title}
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary">
            {t.facilities.subtitle}
          </p>
        </div>

        {/* Balanced 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {facilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-surface border border-line hover:border-line-dark shadow-xs hover:shadow-card transition flex flex-col justify-between"
              >
                <div>
                  <div className={`p-3 rounded-xl w-fit mb-4 ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-ink mb-2 font-prompt">{item.title}</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
