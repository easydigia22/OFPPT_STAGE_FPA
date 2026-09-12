import React from 'react';
import { X, Printer, Coins } from 'lucide-react';
import { Visite } from '../../types';

interface PrintM05ModalProps {
  isOpen: boolean;
  onClose: () => void;
  visites: Visite[];
  efp?: string;
  directionRegionale?: string;
}

export const PrintM05Modal: React.FC<PrintM05ModalProps> = ({
  isOpen,
  onClose,
  visites,
  efp = '',
  directionRegionale = 'DR Casablanca-Settat',
}) => {
  if (!isOpen) return null;

  const currentPeriod = new Date().toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' });

  // Données réelles depuis Supabase (vide au démarrage)
  const formateurs: { matricule: string; nom: string; entreprises: number; stagiaires: number; indemnite: number; }[] = [];

  const totalIndemnites = formateurs.reduce((acc, f) => acc + f.indemnite, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Toolbar */}
        <div className="no-print bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded">MODÈLE M05</span>
            <h2 className="font-semibold text-sm sm:text-base text-slate-100">État d’Indemnisation des Formateurs de l’EFP</h2>
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

        {/* Printable Document Area */}
        <div className="print-area flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-black font-sans text-xs">
          
          {/* Header */}
          <div className="border-2 border-black p-4 mb-3">
            <div className="flex items-start justify-between border-b-2 border-black pb-2 mb-3">
              <div>
                <span className="font-bold text-xs uppercase tracking-wider block">D.R.H</span>
                <span className="font-bold text-sm block text-blue-900">Modèle 05</span>
              </div>
              <div className="text-center flex-1 px-4">
                <h1 className="font-black text-base sm:text-lg uppercase tracking-tight text-slate-900">
                  ÉTAT D’INDEMNISATION DES FORMATEURS DE L’EFP / SUIVI DES STAGIAIRES EN ENTREPRISES
                </h1>
                <p className="text-[10px] text-slate-600 font-medium">Bordereau consolidé d’établissement pour la Direction Régionale</p>
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
                <span className="font-bold w-48">Mois / Année / Période :</span>
                <span className="border-b border-dotted border-black flex-1 font-semibold">{currentPeriod}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold w-48">Établissement de Formation :</span>
                <span className="border-b border-dotted border-black flex-1 font-semibold">{efp}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">Mode de formation :</span>
                <label className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 border border-black rounded-full inline-block"></span>
                  Résidentiel
                </label>
                <label className="flex items-center gap-1 font-semibold">
                  <span className="w-3.5 h-3.5 border border-black rounded-full inline-flex items-center justify-center text-[9px] bg-black text-white">✓</span>
                  FPA
                </label>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border-2 border-black mb-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-black bg-slate-100 font-bold text-center">
                  <th className="border-r-2 border-black p-2 w-24">Matricule</th>
                  <th className="border-r-2 border-black p-2 text-left">Nom et Prénom</th>
                  <th className="border-r-2 border-black p-2 w-36">Nbre des entreprises visitées</th>
                  <th className="border-r-2 border-black p-2 w-36">Effectif des stagiaires encadrés</th>
                  <th className="p-2 w-44 text-right">Montant indemnité Proposé (MAD)</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {formateurs.map((f) => (
                  <tr key={f.matricule} className="align-middle">
                    <td className="border-r-2 border-black p-2 text-center font-mono font-bold">{f.matricule}</td>
                    <td className="border-r-2 border-black p-2 font-semibold uppercase">{f.nom}</td>
                    <td className="border-r-2 border-black p-2 text-center font-mono text-sm">{f.entreprises}</td>
                    <td className="border-r-2 border-black p-2 text-center font-mono text-sm">{f.stagiaires}</td>
                    <td className="p-2 text-right font-mono font-bold text-sm text-blue-900">{f.indemnite.toLocaleString('fr-FR')} DH</td>
                  </tr>
                ))}

                {Array.from({ length: 3 }).map((_, i) => (
                  <tr key={`empty-m05-${i}`} className="h-8">
                    <td className="border-r-2 border-black p-2"></td>
                    <td className="border-r-2 border-black p-2"></td>
                    <td className="border-r-2 border-black p-2"></td>
                    <td className="border-r-2 border-black p-2"></td>
                    <td className="p-2"></td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="border-t-2 border-black bg-slate-100 font-bold text-[11px]">
                  <td colSpan={4} className="border-r-2 border-black p-2 text-right uppercase">
                    TOTAL GÉNÉRAL PROPOSÉ :
                  </td>
                  <td className="p-2 text-right font-mono font-black text-base text-emerald-900">
                    {totalIndemnites.toLocaleString('fr-FR')} DH
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="border-2 border-black grid grid-cols-3 divide-x-2 divide-black text-center text-[10px]">
            <div className="p-3 min-h-[95px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">Vérifié par le Directeur Pédagogique / Resp. Formation</span>
              <div className="text-slate-400 text-[9px] italic">Visa & Signature</div>
            </div>
            <div className="p-3 min-h-[95px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">Validé par le Directeur de l'EFP</span>
              <div className="text-slate-400 text-[9px] italic">Cachet & Signature Directeur EFP</div>
            </div>
            <div className="p-3 min-h-[95px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">Validé par le Directeur du CFP / Complexe</span>
              <div className="text-slate-400 text-[9px] italic">Cachet & Signature Directeur Complexe</div>
            </div>
          </div>

          <div className="mt-3 text-[9px] text-slate-500 text-center italic">
            * À remettre à la Direction Régionale avec les pièces justificatives dument visées au plus tard le 10 du mois M+1 (Note DRH 32/2017).
          </div>
        </div>

      </div>
    </div>
  );
};

