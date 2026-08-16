import React, { useState, useRef, useEffect } from 'react';
import { useFriendStore } from '../../stores/friendStore';
import { useAuthStore } from '../../stores/authStore';
import { useCallStore } from '../../stores/callStore';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { PhoneCall, Send, ArrowLeft } from 'lucide-react';

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
      <div className="h-14 border-b border-[#22262F] px-4 flex items-center justify-between bg-[#12151C]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveDm(null)}
            className="md:hidden p-1.5 rounded hover:bg-[#1B1F29] text-[#9AA3B2]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Avatar username={friend.username} avatarColor={friend.avatarColor} avatarUrl={friend.avatarUrl} size={32} />
          <div>
            <span className="font-semibold text-sm text-[#F1F3F8]">
              {friend.customNickname || friend.username}
            </span>
            <p className="text-[11px] text-[#5EDB8F]">
              {friend.statusMessage || (friend.status === 'online' ? '● Online' : friend.status)}
            </p>
          </div>
        </div>

        <Button
          variant="success"
          size="sm"
          onClick={handleStartCall}
          className="flex items-center gap-1.5"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Iniciar Chamada</span>
        </Button>
      </div>

      {/* Lista de Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-[#626B7A]">
            <Avatar username={friend.username} avatarColor={friend.avatarColor} avatarUrl={friend.avatarUrl} size={64} className="mb-2" />
            <p className="text-sm font-semibold text-[#F1F3F8]">
              Este é o início do seu chat privado com {friend.username}.
            </p>
            <p className="text-xs text-[#9AA3B2] mt-1">
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
                <Avatar
                  username={isMe ? user.username : friend.username}
                  avatarColor={isMe ? user.avatarColor : friend.avatarColor}
                  avatarUrl={isMe ? user.avatarUrl : friend.avatarUrl}
                  size={28}
                />
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    isMe
                      ? 'bg-[#12321F] text-[#F1F3F8] border border-[#1F6A3D]'
                      : 'bg-[#181C25] text-[#E2E4EB] border border-[#22262F]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">
                      {isMe ? 'Você' : friend.username}
                    </span>
                    <span className="text-[10px] text-[#9AA3B2]">
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
      <div className="p-3 bg-[#12151C] border-t border-[#22262F]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Enviar mensagem para ${friend.username}...`}
            className="flex-1 bg-[#0B0D12] border border-[#22262F] rounded-lg px-4 py-2.5 text-sm text-[#F1F3F8] focus:outline-none focus:border-[#5B7CFA]"
          />
          <Button type="submit" variant="primary" size="md">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
