import React, { useState } from 'react';
import {
  UserProfile,
  Stage,
  Visite,
  AuditRecord,
  RegulatoryDoc,
  IndemnisationFormateur
} from '../types';
import {
  Building,
  ShieldCheck,
  BarChart3,
  Printer,
  Download,
  CheckCircle2,
  FileText,
  MessageSquare,
  Building2,
  Users,
  Compass,
  Briefcase
} from 'lucide-react';

interface ActeurDrViewProps {
  currentUser: UserProfile;
  stages: Stage[];
  visites: Visite[];
  audits: AuditRecord[];
  docs: RegulatoryDoc[];
  indemnisations: IndemnisationFormateur[];
  onAddAudit: (audit: Omit<AuditRecord, 'id' | 'typeAudit' | 'dateAudit' | 'auditeurId' | 'auditeurNom'>) => void;
  onOpenPrintM03: () => void;
  onOpenPrintM06: () => void;
  onOpenPrintMinistere: () => void;
  onOpenMessaging: () => void;
}

export const ActeurDrView: React.FC<ActeurDrViewProps> = ({
  currentUser,
  stages,
  visites,
  audits,
  docs,
  indemnisations,
  onAddAudit,
  onOpenPrintM03,
  onOpenPrintM06,
  onOpenPrintMinistere,
  onOpenMessaging,
}) => {
  const [activeTab, setActiveTab] = useState<'supervision' | 'audit_dr' | 'indemnisation_dr' | 'ministere' | 'reglementation'>('supervision');

  // DR Audit Modal
  const [isDrAuditModalOpen, setIsDrAuditModalOpen] = useState(false);
  const [selectedVisiteForDrAudit, setSelectedVisiteForDrAudit] = useState<Visite | null>(null);
  const [modeControle, setModeControle] = useState<'Téléphone' | 'Terrain'>('Terrain');
  const [statutConformite, setStatutConformite] = useState<'Conforme' | 'Non Conforme' | 'À clarifier'>('Conforme');
  const [auditObs, setAuditObs] = useState('');

  // DR Audits
  const drAudits = audits.filter(a => a.typeAudit === 'DR');
  const totalVisites = visites.filter(v => v.dateEffectuee).length;
  const drAuditRate = totalVisites > 0 ? Math.round((drAudits.length / totalVisites) * 100) : 0;

  // Group by EFP
  const efpStats = [
    {
      nom: 'ISTA NTIC Sidi Maârouf Casablanca',
      directeur: 'Driss TAZI',
      stagiairesFpa: 46,
      visitesRealisees: 42,
      auditsEfp: 18,
      auditsDr: 10,
      montantIndemnites: '33 600,00 DH',
      statut: 'Conforme'
    },
    {
      nom: 'ISFO Casablanca (Froid & Génie Climatique)',
      directeur: 'Karim NAJI',
      stagiairesFpa: 32,
      visitesRealisees: 28,
      auditsEfp: 12,
      auditsDr: 8,
      montantIndemnites: '22 400,00 DH',
      statut: 'Conforme'
    },
    {
      nom: 'CFMA Nouaceur (Métiers de l’Aéronautique)',
      directeur: 'Meryem SEBTI',
      stagiairesFpa: 35,
      visitesRealisees: 35,
      auditsEfp: 15,
      auditsDr: 9,
      montantIndemnites: '28 000,00 DH',
      statut: 'Conforme'
    },
    {
      nom: 'ISTA Génie Mécanique & Automobile Ain Sebaâ',
      directeur: 'Tariq EL BOUZIDI',
      stagiairesFpa: 28,
      visitesRealisees: 25,
      auditsEfp: 10,
      auditsDr: 6,
      montantIndemnites: '20 000,00 DH',
      statut: 'Conforme'
    }
  ];

  const totalRegionalStagiaires = efpStats.reduce((acc, curr) => acc + curr.stagiairesFpa, 0);
  const totalRegionalVisites = efpStats.reduce((acc, curr) => acc + curr.visitesRealisees, 0);

  const openDrAudit = (vis: Visite) => {
    setSelectedVisiteForDrAudit(vis);
    setAuditObs(`Contrôle d’audit DR inopiné : vérification de la véracité de la visite FPA et de la fiche M01.`);
    setIsDrAuditModalOpen(true);
  };

  const handleDrAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisiteForDrAudit) return;

    onAddAudit({
      visiteId: selectedVisiteForDrAudit.id,
      formateurMatricule: selectedVisiteForDrAudit.formateurMatricule,
      formateurNom: selectedVisiteForDrAudit.formateurName,
      stagiaireNom: selectedVisiteForDrAudit.stagiaireName,
      entrepriseNom: selectedVisiteForDrAudit.entrepriseNom,
      ville: selectedVisiteForDrAudit.ville,
      modeControle,
      statutConformite,
      observations: auditObs,
    });

    setIsDrAuditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner DR */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Direction Régionale (DR)
              </span>
              <span className="text-xs text-slate-400 font-mono">Région : Casablanca - Settat</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100">
              {currentUser.name} - Direction Régionale FPA
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Supervision consolidée des Établissements de Formation Professionnelle (EFP)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenPrintMinistere}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Tableau Annuel Ministère</span>
            </button>
            <button
              onClick={onOpenPrintM03}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Audit Régional M03</span>
            </button>
            <button
              onClick={onOpenPrintM06}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Indemnisation DR M06</span>
            </button>
            <button
              onClick={onOpenMessaging}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messagerie EFP</span>
            </button>
          </div>
        </div>

        {/* Global Metrics */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/60 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Stagiaires FPA Région</span>
            <span className="text-lg font-mono font-black text-white">{totalRegionalStagiaires}</span>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Visites Enregistrées</span>
            <span className="text-lg font-mono font-black text-emerald-400">{totalRegionalVisites}</span>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Taux Audit DR</span>
            <span className="text-lg font-mono font-black text-purple-400">{drAuditRate}% ({drAudits.length} contrôles)</span>
          </div>

          <div className="bg-slate-800/60 p-2.5 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Échéance DRH Siège</span>
            <span className="text-xs font-bold text-amber-300">15 M+1 (Liquidation)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('supervision')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'supervision'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Suivi par Établissement (EFP)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_dr')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'audit_dr'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Régional (Rapport M03)</span>
        </button>

        <button
          onClick={() => setActiveTab('indemnisation_dr')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'indemnisation_dr'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>État Consolidé DR (M06)</span>
        </button>

        <button
          onClick={() => setActiveTab('ministere')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'ministere'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Tableau Annuel Ministère</span>
        </button>

        <button
          onClick={() => setActiveTab('reglementation')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'reglementation'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Réglementation FPA</span>
        </button>
      </div>

      {/* TAB 1: SUPERVISION DES EFP */}
      {activeTab === 'supervision' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Tableau de Bord Régional par Établissement (EFP)</h3>
                <p className="text-xs text-slate-500">Suivi du déploiement de la FPA, de la réalisation des visites et du respect des taux d'audit.</p>
              </div>
              <span className="text-xs font-mono font-bold text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full">
                4 EFP Pilotes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Établissement (EFP)</th>
                    <th className="p-3">Direction Pédagogique</th>
                    <th className="p-3 text-center">Stagiaires FPA</th>
                    <th className="p-3 text-center">Visites Réalisées</th>
                    <th className="p-3 text-center">Audits EFP (M02)</th>
                    <th className="p-3 text-center">Audits DR (M03)</th>
                    <th className="p-3 text-right">Montant Indemnités</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {efpStats.map((efp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{efp.nom}</div>
                        <div className="text-[10px] text-emerald-700 font-semibold">{efp.statut}</div>
                      </td>
                      <td className="p-3 font-medium text-slate-800">{efp.directeur}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-900">{efp.stagiairesFpa}</td>
                      <td className="p-3 text-center font-mono font-bold text-blue-900">{efp.visitesRealisees}</td>
                      <td className="p-3 text-center font-mono text-emerald-800 font-semibold">{efp.auditsEfp}</td>
                      <td className="p-3 text-center font-mono text-purple-800 font-bold">{efp.auditsDr}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{efp.montantIndemnites}</td>
                    </tr>
                  ))}
                  {/* Totals */}
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                    <td colSpan={2} className="p-3 uppercase">Total Régional Consolidé :</td>
                    <td className="p-3 text-center font-mono font-black text-sm">{totalRegionalStagiaires}</td>
                    <td className="p-3 text-center font-mono font-black text-sm text-blue-900">{totalRegionalVisites}</td>
                    <td className="p-3 text-center font-mono font-black text-sm text-emerald-900">55</td>
                    <td className="p-3 text-center font-mono font-black text-sm text-purple-900">33</td>
                    <td className="p-3 text-right font-mono font-black text-sm text-slate-900">104 000,00 DH</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT REGIONAL DR (RAPPORT M03) */}
      {activeTab === 'audit_dr' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  <span>Module d'Audit Régional (Rapport d'Audit M03)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Audit de 2nd niveau mené par la Direction Régionale auprès des entreprises pour contrôler l'authenticité des visites.
                </p>
              </div>

              <button
                onClick={onOpenPrintM03}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer Rapport M03</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Visite / Date</th>
                    <th className="p-3">Formateur Conseiller</th>
                    <th className="p-3">Stagiaire</th>
                    <th className="p-3">Entreprise Partenaire</th>
                    <th className="p-3 text-center">Audit EFP</th>
                    <th className="p-3 text-center">Audit DR</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visites.map((vis) => {
                    const auditEfp = audits.find(a => a.visiteId === vis.id && a.typeAudit === 'EFP');
                    const auditDr = audits.find(a => a.visiteId === vis.id && a.typeAudit === 'DR');

                    return (
                      <tr key={vis.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <span className="font-bold text-blue-900">{vis.numeroVisite === 1 ? '1ère Visite' : '2ème Visite'}</span>
                          <div className="text-[10px] text-slate-400 font-mono">{vis.dateEffectuee || vis.datePrevue}</div>
                        </td>

                        <td className="p-3">
                          <div className="font-bold uppercase text-slate-900">{vis.formateurName}</div>
                          <div className="text-[10px] text-slate-400">{vis.formateurMatricule}</div>
                        </td>

                        <td className="p-3 font-semibold uppercase">{vis.stagiaireName}</td>
                        <td className="p-3">{vis.entrepriseNom} ({vis.ville})</td>

                        <td className="p-3 text-center">
                          {auditEfp ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Validé EFP
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">En attente</span>
                          )}
                        </td>

                        <td className="p-3 text-center">
                          {auditDr ? (
                            <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                              {auditDr.statutConformite}
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                              À auditer DR
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <button
                            onClick={() => openDrAudit(vis)}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            {auditDr ? 'Modifier' : 'Auditer DR'}
                          </button>
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

      {/* TAB 3: INDEMNISATION CONSOLIDEE M06 */}
      {activeTab === 'indemnisation_dr' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">État d'Indemnisation Global de la Direction Régionale (Imprimé M06)</h3>
                <p className="text-xs text-slate-500">
                  Consolidation mensuelle à transmettre à la Direction des Ressources Humaines (DRH) au plus tard le 15 M+1.
                </p>
              </div>

              <button
                onClick={onOpenPrintM06}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Générer Imprimé M06</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Établissement (EFP)</th>
                    <th className="p-3 text-center">Nbre Formateurs</th>
                    <th className="p-3 text-center">Nbre Stagiaires</th>
                    <th className="p-3 text-center">Visites 1</th>
                    <th className="p-3 text-center">Visites 2</th>
                    <th className="p-3 text-right">Montant Total Brut</th>
                    <th className="p-3 text-center">Statut Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {efpStats.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{item.nom}</td>
                      <td className="p-3 text-center font-mono">14</td>
                      <td className="p-3 text-center font-mono">{item.stagiairesFpa}</td>
                      <td className="p-3 text-center font-mono text-blue-900">22</td>
                      <td className="p-3 text-center font-mono text-emerald-900">20</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{item.montantIndemnites}</td>
                      <td className="p-3 text-center">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Validé DR
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                    <td className="p-3 uppercase">Total DR Casablanca-Settat :</td>
                    <td className="p-3 text-center font-mono">48</td>
                    <td className="p-3 text-center font-mono">{totalRegionalStagiaires}</td>
                    <td className="p-3 text-center font-mono">75</td>
                    <td className="p-3 text-center font-mono">68</td>
                    <td className="p-3 text-right font-mono font-black text-sm text-blue-900">104 000,00 DH</td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        Prêt pour transmission DRH
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TABLEAU MINISTERE */}
      {activeTab === 'ministere' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Tableau de Suivi Annuel FPA (Ministère de Tutelle)</h3>
              <p className="text-xs text-slate-500">
                Génération automatique du canevas officiel de suivi des flux de stagiaires en alternance et des partenariats industriels.
              </p>
            </div>

            <button
              onClick={onOpenPrintMinistere}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer Canevas Ministériel Officiel</span>
            </button>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <h4 className="font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Données Annuelles Consolidées en Temps Réel</span>
            </h4>
            <p>
              Conformément à la directive ministérielle, ce tableau regroupe par secteur économique et niveau de formation (Technicien Spécialisé, Technicien, Qualification) les effectifs en alternance, les entreprises partenaires conventionnées et les volumes horaires d'immersion pratique.
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: REGLEMENTATION */}
      {activeTab === 'reglementation' && (
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
                    const element = document.createElement('a');
                    const file = new Blob([`Document Officiel OFPPT FPA:\n${doc.titre}\nRéférence: ${doc.reference}`], {type: 'text/plain'});
                    element.href = URL.createObjectURL(file);
                    element.download = doc.fichierNom;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
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
      )}

      {/* MODAL AUDIT REGIONAL DR */}
      {isDrAuditModalOpen && selectedVisiteForDrAudit && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Audit Régional DR (Rapport M03)</h3>
            <p className="text-xs text-slate-500 mb-4">
              Visite de M. {selectedVisiteForDrAudit.formateurName} chez {selectedVisiteForDrAudit.entrepriseNom} pour le stagiaire {selectedVisiteForDrAudit.stagiaireName}
            </p>

            <form onSubmit={handleDrAuditSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mode de Contrôle</label>
                  <select
                    value={modeControle}
                    onChange={(e) => setModeControle(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Terrain">Terrain (Visite inopinée en entreprise)</option>
                    <option value="Téléphone">Téléphonique (Entretien Tuteur)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Résultat Conformité</label>
                  <select
                    value={statutConformite}
                    onChange={(e) => setStatutConformite(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-bold"
                  >
                    <option value="Conforme">Conforme</option>
                    <option value="Non Conforme">Non Conforme</option>
                    <option value="À clarifier">À clarifier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Constats et Recommandations de l'Auditeur DR</label>
                <textarea
                  rows={3}
                  value={auditObs}
                  onChange={(e) => setAuditObs(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDrAuditModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold"
                >
                  Valider l'audit DR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
