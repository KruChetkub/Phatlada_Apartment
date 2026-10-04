import { Language, LanguageOption, LandingTranslations } from './types';
import { th } from './th';
import { en } from './en';
import { lo } from './lo';

export * from './types';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'th', label: 'ไทย', flag: '🇹🇭', nativeName: 'ภาษาไทย' },
  { code: 'en', label: 'EN', flag: '🇬🇧', nativeName: 'English' },
  { code: 'lo', label: 'ລາວ', flag: '🇱🇦', nativeName: 'ພາສາລາວ' },
];

export const landingTranslations: Record<Language, LandingTranslations> = {
  th,
  en,
  lo,
};
