import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  Stage,
  Visite,
  AuditRecord,
  FicheM01Uploaded,
  MessageDiscussion,
  RegulatoryDoc,
  AffectationFPA,
  PlanningAnnuel
} from './types';
import {
  mockUsers,
  mockStages,
  mockVisites,
  mockAudits,
  mockFichesM01,
  mockMessages,
  mockRegulatoryDocs,
  mockAffectations,
  mockPlannings,
  mockIndemnisationsEfp
} from './data/mockData';
import { db } from './lib/db';

// Modals
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { CommunicationModal } from './components/CommunicationModal';

// Role Views
import { StagiaireView } from './components/StagiaireView';
import { FormateurView } from './components/FormateurView';
import { ActeurEfpView } from './components/ActeurEfpView';
import { ActeurDrView } from './components/ActeurDrView';

// Print Modals
import { PrintM01Modal } from './components/prints/PrintM01Modal';
import { PrintM02Modal } from './components/prints/PrintM02Modal';
import { PrintM03Modal } from './components/prints/PrintM03Modal';
import { PrintM04Modal } from './components/prints/PrintM04Modal';
import { PrintM05Modal } from './components/prints/PrintM05Modal';
import { PrintM06Modal } from './components/prints/PrintM06Modal';
import { PrintContratStageModal } from './components/prints/PrintContratStageModal';
import { PrintTableauMinistereModal } from './components/prints/PrintTableauMinistereModal';

import {
  Shield,
  User,
  LogOut,
  KeyRound,
  MessageSquare,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  Printer,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowRightLeft,
  Loader2
} from 'lucide-react';

async function seedIfEmpty(
  stages: Stage[],
  indemnisations: any[]
) {
  if (stages.length === 0) {
    await Promise.all([
      ...mockUsers.map(u => db.profiles.upsert(u)),
      ...mockStages.map(s => db.stages.upsert(s)),
      ...mockVisites.map(v => db.visites.upsert(v)),
      ...mockAudits.map(a => db.auditRecords.upsert(a)),
      ...mockFichesM01.map(f => db.fichesM01.upsert(f)),
      db.regulatoryDocs.upsertMany(mockRegulatoryDocs),
      ...mockAffectations.map(a => db.affectations.upsert(a)),
      ...mockPlannings.map(p => db.plannings.upsert(p)),
      ...mockMessages.map(m => db.messages.insert(m)),
      db.indemnisations.upsertMany(mockIndemnisationsEfp),
    ]);
  }
}

