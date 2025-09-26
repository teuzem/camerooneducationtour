/*
          # [Fix Function Search Path]
          Sets a secure search_path for existing database functions to resolve security warnings.

          ## Query Description: This operation modifies the configuration of existing functions to enhance security by preventing potential search path hijacking attacks. It does not alter data or table structures. It's a safe and recommended security hardening step.
          
          ## Metadata:
          - Schema-Category: ["Safe", "Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Function: `public.handle_new_user()`
          - Function: `public.create_admin_user_entry()`
          
          ## Security Implications:
          - RLS Status: Unchanged
          - Policy Changes: No
          - Auth Requirements: None
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: Unchanged
          - Estimated Impact: Negligible. This is a configuration change.
          */

ALTER FUNCTION public.handle_new_user()
SET search_path = public;

ALTER FUNCTION public.create_admin_user_entry()
SET search_path = public;
