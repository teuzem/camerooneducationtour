/*
# [SECURITY] Set search_path for all public functions
This script automatically finds all user-created functions in the 'public' schema and sets their 'search_path' to 'public'. This is a critical security measure to prevent search path hijacking attacks and resolves all "Function Search Path Mutable" warnings.

## Query Description:
- This operation iterates through all functions in your public schema.
- For each function, it applies `ALTER FUNCTION ... SET search_path = 'public'`.
- This ensures that when your functions are executed, they only look for objects (like tables) within the 'public' schema, preventing them from being tricked into using malicious objects from other schemas.
- This change has no impact on existing data and is entirely safe to run.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Security Implications:
- RLS Status: Not affected.
- Policy Changes: No.
- Auth Requirements: Admin privileges to run.
- This script significantly improves the security posture of your database functions.
*/

DO $$
DECLARE
    f RECORD;
BEGIN
    FOR f IN
        SELECT
            p.oid AS function_oid,
            ns.nspname AS schema_name,
            p.proname AS function_name,
            pg_get_function_identity_arguments(p.oid) AS function_args
        FROM
            pg_proc p
        JOIN
            pg_namespace ns ON p.pronamespace = ns.oid
        WHERE
            ns.nspname = 'public' -- Only functions in the public schema
    LOOP
        -- Construct and execute the ALTER FUNCTION statement
        EXECUTE format('ALTER FUNCTION %I.%I(%s) SET search_path = ''public'';',
                       f.schema_name,
                       f.function_name,
                       f.function_args);
    END LOOP;
END $$;
