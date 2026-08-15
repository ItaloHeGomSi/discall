import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Server, ServerChatMessage } from '../types/server.types';
import { PermissionFlags } from '../types/permissions';

interface ServerState {
  servers: Record<string, Server>;
  activeServerId: string | null;
  activeChannelId: string | null;
  channelMessages: Record<string, ServerChatMessage[]>; // channelId -> messages

  // Ações
  setActiveServer: (serverId: string | null) => void;
  setActiveChannel: (channelId: string | null) => void;
  createServer: (name: string, ownerId: string) => void;
  createChannel: (serverId: string, name: string, type: 'text' | 'voice') => void;
  sendChannelMessage: (serverId: string, channelId: string, authorId: string, authorName: string, content: string) => void;
}

const INITIAL_SERVERS: Record<string, Server> = {
  'server-realm-1': {
    id: 'server-realm-1',
    name: 'Hardcore Survival Realm 🌲',
    ownerId: 'local-steve-1234',
    description: 'Servidor oficial de exploração e construção 100% vanilla.',
    roles: {
      'role-owner': {
        id: 'role-owner',
        name: 'Dono do Reino',
        colorHex: '#FF5555',
        position: 100,
        permissions: PermissionFlags.ADMINISTRATOR,
        isMentionable: true,
      },
      'role-mod': {
        id: 'role-mod',
        name: 'Guardião do Templo',
        colorHex: '#55FFFF',
        position: 50,
        permissions: PermissionFlags.MUTE_MEMBERS | PermissionFlags.KICK_MEMBERS | PermissionFlags.REVOKE_SCREENSHARE | PermissionFlags.CONNECT_VOICE | PermissionFlags.SPEAK_VOICE | PermissionFlags.SEND_MESSAGES | PermissionFlags.VIEW_CHANNELS,
        isMentionable: true,
      },
      'role-member': {
        id: 'role-member',
        name: 'Aventureiro',
        colorHex: '#AAAAAA',
        position: 10,
        permissions: PermissionFlags.CONNECT_VOICE | PermissionFlags.SPEAK_VOICE | PermissionFlags.SHARE_SCREEN | PermissionFlags.SEND_MESSAGES | PermissionFlags.VIEW_CHANNELS,
        isMentionable: false,
      },
    },
    members: {
      'local-steve-1234': {
        userId: 'local-steve-1234',
        roleIds: ['role-owner'],
        isOwner: true,
        joinedAt: Date.now() - 86400000 * 30,
      },
      'friend-alex': {
        userId: 'friend-alex',
        roleIds: ['role-mod'],
        isOwner: false,
        joinedAt: Date.now() - 86400000 * 15,
      },
      'friend-notcher': {
        userId: 'friend-notcher',
        roleIds: ['role-member'],
        isOwner: false,
        joinedAt: Date.now() - 86400000 * 5,
      },
    },
    channels: [
      { id: 'ch-geral', name: 'geral-chat', type: 'text', position: 1, topic: 'Conversas gerais da vila' },
      { id: 'ch-prints', name: 'construcoes-prints', type: 'text', position: 2, topic: 'Fotos das bases' },
      { id: 'ch-voice-1', name: 'Lobby da Fogueira 🏕️', type: 'voice', position: 3, bitrate: 128000 },
      { id: 'ch-voice-2', name: 'Expedição Nether 🔥', type: 'voice', position: 4, bitrate: 128000 },
      { id: 'ch-voice-3', name: 'Mineração Silenciosa ⛏️', type: 'voice', position: 5, bitrate: 96000 },
    ],
  },
  'server-realm-2': {
    id: 'server-realm-2',
    name: 'Redstone Engineering ⚙️',
    ownerId: 'friend-notcher',
    description: 'Circuitos lógicos, farms automáticas e computadores dentro do Minecraft.',
    roles: {
      'role-admin': {
        id: 'role-admin',
        name: 'Mestre do Circuito',
        colorHex: '#FF5555',
        position: 100,
        permissions: PermissionFlags.ADMINISTRATOR,
        isMentionable: true,
      },
    },
    members: {
      'friend-notcher': {
        userId: 'friend-notcher',
        roleIds: ['role-admin'],
        isOwner: true,
        joinedAt: Date.now() - 86400000 * 60,
      },
      'local-steve-1234': {
        userId: 'local-steve-1234',
        roleIds: [],
        isOwner: false,
        joinedAt: Date.now() - 86400000 * 2,
      },
    },
    channels: [
      { id: 'ch-redstone-text', name: 'projetos-circuitos', type: 'text', position: 1 },
      { id: 'ch-redstone-voice', name: 'Bancada de Testes 🛠️', type: 'voice', position: 2, bitrate: 128000 },
    ],
  },
};

