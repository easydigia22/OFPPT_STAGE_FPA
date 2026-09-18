import React, { useState } from 'react';
import { Stage, Visite, UserProfile, RegulatoryDoc, FicheM01Uploaded } from '../types';
import { ImportStagiairesModal } from './ImportStagiairesModal';
import { db } from '../lib/db';
import {
  Users,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  Upload,
  PlusCircle,
  FileText,
  Download,
  AlertTriangle,
  MessageSquare,
  Search,
  Filter,
  Eye,
  Check,
  Trash2
} from 'lucide-react';

interface FormateurViewProps {
  currentUser: UserProfile;
  stages: Stage[];
  visites: Visite[];
  docs: RegulatoryDoc[];
  fichesM01: FicheM01Uploaded[];
  onValidateStage: (stageId: string) => void;
  onAddOrUpdateVisite: (visite: Omit<Visite, 'id' | 'formateurId' | 'formateurMatricule' | 'formateurName' | 'efp' | 'directionRegionale'>) => void;
  onUploadFicheM01: (fiche: Omit<FicheM01Uploaded, 'id' | 'dateTeleversement'>) => void;
  onOpenPrintM01: () => void;
  onOpenPrintM04: () => void;
  onOpenMessaging: () => void;
  onDeleteVisite: (id: string) => void;
  onDeleteStage: (id: string) => void;
}

