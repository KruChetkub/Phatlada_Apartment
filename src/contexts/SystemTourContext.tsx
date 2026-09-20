import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface TourStep {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  route?: string;
  placement?: 'right' | 'bottom' | 'left' | 'top';
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    targetSelector: '[data-tour-id="dashboard"]',
    title: '1. หน้าหลักระบบจัดการ (Dashboard)',
    description: 'ศูนย์รวมภาพรวมหอพักทั้งหมด ดูอัตราการเช่าห้องพัก (Occupancy Rate) สรุปยอดรายรับ-รายจ่ายประจำเดือน และรายการบิลที่รอการชำระเงินแบบเรียลไทม์',
    placement: 'right',
  },
  {
    id: 'rooms',
    targetSelector: '[data-tour-id="rooms"]',
    title: '2. ผังห้องพัก (Rooms)',
    description: 'จัดการข้อมูลห้องพัก แยกตามชั้นและประเภทห้อง ตรวจสอบสถานะห้องว่าง ห้องมีผู้เช่า หรือห้องกำลังปิดปรับปรุง พร้อมกำหนดราคาเช่ารายเดือน',
    placement: 'right',
  },
  {
    id: 'tenants',
    targetSelector: '[data-tour-id="tenants"]',
    title: '3. ข้อมูลผู้เช่า (Tenants)',
    description: 'จัดเก็บทะเบียนประวัติผู้เช่า เบอร์โทรศัพท์ ข้อมูลบัตรประชาชน และผู้ติดต่อกรณีฉุกเฉิน ปลอดภัยตามมาตรฐานคุ้มครองข้อมูลส่วนบุคคล (PDPA)',
    placement: 'right',
  },
  {
    id: 'leases',
    targetSelector: '[data-tour-id="leases"]',
    title: '4. สัญญาเช่า (Leases)',
    description: 'บันทึกการทำสัญญาเช่าห้อง ผูกผู้เช่าเข้ากับห้องพัก กำหนดเงินประกันความเสียหาย ค่าเช่าล่วงหน้า และวันที่เริ่ม-สิ้นสุดสัญญา พร้อมระบบแจ้งเตือนสัญญาใกล้หมด',
    placement: 'right',
  },
  {
    id: 'invoices',
    targetSelector: '[data-tour-id="invoices"]',
    title: '5. บิล & มิเตอร์น้ำไฟ (Invoices & Meters)',
    description: 'หัวใจสำคัญประจำเดือน! บันทึกเลขมิเตอร์น้ำ-ไฟ ระบบคำนวณยอดเงินให้อัตโนมัติ พร้อมออกใบแจ้งหนี้ที่มี PromptPay QR Code และพิมพ์ใบเสร็จรับเงินเมื่อชำระแล้ว',
    placement: 'right',
  },
  {
    id: 'finance',
    targetSelector: '[data-tour-id="finance"]',
    title: '6. การเงิน & บัญชี (Finance)',
    description: 'บันทึกและตรวจสอบรายรับ-รายจ่ายของหอพัก ตรวจสลิปหลักฐานการโอนเงิน และดูสรุปกระแสเงินสดได้อย่างชัดเจน แยกหมวดหมู่อย่างเป็นระเบียบ',
    placement: 'right',
  },
  {
    id: 'maintenance',
    targetSelector: '[data-tour-id="maintenance"]',
    title: '7. แจ้งซ่อม & บำรุงรักษา (Maintenance)',
    description: 'ติดตามรายการแจ้งซ่อมจากผู้เช่า มอบหมายงานช่าง ติดตามสถานะตั้งแต่รับเรื่อง กำลังซ่อม จนถึงซ่อมเสร็จ พร้อมบันทึกค่าใช้จ่ายงานซ่อม',
    placement: 'right',
  },
  {
    id: 'reports',
    targetSelector: '[data-tour-id="reports"]',
    title: '8. รายงานสรุป (Reports)',
    description: 'วิเคราะห์ผลประกอบการหอพัก รายงานสถิติรายรับ-รายจ่าย ยอดค้างชำระ และอัตราการเติบโต สามารถพิมพ์หรือดาวน์โหลดรายงานเพื่อใช้ในการบริหาร',
    placement: 'right',
  },
  {
    id: 'messages',
    targetSelector: '[data-tour-id="messages"]',
    title: '9. ข้อความ & การติดต่อ (Messages)',
    description: 'ส่งข้อความ ประกาศข่าวสาร หรือแจ้งเตือนสำคัญถึงผู้เช่าโดยตรง ช่วยให้การสื่อสารภายในหอพักสะดวกรวดเร็วและมีประวัติบันทึกไว้',
    placement: 'right',
  },
  {
    id: 'notifications',
    targetSelector: '[data-tour-id="notifications"]',
    title: '10. ระบบการแจ้งเตือน (Notifications)',
    description: 'ศูนย์รวมการแจ้งเตือนกิจกรรมสำคัญ เช่น บิลเกินกำหนดชำระ สัญญาเช่าใกล้หมดอายุ งานซ่อมใหม่ และการแจ้งชำระเงินจากผู้เช่า',
    placement: 'right',
  },
  {
    id: 'settings',
    targetSelector: '[data-tour-id="settings"]',
    title: '11. ตั้งค่าระบบ (Settings)',
    description: 'กำหนดชื่อหอพัก อัตราค่าน้ำ-ไฟต่อหน่วย บัญชีธนาคารรับเงิน และการแบ่งสิทธิ์การใช้งาน (Owner, Manager, Staff) สำหรับผู้ดูแลระบบ',
    placement: 'right',
  },
];

