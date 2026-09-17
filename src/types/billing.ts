export type InvoiceStatus = 'UNPAID' | 'PAID' | 'OVERDUE';

export interface UtilityReading {
  id: string;
  dormitoryId: string;
  roomId: string;
  roomNumber?: string;
  period: string; // e.g. "2026-09"
  prevWater: number;
  currWater: number;
  waterUnits: number;
  prevElectric: number;
  currElectric: number;
  electricUnits: number;
  recordedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-256909-101"
  dormitoryId: string;
  roomId: string;
  roomNumber: string;
  tenantId?: string | null;
  tenantName: string;
  tenantPhone?: string | null;
  period: string; // e.g. "2026-09"
  rentAmount: number; // satang
  waterPrev: number;
  waterCurr: number;
  waterUnits: number;
  waterAmount: number; // satang
  electricPrev: number;
  electricCurr: number;
  electricUnits: number;
  electricAmount: number; // satang
  commonFee: number; // satang
  otherFee: number; // satang
  totalAmount: number; // satang
  status: InvoiceStatus;
  dueDate: string; // YYYY-MM-DD
  paidAt?: string | null;
  promptpayPayload?: string;
  createdAt: string;
}

