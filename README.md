# DormPlus — ระบบจัดการหอพักและอพาร์ตเมนต์ครบวงจร

เว็บแอปพลิเคชันจัดการหอพัก **DormPlus** พัฒนาด้วยสถาปัตยกรรม **React + Vite + Supabase + Vercel + GitHub** ตามข้อกำหนดและดีไซน์ใน `DESIGN.md`, `SPEC.md`, และ `RULES.md`

---

## 🛠️ สถาปัตยกรรมและเทคโนโลยี (Tech Stack)

- **Frontend:** React 18, TypeScript (Strict Mode), Vite
- **UI & Styling:** Tailwind CSS, Design Tokens (ฟอนต์ Prompt และ Mali, โทนสีมาตรฐาน)
- **Icons & Charts:** Lucide React, Recharts
- **Database & Security:** Supabase (PostgreSQL) พร้อม **Row Level Security (RLS)** แยกสิทธิ์ตามบทบาท (OWNER, MANAGER, STAFF)
- **QR Code Engine:** EMVCo PromptPay QR Payload Generator (พร้อม Checksum CRC-16 แท้)
- **Modal-Driven Architecture:** ฟังก์ชันการทำงานทั้งหมดทำงานผ่าน Modal Dialog อย่างเป็นระเบียบ
- **Thai Buddhist Era:** ปฏิทินและเวลาแสดงผลเป็น **วัน เดือน ปี พ.ศ.** ทั่วทั้งระบบ
- **Zero Mock Data:** ปราศจากข้อมูลทดสอบหลอก เชื่อมโยงฐานข้อมูลจริงและระบบ LocalStorage Fallback พร้อม Empty State ภาษาไทย
- **Hosting & Deployment:** Vercel (พร้อม `vercel.json` SPA URL Rewrite)
- **CI / Testing:** GitHub Actions (`.github/workflows/ci.yml`), Vitest (19 Unit Tests ผ่านครบ 100%)

---

## 🚀 ฟังก์ชันหลักของระบบ (Features)

1. **แผงควบคุมหลัก (Dashboard)**: KPI อัตราการเข้าพัก, รายรับ-รายจ่ายสุทธิ, สัดส่วนสถานะห้องพัก, รายการชำระเงินล่าสุด, แผงแจ้งเตือน
2. **จัดการห้องพัก (`/rooms`)**: บันทึกห้องพัก กำหนดชั้น ค่าเช่ารายเดือน (สตางค์) และสถานะห้อง
3. **จัดการผู้เช่า (`/tenants`)**: บันทึกประวัติผู้เช่า คำนำหน้าชื่อ เบอร์โทรศัพท์ และเพศ
4. **สัญญาเช่า (`/leases`)**: ผูกห้องพักกับผู้เช่า กำหนดวันเริ่ม-สิ้นสุดสัญญา (พ.ศ.) ค่าเช่า และเงินประกัน
5. **บิล & มิเตอร์น้ำไฟ (`/invoices`)**:
   - บันทึกเลขมิเตอร์น้ำและไฟฟ้าประจำเดือน (ดึงเลขครั้งก่อนมาเปรียบเทียบอัตโนมัติ)
   - ออกใบแจ้งหนี้ คำนวณค่าน้ำ ค่าไฟ ค่าส่วนกลาง และสร้าง **PromptPay QR Code** ตามยอดเงินจริง
   - พิมพ์ใบแจ้งหนี้ และพิมพ์ใบเสร็จรับเงินทางการ (Official Receipt A4 พร้อมตรา PAID)
