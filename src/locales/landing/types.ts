export type Language = 'th' | 'en' | 'lo';

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
  nativeName: string;
}

export interface LandingTranslations {
  // Navigation
  nav: {
    brandName: string;
    brandSubtitle: string;
    rooms: string;
    facilities: string;
    location: string;
    contact: string;
    bookViewing: string;
    bookViewingShort: string;
    lightMode: string;
    darkMode: string;
    switchToLight: string;
    switchToDark: string;
    language: string;
  };

  // Hero Section
  hero: {
    badge: string;
    headline1: string;
    headline2: string;
    headline3: string;
    description: string;
    perMonth: string;
    bookTourBtn: string;
    viewRoomsBtn: string;
    amenitiesTitle: string;
    cctv: string;
    laundry: string;
    parking: string;
    wifi: string;
    furnished: string;
    callInquiry: string;
    welcomeEveryday: string;
  };

  // Rooms Section
  rooms: {
    badge: string;
    title: string;
    subtitle: string;
    monthlyBadge: string;
    dailyBadge: string;
    roomSizeMonthly: string;
    roomSizeDaily: string;
    perMonth: string;
    perDay: string;
    monthlyTitle: string;
    monthlyDesc: string;
    dailyTitle: string;
    dailyDesc: string;
    amenitiesHeader: string;
    amenityAir: string;
    amenityBed: string;
    amenityWardrobe: string;
    amenityWaterHeater: string;
    amenityBalcony: string;
    amenityWifi: string;
    monthlyHighlight: string;
    dailyHighlight: string;
    bookMonthlyBtn: string;
    inquireDailyBtn: string;
    termsNoticeTitle: string;
    termsNoticeText: string;
  };

  // Facilities Section
  facilities: {
    badge: string;
    title: string;
    subtitle: string;
    cctvTitle: string;
    cctvDesc: string;
    wifiTitle: string;
    wifiDesc: string;
    parkingTitle: string;
    parkingDesc: string;
    laundryTitle: string;
    laundryDesc: string;
  };

  // Contact & Location Section
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    subHeading: string;
    addressLabel: string;
    phoneLabel: string;
    phoneHint: string;
    hoursLabel: string;
    hoursValue: string;
    bookViewingBtn: string;
    mapTitle: string;
    openMaps: string;
    mapIframeTitle: string;
    clickToNavigate: string;
    gpsCoordinates: string;
    gpsNavigateBtn: string;
  };

  // Footer
  footer: {
    desc: string;
    quickLinksTitle: string;
    managementTitle: string;
    login: string;
    checkBills: string;
    helpGuide: string;
    privacy: string;
    terms: string;
    cookies: string;
    rightsReserved: string;
  };

  // Booking Inquiry Modal
  bookingModal: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    roomTypeLabel: string;
    monthlyOption: string;
    dailyOption: string;
    visitDateLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    closeBtn: string;
    privacyNotice: string;
    pdpaLink: string;
    cooldownNotice: string;
  };
}
