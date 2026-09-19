import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  FileText,
  Plus,
  Gauge,
  Search,
  CheckCircle2,
  Trash2,
  Eye,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  fetchInvoices,
  fetchUtilityReadings,
  markInvoicePaid,
  deleteInvoice,
} from '../services/billingService';
import { fetchRooms } from '../services/roomService';
import { fetchLeases } from '../services/leaseService';
import { fetchTenants } from '../services/tenantService';
import { Invoice, UtilityReading } from '../types/billing';
import { Room, Lease, Tenant } from '../types/database';
import { formatSatang } from '../lib/format';
import { getCurrentUserRole, canManageFinances, canRecordMeters } from '../services/authService';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { MeterRecordModal } from '../components/billing/MeterRecordModal';
import { InvoiceGenerateModal } from '../components/billing/InvoiceGenerateModal';
import { InvoiceDetailModal } from '../components/billing/InvoiceDetailModal';
import { ReceiptPrintModal } from '../components/billing/ReceiptPrintModal';

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

export const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [readings, setReadings] = useState<UtilityReading[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  // Period Filter
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYearCE, setSelectedYearCE] = useState(today.getFullYear());
  const currentPeriod = `${selectedYearCE}-${String(selectedMonth).padStart(2, '0')}`;

  // Modals
  const [isMeterModalOpen, setIsMeterModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [receiptInvoice, setReceiptInvoice] = useState<Invoice | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const userRole = getCurrentUserRole();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [invList, readList, rList, lList, tList] = await Promise.all([
        fetchInvoices(currentPeriod),
        fetchUtilityReadings(currentPeriod),
        fetchRooms(),
        fetchLeases(),
        fetchTenants(),
      ]);
      setInvoices(invList);
      setReadings(readList);
      setRooms(rList);
      setLeases(lList);
      setTenants(tList);
    } catch (err) {
      console.error('Failed to load billing data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPeriod]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Statistics
  const stats = useMemo(() => {
    const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
    const paidInvoices = invoices.filter((i) => i.status === 'PAID');
    const totalPaid = paidInvoices.reduce((acc, i) => acc + i.totalAmount, 0);
    const unpaidCount = invoices.filter((i) => i.status !== 'PAID').length;
    const recordedMeterCount = readings.length;
    return { totalBilled, totalPaid, unpaidCount, recordedMeterCount };
  }, [invoices, readings]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          inv.roomNumber.toLowerCase().includes(q) ||
          inv.tenantName.toLowerCase().includes(q) ||
          inv.invoiceNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [invoices, searchQuery]);

  const handleMarkPaid = async (id: string) => {
    try {
      await markInvoicePaid(id);
      setInvoices((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: 'PAID', paidAt: new Date().toISOString() } : i))
      );
      if (detailInvoice && detailInvoice.id === id) {
        setDetailInvoice((prev) => (prev ? { ...prev, status: 'PAID' } : null));
      }
    } catch (err) {
      console.error('Failed to mark invoice paid:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteInvoice(deleteConfirmId);
      setInvoices((prev) => prev.filter((i) => i.id !== deleteConfirmId));
      if (detailInvoice && detailInvoice.id === deleteConfirmId) {
        setDetailInvoice(null);
      }
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete invoice:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span>จัดการบิล & จดมิเตอร์น้ำ-ไฟ</span>
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            บันทึกมิเตอร์น้ำและไฟฟ้า คำนวณยอดเงิน ออกใบแจ้งหนี้พร้อม QR Code และพิมพ์ใบเสร็จ
          </p>
        </div>

        {/* Month Selector in Thai & Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center space-x-1 bg-surface border border-line rounded-lg p-1 shadow-xs">
            <Calendar className="h-4 w-4 text-primary ml-1.5" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-xs bg-transparent border-none text-ink font-semibold focus:outline-none pr-2 py-1"
            >
              {THAI_MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYearCE}
              onChange={(e) => setSelectedYearCE(Number(e.target.value))}
              className="text-xs bg-transparent border-none text-ink font-semibold focus:outline-none pr-1 py-1"
            >
              <option value={selectedYearCE - 1}>{selectedYearCE - 1 + 543}</option>
              <option value={selectedYearCE}>{selectedYearCE + 543}</option>
              <option value={selectedYearCE + 1}>{selectedYearCE + 1 + 543}</option>
            </select>
          </div>

          {canRecordMeters(userRole) && (
            <button
              onClick={() => setIsMeterModalOpen(true)}
              className="inline-flex items-center space-x-1.5 bg-surface hover:bg-bg text-ink border border-line px-3 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Gauge className="h-4 w-4 text-primary" />
              <span>จดมิเตอร์น้ำ-ไฟ</span>
            </button>
          )}

          {canManageFinances(userRole) && (
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="inline-flex items-center space-x-1.5 bg-primary hover:bg-primary/90 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              <span>ออกใบแจ้งหนี้</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-surface rounded-xl border border-line shadow-xs">
          <span className="text-xs text-ink-secondary">ยอดเรียกเก็บรวม ({THAI_MONTHS[selectedMonth - 1]})</span>
          <p className="text-xl sm:text-2xl font-bold text-ink mt-1.5">{formatSatang(stats.totalBilled)}</p>
          <span className="text-[11px] text-ink-secondary mt-1 block">ทั้งหมด {invoices.length} ห้อง</span>
        </div>

        <div className="p-4 bg-tone-green-soft/40 rounded-xl border border-tone-green-solid/20 shadow-xs">
          <span className="text-xs text-tone-green-solid font-medium">ชำระแล้ว</span>
          <p className="text-xl sm:text-2xl font-bold text-tone-green-solid mt-1.5">{formatSatang(stats.totalPaid)}</p>
          <span className="text-[11px] text-tone-green-solid block mt-1">ได้รับเงินเรียบร้อย</span>
        </div>

        <div className="p-4 bg-tone-amber-soft/40 rounded-xl border border-tone-amber-solid/20 shadow-xs">
          <span className="text-xs text-tone-amber-solid font-medium">ค้างชำระ / รอชำระ</span>
          <p className="text-xl sm:text-2xl font-bold text-tone-amber-solid mt-1.5">{stats.unpaidCount} ห้อง</p>
          <span className="text-[11px] text-tone-amber-solid block mt-1">
            {formatSatang(stats.totalBilled - stats.totalPaid)}
          </span>
        </div>

        <div className="p-4 bg-tone-blue-soft/40 rounded-xl border border-tone-blue-solid/20 shadow-xs">
          <span className="text-xs text-tone-blue-solid font-medium">จดมิเตอร์แล้ว</span>
          <p className="text-xl sm:text-2xl font-bold text-tone-blue-solid mt-1.5">{stats.recordedMeterCount} ห้อง</p>
          <span className="text-[11px] text-tone-blue-solid block mt-1">พร้อมคำนวณค่าน้ำ-ไฟ</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-surface p-3 rounded-xl border border-line">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-secondary" />
          <input
            type="text"
            placeholder="ค้นหาเลขห้อง, ชื่อผู้เช่า หรือเลขที่บิล..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-bg border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-ink"
          />
        </div>
      </div>

      {/* Invoices List / Table */}
      {loading ? (
        <div className="py-12 text-center text-ink-secondary text-sm">กำลังโหลดข้อมูลใบแจ้งหนี้...</div>
      ) : filteredInvoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="ยังไม่มีใบแจ้งหนี้ในรอบเดือนนี้"
          description={`ยังไม่ได้ออกใบแจ้งหนี้สำหรับงวดเดือน ${THAI_MONTHS[selectedMonth - 1]} ${selectedYearCE + 543} เริ่มต้นด้วยการจดมิเตอร์หรือสร้างใบแจ้งหนี้ได้เลย`}
          actionLabel="ออกใบแจ้งหนี้ใหม่"
          onAction={() => setIsGenerateModalOpen(true)}
        />
      ) : (
        <div className="bg-surface border border-line rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-bg text-ink-secondary border-b border-line font-medium">
                <tr>
                  <th className="p-3">เลขที่บิล</th>
                  <th className="p-3">ห้องพัก</th>
                  <th className="p-3">ผู้เช่า</th>
                  <th className="p-3">ค่าน้ำ</th>
                  <th className="p-3">ค่าไฟ</th>
                  <th className="p-3">ยอดรวมสุทธิ</th>
                  <th className="p-3">สถานะ</th>
                  <th className="p-3 text-right">การกระทำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-bg/50 transition">
                    <td className="p-3 font-mono font-bold text-ink">{inv.invoiceNumber}</td>
                    <td className="p-3 font-bold text-primary">ห้อง {inv.roomNumber}</td>
                    <td className="p-3 text-ink">{inv.tenantName}</td>
                    <td className="p-3 text-ink-secondary">
                      {inv.waterUnits} หน่วย ({formatSatang(inv.waterAmount)})
                    </td>
                    <td className="p-3 text-ink-secondary">
                      {inv.electricUnits} หน่วย ({formatSatang(inv.electricAmount)})
                    </td>
                    <td className="p-3 font-bold text-ink text-sm">{formatSatang(inv.totalAmount)}</td>
                    <td className="p-3">
                      {inv.status === 'PAID' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-tone-green-soft text-tone-green-solid">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          ชำระแล้ว
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-tone-amber-soft text-tone-amber-solid">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          รอชำระเงิน
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setDetailInvoice(inv)}
                          title="ดูรายละเอียดบิล & QR Code"
                          className="p-1.5 rounded-lg text-ink-secondary hover:text-primary hover:bg-bg transition"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {canManageFinances(userRole) && inv.status !== 'PAID' && (
                          <button
                            onClick={() => handleMarkPaid(inv.id)}
                            title="บันทึกว่าชำระเงินแล้ว"
                            className="p-1.5 rounded-lg text-ink-secondary hover:text-tone-green-solid hover:bg-tone-green-soft transition"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        {canManageFinances(userRole) && (
                          <button
                            onClick={() => setDeleteConfirmId(inv.id)}
                            title="ลบใบแจ้งหนี้"
                            className="p-1.5 rounded-lg text-ink-secondary hover:text-tone-red-solid hover:bg-tone-red-soft transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <MeterRecordModal
        isOpen={isMeterModalOpen}
        onClose={() => setIsMeterModalOpen(false)}
        rooms={rooms}
        currentPeriod={currentPeriod}
        onSaved={loadData}
      />

      <InvoiceGenerateModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        rooms={rooms}
        leases={leases}
        tenants={tenants}
        readings={readings}
        currentPeriod={currentPeriod}
        onGenerated={loadData}
      />

      <InvoiceDetailModal
        isOpen={detailInvoice !== null}
        onClose={() => setDetailInvoice(null)}
        invoice={detailInvoice}
        onMarkPaid={handleMarkPaid}
        onOpenReceipt={(inv) => {
          setDetailInvoice(null);
          setReceiptInvoice(inv);
        }}
      />

      <ReceiptPrintModal
        isOpen={receiptInvoice !== null}
        onClose={() => setReceiptInvoice(null)}
        invoice={receiptInvoice}
      />

      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="ยืนยันการลบใบแจ้งหนี้"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบใบแจ้งหนี้นี้? รายการคำนวณและประวัติของบิลนี้จะถูกลบออก"
        confirmLabel="ลบใบแจ้งหนี้"
        isDestructive={true}
      />
    </div>
  );
};
