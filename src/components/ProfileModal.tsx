import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, FileText, Upload, CheckCircle2, X, Building2, BadgeCheck, MapPin, Hash } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  if (!isOpen) return null;

  const isEfp = currentUser.role === 'efp';

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.telephone);
  const [cni, setCni] = useState(currentUser.cni);
  const [matricule, setMatricule] = useState(currentUser.matricule || '');
  const [efp, setEfp] = useState(currentUser.efp);
  const [directionRegionale, setDirectionRegionale] = useState(currentUser.directionRegionale);
  const [cvFileName, setCvFileName] = useState(currentUser.cvFileName || '');
  const [cvUploadedAt, setCvUploadedAt] = useState(currentUser.cvUploadedAt || '');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name,
      email,
      telephone: phone,
      cni,
      ...(isEfp && { matricule, efp, directionRegionale }),
      cvFileName: currentUser.role === 'stagiaire' ? cvFileName : currentUser.cvFileName,
      cvUploadedAt: currentUser.role === 'stagiaire' ? cvUploadedAt : currentUser.cvUploadedAt,
    });
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFileName(file.name);
      setCvUploadedAt(new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 border border-slate-200">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">Mon Profil Utilisateur</h2>
              <p className="text-xs text-slate-500">Consulter et mettre à jour vos coordonnées officielles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CNI</label>
              <input
                type="text"
                value={cni}
                onChange={(e) => setCni(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono uppercase focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Institutional Affiliation — editable for EFP, read-only for others */}
          {isEfp ? (
            <div className="space-y-3 border border-amber-200 bg-amber-50/40 rounded-xl p-4">
              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
                <BadgeCheck className="w-3.5 h-3.5" />
                Informations institutionnelles — modifiables
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-amber-600" />
                    Matricule
                  </label>
                  <input
                    type="text"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-400"
                    placeholder="Ex : 09841"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rôle système</label>
                  <div className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-500 font-mono cursor-not-allowed">
                    EFP (non modifiable)
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  Établissement (EFP)
                </label>
                <input
                  type="text"
                  value={efp}
                  onChange={(e) => setEfp(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-400"
                  placeholder="Ex : ISFO Casablanca (Sidi Maârouf)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  Direction Régionale (DR)
                </label>
                <select
                  value={directionRegionale}
                  onChange={(e) => setDirectionRegionale(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-400"
                >
                  {[
                    'DR Casablanca-Settat',
                    'DR Rabat-Salé-Kénitra',
                    'DR Marrakech-Safi',
                    'DR Fès-Meknès',
                    'DR Tanger-Tétouan-Al Hoceïma',
                    'DR Souss-Massa',
                    'DR Oriental',
                    'DR Béni Mellal-Khénifra',
                    'DR Drâa-Tafilalet',
                    'DR Laâyoune-Sakia El Hamra',
                    'DR Dakhla-Oued Ed-Dahab',
                    'DR Guelmim-Oued Noun',
                  ].map(dr => (
                    <option key={dr} value={dr}>{dr}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Rôle :</span>
                <span className="font-bold text-slate-800 uppercase">{currentUser.role}</span>
              </div>
              {currentUser.matricule && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Matricule :</span>
                  <span className="font-mono font-bold text-slate-800">{currentUser.matricule}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Établissement (EFP) :</span>
                <span className="font-semibold text-slate-800">{currentUser.efp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Direction Régionale :</span>
                <span className="font-semibold text-slate-800">{currentUser.directionRegionale}</span>
              </div>
              {currentUser.groupe && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Groupe & Filière :</span>
                  <span className="font-semibold text-blue-900">{currentUser.groupe} - {currentUser.filiere}</span>
                </div>
              )}
            </div>
          )}

          {/* Stagiaire specific CV upload */}
          {currentUser.role === 'stagiaire' ? (
            <div className="border-t border-slate-200 pt-4">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Mon Curriculum Vitae (CV) pour les entreprises d'accueil
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Le CV est consultable par les entreprises partenaires et votre formateur référent.
              </p>

              {cvFileName ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 mb-2">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-950">{cvFileName}</p>
                      <p className="text-[10px] text-emerald-700">Déposé le {cvUploadedAt || 'Récemment'}</p>
                    </div>
                  </div>
                  <label className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 cursor-pointer underline">
                    Remplacer
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-medium text-slate-700">Téléverser mon CV (PDF, DOCX)</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Glisser-déposer ou cliquer ici</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCvUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 italic bg-slate-50/60 p-2.5 rounded-lg">
              * Conformément aux règles d’habilitation du système FPA, seuls les comptes stagiaires disposent du module de téléversement de CV.
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-2.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Profil mis à jour avec succès !</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
