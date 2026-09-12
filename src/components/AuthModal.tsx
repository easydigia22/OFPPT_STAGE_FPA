import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { Shield, KeyRound, User, CheckCircle2, ArrowRight, X, Loader2, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUser,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      // Try Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        // Fallback: find user in profiles table by email (demo mode without auth accounts)
        const profile = await db.profiles.getByEmail(email);
        if (profile) {
          onSelectUser(profile);
          onClose();
        } else {
          // Last fallback: local users list
          const local = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (local) {
            onSelectUser(local);
            onClose();
          } else {
            setError('Identifiants non reconnus. Vérifiez votre email ou utilisez un profil rapide ci-dessous.');
          }
        }
      } else if (data.user) {
        // Auth success — load profile from DB
        const profile = await db.profiles.getByEmail(data.user.email!);
        if (profile) {
          onSelectUser(profile);
          onClose();
        } else {
          setError('Profil utilisateur introuvable. Contactez l\'administrateur.');
        }
      }
    } catch {
      setError('Erreur de connexion. Vérifiez votre connexion internet.');
    } finally {
      setIsLoggingIn(false);
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
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Persona Switcher */}
        <div className="mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2.5">
            Sélection rapide d'un profil (4 Rôles du Cahier des Charges)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {users.map((u) => {
              const badge = getRoleBadge(u.role);
              const isActive = currentUser.id === u.id;
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

        {/* Real Login Form */}
        <div className="border-t border-slate-100 pt-5">
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
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: m.elalami@ofppt.ma"
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
          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Mot de passe démo : <span className="font-mono font-bold text-slate-600">ofppt2026</span>
          </p>
        </div>
      </div>
    </div>
  );
};
