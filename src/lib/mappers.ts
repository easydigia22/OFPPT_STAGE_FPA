import type {
  UserProfile, Stage, Visite, AuditRecord, FicheM01Uploaded,
  RegulatoryDoc, AffectationFPA, PlanningAnnuel, MessageDiscussion,
} from '../types';

// ─── Profile ────────────────────────────────────────────────────────
export function profileFromDB(r: any): UserProfile {
  return {
    id: r.id, email: r.email, name: r.name, role: r.role,
    cni: r.cni || '', telephone: r.telephone || '',
    efp: r.efp || '', directionRegionale: r.direction_regionale || '',
    matricule: r.matricule ?? undefined, filiere: r.filiere ?? undefined,
    groupe: r.groupe ?? undefined, avatarUrl: r.avatar_url ?? undefined,
    cvFileName: r.cv_file_name ?? undefined, cvUploadedAt: r.cv_uploaded_at ?? undefined,
    cvFileContent: r.cv_file_content ?? undefined,
    tempPassword: r.temp_password ?? undefined,
    passwordChanged: r.password_changed ?? false,
  };
}
export function profileToDB(u: UserProfile) {
  return {
    id: u.id, email: u.email, name: u.name, role: u.role,
    cni: u.cni, telephone: u.telephone, efp: u.efp,
    direction_regionale: u.directionRegionale, matricule: u.matricule ?? null,
    filiere: u.filiere ?? null, groupe: u.groupe ?? null,
    avatar_url: u.avatarUrl ?? null, cv_file_name: u.cvFileName ?? null,
    cv_uploaded_at: u.cvUploadedAt ?? null, cv_file_content: u.cvFileContent ?? null,
    temp_password: u.tempPassword ?? null,
    password_changed: u.passwordChanged ?? false,
  };
}

// ─── Stage ──────────────────────────────────────────────────────────
export function stageFromDB(r: any): Stage {
  return {
    id: r.id, stagiaireId: r.stagiaire_id, stagiaireName: r.stagiaire_name,
    stagiaireCni: r.stagiaire_cni || '', stagiaireTelephone: r.stagiaire_telephone || '',
    filiere: r.filiere, groupe: r.groupe, annee: r.annee, niveau: r.niveau,
    mode: r.mode, optimise: r.optimise, entreprise: r.entreprise, tuteur: r.tuteur,
    formateurId: r.formateur_id, formateurName: r.formateur_name, efp: r.efp,
    directionRegionale: r.direction_regionale, dateDebut: r.date_debut, dateFin: r.date_fin,
    dureeHeures: r.duree_heures, missions: r.missions || '', statut: r.statut,
    dateCreation: r.date_creation,
    contratSigneNomFichier: r.contrat_signe_nom_fichier ?? undefined,
    contratSigneDateDepot: r.contrat_signe_date_depot ?? undefined,
    contratSigneValidationFormateur: r.contrat_signe_validation_formateur ?? undefined,
    noteEvaluation: r.note_evaluation ?? undefined,
    appreciationEntreprise: r.appreciation_entreprise ?? undefined,
  };
}
export function stageToDB(s: Stage) {
  return {
    id: s.id, stagiaire_id: s.stagiaireId, stagiaire_name: s.stagiaireName,
    stagiaire_cni: s.stagiaireCni, stagiaire_telephone: s.stagiaireTelephone,
    filiere: s.filiere, groupe: s.groupe, annee: s.annee, niveau: s.niveau,
    mode: s.mode, optimise: s.optimise, entreprise: s.entreprise, tuteur: s.tuteur,
    formateur_id: s.formateurId, formateur_name: s.formateurName, efp: s.efp,
    direction_regionale: s.directionRegionale, date_debut: s.dateDebut, date_fin: s.dateFin,
    duree_heures: s.dureeHeures, missions: s.missions, statut: s.statut,
    date_creation: s.dateCreation,
    contrat_signe_nom_fichier: s.contratSigneNomFichier ?? null,
    contrat_signe_date_depot: s.contratSigneDateDepot ?? null,
    contrat_signe_validation_formateur: s.contratSigneValidationFormateur ?? null,
    note_evaluation: s.noteEvaluation ?? null,
    appreciation_entreprise: s.appreciationEntreprise ?? null,
  };
}

