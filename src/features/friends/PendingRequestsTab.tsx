import React, { useState } from 'react';
import { useFriendStore } from '../../stores/friendStore';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Check, X, UserPlus } from 'lucide-react';

export const PendingRequestsTab: React.FC = () => {
  const { requests, acceptRequest, declineRequest, sendRequest } = useFriendStore();
  const [targetUsername, setTargetUsername] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const incomingRequests = requests.filter((r) => r.type === 'incoming');
  const outgoingRequests = requests.filter((r) => r.type === 'outgoing');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUsername.trim() || !targetEmail.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Informe nome e e-mail válidos.' });
      return;
    }
    sendRequest(targetUsername.trim(), targetEmail.trim());
    setTargetUsername('');
    setTargetEmail('');
    setFeedbackMsg({ type: 'ok', text: 'Solicitação enviada com sucesso!' });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Formulário para Adicionar Contato */}
      <div className="p-4 rounded-lg bg-[#12151C] border border-[#22262F]">
        <h4 className="text-sm font-semibold text-[#F1F3F8] flex items-center gap-2 mb-1">
          <UserPlus className="w-4 h-4 text-[#5B7CFA]" />
          Adicionar Contato
        </h4>
        <p className="text-xs text-[#9AA3B2] mb-3">
          Envie uma solicitação usando o nome e o e-mail do colega de equipe.
        </p>

        <form onSubmit={handleSend} className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            value={targetUsername}
            onChange={(e) => setTargetUsername(e.target.value)}
            placeholder="Nome (ex: Ana Torres)"
            className="flex-1 min-w-[160px] bg-[#0B0D12] border border-[#22262F] rounded px-3 py-2 text-sm text-[#F1F3F8] focus:outline-none focus:border-[#5B7CFA]"
          />
          <input
            type="email"
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            placeholder="email@empresa.com"
            className="flex-1 min-w-[160px] bg-[#0B0D12] border border-[#22262F] rounded px-3 py-2 text-sm text-[#F1F3F8] focus:outline-none focus:border-[#5B7CFA]"
          />
          <Button type="submit" variant="primary" size="md">
            Enviar Pedido
          </Button>
        </form>

        {feedbackMsg && (
          <p
            className={`text-xs mt-2 ${
              feedbackMsg.type === 'ok' ? 'text-[#5EDB8F]' : 'text-[#EF4444]'
            }`}
          >
            {feedbackMsg.text}
          </p>
        )}
      </div>

      {/* Solicitações Recebidas */}
      <div>
        <h4 className="text-xs font-semibold uppercase text-[#9AA3B2] tracking-wider mb-3">
          Solicitações Recebidas — {incomingRequests.length}
        </h4>

        {incomingRequests.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-[#22262F] rounded-lg text-xs text-[#626B7A]">
            Nenhuma solicitação pendente no momento.
          </div>
        ) : (
          <div className="space-y-2">
            {incomingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#12151C] border border-[#22262F]"
              >
                <div className="flex items-center gap-3">
                  <Avatar username={req.fromUsername} avatarColor={req.avatarColor} size={36} />
                  <div>
                    <span className="text-sm font-medium text-[#F1F3F8]">
                      {req.fromUsername}
                    </span>
                    <p className="text-[11px] text-[#9AA3B2]">Quer se conectar com você</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => acceptRequest(req.id)}
                    className="p-2 rounded bg-[#12321F] hover:bg-[#1F6A3D] text-[#5EDB8F] hover:text-white transition-colors cursor-pointer"
                    title="Aceitar Solicitação"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => declineRequest(req.id)}
                    className="p-2 rounded bg-[#3A1616] hover:bg-[#7A2A2A] text-[#EF4444] hover:text-white transition-colors cursor-pointer"
                    title="Recusar Solicitação"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Solicitações Enviadas */}
      {outgoingRequests.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase text-[#9AA3B2] tracking-wider mb-3">
            Solicitações Enviadas — {outgoingRequests.length}
          </h4>
          <div className="space-y-2">
            {outgoingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#12151C] border border-[#22262F] opacity-75"
              >
                <div className="flex items-center gap-3">
                  <Avatar username={req.fromUsername} avatarColor={req.avatarColor} size={36} />
                  <div>
                    <span className="text-sm font-medium text-[#F1F3F8]">
                      {req.fromUsername}
                    </span>
                    <p className="text-[11px] text-[#9AA3B2]">Aguardando resposta...</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => declineRequest(req.id)}
                  className="text-xs text-[#EF4444]"
                >
                  Cancelar
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
