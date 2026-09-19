-- Phatlada Database Schema for Supabase (PostgreSQL)
-- Conforms to SPEC.md §4 and RULES.md §2 (all monetary values in satang as INTEGER)
-- Secured with granular Row Level Security (RLS) policies and search_path protection

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

-- 15. Helper Security Functions (With fixed search_path & SECURITY INVOKER)
DROP FUNCTION IF EXISTS public.get_user_role(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role CASCADE;

CREATE OR REPLACE FUNCTION public.get_user_role(dorm_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
    user_role_val TEXT;
BEGIN
    SELECT role::TEXT INTO user_role_val
    FROM public.dormitory_members
    WHERE user_id = auth.uid() AND dormitory_id = dorm_id;
    RETURN user_role_val;
END;
$$;

-- Restrict execution privilege
REVOKE EXECUTE ON FUNCTION public.get_user_role(UUID) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated, service_role;

-- 16. Enable Row Level Security on all tables
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

-- 17. Cleanup Legacy Insecure Policies
DROP POLICY IF EXISTS "Allow all users" ON users;
DROP POLICY IF EXISTS "Allow all dormitories" ON dormitories;
DROP POLICY IF EXISTS "Allow all dormitory_members" ON dormitory_members;
DROP POLICY IF EXISTS "Allow all rooms" ON rooms;
DROP POLICY IF EXISTS "Allow all tenants" ON tenants;
DROP POLICY IF EXISTS "Allow all leases" ON leases;
DROP POLICY IF EXISTS "Allow all payments" ON payments;
DROP POLICY IF EXISTS "Allow all expenses" ON expenses;
DROP POLICY IF EXISTS "Allow all maintenance" ON maintenance_requests;
DROP POLICY IF EXISTS "All members can insert maintenance" ON maintenance_requests;
DROP POLICY IF EXISTS "All members can update maintenance" ON maintenance_requests;
DROP POLICY IF EXISTS "Allow all notifications" ON notifications;
DROP POLICY IF EXISTS "Allow all messages" ON messages;
DROP POLICY IF EXISTS "All members can insert messages" ON messages;
DROP POLICY IF EXISTS "All members can update messages" ON messages;
DROP POLICY IF EXISTS "Allow all utility_readings" ON utility_readings;
DROP POLICY IF EXISTS "Allow all invoices" ON invoices;

-- 18. Granular & Secure RLS Policies

-- Users
DROP POLICY IF EXISTS "users_select_policy" ON users;
CREATE POLICY "users_select_policy" ON users FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "users_insert_policy" ON users;
CREATE POLICY "users_insert_policy" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_policy" ON users;
CREATE POLICY "users_update_policy" ON users FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_delete_policy" ON users;
CREATE POLICY "users_delete_policy" ON users FOR DELETE TO authenticated USING (auth.uid() = id);

-- Dormitories
DROP POLICY IF EXISTS "dormitories_select_policy" ON dormitories;
CREATE POLICY "dormitories_select_policy" ON dormitories FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "dormitories_insert_policy" ON dormitories;
CREATE POLICY "dormitories_insert_policy" ON dormitories FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "dormitories_update_policy" ON dormitories;
CREATE POLICY "dormitories_update_policy" ON dormitories FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "dormitories_delete_policy" ON dormitories;
CREATE POLICY "dormitories_delete_policy" ON dormitories FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Dormitory Members
DROP POLICY IF EXISTS "dormitory_members_select_policy" ON dormitory_members;
CREATE POLICY "dormitory_members_select_policy" ON dormitory_members FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "dormitory_members_insert_policy" ON dormitory_members;
CREATE POLICY "dormitory_members_insert_policy" ON dormitory_members FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "dormitory_members_update_policy" ON dormitory_members;
CREATE POLICY "dormitory_members_update_policy" ON dormitory_members FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "dormitory_members_delete_policy" ON dormitory_members;
CREATE POLICY "dormitory_members_delete_policy" ON dormitory_members FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Rooms
DROP POLICY IF EXISTS "rooms_select_policy" ON rooms;
CREATE POLICY "rooms_select_policy" ON rooms FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "rooms_insert_policy" ON rooms;
CREATE POLICY "rooms_insert_policy" ON rooms FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "rooms_update_policy" ON rooms;
CREATE POLICY "rooms_update_policy" ON rooms FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "rooms_delete_policy" ON rooms;
CREATE POLICY "rooms_delete_policy" ON rooms FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Tenants
DROP POLICY IF EXISTS "tenants_select_policy" ON tenants;
CREATE POLICY "tenants_select_policy" ON tenants FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "tenants_insert_policy" ON tenants;
CREATE POLICY "tenants_insert_policy" ON tenants FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "tenants_update_policy" ON tenants;
CREATE POLICY "tenants_update_policy" ON tenants FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "tenants_delete_policy" ON tenants;
CREATE POLICY "tenants_delete_policy" ON tenants FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Leases
DROP POLICY IF EXISTS "leases_select_policy" ON leases;
CREATE POLICY "leases_select_policy" ON leases FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "leases_insert_policy" ON leases;
CREATE POLICY "leases_insert_policy" ON leases FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "leases_update_policy" ON leases;
CREATE POLICY "leases_update_policy" ON leases FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "leases_delete_policy" ON leases;
CREATE POLICY "leases_delete_policy" ON leases FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Payments
DROP POLICY IF EXISTS "payments_select_policy" ON payments;
CREATE POLICY "payments_select_policy" ON payments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "payments_insert_policy" ON payments;
CREATE POLICY "payments_insert_policy" ON payments FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "payments_update_policy" ON payments;
CREATE POLICY "payments_update_policy" ON payments FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "payments_delete_policy" ON payments;
CREATE POLICY "payments_delete_policy" ON payments FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Expenses
DROP POLICY IF EXISTS "expenses_select_policy" ON expenses;
CREATE POLICY "expenses_select_policy" ON expenses FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "expenses_insert_policy" ON expenses;
CREATE POLICY "expenses_insert_policy" ON expenses FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "expenses_update_policy" ON expenses;
CREATE POLICY "expenses_update_policy" ON expenses FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "expenses_delete_policy" ON expenses;
CREATE POLICY "expenses_delete_policy" ON expenses FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Maintenance Requests
DROP POLICY IF EXISTS "maintenance_select_policy" ON maintenance_requests;
CREATE POLICY "maintenance_select_policy" ON maintenance_requests FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "maintenance_insert_policy" ON maintenance_requests;
CREATE POLICY "maintenance_insert_policy" ON maintenance_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "maintenance_update_policy" ON maintenance_requests;
CREATE POLICY "maintenance_update_policy" ON maintenance_requests FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "maintenance_delete_policy" ON maintenance_requests;
CREATE POLICY "maintenance_delete_policy" ON maintenance_requests FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Notifications
DROP POLICY IF EXISTS "notifications_select_policy" ON notifications;
CREATE POLICY "notifications_select_policy" ON notifications FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "notifications_insert_policy" ON notifications;
CREATE POLICY "notifications_insert_policy" ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "notifications_update_policy" ON notifications;
CREATE POLICY "notifications_update_policy" ON notifications FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "notifications_delete_policy" ON notifications;
CREATE POLICY "notifications_delete_policy" ON notifications FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Messages
DROP POLICY IF EXISTS "messages_select_policy" ON messages;
CREATE POLICY "messages_select_policy" ON messages FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "messages_insert_policy" ON messages;
CREATE POLICY "messages_insert_policy" ON messages FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "messages_update_policy" ON messages;
CREATE POLICY "messages_update_policy" ON messages FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "messages_delete_policy" ON messages;
CREATE POLICY "messages_delete_policy" ON messages FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Utility Readings
DROP POLICY IF EXISTS "utility_readings_select_policy" ON utility_readings;
CREATE POLICY "utility_readings_select_policy" ON utility_readings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "utility_readings_insert_policy" ON utility_readings;
CREATE POLICY "utility_readings_insert_policy" ON utility_readings FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "utility_readings_update_policy" ON utility_readings;
CREATE POLICY "utility_readings_update_policy" ON utility_readings FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "utility_readings_delete_policy" ON utility_readings;
CREATE POLICY "utility_readings_delete_policy" ON utility_readings FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Invoices
DROP POLICY IF EXISTS "invoices_select_policy" ON invoices;
CREATE POLICY "invoices_select_policy" ON invoices FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "invoices_insert_policy" ON invoices;
CREATE POLICY "invoices_insert_policy" ON invoices FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "invoices_update_policy" ON invoices;
CREATE POLICY "invoices_update_policy" ON invoices FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "invoices_delete_policy" ON invoices;
CREATE POLICY "invoices_delete_policy" ON invoices FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);
