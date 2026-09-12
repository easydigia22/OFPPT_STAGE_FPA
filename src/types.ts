export type UserRole = 'stagiaire' | 'formateur' | 'efp' | 'dr';

export type FormationMode = 'FPA' | 'Résidentiel';
export type NiveauFormation = 'S' | 'Q' | 'T' | 'TS'; // Spécialisation, Qualification, Technicien, Technicien Spécialisé
export type AnneeFormation = '1A' | '2A';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  cni: string;
  telephone: string;
  efp: string; // E.g. "ISFO Casablanca"
  directionRegionale: string; // E.g. "DR Casablanca-Settat"
  matricule?: string; // For formateurs and staff
  filiere?: string; // For stagiaires / formateurs
  groupe?: string; // For stagiaires (ex: "DEV201")
  avatarUrl?: string;
  cvFileName?: string;
  cvUploadedAt?: string;
  cvFileContent?: string;
  tempPassword?: string;   // mot de passe provisoire (premier login)
  passwordChanged?: boolean; // false = doit changer au prochain login
}

export type StageStatus = 
  | 'en_recherche'
  | 'depose'
  | 'valide_formateur'
  | 'rejete_formateur'
  | 'visite_1'
  | 'visite_2'
  | 'termine'
  | 'evalue';

export interface Stage {
  id: string;
  stagiaireId: string;
  stagiaireName: string;
  stagiaireCni: string;
  stagiaireTelephone: string;
  filiere: string;
  groupe: string;
  annee: AnneeFormation;
  niveau: NiveauFormation;
  mode: FormationMode;
  optimise: boolean;
  
  // Entreprise d'accueil
  entreprise: {
    nom: string;
    ville: string;
    adresse: string;
    secteur: string;
    rc_patente?: string;
    telephone: string;
  };

  // Tuteur en entreprise
  tuteur: {
    nom: string;
    prenom: string;
    fonction: string;
    telephone: string;
    email: string;
  };

  formateurId: string;
  formateurName: string;
  efp: string;
  directionRegionale: string;

  dateDebut: string;
  dateFin: string;
  dureeHeures: number; // e.g. 800h ou 1120h
  missions: string;
  
  statut: StageStatus;
  dateCreation: string;

  // Documents associés
  contratSigneNomFichier?: string;
  contratSigneDateDepot?: string;
  contratSigneValidationFormateur?: boolean;

  // Evaluation
  noteEvaluation?: number;
  appreciationEntreprise?: string;
}

export type VisiteStatus = 'planifiee' | 'effectuee' | 'validee_efp' | 'auditee_efp' | 'auditee_dr' | 'rejetee';

export interface Visite {
  id: string;
  stageId: string;
  stagiaireId: string;
  stagiaireName: string;
  stagiaireCni: string;
  formateurId: string;
  formateurMatricule: string;
  formateurName: string;
  efp: string;
  directionRegionale: string;
  filiere: string;
  groupe: string;

  numeroVisite: 1 | 2; // 1ère V ou 2ème V
  datePrevue: string;
  dateEffectuee?: string;
  entrepriseNom: string;
  ville: string;

  tuteurPresent: boolean;
  tuteurNom?: string;
  tuteurEmargement: boolean; // Signé et cacheté
  formateurEmargement: boolean;

  objectifsEvalues: string;
  assiduiteStagiaire: 'Excellente' | 'Bonne' | 'Moyenne' | 'Insuffisante';
  observations: string;
  statut: VisiteStatus;

  // Traçabilité Audit
  auditeParEfp?: boolean;
  auditEfpDate?: string;
  auditEfpConformite?: boolean;
  auditEfpObservations?: string;

  auditeParDr?: boolean;
  auditDrDate?: string;
  auditDrConformite?: boolean;
  auditDrObservations?: string;
}

export interface AuditRecord {
  id: string;
  typeAudit: 'EFP' | 'DR';
  dateAudit: string;
  auditeurId: string;
  auditeurNom: string;
  visiteId: string;
  formateurMatricule: string;
  formateurNom: string;
  stagiaireNom: string;
  entrepriseNom: string;
  ville: string;
  modeControle: 'Terrain' | 'Téléphone';
  statutConformite: 'Conforme' | 'Non Conforme' | 'À clarifier';
  observations: string;
}

export interface FicheM01Uploaded {
  id: string;
  formateurId: string;
  formateurNom: string;
  groupe: string;
  filiere: string;
  mois: string; // "2026-04"
  nomFichier: string;
  dateTeleversement: string;
  cachetEntreprisePresent: boolean;
  statut: 'en_attente_validation' | 'valide' | 'rejete';
}

export interface RegulatoryDoc {
  id: string;
  titre: string;
  reference: string;
  description: string;
  categorie: 'guide' | 'note_service' | 'modele_officiel' | 'decoupage';
  datePublication: string;
  fichierNom: string;
  tailleMo: string;
  estTelechargeable: boolean;
  cible: ('all' | 'formateur' | 'efp' | 'dr' | 'stagiaire')[];
}

export interface AffectationFPA {
  id: string;
  formateurId: string;
  formateurMatricule: string;
  formateurNom: string;
  efp: string;
  filiere: string;
  groupe: string;
  annee: AnneeFormation;
  effectifStagiaires: number;
  decoupageNomFichier?: string;
  dateAffectation: string;
}

export interface PlanningAnnuel {
  id: string;
  efp: string;
  anneeScolaire: string;
  filiere: string;
  session: string;
  dateDebut: string;
  dateFin: string;
  nbStagiairesPrevus: number;
  heuresEntreprise: number;
  statut: 'Actif' | 'En attente' | 'Clôturé';
}

export interface MessageDiscussion {
  id: string;
  expediteurId: string;
  expediteurNom: string;
  expediteurRole: UserRole;
  destinataireId: string; // ou "all", ou "groupe"
  destinataireNom: string;
  destinataireRole: UserRole | 'entreprise';
  sujet: string;
  contenu: string;
  dateEnvoi: string;
  lu: boolean;
  pieceJointeNom?: string;
}

export interface IndemnisationFormateur {
  matricule: string;
  nomPrenom: string;
  efp: string;
  filiere: string;
  groupe: string;
  effectifStagiaires: number;
  nombreVisitesV1: number;
  nombreVisitesV2: number;
  nombreVisitesTotal: number;
  tauxIndemniteUnitaire: number;
  montantTotalBrut: number;
  statutAuditEfp: 'Conforme' | 'Non conforme' | 'En attente';
  statutValidation: 'Validé EFP' | 'Validé DR' | 'En cours';
}
