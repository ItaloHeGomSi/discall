import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { AvatarComposition, DEFAULT_AVATAR } from '../types/skin.types';
import { BiomeDimensionTheme } from '../types/call.types';

export interface CurrentUser {
  id: string;
  username: string;
  discriminator: string;
  avatarConfig: AvatarComposition;
  realPhotoUrl?: string;
  status: 'online' | 'in_game' | 'idle' | 'offline';
  customStatus?: string;
  dimensionTheme: BiomeDimensionTheme;
}

interface AuthState {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (username: string, discriminator?: string) => void;
  logout: () => void;
  updateAvatar: (config: AvatarComposition) => void;
  updateRealPhoto: (url: string | undefined) => void;
  setStatus: (status: CurrentUser['status']) => void;
  setCustomStatus: (statusText: string) => void;
  setDimensionTheme: (theme: BiomeDimensionTheme) => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: {
      id: 'local-steve-1234',
      username: 'SteveMiner',
      discriminator: '2026',
      avatarConfig: { ...DEFAULT_AVATAR },
      realPhotoUrl: undefined,
      status: 'online',
      customStatus: 'Minerando diamantes na camada -58 💎',
      dimensionTheme: 'plains',
    },
    isAuthenticated: true,

    login: (username, discriminator = '0001') =>
      set((state) => {
        state.user = {
          id: `user-${crypto.randomUUID().slice(0, 8)}`,
          username,
          discriminator,
          avatarConfig: { ...DEFAULT_AVATAR },
          status: 'online',
          dimensionTheme: 'plains',
        };
        state.isAuthenticated = true;
      }),

    logout: () =>
      set((state) => {
        state.user = null;
        state.isAuthenticated = false;
      }),

    updateAvatar: (config) =>
      set((state) => {
        if (state.user) {
          state.user.avatarConfig = config;
        }
      }),

    updateRealPhoto: (url) =>
      set((state) => {
        if (state.user) {
          state.user.realPhotoUrl = url;
        }
      }),

    setStatus: (status) =>
      set((state) => {
        if (state.user) {
          state.user.status = status;
        }
      }),

    setCustomStatus: (statusText) =>
      set((state) => {
        if (state.user) {
          state.user.customStatus = statusText;
        }
      }),

    setDimensionTheme: (theme) =>
      set((state) => {
        if (state.user) {
          state.user.dimensionTheme = theme;
        }
      }),
  }))
);
