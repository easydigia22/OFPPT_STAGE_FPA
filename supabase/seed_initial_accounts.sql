-- ============================================================
-- CRÉATION DES COMPTES INITIAUX — OFPPT FPA Pilot
-- Exécuter dans : Supabase Dashboard → SQL Editor
-- Personnaliser les valeurs avant d'exécuter.
-- ============================================================

-- ① DIRECTEUR EFP
INSERT INTO profiles (id, email, name, role, cni, telephone, efp, direction_regionale)
VALUES (
  'efp-001',
  'kaoutar.hamdii@ofppt.ma',          -- ← email de connexion
  'Kaoutar HAMDII',                    -- ← nom complet
  'efp',
  '',
  '',
  'ISTA NTIC Sidi Maârouf Casablanca', -- ← nom de l EFP
  'DR Casablanca-Settat'               -- ← direction régionale
)
ON CONFLICT (email) DO UPDATE SET
  id    = EXCLUDED.id,
  name  = EXCLUDED.name,
  role  = EXCLUDED.role,
  efp   = EXCLUDED.efp,
  direction_regionale = EXCLUDED.direction_regionale;


-- ② ACTEUR DR (Direction Régionale)
INSERT INTO profiles (id, email, name, role, cni, telephone, efp, direction_regionale)
VALUES (
  'dr-001',
  'dr.casablanca@ofppt.ma',            -- ← email de connexion DR
  'Directeur DR Casablanca-Settat',    -- ← nom complet du responsable DR
  'dr',
  '',
  '',
  '',
  'DR Casablanca-Settat'               -- ← direction régionale
)
ON CONFLICT (email) DO UPDATE SET
  id    = EXCLUDED.id,
  name  = EXCLUDED.name,
  role  = EXCLUDED.role,
  direction_regionale = EXCLUDED.direction_regionale;


-- ③ STAGIAIRE (exemple — normalement créé par le Directeur EFP depuis l'app)
INSERT INTO profiles (id, email, name, role, cni, telephone, efp, direction_regionale, filiere, groupe)
VALUES (
  'stg-001',
  'stagiaire1@ofppt.ma',               -- ← email du stagiaire
  'Prénom NOM Stagiaire',              -- ← nom complet du stagiaire
  'stagiaire',
  '',
  '',
  'ISTA NTIC Sidi Maârouf Casablanca',
  'DR Casablanca-Settat',
  'Développement Digital',             -- ← filière
  'DEV201'                             -- ← groupe
)
ON CONFLICT (email) DO UPDATE SET
  id      = EXCLUDED.id,
  name    = EXCLUDED.name,
  role    = EXCLUDED.role,
  filiere = EXCLUDED.filiere,
  groupe  = EXCLUDED.groupe;


-- ④ FORMATEUR (optionnel — affecter un formateur conseiller FPA)
INSERT INTO profiles (id, email, name, role, cni, telephone, efp, direction_regionale, matricule)
VALUES (
  'form-001',
  'formateur@ofppt.ma',                -- ← email du formateur
  'Formateur Conseiller FPA',          -- ← nom complet
  'formateur',
  '',
  '',
  'ISTA NTIC Sidi Maârouf Casablanca',
  'DR Casablanca-Settat',
  'MAT-12345'                          -- ← matricule OFPPT
)
ON CONFLICT (email) DO UPDATE SET
  id        = EXCLUDED.id,
  name      = EXCLUDED.name,
  role      = EXCLUDED.role,
  matricule = EXCLUDED.matricule;


SELECT id, email, name, role FROM profiles ORDER BY role;
