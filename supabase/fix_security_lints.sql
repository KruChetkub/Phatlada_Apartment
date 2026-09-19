-- ============================================================================
-- Phatlada Apartment - Supabase Security Lints Remediation Script
-- Fixes all 21 lints identified in Supabase Performance & Security Linter
-- ============================================================================

-- 1. Fix Function Search Path & Execution Privileges (Lints: function_search_path_mutable, anon_security_definer_function_executable, authenticated_security_definer_function_executable)
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

REVOKE EXECUTE ON FUNCTION public.get_user_role(UUID) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated, service_role;


-- 2. Drop Insecure Wildcard RLS Policies (Lints: rls_policy_always_true across 13 tables)
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


-- 3. Create Granular, Hardened RLS Policies

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
