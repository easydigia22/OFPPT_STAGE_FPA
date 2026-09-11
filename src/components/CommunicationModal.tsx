import React, { useState } from 'react';
import { MessageDiscussion, UserProfile, UserRole } from '../types';
import { MessageSquare, Send, User, CheckCheck, Paperclip, X, Clock } from 'lucide-react';

interface CommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  messages: MessageDiscussion[];
  onSendMessage: (msg: Omit<MessageDiscussion, 'id' | 'dateEnvoi' | 'lu'>) => void;
}

export const CommunicationModal: React.FC<CommunicationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  messages,
  onSendMessage,
}) => {
  const [selectedRecipientRole, setSelectedRecipientRole] = useState<UserRole | 'entreprise'>('formateur');
  const [sujet, setSujet] = useState('');
  const [contenu, setContenu] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  if (!isOpen) return null;

  // Filter messages relevant to current user
  const relevantMessages = messages.filter(
    m => m.expediteurId === currentUser.id || m.destinataireId === currentUser.id || m.destinataireRole === currentUser.role || m.destinataireId === 'all'
  );

  const displayedMessages = filterRole === 'all' 
    ? relevantMessages 
    : relevantMessages.filter(m => m.expediteurRole === filterRole || m.destinataireRole === filterRole);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contenu.trim()) return;

    let destName = 'Formateur Conseiller FPA';
    if (selectedRecipientRole === 'stagiaire') destName = 'Youssef KADIRI (Stagiaire)';
    if (selectedRecipientRole === 'efp') destName = 'Direction EFP (Driss TAZI)';
    if (selectedRecipientRole === 'dr') destName = 'Direction Régionale (Amina BENCHEIKH)';
    if (selectedRecipientRole === 'entreprise') destName = 'Tuteur Entreprise (Capgemini)';

    onSendMessage({
      expediteurId: currentUser.id,
      expediteurNom: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
      expediteurRole: currentUser.role,
      destinataireId: selectedRecipientRole,
      destinataireNom: destName,
      destinataireRole: selectedRecipientRole,
      sujet: sujet || 'Communication FPA',
      contenu,
    });

    setContenu('');
    setSujet('');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'stagiaire':
        return 'bg-emerald-100 text-emerald-800';
      case 'formateur':
        return 'bg-blue-100 text-blue-800';
      case 'efp':
        return 'bg-amber-100 text-amber-800';
      case 'dr':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100">Espace Communication & Collaboration FPA</h2>
              <p className="text-xs text-slate-400">Échanges directs entre Stagiaires, Formateurs, EFP, Direction Régionale et Entreprises</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-semibold text-slate-500 whitespace-nowrap">Filtrer par acteur :</span>
          {['all', 'stagiaire', 'formateur', 'efp', 'dr'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1 rounded-full capitalize font-medium transition-all ${
                filterRole === role
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {role === 'all' ? 'Tous les messages' : role}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {displayedMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Aucun échange enregistré pour cette vue. Initiez une discussion ci-dessous.
            </div>
          ) : (
            displayedMessages.map((msg) => {
              const isMine = msg.expediteurId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs border ${
                      isMine
                        ? 'bg-blue-600 text-white border-blue-700 rounded-tr-none'
                        : 'bg-white text-slate-900 border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-white/20">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          isMine ? 'bg-blue-800 text-blue-100' : getRoleBadge(msg.expediteurRole)
                        }`}>
                          {msg.expediteurRole}
                        </span>
                        <span className="text-xs font-bold truncate">
                          {isMine ? 'Moi' : msg.expediteurNom}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] opacity-75">
                        <Clock className="w-3 h-3" />
                        <span>{msg.dateEnvoi}</span>
                      </div>
                    </div>

                    <h4 className={`text-xs font-bold mb-1 ${isMine ? 'text-blue-100' : 'text-slate-800'}`}>
                      {msg.sujet}
                    </h4>
                    <p className={`text-xs whitespace-pre-wrap leading-relaxed ${isMine ? 'text-blue-50' : 'text-slate-600'}`}>
                      {msg.contenu}
                    </p>

                    <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] opacity-80">
                      <span>Destinataire : <strong className="font-semibold">{msg.destinataireNom}</strong></span>
                      {isMine && <CheckCheck className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Envoyer à :</span>
            <select
              value={selectedRecipientRole}
              onChange={(e) => setSelectedRecipientRole(e.target.value as any)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-medium focus:outline-hidden focus:border-blue-500"
            >
              <option value="formateur">Formateur Conseiller FPA</option>
              <option value="stagiaire">Stagiaire</option>
              <option value="efp">Direction EFP</option>
              <option value="dr">Direction Régionale (DR)</option>
              <option value="entreprise">Tuteur Entreprise Partenaire</option>
            </select>

            <input
              type="text"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              placeholder="Objet du message (ex: Rapport visite, convention, justificatif)"
              className="flex-1 min-w-[200px] px-3 py-1 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <textarea
              rows={2}
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              placeholder={`Écrivez votre message en tant que ${currentUser.name}...`}
              className="flex-1 p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-500 resize-none"
            />
            <button
              type="submit"
              disabled={!contenu.trim()}
              className="px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Envoyer</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
