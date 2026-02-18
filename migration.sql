
-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Function to add user_id column to a table if it doesn't exist
CREATE OR REPLACE FUNCTION add_user_id_column(tbl text) RETURNS void AS $$
BEGIN
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id)', tbl);
END;
$$ LANGUAGE plpgsql;

-- 2. Function to enable RLS and create policy
CREATE OR REPLACE FUNCTION enable_rls_and_create_policy(tbl text) RETURNS void AS $$
BEGIN
    -- Enable RLS
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);

    -- Drop existing policies to ensure clean state
    BEGIN
        EXECUTE format('DROP POLICY IF EXISTS "Enable access for users based on role" ON %I', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "role_based_access" ON %I', tbl);
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;

    -- Create Policy: 
    -- Admins (role='admin' in metadata) can do everything.
    -- Users can SELECT/INSERT/UPDATE/DELETE only their own rows (user_id = auth.uid())
    EXECUTE format('
        CREATE POLICY "role_based_access" ON %I
        FOR ALL
        USING (
            (auth.jwt() -> ''user_metadata'' ->> ''role'') = ''admin''
            OR auth.uid() = user_id
            OR user_id IS NULL
        )
        WITH CHECK (
            (auth.jwt() -> ''user_metadata'' ->> ''role'') = ''admin''
            OR auth.uid() = user_id
            OR user_id IS NULL
        )
    ', tbl);
END;
$$ LANGUAGE plpgsql;

-- 3. Execute for all tables
DO $$
DECLARE
    -- List of all tables in the application
    tables text[] := ARRAY[
        'daily_reports',
        'outsourced_reports',
        'foam_reports',
        'inertia_reports',
        'shift_change_reports',
        'sling_reports',
        'swabbing_reports',
        'qhse_reports',
        'transport_checklist_reports',
        'workover_checklist_reports',
        'tool_movement_reports',
        'cable_work_reports',
        'pulling_checklist_reports',
        'maintenance_reports',
        'fbu_checklist_reports',
        'circuit_breaker_reports',
        'facility_inspection_reports',
        'vehicle_inspection_reports',
        'ipcr_reports',
        'forklift_reports',
        'first_aid_reports',
        'bump_test_reports',
        'foam_test_reports',
        'torque_reports',
        'forklift_lifting_plan_reports',
        'customer_custody_reports',
        'stilson_control_reports',
        'electrical_tool_checklist_reports',
        'stilson_inspection_reports',
        'thickness_reports',
        'electrical_checklist_reports',
        'platform_inspection_reports',
        'ind_control_reports',
        'managerial_visit_reports',
        'bop_connection_reports',
        'tower_pressure_reports',
        'mechanical_checklists',
        'waste_signs',
        'welcome_signs',
        'performance_evaluation_reports',
        'oil_change_reports',
        'mast_assembly_roles_reports',
        'flare_checklists',
        'well_filling_reports',
        'pre_assembly_checklist_reports',
        'accumulator_test_reports',
        'emergency_drills',
        'daily_inspections_cat_i',
        'dropped_objects_reports',
        'tubing_measurement_reports',
        'location_handover_reports'
    ];
    t text;
BEGIN
    FOREACH t IN ARRAY tables LOOP
        -- Ensure table exists before modifying (simple check to avoid errors if migration is partial)
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = t) THEN
            PERFORM add_user_id_column(t);
            PERFORM enable_rls_and_create_policy(t);
        END IF;
    END LOOP;
END $$;

-- Force Schema Cache Reload
NOTIFY pgrst, 'reload config';
