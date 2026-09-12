import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  X, UserPlus, Copy, CheckCircle2, Eye, EyeOff,
  User, Mail, Phone, Hash, BookOpen, Users2, KeyRound, AlertCircle
} from 'lucide-react';

interface CreateStagiaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  efp: string;
  directionRegionale: string;
  onCreateStagiaire: (stagiaire: UserProfile, tempPassword: string) => void;
}

const FILIERES = [
  'Développement Digital (Full-Stack)',
  'Développement Digital (Mobile)',
  'Infrastructures Digitales',
  'Cybersécurité',
  'Intelligence Artificielle & Data',
  'Gestion des Entreprises',
  'Commerce & Marketing',
  'Hôtellerie & Restauration',
  'Électromécanique',
  'Génie Civil',
];

const GROUPES = ['DEV201', 'DEV202', 'DEV203', 'INF101', 'INF102', 'GE101', 'CM101', 'HR101', 'EM101'];

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export const CreateStagiaireModal: React.FC<CreateStagiaireModalProps> = ({
  isOpen,
  onClose,
  efp,
  directionRegionale,
  onCreateStagiaire,
}) => {
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [nom, setNom] = useState('');
  const [cni, setCni] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [filiere, setFiliere] = useState(FILIERES[0]);
  const [groupe, setGroupe] = useState(GROUPES[0]);
  const [annee, setAnnee] = useState<'1A' | '2A'>('2A');
  const [tempPassword] = useState(generateTempPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nom.trim()) e.nom = 'Nom requis';
    if (!cni.trim() || cni.trim().length < 5) e.cni = 'CNI invalide';
    if (!email.trim() || !email.includes('@')) e.email = 'Email invalide';
    if (!telephone.trim()) e.telephone = 'Téléphone requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('confirm');
  };

  const handleConfirm = () => {
    const newStagiaire: UserProfile = {
      id: `user-stagiaire-${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: nom.trim(),
      role: 'stagiaire',
      cni: cni.trim().toUpperCase(),
      telephone: telephone.trim(),
      efp,
      directionRegionale,
      filiere,
      groupe,
    };
    onCreateStagiaire(newStagiaire, tempPassword);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setStep('form');
    setNom(''); setCni(''); setEmail(''); setTelephone('');
    setFiliere(FILIERES[0]); setGroupe(GROUPES[0]); setAnnee('2A');
    setErrors({});
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">Créer un compte stagiaire</h2>
              <p className="text-xs text-slate-500">Le stagiaire recevra ses identifiants pour se connecter</p>
            </div>
          </div>
          <button onClick={() => { onClose(); resetForm(); }}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Nom */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Nom complet *
              </label>
              <input
                type="text"
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder="ex : Fatima BENNANI"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-emerald-500 ${errors.nom ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
              />
              {errors.nom && <p className="text-[11px] text-red-600 mt-0.5">{errors.nom}</p>}
            </div>

            {/* CNI & Téléphone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  CNI *
                </label>
                <input
                  type="text"
                  value={cni}
                  onChange={e => setCni(e.target.value.toUpperCase())}
                  placeholder="ex : BE892143"
                  className={`w-full px-3 py-2 text-sm border rounded-lg font-mono uppercase focus:outline-none focus:border-emerald-500 ${errors.cni ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
                />
                {errors.cni && <p className="text-[11px] text-red-600 mt-0.5">{errors.cni}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={telephone}
                  onChange={e => setTelephone(e.target.value)}
                  placeholder="+212 6..."
                  className={`w-full px-3 py-2 text-sm border rounded-lg font-mono focus:outline-none focus:border-emerald-500 ${errors.telephone ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
                />
                {errors.telephone && <p className="text-[11px] text-red-600 mt-0.5">{errors.telephone}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Adresse e-mail (identifiant de connexion) *
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ex : f.bennani@stagiaire-ofppt.ma"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-emerald-500 ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
              />
              {errors.email && <p className="text-[11px] text-red-600 mt-0.5">{errors.email}</p>}
            </div>

            {/* Filière & Groupe & Année */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  Filière
                </label>
                <select
                  value={filiere}
                  onChange={e => setFiliere(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
                >
                  {FILIERES.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Users2 className="w-3.5 h-3.5 text-slate-400" />
                  Groupe
                </label>
                <select
                  value={groupe}
                  onChange={e => setGroupe(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
                >
                  {GROUPES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1">Année</label>
                <select
                  value={annee}
                  onChange={e => setAnnee(e.target.value as '1A' | '2A')}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="1A">1ère Année</option>
                  <option value="2A">2ème Année</option>
                </select>
              </div>
            </div>

            {/* EFP (read-only) */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p><span className="font-semibold">EFP :</span> {efp}</p>
              <p><span className="font-semibold">Direction Régionale :</span> {directionRegionale}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => { onClose(); resetForm(); }}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100">
                Annuler
              </button>
              <button type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5">
                <UserPlus className="w-4 h-4" />
                Continuer
              </button>
            </div>
          </form>
        )}

        {step === 'confirm' && (
          <div className="p-6 space-y-5">
            {/* Récapitulatif */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm space-y-1.5">
              <p className="font-bold text-emerald-900 text-base">{nom}</p>
              <p className="text-emerald-800 text-xs">CNI : <strong className="font-mono">{cni}</strong> | Tél : {telephone}</p>
              <p className="text-emerald-800 text-xs">Email : <strong>{email}</strong></p>
              <p className="text-emerald-800 text-xs">Filière : {filiere} | Groupe : <strong>{groupe}</strong> | {annee}</p>
              <p className="text-emerald-800 text-xs">EFP : {efp}</p>
            </div>

            {/* Mot de passe temporaire */}
            <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-900">Mot de passe temporaire généré automatiquement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border border-amber-200 rounded-lg px-3 py-2 font-mono text-sm font-bold text-slate-800 tracking-widest select-all">
                  {showPassword ? tempPassword : '••••••••••'}
                </div>
                <button onClick={() => setShowPassword(v => !v)}
                  className="p-2 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => handleCopy(tempPassword)}
                  className="p-2 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors" title="Copier">
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-amber-800 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Communiquez ce mot de passe au stagiaire. Il devra le modifier dès sa première connexion.
              </p>
            </div>

            {/* Copier le tout */}
            <button
              onClick={() => handleCopy(`Identifiants FPA Pilot\nEmail : ${email}\nMot de passe temporaire : ${tempPassword}\nURL : https://suivistagr-fpa.vercel.app`)}
              className="w-full py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copier les identifiants complets
            </button>

            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setStep('form')}
                className="px-4 py-2 text-xs font-medium text-slate-600 rounded-lg hover:bg-slate-100">
                Retour
              </button>
              <button onClick={handleConfirm}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Créer le compte
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
