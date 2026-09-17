import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';

interface ThaiDatePickerProps {
  value: string; // ISO date string 'YYYY-MM-DD'
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

export const ThaiDatePicker: React.FC<ThaiDatePickerProps> = ({
  value,
  onChange,
  label,
  required = false,
}) => {
  // Parse YYYY-MM-DD
  const parsed = useMemo(() => {
    if (!value) {
      const today = new Date();
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      };
    }
    const parts = value.split('-');
    if (parts.length === 3) {
      return {
        year: parseInt(parts[0], 10),
        month: parseInt(parts[1], 10),
        day: parseInt(parts[2], 10),
      };
    }
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  }, [value]);

  // Generate Year options in Buddhist Era (พ.ศ.)
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

  // Days in selected month
  const daysInMonth = useMemo(() => {
    return new Date(parsed.year, parsed.month, 0).getDate();
  }, [parsed.year, parsed.month]);

  const handleDateChange = (newYear: number, newMonth: number, newDay: number) => {
    const maxDays = new Date(newYear, newMonth, 0).getDate();
    const safeDay = Math.min(newDay, maxDays);
    const mm = String(newMonth).padStart(2, '0');
    const dd = String(safeDay).padStart(2, '0');
    onChange(`${newYear}-${mm}-${dd}`);
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

        {/* Day */}
        <select
          value={parsed.day}
          onChange={(e) =>
            handleDateChange(parsed.year, parsed.month, parseInt(e.target.value, 10))
          }
          className="h-9 w-20 rounded-md border border-line bg-surface px-2.5 text-xs text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Month in Thai */}
        <select
          value={parsed.month}
          onChange={(e) =>
            handleDateChange(parsed.year, parseInt(e.target.value, 10), parsed.day)
          }
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
          onChange={(e) =>
            handleDateChange(parseInt(e.target.value, 10), parsed.month, parsed.day)
          }
          className="h-9 w-28 rounded-md border border-line bg-surface px-2.5 text-xs text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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

