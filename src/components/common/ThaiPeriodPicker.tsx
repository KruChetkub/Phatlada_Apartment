import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';

interface ThaiPeriodPickerProps {
  value: string; // "YYYY-MM"
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

const THAI_MONTHS = [
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

export const ThaiPeriodPicker: React.FC<ThaiPeriodPickerProps> = ({
  value,
  onChange,
  label,
  required = false,
}) => {
  // Parse YYYY-MM
  const parsed = useMemo(() => {
    if (!value) {
      const today = new Date();
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
      };
    }
    const parts = value.split('-');
    if (parts.length >= 2) {
      return {
        year: parseInt(parts[0], 10) || new Date().getFullYear(),
        month: parseInt(parts[1], 10) || new Date().getMonth() + 1,
      };
    }
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
    };
  }, [value]);

  // Year options in Buddhist Era (พ.ศ.)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear - 5; y <= currentYear + 10; y++) {
      years.push({
        ce: y,
        be: y + 543,
      });
    }
    return years;
  }, []);

  const handleChange = (newYear: number, newMonth: number) => {
    const mm = String(newMonth).padStart(2, '0');
    onChange(`${newYear}-${mm}`);
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-ink-secondary">
          {label} {required && <span className="text-tone-red-solid">*</span>}
        </label>
      )}

      <div className="flex items-center space-x-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-bg text-primary border border-line flex-shrink-0">
          <Calendar className="h-4 w-4" />
        </div>

        {/* Month in Thai */}
        <select
          value={parsed.month}
          onChange={(e) => handleChange(parsed.year, parseInt(e.target.value, 10))}
          className="h-9 flex-1 rounded-md border border-line bg-surface px-2.5 text-xs text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {THAI_MONTHS.map((m, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {m}
            </option>
          ))}
        </select>

        {/* Year in Buddhist Era (พ.ศ.) */}
        <select
          value={parsed.year}
          onChange={(e) => handleChange(parseInt(e.target.value, 10), parsed.month)}
          className="h-9 w-32 rounded-md border border-line bg-surface px-2.5 text-xs text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {yearOptions.map(({ ce, be }) => (
            <option key={ce} value={ce}>
              พ.ศ. {be}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