const TOUR_STORAGE_KEY = 'phatlada_tour_completed_v1';

interface SystemTourContextType {
  isTourOpen: boolean;
  currentStepIndex: number;
  currentStep: TourStep | null;
  totalSteps: number;
  showWelcomeModal: boolean;
  startTour: () => void;
  closeTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  dismissWelcomeModal: () => void;
}

const SystemTourContext = createContext<SystemTourContextType | undefined>(undefined);

export const SystemTourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Check on first mount if tour has been completed before
  useEffect(() => {
    try {
      const hasCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
      const publicPaths = ['/', '/login', '/privacy-policy', '/cookie-policy', '/terms'];
      const isPublicPage = publicPaths.includes(window.location.pathname);
      if (!hasCompleted && !isPublicPage) {
        // First-time user in admin portal: show friendly welcome prompt after a short delay
        const timer = setTimeout(() => {
          setShowWelcomeModal(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may fail in private mode, safe fallback
    }
  }, []);

  const startTour = useCallback(() => {
    setShowWelcomeModal(false);
    setCurrentStepIndex(0);
    setIsTourOpen(true);
  }, []);

  const closeTour = useCallback(() => {
    setIsTourOpen(false);
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    } catch {
      // ignore storage error
    }
  }, []);

  const skipTour = useCallback(() => {
    closeTour();
  }, [closeTour]);

  const dismissWelcomeModal = useCallback(() => {
    setShowWelcomeModal(false);
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    } catch {
      // ignore storage error
    }
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      closeTour();
    }
  }, [currentStepIndex, closeTour]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const currentStep = isTourOpen ? TOUR_STEPS[currentStepIndex] || null : null;

  return (
    <SystemTourContext.Provider
      value={{
        isTourOpen,
        currentStepIndex,
        currentStep,
        totalSteps: TOUR_STEPS.length,
        showWelcomeModal,
        startTour,
        closeTour,
        nextStep,
        prevStep,
        skipTour,
        dismissWelcomeModal,
      }}
    >
      {children}
    </SystemTourContext.Provider>
  );
};

export const useSystemTour = (): SystemTourContextType => {
  const context = useContext(SystemTourContext);
  if (!context) {
    throw new Error('useSystemTour must be used within a SystemTourProvider');
  }
  return context;
};
