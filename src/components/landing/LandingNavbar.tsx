import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Menu, X, Phone, Moon, Sun, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Language } from '../../locales/landing';

interface LandingNavbarProps {
  onOpenBooking: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onOpenBooking }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage, t, availableLanguages } = useLanguage();

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollToTop = () => {
    setMobileOpen(false);
    if (window.location.pathname === '/') {
      if (window.location.hash) {
        window.history.pushState(null, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectLanguage = (langCode: Language) => {
    setLanguage(langCode);
    setLangDropdownOpen(false);
  };

  const currentLangOption = availableLanguages.find((l) => l.code === language) || availableLanguages[0];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-line shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={handleScrollToTop}
          className="flex items-center space-x-2.5 sm:space-x-3 group"
          aria-label={t.nav.brandName}
        >
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-primary to-tone-blue-solid flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform font-bold shrink-0">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <span className="text-base sm:text-xl font-extrabold text-ink tracking-tight block font-prompt leading-tight">
              {t.nav.brandName}
            </span>
            <span className="text-[10px] sm:text-xs text-primary font-semibold tracking-wider block uppercase font-sans mt-0.5 sm:mt-0">
              {t.nav.brandSubtitle}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs sm:text-sm font-medium text-ink-secondary">
          <a href="#rooms" className="hover:text-primary transition">
            {t.nav.rooms}
          </a>
          <a href="#facilities" className="hover:text-primary transition">
            {t.nav.facilities}
          </a>
          <a href="#location" className="hover:text-primary transition">
            {t.nav.location}
          </a>
          <a href="#contact" className="hover:text-primary transition">
            {t.nav.contact}
          </a>
        </nav>

        {/* Desktop Action Buttons: Language + Theme Toggle + Booking CTA */}
        <div className="hidden md:flex items-center space-x-2.5">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-ink bg-bg hover:bg-line border border-line rounded-lg transition hover:scale-105"
              aria-label={t.nav.language}
            >
              <span className="text-sm">{currentLangOption.flag}</span>
              <span>{currentLangOption.label}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-surface border border-line rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                {availableLanguages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleSelectLanguage(item.code)}
                    className={`w-full px-3 py-2 text-xs font-medium text-left flex items-center justify-between transition hover:bg-bg ${
                      language === item.code ? 'text-primary font-bold bg-primary/5' : 'text-ink'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-base">{item.flag}</span>
                      <span>{item.nativeName}</span>
                    </span>
                    {language === item.code && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-ink hover:text-primary transition-all hover:scale-105 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="สลับโหมดมืด/สว่าง"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300" />}
            <span>{isDarkMode ? t.nav.lightMode : t.nav.darkMode}</span>
          </button>

          {/* Booking CTA Button */}
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-full shadow-sm hover:shadow transition cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{t.nav.bookViewing}</span>
          </button>
        </div>

        {/* Mobile Actions: Theme Toggle + Booking CTA + Hamburger */}
        <div className="flex md:hidden items-center space-x-1.5">
          {/* Theme Toggle Button for Mobile Header */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
            aria-label="สลับโหมดมืด/สว่าง"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Booking CTA Button for Mobile Header */}
          <button
            onClick={onOpenBooking}
            className="px-2.5 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-full flex items-center space-x-1 transition"
          >
            <Phone className="h-3 w-3" />
            <span>{t.nav.bookViewingShort}</span>
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg text-ink-secondary hover:text-ink focus:outline-none"
            aria-label="เมนู"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-b border-line px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <a
            href="#rooms"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-ink hover:text-primary"
          >
            {t.nav.rooms}
          </a>
          <a
            href="#facilities"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-ink hover:text-primary"
          >
            {t.nav.facilities}
          </a>
          <a
            href="#location"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-ink hover:text-primary"
          >
            {t.nav.location}
          </a>
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-ink hover:text-primary"
          >
            {t.nav.contact}
          </a>

          {/* Language Selector inside Drawer */}
          <div className="pt-3 border-t border-line space-y-2">
            <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">
              {t.nav.language} / Language
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {availableLanguages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => handleSelectLanguage(item.code)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 border transition ${
                    language === item.code
                      ? 'bg-primary text-white border-primary shadow-xs font-bold'
                      : 'bg-bg text-ink border-line hover:bg-line/50'
                  }`}
                >
                  <span>{item.flag}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-line flex flex-col gap-2">
            <button
              onClick={toggleTheme}
              className="w-full py-2.5 px-3 text-xs font-medium text-ink bg-bg rounded-xl flex items-center justify-between transition-colors"
            >
              <span>{isDarkMode ? t.nav.switchToLight : t.nav.switchToDark}</span>
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 text-center text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{t.nav.bookViewing}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