export const FormateurView: React.FC<FormateurViewProps> = ({
  currentUser,
  stages,
  visites,
  docs,
  fichesM01,
  onValidateStage,
  onAddOrUpdateVisite,
  onUploadFicheM01,
  onOpenPrintM01,
  onOpenPrintM04,
  onOpenMessaging,
  onDeleteVisite,
  onDeleteStage,
}) => {
  const [activeTab, setActiveTab] = useState<'stagiaires' | 'visites' | 'imprimes' | 'reglementation'>('stagiaires');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [deleteVisiteId, setDeleteVisiteId] = useState<string | null>(null);
  const [deleteStageId, setDeleteStageId] = useState<string | null>(null);
  const [selectedGroupe, setSelectedGroupe] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Saisie de visite dialog state
  const [isVisiteModalOpen, setIsVisiteModalOpen] = useState(false);
  const [selectedStageForVisite, setSelectedStageForVisite] = useState<Stage | null>(null);
  const [visiteNum, setVisiteNum] = useState<1 | 2>(1);
  const [dateVisite, setDateVisite] = useState<string>(new Date().toISOString().split('T')[0]);
  const [tuteurPresent, setTuteurPresent] = useState(true);
  const [assiduite, setAssiduite] = useState<'Excellente' | 'Bonne' | 'Moyenne' | 'Insuffisante'>('Excellente');
  const [objectifs, setObjectifs] = useState('');
  const [observations, setObservations] = useState('');

  // Upload M01 state
  const [selectedM01File, setSelectedM01File] = useState<string>('');

  // Formateur's trainees
  const formateurStages = stages.filter(s => s.formateurId === currentUser.id);
  
  const filteredStages = formateurStages
    .filter(s => {
      const matchGroupe = selectedGroupe === 'all' || s.groupe === selectedGroupe;
      const matchSearch = s.stagiaireName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.entreprise.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.stagiaireCni.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGroupe && matchSearch;
    })
    .sort((a, b) => (a.statut === 'depose' ? -1 : b.statut === 'depose' ? 1 : 0));

  const formateurVisites = visites.filter(v => v.formateurId === currentUser.id || v.formateurMatricule === currentUser.matricule);

  const openVisiteDialog = (stage: Stage, num: 1 | 2) => {
    setSelectedStageForVisite(stage);
    setVisiteNum(num);
    const existing = formateurVisites.find(v => v.stageId === stage.id && v.numeroVisite === num);
    if (existing) {
      setDateVisite(existing.dateEffectuee || existing.datePrevue);
      setTuteurPresent(existing.tuteurPresent);
      setAssiduite(existing.assiduiteStagiaire);
      setObjectifs(existing.objectifsEvalues);
      setObservations(existing.observations);
    } else {
      setObjectifs(num === 1 ? 'Contrôle d’intégration, vérification du poste de travail et convention de stage.' : 'Bilan de compétences acquises, conformité au découpage et évaluation finale.');
      setObservations('Déplacement sur site effectué. Entretien tripartite réalisé avec le tuteur.');
    }
    setIsVisiteModalOpen(true);
  };

  const handleSaveVisite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStageForVisite) return;

    onAddOrUpdateVisite({
      stageId: selectedStageForVisite.id,
      stagiaireId: selectedStageForVisite.stagiaireId,
      stagiaireName: selectedStageForVisite.stagiaireName,
      stagiaireCni: selectedStageForVisite.stagiaireCni,
      filiere: selectedStageForVisite.filiere,
      groupe: selectedStageForVisite.groupe,
      numeroVisite: visiteNum,
      datePrevue: dateVisite,
      dateEffectuee: dateVisite,
      entrepriseNom: selectedStageForVisite.entreprise.nom,
      ville: selectedStageForVisite.entreprise.ville,
      tuteurPresent,
      tuteurNom: `${selectedStageForVisite.tuteur.nom} ${selectedStageForVisite.tuteur.prenom}`,
      tuteurEmargement: true,
      formateurEmargement: true,
      objectifsEvalues: objectifs,
      assiduiteStagiaire: assiduite,
      observations,
      statut: 'effectuee',
    });

    setIsVisiteModalOpen(false);
  };

  const handleUploadM01 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFicheM01({
        formateurId: currentUser.id,
        formateurNom: currentUser.name,
        groupe: 'DEV201',
        filiere: currentUser.filiere || 'Développement Digital',
        mois: '2026-03',
        nomFichier: file.name,
        cachetEntreprisePresent: true,
        statut: 'valide'
      });
      setSelectedM01File(file.name);
    }
  };

  // Metrics
  const totalStagiaires = formateurStages.length;
  const totalVisitesEffectuees = formateurVisites.filter(v => v.dateEffectuee).length;
  const totalEntreprises = new Set(formateurStages.map(s => s.entreprise.nom)).size;
  const stagesToValidate = formateurStages.filter(s => s.statut === 'depose');
  const groupesEnCharge = [...new Set(formateurStages.map(s => s.groupe).filter(Boolean))];

  return (
    <div className="space-y-6">
      
      {/* Formateur Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold bg-blue-600/30 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Espace Formateur Conseiller FPA
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-100">
                {currentUser.name}
              </h1>
              <span className="text-xs font-mono bg-slate-700 border border-slate-600 text-slate-300 px-2.5 py-0.5 rounded-lg">
                Matricule : <span className="text-white font-bold">{currentUser.matricule || '—'}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              Établissement : <span className="text-slate-200 font-semibold">{currentUser.efp}</span>
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs text-slate-400">Groupes en charge :</span>
              {groupesEnCharge.length > 0 ? (
                groupesEnCharge.map(g => (
                  <span key={g} className="text-[11px] font-bold bg-teal-600/25 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                    {g}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-500 italic">Aucun stage assigné</span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenPrintM01}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Générer Imprimé M01</span>
            </button>
            <button
              onClick={onOpenPrintM04}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Générer Synthèse M04</span>
            </button>
            <button
              onClick={onOpenMessaging}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messagerie EFP / Stagiaires</span>
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Importer stagiaires Excel</span>
            </button>
          </div>
        </div>

        {/* Regulatory Reminder according to Note 32/2017 */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <Clock className="w-4 h-4 shrink-0" />
            <span>
              <strong>Rappel Procédure Indemnisation (Note 32/2017) :</strong> Dépôt des fiches M01 cachetées par les entreprises et de l’état de synthèse M04 au plus tard le <strong>05 du mois M+1</strong>.
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span>Stagiaires : <strong className="text-white">{totalStagiaires}</strong></span>
            <span>Entreprises : <strong className="text-white">{totalEntreprises}</strong></span>
            <span>Visites : <strong className="text-emerald-400">{totalVisitesEffectuees}</strong></span>
          </div>
        </div>
      </div>

      {/* Bannière : contrats en attente de validation */}
      {stagesToValidate.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="text-sm font-bold text-amber-800">
              {stagesToValidate.length} contrat{stagesToValidate.length > 1 ? 's' : ''} déposé{stagesToValidate.length > 1 ? 's' : ''} — validation requise
            </span>
          </div>
          <div className="flex flex-wrap gap-2 flex-1">
            {stagesToValidate.map(s => (
              <div key={s.id} className="flex items-center gap-2 bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-xs">
                <span className="font-bold text-slate-800">{s.stagiaireName}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-600">{s.entreprise.nom}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-500">{s.groupe}</span>
                <button
                  onClick={() => { onValidateStage(s.id); setActiveTab('stagiaires'); }}
                  className="ml-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                >
                  Valider
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('stagiaires')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'stagiaires'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Filières & Stagiaires en charge ({formateurStages.length})</span>
          {stagesToValidate.length > 0 && (
            <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none">
              {stagesToValidate.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('visites')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'visites'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Visites aux Entreprises ({formateurVisites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('imprimes')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'imprimes'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Imprimés M01 & M04 ({fichesM01.length} téléversé)</span>
        </button>

        <button
          onClick={() => setActiveTab('reglementation')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'reglementation'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Réglementation FPA (Guide & Notes)</span>
        </button>
      </div>

      {/* TAB 1: STAGIAIRES & STAGES */}
      {activeTab === 'stagiaires' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom de stagiaire, CNI ou entreprise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent focus:outline-hidden text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Groupe :</span>
              <select
                value={selectedGroupe}
                onChange={(e) => setSelectedGroupe(e.target.value)}
                className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs bg-white focus:outline-hidden"
              >
                <option value="all">Tous les groupes</option>
                <option value="DEV201">DEV201</option>
                <option value="DEV202">DEV202</option>
                <option value="GE201">GE201</option>
              </select>
            </div>
          </div>

          {/* Stagiaires Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Stagiaire</th>
                    <th className="p-3">Filière / Groupe</th>
                    <th className="p-3">Entreprise d'accueil</th>
                    <th className="p-3">Tuteur Entreprise</th>
                    <th className="p-3 text-center">Visite 1</th>
                    <th className="p-3 text-center">Visite 2</th>
                    <th className="p-3 text-center">Contrat signé</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStages.map((stage) => {
                    const v1 = formateurVisites.find(v => v.stageId === stage.id && v.numeroVisite === 1);
                    const v2 = formateurVisites.find(v => v.stageId === stage.id && v.numeroVisite === 2);

                    return (
                      <tr key={stage.id} className={`transition-colors ${stage.statut === 'depose' ? 'bg-amber-50/60 hover:bg-amber-50' : 'hover:bg-slate-50/70'}`}>
                        <td className="p-3">
                          <div className="font-bold text-slate-900 uppercase">{stage.stagiaireName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">CNI: {stage.stagiaireCni}</div>
                          {stage.statut === 'depose' && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded-full">
                              <AlertTriangle className="w-2.5 h-2.5" /> Contrat déposé — à valider
                            </span>
                          )}
                        </td>

                        <td className="p-3">
                          <div className="font-semibold text-slate-800">{stage.filiere}</div>
                          <div className="text-[11px] text-blue-600 font-mono font-bold">{stage.groupe} ({stage.annee})</div>
                        </td>

                        <td className="p-3">
                          <div className="font-semibold text-slate-900">{stage.entreprise.nom}</div>
                          <div className="text-[11px] text-slate-500">{stage.entreprise.ville}</div>
                        </td>

                        <td className="p-3">
                          <div className="text-slate-800 font-medium">{stage.tuteur.nom} {stage.tuteur.prenom}</div>
                          <div className="text-[10px] text-slate-400">{stage.tuteur.telephone}</div>
                        </td>

                        {/* Visite 1 status */}
                        <td className="p-3 text-center">
                          {v1?.dateEffectuee ? (
                            <button
                              onClick={() => openVisiteDialog(stage, 1)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{v1.dateEffectuee}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => openVisiteDialog(stage, 1)}
                              className="text-[10px] font-semibold text-blue-600 hover:bg-blue-50 px-2 py-0.5 rounded border border-blue-200 cursor-pointer"
                            >
                              + Saisir V1
                            </button>
                          )}
                        </td>

                        {/* Visite 2 status */}
                        <td className="p-3 text-center">
                          {v2?.dateEffectuee ? (
                            <button
                              onClick={() => openVisiteDialog(stage, 2)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{v2.dateEffectuee}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => openVisiteDialog(stage, 2)}
                              className="text-[10px] font-semibold text-blue-600 hover:bg-blue-50 px-2 py-0.5 rounded border border-blue-200 cursor-pointer"
                            >
                              + Saisir V2
                            </button>
                          )}
                        </td>

                        {/* Contrat Téléversé */}
                        <td className="p-3 text-center">
                          {stage.contratSigneNomFichier ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Reçu</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                              En attente
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {stage.statut === 'depose' ? (
                              <button
                                onClick={() => onValidateStage(stage.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Valider stage
                              </button>
                            ) : (
                              <button
                                onClick={() => openVisiteDialog(stage, 1)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                              >
                                Gérer visites
                              </button>
                            )}
                            <button onClick={() => setDeleteStageId(stage.id)} title="Supprimer ce stage"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {/* TAB 2: VISITES AUX ENTREPRISES */}
      {activeTab === 'visites' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Journal des Visites de Suivi Réalisées</h3>
                <p className="text-xs text-slate-500">
                  Déplacements sur site des formateurs conseillers FPA conformément au modèle officiel M01.
                </p>
              </div>

              <button
                onClick={onOpenPrintM01}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer la Fiche M01 Complétée</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Visite</th>
                    <th className="p-3">Date effective</th>
                    <th className="p-3">Stagiaire</th>
                    <th className="p-3">Entreprise d'accueil</th>
                    <th className="p-3">Tuteur présent</th>
                    <th className="p-3">Assiduité</th>
                    <th className="p-3">Statut Audit</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {formateurVisites.map((vis) => (
                    <tr key={vis.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded font-mono">
                          {vis.numeroVisite === 1 ? '1ère Visite' : '2ème Visite'}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-semibold">{vis.dateEffectuee || vis.datePrevue}</td>
                      <td className="p-3 font-bold uppercase">{vis.stagiaireName}</td>
                      <td className="p-3">{vis.entrepriseNom} ({vis.ville})</td>
                      <td className="p-3">
                        {vis.tuteurPresent ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Oui ({vis.tuteurNom})</span>
                          </span>
                        ) : (
                          <span className="text-amber-600">Absent</span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{vis.assiduiteStagiaire}</td>
                      <td className="p-3">
                        {vis.statut === 'auditee_dr' ? (
                          <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                            Audité Région (M03)
                          </span>
                        ) : vis.statut === 'auditee_efp' ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            Audité EFP (M02)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            En attente audit 20%
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => setDeleteVisiteId(vis.id)} title="Supprimer cette visite"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: IMPRIMÉS M01 & M04 */}
      {activeTab === 'imprimes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card Imprimé M01 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded">
                Modèle 01 (DRH)
              </span>
              <span className="text-[11px] text-slate-400">Échéance : 05 M+1</span>
            </div>

            <h3 className="font-bold text-base text-slate-900">
              Fiche de suivi de stage par groupe de stagiaires
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Alimentée systématiquement par les visites enregistrées. À faire émarger et cacheter par les entreprises lors de vos visites sur site.
            </p>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Groupe concerné :</span>
                <strong className="text-slate-900">DEV201 (Développement Digital)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Stagiaires listés :</span>
                <strong className="text-slate-900">{formateurStages.length} stagiaires</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Statut justificatif :</span>
                {fichesM01.length > 0 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Fiche cachetée téléversée</span>
                  </span>
                ) : (
                  <span className="text-amber-600 font-semibold">À téléverser après visite</span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={onOpenPrintM01}
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer M01 Vierge / Remplie</span>
              </button>

              <label className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
                <Upload className="w-4 h-4" />
                <span>Téléverser M01 signée</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg"
                  onChange={handleUploadM01}
                  className="hidden"
                />
              </label>
            </div>

            {selectedM01File && (
              <p className="text-[11px] text-emerald-700 font-medium bg-emerald-50 p-2 rounded border border-emerald-200">
                Fichier enregistré : {selectedM01File}
              </p>
            )}
          </div>

          {/* Card Imprimé M04 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded">
                Modèle 04 (DRH)
              </span>
              <span className="text-[11px] text-slate-400">Échéance : 05 M+1</span>
            </div>

            <h3 className="font-bold text-base text-slate-900">
              État de synthèse récapitulant les stagiaires et entreprises
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bordereau mensuel certifié sur l’honneur par le formateur avec mention légale obligatoire <em>"Informations certifiées exactes"</em> pour liquidation des indemnités de suivi.
            </p>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Effectif global stagiaires :</span>
                <strong className="text-slate-900">{totalStagiaires}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Entreprises effectivement visitées :</span>
                <strong className="text-slate-900">{totalEntreprises}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Indemnité estimée (Barème DRH) :</span>
                <strong className="text-emerald-700 font-mono font-bold">2 400,00 DH</strong>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenPrintM04}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Générer & Imprimer l’État M04</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: REGLEMENTATION FPA */}
      {activeTab === 'reglementation' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900">
            <strong>Cadre Réglementaire de la FPA :</strong> Consultez ci-dessous les textes de référence, guides méthodologiques et notes de service applicables à l’encadrement et l’indemnisation des formateurs.
          </div>

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
                      if (doc.fileUrls && doc.fileUrls.length > 0) {
                        doc.fileUrls.forEach((url, i) => {
                          setTimeout(() => {
                            const ext = url.split('.').pop() ?? 'pdf';
                            const base = doc.fichierNom.replace(/\.[^.]+$/, '');
                            const name = doc.fileUrls!.length > 1 ? `${base}_page${i + 1}.${ext}` : doc.fichierNom;
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = name;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }, i * 300);
                        });
                      }
                    }}
                    disabled={!doc.fileUrls?.length}
                    title={!doc.fileUrls?.length ? 'Document non encore disponible' : undefined}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed text-blue-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
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

      {/* Saisie de visite Modal */}
      {isVisiteModalOpen && selectedStageForVisite && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Saisie de la {visiteNum === 1 ? '1ère Visite' : '2ème Visite'} en Entreprise
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Stagiaire : <strong className="text-slate-800">{selectedStageForVisite.stagiaireName}</strong> ({selectedStageForVisite.entreprise.nom})
            </p>

            <form onSubmit={handleSaveVisite} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date de la visite *</label>
                  <input
                    type="date"
                    required
                    value={dateVisite}
                    onChange={(e) => setDateVisite(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assiduité Stagiaire</label>
                  <select
                    value={assiduite}
                    onChange={(e) => setAssiduite(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Excellente">Excellente</option>
                    <option value="Bonne">Bonne</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Insuffisante">Insuffisante</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  id="tuteurCheck"
                  checked={tuteurPresent}
                  onChange={(e) => setTuteurPresent(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="tuteurCheck" className="text-xs font-medium text-slate-800 cursor-pointer">
                  Tuteur entreprise présent lors de la visite ({selectedStageForVisite.tuteur.nom} {selectedStageForVisite.tuteur.prenom})
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Objectifs et points abordés</label>
                <textarea
                  rows={2}
                  value={objectifs}
                  onChange={(e) => setObjectifs(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Observations du formateur</label>
                <textarea
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsVisiteModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Enregistrer la visite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation suppression visite */}
      {deleteVisiteId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Supprimer cette visite ?</h3>
              <p className="text-xs text-slate-500 mt-1">L'enregistrement de cette visite sera définitivement supprimé.</p>
            </div>
            <div className="flex gap-3 justify-center pt-1">
              <button onClick={() => setDeleteVisiteId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                Annuler
              </button>
              <button onClick={() => { onDeleteVisite(deleteVisiteId); setDeleteVisiteId(null); }}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer">
                Supprimer définitivement
              </button>
            </div>
          </div>
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

      <ImportStagiairesModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        efp={currentUser.efp}
        directionRegionale={currentUser.directionRegionale}
        onImport={async (stagiaires) => {
          await db.profiles.bulkUpsert(stagiaires);
        }}
      />
    </div>
  );
};
