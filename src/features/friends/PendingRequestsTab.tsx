import React, { useState } from 'react';
import { useFriendStore } from '../../stores/friendStore';
import { CanvasAvatarRenderer } from '../../components/avatar/CanvasAvatarRenderer';
import { VoxelButton } from '../../components/ui/VoxelButton';
import { Check, X, UserPlus } from 'lucide-react';

export const PendingRequestsTab: React.FC = () => {
  const { requests, acceptRequest, declineRequest, sendRequest } = useFriendStore();
  const [targetUsername, setTargetUsername] = useState('');
  const [targetTag, setTargetTag] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const incomingRequests = requests.filter((r) => r.type === 'incoming');
  const outgoingRequests = requests.filter((r) => r.type === 'outgoing');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUsername.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Informe um nome de usuário válido.' });
      return;
    }
    sendRequest(targetUsername.trim(), targetTag.trim() || '0001');
    setTargetUsername('');
    setTargetTag('');
    setFeedbackMsg({ type: 'ok', text: `Solicitação de amizade enviada com sucesso!` });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Formulário para Adicionar Amigo */}
      <div className="p-4 rounded-lg bg-[#14161C] border border-[#222634]">
        <h4 className="text-sm font-semibold text-[#F0F2F8] flex items-center gap-2 mb-1">
          <UserPlus className="w-4 h-4 text-[#55FF55]" />
          Adicionar Amigo no Discall
        </h4>
        <p className="text-xs text-[#9DA3B4] mb-3">
          Você pode adicionar um amigo usando o nome de usuário do Minecraft ou tag.
        </p>

        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <input
            type="text"
            value={targetUsername}
            onChange={(e) => setTargetUsername(e.target.value)}
            placeholder="Nome do usuário (ex: AlexExplorer)"
            className="flex-1 bg-[#0C0D10] border border-[#2B3142] rounded px-3 py-2 text-sm text-[#F0F2F8] focus:outline-none focus:border-[#55FF55]"
          />
          <span className="text-[#646A7E] font-mono">#</span>
          <input
            type="text"
            value={targetTag}
            onChange={(e) => setTargetTag(e.target.value)}
            placeholder="0001"
            maxLength={4}
            className="w-20 bg-[#0C0D10] border border-[#2B3142] rounded px-3 py-2 text-sm font-mono text-[#F0F2F8] focus:outline-none focus:border-[#55FF55] text-center"
          />
          <VoxelButton type="submit" variant="emerald" size="md">
            Enviar Pedido
          </VoxelButton>
        </form>

        {feedbackMsg && (
          <p
            className={`text-xs mt-2 font-mono ${
              feedbackMsg.type === 'ok' ? 'text-[#55FF55]' : 'text-[#FF5555]'
            }`}
          >
            {feedbackMsg.text}
          </p>
        )}
      </div>

      {/* Solicitações Recebidas */}
      <div>
        <h4 className="text-xs font-mono font-semibold uppercase text-[#9DA3B4] tracking-wider mb-3">
          Solicitações Recebidas — {incomingRequests.length}
        </h4>

        {incomingRequests.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-[#222634] rounded-lg text-xs text-[#646A7E]">
            Nenhuma solicitação de amizade pendente no momento.
          </div>
        ) : (
          <div className="space-y-2">
            {incomingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#14161C] border border-[#222634]"
              >
                <div className="flex items-center gap-3">
                  <CanvasAvatarRenderer avatarConfig={req.avatarConfig} size={36} />
                  <div>
                    <span className="text-sm font-medium text-[#F0F2F8]">
                      {req.fromUsername}
                    </span>
                    <span className="text-xs text-[#646A7E] font-mono ml-1">
                      #{req.fromDiscriminator}
                    </span>
                    <p className="text-[11px] text-[#9DA3B4]">Quer ser seu amigo</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => acceptRequest(req.id)}
                    className="p-2 rounded bg-[#153D22] hover:bg-[#228844] text-[#55FF55] hover:text-white transition-colors cursor-pointer"
                    title="Aceitar Solicitação"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => declineRequest(req.id)}
                    className="p-2 rounded bg-[#3D1515] hover:bg-[#882222] text-[#FF5555] hover:text-white transition-colors cursor-pointer"
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
          <h4 className="text-xs font-mono font-semibold uppercase text-[#9DA3B4] tracking-wider mb-3">
            Solicitações Enviadas — {outgoingRequests.length}
          </h4>
          <div className="space-y-2">
            {outgoingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#14161C] border border-[#222634] opacity-75"
              >
                <div className="flex items-center gap-3">
                  <CanvasAvatarRenderer avatarConfig={req.avatarConfig} size={36} />
                  <div>
                    <span className="text-sm font-medium text-[#F0F2F8]">
                      {req.fromUsername}
                    </span>
                    <span className="text-xs text-[#646A7E] font-mono ml-1">
                      #{req.fromDiscriminator}
                    </span>
                    <p className="text-[11px] text-[#9DA3B4]">Aguardando resposta...</p>
                  </div>
                </div>
                <VoxelButton
                  variant="ghost"
                  size="sm"
                  onClick={() => declineRequest(req.id)}
                  className="text-xs text-[#FF5555]"
                >
                  Cancelar
                </VoxelButton>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
