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
  Printer,
  Upload,
  PlusCircle,
  FileText,
  Download,
  CheckCircle2,
  Compass,
  MessageSquare,
  TrendingUp,
  FileCheck,
  UserCog,
  KeyRound,
  ClipboardList,
  BadgeCheck,
  Building2,
  FilePlus,
  X,
  AlertTriangle
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
  onOpenProfile?: () => void;
  onOpenPassword?: () => void;
}

type TabId = 'affectations' | 'planning' | 'documents' | 'suivi' | 'audit' | 'reglementation';

interface UploadedDoc {
  type: 'contrat' | 'demande' | 'assurance' | 'decoupe';
  nom: string;
  date: string;
  groupe?: string;
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
  onOpenProfile,
  onOpenPassword,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('affectations');

  // Audit modal
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedVisiteForAudit, setSelectedVisiteForAudit] = useState<Visite | null>(null);
  const [modeControle, setModeControle] = useState<'Téléphone' | 'Terrain'>('Téléphone');
  const [statutConformite, setStatutConformite] = useState<'Conforme' | 'Non Conforme' | 'À clarifier'>('Conforme');
  const [auditObs, setAuditObs] = useState('');

  // Affectation modal
  const [isAffModalOpen, setIsAffModalOpen] = useState(false);
  const [affFormateurNom, setAffFormateurNom] = useState('');
  const [affMatricule, setAffMatricule] = useState('');
  const [affFiliere, setAffFiliere] = useState('');
  const [affGroupe, setAffGroupe] = useState('');
  const [affEffectif, setAffEffectif] = useState(25);
  const [affDecoupage, setAffDecoupage] = useState<string | null>(null);

  // Planning modal
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planFiliere, setPlanFiliere] = useState('');
  const [planSession, setPlanSession] = useState('');
  const [planDebut, setPlanDebut] = useState('2026-01-15');
  const [planFin, setPlanFin] = useState('2026-06-30');
  const [planStagiaires, setPlanStagiaires] = useState(30);

  // Documents FPA uploads (simulated)
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([
    { type: 'contrat', nom: 'Contrat_de_Stage_FPA_Officiel_OFPPT.pdf', date: '2025-09-01' },
    { type: 'demande', nom: 'Demande_Officielle_Stage_FPA.pdf', date: '2025-09-01' },
    { type: 'assurance', nom: 'Attestation_Assurance_Stage_OFPPT.pdf', date: '2025-09-01' },
  ]);
  const [uploadDocType, setUploadDocType] = useState<'contrat' | 'demande' | 'assurance'>('contrat');
  const [uploadDocGroupe, setUploadDocGroupe] = useState('');
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Validation des stages (EFP)
  const [validatedStages, setValidatedStages] = useState<Set<string>>(new Set(['stage-101', 'stage-102', 'stage-103', 'stage-104', 'stage-105']));

  // KPIs
  const efpAudits = audits.filter(a => a.typeAudit === 'EFP');
  const totalVisitesRealisees = visites.filter(v => v.dateEffectuee).length;
  const auditRatio = totalVisitesRealisees > 0
    ? Math.round((efpAudits.length / totalVisitesRealisees) * 100)
    : 0;
  const isAuditRatioCompliant = auditRatio >= 20;

  const openAuditDialog = (vis: Visite) => {
    setSelectedVisiteForAudit(vis);
    setAuditObs(`Contrôle ${modeControle.toLowerCase()} avec ${vis.tuteurNom || 'le tuteur d\'entreprise'} pour validation de la visite du ${vis.dateEffectuee || vis.datePrevue}.`);
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
      formateurId: `formateur-${affMatricule}`,
      formateurMatricule: affMatricule,
      formateurNom: affFormateurNom,
      efp: currentUser.efp,
      filiere: affFiliere,
      groupe: affGroupe,
      annee: '2A',
      effectifStagiaires: affEffectif,
      decoupageNomFichier: affDecoupage || `Decoupage_${affGroupe}_800h.pdf`,
    });
    setIsAffModalOpen(false);
    setAffFormateurNom(''); setAffMatricule(''); setAffFiliere(''); setAffGroupe(''); setAffDecoupage(null);
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
    setPlanFiliere(''); setPlanSession('');
  };

  const handleDocUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const labels = { contrat: 'Contrat_Stage', demande: 'Demande_Stage', assurance: 'Assurance_Stage' };
    const nom = `${labels[uploadDocType]}_${uploadDocGroupe || 'EFP'}_${new Date().getFullYear()}.pdf`;
    setUploadedDocs(prev => [...prev.filter(d => d.type !== uploadDocType || d.groupe !== uploadDocGroupe), {
      type: uploadDocType,
      nom,
      date: new Date().toISOString().slice(0, 10),
      groupe: uploadDocGroupe || undefined,
    }]);
    setIsDocModalOpen(false);
    setUploadDocGroupe('');
  };

  const handleValidateStage = (stageId: string) => {
    setValidatedStages(prev => new Set([...prev, stageId]));
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'affectations', label: 'Affectations & Découpages', icon: <Users className="w-4 h-4" /> },
    { id: 'planning', label: 'Planning Annuel', icon: <Calendar className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents FPA', icon: <FilePlus className="w-4 h-4" /> },
    { id: 'suivi', label: 'Suivi & Validation', icon: <Compass className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit EFP (M02)', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'reglementation', label: 'Réglementation', icon: <Download className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">

      {/* Banner EFP */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Direction d'Établissement (EFP)
              </span>
              <span className="text-xs text-slate-400 font-mono">Mat: {currentUser.matricule}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100">{currentUser.name}</h1>
            <p className="text-xs text-slate-400 mt-1">
              {currentUser.efp} — <span className="text-slate-300">{currentUser.directionRegionale}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenProfile && (
              <button onClick={onOpenProfile}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                <UserCog className="w-4 h-4" />
                <span>Mon Profil</span>
              </button>
            )}
            {onOpenPassword && (
              <button onClick={onOpenPassword}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
                <KeyRound className="w-4 h-4" />
                <span>Mot de passe</span>
              </button>
            )}
            <button onClick={onOpenPrintM02}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
              <Printer className="w-4 h-4" />
              <span>Rapport Audit M02</span>
            </button>
            <button onClick={onOpenPrintM05}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
              <FileCheck className="w-4 h-4" />
              <span>Indemnisation M05</span>
            </button>
            <button onClick={onOpenMessaging}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer">
              <MessageSquare className="w-4 h-4" />
              <span>Messagerie</span>
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-3 bg-slate-800/60 p-2.5 rounded-xl">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${
              isAuditRatioCompliant ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {auditRatio}%
            </div>
            <div>
              <span className="font-bold text-slate-200">Taux d'audit EFP</span>
              <p className="text-[10px] text-slate-400">Seuil obligatoire : min 20% ({efpAudits.length}/{totalVisitesRealisees} visites)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/60 p-2.5 rounded-xl">
            <BadgeCheck className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-200">Stages validés EFP</span>
              <p className="text-[10px] text-slate-400">{validatedStages.size} / {stages.length} conventions actives</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/60 p-2.5 rounded-xl">
            <TrendingUp className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-200">Échéance M05 → DR</span>
              <p className="text-[10px] text-slate-400">Au plus tard le <strong>10 du mois M+1</strong></p>
            </div>
          </div>
        </div>

        {/* Workflow steps */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px]">
          {[
            { n: '1', label: 'Affecter groupes', tab: 'affectations' as TabId },
            { n: '2', label: 'Saisir planning', tab: 'planning' as TabId },
            { n: '3', label: 'Téléverser docs', tab: 'documents' as TabId },
            { n: '4', label: 'Suivi & validation', tab: 'suivi' as TabId },
            { n: '5', label: 'Audit M02', tab: 'audit' as TabId },
            { n: '6', label: 'Imprimer M05 → DR', tab: 'audit' as TabId },
          ].map((step, i) => (
            <React.Fragment key={step.n}>
              <button onClick={() => setActiveTab(step.tab)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-900 font-black flex items-center justify-center text-[9px]">{step.n}</span>
                <span className="text-slate-300 font-semibold">{step.label}</span>
              </button>
              {i < 5 && <span className="text-slate-600">›</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── TAB 1 : AFFECTATIONS & DÉCOUPAGES ─── */}
      {activeTab === 'affectations' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-600" />
                  Affectation des groupes aux formateurs
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Attribuez chaque groupe/filière à un formateur conseiller et téléversez le découpage programme FPA (50 % en entreprise).
                </p>
              </div>
              <button onClick={() => setIsAffModalOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                <PlusCircle className="w-4 h-4" />
                Nouvelle affectation
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {affectations.map((aff) => (
                <div key={aff.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-mono text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">{aff.groupe}</span>
                    <span className="text-[10px] text-slate-400">Année {aff.annee}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{aff.filiere}</h4>
                  <div className="text-xs text-slate-600 space-y-0.5">
                    <p>Formateur : <strong className="text-slate-900">{aff.formateurNom}</strong></p>
                    <p className="font-mono text-[11px]">Mat. {aff.formateurMatricule} — {aff.effectifStagiaires} stagiaires</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                    {aff.decoupageNomFichier ? (
                      <span className="flex items-center gap-1 text-emerald-700 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {aff.decoupageNomFichier}
                      </span>
                    ) : (
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-[11px] font-semibold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        Téléverser le découpage
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {affectations.length === 0 && (
                <div className="col-span-3 text-center py-10 text-slate-400 text-sm">
                  Aucune affectation. Cliquez sur « Nouvelle affectation » pour commencer.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2 : PLANNING ANNUEL ─── */}
      {activeTab === 'planning' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  Planning annuel des stages FPA
                </h3>
                <p className="text-xs text-slate-500 mt-1">Calendrier d'insertion en milieu professionnel et périodes d'alternance par filière.</p>
              </div>
              <button onClick={() => setIsPlanModalOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                <PlusCircle className="w-4 h-4" />
                Ajouter une session
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Session / Filière</th>
                    <th className="p-3">EFP</th>
                    <th className="p-3">Période entreprise</th>
                    <th className="p-3 text-center">Heures</th>
                    <th className="p-3 text-center">Stagiaires</th>
                    <th className="p-3 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plannings.map((plan) => (
                    <tr key={plan.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{plan.session}</div>
                        <div className="text-[11px] text-amber-700 font-semibold">{plan.filiere}</div>
                      </td>
                      <td className="p-3 text-slate-600 text-[11px]">{plan.efp}</td>
                      <td className="p-3 font-mono text-slate-700">Du {plan.dateDebut} au {plan.dateFin}</td>
                      <td className="p-3 text-center font-bold text-slate-800">{plan.heuresEntreprise} h</td>
                      <td className="p-3 text-center font-black text-amber-800">{plan.nbStagiairesPrevus}</td>
                      <td className="p-3 text-center">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">{plan.statut}</span>
                      </td>
                    </tr>
                  ))}
                  {plannings.length === 0 && (
                    <tr><td colSpan={6} className="p-6 text-center text-slate-400">Aucune session planifiée.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3 : DOCUMENTS FPA ─── */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FilePlus className="w-5 h-5 text-amber-600" />
                  Documents de réalisation FPA
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Téléversez et gérez les trois documents obligatoires : contrat de stage, demande de stage et attestation d'assurance.
                </p>
              </div>
              <button onClick={() => setIsDocModalOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                <Upload className="w-4 h-4" />
                Téléverser un document
              </button>
            </div>

            {/* Document cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  type: 'contrat' as const,
                  label: 'Contrat de stage',
                  desc: 'Convention tripartite OFPPT / Entreprise / Stagiaire (Loi 36.96 & Décret 2-97-666)',
                  color: 'blue',
                },
                {
                  type: 'demande' as const,
                  label: 'Demande de stage',
                  desc: 'Lettre d\'introduction de l\'EFP pour la prospection des entreprises partenaires',
                  color: 'violet',
                },
                {
                  type: 'assurance' as const,
                  label: 'Assurance de stage',
                  desc: 'Attestation de couverture RC & accidents du travail (Police groupe OFPPT AXA)',
                  color: 'emerald',
                },
              ].map((docType) => {
                const uploaded = uploadedDocs.filter(d => d.type === docType.type);
                const colorMap: Record<string, string> = {
                  blue: 'bg-blue-50 border-blue-200 text-blue-800',
                  violet: 'bg-violet-50 border-violet-200 text-violet-800',
                  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
                };
                const iconColor: Record<string, string> = {
                  blue: 'bg-blue-100 text-blue-600',
                  violet: 'bg-violet-100 text-violet-600',
                  emerald: 'bg-emerald-100 text-emerald-600',
                };
                return (
                  <div key={docType.type} className={`rounded-xl border p-4 space-y-3 ${colorMap[docType.color]}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconColor[docType.color]}`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{docType.label}</h4>
                        <p className="text-[11px] opacity-70 mt-0.5">{docType.desc}</p>
                      </div>
                    </div>

                    {uploaded.length > 0 ? (
                      <div className="space-y-1.5">
                        {uploaded.map((d, i) => (
                          <div key={i} className="flex items-center justify-between bg-white/60 rounded-lg px-2.5 py-1.5 text-[11px]">
                            <span className="flex items-center gap-1.5 font-semibold truncate">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              {d.nom}
                            </span>
                            <span className="text-[10px] opacity-60 shrink-0 ml-2">{d.date}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-white/40 rounded-lg px-3 py-2 text-[11px] opacity-70">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        Non téléversé
                      </div>
                    )}

                    <button
                      onClick={() => { setUploadDocType(docType.type); setIsDocModalOpen(true); }}
                      className="w-full py-1.5 bg-white/60 hover:bg-white/90 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      {uploaded.length > 0 ? 'Mettre à jour' : 'Téléverser'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4 : SUIVI & VALIDATION ─── */}
      {activeTab === 'suivi' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-600" />
                  Suivi et validation en temps réel des stages
                </h3>
                <p className="text-xs text-slate-500">Supervisez les conventions actives et validez les stages après vérification.</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
                {stages.length} stages actifs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Stagiaire</th>
                    <th className="p-3">Filière / Groupe</th>
                    <th className="p-3">Entreprise</th>
                    <th className="p-3">Formateur</th>
                    <th className="p-3 text-center">Visites</th>
                    <th className="p-3 text-center">Contrat</th>
                    <th className="p-3 text-center">Audit EFP</th>
                    <th className="p-3 text-center">Validation EFP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stages.map((stage) => {
                    const stageVisites = visites.filter(v => v.stageId === stage.id);
                    const hasAudit = audits.some(a => a.visiteId.startsWith(stage.id) || a.stagiaireNom === stage.stagiaireName);
                    const isValidated = validatedStages.has(stage.id);

                    return (
                      <tr key={stage.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold uppercase text-slate-900">{stage.stagiaireName}</td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-800">{stage.filiere}</div>
                          <div className="text-[10px] text-amber-700 font-mono">{stage.groupe}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold">{stage.entreprise.nom}</div>
                          <div className="text-[10px] flex items-center gap-1 text-slate-500">
                            <Building2 className="w-3 h-3" />
                            {stage.entreprise.ville}
                          </div>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">{stage.formateurName}</td>
                        <td className="p-3 text-center">
                          <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                            {stageVisites.length} / 2
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {stage.contratSigneNomFichier ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                          ) : (
                            <span className="text-amber-600 text-[11px]">Attendu</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {hasAudit ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Audité</span>
                          ) : (
                            <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full">À faire</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isValidated ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 justify-center">
                              <BadgeCheck className="w-3 h-3" />
                              Validé EFP
                            </span>
                          ) : (
                            <button
                              onClick={() => handleValidateStage(stage.id)}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-semibold cursor-pointer transition-colors">
                              Valider
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visites detail */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-amber-600" />
                Détail des visites enregistrées
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Visite</th>
                    <th className="p-3">Formateur</th>
                    <th className="p-3">Stagiaire</th>
                    <th className="p-3">Entreprise / Ville</th>
                    <th className="p-3 text-center">Date effectuée</th>
                    <th className="p-3 text-center">Assiduité</th>
                    <th className="p-3 text-center">Statut visite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visites.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-blue-900">{v.numeroVisite === 1 ? '1ère Visite' : '2ème Visite'}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{v.formateurName}</div>
                        <div className="text-[10px] font-mono text-slate-400">Mat. {v.formateurMatricule}</div>
                      </td>
                      <td className="p-3 font-semibold uppercase text-slate-900">{v.stagiaireName}</td>
                      <td className="p-3">
                        <div className="font-semibold">{v.entrepriseNom}</div>
                        <div className="text-[10px] text-slate-500">{v.ville}</div>
                      </td>
                      <td className="p-3 text-center font-mono text-slate-700">{v.dateEffectuee || '—'}</td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          v.assiduiteStagiaire === 'Excellente' ? 'bg-emerald-100 text-emerald-800' :
                          v.assiduiteStagiaire === 'Bonne' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>{v.assiduiteStagiaire}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{v.statut}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5 : AUDIT EFP M02 ─── */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  Module d'audit des visites formateurs (Rapport M02)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Auditez les visites déclarées par les formateurs (téléphone ou terrain). Seuil réglementaire minimum : <strong>20 %</strong> de l'échantillon.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-xl text-xs font-black ${
                  isAuditRatioCompliant
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {isAuditRatioCompliant ? '✓' : '⚠'} Taux {auditRatio}%
                </div>
                <button onClick={onOpenPrintM02}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                  <Printer className="w-4 h-4" />
                  Imprimer M02
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Visite / Date</th>
                    <th className="p-3">Formateur</th>
                    <th className="p-3">Stagiaire</th>
                    <th className="p-3">Entreprise</th>
                    <th className="p-3">Observations</th>
                    <th className="p-3 text-center">Statut d'audit</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visites.map((vis) => {
                    const auditForThis = audits.find(a => a.visiteId === vis.id && a.typeAudit === 'EFP');
                    return (
                      <tr key={vis.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-bold text-blue-900">{vis.numeroVisite === 1 ? '1ère Visite' : '2ème Visite'}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{vis.dateEffectuee || vis.datePrevue}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold uppercase text-slate-900">{vis.formateurName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Mat. {vis.formateurMatricule}</div>
                        </td>
                        <td className="p-3 font-semibold uppercase text-slate-800">{vis.stagiaireName}</td>
                        <td className="p-3">
                          <div className="font-semibold">{vis.entrepriseNom}</div>
                          <div className="text-[10px] text-slate-500">{vis.ville}</div>
                        </td>
                        <td className="p-3 text-slate-600 max-w-[180px] truncate">{vis.observations}</td>
                        <td className="p-3 text-center">
                          {auditForThis ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 justify-center">
                              <CheckCircle2 className="w-3 h-3" />
                              {auditForThis.modeControle} — {auditForThis.statutConformite}
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">À auditer</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => openAuditDialog(vis)}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                            {auditForThis ? 'Modifier' : 'Auditer'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* M05 reminder */}
            <div className="mt-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-emerald-800">
                <FileCheck className="w-4 h-4 shrink-0" />
                <span>Après avoir atteint 20 % d'audit, imprimez et signez l'imprimé <strong>M05</strong> puis faites-le parvenir à la Direction Régionale avant le 10 du mois M+1.</span>
              </div>
              <button onClick={onOpenPrintM05}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer">
                <Printer className="w-4 h-4" />
                Imprimer M05
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 6 : RÉGLEMENTATION ─── */}
      {activeTab === 'reglementation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">{doc.categorie}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{doc.tailleMo}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">{doc.titre}</h4>
                <p className="text-xs text-slate-500 mb-2">{doc.description}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{doc.reference}</span>
                <button
                  onClick={() => {
                    const el = document.createElement('a');
                    const file = new Blob([`Document Officiel OFPPT FPA:\n${doc.titre}\nRéférence: ${doc.reference}`], { type: 'text/plain' });
                    el.href = URL.createObjectURL(file);
                    el.download = doc.fichierNom;
                    document.body.appendChild(el);
                    el.click();
                    document.body.removeChild(el);
                  }}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer">
                  <Download className="w-3.5 h-3.5" />
                  Télécharger
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ MODALS ═══ */}

      {/* Audit modal */}
      {isAuditModalOpen && selectedVisiteForAudit && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Audit réglementaire EFP — M02</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Formateur : <strong>{selectedVisiteForAudit.formateurName}</strong> (Mat. {selectedVisiteForAudit.formateurMatricule}) · Stagiaire : {selectedVisiteForAudit.stagiaireName}
                </p>
              </div>
              <button onClick={() => setIsAuditModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAuditSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mode de contrôle *</label>
                  <select value={modeControle} onChange={(e) => setModeControle(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white">
                    <option value="Téléphone">Téléphonique (appel tuteur)</option>
                    <option value="Terrain">Terrain (contrôle sur site)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Résultat de conformité *</label>
                  <select value={statutConformite} onChange={(e) => setStatutConformite(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-bold">
                    <option value="Conforme">Conforme</option>
                    <option value="Non Conforme">Non Conforme</option>
                    <option value="À clarifier">À clarifier</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Observations & vérifications d'audit</label>
                <textarea rows={3} value={auditObs} onChange={(e) => setAuditObs(e.target.value)}
                  placeholder="Contact tuteur, présence effective du stagiaire, conformité fiche M01..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden resize-none" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAuditModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer">Annuler</button>
                <button type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer">
                  Enregistrer l'audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Affectation modal */}
      {isAffModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Nouvelle affectation FPA</h3>
              <button onClick={() => setIsAffModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateAff} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du formateur conseiller *</label>
                <input type="text" required value={affFormateurNom} onChange={(e) => setAffFormateurNom(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" placeholder="Prénom NOM" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Matricule *</label>
                  <input type="text" required value={affMatricule} onChange={(e) => setAffMatricule(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono" placeholder="14582" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Code groupe *</label>
                  <input type="text" required value={affGroupe} onChange={(e) => setAffGroupe(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono" placeholder="DEV203" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Filière *</label>
                <input type="text" required value={affFiliere} onChange={(e) => setAffFiliere(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" placeholder="Développement Digital" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Effectif de stagiaires</label>
                <input type="number" min={1} value={affEffectif} onChange={(e) => setAffEffectif(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Découpage de programme (PDF)</label>
                <div className="flex items-center gap-2 border border-dashed border-slate-300 rounded-lg px-3 py-2 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => document.getElementById('decoupe-upload')?.click()}>
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500">{affDecoupage || 'Cliquez pour sélectionner le fichier PDF'}</span>
                  <input id="decoupe-upload" type="file" accept=".pdf" className="hidden"
                    onChange={(e) => setAffDecoupage(e.target.files?.[0]?.name || null)} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAffModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer">Annuler</button>
                <button type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Planning modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Nouvelle session de planning FPA</h3>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreatePlan} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Intitulé de la session *</label>
                <input type="text" required value={planSession} onChange={(e) => setPlanSession(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" placeholder="Session FPA Printemps 2026" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Filière *</label>
                <input type="text" required value={planFiliere} onChange={(e) => setPlanFiliere(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" placeholder="Développement Digital (2A)" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date début</label>
                  <input type="date" value={planDebut} onChange={(e) => setPlanDebut(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date fin</label>
                  <input type="date" value={planFin} onChange={(e) => setPlanFin(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de stagiaires prévus</label>
                <input type="number" min={1} value={planStagiaires} onChange={(e) => setPlanStagiaires(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsPlanModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer">Annuler</button>
                <button type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer">
                  Enregistrer la session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document upload modal */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Téléverser un document FPA</h3>
              <button onClick={() => setIsDocModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleDocUpload} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type de document *</label>
                <select value={uploadDocType} onChange={(e) => setUploadDocType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white">
                  <option value="contrat">Contrat de stage</option>
                  <option value="demande">Demande de stage</option>
                  <option value="assurance">Assurance de stage</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Groupe / Filière concerné (optionnel)</label>
                <input type="text" value={uploadDocGroupe} onChange={(e) => setUploadDocGroupe(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg" placeholder="Ex: DEV201, GE201..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fichier PDF *</label>
                <div className="flex items-center gap-2 border-2 border-dashed border-amber-300 rounded-xl px-4 py-5 bg-amber-50 cursor-pointer hover:bg-amber-100 transition-colors justify-center"
                  onClick={() => document.getElementById('doc-fpa-upload')?.click()}>
                  <Upload className="w-5 h-5 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700">Cliquez pour sélectionner le fichier PDF</span>
                  <input id="doc-fpa-upload" type="file" accept=".pdf" className="hidden" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsDocModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer">Annuler</button>
                <button type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold cursor-pointer">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
