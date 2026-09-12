-- ============================================================
-- SUIVI STAGE FPA — Schéma de base de données Supabase
-- Exécuter dans : Supabase Dashboard → SQL Editor
-- ============================================================

-- Profiles (utilisateurs de l'application)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('stagiaire', 'formateur', 'efp', 'dr')),
  cni TEXT NOT NULL DEFAULT '',
  telephone TEXT NOT NULL DEFAULT '',
  efp TEXT NOT NULL DEFAULT '',
  direction_regionale TEXT NOT NULL DEFAULT '',
  matricule TEXT,
  filiere TEXT,
  groupe TEXT,
  avatar_url TEXT,
  cv_file_name TEXT,
  cv_uploaded_at TEXT,
  cv_file_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stages
CREATE TABLE IF NOT EXISTS stages (
  id TEXT PRIMARY KEY,
  stagiaire_id TEXT NOT NULL,
  stagiaire_name TEXT NOT NULL,
  stagiaire_cni TEXT NOT NULL DEFAULT '',
  stagiaire_telephone TEXT NOT NULL DEFAULT '',
  filiere TEXT NOT NULL,
  groupe TEXT NOT NULL,
  annee TEXT NOT NULL,
  niveau TEXT NOT NULL,
  mode TEXT NOT NULL,
  optimise BOOLEAN NOT NULL DEFAULT FALSE,
  entreprise JSONB NOT NULL DEFAULT '{}',
  tuteur JSONB NOT NULL DEFAULT '{}',
  formateur_id TEXT NOT NULL,
  formateur_name TEXT NOT NULL,
  efp TEXT NOT NULL,
  direction_regionale TEXT NOT NULL,
  date_debut TEXT NOT NULL,
  date_fin TEXT NOT NULL,
  duree_heures INTEGER NOT NULL DEFAULT 0,
  missions TEXT NOT NULL DEFAULT '',
  statut TEXT NOT NULL,
  date_creation TEXT NOT NULL,
  contrat_signe_nom_fichier TEXT,
  contrat_signe_date_depot TEXT,
  contrat_signe_validation_formateur BOOLEAN,
  note_evaluation NUMERIC,
  appreciation_entreprise TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visites de suivi
CREATE TABLE IF NOT EXISTS visites (
  id TEXT PRIMARY KEY,
  stage_id TEXT NOT NULL,
  stagiaire_id TEXT NOT NULL,
  stagiaire_name TEXT NOT NULL,
  stagiaire_cni TEXT NOT NULL DEFAULT '',
  formateur_id TEXT NOT NULL,
  formateur_matricule TEXT NOT NULL DEFAULT '',
  formateur_name TEXT NOT NULL,
  efp TEXT NOT NULL,
  direction_regionale TEXT NOT NULL,
  filiere TEXT NOT NULL,
  groupe TEXT NOT NULL,
  numero_visite INTEGER NOT NULL,
  date_prevue TEXT NOT NULL,
  date_effectuee TEXT,
  entreprise_nom TEXT NOT NULL,
  ville TEXT NOT NULL,
  tuteur_present BOOLEAN NOT NULL DEFAULT FALSE,
  tuteur_nom TEXT,
  tuteur_emargement BOOLEAN NOT NULL DEFAULT FALSE,
  formateur_emargement BOOLEAN NOT NULL DEFAULT FALSE,
  objectifs_evalues TEXT NOT NULL DEFAULT '',
  assidusite_stagiaire TEXT NOT NULL DEFAULT 'Bonne',
  observations TEXT NOT NULL DEFAULT '',
  statut TEXT NOT NULL,
  audite_par_efp BOOLEAN,
  audit_efp_date TEXT,
  audit_efp_conformite BOOLEAN,
  audit_efp_observations TEXT,
  audite_par_dr BOOLEAN,
  audit_dr_date TEXT,
  audit_dr_conformite BOOLEAN,
  audit_dr_observations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enregistrements d'audit
CREATE TABLE IF NOT EXISTS audit_records (
  id TEXT PRIMARY KEY,
  type_audit TEXT NOT NULL,
  date_audit TEXT NOT NULL,
  auditeur_id TEXT NOT NULL,
  auditeur_nom TEXT NOT NULL,
  visite_id TEXT NOT NULL,
  formateur_matricule TEXT NOT NULL,
  formateur_nom TEXT NOT NULL,
  stagiaire_nom TEXT NOT NULL,
  entreprise_nom TEXT NOT NULL,
  ville TEXT NOT NULL,
  mode_controle TEXT NOT NULL,
  statut_conformite TEXT NOT NULL,
  observations TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fiches M01 téléversées
CREATE TABLE IF NOT EXISTS fiches_m01 (
  id TEXT PRIMARY KEY,
  formateur_id TEXT NOT NULL,
  formateur_nom TEXT NOT NULL,
  groupe TEXT NOT NULL,
  filiere TEXT NOT NULL,
  mois TEXT NOT NULL,
  nom_fichier TEXT NOT NULL,
  date_televersement TEXT NOT NULL,
  cachet_entreprise_present BOOLEAN NOT NULL DEFAULT FALSE,
  statut TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents réglementaires
CREATE TABLE IF NOT EXISTS regulatory_docs (
  id TEXT PRIMARY KEY,
  titre TEXT NOT NULL,
  reference TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  categorie TEXT NOT NULL,
  date_publication TEXT NOT NULL,
  fichier_nom TEXT NOT NULL,
  taille_mo TEXT NOT NULL DEFAULT '',
  est_telechargeable BOOLEAN NOT NULL DEFAULT TRUE,
  cible JSONB NOT NULL DEFAULT '["all"]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affectations FPA
CREATE TABLE IF NOT EXISTS affectations_fpa (
  id TEXT PRIMARY KEY,
  formateur_id TEXT NOT NULL,
  formateur_matricule TEXT NOT NULL,
  formateur_nom TEXT NOT NULL,
  efp TEXT NOT NULL,
  filiere TEXT NOT NULL,
  groupe TEXT NOT NULL,
  annee TEXT NOT NULL,
  effectif_stagiaires INTEGER NOT NULL DEFAULT 0,
  decoupage_nom_fichier TEXT,
  date_affectation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plannings annuels
CREATE TABLE IF NOT EXISTS plannings_annuels (
  id TEXT PRIMARY KEY,
  efp TEXT NOT NULL,
  annee_scolaire TEXT NOT NULL,
  filiere TEXT NOT NULL,
  session TEXT NOT NULL,
  date_debut TEXT NOT NULL,
  date_fin TEXT NOT NULL,
  nb_stagiaires_prevus INTEGER NOT NULL DEFAULT 0,
  heures_entreprise INTEGER NOT NULL DEFAULT 0,
  statut TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages de discussion
CREATE TABLE IF NOT EXISTS messages_discussion (
  id TEXT PRIMARY KEY,
  expediteur_id TEXT NOT NULL,
  expediteur_nom TEXT NOT NULL,
  expediteur_role TEXT NOT NULL,
  destinataire_id TEXT NOT NULL,
  destinataire_nom TEXT NOT NULL,
  destinataire_role TEXT NOT NULL,
  sujet TEXT NOT NULL,
  contenu TEXT NOT NULL,
  date_envoi TEXT NOT NULL,
  lu BOOLEAN NOT NULL DEFAULT FALSE,
  piece_jointe_nom TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indemnisations EFP
CREATE TABLE IF NOT EXISTS indemnisations_efp (
  matricule TEXT PRIMARY KEY,
  nom_prenom TEXT NOT NULL,
  efp TEXT NOT NULL,
  filiere TEXT NOT NULL,
  groupe TEXT NOT NULL,
  effectif_stagiaires INTEGER NOT NULL DEFAULT 0,
  nombre_visites_v1 INTEGER NOT NULL DEFAULT 0,
  nombre_visites_v2 INTEGER NOT NULL DEFAULT 0,
  nombre_visites_total INTEGER NOT NULL DEFAULT 0,
  taux_indemnite_unitaire NUMERIC NOT NULL DEFAULT 0,
  montant_total_brut NUMERIC NOT NULL DEFAULT 0,
  statut_audit_efp TEXT NOT NULL,
  statut_validation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Désactiver RLS pour mode démo (activer + configurer en prod)
-- ============================================================
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE stages DISABLE ROW LEVEL SECURITY;
ALTER TABLE visites DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE fiches_m01 DISABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_docs DISABLE ROW LEVEL SECURITY;
ALTER TABLE affectations_fpa DISABLE ROW LEVEL SECURITY;
ALTER TABLE plannings_annuels DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages_discussion DISABLE ROW LEVEL SECURITY;
ALTER TABLE indemnisations_efp DISABLE ROW LEVEL SECURITY;
