import { UtilityReading, Invoice, InvoiceStatus } from '../types/billing';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getLocalSettings, getOrEnsureDormitoryId } from './settingsService';
import { generatePromptPayPayload } from '../lib/promptpay';

const READINGS_STORAGE_KEY = 'phatlada_real_readings';
const INVOICES_STORAGE_KEY = 'phatlada_real_invoices';

function getLocalReadings(): UtilityReading[] {
  const data = localStorage.getItem(READINGS_STORAGE_KEY) || localStorage.getItem('dormplus_real_readings');
  return data ? JSON.parse(data) : [];
}

function saveLocalReadings(list: UtilityReading[]): void {
  localStorage.setItem(READINGS_STORAGE_KEY, JSON.stringify(list));
}

function getLocalInvoices(): Invoice[] {
  const data = localStorage.getItem(INVOICES_STORAGE_KEY) || localStorage.getItem('dormplus_real_invoices');
  return data ? JSON.parse(data) : [];
}

function saveLocalInvoices(list: Invoice[]): void {
  localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(list));
}

// 1. Utility Readings
export async function fetchUtilityReadings(period?: string): Promise<UtilityReading[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('utility_readings').select('*, rooms(number)').order('recorded_at', { ascending: false });
    if (period) query = query.eq('period', period);
    const { data, error } = await query;
    if (!error && data) {
      return data.map((r) => ({
        id: r.id,
        dormitoryId: r.dormitory_id,
        roomId: r.room_id,
        roomNumber: r.rooms?.number,
        period: r.period,
        prevWater: Number(r.prev_water),
        currWater: Number(r.curr_water),
        waterUnits: Number(r.water_units),
        prevElectric: Number(r.prev_electric),
        currElectric: Number(r.curr_electric),
        electricUnits: Number(r.electric_units),
        recordedAt: r.recorded_at,
      }));
    }
  }
  const all = getLocalReadings();
  return period ? all.filter((r) => r.period === period) : all;
}

export async function getLatestReadingForRoom(roomId: string): Promise<UtilityReading | null> {
  const list = await fetchUtilityReadings();
  const roomReadings = list.filter((r) => r.roomId === roomId);
  return roomReadings.length > 0 ? roomReadings[0] : null;
}

export async function saveUtilityReading(input: {
  dormitoryId?: string;
  roomId: string;
  roomNumber?: string;
  period: string;
  prevWater: number;
  currWater: number;
  prevElectric: number;
  currElectric: number;
}): Promise<UtilityReading> {
  const waterUnits = Math.max(0, input.currWater - input.prevWater);
  const electricUnits = Math.max(0, input.currElectric - input.prevElectric);
  const dormId = input.dormitoryId || (await getOrEnsureDormitoryId());

  const reading: UtilityReading = {
    id: crypto.randomUUID(),
    dormitoryId: dormId,
    roomId: input.roomId,
    roomNumber: input.roomNumber,
    period: input.period,
    prevWater: input.prevWater,
    currWater: input.currWater,
    waterUnits,
    prevElectric: input.prevElectric,
    currElectric: input.currElectric,
    electricUnits,
    recordedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    await supabase.from('utility_readings').upsert({
      id: reading.id,
      dormitory_id: reading.dormitoryId,
      room_id: reading.roomId,
      period: reading.period,
      prev_water: reading.prevWater,
      curr_water: reading.currWater,
      water_units: reading.waterUnits,
      prev_electric: reading.prevElectric,
      curr_electric: reading.currElectric,
      electric_units: reading.electricUnits,
      recorded_at: reading.recordedAt,
    });
  }

  const list = getLocalReadings().filter(
    (r) => !(r.roomId === input.roomId && r.period === input.period)
  );
  saveLocalReadings([reading, ...list]);
  return reading;
}

// 2. Invoices
export async function fetchInvoices(period?: string): Promise<Invoice[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (period) query = query.eq('period', period);
    const { data, error } = await query;
    if (!error && data) {
      return data.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoice_number,
        dormitoryId: inv.dormitory_id,
        roomId: inv.room_id,
        roomNumber: inv.room_number,
        tenantId: inv.tenant_id,
        tenantName: inv.tenant_name,
        tenantPhone: inv.tenant_phone,
        period: inv.period,
        rentAmount: inv.rent_amount,
        waterPrev: Number(inv.water_prev),
        waterCurr: Number(inv.water_curr),
        waterUnits: Number(inv.water_units),
        waterAmount: inv.water_amount,
        electricPrev: Number(inv.electric_prev),
        electricCurr: Number(inv.electric_curr),
        electricUnits: Number(inv.electric_units),
        electricAmount: inv.electric_amount,
        commonFee: inv.common_fee,
        otherFee: inv.other_fee,
        totalAmount: inv.total_amount,
        status: inv.status as InvoiceStatus,
        dueDate: inv.due_date,
        paidAt: inv.paid_at,
        promptpayPayload: inv.promptpay_payload,
        createdAt: inv.created_at,
      }));
    }
  }
  const all = getLocalInvoices();
  return period ? all.filter((i) => i.period === period) : all;
}

