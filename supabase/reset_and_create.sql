-- ============================================================
-- RESET COMPLET + RECRÉATION — À exécuter dans Supabase SQL Editor
-- ⚠️ Supprime toutes les données existantes
-- ============================================================

-- 1. Supprimer les tables si elles existent
DROP TABLE IF EXISTS indemnisations_efp CASCADE;
DROP TABLE IF EXISTS messages_discussion CASCADE;
DROP TABLE IF EXISTS plannings_annuels CASCADE;
DROP TABLE IF EXISTS affectations_fpa CASCADE;
DROP TABLE IF EXISTS regulatory_docs CASCADE;
DROP TABLE IF EXISTS fiches_m01 CASCADE;
DROP TABLE IF EXISTS audit_records CASCADE;
DROP TABLE IF EXISTS visites CASCADE;
DROP TABLE IF EXISTS stages CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. Recréer toutes les tables

CREATE TABLE profiles (
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

CREATE TABLE stages (
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

CREATE TABLE visites (
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

CREATE TABLE audit_records (
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

CREATE TABLE fiches_m01 (
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

CREATE TABLE regulatory_docs (
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

CREATE TABLE affectations_fpa (
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

CREATE TABLE plannings_annuels (
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

CREATE TABLE messages_discussion (
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

CREATE TABLE indemnisations_efp (
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

-- 3. Désactiver RLS (mode démo — activer + configurer en production)
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

-- ============================================================
-- 4. SEED — Données de démonstration
-- ============================================================

INSERT INTO profiles (id, email, name, role, cni, telephone, efp, direction_regionale, matricule, filiere, groupe) VALUES
('user-stagiaire-1', 'youssef.kadiri@stagiaire-ofppt.ma', 'Youssef KADIRI', 'stagiaire',
 'BE892143', '+212 661-234567', 'ISFO Casablanca (Sidi Maârouf)', 'DR Casablanca-Settat',
 NULL, 'Développement Digital (Full-Stack)', 'DEV201'),
('user-formateur-1', 'm.elalami@ofppt.ma', 'Mohammed EL ALAMI', 'formateur',
 'BJ451920', '+212 662-345678', 'ISFO Casablanca (Sidi Maârouf)', 'DR Casablanca-Settat',
 '14582', 'Développement Digital (Full-Stack)', 'DEV201 / DEV202'),
('user-efp-1', 'd.tazi@ofppt.ma', 'Driss TAZI', 'efp',
 'BK298104', '+212 663-456789', 'ISFO Casablanca (Sidi Maârouf)', 'DR Casablanca-Settat',
 '09841', NULL, NULL),
('user-dr-1', 'a.bencheikh@ofppt.ma', 'Amina BENCHEIKH', 'dr',
 'BL102943', '+212 664-567890', 'Direction Régionale Casablanca-Settat', 'DR Casablanca-Settat',
 '05214', NULL, NULL);

INSERT INTO stages (id, stagiaire_id, stagiaire_name, stagiaire_cni, stagiaire_telephone, filiere, groupe, annee, niveau, mode, optimise, entreprise, tuteur, formateur_id, formateur_name, efp, direction_regionale, date_debut, date_fin, duree_heures, missions, statut, date_creation, contrat_signe_nom_fichier, contrat_signe_date_depot, contrat_signe_validation_formateur, note_evaluation, appreciation_entreprise) VALUES
('stage-101', 'user-stagiaire-1', 'Youssef KADIRI', 'BE892143', '+212 661-234567',
 'Développement Digital', 'DEV201', '2A', 'TS', 'FPA', TRUE,
 '{"nom":"Capgemini Maroc (Nearshore)","ville":"Casablanca","adresse":"Casanearshore Park, Shore 13, Sidi Maârouf","secteur":"Technologies de l''Information & Digital","rc_patente":"RC 184920 - Patente 3728190","telephone":"+212 522-998800"}',
 '{"nom":"BENNANI","prenom":"Karim","fonction":"Lead Tech Full-Stack & Tuteur Entreprise","telephone":"+212 661-987654","email":"karim.bennani@capgemini.com"}',
 'user-formateur-1', 'Mohammed EL ALAMI', 'ISFO Casablanca (Sidi Maârouf)', 'DR Casablanca-Settat',
 '2026-01-15', '2026-06-30', 800,
 'Participation au développement d''applications web réactives avec React, TypeScript et Node.js.',
 'visite_2', '2026-01-08',
 'Contrat_FPA_Signe_Capgemini_KADIRI.pdf', '2026-01-12 11:20', TRUE, 18.5,
 'Stagiaire très impliqué, autonome et respectueux des normes de qualité logicielle.'),
('stage-102', 'stagiaire-salma', 'Salma EL AMRANI', 'BK654321', '+212 662-778899',
 'Développement Digital', 'DEV201', '2A', 'TS', 'FPA', TRUE,
 '{"nom":"Intelcia IT Solutions","ville":"Casablanca","adresse":"Bd Sidi Mohamed Ben Abdellah, Marina","secteur":"Services Numériques","rc_patente":"RC 214530","telephone":"+212 520-404040"}',
 '{"nom":"CHRAIBI","prenom":"Hanae","fonction":"Chef de projet applicatif","telephone":"+212 663-112233","email":"hanae.chraibi@intelcia.com"}',
 'user-formateur-1', 'Mohammed EL ALAMI', 'ISFO Casablanca (Sidi Maârouf)', 'DR Casablanca-Settat',
 '2026-01-15', '2026-06-30', 800,
 'Conception UI/UX, développement composants front-end Tailwind CSS et documentation technique.',
 'visite_1', '2026-01-10', 'Contrat_Intelcia_ELAMRANI.pdf', '2026-01-14 09:15', TRUE, NULL, NULL),
('stage-103', 'stagiaire-hamza', 'Hamza NACIRI', 'BH784912', '+212 663-889900',
 'Développement Digital', 'DEV201', '2A', 'TS', 'FPA', FALSE,
 '{"nom":"Leyton Maroc","ville":"Casablanca","adresse":"Zénith Millenium, Sidi Maârouf","secteur":"Conseil & Ingénierie Logicielle","telephone":"+212 522-876543"}',
 '{"nom":"IDRISSI","prenom":"Omar","fonction":"Scrum Master / Senior Engineer","telephone":"+212 664-334455","email":"o.idrissi@leyton.com"}',
 'user-formateur-1', 'Mohammed EL ALAMI', 'ISFO Casablanca (Sidi Maârouf)', 'DR Casablanca-Settat',
 '2026-02-01', '2026-06-30', 800,
 'Assistance au déploiement CI/CD, maintenance corrective des applications internes.',
 'valide_formateur', '2026-01-20', 'Contrat_Leyton_NACIRI.pdf', '2026-01-25 15:40', TRUE, NULL, NULL),
('stage-104', 'stagiaire-meriem', 'Meriem TAZI', 'BW541298', '+212 665-223344',
 'Gestion des Entreprises', 'GE201', '2A', 'TS', 'FPA', TRUE,
 '{"nom":"Attijariwafa bank (Siège)","ville":"Casablanca","adresse":"2, Bd Moulay Youssef","secteur":"Banque & Assurance","telephone":"+212 522-298888"}',
 '{"nom":"SAIDI","prenom":"Rachid","fonction":"Responsable Contrôle de Gestion","telephone":"+212 661-554433","email":"r.saidi@attijariwafa.com"}',
 'formateur-hassan', 'Hassan BOUZID', 'ISFO Casablanca (Sidi Maârouf)', 'DR Casablanca-Settat',
 '2026-01-15', '2026-06-30', 800,
 'Analyse financière préliminaire, saisie des opérations comptables et réconciliation bancaire.',
 'visite_2', '2026-01-09', 'Contrat_AWB_MeriemTAZI.pdf', '2026-01-13 16:10', TRUE, NULL, NULL),
('stage-105', 'stagiaire-amine', 'Amine CHERKAOUI', 'BV456789', '+212 666-445566',
 'Génie Électromécanique', 'GEM201', '2A', 'T', 'FPA', TRUE,
 '{"nom":"Safran Nacelles Morroco","ville":"Nouaceur","adresse":"Midparc Aéropole, Nouaceur","secteur":"Aéronautique & Industrie","telephone":"+212 522-536000"}',
 '{"nom":"MEKOUAR","prenom":"Tariq","fonction":"Responsable Ligne Maintenance Aéronautique","telephone":"+212 662-998877","email":"tariq.mekouar@safrangroup.com"}',
 'formateur-khalid', 'Khalid ZOUHIR', 'CFMA (Métiers Aéronautiques - Nouaceur)', 'DR Casablanca-Settat',
 '2026-01-15', '2026-06-30', 800,
 'Maintenance préventive des outillages, contrôle dimensionnel des bâtis d''assemblage nacelles.',
 'visite_2', '2026-01-05', 'Contrat_Safran_AmineC.pdf', '2026-01-10 10:00', TRUE, NULL, NULL);

INSERT INTO visites (id, stage_id, stagiaire_id, stagiaire_name, stagiaire_cni, formateur_id, formateur_matricule, formateur_name, efp, direction_regionale, filiere, groupe, numero_visite, date_prevue, date_effectuee, entreprise_nom, ville, tuteur_present, tuteur_nom, tuteur_emargement, formateur_emargement, objectifs_evalues, assidusite_stagiaire, observations, statut, audite_par_efp, audit_efp_date, audit_efp_conformite, audit_efp_observations, audite_par_dr, audit_dr_date, audit_dr_conformite, audit_dr_observations) VALUES
('vis-101-1', 'stage-101', 'user-stagiaire-1', 'Youssef KADIRI', 'BE892143',
 'user-formateur-1', '14582', 'Mohammed EL ALAMI', 'ISFO Casablanca (Sidi Maârouf)', 'DR Casablanca-Settat',
 'Développement Digital', 'DEV201', 1, '2026-02-18', '2026-02-18',
 'Capgemini Maroc (Nearshore)', 'Casablanca', TRUE, 'BENNANI Karim', TRUE, TRUE,
 'Intégration dans l''équipe Scrum, prise en main du repository GitHub.',
 'Excellente', 'Très bon démarrage. Assimilation de l''architecture logicielle.',
 'auditee_dr', TRUE, '2026-02-24', TRUE,
 'Vérification téléphonique avec M. Bennani. Présence confirmée.',
 TRUE, '2026-03-02', TRUE, 'Contrôle qualité DR conforme. Justificatif M01 bien cacheté.'),
('vis-101-2', 'stage-101', 'user-stagiaire-1', 'Youssef KADIRI', 'BE892143',
 'user-formateur-1', '14582', 'Mohammed EL ALAMI', 'ISFO Casablanca (Sidi Maârouf)', 'DR Casablanca-Settat',
 'Développement Digital', 'DEV201', 2, '2026-04-10', '2026-04-10',
 'Capgemini Maroc (Nearshore)', 'Casablanca', TRUE, 'BENNANI Karim', TRUE, TRUE,
 'Évaluation des réalisations techniques front & back-end, rendu du livret.',
 'Excellente', 'Bilan très satisfaisant. Proposition de pré-embauche envisagée.',
 'auditee_efp', TRUE, '2026-04-15', TRUE,
 'Visite auditée par le Directeur Pédagogique M. Tazi.',
 NULL, NULL, NULL, NULL),
('vis-102-1', 'stage-102', 'stagiaire-salma', 'Salma EL AMRANI', 'BK654321',
 'user-formateur-1', '14582', 'Mohammed EL ALAMI', 'ISFO Casablanca (Sidi Maârouf)', 'DR Casablanca-Settat',
 'Développement Digital', 'DEV201', 1, '2026-02-25', '2026-02-25',
 'Intelcia IT Solutions', 'Casablanca', TRUE, 'CHRAIBI Hanae', TRUE, TRUE,
 'Vérification de l''adéquation des tâches avec le référentiel FPA.',
 'Bonne', 'Bonne intégration. Tâches conformes au découpage.', 'validee_efp',
 FALSE, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('vis-104-1', 'stage-104', 'stagiaire-meriem', 'Meriem TAZI', 'BW541298',
 'formateur-hassan', '18930', 'Hassan BOUZID', 'ISFO Casablanca (Sidi Maârouf)', 'DR Casablanca-Settat',
 'Gestion des Entreprises', 'GE201', 1, '2026-02-20', '2026-02-20',
 'Attijariwafa bank (Siège)', 'Casablanca', TRUE, 'SAIDI Rachid', TRUE, TRUE,
 'Vérification de la ponctualité et des premières missions en comptabilité.',
 'Excellente', 'Excellents retours de la hiérarchie bancaire.', 'auditee_efp',
 TRUE, '2026-02-28', TRUE, 'Audit téléphonique favorable avec le tuteur AWB.',
 NULL, NULL, NULL, NULL),
('vis-105-1', 'stage-105', 'stagiaire-amine', 'Amine CHERKAOUI', 'BV456789',
 'formateur-khalid', '21045', 'Khalid ZOUHIR', 'CFMA (Métiers Aéronautiques - Nouaceur)', 'DR Casablanca-Settat',
 'Génie Électromécanique', 'GEM201', 1, '2026-02-12', '2026-02-12',
 'Safran Nacelles Morroco', 'Nouaceur', TRUE, 'MEKOUAR Tariq', TRUE, TRUE,
 'Respect strict des règles HSE aéronautiques.',
 'Excellente', 'Parfaite tenue de travail et habilitation validée.', 'auditee_dr',
 TRUE, NULL, NULL, NULL, TRUE, '2026-02-27', TRUE, NULL);

INSERT INTO audit_records (id, type_audit, date_audit, auditeur_id, auditeur_nom, visite_id, formateur_matricule, formateur_nom, stagiaire_nom, entreprise_nom, ville, mode_controle, statut_conformite, observations) VALUES
('audit-efp-1', 'EFP', '2026-02-24', 'user-efp-1', 'Driss TAZI (Dir. Pédagogique)',
 'vis-101-1', '14582', 'Mohammed EL ALAMI', 'Youssef KADIRI',
 'Capgemini Maroc (Nearshore)', 'Casablanca', 'Téléphone', 'Conforme',
 'Échange avec M. Bennani. Confirmation de la visite du formateur le 18/02.'),
('audit-efp-2', 'EFP', '2026-02-28', 'user-efp-1', 'Driss TAZI (Dir. Pédagogique)',
 'vis-104-1', '18930', 'Hassan BOUZID', 'Meriem TAZI',
 'Attijariwafa bank (Siège)', 'Casablanca', 'Téléphone', 'Conforme',
 'Conforme aux plannings de déplacement du formateur.'),
('audit-dr-1', 'DR', '2026-03-02', 'user-dr-1', 'Amina BENCHEIKH (Coordonnatrice DR FPA)',
 'vis-101-1', '14582', 'Mohammed EL ALAMI', 'Youssef KADIRI',
 'Capgemini Maroc (Nearshore)', 'Casablanca', 'Terrain', 'Conforme',
 'Échantillon régional 20% vérifié. Cachet de Capgemini certifié sur M01.'),
('audit-dr-2', 'DR', '2026-02-27', 'user-dr-1', 'Amina BENCHEIKH (Coordonnatrice DR FPA)',
 'vis-105-1', '21045', 'Khalid ZOUHIR', 'Amine CHERKAOUI',
 'Safran Nacelles Morroco', 'Nouaceur', 'Terrain', 'Conforme',
 'Visite inopinée à Midparc. Registre signé et émargé.');

INSERT INTO fiches_m01 (id, formateur_id, formateur_nom, groupe, filiere, mois, nom_fichier, date_televersement, cachet_entreprise_present, statut) VALUES
('fiche-m01-1', 'user-formateur-1', 'Mohammed EL ALAMI', 'DEV201', 'Développement Digital',
 '2026-03', 'Imprime_M01_DEV201_Signe_Capgemini_Mars2026.pdf', '2026-04-03 16:45', TRUE, 'valide');

INSERT INTO regulatory_docs (id, titre, reference, description, categorie, date_publication, fichier_nom, taille_mo, est_telechargeable, cible) VALUES
('doc-guide-metho', 'Guide Méthodologique de la Formation Professionnelle Alternée (FPA)',
 'Réf: OFP/DF/DECQ/N°835/2025',
 'Document officiel définissant les modalités d''organisation et d''évaluation des stagiaires.',
 'guide', '2025-11-21', 'Guide_Methodologique_FPA_OFPPT_2025.pdf', '3.4 Mo', TRUE,
 '["all","formateur","efp","dr","stagiaire"]'),
('doc-indemnisation-drh', 'Démarche d''indemnisation des formateurs pour le suivi en entreprise',
 'Réf: OFP/DRH/DAA/SP n°32/2017',
 'Procédure de contrôle, d''audit (échantillon min 20%) et de calcul des indemnités.',
 'note_service', '2017-04-17', 'Demarche_Indemnisation_Suivi_Stages_Note32.pdf', '1.8 Mo', TRUE,
 '["formateur","efp","dr"]'),
('doc-contrat-stage', 'Contrat de Stage FPA officiel (OFPPT / Entreprise / Stagiaire)',
 'Conforme Loi 36.96 et Décret 2-97-666',
 'Contrat tripartite réglementant la période d''immersion professionnelle.',
 'modele_officiel', '2025-09-01', 'Contrat_de_Stage_FPA_Officiel_OFPPT.pdf', '0.8 Mo', TRUE,
 '["all","stagiaire","formateur","efp"]'),
('doc-demande-stage', 'Demande Officielle de Stage en Entreprise (FPA)',
 'Formulaire Direction EFP - Année 2025/2026',
 'Lettre d''introduction de l''EFP pour la prospection des entreprises partenaires.',
 'modele_officiel', '2025-09-01', 'Demande_Officielle_Stage_FPA.pdf', '0.4 Mo', TRUE,
 '["all","stagiaire","efp"]'),
('doc-assurance-stage', 'Contrat et Attestation d''Assurance Responsabilité Civile & Accidents',
 'Police d''assurance groupe OFPPT N°8920/AXA',
 'Couverture légale obligatoire des stagiaires lors des déplacements en entreprise.',
 'modele_officiel', '2025-09-01', 'Attestation_Assurance_Stage_OFPPT.pdf', '0.6 Mo', TRUE,
 '["all","stagiaire","efp"]'),
('doc-decoupage-dd', 'Découpage du Programme FPA - Filière Développement Digital (800h)',
 'Schéma N°1 - Nouveau cursus - Annexe 1',
 'Planification alternée école/entreprise : 50% de la masse horaire en entreprise.',
 'decoupage', '2025-10-15', 'Decoupage_Programme_FPA_DevDigital_800h.pdf', '1.2 Mo', TRUE,
 '["formateur","efp","dr"]');

INSERT INTO affectations_fpa (id, formateur_id, formateur_matricule, formateur_nom, efp, filiere, groupe, annee, effectif_stagiaires, decoupage_nom_fichier, date_affectation) VALUES
('aff-1', 'user-formateur-1', '14582', 'Mohammed EL ALAMI', 'ISFO Casablanca (Sidi Maârouf)',
 'Développement Digital', 'DEV201', '2A', 24, 'Decoupage_FPA_DEV201_800h.pdf', '2025-09-15'),
('aff-2', 'user-formateur-1', '14582', 'Mohammed EL ALAMI', 'ISFO Casablanca (Sidi Maârouf)',
 'Développement Digital', 'DEV202', '2A', 22, 'Decoupage_FPA_DEV202_800h.pdf', '2025-09-15'),
('aff-3', 'formateur-hassan', '18930', 'Hassan BOUZID', 'ISFO Casablanca (Sidi Maârouf)',
 'Gestion des Entreprises', 'GE201', '2A', 28, 'Decoupage_FPA_GE201_800h.pdf', '2025-09-15');

INSERT INTO plannings_annuels (id, efp, annee_scolaire, filiere, session, date_debut, date_fin, nb_stagiaires_prevus, heures_entreprise, statut) VALUES
('plan-1', 'ISFO Casablanca (Sidi Maârouf)', '2025/2026', 'Développement Digital (2A)',
 'Session Principale Janvier-Juin', '2026-01-15', '2026-06-30', 46, 800, 'Actif'),
('plan-2', 'ISFO Casablanca (Sidi Maârouf)', '2025/2026', 'Gestion des Entreprises (2A)',
 'Session Principale Janvier-Juin', '2026-01-15', '2026-06-30', 28, 800, 'Actif'),
('plan-3', 'CFMA (Nouaceur)', '2025/2026', 'Génie Électromécanique Aéro (2A)',
 'Session Alternée Continue', '2026-01-05', '2026-06-30', 35, 800, 'Actif');

INSERT INTO messages_discussion (id, expediteur_id, expediteur_nom, expediteur_role, destinataire_id, destinataire_nom, destinataire_role, sujet, contenu, date_envoi, lu) VALUES
('msg-1', 'user-formateur-1', 'Mohammed EL ALAMI (Formateur)', 'formateur',
 'user-stagiaire-1', 'Youssef KADIRI', 'stagiaire',
 'Préparation de la 2ème visite de stage à Capgemini',
 'Bonjour Youssef, j''ai programmé ma deuxième visite pour ce vendredi à 14h30 chez Capgemini.',
 '2026-04-08 10:15', TRUE),
('msg-2', 'user-stagiaire-1', 'Youssef KADIRI (Stagiaire)', 'stagiaire',
 'user-formateur-1', 'Mohammed EL ALAMI', 'formateur',
 'Re: Préparation de la 2ème visite de stage à Capgemini',
 'Bonjour Monsieur, c''est bien noté. M. Bennani a confirmé sa disponibilité.',
 '2026-04-08 11:40', TRUE),
('msg-3', 'user-efp-1', 'Driss TAZI (Direction EFP)', 'efp',
 'user-formateur-1', 'Mohammed EL ALAMI', 'formateur',
 'Rappel dépôt Imprimé M04 et M01 - Échéance 05 du mois',
 'Chers formateurs, la transmission des fiches M01 cachetées doit nous parvenir avant le 05.',
 '2026-04-02 09:00', TRUE),
('msg-4', 'user-dr-1', 'Amina BENCHEIKH (Direction Régionale)', 'dr',
 'user-efp-1', 'Driss TAZI (Direction EFP)', 'efp',
 'Validation de l''état d''indemnisation M05 & planning d''audit M03',
 'Bonjour M. Tazi, nous avons bien réceptionné le rapport M02 et l''état M05 de l''ISFO.',
 '2026-04-05 15:20', FALSE);

INSERT INTO indemnisations_efp (matricule, nom_prenom, efp, filiere, groupe, effectif_stagiaires, nombre_visites_v1, nombre_visites_v2, nombre_visites_total, taux_indemnite_unitaire, montant_total_brut, statut_audit_efp, statut_validation) VALUES
('14582', 'Mohammed EL ALAMI', 'ISFO Casablanca (Sidi Maârouf)', 'Développement Digital', 'DEV201',
 24, 24, 18, 42, 80, 3360, 'Conforme', 'Validé EFP'),
('18930', 'Hassan BOUZID', 'ISFO Casablanca (Sidi Maârouf)', 'Gestion des Entreprises', 'GE201',
 28, 28, 24, 52, 80, 4160, 'Conforme', 'Validé EFP'),
('21045', 'Khalid ZOUHIR', 'CFMA (Métiers Aéronautiques - Nouaceur)', 'Génie Électromécanique', 'GEM201',
 35, 35, 35, 70, 80, 5600, 'Conforme', 'Validé EFP');
