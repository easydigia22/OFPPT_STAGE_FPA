import React from 'react';
import { X, Printer } from 'lucide-react';
import { Stage, Visite } from '../../types';

interface PrintM04ModalProps {
  isOpen: boolean;
  onClose: () => void;
  stages: Stage[];
  visites: Visite[];
  formateurName: string;
  formateurMatricule?: string;
  efp?: string;
  directionRegionale?: string;
}

export const PrintM04Modal: React.FC<PrintM04ModalProps> = ({
  isOpen,
  onClose,
  stages,
  visites,
  formateurName,
  formateurMatricule = '14582',
  efp = 'ISFO Casablanca (Sidi Maârouf)',
  directionRegionale = 'DR Casablanca-Settat',
}) => {
  if (!isOpen) return null;

  const currentPeriod = new Date().toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' });

  // Calculate unique companies visited
  const visitedCompanies = new Set(visites.filter(v => v.dateEffectuee).map(v => v.entrepriseNom));
  const uniqueVisitedCount = visitedCompanies.size || 2;

  // Stagiaires encadrés
  const stagiairesEncadresCount = stages.length || 3;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Toolbar */}
        <div className="no-print bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded">MODÈLE M04</span>
            <h2 className="font-semibold text-sm sm:text-base text-slate-100">État de Synthèse des Visites (Formateur)</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="printable-btn flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
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

        {/* Printable Area */}
        <div className="print-area flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-black font-sans text-xs">
          
          {/* Header */}
          <div className="border-2 border-black p-4 mb-3">
            <div className="flex items-start justify-between border-b-2 border-black pb-2 mb-3">
              <div>
                <span className="font-bold text-xs uppercase tracking-wider block">D.R.H</span>
                <span className="font-bold text-sm block text-blue-900">Modèle 04</span>
              </div>
              <div className="text-center flex-1 px-4">
                <h1 className="font-black text-base sm:text-lg uppercase tracking-tight text-slate-900">
                  ÉTAT DE SYNTHÈSE DES STAGIAIRES ET ENTREPRISES OBJETS DE VISITES
                </h1>
                <p className="text-[10px] text-slate-600 font-medium">Récapitulatif mensuel pour l’indemnisation des formateurs de suivi</p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 border border-slate-300 rounded flex items-center justify-center font-serif text-[10px] font-bold text-blue-900 bg-slate-50">
                  OFPPT
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
              <div className="flex items-center">
                <span className="font-bold w-48">Direction Régionale :</span>
                <span className="border-b border-dotted border-black flex-1 font-semibold">{directionRegionale}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold w-48">Mois / Année :</span>
                <span className="border-b border-dotted border-black flex-1 font-semibold">{currentPeriod}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold w-48">Établissement de Formation :</span>
                <span className="border-b border-dotted border-black flex-1 font-semibold">{efp}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold w-48">Nom & Prénom Formateur :</span>
                <span className="border-b border-dotted border-black flex-1 font-bold">{formateurName} ({formateurMatricule})</span>
              </div>
            </div>
          </div>

          {/* Synthesis Table (Page 11 exact structure) */}
          <div className="border-2 border-black mb-4 overflow-x-auto">
            <table className="w-full text-center border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-black bg-slate-100 font-bold">
                  <th rowSpan={2} className="border-r-2 border-black p-2 text-left">Filière</th>
                  <th colSpan={2} className="border-r-2 border-black p-1">Mode de formation</th>
                  <th colSpan={2} className="border-r-2 border-black p-1">Optimisé</th>
                  <th colSpan={2} className="border-r-2 border-black p-1">Année de Formation</th>
                  <th colSpan={4} className="border-r-2 border-black p-1">Niveau de Formation</th>
                  <th rowSpan={2} className="border-r-2 border-black p-2 w-28">Nbre des entreprises visitées</th>
                  <th rowSpan={2} className="p-2 w-28">Effectif des stagiaires encadrés</th>
                </tr>
                <tr className="border-b-2 border-black bg-slate-50 font-bold text-[9px]">
                  {/* Mode */}
                  <th className="border-r border-black p-1">Résidentiel</th>
                  <th className="border-r-2 border-black p-1">FPA</th>
                  {/* Optimisé */}
                  <th className="border-r border-black p-1">OUI</th>
                  <th className="border-r-2 border-black p-1">NON</th>
                  {/* Année */}
                  <th className="border-r border-black p-1">1ère A</th>
                  <th className="border-r-2 border-black p-1">2ème A</th>
                  {/* Niveau */}
                  <th className="border-r border-black p-1">S</th>
                  <th className="border-r border-black p-1">Q</th>
                  <th className="border-r border-black p-1">T</th>
                  <th className="border-r-2 border-black p-1">TS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {/* Active rows */}
                <tr>
                  <td className="border-r-2 border-black p-2 text-left font-semibold">Développement Digital (Full-Stack)</td>
                  <td className="border-r border-black p-1"></td>
                  <td className="border-r-2 border-black p-1 font-bold">✓</td>
                  <td className="border-r border-black p-1 font-bold">✓</td>
                  <td className="border-r-2 border-black p-1"></td>
                  <td className="border-r border-black p-1"></td>
                  <td className="border-r-2 border-black p-1 font-bold">✓</td>
                  <td className="border-r border-black p-1"></td>
                  <td className="border-r border-black p-1"></td>
                  <td className="border-r border-black p-1"></td>
                  <td className="border-r-2 border-black p-1 font-bold">✓</td>
                  <td className="border-r-2 border-black p-2 font-mono font-bold text-center text-sm">{uniqueVisitedCount}</td>
                  <td className="p-2 font-mono font-bold text-center text-sm">{stagiairesEncadresCount}</td>
                </tr>

                {/* Empty filler rows */}
                {Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={`filler-${idx}`} className="h-8">
                    <td className="border-r-2 border-black p-2"></td>
                    <td className="border-r border-black p-1"></td>
                    <td className="border-r-2 border-black p-1"></td>
                    <td className="border-r border-black p-1"></td>
                    <td className="border-r-2 border-black p-1"></td>
                    <td className="border-r border-black p-1"></td>
                    <td className="border-r-2 border-black p-1"></td>
                    <td className="border-r border-black p-1"></td>
                    <td className="border-r border-black p-1"></td>
                    <td className="border-r border-black p-1"></td>
                    <td className="border-r-2 border-black p-1"></td>
                    <td className="border-r-2 border-black p-2"></td>
                    <td className="p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Summary Boxes (Page 11 format) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-2 border-black p-3">
            <div className="border border-black p-2.5 bg-slate-50 flex flex-col justify-between">
              <span className="font-bold text-[10px] uppercase text-slate-800">EFFECTIF GLOBAL DES STAGIAIRES ENCADRÉS</span>
              <div className="text-2xl font-mono font-black text-center text-blue-900 mt-2">{stagiairesEncadresCount}</div>
            </div>

            <div className="border border-black p-2.5 bg-slate-50 flex flex-col justify-between">
              <span className="font-bold text-[10px] uppercase text-slate-800">NOMBRE GLOBAL DES ENTREPRISES VISITÉES</span>
              <div className="text-2xl font-mono font-black text-center text-emerald-900 mt-2">{uniqueVisitedCount}</div>
            </div>

            <div className="border border-black p-2.5 flex flex-col justify-between">
              <span className="font-bold text-[10px] uppercase text-center block">Émargement du Formateur</span>
              <div className="my-auto py-2 text-center">
                <span className="font-serif italic font-bold text-xs text-slate-800">"Informations certifiées exactes"</span>
                <p className="font-semibold text-[10px] mt-1 text-slate-900">{formateurName}</p>
              </div>
              <span className="text-[8px] text-slate-400 text-center">Signature & Date d'engagement</span>
            </div>
          </div>

          <div className="mt-3 text-[9px] text-slate-500 text-center italic">
            * À remettre à la Direction de son EFP avec les fiches M01 au plus tard le 05 du mois M+1 (Réf: Note DRH 32/2017).
          </div>
        </div>

      </div>
    </div>
  );
};
