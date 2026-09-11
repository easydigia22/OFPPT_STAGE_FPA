import React from 'react';
import { X, Printer, Shield, FileText } from 'lucide-react';
import { Stage } from '../../types';

interface PrintContratStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: Stage | null;
}

export const PrintContratStageModal: React.FC<PrintContratStageModalProps> = ({
  isOpen,
  onClose,
  stage,
}) => {
  if (!isOpen || !stage) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[96vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Toolbar */}
        <div className="no-print bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">CONTRAT FPA</span>
            <h2 className="font-semibold text-sm sm:text-base text-slate-100">Contrat de Stage en Entreprise (Loi 36.96)</h2>
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
        <div className="print-area flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-black font-sans text-xs leading-relaxed">
          
          {/* Header */}
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-left font-serif text-[10px] text-slate-700">
                ROYAUME DU MAROC<br />
                Office de la Formation Professionnelle<br />
                et de la Promotion du Travail
              </div>
              <div className="w-16 h-16 border border-slate-300 rounded flex items-center justify-center font-serif text-xs font-bold text-blue-900 bg-slate-50">
                OFPPT
              </div>
              <div className="text-right text-[10px] text-slate-700">
                Réf: Loi n° 36-96<br />
                Décret n° 2-97-666<br />
                Année: 2025/2026
              </div>
            </div>

            <h1 className="font-black text-lg sm:text-xl uppercase tracking-tight text-slate-900 mt-4">
              CONTRAT DE STAGE EN ENTREPRISE
            </h1>
            <p className="text-xs font-bold text-blue-950 uppercase tracking-wide mt-1">
              Formation Professionnelle Alternée (FPA)
            </p>
          </div>

          {/* Parties Contractantes */}
          <div className="space-y-4 mb-6 text-[11px]">
            <p className="font-bold underline uppercase">Entre les soussignés :</p>
            
            <div className="pl-3 border-l-2 border-slate-300 space-y-1">
              <p>
                <span className="font-bold">1. L’Établissement de Formation :</span> {stage.efp}, représenté par son Directeur, ci-après dénommé « L’Établissement ».
              </p>
              <p>
                <span className="font-bold">2. L’Entreprise d’accueil :</span> <span className="font-bold text-blue-950 uppercase">{stage.entreprise.nom}</span>, sise à {stage.entreprise.adresse}, {stage.entreprise.ville}, représentée par M./Mme {stage.tuteur.nom} {stage.tuteur.prenom} en qualité de {stage.tuteur.fonction}, ci-après dénommée « L’Entreprise ».
              </p>
              <p>
                <span className="font-bold">3. Le/La Stagiaire :</span> <span className="font-bold uppercase text-blue-950">{stage.stagiaireName}</span>, titulaire de la CNI N° <span className="font-mono font-bold">{stage.stagiaireCni}</span>, inscrit en filière <span className="font-semibold">{stage.filiere}</span> (Groupe : {stage.groupe}), ci-après dénommé « Le Stagiaire ».
              </p>
            </div>

            {/* Articles */}
            <div className="space-y-3 pt-2">
              <div>
                <h3 className="font-bold text-xs uppercase text-slate-900">Article 1 : Objet du contrat</h3>
                <p className="text-slate-700">
                  Le présent contrat a pour objet d’organiser le stage pratique en milieu professionnel dans le cadre de la Formation Professionnelle Alternée (FPA). Le stage vise l’acquisition et la consolidation des compétences professionnelles prévues par le référentiel de formation.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase text-slate-900">Article 2 : Durée et Période du stage</h3>
                <p className="text-slate-700">
                  Le stage se déroulera du <span className="font-semibold">{stage.dateDebut}</span> au <span className="font-semibold">{stage.dateFin}</span>, pour un volume horaire total de <span className="font-semibold">{stage.dureeHeures} heures</span> en entreprise, conformément au découpage officiel homologué par l’OFPPT.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase text-slate-900">Article 3 : Encadrement et Suivi pédagogique</h3>
                <p className="text-slate-700">
                  Le stagiaire est placé sous la responsabilité directe de son tuteur en entreprise M./Mme <span className="font-semibold">{stage.tuteur.nom} {stage.tuteur.prenom}</span> et suivi pédagogiquement par le formateur conseiller FPA de l’établissement M. <span className="font-semibold">{stage.formateurName}</span>, chargé des visites de suivi sur site et de l’élaboration de la fiche M01.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase text-slate-900">Article 4 : Missions et activités confiées</h3>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-800 text-[10px]">
                  {stage.missions || 'Participation aux activités techniques et professionnelles en adéquation avec les compétences du programme métier.'}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase text-slate-900">Article 5 : Couverture Assurance et Discipline</h3>
                <p className="text-slate-700">
                  Le stagiaire demeure sous le régime de la police d’assurance groupe souscrite par l’OFPPT couvrant les risques d’accidents de travail et de trajet. Il est tenu de respecter le règlement intérieur et les consignes de sécurité de l’entreprise.
                </p>
              </div>
            </div>
          </div>

          {/* Signatures Tripartites */}
          <div className="border-2 border-black grid grid-cols-3 divide-x-2 divide-black text-center text-[10px] mt-6">
            <div className="p-3 min-h-[115px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">Pour l’Établissement (OFPPT)</span>
              <div className="text-slate-400 text-[9px] italic">Date, Visa & Cachet Directeur EFP</div>
            </div>
            <div className="p-3 min-h-[115px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">Pour l’Entreprise d’Accueil</span>
              <div className="text-slate-400 text-[9px] italic">Cachet de la Société & Signature Tuteur</div>
            </div>
            <div className="p-3 min-h-[115px] flex flex-col justify-between">
              <span className="font-bold uppercase tracking-wider">Le/La Stagiaire</span>
              <div className="text-slate-400 text-[9px] italic">Signature précédée de la mention "Lu et approuvé"</div>
            </div>
          </div>

          <div className="mt-4 text-[9px] text-slate-400 text-center">
            Fait en trois exemplaires originaux à Casablanca, le {new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>

      </div>
    </div>
  );
};
