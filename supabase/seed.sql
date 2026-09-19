-- Phatlada Seed Data for Supabase
-- Matches SPEC.md §8 and design references exactly

-- Clean existing data
TRUNCATE TABLE notifications, maintenance_requests, expenses, payments, leases, tenants, rooms, dormitory_members, dormitories, users CASCADE;

-- Insert Owner User
INSERT INTO users (id, email, display_name, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'owner@phatlada.com', 'คุณนท ถาวร ศรีเสนพิลา', 'OWNER');

-- Insert Dormitory: หอพักสุขสันต์ (PREMIUM)
INSERT INTO dormitories (id, name, plan)
VALUES ('00000000-0000-0000-0000-000000000002', 'หอพักสุขสันต์', 'PREMIUM');

-- Link Owner to Dormitory
INSERT INTO dormitory_members (user_id, dormitory_id, role)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'OWNER');

-- Insert 48 Rooms (4 floors x 12 rooms: 101-112, 201-212, 301-312, 401-412)
-- Vacant rooms (6 rooms): 103, 205, 206, 309, 404, 412
-- All other 42 rooms are OCCUPIED
DO $$
DECLARE
    f INT;
    r INT;
    room_num TEXT;
    is_vacant BOOLEAN;
    rent_satang INT;
    room_uuid UUID;
BEGIN
    FOR f IN 1..4 LOOP
        FOR r IN 1..12 LOOP
            room_num := (f * 100 + r)::TEXT;
            is_vacant := room_num IN ('103', '205', '206', '309', '404', '412');
            
            -- Rent: 3,500 THB (350,000 satang) or 3,800 THB (380,000 satang)
            IF r <= 6 THEN
                rent_satang := 350000;
            ELSE
                rent_satang := 380000;
            END IF;
            
            -- Specific overrides for showcase rooms:
            IF room_num = '103' THEN
                rent_satang := 380000;
            END IF;

            INSERT INTO rooms (id, dormitory_id, number, floor, monthly_rent, status, updated_at)
            VALUES (
                gen_random_uuid(),
                '00000000-0000-0000-0000-000000000002',
                room_num,
                f,
                rent_satang,
                CASE WHEN is_vacant THEN 'VACANT'::room_status ELSE 'OCCUPIED'::room_status END,
                '2025-09-11 13:12:00+00'::timestamptz
            );
        END LOOP;
    END LOOP;
END $$;

-- Insert Key Showcase Tenants
INSERT INTO tenants (id, title, first_name, last_name, gender, phone) VALUES
('10000000-0000-0000-0000-000000000001', 'น.ส.', 'วราภรณ์', 'ใจดี', 'FEMALE', '081-234-5678'),
('10000000-0000-0000-0000-000000000002', 'นาย', 'ศักดิ์ชัย', 'แสนสุข', 'MALE', '082-345-6789'),
('10000000-0000-0000-0000-000000000003', 'น.ส.', 'ธนพร', 'พรมมา', 'FEMALE', '083-456-7890'),
('10000000-0000-0000-0000-000000000004', 'นาย', 'กิตติพงษ์', 'รัตนวงศ์', 'MALE', '084-567-8901'),
('10000000-0000-0000-0000-000000000005', 'นาย', 'สุรเชษฐ์', 'จันทร์ดี', 'MALE', '085-678-9012');

-- Link Leases for Showcase Rooms
-- Room 101: วราภรณ์, ends 2026-01-31
INSERT INTO leases (id, room_id, tenant_id, start_date, end_date, rent, deposit, status)
SELECT '20000000-0000-0000-0000-000000000001', id, '10000000-0000-0000-0000-000000000001', '2025-02-01', '2026-01-31', 350000, 700000, 'ACTIVE'
FROM rooms WHERE number = '101' LIMIT 1;

-- Room 102: ศักดิ์ชัย, ends 2026-02-15
INSERT INTO leases (id, room_id, tenant_id, start_date, end_date, rent, deposit, status)
SELECT '20000000-0000-0000-0000-000000000002', id, '10000000-0000-0000-0000-000000000002', '2025-02-15', '2026-02-15', 350000, 700000, 'ACTIVE'
FROM rooms WHERE number = '102' LIMIT 1;

-- Room 104: ธนพร, ends 2025-12-20
INSERT INTO leases (id, room_id, tenant_id, start_date, end_date, rent, deposit, status)
SELECT '20000000-0000-0000-0000-000000000003', id, '10000000-0000-0000-0000-000000000003', '2024-12-20', '2025-12-20', 380000, 760000, 'ACTIVE'
FROM rooms WHERE number = '104' LIMIT 1;

