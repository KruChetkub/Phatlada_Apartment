import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DashboardSummary } from '../../types/dashboard';
import { formatBaht, formatChangePct } from '../../lib/format';

interface IncomeExpenseCardProps {
  finance: DashboardSummary['finance'];
}

// Convert "2025-07" to Thai month label "ก.ค."
function getThaiMonthShort(period: string): string {
  const parts = period.split('-');
  const month = parseInt(parts[1], 10);
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];
  return thaiMonths[month - 1] || period;
}

export const IncomeExpenseCard: React.FC<IncomeExpenseCardProps> = ({ finance }) => {
  const chartData = finance.chart.map((item) => ({
    name: getThaiMonthShort(item.period),
    income: item.income,
    expense: item.expense,
    fullPeriod: item.period,
  }));

  return (
    <div className="rounded-lg bg-surface p-5 sm:p-6 shadow-card border border-line">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">
            รายรับ - รายจ่าย <span className="text-sm font-normal text-ink-muted">(เดือนนี้)</span>
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">ภาพรวมเปรียบเทียบ 3 เดือนล่าสุด</p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-medium">
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 rounded-full bg-primary"></span>
            <span className="text-ink-secondary">รายรับ</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-3 w-3 rounded-full bg-[#B9CCDD]"></span>
            <span className="text-ink-secondary">รายจ่าย</span>
          </div>
        </div>
      </div>

      {/* Content: Chart + 3 Summary Cards */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recharts Bar Chart */}
        <div className="lg:col-span-7 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              barCategoryGap={20}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF1F0" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#8A9793', fontSize: 12, fontFamily: 'Prompt' }}
                axisLine={{ stroke: '#E6ECEA' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#8A9793', fontSize: 11, fontFamily: 'Prompt' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => val.toLocaleString('th-TH')}
                domain={[0, 150000]}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `฿ ${value.toLocaleString('th-TH')}`,
                  name === 'income' ? 'รายรับ' : 'รายจ่าย',
                ]}
                labelFormatter={(label) => `เดือน ${label}`}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E6ECEA',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontFamily: 'Prompt',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="income" fill="#1E8A5A" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="expense" fill="#B9CCDD" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: 3 Summary Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          {/* 1. Total Income */}
          <div className="rounded-md bg-tone-green-soft p-3.5 border border-tone-green-solid/15 flex items-center justify-between">
            <div>
              <span className="text-xs text-ink-secondary font-medium">รายรับรวม</span>
              <p className="text-lg font-bold text-ink leading-tight mt-0.5">
                {formatBaht(finance.income.value)}
              </p>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-tone-green-solid bg-white px-2 py-1 rounded-md shadow-2xs">
              {formatChangePct(finance.income.changePct)}
            </span>
          </div>

          {/* 2. Total Expense */}
          <div className="rounded-md bg-tone-red-soft p-3.5 border border-tone-red-solid/15 flex items-center justify-between">
            <div>
              <span className="text-xs text-ink-secondary font-medium">รายจ่ายรวม</span>
              <p className="text-lg font-bold text-ink leading-tight mt-0.5">
                {formatBaht(finance.expense.value)}
              </p>
            </div>
            {/* RULES.md: Expense UP is RED */}
            <span className="inline-flex items-center text-xs font-semibold text-tone-red-solid bg-white px-2 py-1 rounded-md shadow-2xs">
              {formatChangePct(finance.expense.changePct)}
            </span>
          </div>

          {/* 3. Net Profit */}
          <div className="rounded-md bg-tone-green-soft p-3.5 border border-tone-green-solid/15 flex items-center justify-between">
            <div>
              <span className="text-xs text-ink-secondary font-medium">กำไรสุทธิ</span>
              <p className="text-lg font-bold text-ink leading-tight mt-0.5">
                {formatBaht(finance.profit.value)}
              </p>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-tone-green-solid bg-white px-2 py-1 rounded-md shadow-2xs">
              {formatChangePct(finance.profit.changePct)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

