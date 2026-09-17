import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { Shield, KeyRound, User, X, Loader2, ArrowRight, Building2, GraduationCap, Users, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole | null;
  onSelectUser: (user: UserProfile) => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  efp: 'Direction EFP',
  formateur: 'Formateur Conseiller FPA',
  stagiaire: 'Stagiaire FPA',
  dr: 'Direction Régionale',
};

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  efp: <Building2 className="w-5 h-5" />,
  formateur: <Users className="w-5 h-5" />,
  stagiaire: <GraduationCap className="w-5 h-5" />,
  dr: <MapPin className="w-5 h-5" />,
};

const ROLE_COLORS: Record<UserRole, string> = {
  efp: 'bg-amber-600',
  formateur: 'bg-blue-600',
  stagiaire: 'bg-emerald-600',
  dr: 'bg-purple-600',
};

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, role, onSelectUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen || !role) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      // Try Supabase Auth first
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (!authError && data.user) {
        const profile = await db.profiles.getByEmail(data.user.email!);
        if (profile) {
          onSelectUser(profile);
          onClose();
          return;
        }
      }

      // Fallback: match by email in profiles table
      const profile = await db.profiles.getByEmail(email.trim().toLowerCase());
      if (profile) {
        // Check provisional password
        if (profile.tempPassword && profile.passwordChanged === false) {
          if (password !== profile.tempPassword) {
            setError('Mot de passe provisoire incorrect.');
            setIsLoggingIn(false);
            return;
          }
        }
        onSelectUser(profile);
        onClose();
        return;
      }

      setError('Email ou mot de passe incorrect. Vérifiez vos identifiants.');
    } catch {
      setError('Erreur de connexion. Vérifiez votre connexion internet.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const colorClass = ROLE_COLORS[role];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className={`w-12 h-12 rounded-xl ${colorClass} text-white flex items-center justify-center shadow-lg`}>
            {ROLE_ICONS[role]}
          </div>
          <div className="text-center">
            <h2 className="font-bold text-lg text-slate-900">Connexion</h2>
            <p className="text-xs text-slate-500 mt-0.5">{ROLE_LABELS[role]}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Adresse e-mail</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="votre.email@ofppt.ma"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mot de passe</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full py-2.5 px-4 ${colorClass} hover:opacity-90 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm mt-2`}
          >
            {isLoggingIn
              ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Connexion…</span></>
              : <><span>Se connecter</span><ArrowRight className="w-4 h-4" /></>
            }
          </button>
        </form>
      </div>
    </div>
  );
};