-- Room 105: กิตติพงษ์, ends 2026-01-10
INSERT INTO leases (id, room_id, tenant_id, start_date, end_date, rent, deposit, status)
SELECT '20000000-0000-0000-0000-000000000004', id, '10000000-0000-0000-0000-000000000004', '2025-01-10', '2026-01-10', 380000, 760000, 'ACTIVE'
FROM rooms WHERE number = '105' LIMIT 1;

-- Payments (Recent payments matching SPEC.md §8)
INSERT INTO payments (lease_id, amount, period, status, paid_at) VALUES
('20000000-0000-0000-0000-000000000001', 350000, '2025-09', 'PAID', '2025-09-11 13:05:00+00'),
('20000000-0000-0000-0000-000000000002', 350000, '2025-09', 'PAID', '2025-09-11 12:42:00+00'),
('20000000-0000-0000-0000-000000000003', 380000, '2025-09', 'PAID', '2025-09-11 11:30:00+00'),
('20000000-0000-0000-0000-000000000004', 380000, '2025-09', 'PAID', '2025-09-11 10:20:00+00');

-- Financial records for chart (Jul: 105,200 / 47,600, Aug: 112,900 / 49,800, Sep: 126,500 / 52,300)
INSERT INTO expenses (dormitory_id, category, amount, spent_at, note) VALUES
('00000000-0000-0000-0000-000000000002', 'ค่าน้ำ-ไฟส่วนกลาง', 4760000, '2025-07-25 10:00:00+00', 'ค่าไฟฟ้าส่วนกลาง ก.ค.'),
('00000000-0000-0000-0000-000000000002', 'ค่าน้ำ-ไฟส่วนกลาง', 4980000, '2025-08-25 10:00:00+00', 'ค่าไฟฟ้าส่วนกลาง ส.ค.'),
('00000000-0000-0000-0000-000000000002', 'ค่าน้ำ-ไฟส่วนกลางและบำรุงรักษา', 5230000, '2025-09-08 10:00:00+00', 'ค่าสาธารณูปโภคและซ่อมบำรุง ก.ย.');

-- Maintenance Requests (3 open: 2 IN_PROGRESS, 1 PENDING)
INSERT INTO maintenance_requests (room_id, title, status, created_at)
SELECT id, 'น้ำรั่วในห้องน้ำ', 'IN_PROGRESS', '2025-09-11 12:12:00+00'
FROM rooms WHERE number = '203' LIMIT 1;

INSERT INTO maintenance_requests (room_id, title, status, created_at)
SELECT id, 'เครื่องปรับอากาศมีน้ำหยด', 'IN_PROGRESS', '2025-09-10 09:30:00+00'
FROM rooms WHERE number = '305' LIMIT 1;

INSERT INTO maintenance_requests (room_id, title, status, created_at)
SELECT id, 'หลอดไฟระเบียงไม่ติด', 'PENDING', '2025-09-11 11:00:00+00'
FROM rooms WHERE number = '108' LIMIT 1;

-- Notifications (4 items)
INSERT INTO notifications (dormitory_id, type, title, body, href, read_at, created_at) VALUES
('00000000-0000-0000-0000-000000000002', 'MAINTENANCE_NEW', 'มีแจ้งซ่อมใหม่', 'ห้อง 203 - น้ำรั่วในห้องน้ำ', '/maintenance', NULL, '2025-09-11 12:12:00+00'),
('00000000-0000-0000-0000-000000000002', 'PAYMENT_RECEIVED', 'ผู้เช่าชำระค่าเช่า', 'ห้อง 101 - 3,500 บาท', '/finance', NULL, '2025-09-11 13:05:00+00'),
('00000000-0000-0000-0000-000000000002', 'LEASE_EXPIRING', 'ใกล้หมดสัญญาเช่า', 'ห้อง 110 - เหลือ 15 วัน', '/leases', NULL, '2025-09-11 08:12:00+00'),
('00000000-0000-0000-0000-000000000002', 'ROOM_AVAILABLE', 'ห้องว่างพร้อมให้เช่า', 'ห้อง 103 - 3,800 บาท/เดือน', '/rooms', '2025-09-11 09:00:00+00', '2025-09-11 06:12:00+00');

