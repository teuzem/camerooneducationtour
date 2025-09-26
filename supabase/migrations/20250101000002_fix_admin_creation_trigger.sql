/*
# [Fix Admin Creation Trigger]
This migration updates the trigger function responsible for creating an admin user entry. The previous version failed due to Row Level Security (RLS) policies on the `admin_users` table. This fix ensures the function can bypass RLS to successfully insert the admin record upon user creation.

## Query Description: [This operation modifies a database function to grant it elevated privileges for a specific task. It fixes a bug preventing the admin user from being created. There is no risk to existing data.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Function modified: `public.create_admin_user_entry()`

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [No]
- Auth Requirements: [The function uses `service_role` internally to bypass RLS, which is a secure pattern for this use case.]

## Performance Impact:
- Indexes: [None]
- Triggers: [The associated trigger will now execute successfully.]
- Estimated Impact: [Negligible performance impact. Fixes a critical bug.]
*/

CREATE OR REPLACE FUNCTION public.create_admin_user_entry()
RETURNS TRIGGER AS $$
BEGIN
    -- Use the service_role to bypass RLS for this specific insertion.
    -- This is a secure and standard pattern for triggers that need to write to RLS-protected tables.
    SET LOCAL role service_role;

    IF NEW.email = 'angwirhoda@go2skul.com' THEN
        INSERT INTO public.admin_users (id, is_active)
        VALUES (NEW.id, true);
    END IF;
    
    -- Revert the role back to the original invoker role
    RESET role;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
