import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, LayoutDashboard } from 'lucide-react';
import { getLocalSettings, fetchSettings, DormSettings } from '../../services/settingsService';
import { useLanguage } from '../../contexts/LanguageContext';

export const LandingFooter: React.FC = () => {
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

  return (
    <footer className="bg-ink text-white/80 py-12 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight font-prompt">
                {settings.dormitoryName || t.nav.brandName}
              </span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              {t.footer.desc}
            </p>
            <p className="text-[11px] text-white/50">
              {settings.address || '79 หมู่ 7 ต.เวียง อ.เชียงของ จ.เชียงราย 57140'}
            </p>
          </div>

          {/* Col 2: Quick links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.footer.quickLinksTitle}</h4>
            <ul className="space-y-2 text-white/60">
              <li>
                <a href="#rooms" className="hover:text-white transition">
                  {t.nav.rooms}
                </a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-white transition">
                  {t.nav.facilities}
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-white transition">
                  {t.nav.location}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Management */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.footer.managementTitle}</h4>
            <ul className="space-y-2 text-white/60">
              <li>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-1.5 text-primary-soft hover:text-white transition font-semibold"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                  <span>{t.footer.login}</span>
                </Link>
              </li>
              <li>
                <Link to="/invoices" className="hover:text-white transition">
                  {t.footer.checkBills}
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition">
                  {t.footer.helpGuide}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-2 text-white/60">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-white transition">
                  {t.footer.cookies}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-white/50 text-[11px] gap-3">
          <p>
            &copy; {new Date().getFullYear()} {settings.dormitoryName || t.nav.brandName}. {t.footer.rightsReserved}
          </p>
          <p className="flex items-center space-x-1">
            <span>Secured & Managed with Phatlada Core</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
