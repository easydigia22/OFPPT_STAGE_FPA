import React from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';
import { AuditRecord } from '../../types';

interface PrintM02ModalProps {
  isOpen: boolean;
  onClose: () => void;
  audits: AuditRecord[];
  efp?: string;
  directionRegionale?: string;
}

export const PrintM02Modal: React.FC<PrintM02ModalProps> = ({
  isOpen,
  onClose,
  audits,
  efp = 'ISFO Casablanca (Sidi Maârouf)',
  directionRegionale = 'DR Casablanca-Settat',
}) => {
  if (!isOpen) return null;

  const currentPeriod = new Date().toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' });
  const efpAudits = audits.filter(a => a.typeAudit === 'EFP');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Toolbar */}
        <div className="no-print bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded">MODÈLE M02</span>
            <h2 className="font-semibold text-sm sm:text-base text-slate-100">Rapport d’Audit de l’EFP / Indemnisation du Suivi</h2>
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
                <span className="font-bold text-sm block text-blue-900">Modèle 02</span>
              </div>
              <div className="text-center flex-1 px-4">
                <h1 className="font-black text-base sm:text-lg uppercase tracking-tight text-slate-900">
                  RAPPORT D’AUDIT DE L’EFP / INDEMNISATION DES SUIVI DES STAGIAIRES EN ENTREPRISES
                </h1>
                <p className="text-[10px] text-slate-600 font-medium">Contrôle de conformité de terrain et téléphonique (Échantillon minimum de 20%)</p>
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
              <div className="flex items-center col-span-2">
                <span className="font-bold w-40">Établissement (EFP) :</span>
                <span className="border-b border-dotted border-black flex-1 font-semibold">{efp}</span>
              </div>
            </div>
          </div>

          {/* Audit Table */}
          <div className="border-2 border-black mb-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b-2 border-black bg-slate-100 font-bold text-center">
                  <th className="border-r-2 border-black p-2 w-24">Date Audit</th>
                  <th className="border-r-2 border-black p-2 w-24">Matricule Formateur</th>
                  <th className="border-r-2 border-black p-2 w-44">Nom et Prénom Formateur Audité</th>
                  <th className="border-r-2 border-black p-2 w-44">Nom et Prénom Stagiaire Audité</th>
                  <th className="border-r-2 border-black p-2 w-48">Entreprise d'accueil / Ville</th>
                  <th className="p-2">Observations</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {efpAudits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-400 italic">
                      Aucun audit enregistré pour cette période.
                    </td>
                  </tr>
                ) : (
                  efpAudits.map((a) => (
                    <tr key={a.id} className="align-top">
                      <td className="border-r-2 border-black p-2 font-mono">{a.dateAudit}</td>
                      <td className="border-r-2 border-black p-2 font-mono font-bold">{a.formateurMatricule}</td>
                      <td className="border-r-2 border-black p-2 font-semibold uppercase">{a.formateurNom}</td>
                      <td className="border-r-2 border-black p-2 font-semibold uppercase">{a.stagiaireNom}</td>
                      <td className="border-r-2 border-black p-2">{a.entrepriseNom} ({a.ville})</td>
                      <td className="p-2">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold mr-2 ${a.statutConformite === 'Conforme' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          [{a.modeControle}] {a.statutConformite}
                        </span>
                        {a.observations}
                      </td>
                    </tr>
                  ))
                )}
                {/* Empty rows to match official paper appearance if few audits */}
                {Array.from({ length: Math.max(0, 5 - efpAudits.length) }).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-9">
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
          <div className="border-2 border-black grid grid-cols-3 divide-x-2 divide-black text-center text-[10px]">
            <div className="p-3 min-h-[95px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">Responsable de Formation</span>
              <div className="text-slate-400 text-[9px] italic">Signature & Date</div>
            </div>
            <div className="p-3 min-h-[95px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">Directeur Pédagogique</span>
              <div className="text-slate-400 text-[9px] italic">Signature & Date</div>
            </div>
            <div className="p-3 min-h-[95px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">Directeur du CFP / EFP</span>
              <div className="text-slate-400 text-[9px] italic">Cachet & Signature Directeur</div>
            </div>
          </div>

          <div className="mt-3 text-[9px] text-slate-500 text-center italic">
            * Conforme à la démarche d'indemnisation OFPPT Note n°32/2017 - Taux d'audit de terrain/téléphonique minimal requis: 20%.
          </div>
        </div>

      </div>
    </div>
  );
};
