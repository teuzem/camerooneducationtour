/*
      # [SECURITY] Set Function Search Path
      [This migration explicitly sets the `search_path` for all custom database functions to mitigate security risks related to schema spoofing, addressing the "Function Search Path Mutable" warning.]

      ## Query Description: [This operation modifies existing functions to make them more secure. It is a safe, non-destructive change that ensures functions operate within the expected 'public' schema, preventing potential hijacking by malicious users with CREATE privileges on other schemas.]
      
      ## Metadata:
      - Schema-Category: ["Safe", "Security"]
      - Impact-Level: ["Low"]
      - Requires-Backup: false
      - Reversible: true
      
      ## Structure Details:
      - Modifies function: `public.handle_new_user`
      - Modifies function: `public.create_admin_user_on_signup`
      
      ## Security Implications:
      - RLS Status: [No Change]
      - Policy Changes: [No]
      - Auth Requirements: [None]
      - Fixes: Resolves "Function Search Path Mutable" warning.
      
      ## Performance Impact:
      - Indexes: [No Change]
      - Triggers: [No Change]
      - Estimated Impact: [Negligible performance impact. Improves security posture.]
    */

-- Fix for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER AS
$$
BEGIN
  SET search_path = public;
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

-- Fix for create_admin_user_on_signup function
CREATE OR REPLACE FUNCTION public.create_admin_user_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER AS
$$
BEGIN
  SET search_path = public;
  IF new.email = 'angwirhoda@go2skul.com' THEN
    INSERT INTO public.admin_users (id, is_active)
    VALUES (new.id, true);
  END IF;
  RETURN new;
END;
$$;
