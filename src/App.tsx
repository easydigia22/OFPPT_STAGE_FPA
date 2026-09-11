import React, { useState } from 'react';
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

// Print Modals M01 - M06 + Contrat + Ministère
import { PrintM01Modal } from './components/prints/PrintM01Modal';
import { PrintM02Modal } from './components/prints/PrintM02Modal';
import { PrintM03Modal } from './components/prints/PrintM03Modal';
import { PrintM04Modal } from './components/prints/PrintM04Modal';
import { PrintM05Modal } from './components/prints/PrintM05Modal';
import { PrintM06Modal } from './components/prints/PrintM06Modal';
import { PrintContratStageModal } from './components/prints/PrintContratStageModal';
import { PrintTableauMinistereModal } from './components/prints/PrintTableauMinistereModal';

// Icons
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
  ArrowRightLeft
} from 'lucide-react';

export default function App() {
  // Global State
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUsers[0]); // Default to Trainee or Trainer
  const [stages, setStages] = useState<Stage[]>(mockStages);
  const [visites, setVisites] = useState<Visite[]>(mockVisites);
  const [audits, setAudits] = useState<AuditRecord[]>(mockAudits);
  const [fichesM01, setFichesM01] = useState<FicheM01Uploaded[]>(mockFichesM01);
  const [messages, setMessages] = useState<MessageDiscussion[]>(mockMessages);
  const [regulatoryDocs, setRegulatoryDocs] = useState<RegulatoryDoc[]>(mockRegulatoryDocs);
  const [affectations, setAffectations] = useState<AffectationFPA[]>(mockAffectations);
  const [plannings, setPlannings] = useState<PlanningAnnuel[]>(mockPlannings);

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
  const [selectedStageForPrint, setSelectedStageForPrint] = useState<Stage | null>(mockStages[0]);

  // Role Switching Fast Helper
  const switchRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  // State Mutators
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
  };

  const handleUploadContract = (stageId: string, fileName: string) => {
    setStages(stages.map(s => s.id === stageId ? {
      ...s,
      contratSigneNomFichier: fileName,
      contratSigneDate: new Date().toISOString().split('T')[0],
      statut: 'en_cours'
    } : s));
  };

  const handleValidateStage = (stageId: string) => {
    setStages(stages.map(s => s.id === stageId ? { ...s, statut: 'en_cours' } : s));
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
    }

    // Also update stage status
    setStages(stages.map(s => {
      if (s.id === visiteData.stageId) {
        return {
          ...s,
          statut: visiteData.numeroVisite === 1 ? 'visite_1' : 'visite_2'
        };
      }
      return s;
    }));
  };

  const handleUploadFicheM01 = (ficheData: Omit<FicheM01Uploaded, 'id' | 'dateTeleversement'>) => {
    const newFiche: FicheM01Uploaded = {
      ...ficheData,
      id: `M01-UP-${String(fichesM01.length + 1).padStart(3, '0')}`,
      dateTeleversement: new Date().toISOString().split('T')[0],
    };
    setFichesM01([newFiche, ...fichesM01]);
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

    // Update the visit's audit status
    setVisites(visites.map(v => {
      if (v.id === auditData.visiteId) {
        return {
          ...v,
          statut: typeAudit === 'DR' ? 'auditee_dr' : 'auditee_efp'
        };
      }
      return v;
    }));
  };

  const handleSendMessage = (msgData: Omit<MessageDiscussion, 'id' | 'dateEnvoi' | 'lu'>) => {
    const newMsg: MessageDiscussion = {
      ...msgData,
      id: `MSG-${Date.now()}`,
      dateEnvoi: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      lu: false,
    };
    setMessages([...messages, newMsg]);
  };

  const handleAddAffectation = (affData: Omit<AffectationFPA, 'id' | 'dateAffectation'>) => {
    const newAff: AffectationFPA = {
      ...affData,
      id: `AFF-2026-${String(affectations.length + 1).padStart(3, '0')}`,
      dateAffectation: new Date().toISOString().split('T')[0],
    };
    setAffectations([newAff, ...affectations]);
  };

  const handleAddPlanning = (planData: Omit<PlanningAnnuel, 'id'>) => {
    const newPlan: PlanningAnnuel = {
      ...planData,
      id: `PLAN-2026-${String(plannings.length + 1).padStart(3, '0')}`,
    };
    setPlannings([newPlan, ...plannings]);
  };

  const handleOpenContractPrint = (stage: Stage) => {
    setSelectedStageForPrint(stage);
    setIsPrintContratOpen(true);
  };

  // Get active role visual badge
  const getActiveRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'stagiaire':
        return { label: 'Stagiaire FPA', color: 'bg-emerald-500' };
      case 'formateur':
        return { label: 'Formateur Conseiller FPA', color: 'bg-blue-600' };
      case 'efp':
        return { label: 'Direction EFP', color: 'bg-amber-600' };
      case 'dr':
        return { label: 'Direction Régionale DR', color: 'bg-purple-600' };
    }
  };

  const activeBadge = getActiveRoleBadge(currentUser.role);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      
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
                <span className="font-bold text-sm sm:text-base text-slate-100 tracking-tight">
                  FPA Pilot
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
                  Loi 36.96 / Note 32-2017
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate hidden sm:block">
                Système de Gestion & d'Audit de la Formation Professionnelle Alternée
              </p>
            </div>
          </div>

          {/* Quick Role Switcher Buttons */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => switchRole('stagiaire')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentUser.role === 'stagiaire'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Stagiaire
            </button>
            <button
              onClick={() => switchRole('formateur')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentUser.role === 'formateur'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Formateur
            </button>
            <button
              onClick={() => switchRole('efp')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentUser.role === 'efp'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Acteur EFP
            </button>
            <button
              onClick={() => switchRole('dr')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentUser.role === 'dr'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Acteur DR
            </button>
          </div>

          {/* User Quick Actions */}
          <div className="flex items-center gap-2">
            
            {/* Communication button */}
            <button
              onClick={() => setIsCommunicationModalOpen(true)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors relative"
              title="Espace de communication FPA"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-slate-950"></span>
            </button>

            {/* Print Official Forms Quick Hub */}
            <div className="relative group">
              <button
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1"
                title="Imprimés officiels FPA (M01 à M06)"
              >
                <Printer className="w-5 h-5" />
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>
              
              {/* Dropdown menu */}
              <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-500">Imprimés Officiels FPA</div>
                <button
                  onClick={() => setIsPrintM01Open(true)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>M01 : Fiche de suivi stagiaires</span>
                  <span className="font-mono text-blue-400 text-[10px]">Formateur</span>
                </button>
                <button
                  onClick={() => setIsPrintM02Open(true)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>M02 : Rapport d’audit EFP</span>
                  <span className="font-mono text-amber-400 text-[10px]">EFP</span>
                </button>
                <button
                  onClick={() => setIsPrintM03Open(true)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>M03 : Rapport d’audit DR</span>
                  <span className="font-mono text-purple-400 text-[10px]">DR</span>
                </button>
                <button
                  onClick={() => setIsPrintM04Open(true)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>M04 : Synthèse formateur</span>
                  <span className="font-mono text-blue-400 text-[10px]">Formateur</span>
                </button>
                <button
                  onClick={() => setIsPrintM05Open(true)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>M05 : Indemnisation EFP</span>
                  <span className="font-mono text-amber-400 text-[10px]">EFP</span>
                </button>
                <button
                  onClick={() => setIsPrintM06Open(true)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>M06 : Indemnisation DR</span>
                  <span className="font-mono text-purple-400 text-[10px]">DR</span>
                </button>
                <div className="border-t border-slate-800 my-1"></div>
                <button
                  onClick={() => setIsPrintMinistereOpen(true)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-emerald-400 font-semibold flex items-center justify-between"
                >
                  <span>Tableau Annuel Ministère</span>
                  <span className="font-mono text-emerald-300 text-[10px]">Tutelle</span>
                </button>
              </div>
            </div>

            {/* Profile trigger */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${activeBadge.color}`}></div>
              <div className="hidden md:block text-xs leading-tight">
                <span className="font-bold text-slate-100 block">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400">{activeBadge.label}</span>
              </div>
              <User className="w-4 h-4 text-slate-400" />
            </button>

            {/* Switch user / Auth button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Changer de rôle / Se connecter"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            {/* Change Password */}
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Modifier mot de passe"
            >
              <KeyRound className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Sub-header Context Bar */}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
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
            indemnisations={mockIndemnisationsEfp}
            onAddAudit={handleAddAudit}
            onOpenPrintM03={() => setIsPrintM03Open(true)}
            onOpenPrintM06={() => setIsPrintM06Open(true)}
            onOpenPrintMinistere={() => setIsPrintMinistereOpen(true)}
            onOpenMessaging={() => setIsCommunicationModalOpen(true)}
          />
        )}
      </main>

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
        onUpdateUser={(upd) => {
          setCurrentUser(upd);
          setUsers(users.map(u => u.id === upd.id ? upd : u));
        }}
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

      {/* PRINT MODALS (M01 to M06 + CONTRAT + MINISTERE) */}
      <PrintM01Modal
        isOpen={isPrintM01Open}
        onClose={() => setIsPrintM01Open(false)}
        stages={stages}
        visites={visites}
        formateurName={currentUser.name}
        groupe="DEV201"
      />

      <PrintM02Modal
        isOpen={isPrintM02Open}
        onClose={() => setIsPrintM02Open(false)}
        audits={audits.filter(a => a.typeAudit === 'EFP')}
        efpNom={currentUser.efp}
      />

      <PrintM03Modal
        isOpen={isPrintM03Open}
        onClose={() => setIsPrintM03Open(false)}
        audits={audits.filter(a => a.typeAudit === 'DR')}
        regionNom={currentUser.directionRegionale}
      />

      <PrintM04Modal
        isOpen={isPrintM04Open}
        onClose={() => setIsPrintM04Open(false)}
        stages={stages}
        visites={visites}
        formateurName={currentUser.name}
        formateurMatricule={currentUser.matricule || '14582'}
        efp={currentUser.efp}
      />

      <PrintM05Modal
        isOpen={isPrintM05Open}
        onClose={() => setIsPrintM05Open(false)}
        indemnisations={mockIndemnisationsEfp}
        efpNom={currentUser.efp}
        directionRegionale={currentUser.directionRegionale}
      />

      <PrintM06Modal
        isOpen={isPrintM06Open}
        onClose={() => setIsPrintM06Open(false)}
        indemnisations={mockIndemnisationsEfp}
        directionRegionale={currentUser.directionRegionale}
      />

      <PrintContratStageModal
        isOpen={isPrintContratOpen}
        onClose={() => setIsPrintContratOpen(false)}
        stage={selectedStageForPrint}
      />

      <PrintTableauMinistereModal
        isOpen={isPrintMinistereOpen}
        onClose={() => setIsPrintMinistereOpen(false)}
        stages={stages}
      />

    </div>
  );
}
