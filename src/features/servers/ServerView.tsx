import React from 'react';
import { useServerStore } from '../../stores/serverStore';
import { useCallStore } from '../../stores/callStore';
import { useFriendStore } from '../../stores/friendStore';
import { useAuthStore } from '../../stores/authStore';
import { ChannelList } from './ChannelList';
import { ServerChatPanel } from './ServerChatPanel';
import { CallGrid } from '../call/CallGrid';
import { Avatar } from '../../components/ui/Avatar';
import { Shield, Crown, Users } from 'lucide-react';

export const ServerView: React.FC = () => {
  const { servers, activeServerId, activeChannelId } = useServerStore();
  const { isInCall, callType } = useCallStore();
  const { friends } = useFriendStore();
  const { user } = useAuthStore();

  if (!activeServerId || !servers[activeServerId]) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#626B7A] text-sm">
        Selecione um grupo na barra lateral para começar.
      </div>
    );
  }

  const server = servers[activeServerId];
  const activeChannel = server.channels.find((c) => c.id === activeChannelId);

  // Lista de membros do grupo
  const memberList = Object.values(server.members).map((m) => {
    if (m.userId === user?.id) {
      return {
        ...m,
        username: `${user.username} (Você)`,
        avatarColor: user.avatarColor,
        avatarUrl: user.avatarUrl,
        status: user.status,
      };
    }
    const friendData = friends[m.userId];
    return {
      ...m,
      username: friendData ? friendData.username : `Membro-${m.userId.slice(0, 5)}`,
      avatarColor: friendData ? friendData.avatarColor : (user?.avatarColor || '#5B7CFA'),
      avatarUrl: friendData?.avatarUrl,
      status: friendData ? friendData.status : 'offline',
    };
  });

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      {/* 1. Lista de Salas */}
      <ChannelList server={server} />

      {/* 2. Área Central: Chamada de Voz Ativa OU Chat da Sala de Texto */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
        {isInCall && callType === 'server' ? (
          <CallGrid />
        ) : activeChannel && activeChannel.type === 'text' ? (
          <ServerChatPanel server={server} channel={activeChannel} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#626B7A] bg-[#0B0D12]/40 backdrop-blur-[2px]">
            <Users className="w-10 h-10 mb-2 text-[#5B7CFA]/60" />
            <h3 className="text-base font-semibold text-[#F1F3F8]">
              Sala de Voz: {activeChannel?.name || 'Selecione uma sala'}
            </h3>
            <p className="text-xs text-[#9AA3B2] mt-1 max-w-sm">
              Clique na sala de voz à esquerda para entrar na chamada com sua equipe.
            </p>
          </div>
        )}
      </div>

      {/* 3. Lista de Membros à Direita */}
      <div className="w-56 bg-[#111318] border-l border-[#22262F] flex flex-col p-3 overflow-y-auto shrink-0 select-none hidden lg:flex">
        <span className="text-[11px] font-semibold uppercase text-[#626B7A] tracking-wider mb-3">
          Membros — {memberList.length}
        </span>

        <div className="space-y-1.5">
          {memberList.map((m) => (
            <div
              key={m.userId}
              className="flex items-center gap-2.5 p-1.5 rounded hover:bg-[#161A22] transition-colors cursor-pointer"
            >
              <div className="relative">
                <Avatar username={m.username} avatarColor={m.avatarColor} avatarUrl={m.avatarUrl} size={28} />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#111318] ${
                    m.status === 'online' ? 'bg-[#22C55E]' : 'bg-[#626B7A]'
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  {m.isOwner ? (
                    <Crown className="w-3 h-3 text-[#F59E0B] shrink-0" />
                  ) : m.roleIds.length > 0 ? (
                    <Shield className="w-3 h-3 text-[#5B7CFA] shrink-0" />
                  ) : null}
                  <span className="text-xs font-medium text-[#E2E4EB] truncate">
                    {m.username}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
