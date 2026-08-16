import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { colorForId } from '../utils/avatarColor';
import { LOCAL_USER_ID } from '../constants';

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  avatarColor: string;
  avatarUrl?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  statusMessage?: string;
}

interface AuthState {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (username: string, email: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<Pick<CurrentUser, 'username' | 'email' | 'statusMessage' | 'avatarUrl'>>) => void;
  setStatus: (status: CurrentUser['status']) => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,

    login: (username, email) =>
      set((state) => {
        state.user = {
          id: LOCAL_USER_ID,
          username,
          email,
          avatarColor: colorForId(LOCAL_USER_ID),
          status: 'online',
        };
        state.isAuthenticated = true;
      }),

    logout: () =>
      set((state) => {
        state.user = null;
        state.isAuthenticated = false;
      }),

    updateProfile: (data) =>
      set((state) => {
        if (state.user) {
          Object.assign(state.user, data);
        }
      }),

    setStatus: (status) =>
      set((state) => {
        if (state.user) {
          state.user.status = status;
        }
      }),
  }))
);
