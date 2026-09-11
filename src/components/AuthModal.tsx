import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { Shield, KeyRound, User, CheckCircle2, ArrowRight, X } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      onSelectUser(found);
      setError('');
      onClose();
    } else {
      setError('Identifiants non reconnus. Vous pouvez sélectionner un profil prédéfini ci-dessous.');
    }
  };

  const selectPersona = (user: UserProfile) => {
    onSelectUser(user);
    onClose();
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'stagiaire':
        return { label: 'Stagiaire', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'formateur':
        return { label: 'Formateur Conseiller FPA', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'efp':
        return { label: 'Acteur Direction EFP', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'dr':
        return { label: 'Acteur Direction Régionale', color: 'bg-purple-100 text-purple-800 border-purple-300' };
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
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Persona Switcher for effortless testing */}
        <div className="mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2.5">
            Sélection rapide d’un profil de test (4 Rôles du Cahier des Charges)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {users.map((u) => {
              const badge = getRoleBadge(u.role);
              const isActive = currentUser.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => selectPersona(u)}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isActive
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
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

        {/* Manual Login Form */}
        <div className="border-t border-slate-100 pt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
            Ou connexion avec identifiants OFPPT
          </p>
          <form onSubmit={handleManualLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse e-mail ou matricule</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded border border-rose-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Se connecter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
