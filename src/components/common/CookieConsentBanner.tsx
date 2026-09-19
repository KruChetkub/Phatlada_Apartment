import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check, ShieldCheck } from 'lucide-react';
import { secureStorage } from '../../lib/secureStorage';

const COOKIE_CONSENT_KEY = 'phatlada_cookie_consent_v1';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/dismissed cookie consent
    const consent = secureStorage.getItem<string>(COOKIE_CONSENT_KEY) || localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay slightly for smooth page load experience
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    secureStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    } catch {
      // Ignore fallback error
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    secureStorage.setItem(COOKIE_CONSENT_KEY, 'necessary_only');
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'necessary_only');
    } catch {
      // Ignore fallback error
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fade-in">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-slate-700/80">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl flex-shrink-0 mt-0.5">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm text-white mb-1 font-prompt flex items-center gap-1.5">
              การใช้งานคุกกี้และความเป็นส่วนตัว
            </h4>
            <p className="text-slate-300 leading-relaxed mb-3">
              เว็บไซต์และระบบของเราใช้คุกกี้และพื้นที่จัดเก็บที่จำเป็นเพื่อรักษาความปลอดภัย จัดการเซสชัน และมอบประสบการณ์ใช้งานที่ดีที่สุดตามกฎหมาย PDPA
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 mb-3">
              <Link to="/cookie-policy" className="text-primary-soft hover:underline flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                อ่านนโยบายคุกกี้
              </Link>
              <span>•</span>
              <Link to="/privacy-policy" className="text-primary-soft hover:underline">
                นโยบายความเป็นส่วนตัว
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-3 rounded-xl transition text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95"
              >
                <Check className="h-3.5 w-3.5" />
                ยอมรับทั้งหมด
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3 rounded-xl transition text-xs active:scale-95"
              >
                เฉพาะที่จำเป็น
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDecline}
            aria-label="ปิดการแจ้งเตือน"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition -mt-1 -mr-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
