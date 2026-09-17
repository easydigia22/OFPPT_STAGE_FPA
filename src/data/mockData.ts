import {
  UserProfile,
  Stage,
  Visite,
  AuditRecord,
  RegulatoryDoc,
  AffectationFPA,
  PlanningAnnuel,
  MessageDiscussion,
  FicheM01Uploaded
} from '../types';

// Toutes les données fictives supprimées — l'app démarre vide et nécessite une connexion réelle.

export const INITIAL_USERS: UserProfile[] = [];

export const REGULATORY_DOCUMENTS: RegulatoryDoc[] = [
  {
    id: 'doc-guide-metho',
    titre: 'Guide Méthodologique de la Formation Professionnelle Alternée (FPA)',
    reference: 'Réf: OFP/DF/DECQ/N°835/2025',
    description: 'Document officiel définissant les modalités d\'organisation, de découpage de programme et d\'évaluation des stagiaires en entreprise.',
    categorie: 'guide',
    datePublication: '2025-11-21',
    fichierNom: 'Guide_Methodologique_FPA_OFPPT_2025.pdf',
    tailleMo: '3.4 Mo',
    estTelechargeable: true,
    cible: ['all', 'formateur', 'efp', 'dr', 'stagiaire']
  },
  {
    id: 'doc-indemnisation-drh',
    titre: 'Démarche d\'indemnisation des formateurs pour les actions de suivi en entreprise',
    reference: 'Réf: OFP/DRH/DAA/SP n°32/2017',
    description: 'Procédure formelle de contrôle, d\'audit (échantillon min 20%) et de calcul des indemnités de déplacement aux entreprises d\'accueil.',
    categorie: 'note_service',
    datePublication: '2017-04-17',
    fichierNom: 'Demarche_Indemnisation_Suivi_Stages_Note32.pdf',
    tailleMo: '1.8 Mo',
    estTelechargeable: true,
    cible: ['formateur', 'efp', 'dr']
  },
  {
    id: 'doc-contrat-stage',
    titre: 'Contrat de Stage FPA officiel (OFPPT / Entreprise d\'accueil / Stagiaire)',
    reference: 'Conforme Loi 36.96 et Décret 2-97-666',
    description: 'Contrat tripartite réglementant la période d\'immersion professionnelle, obligations réciproques, tuteur désigné et horaires.',
    categorie: 'modele_officiel',
    datePublication: '2025-09-01',
    fichierNom: 'Contrat_de_Stage_FPA_Officiel_OFPPT.pdf',
    tailleMo: '0.8 Mo',
    estTelechargeable: true,
    cible: ['all', 'stagiaire', 'formateur', 'efp'],
    fileUrls: ['/docs/contrat%20stage%20page%201.jpeg', '/docs/contrat%20stage%20page%202.jpeg'],
  },
  {
    id: 'doc-demande-stage',
    titre: 'Demande Officielle de Stage en Entreprise (FPA)',
    reference: 'Formulaire Direction EFP - Année 2025/2026',
    description: 'Lettre d\'introduction et de recommandation de l\'EFP pour la prospection et l\'accueil des stagiaires par les entreprises partenaires.',
    categorie: 'modele_officiel',
    datePublication: '2025-09-01',
    fichierNom: 'Demande_Officielle_Stage_FPA.pdf',
    tailleMo: '0.4 Mo',
    estTelechargeable: true,
    cible: ['all', 'stagiaire', 'efp'],
  },
  {
    id: 'doc-assurance-stage',
    titre: 'Contrat et Attestation d\'Assurance Responsabilité Civile & Accidents',
    reference: 'Police d\'assurance groupe OFPPT N°8920/AXA',
    description: 'Couverture légale obligatoire des stagiaires de l\'OFPPT lors des déplacements et de leur séjour au sein de l\'entreprise d\'accueil.',
    categorie: 'modele_officiel',
    datePublication: '2025-09-01',
    fichierNom: 'Attestation_Assurance_Stage_OFPPT.pdf',
    tailleMo: '0.6 Mo',
    estTelechargeable: true,
    cible: ['all', 'stagiaire', 'efp'],
    fileUrls: ['/docs/attestation%20assurance%202025.pdf'],
  },
  {
    id: 'doc-decoupage-dd',
    titre: 'Découpage du Programme FPA - Filière Développement Digital (800h)',
    reference: 'Schéma N°1 - Nouveau cursus - Annexe 1',
    description: 'Planification alternée école / entreprise : 50% de la masse horaire des modules métiers réalisée en entreprise (septembre N-1 à mai N).',
    categorie: 'decoupage',
    datePublication: '2025-10-15',
    fichierNom: 'Decoupage_Programme_FPA_DevDigital_800h.pdf',
    tailleMo: '1.2 Mo',
    estTelechargeable: true,
    cible: ['formateur', 'efp', 'dr']
  }
];

export const INITIAL_STAGES: Stage[] = [];
export const INITIAL_VISITES: Visite[] = [];
export const INITIAL_AUDITS: AuditRecord[] = [];
export const INITIAL_AFFECTATIONS: AffectationFPA[] = [];
export const INITIAL_PLANNINGS: PlanningAnnuel[] = [];
export const INITIAL_MESSAGES: MessageDiscussion[] = [];
export const INITIAL_FICHES_M01: FicheM01Uploaded[] = [];
export const INITIAL_INDEMNISATIONS_EFP: any[] = [];

export const mockUsers = INITIAL_USERS;
export const mockStages = INITIAL_STAGES;
export const mockVisites = INITIAL_VISITES;
export const mockAudits = INITIAL_AUDITS;
export const mockFichesM01 = INITIAL_FICHES_M01;
export const mockMessages = INITIAL_MESSAGES;
export const mockRegulatoryDocs = REGULATORY_DOCUMENTS;
export const mockAffectations = INITIAL_AFFECTATIONS;
export const mockPlannings = INITIAL_PLANNINGS;
export const mockIndemnisationsEfp = INITIAL_INDEMNISATIONS_EFP;
