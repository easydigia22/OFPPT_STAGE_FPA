-- ============================================================
-- VIDER TOUTES LES DONNÉES FICTIVES — SuiviStagr FPA
-- Exécuter dans : Supabase Dashboard → SQL Editor
-- ATTENTION : supprime toutes les données sauf les docs réglementaires
-- ============================================================

TRUNCATE TABLE messages_discussion     RESTART IDENTITY CASCADE;
TRUNCATE TABLE audit_records           RESTART IDENTITY CASCADE;
TRUNCATE TABLE fiches_m01              RESTART IDENTITY CASCADE;
TRUNCATE TABLE visites                 RESTART IDENTITY CASCADE;
TRUNCATE TABLE stages                  RESTART IDENTITY CASCADE;
TRUNCATE TABLE indemnisations_efp      RESTART IDENTITY CASCADE;
TRUNCATE TABLE plannings_annuels       RESTART IDENTITY CASCADE;
TRUNCATE TABLE affectations_fpa        RESTART IDENTITY CASCADE;
TRUNCATE TABLE profiles                RESTART IDENTITY CASCADE;
-- Les regulatory_docs sont conservés (documents officiels FPA)

SELECT 'Toutes les données fictives ont été supprimées.' AS resultat;
