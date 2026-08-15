import React, { useState, useRef, useEffect } from 'react';
import { useCallStore } from '../../stores/callStore';
import { useAuthStore } from '../../stores/authStore';
import { VoxelButton } from '../../components/ui/VoxelButton';
import { X, Send } from 'lucide-react';

export const CallSideChat: React.FC = () => {
  const { callMessages, sendCallMessage, toggleChat } = useCallStore();
  const { user } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [callMessages]);

  if (!user) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendCallMessage(user.id, user.username, inputText.trim());
    setInputText('');
  };

  return (
    <div className="w-80 bg-[#111318] border-l border-[#222634] flex flex-col h-full shrink-0 select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="h-12 px-4 border-b border-[#222634] flex items-center justify-between bg-[#14161C]">
        <span className="font-semibold text-xs text-[#F0F2F8] uppercase tracking-wider font-mono">
          Chat da Chamada
        </span>
        <button
          onClick={toggleChat}
          className="p-1 rounded hover:bg-[#1E222D] text-[#9DA3B4] hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mensagens */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {callMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-[#646A7E] text-xs p-4">
            <span>💬 Nenhuma mensagem ainda na chamada. Envie links de coordenadas ou converse aqui!</span>
          </div>
        ) : (
          callMessages.map((msg) => (
            <div key={msg.id} className="text-xs bg-[#1A1D26] p-2.5 rounded-lg border border-[#2B3142]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-[#55FF55]">{msg.senderName}</span>
                <span className="text-[10px] text-[#646A7E] font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-[#E2E4EB] whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-[#14161C] border-t border-[#222634] flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Conversar na chamada..."
          className="flex-1 bg-[#0C0D10] border border-[#2B3142] rounded px-3 py-1.5 text-xs text-[#F0F2F8] focus:outline-none focus:border-[#55FF55]"
        />
        <VoxelButton type="submit" variant="emerald" size="sm">
          <Send className="w-3.5 h-3.5" />
        </VoxelButton>
      </form>
    </div>
  );
};
