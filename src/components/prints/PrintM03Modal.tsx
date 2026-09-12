import React from 'react';
import { X, Printer } from 'lucide-react';
import { AuditRecord } from '../../types';

interface PrintM03ModalProps {
  isOpen: boolean;
  onClose: () => void;
  audits: AuditRecord[];
  directionRegionale?: string;
}

export const PrintM03Modal: React.FC<PrintM03ModalProps> = ({
  isOpen,
  onClose,
  audits,
  directionRegionale = 'DR Casablanca-Settat',
}) => {
  if (!isOpen) return null;

  const currentPeriod = new Date().toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' });
  const drAudits = audits.filter(a => a.typeAudit === 'DR');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Toolbar */}
        <div className="no-print bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded">MODÈLE M03</span>
            <h2 className="font-semibold text-sm sm:text-base text-slate-100">Rapport d’Audit de la Région (Supervision DR)</h2>
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
                <span className="font-bold text-sm block text-blue-900">Modèle 03</span>
              </div>
              <div className="text-center flex-1 px-4">
                <h1 className="font-black text-base sm:text-lg uppercase tracking-tight text-slate-900">
                  RAPPORT D’AUDIT DE LA REGION / INDEMNISATION DES SUIVI DES STAGIAIRES EN ENTREPRISES
                </h1>
                <p className="text-[10px] text-slate-600 font-medium">Direction Régionale - Contrôle Qualité et Ressources Humaines (Échantillon 20%)</p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 border border-slate-300 rounded flex items-center justify-center font-serif text-[10px] font-bold text-blue-900 bg-slate-50">
                  OFPPT
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div className="flex items-center">
                <span className="font-bold w-40">Direction Régionale :</span>
                <span className="border-b border-dotted border-black flex-1 font-semibold">{directionRegionale}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold w-32">Mois / Année :</span>
                <span className="border-b border-dotted border-black flex-1 font-semibold">{currentPeriod}</span>
              </div>
            </div>
          </div>

          {/* Audit Table */}
          <div className="border-2 border-black mb-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-black bg-slate-100 font-bold text-center">
                  <th className="border-r-2 border-black p-2 w-24">Date Audit</th>
                  <th className="border-r-2 border-black p-2 w-40">Établissement de formation</th>
                  <th className="border-r-2 border-black p-2 w-20">Matricule</th>
                  <th className="border-r-2 border-black p-2 w-40">Nom et Prénom Formateur Audité</th>
                  <th className="border-r-2 border-black p-2 w-40">Nom et Prénom Stagiaire audité</th>
                  <th className="border-r-2 border-black p-2 w-44">Entreprise d'accueil / Ville</th>
                  <th className="p-2">Observations</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {drAudits.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-400 italic">
                      Aucun audit régional enregistré pour cette période.
                    </td>
                  </tr>
                ) : (
                  drAudits.map((a) => (
                    <tr key={a.id} className="align-top">
                      <td className="border-r-2 border-black p-2 font-mono">{a.dateAudit}</td>
                      <td className="border-r-2 border-black p-2 font-semibold text-slate-800"></td>
                      <td className="border-r-2 border-black p-2 font-mono font-bold">{a.formateurMatricule}</td>
                      <td className="border-r-2 border-black p-2 font-semibold uppercase">{a.formateurNom}</td>
                      <td className="border-r-2 border-black p-2 font-semibold uppercase">{a.stagiaireNom}</td>
                      <td className="border-r-2 border-black p-2">{a.entrepriseNom} ({a.ville})</td>
                      <td className="p-2">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800 mr-1.5">
                          {a.modeControle}
                        </span>
                        {a.observations}
                      </td>
                    </tr>
                  ))
                )}
                {Array.from({ length: Math.max(0, 4 - drAudits.length) }).map((_, i) => (
                  <tr key={`empty-dr-${i}`} className="h-9">
                    <td className="border-r-2 border-black p-2"></td>
                    <td className="border-r-2 border-black p-2"></td>
                    <td className="border-r-2 border-black p-2"></td>
                    <td className="border-r-2 border-black p-2"></td>
                    <td className="border-r-2 border-black p-2"></td>
                    <td className="border-r-2 border-black p-2"></td>
                    <td className="p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="border-2 border-black grid grid-cols-2 divide-x-2 divide-black text-center text-[10px]">
            <div className="p-4 min-h-[105px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">SERVICE RESSOURCES HUMAINES RÉGIONAL</span>
              <div className="text-slate-400 text-[9px] italic">Visa & Signature Chef de Service RH</div>
            </div>
            <div className="p-4 min-h-[105px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">SERVICE CONTRÔLE QUALITÉ RÉGIONAL</span>
              <div className="text-slate-400 text-[9px] italic">Visa & Signature Chef de Service Contrôle Qualité</div>
            </div>
          </div>

          <div className="mt-3 text-[9px] text-slate-500 text-center italic">
            * État officiel Modèle 03 transmis à la Direction Générale / DRH au plus tard le 20 du mois M+1.
          </div>
        </div>

      </div>
    </div>
  );
};
