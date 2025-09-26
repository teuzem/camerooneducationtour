/*
          # [Fix] Recreate handle_new_user function and trigger
          This migration corrects an issue where the `handle_new_user` function was missing, causing an error during user creation. It safely drops the existing trigger and function (if they exist) and recreates them in the correct order with the proper security definitions.

          ## Query Description: [This operation rebuilds the automated process for handling new user sign-ups. It ensures that when the administrator account is created, a corresponding entry is correctly made in the `admin_users` table. This is a safe, structural change and does not affect existing data.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Drops trigger `on_auth_user_created` on `auth.users`.
          - Drops function `public.handle_new_user()`.
          - Creates function `public.handle_new_user()`.
          - Creates trigger `on_auth_user_created` on `auth.users`.
          
          ## Security Implications:
          - RLS Status: Unchanged
          - Policy Changes: No
          - Auth Requirements: The function uses `SECURITY DEFINER` to insert into `public.admin_users`.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: Re-adds a trigger on `auth.users` table for new inserts.
          - Estimated Impact: Negligible impact on performance.
          */

-- 1. Drop the existing trigger if it exists to avoid conflicts.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop the existing function if it exists.
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Create the function to handle new user creation.
-- This function runs with the privileges of the user that created it (SECURITY DEFINER),
-- allowing it to insert into the public.admin_users table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the new user is the designated administrator
  IF new.email = 'angwirhoda@go2skul.com' THEN
    -- Insert a corresponding entry into the admin_users table
    INSERT INTO public.admin_users (id, email, is_active)
    VALUES (new.id, new.email, true);
  END IF;
  RETURN new;
END;
$$;

-- 4. Recreate the trigger to execute the function after a new user is created.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Grant usage permissions on the function to the authenticated role.
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