6. **การเงินและรายจ่าย (`/finance`)**: บันทึกการรับชำระเงิน และบันทึกค่าใช้จ่ายหอพัก
7. **แจ้งซ่อมบำรุง (`/maintenance`)**: บันทึกรายการแจ้งซ่อม อุปกรณ์ชำรุด และติดตามสถานะงานซ่อม
8. **รายงานสรุป (`/reports`)**: สรุปยอดรายรับ-รายจ่าย อัตราการเข้าพัก กรองตามเดือนภาษาไทยและปี พ.ศ. พร้อมปุ่มพิมพ์รายงาน
9. **กล่องข้อความและประกาศ (`/messages`)**: ส่งข้อความถึงผู้เช่าเฉพาะห้อง เฉพาะบุคคล หรือประกาศทั่วไปถึงทุกห้องพัก
10. **ตั้งค่าระบบ (`/settings`)**: ตั้งค่าชื่อหอพัก อัตราค่าน้ำ-ไฟ บัญชีธนาคารรับเงิน พร้อมระบบดาวน์โหลด Backup JSON และกู้คืนข้อมูล
11. **ศูนย์การแจ้งเตือน (`/notifications`)**: รวบรวมประวัติการแจ้งเตือนงานซ่อม การเงิน และสัญญาเช่า
12. **ศูนย์ช่วยเหลือ (`/help`)**: คู่มือเริ่มต้นใช้งาน (Quick Onboarding) และรวมคำถามที่พบบ่อย (FAQ)
13. **ระบบสลับหอพัก (Multi-Dormitory Switcher)**: สลับหอพักที่ต้องการดูแล หรือเพิ่มหอพักใหม่ได้จากเมนูด้านซ้ายล่าง
14. **โหมดความปลอดภัยและการแบ่งสิทธิ์ (RBAC / RLS)**: สลับบทบาทระหว่าง เจ้าของ (Owner), ผู้จัดการ (Manager) และ เจ้าหน้าที่ (Staff) เพื่อควบคุมการเข้าถึงปุ่มสำคัญ

---

## 📁 โครงสร้างโปรเจกต์ (Modular Architecture)

ควบคุมความยาวของแต่ละไฟล์อย่างเข้มงวด **ไม่มีไฟล์ใดเกิน 700 บรรทัด** (ต่ำกว่าขีดจำกัด 800–1,000 บรรทัด):

```text
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI
├── supabase/
│   ├── schema.sql               # โครงสร้างตารางและนโยบายความปลอดภัย RLS
│   └── seed.sql
├── tests/                       # ชุดทดสอบ Vitest 19 Tests
│   ├── format.test.ts
│   ├── kpi.test.ts
│   ├── promptpay.test.ts
│   └── thaiDatePicker.test.ts
├── src/
│   ├── components/
│   │   ├── auth/                # Modal สลับสิทธิ์ความปลอดภัย (RBAC)
│   │   ├── billing/             # Modals จดมิเตอร์, ออกบิล, พิมพ์ใบเสร็จ
│   │   ├── common/              # EmptyState, Modal, ConfirmDialog, ThaiDatePicker
│   │   ├── dashboard/           # วิดเจ็ตแผงควบคุม
│   │   ├── dorm/                # Modal สลับหอพัก
│   │   └── layout/              # Sidebar, Topbar, DormCard
│   ├── lib/
│   │   ├── format.ts            # วัน เดือน ปี พ.ศ., ฟอร์แมตเงินบาท/สตางค์
│   │   ├── kpi.ts               # ฟังก์ชันคำนวณ KPI
│   │   ├── promptpay.ts         # EMVCo PromptPay QR Engine
│   │   └── supabase.ts          # Supabase Client
│   ├── pages/                   # หน้าเพจครบทุกโมดูล
│   └── services/                # บริการดึง/บันทึกข้อมูล (Supabase + LocalStorage)
```

---

## 🚀 การติดตั้งและเปิดใช้งานในเครื่อง (Local Setup)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. ตั้งค่า Environment Variables (ทางเลือก หากเชื่อมต่อ Supabase จริง)
cp .env.example .env
# ระบุค่า VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY ในไฟล์ .env

# 3. ตรวจสอบคุณภาพโค้ด
npm run typecheck
npm run lint
npm test

# 4. เริ่มต้นเซิร์ฟเวอร์สำหรับพัฒนา
npm run dev
```

---

## 🗄️ การตั้งค่า Supabase จริง (Database Setup)

1. ไปที่ [Supabase Dashboard](https://supabase.com) แล้วสร้างโปรเจกต์ใหม่
2. ไปที่เมนู **SQL Editor**
3. คัดลอกเนื้อหาทั้งหมดในไฟล์ [`supabase/schema.sql`](supabase/schema.sql) ไปวางแล้วกด **Run**
4. ตารางทั้งหมด 14 ตารางจะถูกสร้างขึ้นพร้อมเปิดใช้งาน **Row Level Security (RLS)** ทันที
5. คัดลอก `Project URL` และ `anon public API key` มาใส่ในไฟล์ `.env`

---

## 🌐 การ Deploy ขึ้น Vercel & GitHub

1. Push โค้ดทั้งหมดขึ้น GitHub Repository
2. เข้าสู่ [Vercel Dashboard](https://vercel.com) แล้วคลิก **Add New Project**
3. เลือก Repository `domplus-apartment-project`
4. เพิ่ม Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. คลิก **Deploy** — ตัวโปรเจกต์จะถูก Build และออนไลน์พร้อมใช้งานทันที
