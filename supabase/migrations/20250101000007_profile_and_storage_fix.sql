/*
          # [Schema & Storage] Create Organization Profile and Assets Storage
          [This script creates the table to hold organization details and a dedicated storage bucket for assets like logos. It also sets up all necessary security policies.]

          ## Query Description: [This operation is structural and safe. It adds a new table `organization_profile` and a new storage bucket `organization_assets`. It does not affect any existing data. Row Level Security is enabled to ensure only authenticated admins can modify the profile and assets.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Tables Created: `public.organization_profile`
          - Storage Buckets Created: `organization_assets`
          - Policies Created: RLS policies for `organization_profile` and `storage.objects` in the new bucket.
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes
          - Auth Requirements: Admin role (via `is_admin()` function) is required for modifications.
          
          ## Performance Impact:
          - Indexes: Primary key index on `id`.
          - Triggers: None.
          - Estimated Impact: Negligible.
          */

-- 1. Create Organization Profile Table
CREATE TABLE IF NOT EXISTS public.organization_profile (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text,
    slogan text,
    mission text,
    logo_url text,
    address text,
    city text,
    country text,
    accreditation_details text,
    social_links jsonb,
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. Enable RLS on the new table
ALTER TABLE public.organization_profile ENABLE ROW LEVEL SECURITY;

-- 3. Seed the table with a single profile row to ensure it exists for updates
-- This will only run if the table is empty.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.organization_profile) THEN
    INSERT INTO public.organization_profile (id) VALUES (gen_random_uuid());
  END IF;
END $$;

-- 4. Create Policies for Organization Profile
DROP POLICY IF EXISTS "Allow admin to read organization profile" ON public.organization_profile;
CREATE POLICY "Allow admin to read organization profile"
ON public.organization_profile FOR SELECT
TO authenticated
USING ( is_admin(auth.uid()) );

DROP POLICY IF EXISTS "Allow admin to update organization profile" ON public.organization_profile;
CREATE POLICY "Allow admin to update organization profile"
ON public.organization_profile FOR UPDATE
TO authenticated
USING ( is_admin(auth.uid()) )
WITH CHECK ( is_admin(auth.uid()) );


-- 5. Create Storage Bucket for Organization Assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('organization_assets', 'organization_assets', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Create Policies for Storage Bucket
-- Public read access for logos
DROP POLICY IF EXISTS "Allow public read access to logos" ON storage.objects;
CREATE POLICY "Allow public read access to logos"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'organization_assets'
);

-- Admin insert access
DROP POLICY IF EXISTS "Allow admin to insert logos" ON storage.objects;
CREATE POLICY "Allow admin to insert logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'organization_assets' AND
  is_admin(auth.uid())
);

-- Admin update access
DROP POLICY IF EXISTS "Allow admin to update logos" ON storage.objects;
CREATE POLICY "Allow admin to update logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'organization_assets' AND
  is_admin(auth.uid())
);

-- Admin delete access
DROP POLICY IF EXISTS "Allow admin to delete logos" ON storage.objects;
CREATE POLICY "Allow admin to delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'organization_assets' AND
  is_admin(auth.uid())
);
