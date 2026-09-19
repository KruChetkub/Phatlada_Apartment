// Formatting utilities adhering to RULES.md §2 and SPEC.md §9
// Uses Intl.DateTimeFormat("th-TH") with timeZone "Asia/Bangkok" (Buddhist Era พ.ศ.)

const BANGKOK_TZ = 'Asia/Bangkok';

/**
 * Format currency in Baht with symbol: "฿ 126,500"
 */
export function formatBaht(amountInBaht: number): string {
  const formatted = new Intl.NumberFormat('th-TH', {
    maximumFractionDigits: 0,
  }).format(amountInBaht);
  return `฿ ${formatted}`;
}

/**
 * Format currency with word "บาท": "3,500 บาท"
 */
export function formatBahtText(amountInBaht: number): string {
  const formatted = new Intl.NumberFormat('th-TH', {
    maximumFractionDigits: 0,
  }).format(amountInBaht);
  return `${formatted} บาท`;
}

/**
 * Format monthly rent: "3,800 บาท/เดือน"
 */
export function formatRent(amountInBaht: number): string {
  const formatted = new Intl.NumberFormat('th-TH', {
    maximumFractionDigits: 0,
  }).format(amountInBaht);
  return `${formatted} บาท/เดือน`;
}

/**
 * Convert satang to Baht (integer division or decimal)
 */
export function satangToBaht(satang: number): number {
  return Math.round(satang / 100);
}

const THAI_MONTH_NAMES = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

/**
 * Format "YYYY-MM" to Thai Month and Buddhist Year: "กันยายน 2569"
 */
export function formatThaiPeriod(period: string): string {
  if (!period) return '';
  const parts = period.split('-');
  if (parts.length < 2) return period;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) return period;
  const beYear = year + 543;
  return `${THAI_MONTH_NAMES[month - 1]} ${beYear}`;
}

/**
 * Format satang amount directly into Baht currency with symbol: "฿ 3,500"
 */
export function formatSatang(satang: number): string {
  return formatBaht(satangToBaht(satang));
}

/**
 * Parse date safely
 */
function toDate(d: Date | string): Date {
  return typeof d === 'string' ? new Date(d) : d;
}

/**
 * Format Thai date long: "11 กันยายน 2568"
 */
export function formatThaiDateLong(date: Date | string): string {
  const d = toDate(date);
  return new Intl.DateTimeFormat('th-TH', {
    timeZone: BANGKOK_TZ,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/**
 * Format Thai date short: "11 ก.ย. 2568"
 */
export function formatThaiDateShort(date: Date | string): string {
  const d = toDate(date);
  return new Intl.DateTimeFormat('th-TH', {
    timeZone: BANGKOK_TZ,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Format Thai time with "น.": "20:12 น."
 */
export function formatThaiTime(date: Date | string): string {
  const d = toDate(date);
  const timeStr = new Intl.DateTimeFormat('th-TH', {
    timeZone: BANGKOK_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
  return `${timeStr} น.`;
}

/**
 * Format relative time in Thai:
 * - < 1 นาที: "เมื่อสักครู่"
 * - < 60 นาที: "{m} นาทีที่แล้ว"
 * - < 24 ชม.: "{h} ชม.ที่แล้ว"
 * - < 7 วัน: "{d} วันที่แล้ว"
 * - เกิน 7 วัน: formatThaiDateShort
 */
export function formatRelativeTh(date: Date | string, nowInput?: Date | string): string {
  const d = toDate(date);
  const now = nowInput ? toDate(nowInput) : new Date();

  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) {
    return 'เมื่อสักครู่';
  }
  if (diffMin < 60) {
    return `${diffMin} นาทีที่แล้ว`;
  }
  if (diffHours < 24) {
    return `${diffHours} ชม.ที่แล้ว`;
  }
  if (diffDays < 7) {
    return `${diffDays} วันที่แล้ว`;
  }

  return formatThaiDateShort(d);
}

/**
 * Format percentage change: "↑ 12%" or "↓ 3%" or "—"
 */
export function formatChangePct(pct: number | null | undefined): string {
  if (pct === null || pct === undefined || isNaN(pct)) {
    return '—';
  }
  if (pct > 0) {
    return `↑ ${pct}%`;
  }
  if (pct < 0) {
    return `↓ ${Math.abs(pct)}%`;
  }
  return `0%`;
}

/**
 * Strip Thai title prefix ("น.ส.", "นาย", "นาง", "นางสาว") to derive initials/first name
 */
export function stripThaiTitle(fullName: string): string {
  if (!fullName) return '';
  const trimmed = fullName.trim();
  const prefixes = ['นางสาว', 'น.ส.', 'นาย', 'นาง'];
  for (const prefix of prefixes) {
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length).trim();
    }
  }
  return trimmed;
}

/**
 * Get initial letter for avatar from Thai/English name
 */
export function getAvatarInitial(fullName: string): string {
  const clean = stripThaiTitle(fullName);
  return clean.charAt(0) || 'D';
}

