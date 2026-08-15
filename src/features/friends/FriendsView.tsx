import React, { useState } from 'react';
import { useFriendStore } from '../../stores/friendStore';
import { FriendItem } from './FriendItem';
import { PendingRequestsTab } from './PendingRequestsTab';
import { DirectChatPanel } from './DirectChatPanel';
import { Users, UserCheck, Clock, ShieldAlert, UserPlus, MessageSquare } from 'lucide-react';

type SubTab = 'online' | 'all' | 'pending' | 'blocked' | 'add_friend';

export const FriendsView: React.FC = () => {
  const { friends, requests, activeDmFriendId, setActiveDm } = useFriendStore();
  const [subTab, setSubTab] = useState<SubTab>('online');
  const [searchQuery, setSearchQuery] = useState('');

  const friendList = Object.values(friends);
  const pendingCount = requests.filter((r) => r.type === 'incoming').length;

  const filteredFriends = friendList.filter((f) => {
    if (subTab === 'blocked') return f.isBlocked;
    if (f.isBlocked) return false;

    if (subTab === 'online') {
      if (f.status === 'offline') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = f.username.toLowerCase().includes(q);
      const matchNick = f.customNickname?.toLowerCase().includes(q);
      return matchName || matchNick;
    }

    return true;
  });

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-transparent">
      {/* Coluna Esquerda: Lista de DMs com Transparência */}
      <div className="w-60 bg-[#0E1015]/75 backdrop-blur-xs border-r border-[#222634]/70 flex flex-col shrink-0">
        <div className="p-3 border-b border-[#222634]/70">
          <button
            onClick={() => {
              setActiveDm(null);
              setSubTab('online');
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${
              activeDmFriendId === null
                ? 'bg-[#228844] text-white shadow-[0_0_10px_rgba(85,255,85,0.4)]'
                : 'text-[#9DA3B4] hover:bg-[#1E222D]/80 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Painel de Amigos</span>
          </button>
        </div>

        {/* Lista de Mensagens Diretas */}
        <div className="p-3">
          <span className="text-[11px] font-mono font-semibold uppercase text-[#9DA3B4] tracking-wider block mb-2">
            Mensagens Diretas
          </span>
          <div className="space-y-1 overflow-y-auto">
            {friendList.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveDm(f.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                  activeDmFriendId === f.id
                    ? 'bg-[#1E222D]/90 text-[#55FF55] border border-[#55FF55]/40'
                    : 'text-[#9DA3B4] hover:bg-[#1A1D26]/80 hover:text-[#E2E4EB]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    f.status === 'online'
                      ? 'bg-[#55FF55]'
                      : f.status === 'in_game'
                      ? 'bg-[#B565D8]'
                      : f.status === 'idle'
                      ? 'bg-[#FFAA00]'
                      : 'bg-[#646A7E]'
                  }`}
                />
                <span className="truncate flex-1">{f.customNickname || f.username}</span>
                <MessageSquare className="w-3 h-3 text-[#646A7E]" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Central */}
      {activeDmFriendId ? (
        <DirectChatPanel friendId={activeDmFriendId} />
      ) : (
        <div className="flex-1 flex flex-col h-full bg-[#090A0D]/55 backdrop-blur-xs overflow-hidden">
          {/* Header com Sub-abas */}
          <div className="h-14 border-b border-[#222634]/70 px-4 flex items-center justify-between bg-[#14161C]/75 shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 pr-3 border-r border-[#222634]/70 text-sm font-semibold text-[#F0F2F8]">
                <Users className="w-4 h-4 text-[#55FF55]" />
                <span>Amigos</span>
              </div>

              <button
                onClick={() => setSubTab('online')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  subTab === 'online'
                    ? 'bg-[#1E222D] text-[#55FF55] border border-[#55FF55]/50'
                    : 'text-[#9DA3B4] hover:text-white'
                }`}
              >
                Disponíveis
              </button>

              <button
                onClick={() => setSubTab('all')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  subTab === 'all'
                    ? 'bg-[#1E222D] text-[#55FF55] border border-[#55FF55]/50'
                    : 'text-[#9DA3B4] hover:text-white'
                }`}
              >
                Todos ({friendList.length})
              </button>

              <button
                onClick={() => setSubTab('pending')}
                className={`relative px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  subTab === 'pending'
                    ? 'bg-[#1E222D] text-[#55FF55] border border-[#55FF55]/50'
                    : 'text-[#9DA3B4] hover:text-white'
                }`}
              >
                Pendentes
                {pendingCount > 0 && (
                  <span className="ml-1.5 bg-[#FF5555] text-[#0C0D10] font-bold text-[10px] px-1 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setSubTab('blocked')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  subTab === 'blocked'
                    ? 'bg-[#1E222D] text-[#FF5555] border border-[#FF5555]/50'
                    : 'text-[#9DA3B4] hover:text-white'
                }`}
              >
                Bloqueados
              </button>

              <button
                onClick={() => setSubTab('add_friend')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  subTab === 'add_friend'
                    ? 'bg-[#228844] text-white'
                    : 'bg-[#153D22] text-[#55FF55] hover:bg-[#1C522D]'
                }`}
              >
                + Adicionar Amigo
              </button>
            </div>
          </div>

          {/* Corpo da Aba */}
          <div className="flex-1 p-5 overflow-y-auto">
            {subTab === 'pending' || subTab === 'add_friend' ? (
              <PendingRequestsTab />
            ) : (
              <div className="space-y-4 max-w-4xl">
                {/* Barra de Busca */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar amigos pelo nome ou apelido..."
                  className="w-full bg-[#14161C]/80 backdrop-blur-xs border border-[#2B3142] rounded-lg px-4 py-2.5 text-sm text-[#F0F2F8] focus:outline-none focus:border-[#55FF55]"
                />

                <div className="text-xs font-mono font-semibold uppercase text-[#9DA3B4] tracking-wider">
                  {subTab === 'online' ? 'Amigos Disponíveis' : 'Lista Completa'} —{' '}
                  {filteredFriends.length}
                </div>

                {/* Grid de Amigos */}
                {filteredFriends.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-[#222634] rounded-lg text-xs text-[#646A7E] bg-[#14161C]/40">
                    Nenhum amigo encontrado neste filtro.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredFriends.map((f) => (
                      <FriendItem key={f.id} friend={f} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
