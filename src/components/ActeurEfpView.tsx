import React, { useState } from 'react';
import {
  Stage,
  Visite,
  UserProfile,
  AuditRecord,
  RegulatoryDoc,
  AffectationFPA,
  PlanningAnnuel
} from '../types';
import {
  ShieldCheck,
  Users,
  Calendar,
  Building2,
  Printer,
  Upload,
  PlusCircle,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  Phone,
  Compass,
  MessageSquare,
  TrendingUp,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';

interface ActeurEfpViewProps {
  currentUser: UserProfile;
  stages: Stage[];
  visites: Visite[];
  audits: AuditRecord[];
  docs: RegulatoryDoc[];
  affectations: AffectationFPA[];
  plannings: PlanningAnnuel[];
  onAddAudit: (audit: Omit<AuditRecord, 'id' | 'typeAudit' | 'dateAudit' | 'auditeurId' | 'auditeurNom'>) => void;
  onAddAffectation: (aff: Omit<AffectationFPA, 'id' | 'dateAffectation'>) => void;
  onAddPlanning: (plan: Omit<PlanningAnnuel, 'id'>) => void;
  onOpenPrintM02: () => void;
  onOpenPrintM05: () => void;
  onOpenMessaging: () => void;
}

export const ActeurEfpView: React.FC<ActeurEfpViewProps> = ({
  currentUser,
  stages,
  visites,
  audits,
  docs,
  affectations,
  plannings,
  onAddAudit,
  onAddAffectation,
  onAddPlanning,
  onOpenPrintM02,
  onOpenPrintM05,
  onOpenMessaging,
}) => {
  const [activeTab, setActiveTab] = useState<'suivi' | 'audit' | 'affectations' | 'planning' | 'reglementation'>('suivi');

  // Audit modal state
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedVisiteForAudit, setSelectedVisiteForAudit] = useState<Visite | null>(null);
  const [modeControle, setModeControle] = useState<'Téléphone' | 'Terrain'>('Téléphone');
  const [statutConformite, setStatutConformite] = useState<'Conforme' | 'Non Conforme' | 'À clarifier'>('Conforme');
  const [auditObs, setAuditObs] = useState('');

  // New assignment modal state
  const [isAffModalOpen, setIsAffModalOpen] = useState(false);
  const [affFormateurNom, setAffFormateurNom] = useState('Mohammed EL ALAMI');
  const [affMatricule, setAffMatricule] = useState('14582');
  const [affFiliere, setAffFiliere] = useState('Développement Digital');
  const [affGroupe, setAffGroupe] = useState('DEV203');
  const [affEffectif, setAffEffectif] = useState(25);

  // New Planning state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planFiliere, setPlanFiliere] = useState('Développement Digital');
  const [planSession, setPlanSession] = useState('Session FPA Printemps 2026');
  const [planDebut, setPlanDebut] = useState('2026-02-01');
  const [planFin, setPlanFin] = useState('2026-06-30');
  const [planStagiaires, setPlanStagiaires] = useState(30);

  // Audited visits count & compliance rate
  const efpAudits = audits.filter(a => a.typeAudit === 'EFP');
  const totalVisitesRealisees = visites.filter(v => v.dateEffectuee).length;
  const auditRatio = totalVisitesRealisees > 0 
    ? Math.round((efpAudits.length / totalVisitesRealisees) * 100) 
    : 0;
  const isAuditRatioCompliant = auditRatio >= 20;

  const openAuditDialog = (vis: Visite) => {
    setSelectedVisiteForAudit(vis);
    setAuditObs(`Contrôle ${modeControle.toLowerCase()} avec ${vis.tuteurNom || 'le tuteur d’entreprise'} pour validation de la visite du ${vis.dateEffectuee}.`);
    setIsAuditModalOpen(true);
  };

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisiteForAudit) return;

    onAddAudit({
      visiteId: selectedVisiteForAudit.id,
      formateurMatricule: selectedVisiteForAudit.formateurMatricule,
      formateurNom: selectedVisiteForAudit.formateurName,
      stagiaireNom: selectedVisiteForAudit.stagiaireName,
      entrepriseNom: selectedVisiteForAudit.entrepriseNom,
      ville: selectedVisiteForAudit.ville,
      modeControle,
      statutConformite,
      observations: auditObs,
    });

    setIsAuditModalOpen(false);
  };

  const handleCreateAff = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAffectation({
      formateurId: 'user-formateur-1',
      formateurMatricule: affMatricule,
      formateurNom: affFormateurNom,
      efp: currentUser.efp,
      filiere: affFiliere,
      groupe: affGroupe,
      annee: '2A',
      effectifStagiaires: affEffectif,
      decoupageNomFichier: `Decoupage_Programme_${affGroupe}_800h.pdf`,
    });
    setIsAffModalOpen(false);
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlanning({
      efp: currentUser.efp,
      anneeScolaire: '2025/2026',
      filiere: planFiliere,
      session: planSession,
      dateDebut: planDebut,
      dateFin: planFin,
      nbStagiairesPrevus: planStagiaires,
      heuresEntreprise: 800,
      statut: 'Actif',
    });
    setIsPlanModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner EFP */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Direction d'Établissement (EFP)
              </span>
              <span className="text-xs text-slate-400 font-mono">Matricule: {currentUser.matricule}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100">
              {currentUser.name} - Direction Pédagogique
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Établissement : <strong className="text-slate-200">{currentUser.efp}</strong> | {currentUser.directionRegionale}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenPrintM02}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer Rapport Audit M02</span>
            </button>
            <button
              onClick={onOpenPrintM05}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Générer Indemnisation M05</span>
            </button>
            <button
              onClick={onOpenMessaging}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messagerie DR / Formateurs</span>
            </button>
          </div>
        </div>

        {/* Audit Rate Gauge & Regulatory Compliance */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-3 bg-slate-800/60 p-2.5 rounded-xl">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              isAuditRatioCompliant ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {auditRatio}%
            </div>
            <div>
              <span className="font-bold text-slate-200">Taux d'Audit EFP Actuel</span>
              <p className="text-[10px] text-slate-400">
                Seuil obligatoire : <strong>Min 20%</strong> ({efpAudits.length}/{totalVisitesRealisees} visites)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-xl">
            <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-200">Échéance M05 Direction Régionale</span>
              <p className="text-[10px] text-slate-400">Au plus tard le <strong>10 du mois M+1</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/60 p-2.5 rounded-xl">
            <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-200">Stages Validés EFP</span>
              <p className="text-[10px] text-slate-400">{stages.length} stagiaires placés en entreprise</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('suivi')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'suivi'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Suivi en Temps Réel des Stages</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Module d'Audit EFP (Échantillon 20%)</span>
        </button>

        <button
          onClick={() => setActiveTab('affectations')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'affectations'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Affectations FPA & Découpages</span>
        </button>

        <button
          onClick={() => setActiveTab('planning')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'planning'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Planning Annuel des Stages</span>
        </button>

        <button
          onClick={() => setActiveTab('reglementation')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'reglementation'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Réglementation FPA</span>
        </button>
      </div>

      {/* TAB 1: SUIVI EN TEMPS REEL */}
      {activeTab === 'suivi' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Stages Validés et Visites en Cours</h3>
                <p className="text-xs text-slate-500">Supervision directe des conventions actives et avancement des visites de terrain.</p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-900 bg-blue-100 px-2.5 py-1 rounded-full">
                {stages.length} Stages Enregistrés
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Stagiaire</th>
                    <th className="p-3">Filière / Groupe</th>
                    <th className="p-3">Entreprise d'accueil</th>
                    <th className="p-3">Formateur Responsable</th>
                    <th className="p-3 text-center">Avancement Visites</th>
                    <th className="p-3 text-center">Contrat Reçu</th>
                    <th className="p-3 text-center">Audit Réalisé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stages.map((stage) => {
                    const stageVisites = visites.filter(v => v.stageId === stage.id);
                    const hasAudit = audits.some(a => a.visiteId.startsWith(stage.id) || a.stagiaireNom === stage.stagiaireName);

                    return (
                      <tr key={stage.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold uppercase text-slate-900">{stage.stagiaireName}</td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-800">{stage.filiere}</div>
                          <div className="text-[10px] text-blue-600 font-mono">{stage.groupe}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold">{stage.entreprise.nom}</div>
                          <div className="text-[10px] text-slate-500">{stage.entreprise.ville}</div>
                        </td>
                        <td className="p-3 font-medium text-slate-800">{stage.formateurName}</td>
                        <td className="p-3 text-center">
                          <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                            {stageVisites.length} / 2 visites
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {stage.contratSigneNomFichier ? (
                            <span className="text-emerald-700 font-bold text-[11px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Signé</span>
                            </span>
                          ) : (
                            <span className="text-amber-600 text-[11px]">En attente</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {hasAudit ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Audité EFP
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Non audité</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT REGLEMENTAIRE EFP (MIN 20%) */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <span>Module d'Audit des Visites Formateurs (Rapport M02)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Sélectionnez les visites déclarées par les formateurs pour effectuer un audit de terrain ou téléphonique (Échantillon minimum requis : 20%).
                </p>
              </div>

              <button
                onClick={onOpenPrintM02}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer Rapport d'Audit M02</span>
              </button>
            </div>

            {/* List of visits available for audit */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Visite / Date</th>
                    <th className="p-3">Formateur Audité</th>
                    <th className="p-3">Stagiaire</th>
                    <th className="p-3">Entreprise d'accueil</th>
                    <th className="p-3">Observations Formateur</th>
                    <th className="p-3 text-center">Statut d'Audit</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visites.map((vis) => {
                    const auditForThis = audits.find(a => a.visiteId === vis.id && a.typeAudit === 'EFP');

                    return (
                      <tr key={vis.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-bold text-blue-900">
                            {vis.numeroVisite === 1 ? '1ère Visite' : '2ème Visite'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">{vis.dateEffectuee || vis.datePrevue}</div>
                        </td>

                        <td className="p-3">
                          <div className="font-bold uppercase text-slate-900">{vis.formateurName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Mat: {vis.formateurMatricule}</div>
                        </td>

                        <td className="p-3">
                          <div className="font-semibold text-slate-800 uppercase">{vis.stagiaireName}</div>
                          <div className="text-[10px] text-slate-500">{vis.groupe}</div>
                        </td>

                        <td className="p-3">
                          <div className="font-semibold">{vis.entrepriseNom}</div>
                          <div className="text-[10px] text-slate-500">{vis.ville}</div>
                        </td>

                        <td className="p-3 text-slate-600 max-w-xs truncate">{vis.observations}</td>

                        <td className="p-3 text-center">
                          {auditForThis ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{auditForThis.modeControle} ({auditForThis.statutConformite})</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                              À auditer
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <button
                            onClick={() => openAuditDialog(vis)}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                          >
                            {auditForThis ? 'Modifier Audit' : 'Auditer (20%)'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AFFECTATIONS FPA & DECOUPAGES */}
      {activeTab === 'affectations' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Affectation des Groupes & Filières aux Formateurs</h3>
                <p className="text-xs text-slate-500">
                  Attribution des classes et téléversement des découpages de programmes FPA (50% en entreprise).
                </p>
              </div>

              <button
                onClick={() => setIsAffModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nouvelle Affectation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {affectations.map((aff) => (
                <div key={aff.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                      {aff.groupe}
                    </span>
                    <span className="text-[11px] text-slate-400">Année : {aff.annee}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">{aff.filiere}</h4>
                  <p className="text-xs text-slate-700">Formateur : <strong>{aff.formateurNom}</strong> (Mat: {aff.formateurMatricule})</p>
                  <p className="text-xs text-slate-500">Effectif classe : {aff.effectifStagiaires} stagiaires</p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate">{aff.decoupageNomFichier}</span>
                    <span className="text-emerald-700 font-bold text-[10px]">Découpage validé</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PLANNING ANNUEL DES STAGES */}
      {activeTab === 'planning' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Planning Annuel des Stages FPA (EFP)</h3>
                <p className="text-xs text-slate-500">Calendrier d'insertion en milieu professionnel et périodes d'alternance.</p>
              </div>

              <button
                onClick={() => setIsPlanModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ajouter Session Planning</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Session / Filière</th>
                    <th className="p-3">Période en Entreprise</th>
                    <th className="p-3 text-center">Volume Horaire</th>
                    <th className="p-3 text-center">Stagiaires Prévus</th>
                    <th className="p-3 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plannings.map((plan) => (
                    <tr key={plan.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{plan.session}</div>
                        <div className="text-[11px] text-blue-600 font-medium">{plan.filiere}</div>
                      </td>
                      <td className="p-3 font-mono font-medium">Du {plan.dateDebut} au {plan.dateFin}</td>
                      <td className="p-3 text-center font-bold text-slate-800">{plan.heuresEntreprise} heures</td>
                      <td className="p-3 text-center font-bold text-blue-900">{plan.nbStagiairesPrevus}</td>
                      <td className="p-3 text-center">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {plan.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REGLEMENTATION */}
      {activeTab === 'reglementation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                    {doc.categorie}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{doc.tailleMo}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">{doc.titre}</h4>
                <p className="text-xs text-slate-500 mb-3">{doc.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{doc.reference}</span>
                <button
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([`Document Officiel OFPPT FPA:\n${doc.titre}\nRéférence: ${doc.reference}`], {type: 'text/plain'});
                    element.href = URL.createObjectURL(file);
                    element.download = doc.fichierNom;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AUDIT MODAL EFP */}
      {isAuditModalOpen && selectedVisiteForAudit && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Audit Réglementaire EFP (Imprimé M02)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Formateur audité : <strong>{selectedVisiteForAudit.formateurName}</strong> (Mat: {selectedVisiteForAudit.formateurMatricule}) | Stagiaire : {selectedVisiteForAudit.stagiaireName}
            </p>

            <form onSubmit={handleAuditSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mode de Contrôle *</label>
                  <select
                    value={modeControle}
                    onChange={(e) => setModeControle(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Téléphone">Téléphonique (Appel Tuteur)</option>
                    <option value="Terrain">Terrain (Contrôle sur site)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Résultat Conformité *</label>
                  <select
                    value={statutConformite}
                    onChange={(e) => setStatutConformite(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-bold"
                  >
                    <option value="Conforme">Conforme</option>
                    <option value="Non Conforme">Non Conforme</option>
                    <option value="À clarifier">À clarifier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Observations & Vérifications d'audit</label>
                <textarea
                  rows={3}
                  value={auditObs}
                  onChange={(e) => setAuditObs(e.target.value)}
                  placeholder="Détaillez le contrôle : contact tuteur, présence effective du stagiaire, conformité de la fiche M01..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAuditModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Enregistrer l'audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOUVELLE AFFECTATION */}
      {isAffModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Nouvelle Affectation FPA</h3>
            <form onSubmit={handleCreateAff} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du formateur conseiller</label>
                <input
                  type="text"
                  required
                  value={affFormateurNom}
                  onChange={(e) => setAffFormateurNom(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Matricule</label>
                  <input
                    type="text"
                    required
                    value={affMatricule}
                    onChange={(e) => setAffMatricule(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Groupe</label>
                  <input
                    type="text"
                    required
                    value={affGroupe}
                    onChange={(e) => setAffGroupe(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Filière</label>
                <input
                  type="text"
                  required
                  value={affFiliere}
                  onChange={(e) => setAffFiliere(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Effectif de stagiaires</label>
                <input
                  type="number"
                  value={affEffectif}
                  onChange={(e) => setAffEffectif(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAffModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOUVEAU PLANNING */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Nouvelle Session de Planning FPA</h3>
            <form onSubmit={handleCreatePlan} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Intitulé de la session</label>
                <input
                  type="text"
                  required
                  value={planSession}
                  onChange={(e) => setPlanSession(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Filière</label>
                <input
                  type="text"
                  required
                  value={planFiliere}
                  onChange={(e) => setPlanFiliere(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date début</label>
                  <input
                    type="date"
                    value={planDebut}
                    onChange={(e) => setPlanDebut(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date fin</label>
                  <input
                    type="date"
                    value={planFin}
                    onChange={(e) => setPlanFin(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de stagiaires prévus</label>
                <input
                  type="number"
                  value={planStagiaires}
                  onChange={(e) => setPlanStagiaires(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Enregistrer session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
