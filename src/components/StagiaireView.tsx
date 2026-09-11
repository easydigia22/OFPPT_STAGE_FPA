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
  Sparkles
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
}) => {
  const [activeTab, setActiveTab] = useState<'stages' | 'nouveau' | 'documents'>('stages');
  
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
      formateurId: 'user-formateur-1',
      formateurName: 'Mohammed EL ALAMI',
      efp: currentUser.efp,
      directionRegionale: currentUser.directionRegionale,
      dateDebut,
      dateFin,
      dureeHeures,
      missions,
      statut: 'depose',
    });

    setFormFeedback('Votre stage a été enregistré avec succès et soumis au formateur conseiller pour validation.');
    setTimeout(() => {
      setActiveTab('stages');
      setFormFeedback('');
    }, 1200);
  };

  const handleFileChange = (stageId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadContract(stageId, file.name);
    }
  };

  // Filter downloadable docs for trainee
  const traineeDocs = docs.filter(d => d.cible.includes('all') || d.cible.includes('stagiaire'));

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Actions */}
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
                        stage.statut === 'visite_2' || stage.statut === 'termine'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : stage.statut === 'visite_1'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                        Statut : {stage.statut.replace('_', ' ').toUpperCase()}
                      </span>
                      <button
                        onClick={() => onOpenContractPrint(stage)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Imprimer ou prévisualiser le contrat"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Contrat Officiel</span>
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
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900">
            <strong>Documentation officielle FPA :</strong> Téléchargez ci-dessous la demande de stage, le contrat officiel et l'attestation d'assurance requis pour vos démarches en entreprise.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {traineeDocs.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {doc.categorie.replace('_', ' ')}
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
                      if (doc.id === 'doc-contrat-stage' && currentStage) {
                        onOpenContractPrint(currentStage);
                      } else {
                        // Simulate download
                        const element = document.createElement('a');
                        const file = new Blob([`Document officiel OFPPT: ${doc.titre}\nRéférence: ${doc.reference}\nAnnée de formation: 2025/2026\nDate: ${new Date().toLocaleDateString()}`], {type: 'text/plain'});
                        element.href = URL.createObjectURL(file);
                        element.download = doc.fichierNom;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }
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
        </div>
      )}

    </div>
  );
};
