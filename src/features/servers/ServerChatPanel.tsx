import React, { useState, useRef, useEffect } from 'react';
import { Server, ServerChannel } from '../../types/server.types';
import { useServerStore } from '../../stores/serverStore';
import { useAuthStore } from '../../stores/authStore';
import { VoxelButton } from '../../components/ui/VoxelButton';
import { Hash, Send, Sparkles } from 'lucide-react';

interface ServerChatPanelProps {
  server: Server;
  channel: ServerChannel;
}

export const ServerChatPanel: React.FC<ServerChatPanelProps> = ({ server, channel }) => {
  const { channelMessages, sendChannelMessage } = useServerStore();
  const { user } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = channelMessages[channel.id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChannelMessage(server.id, channel.id, user.id, user.username, inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0E1015] h-full overflow-hidden">
      {/* Header do Canal de Texto */}
      <div className="h-14 border-b border-[#222634] px-4 flex items-center justify-between bg-[#14161C] shrink-0">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-[#646A7E]" />
          <span className="font-semibold text-sm text-[#F0F2F8]">{channel.name}</span>
          {channel.topic && (
            <>
              <span className="text-[#646A7E]">•</span>
              <span className="text-xs text-[#9DA3B4] truncate">{channel.topic}</span>
            </>
          )}
        </div>
      </div>

      {/* Lista de Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Boas vindas ao canal */}
        <div className="p-4 rounded-lg bg-[#14161C] border border-[#222634] mb-4">
          <div className="w-8 h-8 rounded bg-[#1E222D] flex items-center justify-center text-[#55FF55] mb-2 font-mono font-bold">
            #
          </div>
          <h3 className="font-bold text-base text-[#F0F2F8]">
            Bem-vindo a #{channel.name}!
          </h3>
          <p className="text-xs text-[#9DA3B4] mt-1">
            Este é o início do canal #{channel.name} no servidor {server.name}.
          </p>
        </div>

        {messages.map((msg) => {
          const isMe = msg.authorId === user.id;
          return (
            <div key={msg.id} className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded bg-[#1E222D] border border-[#2B3142] flex items-center justify-center font-mono font-bold text-xs text-[#55FF55]">
                {msg.authorName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold text-xs ${
                      isMe ? 'text-[#55FF55]' : 'text-[#55FFFF]'
                    }`}
                  >
                    {msg.authorName}
                  </span>
                  <span className="text-[10px] text-[#646A7E] font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-[#E2E4EB] mt-0.5 whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem no Canal */}
      <div className="p-3 bg-[#14161C] border-t border-[#222634] shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Conversar em #${channel.name}...`}
            className="flex-1 bg-[#0C0D10] border border-[#2B3142] rounded-lg px-4 py-2.5 text-sm text-[#F0F2F8] focus:outline-none focus:border-[#55FF55]"
          />
          <VoxelButton type="submit" variant="emerald" size="md">
            <Send className="w-4 h-4" />
          </VoxelButton>
        </form>
      </div>
    </div>
  );
};