export async function createInvoice(input: {
  dormitoryId?: string;
  roomId: string;
  roomNumber: string;
  tenantId?: string | null;
  tenantName: string;
  tenantPhone?: string | null;
  period: string;
  rentSatang: number;
  waterPrev: number;
  waterCurr: number;
  electricPrev: number;
  electricCurr: number;
  commonFeeSatang?: number;
  otherFeeSatang?: number;
  dueDate?: string;
}): Promise<Invoice> {
  const settings = getLocalSettings();

  const waterUnits = Math.max(0, input.waterCurr - input.waterPrev);
  const electricUnits = Math.max(0, input.electricCurr - input.electricPrev);

  const waterSatang = Math.round(waterUnits * settings.waterRatePerUnit * 100);
  const electricSatang = Math.round(electricUnits * settings.electricRatePerUnit * 100);
  const commonSatang = input.commonFeeSatang ?? Math.round(settings.commonFeeMonthly * 100);
  const otherSatang = input.otherFeeSatang ?? 0;

  const totalSatang = input.rentSatang + waterSatang + electricSatang + commonSatang + otherSatang;
  const totalBaht = totalSatang / 100;

  // Generate PromptPay payload if phone or ID is configured
  let promptpayPayload: string | undefined;
  const promptPayTarget = settings.promptPayId || settings.phone;
  if (promptPayTarget) {
    try {
      promptpayPayload = generatePromptPayPayload(promptPayTarget, totalBaht);
    } catch {
      // ignore
    }
  }

  // Invoice Number: INV-YYYYMM-ROOM
  const sanitizedPeriod = input.period.replace('-', '');
  const invoiceNumber = `INV-${sanitizedPeriod}-${input.roomNumber}`;

  // Default Due Date: period year-month-settings.dueDay
  const defaultDueDate = `${input.period}-${String(settings.dueDay).padStart(2, '0')}`;
  const dormId = input.dormitoryId || (await getOrEnsureDormitoryId());

  const newInvoice: Invoice = {
    id: crypto.randomUUID(),
    invoiceNumber,
    dormitoryId: dormId,
    roomId: input.roomId,
    roomNumber: input.roomNumber,
    tenantId: input.tenantId || null,
    tenantName: input.tenantName,
    tenantPhone: input.tenantPhone || null,
    period: input.period,
    rentAmount: input.rentSatang,
    waterPrev: input.waterPrev,
    waterCurr: input.waterCurr,
    waterUnits,
    waterAmount: waterSatang,
    electricPrev: input.electricPrev,
    electricCurr: input.electricCurr,
    electricUnits,
    electricAmount: electricSatang,
    commonFee: commonSatang,
    otherFee: otherSatang,
    totalAmount: totalSatang,
    status: 'UNPAID',
    dueDate: input.dueDate || defaultDueDate,
    promptpayPayload,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    await supabase.from('invoices').insert([
      {
        id: newInvoice.id,
        invoice_number: newInvoice.invoiceNumber,
        dormitory_id: newInvoice.dormitoryId,
        room_id: newInvoice.roomId,
        room_number: newInvoice.roomNumber,
        tenant_id: newInvoice.tenantId,
        tenant_name: newInvoice.tenantName,
        tenant_phone: newInvoice.tenantPhone,
        period: newInvoice.period,
        rent_amount: newInvoice.rentAmount,
        water_prev: newInvoice.waterPrev,
        water_curr: newInvoice.waterCurr,
        water_units: newInvoice.waterUnits,
        water_amount: newInvoice.waterAmount,
        electric_prev: newInvoice.electricPrev,
        electric_curr: newInvoice.electricCurr,
        electric_units: newInvoice.electricUnits,
        electric_amount: newInvoice.electricAmount,
        common_fee: newInvoice.commonFee,
        other_fee: newInvoice.otherFee,
        total_amount: newInvoice.totalAmount,
        status: newInvoice.status,
        due_date: newInvoice.dueDate,
        promptpay_payload: newInvoice.promptpayPayload,
        created_at: newInvoice.createdAt,
      },
    ]);
  }

  const list = getLocalInvoices().filter((i) => i.id !== newInvoice.id);
  saveLocalInvoices([newInvoice, ...list]);
  return newInvoice;
}

export async function markInvoicePaid(id: string): Promise<void> {
  const now = new Date().toISOString();
  if (isSupabaseConfigured && supabase) {
    await supabase.from('invoices').update({ status: 'PAID', paid_at: now }).eq('id', id);
  }
  const list = getLocalInvoices().map((inv) =>
    inv.id === id ? { ...inv, status: 'PAID' as InvoiceStatus, paidAt: now } : inv
  );
  saveLocalInvoices(list);
}

export async function deleteInvoice(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('invoices').delete().eq('id', id);
  }
  const list = getLocalInvoices().filter((i) => i.id !== id);
  saveLocalInvoices(list);
}

