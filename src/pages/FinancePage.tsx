import React, { useEffect, useState } from 'react';
import { CircleDollarSign, Plus, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import {
  PaymentWithDetails,
  fetchPayments,
  createPayment,
  deletePayment,
  fetchExpenses,
  createExpense,
  deleteExpense,
} from '../services/financeService';
import { fetchLeases, LeaseWithDetails } from '../services/leaseService';
import { Expense, PaymentStatus } from '../types/database';
import { formatBaht, formatThaiDateShort, satangToBaht } from '../lib/format';
import { ThaiDatePicker } from '../components/common/ThaiDatePicker';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

export const FinancePage: React.FC = () => {
  const [tab, setTab] = useState<'PAYMENTS' | 'EXPENSES'>('PAYMENTS');
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [leases, setLeases] = useState<LeaseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  // Payment Form
  const [selectedLeaseId, setSelectedLeaseId] = useState('');
  const [paymentAmountBaht, setPaymentAmountBaht] = useState(3500);
  const [paymentPeriod, setPaymentPeriod] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PAID');

  // Expense Form
  const [expenseCategory, setExpenseCategory] = useState('ค่าน้ำ-ไฟส่วนกลาง');
  const [expenseAmountBaht, setExpenseAmountBaht] = useState(1500);
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [expenseNote, setExpenseNote] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [pData, eData, lData] = await Promise.all([
        fetchPayments(),
        fetchExpenses(),
        fetchLeases(),
      ]);
      setPayments(pData);
      setExpenses(eData);
      setLeases(lData);

      if (lData.length > 0 && !selectedLeaseId) {
        setSelectedLeaseId(lData[0].id);
        setPaymentAmountBaht(satangToBaht(lData[0].rent));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLeaseSelect = (leaseId: string) => {
    setSelectedLeaseId(leaseId);
    const found = leases.find((l) => l.id === leaseId);
    if (found) {
      setPaymentAmountBaht(satangToBaht(found.rent));
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeaseId) return;

    const lease = leases.find((l) => l.id === selectedLeaseId);

    await createPayment({
      leaseId: selectedLeaseId,
      amount: paymentAmountBaht * 100, // satang
      period: paymentPeriod,
      status: paymentStatus,
      paidAt: `${paymentDate}T12:00:00.000Z`,
      roomNumber: lease?.roomNumber,
      tenantName: lease?.tenantName,
    });

    setIsAddPaymentOpen(false);
    await loadData();
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseCategory) return;

    await createExpense({
      category: expenseCategory,
      amount: expenseAmountBaht * 100, // satang
      spentAt: `${expenseDate}T12:00:00.000Z`,
      note: expenseNote.trim() || undefined,
    });

    setIsAddExpenseOpen(false);
    setExpenseNote('');
    await loadData();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">การเงินและบัญชี</h1>
          <p className="text-xs text-ink-secondary mt-1">
            บันทึกรายรับค่าเช่าและรายจ่ายส่วนกลาง
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {tab === 'PAYMENTS' ? (
            <button
              onClick={() => setIsAddPaymentOpen(true)}
              className="inline-flex items-center space-x-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover transition"
            >
              <Plus className="h-4 w-4" />
              <span>บันทึกค่าเช่า</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="inline-flex items-center space-x-1.5 rounded-md bg-tone-red-solid px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition"
            >
              <Plus className="h-4 w-4" />
              <span>บันทึกรายจ่าย</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line">
        <button
          onClick={() => setTab('PAYMENTS')}
          className={`flex items-center space-x-2 border-b-2 py-3 px-5 text-xs sm:text-sm font-semibold transition ${
            tab === 'PAYMENTS'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-secondary hover:text-ink'
          }`}
        >
          <ArrowDownLeft className="h-4 w-4 text-tone-green-solid" />
          <span>รายรับค่าเช่า ({payments.length})</span>
        </button>

        <button
          onClick={() => setTab('EXPENSES')}
          className={`flex items-center space-x-2 border-b-2 py-3 px-5 text-xs sm:text-sm font-semibold transition ${
            tab === 'EXPENSES'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-secondary hover:text-ink'
          }`}
        >
          <ArrowUpRight className="h-4 w-4 text-tone-red-solid" />
          <span>รายจ่ายส่วนกลาง ({expenses.length})</span>
        </button>
      </div>

      {/* Tab 1: Payments */}
      {tab === 'PAYMENTS' && (
        <>
          {loading ? (
            <div className="h-48 rounded-lg bg-surface animate-pulse border border-line" />
          ) : payments.length === 0 ? (
            <EmptyState
              icon={CircleDollarSign}
              title="ยังไม่มีบันทึกการชำระเงิน"
              description="บันทึกการชำระค่าเช่าจากผู้เช่าเพื่อติดตามยอดเงินและออกใบเสร็จ"
              actionLabel="บันทึกค่าเช่าแรก"
              onAction={() => setIsAddPaymentOpen(true)}
            />
          ) : (
            <div className="rounded-lg bg-surface border border-line shadow-card divide-y divide-line overflow-hidden">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 hover:bg-bg/40 transition"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-ink">
                        ห้อง {p.roomNumber || '-'}
                      </span>
                      <span className="text-xs text-ink-secondary">
                        ({p.tenantName || 'ผู้เช่า'})
                      </span>
                      <span className="rounded-full bg-tone-green-soft px-2 py-0.5 text-[10px] font-semibold text-tone-green-solid">
                        {p.status === 'PAID' ? 'ชำระแล้ว' : 'รอชำระ'}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted mt-1">
                      งวดเดือน {p.period} · วันที่ชำระ:{' '}
                      {formatThaiDateShort(p.paidAt || p.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm sm:text-base font-bold text-tone-green-solid">
                      +{formatBaht(satangToBaht(p.amount))}
                    </span>
                    <button
                      onClick={() => setDeletingPaymentId(p.id)}
                      className="p-1.5 text-ink-muted hover:text-tone-red-solid rounded-md hover:bg-bg transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Expenses */}
      {tab === 'EXPENSES' && (
        <>
          {loading ? (
            <div className="h-48 rounded-lg bg-surface animate-pulse border border-line" />
          ) : expenses.length === 0 ? (
            <EmptyState
              icon={CircleDollarSign}
              title="ยังไม่มีบันทึกรายจ่าย"
              description="บันทึกค่าใช้จ่ายส่วนกลาง เช่น ค่าน้ำ-ไฟ หรือค่าซ่อมบำรุง เพื่อดูสรุปกำไรสุทธิ"
              actionLabel="บันทึกรายจ่ายแรก"
              onAction={() => setIsAddExpenseOpen(true)}
            />
          ) : (
            <div className="rounded-lg bg-surface border border-line shadow-card divide-y divide-line overflow-hidden">
              {expenses.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-4 hover:bg-bg/40 transition"
                >
                  <div>
                    <span className="text-sm font-bold text-ink">{e.category}</span>
                    <p className="text-xs text-ink-muted mt-1">
                      วันที่จ่าย: {formatThaiDateShort(e.spentAt)}
                      {e.note && ` · ${e.note}`}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm sm:text-base font-bold text-tone-red-solid">
                      -{formatBaht(satangToBaht(e.amount))}
                    </span>
                    <button
                      onClick={() => setDeletingExpenseId(e.id)}
                      className="p-1.5 text-ink-muted hover:text-tone-red-solid rounded-md hover:bg-bg transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Payment Modal */}
      <Modal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        title="บันทึกการชำระค่าเช่า"
      >
        <form onSubmit={handleSavePayment} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1">
              เลือกสัญญาเช่า / ห้อง
            </label>
            <select
              value={selectedLeaseId}
              onChange={(e) => handleLeaseSelect(e.target.value)}
              required
              className="w-full h-9 rounded-md border border-line bg-surface px-2.5 text-xs text-ink focus:border-primary focus:outline-none"
            >
              {leases.map((l) => (
                <option key={l.id} value={l.id}>
                  ห้อง {l.roomNumber} - {l.tenantName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                จำนวนเงิน (บาท)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                required
                value={paymentAmountBaht}
                onChange={(e) => setPaymentAmountBaht(parseInt(e.target.value, 10) || 0)}
                className="w-full h-9 rounded-md border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1">
                งวดเดือน (YYYY-MM)
              </label>
              <input
                type="text"
                required
                value={paymentPeriod}
                onChange={(e) => setPaymentPeriod(e.target.value)}
                placeholder="เช่น 2025-09"
                className="w-full h-9 rounded-md border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <ThaiDatePicker
            label="วันที่ชำระ (พ.ศ.)"
            value={paymentDate}
            onChange={setPaymentDate}
            required
          />

          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1">
              สถานะการชำระเงิน
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              className="w-full h-9 rounded-md border border-line bg-surface px-2.5 text-xs text-ink focus:border-primary focus:outline-none"
            >
              <option value="PAID">ชำระแล้ว</option>
              <option value="PENDING">รอชำระ</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => setIsAddPaymentOpen(false)}
              className="rounded-md border border-line px-3 py-1.5 text-xs text-ink hover:bg-bg"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              บันทึกการชำระเงิน
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        title="บันทึกรายจ่ายส่วนกลาง"
      >
        <form onSubmit={handleSaveExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1">
              หมวดหมู่รายจ่าย
            </label>
            <input
              type="text"
              required
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
              placeholder="เช่น ค่าน้ำ-ไฟส่วนกลาง, ซ่อมแซม"
              className="w-full h-9 rounded-md border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1">
              จำนวนเงิน (บาท)
            </label>
            <input
              type="number"
              min={0}
              step={50}
              required
              value={expenseAmountBaht}
              onChange={(e) => setExpenseAmountBaht(parseInt(e.target.value, 10) || 0)}
              className="w-full h-9 rounded-md border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <ThaiDatePicker
            label="วันที่จ่าย (พ.ศ.)"
            value={expenseDate}
            onChange={setExpenseDate}
            required
          />

          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1">
              บันทึกช่วยจำ (ถ้ามี)
            </label>
            <input
              type="text"
              value={expenseNote}
              onChange={(e) => setExpenseNote(e.target.value)}
              placeholder="เช่น ค่าไฟประจำเดือน"
              className="w-full h-9 rounded-md border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => setIsAddExpenseOpen(false)}
              className="rounded-md border border-line px-3 py-1.5 text-xs text-ink hover:bg-bg"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="rounded-md bg-tone-red-solid px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              บันทึกรายจ่าย
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingPaymentId !== null}
        onClose={() => setDeletingPaymentId(null)}
        onConfirm={async () => {
          if (deletingPaymentId) await deletePayment(deletingPaymentId);
          await loadData();
        }}
        title="ลบรายการชำระเงิน"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการชำระเงินนี้?"
      />

      <ConfirmDialog
        isOpen={deletingExpenseId !== null}
        onClose={() => setDeletingExpenseId(null)}
        onConfirm={async () => {
          if (deletingExpenseId) await deleteExpense(deletingExpenseId);
          await loadData();
        }}
        title="ลบรายการรายจ่าย"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบรายการรายจ่ายนี้?"
      />
    </div>
  );
};
