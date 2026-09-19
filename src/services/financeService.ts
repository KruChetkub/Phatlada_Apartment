import { Payment, Expense, PaymentStatus } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getOrEnsureDormitoryId } from './settingsService';

export interface PaymentWithDetails extends Payment {
  roomNumber?: string;
  tenantName?: string;
}

const LOCAL_PAYMENTS_KEY = 'phatlada_real_payments';
const LOCAL_EXPENSES_KEY = 'phatlada_real_expenses';

function getLocalPayments(): PaymentWithDetails[] {
  const data = localStorage.getItem(LOCAL_PAYMENTS_KEY) || localStorage.getItem('dormplus_real_payments');
  return data ? JSON.parse(data) : [];
}

function saveLocalPayments(items: PaymentWithDetails[]): void {
  localStorage.setItem(LOCAL_PAYMENTS_KEY, JSON.stringify(items));
}

function getLocalExpenses(): Expense[] {
  const data = localStorage.getItem(LOCAL_EXPENSES_KEY) || localStorage.getItem('dormplus_real_expenses');
  return data ? JSON.parse(data) : [];
}

function saveLocalExpenses(items: Expense[]): void {
  localStorage.setItem(LOCAL_EXPENSES_KEY, JSON.stringify(items));
}

export async function fetchPayments(): Promise<PaymentWithDetails[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('payments')
      .select('*, leases(rooms(number), tenants(title, first_name, last_name))')
      .order('paid_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((p) => ({
      id: p.id,
      leaseId: p.lease_id,
      amount: p.amount,
      period: p.period,
      status: p.status,
      paidAt: p.paid_at,
      createdAt: p.created_at,
      roomNumber: p.leases?.rooms?.number,
      tenantName: p.leases?.tenants
        ? `${p.leases.tenants.title || ''}${p.leases.tenants.first_name} ${p.leases.tenants.last_name}`
        : undefined,
    }));
  }
  return getLocalPayments();
}

export async function createPayment(payment: {
  leaseId: string;
  amount: number; // satang
  period: string; // YYYY-MM
  status?: PaymentStatus;
  paidAt?: string;
  roomNumber?: string;
  tenantName?: string;
}): Promise<PaymentWithDetails> {
  const newPayment: PaymentWithDetails = {
    id: crypto.randomUUID(),
    leaseId: payment.leaseId,
    amount: payment.amount,
    period: payment.period,
    status: payment.status || 'PAID',
    paidAt: payment.paidAt || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    roomNumber: payment.roomNumber,
    tenantName: payment.tenantName,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          id: newPayment.id,
          lease_id: newPayment.leaseId,
          amount: newPayment.amount,
          period: newPayment.period,
          status: newPayment.status,
          paid_at: newPayment.paidAt,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return { ...newPayment, id: data.id };
  }

  const list = getLocalPayments();
  list.unshift(newPayment);
  saveLocalPayments(list);
  return newPayment;
}

export async function deletePayment(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('payments').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const list = getLocalPayments().filter((p) => p.id !== id);
  saveLocalPayments(list);
}

export async function fetchExpenses(): Promise<Expense[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('spent_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((e) => ({
      id: e.id,
      dormitoryId: e.dormitory_id,
      category: e.category,
      amount: e.amount,
      spentAt: e.spent_at,
      note: e.note,
      createdAt: e.created_at,
    }));
  }
  return getLocalExpenses();
}

export async function createExpense(expense: {
  category: string;
  amount: number; // satang
  spentAt: string;
  note?: string;
  dormitoryId?: string;
}): Promise<Expense> {
  const dormId = expense.dormitoryId || (await getOrEnsureDormitoryId());
  const newExpense: Expense = {
    id: crypto.randomUUID(),
    dormitoryId: dormId,
    category: expense.category,
    amount: expense.amount,
    spentAt: expense.spentAt,
    note: expense.note || null,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          id: newExpense.id,
          dormitory_id: newExpense.dormitoryId,
          category: newExpense.category,
          amount: newExpense.amount,
          spent_at: newExpense.spentAt,
          note: newExpense.note,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return { ...newExpense, id: data.id };
  }

  const list = getLocalExpenses();
  list.unshift(newExpense);
  saveLocalExpenses(list);
  return newExpense;
}

export async function deleteExpense(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const list = getLocalExpenses().filter((e) => e.id !== id);
  saveLocalExpenses(list);
}