export default function App() {
  // Data state — starts empty, loaded from Supabase
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUsers[0]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [visites, setVisites] = useState<Visite[]>([]);
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [fichesM01, setFichesM01] = useState<FicheM01Uploaded[]>([]);
  const [messages, setMessages] = useState<MessageDiscussion[]>([]);
  const [regulatoryDocs, setRegulatoryDocs] = useState<RegulatoryDoc[]>([]);
  const [affectations, setAffectations] = useState<AffectationFPA[]>([]);
  const [plannings, setPlannings] = useState<PlanningAnnuel[]>([]);
  const [indemnisations, setIndemnisations] = useState<any[]>([]);

  // App state
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Modal Visibility States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState(false);

  // Print Modals
  const [isPrintM01Open, setIsPrintM01Open] = useState(false);
  const [isPrintM02Open, setIsPrintM02Open] = useState(false);
  const [isPrintM03Open, setIsPrintM03Open] = useState(false);
  const [isPrintM04Open, setIsPrintM04Open] = useState(false);
  const [isPrintM05Open, setIsPrintM05Open] = useState(false);
  const [isPrintM06Open, setIsPrintM06Open] = useState(false);
  const [isPrintContratOpen, setIsPrintContratOpen] = useState(false);
  const [isPrintMinistereOpen, setIsPrintMinistereOpen] = useState(false);
  const [selectedStageForPrint, setSelectedStageForPrint] = useState<Stage | null>(null);

  // Load all data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [
          dbProfiles, dbStages, dbVisites, dbAudits, dbFiches,
          dbMessages, dbDocs, dbAffectations, dbPlannings, dbIndemn
        ] = await Promise.all([
          db.profiles.getAll(),
          db.stages.getAll(),
          db.visites.getAll(),
          db.auditRecords.getAll(),
          db.fichesM01.getAll(),
          db.messages.getAll(),
          db.regulatoryDocs.getAll(),
          db.affectations.getAll(),
          db.plannings.getAll(),
          db.indemnisations.getAll(),
        ]);

        // Auto-seed on first run
        await seedIfEmpty(dbStages, dbIndemn);

        // Reload after seeding if empty
        const finalStages = dbStages.length > 0 ? dbStages : await db.stages.getAll();
        const finalProfiles = dbProfiles.length > 0 ? dbProfiles : await db.profiles.getAll();
        const finalVisites = dbVisites.length > 0 ? dbVisites : await db.visites.getAll();
        const finalAudits = dbAudits.length > 0 ? dbAudits : await db.auditRecords.getAll();
        const finalFiches = dbFiches.length > 0 ? dbFiches : await db.fichesM01.getAll();
        const finalMessages = dbMessages.length > 0 ? dbMessages : await db.messages.getAll();
        const finalDocs = dbDocs.length > 0 ? dbDocs : await db.regulatoryDocs.getAll();
        const finalAffect = dbAffectations.length > 0 ? dbAffectations : await db.affectations.getAll();
        const finalPlannings = dbPlannings.length > 0 ? dbPlannings : await db.plannings.getAll();
        const finalIndemn = dbIndemn.length > 0 ? dbIndemn : await db.indemnisations.getAll();

        setUsers(finalProfiles.length > 0 ? finalProfiles : mockUsers);
        setStages(finalStages.length > 0 ? finalStages : mockStages);
        setVisites(finalVisites.length > 0 ? finalVisites : mockVisites);
        setAudits(finalAudits.length > 0 ? finalAudits : mockAudits);
        setFichesM01(finalFiches.length > 0 ? finalFiches : mockFichesM01);
        setMessages(finalMessages.length > 0 ? finalMessages : mockMessages);
        setRegulatoryDocs(finalDocs.length > 0 ? finalDocs : mockRegulatoryDocs);
        setAffectations(finalAffect.length > 0 ? finalAffect : mockAffectations);
        setPlannings(finalPlannings.length > 0 ? finalPlannings : mockPlannings);
        setIndemnisations(finalIndemn.length > 0 ? finalIndemn : mockIndemnisationsEfp);

        if (finalProfiles.length > 0) {
          setCurrentUser(finalProfiles[0]);
          setSelectedStageForPrint(finalStages[0] ?? null);
        } else {
          setSelectedStageForPrint(mockStages[0]);
        }
      } catch (err) {
        console.error('Erreur chargement Supabase:', err);
        setDbError('Connexion Supabase échouée — mode démo (données locales)');
        // Fallback to mock data
        setUsers(mockUsers);
        setStages(mockStages);
        setVisites(mockVisites);
        setAudits(mockAudits);
        setFichesM01(mockFichesM01);
        setMessages(mockMessages);
        setRegulatoryDocs(mockRegulatoryDocs);
        setAffectations(mockAffectations);
        setPlannings(mockPlannings);
        setIndemnisations(mockIndemnisationsEfp);
        setSelectedStageForPrint(mockStages[0]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const switchRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) setCurrentUser(targetUser);
  };

  // ─── Handlers (local state + Supabase persist) ──────────────────

  const handleAddStage = (newStageData: Omit<Stage, 'id' | 'dateCreation' | 'stagiaireId' | 'stagiaireName' | 'stagiaireCni' | 'stagiaireTelephone'>) => {
    const newStage: Stage = {
      ...newStageData,
      id: `STG-2026-${String(stages.length + 1).padStart(3, '0')}`,
      stagiaireId: currentUser.id,
      stagiaireName: currentUser.name,
      stagiaireCni: currentUser.cni,
      stagiaireTelephone: currentUser.telephone,
      dateCreation: new Date().toISOString().split('T')[0],
    };
    setStages([newStage, ...stages]);
    db.stages.insert(newStage).catch(console.error);
  };

  const handleUploadContract = (stageId: string, fileName: string) => {
    const patch = {
      contrat_signe_nom_fichier: fileName,
      contrat_signe_date_depot: new Date().toISOString().split('T')[0],
      statut: 'depose',
    };
    setStages(stages.map(s => s.id === stageId ? {
      ...s,
      contratSigneNomFichier: fileName,
      contratSigneDateDepot: patch.contrat_signe_date_depot,
      statut: 'depose',
    } : s));
    db.stages.updateFields(stageId, patch).catch(console.error);
  };

  const handleValidateStage = (stageId: string) => {
    setStages(stages.map(s => s.id === stageId ? { ...s, statut: 'valide_formateur' } : s));
    db.stages.updateFields(stageId, { statut: 'valide_formateur' }).catch(console.error);
  };

  const handleAddOrUpdateVisite = (visiteData: Omit<Visite, 'id' | 'formateurId' | 'formateurMatricule' | 'formateurName' | 'efp' | 'directionRegionale'>) => {
    const existingIndex = visites.findIndex(v => v.stageId === visiteData.stageId && v.numeroVisite === visiteData.numeroVisite);

    if (existingIndex >= 0) {
      const updated = [...visites];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...visiteData,
        dateEffectuee: visiteData.dateEffectuee || updated[existingIndex].dateEffectuee,
        statut: 'effectuee',
      };
      setVisites(updated);
      db.visites.update(updated[existingIndex]).catch(console.error);
    } else {
      const newVisite: Visite = {
        ...visiteData,
        id: `VIS-2026-${String(visites.length + 1).padStart(3, '0')}`,
        formateurId: currentUser.id,
        formateurMatricule: currentUser.matricule || '14582',
        formateurName: currentUser.name,
        efp: currentUser.efp,
        directionRegionale: currentUser.directionRegionale,
        statut: 'effectuee',
      };
      setVisites([newVisite, ...visites]);
      db.visites.insert(newVisite).catch(console.error);
    }

    const stageStatut = visiteData.numeroVisite === 1 ? 'visite_1' : 'visite_2';
    setStages(stages.map(s => s.id === visiteData.stageId ? { ...s, statut: stageStatut } : s));
    db.stages.updateFields(visiteData.stageId, { statut: stageStatut }).catch(console.error);
  };

  const handleUploadFicheM01 = (ficheData: Omit<FicheM01Uploaded, 'id' | 'dateTeleversement'>) => {
    const newFiche: FicheM01Uploaded = {
      ...ficheData,
      id: `M01-UP-${String(fichesM01.length + 1).padStart(3, '0')}`,
      dateTeleversement: new Date().toISOString().split('T')[0],
    };
    setFichesM01([newFiche, ...fichesM01]);
    db.fichesM01.insert(newFiche).catch(console.error);
  };

  const handleAddAudit = (auditData: Omit<AuditRecord, 'id' | 'typeAudit' | 'dateAudit' | 'auditeurId' | 'auditeurNom'>) => {
    const typeAudit: 'EFP' | 'DR' = currentUser.role === 'dr' ? 'DR' : 'EFP';
    const newAudit: AuditRecord = {
      ...auditData,
      id: `AUD-${typeAudit}-${String(audits.length + 1).padStart(3, '0')}`,
      typeAudit,
      dateAudit: new Date().toISOString().split('T')[0],
      auditeurId: currentUser.id,
      auditeurNom: currentUser.name,
    };
    setAudits([newAudit, ...audits]);
    db.auditRecords.insert(newAudit).catch(console.error);

    setVisites(visites.map(v => {
      if (v.id === auditData.visiteId) {
        return { ...v, statut: typeAudit === 'DR' ? 'auditee_dr' : 'auditee_efp' };
      }
      return v;
    }));
    const targetVisite = visites.find(v => v.id === auditData.visiteId);
    if (targetVisite) {
      const updated = { ...targetVisite, statut: typeAudit === 'DR' ? 'auditee_dr' : ('auditee_efp' as any) };
      db.visites.update(updated).catch(console.error);
    }
  };

  const handleSendMessage = (msgData: Omit<MessageDiscussion, 'id' | 'dateEnvoi' | 'lu'>) => {
    const newMsg: MessageDiscussion = {
      ...msgData,
      id: `MSG-${Date.now()}`,
      dateEnvoi: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      lu: false,
    };
    setMessages([...messages, newMsg]);
    db.messages.insert(newMsg).catch(console.error);
  };

  const handleAddAffectation = (affData: Omit<AffectationFPA, 'id' | 'dateAffectation'>) => {
    const newAff: AffectationFPA = {
      ...affData,
      id: `AFF-2026-${String(affectations.length + 1).padStart(3, '0')}`,
      dateAffectation: new Date().toISOString().split('T')[0],
    };
    setAffectations([newAff, ...affectations]);
    db.affectations.insert(newAff).catch(console.error);
  };

  const handleAddPlanning = (planData: Omit<PlanningAnnuel, 'id'>) => {
    const newPlan: PlanningAnnuel = {
      ...planData,
      id: `PLAN-2026-${String(plannings.length + 1).padStart(3, '0')}`,
    };
    setPlannings([newPlan, ...plannings]);
    db.plannings.insert(newPlan).catch(console.error);
  };

  const handleOpenContractPrint = (stage: Stage) => {
    setSelectedStageForPrint(stage);
    setIsPrintContratOpen(true);
  };

  const handleUserUpdate = (upd: UserProfile) => {
    setCurrentUser(upd);
    setUsers(users.map(u => u.id === upd.id ? upd : u));
    db.profiles.update(upd.id, upd).catch(console.error);
  };

  const getActiveRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'stagiaire': return { label: 'Stagiaire FPA', color: 'bg-emerald-500' };
      case 'formateur': return { label: 'Formateur Conseiller FPA', color: 'bg-blue-600' };
      case 'efp':       return { label: 'Direction EFP', color: 'bg-amber-600' };
      case 'dr':        return { label: 'Direction Régionale DR', color: 'bg-purple-600' };
    }
  };

  const activeBadge = getActiveRoleBadge(currentUser.role);

  // ─── Loading screen ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-serif font-black text-lg shadow-xl shadow-blue-500/30">
          OFPPT
        </div>
        <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
        <p className="text-slate-400 text-sm">Chargement des données FPA…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">

      {/* DB error banner */}
      {dbError && (
        <div className="no-print bg-amber-500 text-white text-xs text-center py-1.5 px-4 font-medium">
          ⚠️ {dbError}
        </div>
      )}

      {/* Top Application Header */}
      <header className="no-print bg-slate-950 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

          {/* OFPPT Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-serif font-black tracking-wider text-sm shadow-md shadow-blue-500/20 border border-blue-400/30">
              OFPPT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-slate-100 tracking-tight">FPA Pilot</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
                  Loi 36.96 / Note 32-2017
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate hidden sm:block">
                Système de Gestion & d'Audit de la Formation Professionnelle Alternée
              </p>
            </div>
          </div>


          {/* User Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCommunicationModalOpen(true)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors relative"
              title="Espace de communication FPA"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-slate-950"></span>
            </button>

            {/* Print Forms Hub */}
            <div className="relative group">
              <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1" title="Imprimés officiels FPA">
                <Printer className="w-5 h-5" />
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>
              <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-500">Imprimés Officiels FPA</div>
                {[
                  { label: 'M01 : Fiche de suivi stagiaires', badge: 'Formateur', color: 'text-blue-400', onClick: () => setIsPrintM01Open(true) },
                  { label: 'M02 : Rapport d\'audit EFP', badge: 'EFP', color: 'text-amber-400', onClick: () => setIsPrintM02Open(true) },
                  { label: 'M03 : Rapport d\'audit DR', badge: 'DR', color: 'text-purple-400', onClick: () => setIsPrintM03Open(true) },
                  { label: 'M04 : Synthèse formateur', badge: 'Formateur', color: 'text-blue-400', onClick: () => setIsPrintM04Open(true) },
                  { label: 'M05 : Indemnisation EFP', badge: 'EFP', color: 'text-amber-400', onClick: () => setIsPrintM05Open(true) },
                  { label: 'M06 : Indemnisation DR', badge: 'DR', color: 'text-purple-400', onClick: () => setIsPrintM06Open(true) },
                ].map(item => (
                  <button key={item.label} onClick={item.onClick}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between">
                    <span>{item.label}</span>
                    <span className={`font-mono text-[10px] ${item.color}`}>{item.badge}</span>
                  </button>
                ))}
                <div className="border-t border-slate-800 my-1"></div>
                <button onClick={() => setIsPrintMinistereOpen(true)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-emerald-400 font-semibold flex items-center justify-between">
                  <span>Tableau Annuel Ministère</span>
                  <span className="font-mono text-emerald-300 text-[10px]">Tutelle</span>
                </button>
              </div>
            </div>

            {/* Profile */}
            <button onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer">
              <div className={`w-2.5 h-2.5 rounded-full ${activeBadge.color}`}></div>
              <div className="hidden md:block text-xs leading-tight">
                <span className="font-bold text-slate-100 block">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400">{activeBadge.label}</span>
              </div>
              <User className="w-4 h-4 text-slate-400" />
            </button>

            <button onClick={() => setIsAuthModalOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Changer de rôle / Se connecter">
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            <button onClick={() => setIsPasswordModalOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Modifier mot de passe">
              <KeyRound className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Sub-header */}
      <div className="no-print bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Rôle Actif :</span>
            <span className={`text-[11px] font-bold text-white px-2.5 py-0.5 rounded-full ${activeBadge.color}`}>
              {activeBadge.label}
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-600 font-medium hidden sm:inline">{currentUser.efp}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>Année de formation : <strong className="text-slate-800">2025/2026</strong></span>
            <span>Réf. Réglementaire : <strong className="text-slate-800">Note DRH N° 32/2017</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content + Right Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">

        {/* Right Role Sidebar */}
        <aside className="no-print hidden lg:flex flex-col items-center gap-2 py-6 px-2 bg-slate-950 border-l border-slate-800 order-last w-16 sticky top-16 self-start h-[calc(100vh-4rem)]">
          {(['efp', 'stagiaire', 'formateur', 'dr'] as UserRole[]).map(role => {
            const colors: Record<UserRole, string> = {
              efp: 'bg-amber-600',
              stagiaire: 'bg-emerald-600',
              formateur: 'bg-blue-600',
              dr: 'bg-purple-600',
            };
            const labels: Record<UserRole, string> = {
              efp: 'Acteur EFP',
              stagiaire: 'Stagiaire',
              formateur: 'Formateur',
              dr: 'Acteur DR',
            };
            return (
              <button
                key={role}
                onClick={() => switchRole(role)}
                title={labels[role]}
                className={`w-10 h-28 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center [writing-mode:vertical-rl] rotate-180 tracking-wide ${
                  currentUser.role === role
                    ? `${colors[role]} text-white shadow-lg`
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {labels[role]}
              </button>
            );
          })}
        </aside>

      <main className="flex-1 p-4 sm:p-6">
        {currentUser.role === 'stagiaire' && (
          <StagiaireView
            currentUser={currentUser}
            stages={stages}
            visites={visites}
            docs={regulatoryDocs}
            onAddStage={handleAddStage}
            onUploadContract={handleUploadContract}
            onOpenContractPrint={handleOpenContractPrint}
            onOpenMessaging={() => setIsCommunicationModalOpen(true)}
          />
        )}
        {currentUser.role === 'formateur' && (
          <FormateurView
            currentUser={currentUser}
            stages={stages}
            visites={visites}
            docs={regulatoryDocs}
            fichesM01={fichesM01}
            onValidateStage={handleValidateStage}
            onAddOrUpdateVisite={handleAddOrUpdateVisite}
            onUploadFicheM01={handleUploadFicheM01}
            onOpenPrintM01={() => setIsPrintM01Open(true)}
            onOpenPrintM04={() => setIsPrintM04Open(true)}
            onOpenMessaging={() => setIsCommunicationModalOpen(true)}
          />
        )}
        {currentUser.role === 'efp' && (
          <ActeurEfpView
            currentUser={currentUser}
            stages={stages}
            visites={visites}
            audits={audits}
            docs={regulatoryDocs}
            affectations={affectations}
            plannings={plannings}
            onAddAudit={handleAddAudit}
            onAddAffectation={handleAddAffectation}
            onAddPlanning={handleAddPlanning}
            onOpenPrintM02={() => setIsPrintM02Open(true)}
            onOpenPrintM05={() => setIsPrintM05Open(true)}
            onOpenMessaging={() => setIsCommunicationModalOpen(true)}
          />
        )}
        {currentUser.role === 'dr' && (
          <ActeurDrView
            currentUser={currentUser}
            stages={stages}
            visites={visites}
            audits={audits}
            docs={regulatoryDocs}
            indemnisations={indemnisations}
            onAddAudit={handleAddAudit}
            onOpenPrintM03={() => setIsPrintM03Open(true)}
            onOpenPrintM06={() => setIsPrintM06Open(true)}
            onOpenPrintMinistere={() => setIsPrintMinistereOpen(true)}
            onOpenMessaging={() => setIsCommunicationModalOpen(true)}
          />
        )}
      </main>
      </div>

      {/* Footer */}
      <footer className="no-print bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">OFPPT - Direction de la Formation / DECQ</span>
            <span>• Formation Professionnelle Alternée (Loi n° 36-96)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Guide Méthodologique 2025/2026</span>
            <span>Procédure DRH Note 32/2017</span>
            <span>Ministère de Tutelle</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={users}
        currentUser={currentUser}
        onSelectUser={(u) => setCurrentUser(u)}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUserUpdate}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userEmail={currentUser.email}
      />
      <CommunicationModal
        isOpen={isCommunicationModalOpen}
        onClose={() => setIsCommunicationModalOpen(false)}
        currentUser={currentUser}
        messages={messages}
        onSendMessage={handleSendMessage}
      />

      {/* Print Modals */}
      <PrintM01Modal isOpen={isPrintM01Open} onClose={() => setIsPrintM01Open(false)}
        stages={stages} visites={visites} formateurName={currentUser.name} groupe="DEV201" />
      <PrintM02Modal isOpen={isPrintM02Open} onClose={() => setIsPrintM02Open(false)}
        audits={audits.filter(a => a.typeAudit === 'EFP')} efpNom={currentUser.efp} />
      <PrintM03Modal isOpen={isPrintM03Open} onClose={() => setIsPrintM03Open(false)}
        audits={audits.filter(a => a.typeAudit === 'DR')} regionNom={currentUser.directionRegionale} />
      <PrintM04Modal isOpen={isPrintM04Open} onClose={() => setIsPrintM04Open(false)}
        stages={stages} visites={visites} formateurName={currentUser.name}
        formateurMatricule={currentUser.matricule || '14582'} efp={currentUser.efp} />
      <PrintM05Modal isOpen={isPrintM05Open} onClose={() => setIsPrintM05Open(false)}
        indemnisations={indemnisations} efpNom={currentUser.efp} directionRegionale={currentUser.directionRegionale} />
      <PrintM06Modal isOpen={isPrintM06Open} onClose={() => setIsPrintM06Open(false)}
        indemnisations={indemnisations} directionRegionale={currentUser.directionRegionale} />
      <PrintContratStageModal isOpen={isPrintContratOpen} onClose={() => setIsPrintContratOpen(false)}
        stage={selectedStageForPrint} />
      <PrintTableauMinistereModal isOpen={isPrintMinistereOpen} onClose={() => setIsPrintMinistereOpen(false)}
        stages={stages} />
    </div>
  );
}
