/*
          # [Structural] Création du profil de l'organisation
          [Crée la table pour le profil de l'organisation et le stockage des ressources.]

          ## Query Description: [Crée une nouvelle table `organization_profile` pour stocker les informations globales de l'entreprise (logo, slogan, etc.) et un bucket de stockage `organization_assets`. Des politiques de sécurité (RLS) sont appliquées pour s'assurer que seuls les administrateurs authentifiés peuvent lire et modifier ces informations. Une seule ligne est insérée par défaut pour le profil. Cette opération est sûre et n'affecte pas les données existantes.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Tables affectées: `organization_profile` (création)
          - Storage buckets affectés: `organization_assets` (création)
          
          ## Security Implications:
          - RLS Status: Enabled on `organization_profile`
          - Policy Changes: Yes, nouvelles politiques pour `organization_profile` et `storage.objects`.
          - Auth Requirements: Authenticated admins
          
          ## Performance Impact:
          - Indexes: Primary key index on `organization_profile`.
          - Triggers: None.
          - Estimated Impact: Négligeable.
          */

-- 1. Créer la table pour le profil de l'organisation
CREATE TABLE IF NOT EXISTS public.organization_profile (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- 2. Activer la sécurité au niveau des lignes (RLS)
ALTER TABLE public.organization_profile ENABLE ROW LEVEL SECURITY;

-- 3. Insérer la ligne de profil unique si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.organization_profile) THEN
    INSERT INTO public.organization_profile (id, name) VALUES (gen_random_uuid(), 'Go2Skul Education Group');
  END IF;
END $$;

-- 4. Créer les politiques RLS pour la table de profil
DROP POLICY IF EXISTS "Allow admins to read the organization profile" ON public.organization_profile;
CREATE POLICY "Allow admins to read the organization profile"
ON public.organization_profile FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true
  )
);

DROP POLICY IF EXISTS "Allow admins to update the organization profile" ON public.organization_profile;
CREATE POLICY "Allow admins to update the organization profile"
ON public.organization_profile FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true
  )
);

DROP POLICY IF EXISTS "Disallow insert on organization profile" ON public.organization_profile;
CREATE POLICY "Disallow insert on organization profile"
ON public.organization_profile FOR INSERT
WITH CHECK (false);

DROP POLICY IF EXISTS "Disallow delete on organization profile" ON public.organization_profile;
CREATE POLICY "Disallow delete on organization profile"
ON public.organization_profile FOR DELETE
USING (false);


-- 5. Créer le bucket de stockage pour les ressources de l'organisation
INSERT INTO storage.buckets (id, name, public)
VALUES ('organization_assets', 'organization_assets', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Créer les politiques pour le bucket de stockage
DROP POLICY IF EXISTS "Allow admins to read from organization assets" ON storage.objects;
CREATE POLICY "Allow admins to read from organization assets"
ON storage.objects FOR SELECT
USING ( bucket_id = 'organization_assets' AND EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true) );

DROP POLICY IF EXISTS "Allow admins to manage organization assets" ON storage.objects;
CREATE POLICY "Allow admins to manage organization assets"
ON storage.objects FOR INSERT, UPDATE, DELETE
WITH CHECK ( bucket_id = 'organization_assets' AND EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid() AND admin_users.is_active = true) );