// ─── Visite ─────────────────────────────────────────────────────────
export function visiteFromDB(r: any): Visite {
  return {
    id: r.id, stageId: r.stage_id, stagiaireId: r.stagiaire_id,
    stagiaireName: r.stagiaire_name, stagiaireCni: r.stagiaire_cni || '',
    formateurId: r.formateur_id, formateurMatricule: r.formateur_matricule,
    formateurName: r.formateur_name, efp: r.efp, directionRegionale: r.direction_regionale,
    filiere: r.filiere, groupe: r.groupe, numeroVisite: r.numero_visite,
    datePrevue: r.date_prevue, dateEffectuee: r.date_effectuee ?? undefined,
    entrepriseNom: r.entreprise_nom, ville: r.ville, tuteurPresent: r.tuteur_present,
    tuteurNom: r.tuteur_nom ?? undefined, tuteurEmargement: r.tuteur_emargement,
    formateurEmargement: r.formateur_emargement, objectifsEvalues: r.objectifs_evalues || '',
    assiduiteStagiaire: r.assidusite_stagiaire, observations: r.observations || '',
    statut: r.statut, auditeParEfp: r.audite_par_efp ?? undefined,
    auditEfpDate: r.audit_efp_date ?? undefined, auditEfpConformite: r.audit_efp_conformite ?? undefined,
    auditEfpObservations: r.audit_efp_observations ?? undefined,
    auditeParDr: r.audite_par_dr ?? undefined, auditDrDate: r.audit_dr_date ?? undefined,
    auditDrConformite: r.audit_dr_conformite ?? undefined,
    auditDrObservations: r.audit_dr_observations ?? undefined,
  };
}
export function visiteToDB(v: Visite) {
  return {
    id: v.id, stage_id: v.stageId, stagiaire_id: v.stagiaireId,
    stagiaire_name: v.stagiaireName, stagiaire_cni: v.stagiaireCni,
    formateur_id: v.formateurId, formateur_matricule: v.formateurMatricule,
    formateur_name: v.formateurName, efp: v.efp, direction_regionale: v.directionRegionale,
    filiere: v.filiere, groupe: v.groupe, numero_visite: v.numeroVisite,
    date_prevue: v.datePrevue, date_effectuee: v.dateEffectuee ?? null,
    entreprise_nom: v.entrepriseNom, ville: v.ville, tuteur_present: v.tuteurPresent,
    tuteur_nom: v.tuteurNom ?? null, tuteur_emargement: v.tuteurEmargement,
    formateur_emargement: v.formateurEmargement, objectifs_evalues: v.objectifsEvalues,
    assidusite_stagiaire: v.assiduiteStagiaire, observations: v.observations, statut: v.statut,
    audite_par_efp: v.auditeParEfp ?? null, audit_efp_date: v.auditEfpDate ?? null,
    audit_efp_conformite: v.auditEfpConformite ?? null, audit_efp_observations: v.auditEfpObservations ?? null,
    audite_par_dr: v.auditeParDr ?? null, audit_dr_date: v.auditDrDate ?? null,
    audit_dr_conformite: v.auditDrConformite ?? null, audit_dr_observations: v.auditDrObservations ?? null,
  };
}

// ─── AuditRecord ────────────────────────────────────────────────────
export function auditFromDB(r: any): AuditRecord {
  return {
    id: r.id, typeAudit: r.type_audit, dateAudit: r.date_audit,
    auditeurId: r.auditeur_id, auditeurNom: r.auditeur_nom, visiteId: r.visite_id,
    formateurMatricule: r.formateur_matricule, formateurNom: r.formateur_nom,
    stagiaireNom: r.stagiaire_nom, entrepriseNom: r.entreprise_nom, ville: r.ville,
    modeControle: r.mode_controle, statutConformite: r.statut_conformite,
    observations: r.observations || '',
  };
}
export function auditToDB(a: AuditRecord) {
  return {
    id: a.id, type_audit: a.typeAudit, date_audit: a.dateAudit,
    auditeur_id: a.auditeurId, auditeur_nom: a.auditeurNom, visite_id: a.visiteId,
    formateur_matricule: a.formateurMatricule, formateur_nom: a.formateurNom,
    stagiaire_nom: a.stagiaireNom, entreprise_nom: a.entrepriseNom, ville: a.ville,
    mode_controle: a.modeControle, statut_conformite: a.statutConformite, observations: a.observations,
  };
}

// ─── FicheM01 ───────────────────────────────────────────────────────
export function ficheM01FromDB(r: any): FicheM01Uploaded {
  return {
    id: r.id, formateurId: r.formateur_id, formateurNom: r.formateur_nom,
    groupe: r.groupe, filiere: r.filiere, mois: r.mois, nomFichier: r.nom_fichier,
    dateTeleversement: r.date_televersement, cachetEntreprisePresent: r.cachet_entreprise_present,
    statut: r.statut,
  };
}
export function ficheM01ToDB(f: FicheM01Uploaded) {
  return {
    id: f.id, formateur_id: f.formateurId, formateur_nom: f.formateurNom,
    groupe: f.groupe, filiere: f.filiere, mois: f.mois, nom_fichier: f.nomFichier,
    date_televersement: f.dateTeleversement, cachet_entreprise_present: f.cachetEntreprisePresent,
    statut: f.statut,
  };
}

