import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { Shield, KeyRound, User, CheckCircle2, ArrowRight, X, Loader2, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  currentUser: UserProfile | null;
  onSelectUser: (user: UserProfile) => void;
  hideClose?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUser,
  hideClose = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Registration mode (when user not found)
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [regNom, setRegNom] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('efp');
  const [regEfp, setRegEfp] = useState('');
  const [regDr, setRegDr] = useState('DR Casablanca-Settat');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      // Try Supabase Auth first
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (!authError && data.user) {
        // Auth success — load profile from DB
        const profile = await db.profiles.getByEmail(data.user.email!);
        if (profile) {
          onSelectUser(profile);
          onClose();
          return;
        }
      }

      // Fallback: find profile by email
      const profile = await db.profiles.getByEmail(email);
      if (profile) {
        // If account has a provisional password, check it
        if (profile.tempPassword && profile.passwordChanged === false) {
          if (password !== profile.tempPassword) {
            setError('Mot de passe provisoire incorrect.');
            return;
          }
        }
        onSelectUser(profile);
        onClose();
        return;
      }

      // Not found — offer registration
      setError('');
      setMode('register');
    } catch {
      setError('Erreur de connexion. Vérifiez votre connexion internet.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNom.trim() || !email.trim()) { setRegError('Nom et email obligatoires.'); return; }
    setRegError('');
    setIsRegistering(true);

    try {
      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        name: regNom.trim(),
        email: email.trim().toLowerCase(),
        role: regRole,
        efp: (regRole === 'efp' || regRole === 'formateur') ? regEfp.trim() : '',
        directionRegionale: regDr,
        telephone: '',
        cni: '',
      };
      await db.profiles.upsert(newProfile);
      onSelectUser(newProfile);
      onClose();
    } catch (err) {
      setRegError('Erreur lors de la création du compte. Réessayez.');
    } finally {
      setIsRegistering(false);
    }
  };

  const selectPersona = (user: UserProfile) => {
    onSelectUser(user);
    onClose();
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'stagiaire': return { label: 'Stagiaire', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'formateur': return { label: 'Formateur Conseiller FPA', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'efp':       return { label: 'Acteur Direction EFP', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'dr':        return { label: 'Acteur Direction Régionale', color: 'bg-purple-100 text-purple-800 border-purple-300' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200">

        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">Authentification FPA Pilot</h2>
              <p className="text-xs text-slate-500">Portail des acteurs de la Formation Professionnelle Alternée</p>
            </div>
          </div>
          {!hideClose && (
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Persona Switcher — only shown when accounts exist */}
        {users.length > 0 && (
          <div className="mb-6">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2.5">
              Sélection rapide d'un profil
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {users.map((u) => {
                const badge = getRoleBadge(u.role);
                const isActive = currentUser?.id === u.id;
                return (
                  <button key={u.id} onClick={() => selectPersona(u)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isActive
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{u.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{u.efp}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <div className={users.length > 0 ? 'border-t border-slate-100 pt-5' : ''}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <LogIn className="w-3.5 h-3.5" />
              Connexion avec identifiants OFPPT
            </p>
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse e-mail</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder="ex: k.hamdii@ofppt.ma"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              {error && (
                <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded border border-rose-200">{error}</p>
              )}
              <button type="submit" disabled={isLoggingIn}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer">
                {isLoggingIn
                  ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Connexion…</span></>
                  : <><span>Se connecter</span><ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>
          </div>
        )}

        {/* Registration Form — shown when email not found */}
        {mode === 'register' && (
          <div className={users.length > 0 ? 'border-t border-slate-100 pt-5' : ''}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Créer mon compte</p>
                <p className="text-xs text-slate-500">Email non trouvé — complétez votre profil pour accéder au système.</p>
              </div>
            </div>
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email (non modifiable)</label>
                <input type="email" value={email} readOnly
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom complet <span className="text-rose-500">*</span></label>
                <input type="text" value={regNom} onChange={(e) => setRegNom(e.target.value)} required
                  placeholder="ex: Kaoutar HAMDII"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rôle <span className="text-rose-500">*</span></label>
                <select value={regRole} onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="efp">Direction EFP</option>
                  <option value="formateur">Formateur Conseiller FPA</option>
                  <option value="dr">Direction Régionale (DR)</option>
                  <option value="stagiaire">Stagiaire FPA</option>
                </select>
              </div>
              {(regRole === 'efp' || regRole === 'formateur') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Établissement (EFP)</label>
                  <input type="text" value={regEfp} onChange={(e) => setRegEfp(e.target.value)}
                    placeholder="ex: ISTA NTIC Sidi Maârouf Casablanca"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Direction Régionale</label>
                <select value={regDr} onChange={(e) => setRegDr(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option>DR Casablanca-Settat</option>
                  <option>DR Rabat-Salé-Kénitra</option>
                  <option>DR Marrakech-Safi</option>
                  <option>DR Tanger-Tétouan-Al Hoceïma</option>
                  <option>DR Fès-Meknès</option>
                  <option>DR Souss-Massa</option>
                  <option>DR Oriental</option>
                  <option>DR Béni Mellal-Khénifra</option>
                  <option>DR Laâyoune-Sakia El Hamra</option>
                  <option>DR Dakhla-Oued Ed-Dahab</option>
                  <option>DR Drâa-Tafilalet</option>
                  <option>DR Guelmim-Oued Noun</option>
                </select>
              </div>
              {regError && (
                <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded border border-rose-200">{regError}</p>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => setMode('login')}
                  className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 font-medium rounded-xl text-sm hover:bg-slate-50 transition-colors">
                  Retour
                </button>
                <button type="submit" disabled={isRegistering}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                  {isRegistering
                    ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Création…</span></>
                    : <><UserPlus className="w-4 h-4" /><span>Créer et accéder</span></>
                  }
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
