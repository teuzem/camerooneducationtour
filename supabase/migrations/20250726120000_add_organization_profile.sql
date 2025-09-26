/*
          # [Structural] Création du Profil de l'Organisation
          Crée la table `organization_profile` pour stocker les informations globales de l'entreprise et le bucket de stockage `organization_assets` pour le logo.

          ## Query Description: "Cette opération ajoute de nouvelles structures à votre base de données pour permettre la gestion centralisée des informations de votre organisation. Elle est sûre et n'affecte aucune donnée existante. Aucun backup n'est requis."
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Table `organization_profile` ajoutée.
          - Storage Bucket `organization_assets` ajouté.
          - Politiques RLS pour la table et le bucket ajoutées.
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes
          - Auth Requirements: Admin pour l'écriture, public pour la lecture du logo.
          
          ## Performance Impact:
          - Indexes: Clé primaire sur `id`.
          - Triggers: Aucun.
          - Estimated Impact: "Impact sur les performances négligeable."
          */

-- 1. Créer la table pour le profil de l'organisation (table singleton)
CREATE TABLE IF NOT EXISTS public.organization_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    slogan TEXT,
    mission TEXT,
    logo_url TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    accreditation_details TEXT,
    social_links JSONB,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Activer RLS pour la nouvelle table
ALTER TABLE public.organization_profile ENABLE ROW LEVEL SECURITY;

-- 3. Créer les politiques RLS
-- Permettre la lecture publique des informations du profil
CREATE POLICY "Allow public read access to organization profile"
ON public.organization_profile
FOR SELECT
USING (true);

-- Permettre aux administrateurs de mettre à jour le profil
CREATE POLICY "Allow admins to update organization profile"
ON public.organization_profile
FOR UPDATE
USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
)
WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- Permettre aux administrateurs d'insérer le profil (uniquement s'il n'existe pas)
CREATE POLICY "Allow admins to insert organization profile"
ON public.organization_profile
FOR INSERT
WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);

-- 4. Insérer une ligne par défaut si la table est vide
-- Cela garantit qu'il y a toujours une ligne à METTRE À JOUR.
CREATE OR REPLACE FUNCTION insert_default_organization_profile()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.organization_profile) THEN
    INSERT INTO public.organization_profile (name) VALUES ('Go2Skul Education Group');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Exécuter la fonction pour s'assurer que la ligne par défaut existe.
SELECT insert_default_organization_profile();


-- 5. Créer le bucket de stockage pour les actifs de l'organisation (logo)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('organization_assets', 'organization_assets', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- 6. Politiques RLS pour le bucket de stockage
-- Permettre la lecture publique des fichiers du bucket
CREATE POLICY "Allow public read access on organization_assets"
ON storage.objects FOR SELECT
USING ( bucket_id = 'organization_assets' );

-- Permettre aux administrateurs d'insérer, mettre à jour et supprimer des fichiers
CREATE POLICY "Allow admin full access on organization_assets"
ON storage.objects FOR ALL
USING (
    bucket_id = 'organization_assets' AND
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
)
WITH CHECK (
    bucket_id = 'organization_assets' AND
    auth.uid() IN (SELECT user_id FROM public.admin_users WHERE is_active = true)
);
