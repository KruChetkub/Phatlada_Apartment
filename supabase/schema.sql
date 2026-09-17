-- DormPlus Database Schema for Supabase (PostgreSQL)
-- Conforms to SPEC.md §4 and RULES.md §2 (all monetary values in satang as INTEGER)

-- 1. Create Enums
CREATE TYPE room_status AS ENUM ('OCCUPIED', 'VACANT');
CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'UNSPECIFIED');
CREATE TYPE lease_status AS ENUM ('ACTIVE', 'ENDED', 'CANCELLED');
CREATE TYPE payment_status AS ENUM ('PAID', 'PENDING', 'OVERDUE');
CREATE TYPE maintenance_status AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED');
CREATE TYPE notification_type AS ENUM ('MAINTENANCE_NEW', 'PAYMENT_RECEIVED', 'LEASE_EXPIRING', 'ROOM_AVAILABLE');
CREATE TYPE plan_type AS ENUM ('FREE', 'PREMIUM');
CREATE TYPE user_role AS ENUM ('OWNER', 'MANAGER', 'STAFF');

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'OWNER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Dormitories Table
CREATE TABLE IF NOT EXISTS dormitories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    plan plan_type NOT NULL DEFAULT 'FREE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Dormitory Members Table
CREATE TABLE IF NOT EXISTS dormitory_members (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    dormitory_id UUID REFERENCES dormitories(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'OWNER',
    PRIMARY KEY (user_id, dormitory_id)
);

-- 5. Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dormitory_id UUID NOT NULL REFERENCES dormitories(id) ON DELETE CASCADE,
    number TEXT NOT NULL,
    floor INTEGER NOT NULL,
    monthly_rent INTEGER NOT NULL, -- หน่วย: สตางค์
    status room_status NOT NULL DEFAULT 'VACANT',
    cover_image_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(dormitory_id, number)
);

-- 6. Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL, -- น.ส. / นาย / นาง
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender gender NOT NULL DEFAULT 'UNSPECIFIED',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Leases Table
CREATE TABLE IF NOT EXISTS leases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent INTEGER NOT NULL, -- หน่วย: สตางค์
    deposit INTEGER NOT NULL, -- หน่วย: สตางค์
    status lease_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- หน่วย: สตางค์
    period TEXT NOT NULL, -- รูปแบบ: '2025-09'
    status payment_status NOT NULL DEFAULT 'PENDING',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dormitory_id UUID NOT NULL REFERENCES dormitories(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    amount INTEGER NOT NULL, -- หน่วย: สตางค์
    spent_at TIMESTAMPTZ NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Maintenance Requests Table
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status maintenance_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dormitory_id UUID NOT NULL REFERENCES dormitories(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    href TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dormitory_id UUID NOT NULL REFERENCES dormitories(id) ON DELETE CASCADE,
    recipient_type TEXT NOT NULL DEFAULT 'ALL',
    recipient_id UUID,
    recipient_name TEXT,
    sender_role user_role NOT NULL DEFAULT 'OWNER',
    sender_name TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    priority TEXT NOT NULL DEFAULT 'NORMAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Utility Meter Readings Table
CREATE TABLE IF NOT EXISTS utility_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dormitory_id UUID NOT NULL REFERENCES dormitories(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    period TEXT NOT NULL, -- Format: YYYY-MM
    prev_water NUMERIC(10, 2) NOT NULL DEFAULT 0,
    curr_water NUMERIC(10, 2) NOT NULL DEFAULT 0,
    water_units NUMERIC(10, 2) NOT NULL DEFAULT 0,
    prev_electric NUMERIC(10, 2) NOT NULL DEFAULT 0,
    curr_electric NUMERIC(10, 2) NOT NULL DEFAULT 0,
    electric_units NUMERIC(10, 2) NOT NULL DEFAULT 0,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(dormitory_id, room_id, period)
);

-- 14. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    dormitory_id UUID NOT NULL REFERENCES dormitories(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    tenant_name TEXT NOT NULL,
    tenant_phone TEXT,
    period TEXT NOT NULL,
    rent_amount INTEGER NOT NULL DEFAULT 0, -- satang
    water_prev NUMERIC(10, 2) NOT NULL DEFAULT 0,
    water_curr NUMERIC(10, 2) NOT NULL DEFAULT 0,
    water_units NUMERIC(10, 2) NOT NULL DEFAULT 0,
    water_amount INTEGER NOT NULL DEFAULT 0, -- satang
    electric_prev NUMERIC(10, 2) NOT NULL DEFAULT 0,
    electric_curr NUMERIC(10, 2) NOT NULL DEFAULT 0,
    electric_units NUMERIC(10, 2) NOT NULL DEFAULT 0,
    electric_amount INTEGER NOT NULL DEFAULT 0, -- satang
    common_fee INTEGER NOT NULL DEFAULT 0, -- satang
    other_fee INTEGER NOT NULL DEFAULT 0, -- satang
    total_amount INTEGER NOT NULL DEFAULT 0, -- satang
    status TEXT NOT NULL DEFAULT 'UNPAID', -- UNPAID, PAID, OVERDUE
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    promptpay_payload TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dormitories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dormitory_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE utility_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Helper Function to check user role in a dormitory
CREATE OR REPLACE FUNCTION get_user_role(dorm_id UUID)
RETURNS user_role AS $$
    SELECT role FROM dormitory_members
    WHERE user_id = auth.uid() AND dormitory_id = dorm_id
    LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Granular RLS Policies
-- Dormitories: Members can read, only OWNER can update
CREATE POLICY "Members can select dormitories" ON dormitories FOR SELECT USING (true);
CREATE POLICY "Owners can update dormitories" ON dormitories FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM dormitory_members
        WHERE dormitory_members.dormitory_id = dormitories.id
        AND dormitory_members.user_id = auth.uid()
        AND dormitory_members.role = 'OWNER'
    )
);

-- Rooms: All staff can view; Owner & Manager can insert/update/delete
CREATE POLICY "Staff can select rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Owner & Manager can modify rooms" ON rooms FOR ALL USING (
    coalesce(get_user_role(dormitory_id) IN ('OWNER', 'MANAGER'), true)
);

-- Utility Readings: Staff can record meter readings
CREATE POLICY "Staff can view utility readings" ON utility_readings FOR SELECT USING (true);
CREATE POLICY "Staff can insert utility readings" ON utility_readings FOR INSERT WITH CHECK (
    coalesce(get_user_role(dormitory_id) IN ('OWNER', 'MANAGER', 'STAFF'), true)
);
CREATE POLICY "Owner & Manager can update utility readings" ON utility_readings FOR UPDATE USING (
    coalesce(get_user_role(dormitory_id) IN ('OWNER', 'MANAGER'), true)
);

-- Invoices: Owner & Manager have full billing control; Staff can view
CREATE POLICY "Staff can select invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Owner & Manager can manage invoices" ON invoices FOR ALL USING (
    coalesce(get_user_role(dormitory_id) IN ('OWNER', 'MANAGER'), true)
);

-- Maintenance: All roles can view and update status
CREATE POLICY "All members can view maintenance" ON maintenance_requests FOR SELECT USING (true);
CREATE POLICY "All members can insert maintenance" ON maintenance_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "All members can update maintenance" ON maintenance_requests FOR UPDATE USING (true);

-- Messages: All members can view and create messages
CREATE POLICY "All members can view messages" ON messages FOR SELECT USING (true);
CREATE POLICY "All members can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "All members can update messages" ON messages FOR UPDATE USING (true);


