import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Copy, Download, Eye, EyeOff, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';

interface ImportRow {
  nom: string;
  email: string;
  cni: string;
  telephone: string;
  filiere: string;
  groupe: string;
  tempPassword: string;
  valid: boolean;
  error?: string;
}

interface ImportStagiairesModalProps {
  isOpen: boolean;
  onClose: () => void;
  efp: string;
  directionRegionale: string;
  onImport: (stagiaires: UserProfile[]) => Promise<void>;
}

function generatePassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#';
  let pwd = '';
  for (let i = 0; i < 8; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
  return pwd;
}

const TEMPLATE_HEADERS = ['Nom Complet', 'Email', 'CNI', 'Téléphone', 'Filière', 'Groupe'];

export const ImportStagiairesModal: React.FC<ImportStagiairesModalProps> = ({
  isOpen, onClose, efp, directionRegionale, onImport
}) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'done'>('upload');
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [showPasswords, setShowPasswords] = useState(false);
  const [importing, setImporting] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      TEMPLATE_HEADERS,
      ['Fatima BELHAJ', 'f.belhaj@ofppt.ma', 'AB123456', '0612345678', 'Développement Digital', 'DEV201'],
      ['Yassine OUALI', 'y.ouali@ofppt.ma', 'CD789012', '0698765432', 'Génie Civil', 'GE201'],
    ]);
    ws['!cols'] = TEMPLATE_HEADERS.map(() => ({ wch: 22 }));
    XLSX.utils.book_append_sheet(wb, ws, 'Stagiaires');
    XLSX.writeFile(wb, 'modele_import_stagiaires.xlsx');
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        // Skip header row
        const dataRows = raw.slice(1).filter(r => r.some(c => String(c).trim() !== ''));

        const parsed: ImportRow[] = dataRows.map((r) => {
          const nom = String(r[0] || '').trim();
          const email = String(r[1] || '').trim().toLowerCase();
          const cni = String(r[2] || '').trim();
          const telephone = String(r[3] || '').trim();
          const filiere = String(r[4] || '').trim();
          const groupe = String(r[5] || '').trim();
          const tempPassword = generatePassword();

          let error: string | undefined;
          if (!nom) error = 'Nom manquant';
          else if (!email || !email.includes('@')) error = 'Email invalide';

          return { nom, email, cni, telephone, filiere, groupe, tempPassword, valid: !error, error };
        });

        setRows(parsed);
        setStep('preview');
      } catch {
        alert('Fichier Excel invalide. Utilisez le modèle fourni.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleConfirmImport = async () => {
    setImporting(true);
    const validRows = rows.filter(r => r.valid);
    const stagiaires: UserProfile[] = validRows.map((r, i) => ({
      id: `stg-${Date.now()}-${i}`,
      name: r.nom,
      email: r.email,
      role: 'stagiaire',
      cni: r.cni,
      telephone: r.telephone,
      efp,
      directionRegionale,
      filiere: r.filiere || undefined,
      groupe: r.groupe || undefined,
      tempPassword: r.tempPassword,
      passwordChanged: false,
    }));

    try {
      await onImport(stagiaires);
      setStep('done');
    } catch {
      alert('Erreur lors de l\'import. Réessayez.');
    } finally {
      setImporting(false);
    }
  };

  const copyAllCredentials = () => {
    const text = rows.filter(r => r.valid).map(r =>
      `${r.nom} | ${r.email} | ${r.tempPassword}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const exportCredentials = () => {
    const wb = XLSX.utils.book_new();
    const data = [
      ['Nom Complet', 'Email', 'Mot de passe provisoire'],
      ...rows.filter(r => r.valid).map(r => [r.nom, r.email, r.tempPassword])
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Identifiants');
    XLSX.writeFile(wb, `identifiants_stagiaires_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.xlsx`);
  };

  const validCount = rows.filter(r => r.valid).length;
  const errorCount = rows.filter(r => !r.valid).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Import stagiaires — Excel</h2>
              <p className="text-xs text-slate-500">{efp}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/* STEP 1 — Upload */}
          {step === 'upload' && (
            <div className="space-y-5">
              {/* Template download */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Étape 1 — Téléchargez le modèle Excel</p>
                  <p className="text-xs text-blue-700 mb-3">Remplissez les colonnes : Nom Complet, Email, CNI, Téléphone, Filière, Groupe</p>
                  <button onClick={downloadTemplate}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Télécharger le modèle
                  </button>
                </div>
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl p-10 text-center cursor-pointer transition-colors group">
                <Upload className="w-10 h-10 text-slate-300 group-hover:text-emerald-400 mx-auto mb-3 transition-colors" />
                <p className="text-sm font-semibold text-slate-700 mb-1">Déposez votre fichier Excel ici</p>
                <p className="text-xs text-slate-400">ou cliquez pour sélectionner (.xlsx, .xls)</p>
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
              </div>
            </div>
          )}

          {/* STEP 2 — Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="flex gap-3">
                <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-emerald-700">{validCount}</p>
                  <p className="text-xs text-emerald-600 font-medium">Stagiaires valides</p>
                </div>
                {errorCount > 0 && (
                  <div className="flex-1 bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-rose-700">{errorCount}</p>
                    <p className="text-xs text-rose-600 font-medium">Lignes en erreur</p>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
                  <span className="text-xs font-semibold text-slate-600">Aperçu des données importées</span>
                  <button onClick={() => setShowPasswords(v => !v)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700">
                    {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showPasswords ? 'Masquer' : 'Voir'} les mots de passe
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-3 py-2 text-slate-500 font-semibold">Nom</th>
                        <th className="text-left px-3 py-2 text-slate-500 font-semibold">Email</th>
                        <th className="text-left px-3 py-2 text-slate-500 font-semibold">Groupe</th>
                        <th className="text-left px-3 py-2 text-slate-500 font-semibold">Mot de passe provisoire</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rows.map((r, i) => (
                        <tr key={i} className={r.valid ? '' : 'bg-rose-50'}>
                          <td className="px-3 py-2 font-semibold text-slate-800">{r.nom || '—'}</td>
                          <td className="px-3 py-2 text-slate-600">{r.email || '—'}</td>
                          <td className="px-3 py-2 text-slate-500">{r.groupe || '—'}</td>
                          <td className="px-3 py-2 font-mono text-emerald-700">
                            {r.valid ? (showPasswords ? r.tempPassword : '••••••••') : '—'}
                          </td>
                          <td className="px-3 py-2">
                            {r.valid
                              ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              : <span className="text-rose-600 text-[10px]">{r.error}</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-lg p-3">
                ⚠️ Chaque stagiaire devra <strong>changer son mot de passe dès la première connexion</strong>. Exportez ou copiez les identifiants avant de fermer cette fenêtre.
              </p>
            </div>
          )}

          {/* STEP 3 — Done */}
          {step === 'done' && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{validCount} stagiaires importés !</h3>
                <p className="text-sm text-slate-500 mt-1">Les comptes sont créés. Distribuez les identifiants ci-dessous.</p>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 text-left max-h-48 overflow-y-auto">
                <p className="text-xs text-slate-400 mb-2 font-mono uppercase tracking-wider">Identifiants provisoires</p>
                {rows.filter(r => r.valid).map((r, i) => (
                  <div key={i} className="font-mono text-xs text-emerald-400 leading-relaxed">
                    {r.email} · <span className="text-white">{r.tempPassword}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={copyAllCredentials}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                  {copiedAll ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedAll ? 'Copié !' : 'Copier les identifiants'}
                </button>
                <button onClick={exportCredentials}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors">
                  <Download className="w-4 h-4" />
                  Exporter en Excel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'preview' && (
          <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
            <button onClick={() => setStep('upload')}
              className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
              ← Recommencer
            </button>
            <button onClick={exportCredentials}
              className="flex items-center gap-2 px-4 py-2.5 border border-emerald-300 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-colors">
              <Download className="w-4 h-4" />
              Exporter identifiants
            </button>
            <button onClick={handleConfirmImport} disabled={importing || validCount === 0}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
              {importing
                ? <><Loader2 className="w-4 h-4 animate-spin" />Import en cours…</>
                : <>Importer {validCount} stagiaires</>
              }
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="px-6 py-4 border-t border-slate-100">
            <button onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors">
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
