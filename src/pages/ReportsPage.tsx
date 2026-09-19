import React, { useEffect, useState, useMemo } from 'react';
import {
  FileBarChart,
  Printer,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Home,
  Users,
  Wrench,
  CheckCircle2,
  Clock,
  Receipt,
} from 'lucide-react';
import { fetchRooms } from '../services/roomService';
import { fetchTenants } from '../services/tenantService';
import { fetchPayments, fetchExpenses, PaymentWithDetails } from '../services/financeService';
import { fetchMaintenance, MaintenanceWithRoom } from '../services/maintenanceService';
import { fetchInvoices } from '../services/billingService';
import { Room, Tenant, Expense } from '../types/database';
import { Invoice } from '../types/billing';
import {
  formatBaht,
  formatSatang,
  formatThaiDateShort,
  satangToBaht,
} from '../lib/format';
import { calculateOccupancyPct } from '../lib/kpi';

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

export const ReportsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceWithRoom[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Month & Year (พ.ศ.) for report filter
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYearCE, setSelectedYearCE] = useState(today.getFullYear());

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    const list = [];
    for (let y = current - 4; y <= current + 4; y++) {
      list.push({ ce: y, be: y + 543 });
    }
    return list;
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [r, t, p, e, m, inv] = await Promise.all([
        fetchRooms(),
        fetchTenants(),
        fetchPayments(),
        fetchExpenses(),
        fetchMaintenance(),
        fetchInvoices(),
      ]);
      setRooms(r);
      setTenants(t);
      setPayments(p);
      setExpenses(e);
      setMaintenance(m);
      setInvoices(inv);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter payments & expenses by selected month & year
  const filterPrefix = `${selectedYearCE}-${String(selectedMonth).padStart(2, '0')}`;

  const periodInvoices = useMemo(() => {
    return invoices.filter((i) => i.period === filterPrefix);
  }, [invoices, filterPrefix]);

  const invoiceStats = useMemo(() => {
    const rentSatang = periodInvoices.reduce((sum, i) => sum + (i.rentAmount || 0), 0);
    const waterSatang = periodInvoices.reduce((sum, i) => sum + (i.waterAmount || 0), 0);
    const waterUnits = periodInvoices.reduce((sum, i) => sum + (i.waterUnits || 0), 0);
    const electricSatang = periodInvoices.reduce((sum, i) => sum + (i.electricAmount || 0), 0);
    const electricUnits = periodInvoices.reduce((sum, i) => sum + (i.electricUnits || 0), 0);
    const commonSatang = periodInvoices.reduce((sum, i) => sum + (i.commonFee || 0), 0);
    const otherSatang = periodInvoices.reduce((sum, i) => sum + (i.otherFee || 0), 0);
    const totalSatang = rentSatang + waterSatang + electricSatang + commonSatang + otherSatang;

    return {
      rentSatang,
      waterSatang,
      waterUnits,
      electricSatang,
      electricUnits,
      commonSatang,
      otherSatang,
      totalSatang,
    };
  }, [periodInvoices]);

  const periodPayments = useMemo(() => {
    return payments.filter(
      (p) => p.status === 'PAID' && (p.paidAt?.startsWith(filterPrefix) || p.period === filterPrefix)
    );
  }, [payments, filterPrefix]);

  const periodExpenses = useMemo(() => {
    return expenses.filter((e) => e.spentAt?.startsWith(filterPrefix));
  }, [expenses, filterPrefix]);

  // Financial calculations
  const totalIncomeSatang = useMemo(() => {
    return periodPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [periodPayments]);

  const totalExpenseSatang = useMemo(() => {
    return periodExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [periodExpenses]);

  const netProfitSatang = totalIncomeSatang - totalExpenseSatang;

  const totalIncomeBaht = satangToBaht(totalIncomeSatang);
  const totalExpenseBaht = satangToBaht(totalExpenseSatang);
  const netProfitBaht = satangToBaht(netProfitSatang);

  // Room & Tenant calculations
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'OCCUPIED').length;
  const vacantRooms = totalRooms - occupiedRooms;
  const occupancyRate = calculateOccupancyPct(occupiedRooms, totalRooms);

  const totalTenants = tenants.length;
  const maleTenants = tenants.filter((t) => t.gender === 'MALE').length;
  const femaleTenants = tenants.filter((t) => t.gender === 'FEMALE').length;

  // Maintenance in period
  const periodMaintenance = useMemo(() => {
    return maintenance.filter((m) => m.createdAt?.startsWith(filterPrefix));
  }, [maintenance, filterPrefix]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header & Print button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink flex items-center gap-2">
            <FileBarChart className="h-6 w-6 text-primary" />
            <span>รายงานสรุปข้อมูลหอพัก</span>
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            สรุปรายรับ-รายจ่าย อัตราการเข้าพัก และสถิติประจำเดือน
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {/* Month Selector in Thai */}
          <div className="flex items-center space-x-1 bg-surface border border-line rounded-md p-1 shadow-xs">
            <Calendar className="h-4 w-4 text-primary ml-1.5" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              className="h-8 rounded bg-transparent px-2 text-xs text-ink font-medium focus:outline-none"
            >
              {THAI_MONTHS.map((m, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={selectedYearCE}
              onChange={(e) => setSelectedYearCE(parseInt(e.target.value, 10))}
              className="h-8 rounded bg-transparent px-2 text-xs text-ink font-medium focus:outline-none"
            >
              {yearOptions.map(({ ce, be }) => (
                <option key={ce} value={ce}>
                  พ.ศ. {be}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 rounded-md bg-surface border border-line px-3.5 py-2 text-xs font-semibold text-ink shadow-xs hover:bg-bg transition"
          >
            <Printer className="h-4 w-4 text-ink-muted" />
            <span>พิมพ์รายงาน</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block text-center border-b border-line pb-4 mb-4">
        <h2 className="text-2xl font-bold text-ink">รายงานสรุปการดำเนินงานหอพัก</h2>
        <p className="text-sm text-ink-secondary mt-1">
          ประจำเดือน {THAI_MONTHS[selectedMonth - 1]} พ.ศ. {selectedYearCE + 543}
        </p>
      </div>

      {loading ? (
        <div className="h-64 rounded-lg bg-surface animate-pulse border border-line" />
      ) : (
        <>
          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Income */}
            <div className="rounded-lg bg-surface p-5 border border-line shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink-secondary">รายรับค่าเช่าทั้งหมด</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tone-green-soft text-tone-green-solid">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-tone-green-solid">
                {formatBaht(totalIncomeBaht)}
              </p>
              <span className="mt-1 block text-xs text-ink-muted">
                จาก {periodPayments.length} รายการรับชำระ
              </span>
            </div>

            {/* Total Expenses */}
            <div className="rounded-lg bg-surface p-5 border border-line shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink-secondary">รายจ่ายส่วนกลางทั้งหมด</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tone-red-soft text-tone-red-solid">
                  <TrendingDown className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-tone-red-solid">
                {formatBaht(totalExpenseBaht)}
              </p>
              <span className="mt-1 block text-xs text-ink-muted">
                จาก {periodExpenses.length} รายการรายจ่าย
              </span>
            </div>

            {/* Net Profit */}
            <div className="rounded-lg bg-surface p-5 border border-line shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink-secondary">กำไรสุทธิ</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <p
                className={`mt-2 text-2xl font-bold ${
                  netProfitBaht >= 0 ? 'text-primary' : 'text-tone-red-solid'
                }`}
              >
                {formatBaht(netProfitBaht)}
              </p>
              <span className="mt-1 block text-xs text-ink-muted">
                รายรับสุทธิหลังหักค่าใช้จ่าย
              </span>
            </div>
          </div>

          {/* Revenue Breakdown by Category (ค่าห้อง / ค่าน้ำ / ค่าไฟ) */}
          <div className="rounded-lg bg-surface p-5 border border-line shadow-card space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-line pb-3 gap-1">
              <div className="flex items-center space-x-2">
                <Receipt className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-semibold text-ink">
                  สัดส่วนรายรับแยกตามประเภท (ค่าห้อง / ค่าน้ำ / ค่าไฟ)
                </h3>
              </div>
              <span className="text-xs text-ink-muted">
                งวดเดือน {THAI_MONTHS[selectedMonth - 1]} {selectedYearCE + 543}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Room Rent */}
              <div className="p-3.5 bg-bg rounded-lg border border-line">
                <span className="text-xs text-ink-secondary block">1. ค่าเช่าห้องพัก</span>
                <p className="text-lg font-bold text-ink mt-1">
                  {formatSatang(invoiceStats.rentSatang)}
                </p>
                <span className="text-[11px] text-ink-muted">รายรับค่าเช่าห้องพักตามสัญญา</span>
              </div>

              {/* Water Utility */}
              <div className="p-3.5 bg-tone-blue-soft/30 rounded-lg border border-tone-blue-solid/20">
                <span className="text-xs text-tone-blue-solid font-medium block">2. ค่าน้ำประปา</span>
                <p className="text-lg font-bold text-tone-blue-solid mt-1">
                  {formatSatang(invoiceStats.waterSatang)}
                </p>
                <span className="text-[11px] text-ink-muted">รวม {invoiceStats.waterUnits} หน่วย</span>
              </div>

              {/* Electric Utility */}
              <div className="p-3.5 bg-tone-amber-soft/30 rounded-lg border border-tone-amber-solid/20">
                <span className="text-xs text-tone-amber-solid font-medium block">3. ค่าไฟฟ้า</span>
                <p className="text-lg font-bold text-tone-amber-solid mt-1">
                  {formatSatang(invoiceStats.electricSatang)}
                </p>
                <span className="text-[11px] text-ink-muted">รวม {invoiceStats.electricUnits} หน่วย</span>
              </div>

              {/* Common / Other Fee */}
              <div className="p-3.5 bg-bg rounded-lg border border-line">
                <span className="text-xs text-ink-secondary block">4. ค่าส่วนกลาง & อื่นๆ</span>
                <p className="text-lg font-bold text-ink mt-1">
                  {formatSatang(invoiceStats.commonSatang + invoiceStats.otherSatang)}
                </p>
                <span className="text-[11px] text-ink-muted">ค่าบริการส่วนกลางและปรับยอด</span>
              </div>
            </div>
          </div>

          {/* Room & Maintenance Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rooms Summary */}
            <div className="rounded-lg bg-surface p-5 border border-line shadow-card">
              <div className="flex items-center space-x-2 border-b border-line pb-3">
                <Home className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-semibold text-ink">สรุปห้องพักและผู้เช่า</h3>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-bg p-3">
                  <span className="text-xs text-ink-muted">ห้องทั้งหมด</span>
                  <p className="text-lg font-bold text-ink mt-1">{totalRooms} ห้อง</p>
                </div>
                <div className="rounded-md bg-tone-green-soft p-3">
                  <span className="text-xs text-tone-green-solid font-medium">มีผู้เช่า</span>
                  <p className="text-lg font-bold text-tone-green-solid mt-1">
                    {occupiedRooms} ห้อง
                  </p>
                </div>
                <div className="rounded-md bg-tone-blue-soft p-3">
                  <span className="text-xs text-tone-blue-solid font-medium">ห้องว่าง</span>
                  <p className="text-lg font-bold text-tone-blue-solid mt-1">{vacantRooms} ห้อง</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-ink-secondary pt-2 border-t border-line/60">
                <span>อัตราการเข้าพัก: <strong>{occupancyRate}%</strong></span>
                <span className="flex items-center space-x-1">
                  <Users className="h-3.5 w-3.5 text-ink-muted" />
                  <span>ผู้เช่าทั้งหมด {totalTenants} คน (ชาย {maleTenants} / หญิง {femaleTenants})</span>
                </span>
              </div>
            </div>

            {/* Maintenance Summary */}
            <div className="rounded-lg bg-surface p-5 border border-line shadow-card">
              <div className="flex items-center space-x-2 border-b border-line pb-3">
                <Wrench className="h-5 w-5 text-tone-purple-solid" />
                <h3 className="text-sm font-semibold text-ink">
                  สรุปการแจ้งซ่อมในรอบเดือน ({periodMaintenance.length} รายการ)
                </h3>
              </div>

              {periodMaintenance.length === 0 ? (
                <div className="py-8 text-center text-xs text-ink-muted">
                  ไม่มีรายการแจ้งซ่อมในเดือนที่เลือก
                </div>
              ) : (
                <div className="mt-3 divide-y divide-line/60 max-h-48 overflow-y-auto">
                  {periodMaintenance.map((m) => (
                    <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-ink">ห้อง {m.roomNumber || '-'}</span>
                        <p className="text-ink-secondary truncate max-w-xs">{m.title}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center space-x-1 ${
                          m.status === 'DONE'
                            ? 'bg-tone-green-soft text-tone-green-solid'
                            : 'bg-tone-orange-soft text-tone-orange-solid'
                        }`}
                      >
                        {m.status === 'DONE' ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>เสร็จสิ้น</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" />
                            <span>รอดำเนินการ</span>
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Breakdown Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Income breakdown */}
            <div className="rounded-lg bg-surface p-5 border border-line shadow-card">
              <h3 className="text-sm font-semibold text-ink border-b border-line pb-3">
                รายการชำระค่าเช่าประจำงวด ({periodPayments.length} รายการ)
              </h3>
              {periodPayments.length === 0 ? (
                <div className="py-8 text-center text-xs text-ink-muted">
                  ไม่มีบันทึกการชำระเงินในรอบเดือนนี้
                </div>
              ) : (
                <div className="mt-3 divide-y divide-line max-h-60 overflow-y-auto">
                  {periodPayments.map((p) => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-ink">ห้อง {p.roomNumber || '-'}</span>
                        <span className="text-ink-secondary ml-2">{p.tenantName || 'ผู้เช่า'}</span>
                        <p className="text-[11px] text-ink-muted">
                          วันที่ชำระ: {formatThaiDateShort(p.paidAt || p.createdAt)}
                        </p>
                      </div>
                      <span className="font-semibold text-tone-green-solid">
                        +{formatBaht(satangToBaht(p.amount))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Expense breakdown */}
            <div className="rounded-lg bg-surface p-5 border border-line shadow-card">
              <h3 className="text-sm font-semibold text-ink border-b border-line pb-3">
                รายการรายจ่ายประจำงวด ({periodExpenses.length} รายการ)
              </h3>
              {periodExpenses.length === 0 ? (
                <div className="py-8 text-center text-xs text-ink-muted">
                  ไม่มีบันทึกรายจ่ายในรอบเดือนนี้
                </div>
              ) : (
                <div className="mt-3 divide-y divide-line max-h-60 overflow-y-auto">
                  {periodExpenses.map((e) => (
                    <div key={e.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-ink">{e.category}</span>
                        {e.note && <span className="text-ink-secondary ml-2">({e.note})</span>}
                        <p className="text-[11px] text-ink-muted">
                          วันที่จ่าย: {formatThaiDateShort(e.spentAt)}
                        </p>
                      </div>
                      <span className="font-semibold text-tone-red-solid">
                        -{formatBaht(satangToBaht(e.amount))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
