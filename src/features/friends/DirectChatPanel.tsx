import React, { useState, useRef, useEffect } from 'react';
import { useFriendStore } from '../../stores/friendStore';
import { useAuthStore } from '../../stores/authStore';
import { useCallStore } from '../../stores/callStore';
import { CanvasAvatarRenderer } from '../../components/avatar/CanvasAvatarRenderer';
import { VoxelButton } from '../../components/ui/VoxelButton';
import { PhoneCall, Send, ArrowLeft, Smile } from 'lucide-react';

interface DirectChatPanelProps {
  friendId: string;
}

export const DirectChatPanel: React.FC<DirectChatPanelProps> = ({ friendId }) => {
  const { friends, directMessages, sendDirectMessage, setActiveDm } = useFriendStore();
  const { user } = useAuthStore();
  const { joinRoom } = useCallStore();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const friend = friends[friendId];
  const messages = directMessages[friendId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!friend || !user) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendDirectMessage(friendId, inputText.trim(), user.id);
    setInputText('');
  };

  const handleStartCall = () => {
    joinRoom(`p2p-${friend.id}`, `Chamada com ${friend.username}`, 'p2p');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0E1015] h-full">
      {/* Header do Chat Direto */}
      <div className="h-14 border-b border-[#222634] px-4 flex items-center justify-between bg-[#14161C]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveDm(null)}
            className="md:hidden p-1.5 rounded hover:bg-[#1E222D] text-[#9DA3B4]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <CanvasAvatarRenderer avatarConfig={friend.avatarConfig} size={32} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-[#F0F2F8]">
                {friend.customNickname || friend.username}
              </span>
              <span className="text-xs text-[#646A7E] font-mono">
                #{friend.discriminator}
              </span>
            </div>
            <p className="text-[11px] text-[#55FF55] font-mono">
              {friend.status === 'in_game' ? '🎮 Jogando Minecraft' : '● Online'}
            </p>
          </div>
        </div>

        <VoxelButton
          variant="emerald"
          size="sm"
          onClick={handleStartCall}
          className="flex items-center gap-1.5"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Iniciar Chamada</span>
        </VoxelButton>
      </div>

      {/* Lista de Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-[#646A7E]">
            <CanvasAvatarRenderer avatarConfig={friend.avatarConfig} size={64} className="mb-2" />
            <p className="text-sm font-semibold text-[#F0F2F8]">
              Este é o início do seu chat privado com {friend.username}.
            </p>
            <p className="text-xs text-[#9DA3B4] mt-1">
              Envie uma mensagem ou inicie uma chamada de voz e vídeo!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user.id;
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                <CanvasAvatarRenderer
                  avatarConfig={isMe ? user.avatarConfig : friend.avatarConfig}
                  size={28}
                />
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    isMe
                      ? 'bg-[#153D22] text-[#F0F2F8] border border-[#228844]'
                      : 'bg-[#1A1D26] text-[#E2E4EB] border border-[#2B3142]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">
                      {isMe ? 'Você' : friend.username}
                    </span>
                    <span className="text-[10px] text-[#9DA3B4] font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="p-3 bg-[#14161C] border-t border-[#222634]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enviar mensagem para @${friend.username}...`}
              className="w-full bg-[#0C0D10] border border-[#2B3142] rounded-lg px-4 py-2.5 text-sm text-[#F0F2F8] focus:outline-none focus:border-[#55FF55]"
            />
          </div>
          <VoxelButton type="submit" variant="emerald" size="md">
            <Send className="w-4 h-4" />
          </VoxelButton>
        </form>
      </div>
    </div>
  );
};