// ─── RegulatoryDoc ──────────────────────────────────────────────────
export function docFromDB(r: any): RegulatoryDoc {
  return {
    id: r.id, titre: r.titre, reference: r.reference, description: r.description || '',
    categorie: r.categorie, datePublication: r.date_publication, fichierNom: r.fichier_nom,
    tailleMo: r.taille_mo || '', estTelechargeable: r.est_telechargeable, cible: r.cible,
    fileUrls: r.file_urls ?? undefined,
  };
}
export function docToDB(d: RegulatoryDoc) {
  return {
    id: d.id, titre: d.titre, reference: d.reference, description: d.description,
    categorie: d.categorie, date_publication: d.datePublication, fichier_nom: d.fichierNom,
    taille_mo: d.tailleMo, est_telechargeable: d.estTelechargeable, cible: d.cible,
  };
}

// ─── AffectationFPA ─────────────────────────────────────────────────
export function affectationFromDB(r: any): AffectationFPA {
  return {
    id: r.id, formateurId: r.formateur_id, formateurMatricule: r.formateur_matricule,
    formateurNom: r.formateur_nom, efp: r.efp, filiere: r.filiere, groupe: r.groupe,
    annee: r.annee, effectifStagiaires: r.effectif_stagiaires,
    decoupageNomFichier: r.decoupage_nom_fichier ?? undefined, dateAffectation: r.date_affectation,
  };
}
export function affectationToDB(a: AffectationFPA) {
  return {
    id: a.id, formateur_id: a.formateurId, formateur_matricule: a.formateurMatricule,
    formateur_nom: a.formateurNom, efp: a.efp, filiere: a.filiere, groupe: a.groupe,
    annee: a.annee, effectif_stagiaires: a.effectifStagiaires,
    decoupage_nom_fichier: a.decoupageNomFichier ?? null, date_affectation: a.dateAffectation,
  };
}

// ─── PlanningAnnuel ─────────────────────────────────────────────────
export function planningFromDB(r: any): PlanningAnnuel {
  return {
    id: r.id, efp: r.efp, anneeScolaire: r.annee_scolaire, filiere: r.filiere,
    session: r.session, dateDebut: r.date_debut, dateFin: r.date_fin,
    nbStagiairesPrevus: r.nb_stagiaires_prevus, heuresEntreprise: r.heures_entreprise,
    statut: r.statut,
  };
}
export function planningToDB(p: PlanningAnnuel) {
  return {
    id: p.id, efp: p.efp, annee_scolaire: p.anneeScolaire, filiere: p.filiere,
    session: p.session, date_debut: p.dateDebut, date_fin: p.dateFin,
    nb_stagiaires_prevus: p.nbStagiairesPrevus, heures_entreprise: p.heuresEntreprise,
    statut: p.statut,
  };
}

// ─── MessageDiscussion ──────────────────────────────────────────────
export function messageFromDB(r: any): MessageDiscussion {
  return {
    id: r.id, expediteurId: r.expediteur_id, expediteurNom: r.expediteur_nom,
    expediteurRole: r.expediteur_role, destinataireId: r.destinataire_id,
    destinataireNom: r.destinataire_nom, destinataireRole: r.destinataire_role,
    sujet: r.sujet, contenu: r.contenu, dateEnvoi: r.date_envoi, lu: r.lu,
    pieceJointeNom: r.piece_jointe_nom ?? undefined,
  };
}
export function messageToDB(m: MessageDiscussion) {
  return {
    id: m.id, expediteur_id: m.expediteurId, expediteur_nom: m.expediteurNom,
    expediteur_role: m.expediteurRole, destinataire_id: m.destinataireId,
    destinataire_nom: m.destinataireNom, destinataire_role: m.destinataireRole,
    sujet: m.sujet, contenu: m.contenu, date_envoi: m.dateEnvoi, lu: m.lu,
    piece_jointe_nom: m.pieceJointeNom ?? null,
  };
}

// ─── IndemnisationFormateur ──────────────────────────────────────────
export function indemnisationFromDB(r: any) {
  return {
    matricule: r.matricule, nomPrenom: r.nom_prenom, efp: r.efp, filiere: r.filiere,
    groupe: r.groupe, effectifStagiaires: r.effectif_stagiaires,
    nombreVisitesV1: r.nombre_visites_v1, nombreVisitesV2: r.nombre_visites_v2,
    nombreVisitesTotal: r.nombre_visites_total, tauxIndemniteUnitaire: r.taux_indemnite_unitaire,
    montantTotalBrut: r.montant_total_brut, statutAuditEfp: r.statut_audit_efp,
    statutValidation: r.statut_validation,
  };
}
export function indemnisationToDB(i: any) {
  return {
    matricule: i.matricule, nom_prenom: i.nomPrenom, efp: i.efp, filiere: i.filiere,
    groupe: i.groupe, effectif_stagiaires: i.effectifStagiaires,
    nombre_visites_v1: i.nombreVisitesV1, nombre_visites_v2: i.nombreVisitesV2,
    nombre_visites_total: i.nombreVisitesTotal, taux_indemnite_unitaire: i.tauxIndemniteUnitaire,
    montant_total_brut: i.montantTotalBrut, statut_audit_efp: i.statutAuditEfp,
    statut_validation: i.statutValidation,
  };
}
