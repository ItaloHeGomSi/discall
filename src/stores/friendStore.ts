import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Friend, FriendRequest, DirectMessage } from '../types/friend.types';
import { DEFAULT_AVATAR } from '../types/skin.types';

interface FriendState {
  friends: Record<string, Friend>;
  requests: FriendRequest[];
  activeDmFriendId: string | null;
  directMessages: Record<string, DirectMessage[]>; // friendId -> messages
  
  // Ações
  setCustomNickname: (friendId: string, nickname: string) => void;
  removeFriend: (friendId: string) => void;
  blockUser: (friendId: string) => void;
  unblockUser: (friendId: string) => void;
  acceptRequest: (requestId: string) => void;
  declineRequest: (requestId: string) => void;
  sendRequest: (username: string, discriminator: string) => void;
  setActiveDm: (friendId: string | null) => void;
  sendDirectMessage: (friendId: string, content: string, senderId: string) => void;
}

const INITIAL_FRIENDS: Record<string, Friend> = {
  'friend-alex': {
    id: 'friend-alex',
    username: 'AlexExplorer',
    discriminator: '1337',
    status: 'in_game',
    activity: {
      gameName: 'Minecraft 1.21.4',
      dimension: 'The End',
      details: 'Caçando asas de Elytra 🪽',
      elapsedTime: 3600,
    },
    avatarConfig: {
      ...DEFAULT_AVATAR,
      hairStyle: 'alex_ponytail',
      hairColor: 'ginger',
      skinTone: 'fair',
      outfit: 'diamond_chestplate',
      heldItem: 'golden_apple',
      facialHair: 'none',
      accessory: 'diamond_crown',
    },
    isBlocked: false,
  },
  'friend-notcher': {
    id: 'friend-notcher',
    username: 'RedstoneLord',
    discriminator: '4040',
    status: 'online',
    activity: {
      gameName: 'Visual Studio Code',
      dimension: 'Overworld',
      details: 'Criando farms automáticas de ferro ⚙️',
      elapsedTime: 1800,
    },
    avatarConfig: {
      ...DEFAULT_AVATAR,
      hairStyle: 'curly_crop',
      hairColor: 'black',
      skinTone: 'tan',
      outfit: 'tuxedo',
      heldItem: 'redstone_torch',
      facialHair: 'mustache',
      accessory: 'pixel_glasses',
    },
    isBlocked: false,
  },
  'friend-herobrine': {
    id: 'friend-herobrine',
    username: 'ShadowWalker',
    discriminator: '0000',
    status: 'idle',
    activity: {
      gameName: 'Minecraft',
      dimension: 'Deep Dark',
      details: 'Evitando o Warden no silêncio 🕯️',
      elapsedTime: 900,
    },
    avatarConfig: {
      ...DEFAULT_AVATAR,
      hairStyle: 'undercut',
      hairColor: 'white',
      skinTone: 'pale',
      outfit: 'netherite_armor',
      heldItem: 'totem_of_undying',
      facialHair: 'goatee',
      accessory: 'vr_headset',
    },
    isBlocked: false,
  },
};

const INITIAL_REQUESTS: FriendRequest[] = [
  {
    id: 'req-1',
    fromUserId: 'user-craftman',
    fromUsername: 'CraftMaster_BR',
    fromDiscriminator: '7788',
    avatarConfig: {
      ...DEFAULT_AVATAR,
      hairColor: 'blonde',
      outfit: 'overalls',
      heldItem: 'potion_healing',
    },
    createdAt: Date.now() - 3600000,
    type: 'incoming',
  },
  {
    id: 'req-2',
    fromUserId: 'user-diamondgirl',
    fromUsername: 'DiamondQueen',
    fromDiscriminator: '9900',
    avatarConfig: {
      ...DEFAULT_AVATAR,
      hairStyle: 'alex_ponytail',
      hairColor: 'cyan',
      outfit: 'hoodie_emerald',
      accessory: 'headphones',
    },
    createdAt: Date.now() - 7200000,
    type: 'incoming',
  },
];

export const useFriendStore = create<FriendState>()(
  immer((set) => ({
    friends: INITIAL_FRIENDS,
    requests: INITIAL_REQUESTS,
    activeDmFriendId: null,
    directMessages: {
      'friend-alex': [
        {
          id: 'm1',
          senderId: 'friend-alex',
          receiverId: 'local-steve-1234',
          content: 'E aí Steve! Vamos explorar a fortaleza do Nether hoje?',
          timestamp: Date.now() - 120000,
        },
        {
          id: 'm2',
          senderId: 'local-steve-1234',
          receiverId: 'friend-alex',
          content: 'Bora! Já preparei as poções de resistência ao fogo 🔥',
          timestamp: Date.now() - 60000,
        },
      ],
    },

    setCustomNickname: (friendId, nickname) =>
      set((state) => {
        if (state.friends[friendId]) {
          state.friends[friendId].customNickname = nickname.trim() || undefined;
        }
      }),

    removeFriend: (friendId) =>
      set((state) => {
        delete state.friends[friendId];
        if (state.activeDmFriendId === friendId) {
          state.activeDmFriendId = null;
        }
      }),

    blockUser: (friendId) =>
      set((state) => {
        if (state.friends[friendId]) {
          state.friends[friendId].isBlocked = true;
        }
      }),

    unblockUser: (friendId) =>
      set((state) => {
        if (state.friends[friendId]) {
          state.friends[friendId].isBlocked = false;
        }
      }),

    acceptRequest: (requestId) =>
      set((state) => {
        const reqIndex = state.requests.findIndex((r) => r.id === requestId);
        if (reqIndex !== -1) {
          const req = state.requests[reqIndex];
          state.friends[req.fromUserId] = {
            id: req.fromUserId,
            username: req.fromUsername,
            discriminator: req.fromDiscriminator,
            status: 'online',
            avatarConfig: req.avatarConfig,
            isBlocked: false,
          };
          state.requests.splice(reqIndex, 1);
        }
      }),

    declineRequest: (requestId) =>
      set((state) => {
        state.requests = state.requests.filter((r) => r.id !== requestId);
      }),

    sendRequest: (username, discriminator) =>
      set((state) => {
        state.requests.push({
          id: `req-${crypto.randomUUID().slice(0, 6)}`,
          fromUserId: `user-temp-${Date.now()}`,
          fromUsername: username,
          fromDiscriminator: discriminator,
          avatarConfig: { ...DEFAULT_AVATAR },
          createdAt: Date.now(),
          type: 'outgoing',
        });
      }),

    setActiveDm: (friendId) =>
      set((state) => {
        state.activeDmFriendId = friendId;
      }),

    sendDirectMessage: (friendId, content, senderId) =>
      set((state) => {
        if (!state.directMessages[friendId]) {
          state.directMessages[friendId] = [];
        }
        state.directMessages[friendId].push({
          id: `msg-${Date.now()}`,
          senderId,
          receiverId: friendId,
          content,
          timestamp: Date.now(),
        });
      }),
  }))
);
