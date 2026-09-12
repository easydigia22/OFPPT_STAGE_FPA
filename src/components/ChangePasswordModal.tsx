import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../types';
import { db } from '../lib/db';

interface ChangePasswordModalProps {
  user: UserProfile;
  onPasswordChanged: (updatedUser: UserProfile) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ user, onPasswordChanged }) => {
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const strength = (() => {
    if (newPwd.length === 0) return 0;
    let s = 0;
    if (newPwd.length >= 8) s++;
    if (/[A-Z]/.test(newPwd)) s++;
    if (/[0-9]/.test(newPwd)) s++;
    if (/[^A-Za-z0-9]/.test(newPwd)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Faible', 'Moyen', 'Fort', 'Très fort'][strength];
  const strengthColor = ['', 'bg-rose-400', 'bg-amber-400', 'bg-blue-500', 'bg-emerald-500'][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPwd.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    if (newPwd !== confirmPwd) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (newPwd === user.tempPassword) { setError('Le nouveau mot de passe doit être différent du mot de passe provisoire.'); return; }

    setSaving(true);
    try {
      const updated: UserProfile = {
        ...user,
        tempPassword: undefined,
        passwordChanged: true,
      };
      await db.profiles.upsert(updated);
      onPasswordChanged(updated);
    } catch {
      setError('Erreur lors de la mise à jour. Réessayez.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-200">

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Changement de mot de passe requis</h2>
          <p className="text-sm text-slate-500 mt-1">
            Bonjour <strong>{user.name}</strong>. Votre compte utilise un mot de passe provisoire.
            Définissez un mot de passe personnel pour continuer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nouveau mot de passe <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                required
                placeholder="Min. 8 caractères"
                className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button type="button" tabIndex={-1} onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Strength bar */}
            {newPwd.length > 0 && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${strengthColor}`} style={{ width: `${strength * 25}%` }} />
                </div>
                <span className="text-[11px] font-medium text-slate-500">{strengthLabel}</span>
              </div>
            )}
          </div>

          {/* Confirm */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirmer le mot de passe <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                required
                placeholder="Répétez le mot de passe"
                className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button type="button" tabIndex={-1} onClick={() => setShowConfirm(v => !v)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPwd.length > 0 && newPwd === confirmPwd && (
              <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Les mots de passe correspondent
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl p-3">
              <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <p className="text-xs text-rose-700 font-medium">{error}</p>
            </div>
          )}

          <button type="submit" disabled={saving}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
            {saving ? 'Enregistrement…' : 'Définir mon mot de passe'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          Ce changement est obligatoire et ne peut pas être ignoré.
        </p>
      </div>
    </div>
  );
};
