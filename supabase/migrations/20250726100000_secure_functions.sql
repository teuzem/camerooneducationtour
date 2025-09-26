/*
# [SECURITY] Set Function Search Path
This migration secures existing database functions by explicitly setting their `search_path`. This prevents potential schema spoofing attacks and resolves the "Function Search Path Mutable" security advisory.

## Query Description:
- This operation modifies the configuration of existing functions (`handle_new_user` and `create_admin_user`).
- It does not alter the logic or data structures.
- It is a safe and recommended security enhancement.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: None
- Mitigates: Schema spoofing attacks by ensuring functions only search within the 'public' schema.
*/

-- Secure the handle_new_user function
ALTER FUNCTION public.handle_new_user()
SET search_path = public;

-- Secure the create_admin_user function
ALTER FUNCTION public.create_admin_user(email text, password text)
SET search_path = public;
