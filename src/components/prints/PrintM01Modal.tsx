import React from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { Stage, Visite } from '../../types';

interface PrintM01ModalProps {
  isOpen: boolean;
  onClose: () => void;
  stages: Stage[];
  visites: Visite[];
  formateurName: string;
  filiere?: string;
  groupe?: string;
  efp?: string;
  directionRegionale?: string;
}

export const PrintM01Modal: React.FC<PrintM01ModalProps> = ({
  isOpen,
  onClose,
  stages,
  visites,
  formateurName,
  filiere = 'Développement Digital',
  groupe = 'DEV201',
  efp = 'ISFO Casablanca (Sidi Maârouf)',
  directionRegionale = 'DR Casablanca-Settat',
}) => {
  if (!isOpen) return null;

  const currentMonth = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  // Filter stages for this group
  const groupStages = stages.filter(s => s.groupe === groupe || stages.length <= 6);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Toolbar (hidden in print) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">MODÈLE M01</span>
            <h2 className="font-semibold text-sm sm:text-base text-slate-100">Fiche de Suivi des Stagiaires en Entreprises (Officiel OFPPT)</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="printable-btn flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              title="Imprimer ou Enregistrer en PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="print-area flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-black font-sans text-xs">
          
          {/* Official Document Header */}
          <div className="border-2 border-black p-4 mb-3">
            <div className="flex items-start justify-between border-b-2 border-black pb-2 mb-3">
              <div>
                <span className="font-bold text-xs uppercase tracking-wider block">DRH</span>
                <span className="font-bold text-sm block text-blue-900">Modèle 01</span>
              </div>
              <div className="text-center flex-1 px-4">
                <h1 className="font-black text-base sm:text-lg uppercase tracking-tight text-slate-900">
                  FICHE DE SUIVI DES STAGIAIRES EN ENTREPRISES
                </h1>
                <p className="text-[10px] text-slate-600 font-medium">Direction de la Formation & Direction des Ressources Humaines - OFPPT</p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 border border-slate-300 rounded flex items-center justify-center font-serif text-[10px] font-bold text-blue-900 bg-slate-50">
                  OFPPT
                </div>
              </div>
            </div>

            {/* Header Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
              <div className="flex items-center">
                <span className="font-bold w-36">Direction Régionale :</span>
                <span className="border-b border-dotted border-black flex-1 font-semibold">{directionRegionale}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold w-36">Établissement (EFP) :</span>
                <span className="border-b border-dotted border-black flex-1 font-semibold">{efp}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold w-36">Filière :</span>
                <span className="border-b border-dotted border-black flex-1 font-semibold">{filiere}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">Optimisé :</span>
                <label className="flex items-center gap-1 font-semibold">
                  <span className="w-3.5 h-3.5 border border-black rounded-full inline-flex items-center justify-center text-[9px] bg-black text-white">✓</span>
                  OUI
                </label>
                <label className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 border border-black rounded-full inline-block"></span>
                  NON
                </label>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold w-36">Mode de formation :</span>
                <label className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 border border-black rounded-full inline-block"></span>
                  Résidentiel
                </label>
                <label className="flex items-center gap-1 font-semibold">
                  <span className="w-3.5 h-3.5 border border-black rounded-full inline-flex items-center justify-center text-[9px] bg-black text-white">✓</span>
                  FPA (Alternée)
                </label>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">Année :</span>
                <label className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 border border-black rounded-full inline-block"></span>
                  1A
                </label>
                <label className="flex items-center gap-1 font-semibold">
                  <span className="w-3.5 h-3.5 border border-black rounded-full inline-flex items-center justify-center text-[9px] bg-black text-white">✓</span>
                  2A
                </label>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold w-36">Niveau :</span>
                {['S', 'Q', 'T', 'TS'].map((lvl) => (
                  <span key={lvl} className="flex items-center gap-1 font-semibold">
                    <span className={`w-3.5 h-3.5 border border-black rounded-full inline-flex items-center justify-center text-[9px] ${lvl === 'TS' ? 'bg-black text-white font-bold' : ''}`}>
                      {lvl === 'TS' ? '✓' : ''}
                    </span>
                    {lvl}
                  </span>
                ))}
              </div>
              <div className="flex items-center">
                <span className="font-bold w-20">Groupe :</span>
                <span className="border-b border-dotted border-black flex-1 font-semibold">{groupe}</span>
                <span className="font-bold ml-4 mr-2">Mois de stage :</span>
                <span className="border-b border-dotted border-black flex-1 font-semibold capitalize">{currentMonth}</span>
              </div>
            </div>
          </div>

          {/* Stagiaires & Visites Table (Page 10 exact format) */}
          <div className="border-2 border-black mb-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-black bg-slate-100 font-bold text-center">
                  <th className="border-r-2 border-black p-2 w-44">Dates des visites</th>
                  <th className="border-r-2 border-black p-2 w-56">Nom & prénom des stagiaires visités</th>
                  <th className="border-r-2 border-black p-2">Entreprise d’accueil (Ajouter la ville)</th>
                  <th className="p-2 w-56">Émargement du Tuteur et Cachet de l’entreprise</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {groupStages.slice(0, 6).map((stg) => {
                  const v1 = visites.find(v => v.stageId === stg.id && v.numeroVisite === 1);
                  const v2 = visites.find(v => v.stageId === stg.id && v.numeroVisite === 2);
                  return (
                    <tr key={stg.id} className="align-top">
                      {/* Dates des visites */}
                      <td className="border-r-2 border-black p-2 font-mono text-[10px]">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="font-bold text-slate-800">1ère V :</span>
                          <span className="font-semibold">{v1?.dateEffectuee || v1?.datePrevue || '...../...../2026'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">2ème V :</span>
                          <span className="font-semibold">{v2?.dateEffectuee || v2?.datePrevue || '...../...../2026'}</span>
                        </div>
                      </td>

                      {/* Stagiaire Details */}
                      <td className="border-r-2 border-black p-2">
                        <div className="font-bold text-slate-900 uppercase">{stg.stagiaireName}</div>
                        <div className="text-slate-600 font-mono text-[9px] mt-0.5">CNI: {stg.stagiaireCni}</div>
                        <div className="text-slate-500 text-[9px]">Tél: {stg.stagiaireTelephone}</div>
                      </td>

                      {/* Entreprise d'accueil */}
                      <td className="border-r-2 border-black p-2">
                        <div className="font-bold text-slate-900">{stg.entreprise.nom}</div>
                        <div className="text-slate-600 text-[9px]">{stg.entreprise.adresse} - <span className="font-semibold text-black">{stg.entreprise.ville}</span></div>
                        <div className="text-slate-500 text-[9px] mt-0.5">Tuteur: {stg.tuteur.nom} {stg.tuteur.prenom} ({stg.tuteur.fonction})</div>
                      </td>

                      {/* Emargement Tuteur et Cachet */}
                      <td className="p-2 relative min-h-[65px] bg-slate-50/40">
                        {v1?.tuteurEmargement ? (
                          <div className="flex items-center gap-2 border border-dashed border-emerald-600 bg-emerald-50/70 p-1.5 rounded text-[9px] text-emerald-800 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <div>
                              <div>Cachet & Signature confirmés</div>
                              <div className="text-[8px] text-slate-500 font-mono">Tuteur: {stg.tuteur.nom}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-slate-400 text-center italic text-[9px] pt-4">
                            Emplacement Cachet & Signature de l’entreprise
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Signatures (Page 10 exact format) */}
          <div className="border-2 border-black grid grid-cols-3 divide-x-2 divide-black text-center text-[10px]">
            <div className="p-3 min-h-[95px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">Émargement Formateur</span>
              <div className="text-slate-700 font-medium">
                <span className="font-bold text-black">{formateurName}</span>
                <p className="text-[9px] text-slate-500 italic">"Informations certifiées exactes"</p>
              </div>
            </div>
            <div className="p-3 min-h-[95px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">Vérifié par le Directeur Pédagogique et / ou Resp. Formation</span>
              <div className="text-slate-400 text-[9px] italic">Signature & Date de vérification</div>
            </div>
            <div className="p-3 min-h-[95px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">Validé par le Directeur de l’EFP / CFP</span>
              <div className="text-slate-400 text-[9px] italic">Cachet de l’EFP & Signature Directeur</div>
            </div>
          </div>

          {/* Mandatory regulatory note */}
          <div className="mt-3 text-[9px] text-slate-500 text-center italic">
            * Modèle officiel DRH 01 - Pièce justificative obligatoire pour l’acte d’indemnisation du formateur (Réf: Note DRH 32/2017).
          </div>
        </div>

      </div>
    </div>
  );
};
