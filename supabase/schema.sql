-- Phatlada Database Schema for Supabase (PostgreSQL)
-- Conforms to SPEC.md §4 and RULES.md §2 (all monetary values in satang as INTEGER)

-- 1. Create Enums (Idempotent)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'room_status') THEN
        CREATE TYPE room_status AS ENUM ('OCCUPIED', 'VACANT');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender') THEN
        CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'UNSPECIFIED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lease_status') THEN
        CREATE TYPE lease_status AS ENUM ('ACTIVE', 'ENDED', 'CANCELLED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('PAID', 'PENDING', 'OVERDUE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'maintenance_status') THEN
        CREATE TYPE maintenance_status AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM ('MAINTENANCE_NEW', 'PAYMENT_RECEIVED', 'LEASE_EXPIRING', 'ROOM_AVAILABLE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_type') THEN
        CREATE TYPE plan_type AS ENUM ('FREE', 'PREMIUM');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('OWNER', 'MANAGER', 'STAFF');
    END IF;
END $$;

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

-- 15. RLS Policies (Allow access for application operations)
-- Users
DROP POLICY IF EXISTS "Allow all users" ON users;
CREATE POLICY "Allow all users" ON users FOR ALL USING (true) WITH CHECK (true);

-- Dormitories
DROP POLICY IF EXISTS "Allow all dormitories" ON dormitories;
CREATE POLICY "Allow all dormitories" ON dormitories FOR ALL USING (true) WITH CHECK (true);

-- Dormitory Members
DROP POLICY IF EXISTS "Allow all dormitory_members" ON dormitory_members;
CREATE POLICY "Allow all dormitory_members" ON dormitory_members FOR ALL USING (true) WITH CHECK (true);

-- Rooms
DROP POLICY IF EXISTS "Allow all rooms" ON rooms;
CREATE POLICY "Allow all rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);

-- Tenants
DROP POLICY IF EXISTS "Allow all tenants" ON tenants;
CREATE POLICY "Allow all tenants" ON tenants FOR ALL USING (true) WITH CHECK (true);

-- Leases
DROP POLICY IF EXISTS "Allow all leases" ON leases;
CREATE POLICY "Allow all leases" ON leases FOR ALL USING (true) WITH CHECK (true);

-- Payments
DROP POLICY IF EXISTS "Allow all payments" ON payments;
CREATE POLICY "Allow all payments" ON payments FOR ALL USING (true) WITH CHECK (true);

-- Expenses
DROP POLICY IF EXISTS "Allow all expenses" ON expenses;
CREATE POLICY "Allow all expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);

-- Maintenance
DROP POLICY IF EXISTS "Allow all maintenance" ON maintenance_requests;
CREATE POLICY "Allow all maintenance" ON maintenance_requests FOR ALL USING (true) WITH CHECK (true);

-- Notifications
DROP POLICY IF EXISTS "Allow all notifications" ON notifications;
CREATE POLICY "Allow all notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- Messages
DROP POLICY IF EXISTS "Allow all messages" ON messages;
CREATE POLICY "Allow all messages" ON messages FOR ALL USING (true) WITH CHECK (true);

-- Utility Readings
DROP POLICY IF EXISTS "Allow all utility_readings" ON utility_readings;
CREATE POLICY "Allow all utility_readings" ON utility_readings FOR ALL USING (true) WITH CHECK (true);

-- Invoices
DROP POLICY IF EXISTS "Allow all invoices" ON invoices;
CREATE POLICY "Allow all invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);



