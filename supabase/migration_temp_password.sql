-- ============================================================
-- MIGRATION : Ajout champs mot de passe provisoire
-- Exécuter dans : Supabase Dashboard → SQL Editor
-- ============================================================

-- Ajouter la colonne temp_password (mot de passe provisoire, texte en clair)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS temp_password TEXT DEFAULT NULL;

-- Ajouter la colonne password_changed (indique si le stagiaire a changé son mdp)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS password_changed BOOLEAN DEFAULT FALSE;

-- Vérification
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('temp_password', 'password_changed');