export const useServerStore = create<ServerState>()(
  immer((set) => ({
    servers: INITIAL_SERVERS,
    activeServerId: 'server-realm-1',
    activeChannelId: 'ch-geral',
    channelMessages: {
      'ch-geral': [
        {
          id: 'cm1',
          serverId: 'server-realm-1',
          channelId: 'ch-geral',
          authorId: 'friend-alex',
          authorName: 'AlexExplorer',
          content: 'Alguém tem 3 obsidianas para fechar o portal do Nether?',
          timestamp: Date.now() - 300000,
        },
        {
          id: 'cm2',
          serverId: 'server-realm-1',
          channelId: 'ch-geral',
          authorId: 'local-steve-1234',
          authorName: 'SteveMiner',
          content: 'Tem no baú comunitário do spawn! Acabei de deixar lá.',
          timestamp: Date.now() - 180000,
        },
      ],
    },

    setActiveServer: (serverId) =>
      set((state) => {
        state.activeServerId = serverId;
        if (serverId && state.servers[serverId]?.channels.length > 0) {
          state.activeChannelId = state.servers[serverId].channels[0].id;
        } else {
          state.activeChannelId = null;
        }
      }),

    setActiveChannel: (channelId) =>
      set((state) => {
        state.activeChannelId = channelId;
      }),

    createServer: (name, ownerId) =>
      set((state) => {
        const id = `server-${crypto.randomUUID().slice(0, 8)}`;
        state.servers[id] = {
          id,
          name,
          ownerId,
          roles: {
            'role-owner': {
              id: 'role-owner',
              name: 'Dono',
              colorHex: '#FF5555',
              position: 100,
              permissions: PermissionFlags.ADMINISTRATOR,
              isMentionable: true,
            },
          },
          members: {
            [ownerId]: {
              userId: ownerId,
              roleIds: ['role-owner'],
              isOwner: true,
              joinedAt: Date.now(),
            },
          },
          channels: [
            { id: `ch-${Date.now()}-1`, name: 'geral', type: 'text', position: 1 },
            { id: `ch-${Date.now()}-2`, name: 'Voz Principal 🎙️', type: 'voice', position: 2, bitrate: 128000 },
          ],
        };
        state.activeServerId = id;
        state.activeChannelId = state.servers[id].channels[0].id;
      }),

    createChannel: (serverId, name, type) =>
      set((state) => {
        if (state.servers[serverId]) {
          const newCh: any = {
            id: `ch-${Date.now()}`,
            name,
            type,
            position: state.servers[serverId].channels.length + 1,
            bitrate: type === 'voice' ? 128000 : undefined,
          };
          state.servers[serverId].channels.push(newCh);
        }
      }),

    sendChannelMessage: (serverId, channelId, authorId, authorName, content) =>
      set((state) => {
        if (!state.channelMessages[channelId]) {
          state.channelMessages[channelId] = [];
        }
        state.channelMessages[channelId].push({
          id: `cmsg-${Date.now()}`,
          serverId,
          channelId,
          authorId,
          authorName,
          content,
          timestamp: Date.now(),
        });
      }),
  }))
);
