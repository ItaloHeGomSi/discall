import React, { useState, useRef, useEffect } from 'react';
import { Server, ServerChannel } from '../../types/server.types';
import { useServerStore } from '../../stores/serverStore';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Hash, Send } from 'lucide-react';

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
    <div className="flex-1 flex flex-col bg-[#0E1015]/65 backdrop-blur-[2px] h-full overflow-hidden">
      {/* Header da Sala de Texto */}
      <div className="h-14 border-b border-[#22262F] px-4 flex items-center justify-between bg-[#12151C] shrink-0">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-[#626B7A]" />
          <span className="font-semibold text-sm text-[#F1F3F8]">{channel.name}</span>
          {channel.topic && (
            <>
              <span className="text-[#626B7A]">•</span>
              <span className="text-xs text-[#9AA3B2] truncate">{channel.topic}</span>
            </>
          )}
        </div>
      </div>

      {/* Lista de Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Boas vindas à sala */}
        <div className="p-4 rounded-lg bg-[#12151C] border border-[#22262F] mb-4">
          <div className="w-8 h-8 rounded bg-[#1B2340] flex items-center justify-center text-[#93A6FF] mb-2 font-bold">
            #
          </div>
          <h3 className="font-bold text-base text-[#F1F3F8]">
            Bem-vindo a #{channel.name}!
          </h3>
          <p className="text-xs text-[#9AA3B2] mt-1">
            Este é o início da sala #{channel.name} no grupo {server.name}.
          </p>
        </div>

        {messages.map((msg) => {
          const isMe = msg.authorId === user.id;
          return (
            <div key={msg.id} className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded bg-[#1B1F29] border border-[#333A48] flex items-center justify-center font-bold text-xs text-[#93A6FF]">
                {msg.authorName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold text-xs ${
                      isMe ? 'text-[#93A6FF]' : 'text-[#5EDB8F]'
                    }`}
                  >
                    {msg.authorName}
                  </span>
                  <span className="text-[10px] text-[#626B7A]">
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

      {/* Input de Mensagem na Sala */}
      <div className="p-3 bg-[#12151C] border-t border-[#22262F] shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Conversar em #${channel.name}...`}
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
