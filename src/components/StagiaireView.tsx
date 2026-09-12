import React, { useState } from 'react';
import { Stage, UserProfile, RegulatoryDoc, Visite } from '../types';
import {
  FileText,
  PlusCircle,
  Upload,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Briefcase,
  Printer,
  ChevronRight,
  Sparkles,
  Trash2,
  User,
  KeyRound,
  ArrowRight,
  Shield,
  Star
} from 'lucide-react';

interface StagiaireViewProps {
  currentUser: UserProfile;
  stages: Stage[];
  visites: Visite[];
  docs: RegulatoryDoc[];
  onAddStage: (stage: Omit<Stage, 'id' | 'dateCreation' | 'stagiaireId' | 'stagiaireName' | 'stagiaireCni' | 'stagiaireTelephone'>) => void;
  onUploadContract: (stageId: string, fileName: string) => void;
  onOpenContractPrint: (stage: Stage) => void;
  onOpenMessaging: () => void;
  onDeleteStage: (id: string) => void;
  onOpenProfile: () => void;
  onOpenPassword: () => void;
}

export const StagiaireView: React.FC<StagiaireViewProps> = ({
  currentUser,
  stages,
  visites,
  docs,
  onAddStage,
  onUploadContract,
  onOpenContractPrint,
  onOpenMessaging,
  onDeleteStage,
  onOpenProfile,
  onOpenPassword,
}) => {
  const [activeTab, setActiveTab] = useState<'stages' | 'nouveau' | 'documents'>('stages');
  const [deleteStageId, setDeleteStageId] = useState<string | null>(null);
  
  // New stage form state
  const [nomEntreprise, setNomEntreprise] = useState('');
  const [ville, setVille] = useState('Casablanca');
  const [adresse, setAdresse] = useState('');
  const [secteur, setSecteur] = useState('Technologies de l’Information & Digital');
  const [telephoneEntreprise, setTelephoneEntreprise] = useState('');
  const [tuteurNom, setTuteurNom] = useState('');
  const [tuteurPrenom, setTuteurPrenom] = useState('');
  const [tuteurFonction, setTuteurFonction] = useState('');
  const [tuteurTel, setTuteurTel] = useState('');
  const [tuteurEmail, setTuteurEmail] = useState('');
  const [dateDebut, setDateDebut] = useState('2026-02-01');
  const [dateFin, setDateFin] = useState('2026-06-30');
  const [dureeHeures, setDureeHeures] = useState<number>(800);
  const [missions, setMissions] = useState('');
  const [formFeedback, setFormFeedback] = useState('');

  // Filter stages of this trainee
  const myStages = stages.filter(s => s.stagiaireId === currentUser.id);
  const currentStage = myStages[0] || null;

  const handleStageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomEntreprise || !tuteurNom) {
      setFormFeedback('Veuillez remplir le nom de l’entreprise et les coordonnées du tuteur.');
      return;
    }

    onAddStage({
      filiere: currentUser.filiere || 'Développement Digital',
      groupe: currentUser.groupe || 'DEV201',
      annee: '2A',
      niveau: 'TS',
      mode: 'FPA',
      optimise: true,
      entreprise: {
        nom: nomEntreprise,
        ville,
        adresse,
        secteur,
        telephone: telephoneEntreprise,
      },
      tuteur: {
        nom: tuteurNom,
        prenom: tuteurPrenom,
        fonction: tuteurFonction,
        telephone: tuteurTel,
        email: tuteurEmail,
      },
      formateurId: '',
      formateurName: '',
      efp: currentUser.efp,
      directionRegionale: currentUser.directionRegionale,
      dateDebut,
      dateFin,
      dureeHeures,
      missions,
      statut: 'en_recherche',
    });

    setFormFeedback("Votre stage a été enregistré. Téléversez maintenant le contrat signé et cacheté par l'entreprise pour le soumettre à votre formateur.");
    setTimeout(() => {
      setActiveTab('stages');
      setFormFeedback('');
    }, 1800);
  };

  const handleFileChange = (stageId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadContract(stageId, file.name);
    }
  };

  // Filter downloadable docs for trainee
  const traineeDocs = docs.filter(d => d.cible.includes('all') || d.cible.includes('stagiaire'));

  const profileComplete = !!currentUser.cvFileName;

  // Statut labels français
  const statutLabel: Record<string, { label: string; color: string }> = {
    en_recherche: { label: 'En recherche', color: 'bg-amber-50 text-amber-800 border-amber-300' },
    depose:       { label: 'Contrat déposé', color: 'bg-blue-50 text-blue-800 border-blue-300' },
    valide_formateur: { label: 'Validé formateur', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    rejete_formateur: { label: 'Rejeté', color: 'bg-red-50 text-red-800 border-red-300' },
    visite_1:     { label: '1ère visite effectuée', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    visite_2:     { label: '2ème visite effectuée', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    termine:      { label: 'Terminé', color: 'bg-slate-100 text-slate-600 border-slate-300' },
    evalue:       { label: 'Évalué', color: 'bg-purple-50 text-purple-800 border-purple-300' },
  };

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
              Espace Stagiaire FPA
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Bienvenue, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Filière : <strong className="text-white">{currentUser.filiere}</strong> | Groupe : <strong className="text-white">{currentUser.groupe}</strong> | {currentUser.efp}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenProfile}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Mon Profil</span>
              {!profileComplete && (
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" title="Profil incomplet — CV manquant" />
              )}
            </button>
            <button
              onClick={onOpenPassword}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Mot de passe</span>
            </button>
            <button
              onClick={() => setActiveTab('nouveau')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Déclarer un stage</span>
            </button>
            <button
              onClick={onOpenMessaging}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contacter Formateur</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alerte profil incomplet */}
      {!profileComplete && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900">
          <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong>Complétez votre profil :</strong> Ajoutez votre CV pour qu'il soit consultable par votre formateur et les entreprises partenaires.
          </div>
          <button
            onClick={onOpenProfile}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shrink-0 cursor-pointer"
          >
            Compléter
          </button>
        </div>
      )}

      {/* Guide Workflow — Processus de stage en 4 étapes */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Processus de réalisation du stage FPA — Étapes à suivre
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 text-xs">
          {[
            {
              num: '1',
              title: 'Télécharger les documents',
              desc: 'Contrat, Demande de stage & Assurance',
              icon: <Download className="w-4 h-4" />,
              done: true,
              onClick: () => setActiveTab('documents'),
            },
            {
              num: '2',
              title: 'Déclarer le stage',
              desc: 'Saisir entreprise & tuteur',
              icon: <PlusCircle className="w-4 h-4" />,
              done: myStages.length > 0,
              onClick: () => setActiveTab('nouveau'),
            },
            {
              num: '3',
              title: 'Déposer le contrat signé',
              desc: "Cacheté et signé par l'entreprise",
              icon: <Upload className="w-4 h-4" />,
              done: myStages.some(s => !!s.contratSigneNomFichier),
              onClick: () => setActiveTab('stages'),
            },
            {
              num: '4',
              title: 'Suivi formateur',
              desc: 'Visites & communication',
              icon: <MessageSquare className="w-4 h-4" />,
              done: myStages.some(s => s.statut === 'visite_1' || s.statut === 'visite_2' || s.statut === 'termine' || s.statut === 'evalue'),
              onClick: onOpenMessaging,
            },
          ].map((step, i, arr) => (
            <React.Fragment key={step.num}>
              <button
                onClick={step.onClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer text-left flex-1 min-w-0 ${
                  step.done
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/40'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                  step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {step.done ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate">{step.title}</p>
                  <p className="text-[11px] opacity-70 truncate">{step.desc}</p>
                </div>
              </button>
              {i < arr.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 hidden sm:block mx-1" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('stages')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'stages'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Mes Stages ({myStages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('nouveau')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'nouveau'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ajouter un stage</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'documents'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Documents FPA à télécharger ({traineeDocs.length})</span>
        </button>
      </div>

      {/* TAB 1: LISTE DE MES STAGES */}
      {activeTab === 'stages' && (
        <div className="space-y-4">
          {myStages.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Aucun stage enregistré pour le moment</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Téléchargez d'abord votre contrat et demande de stage dans l'onglet Documents, puis ajoutez les coordonnées de votre entreprise d'accueil dès confirmation.
              </p>
              <button
                onClick={() => setActiveTab('nouveau')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ajouter un stage</span>
              </button>
            </div>
          ) : (
            myStages.map((stage) => {
              const stageVisites = visites.filter(v => v.stageId === stage.id);
              const v1 = stageVisites.find(v => v.numeroVisite === 1);
              const v2 = stageVisites.find(v => v.numeroVisite === 2);

              return (
                <div key={stage.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  {/* Top card bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {stage.id}
                        </span>
                        <span className="text-xs font-bold text-slate-500">{stage.filiere} ({stage.groupe})</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <span>{stage.entreprise.nom}</span>
                        <span className="text-xs font-medium text-slate-500">({stage.entreprise.ville})</span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        (statutLabel[stage.statut] || { color: 'bg-slate-100 text-slate-700 border-slate-200' }).color
                      }`}>
                        {(statutLabel[stage.statut] || { label: stage.statut }).label}
                      </span>
                      <button
                        onClick={() => onOpenContractPrint(stage)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Imprimer ou prévisualiser le contrat"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Contrat Officiel</span>
                      </button>
                      <button
                        onClick={() => setDeleteStageId(stage.id)}
                        title="Supprimer ce stage"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Stage Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                      <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">Tuteur Entreprise</span>
                      <p className="font-semibold text-slate-900">{stage.tuteur.nom} {stage.tuteur.prenom}</p>
                      <p className="text-slate-500">{stage.tuteur.fonction}</p>
                      <p className="text-slate-500 font-mono text-[11px]">Tél : {stage.tuteur.telephone}</p>
                      <p className="text-slate-500 text-[11px] truncate">{stage.tuteur.email}</p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                      <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">Période & Volume FPA</span>
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>Du {stage.dateDebut} au {stage.dateFin}</span>
                      </div>
                      <p className="text-slate-600">Volume total : <strong className="text-blue-900 font-bold">{stage.dureeHeures} heures</strong> en entreprise</p>
                      <p className="text-slate-500">Formateur référent : <strong>{stage.formateurName}</strong></p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                      <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">Évaluation & Missions</span>
                      <p className="text-slate-600 line-clamp-2">{stage.missions}</p>
                      {stage.noteEvaluation && (
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                            Note Finale : {stage.noteEvaluation} / 20
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document Televersement Section: Contrat de stage cacheté et signé */}
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span>Contrat de stage cacheté et signé par l’entreprise</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Obligation réglementaire avant le démarrage du stage (Note DF/DECQ 835/2025).
                        </p>
                      </div>

                      {stage.contratSigneNomFichier ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg font-semibold border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{stage.contratSigneNomFichier}</span>
                          </div>
                          <label className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                            Remplacer
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg"
                              onChange={(e) => handleFileChange(stage.id, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser le contrat cacheté (PDF)</span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg"
                            onChange={(e) => handleFileChange(stage.id, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Visites de suivi effectuées par le formateur */}
                  <div className="border-t border-slate-100 pt-3">
                    <h4 className="text-xs font-bold text-slate-800 mb-2">Suivi des visites du formateur en entreprise :</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className={`p-3 rounded-xl border ${v1 ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">1ère Visite (Intégration & Cadre)</span>
                          {v1 ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Effectuée le {v1.dateEffectuee || v1.datePrevue}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">À planifier</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {v1 ? v1.observations : 'Le formateur effectuera la 1ère visite pour valider l’environnement de travail avec votre tuteur.'}
                        </p>
                      </div>

                      <div className={`p-3 rounded-xl border ${v2 ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">2ème Visite (Bilan & Évaluation)</span>
                          {v2 ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Effectuée le {v2.dateEffectuee || v2.datePrevue}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">À planifier</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {v2 ? v2.observations : 'Cette visite finale clôture le livret FPA et recueille l’évaluation du tuteur.'}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: NOUVEAU STAGE FORM */}
      {activeTab === 'nouveau' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="pb-4 mb-5 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Formulaire d'enregistrement d'un stage en entreprise</h3>
            <p className="text-xs text-slate-500">
              Renseignez les données issues de la convention d'accueil signée avec l'entreprise partenaire.
            </p>
          </div>

          <form onSubmit={handleStageSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom de l'entreprise d'accueil *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Capgemini Maroc, Safran, Renault..."
                  value={nomEntreprise}
                  onChange={(e) => setNomEntreprise(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ville d'accueil *</label>
                <select
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Casablanca">Casablanca</option>
                  <option value="Nouaceur">Nouaceur</option>
                  <option value="Mohammedia">Mohammedia</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Kénitra">Kénitra</option>
                  <option value="Tanger">Tanger</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse complète</label>
                <input
                  type="text"
                  placeholder="ex: Casanearshore Park, Shore 13"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Secteur d'activité</label>
                <input
                  type="text"
                  placeholder="ex: IT, Aéronautique, Finance, Automobile..."
                  value={secteur}
                  onChange={(e) => setSecteur(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {/* Tuteur info */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-xs text-slate-800 block uppercase tracking-wider">
                Coordonnées du Tuteur en Entreprise (Interlocuteur direct du formateur)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Nom du tuteur *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nom de famille"
                    value={tuteurNom}
                    onChange={(e) => setTuteurNom(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Prénom du tuteur</label>
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={tuteurPrenom}
                    onChange={(e) => setTuteurPrenom(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Fonction / Poste</label>
                  <input
                    type="text"
                    placeholder="ex: Lead Tech, Resp. RH"
                    value={tuteurFonction}
                    onChange={(e) => setTuteurFonction(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Téléphone direct</label>
                  <input
                    type="tel"
                    placeholder="+212 6..."
                    value={tuteurTel}
                    onChange={(e) => setTuteurTel(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">E-mail professionnel</label>
                  <input
                    type="email"
                    placeholder="tuteur@entreprise.ma"
                    value={tuteurEmail}
                    onChange={(e) => setTuteurEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Dates & missions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date Début</label>
                <input
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date Fin</label>
                <input
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Volume horaire entreprise</label>
                <select
                  value={dureeHeures}
                  onChange={(e) => setDureeHeures(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value={800}>800 Heures (Cursus 2 ans - 50% MH)</option>
                  <option value={1120}>1120 Heures (Cursus 5 semestres)</option>
                  <option value={400}>400 Heures (Stage fin de formation)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Missions prévues & Compétences visées</label>
              <textarea
                rows={3}
                value={missions}
                onChange={(e) => setMissions(e.target.value)}
                placeholder="Décrivez brièvement les travaux et technologies sur lesquels vous interviendrez en entreprise..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-500 resize-none"
              />
            </div>

            {formFeedback && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-200">
                {formFeedback}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setActiveTab('stages')}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                Enregistrer et soumettre au formateur
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: DOCUMENTS REGLEMENTAIRES & FORMULAIRES FPA */}
      {activeTab === 'documents' && (
        <div className="space-y-5">

          {/* Section : 3 documents obligatoires pour la recherche de stage */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">Documents obligatoires pour la réalisation du stage</h3>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 mb-3">
              Téléchargez ces 3 documents <strong>avant de prospecter les entreprises</strong>. Ils vous seront demandés lors de votre démarche et lors du dépôt du contrat.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'doc-contrat-stage', badge: 'Contrat de stage', badgeColor: 'bg-blue-100 text-blue-800 border-blue-300' },
                { id: 'doc-demande-stage', badge: 'Demande de stage', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
                { id: 'doc-assurance-stage', badge: 'Attestation assurance', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300' },
              ].map(({ id, badge, badgeColor }) => {
                const doc = traineeDocs.find(d => d.id === id);
                if (!doc) return null;
                return (
                  <div key={doc.id} className="bg-white rounded-xl p-4 border-2 border-blue-100 hover:border-blue-300 shadow-xs flex flex-col justify-between transition-colors">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor} mb-2 inline-block`}>
                        {badge}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mb-1 leading-tight">{doc.titre}</h4>
                      <p className="text-[11px] text-slate-500">{doc.description}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-slate-400 truncate">{doc.tailleMo}</span>
                      <button
                        onClick={() => {
                          if (doc.id === 'doc-contrat-stage' && currentStage) {
                            onOpenContractPrint(currentStage);
                          } else {
                            const element = document.createElement('a');
                            const file = new Blob([`Document officiel OFPPT: ${doc.titre}\nRéférence: ${doc.reference}\nAnnée de formation: 2025/2026\nDate: ${new Date().toLocaleDateString()}`], { type: 'text/plain' });
                            element.href = URL.createObjectURL(file);
                            element.download = doc.fichierNom;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Autres documents disponibles */}
          {traineeDocs.filter(d => !['doc-contrat-stage', 'doc-demande-stage', 'doc-assurance-stage'].includes(d.id)).length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Autres documents & guides disponibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {traineeDocs
                  .filter(d => !['doc-contrat-stage', 'doc-demande-stage', 'doc-assurance-stage'].includes(d.id))
                  .map((doc) => (
                    <div key={doc.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                            {doc.categorie.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{doc.tailleMo}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mb-1">{doc.titre}</h4>
                        <p className="text-xs text-slate-500">{doc.description}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
                        <span className="text-[10px] font-mono text-slate-400 truncate">{doc.reference}</span>
                        <button
                          onClick={() => {
                            const element = document.createElement('a');
                            const file = new Blob([`Document officiel OFPPT: ${doc.titre}\nRéférence: ${doc.reference}\nAnnée de formation: 2025/2026\nDate: ${new Date().toLocaleDateString()}`], { type: 'text/plain' });
                            element.href = URL.createObjectURL(file);
                            element.download = doc.fichierNom;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ml-2"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Télécharger</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation suppression stage */}
      {deleteStageId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Supprimer ce stage ?</h3>
              <p className="text-xs text-slate-500 mt-1">Cette convention de stage sera définitivement supprimée.</p>
            </div>
            <div className="flex gap-3 justify-center pt-1">
              <button onClick={() => setDeleteStageId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                Annuler
              </button>
              <button onClick={() => { onDeleteStage(deleteStageId); setDeleteStageId(null); }}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer">
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
