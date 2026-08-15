import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type MainViewTab = 'friends' | 'server' | 'clips' | 'campfire_lounge';

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  targetUserId: string | null;
  targetUsername: string | null;
}

interface UIState {
  activeMainTab: MainViewTab;
  isProfileModalOpen: boolean;
  isSkinEditorOpen: boolean;
  isDeviceSettingsOpen: boolean;
  isCreateServerModalOpen: boolean;
  isSoundboardOpen: boolean;
  
  contextMenu: ContextMenuState;

  // Ações
  setActiveMainTab: (tab: MainViewTab) => void;
  setProfileModalOpen: (open: boolean) => void;
  setSkinEditorOpen: (open: boolean) => void;
  setDeviceSettingsOpen: (open: boolean) => void;
  setCreateServerModalOpen: (open: boolean) => void;
  setSoundboardOpen: (open: boolean) => void;
  
  openContextMenu: (x: number, y: number, targetUserId: string, targetUsername: string) => void;
  closeContextMenu: () => void;
}

export const useUIStore = create<UIState>()(
  immer((set) => ({
    activeMainTab: 'friends',
    isProfileModalOpen: false,
    isSkinEditorOpen: false,
    isDeviceSettingsOpen: false,
    isCreateServerModalOpen: false,
    isSoundboardOpen: false,

    contextMenu: {
      isOpen: false,
      x: 0,
      y: 0,
      targetUserId: null,
      targetUsername: null,
    },

    setActiveMainTab: (tab) =>
      set((state) => {
        state.activeMainTab = tab;
      }),

    setProfileModalOpen: (open) =>
      set((state) => {
        state.isProfileModalOpen = open;
      }),

    setSkinEditorOpen: (open) =>
      set((state) => {
        state.isSkinEditorOpen = open;
      }),

    setDeviceSettingsOpen: (open) =>
      set((state) => {
        state.isDeviceSettingsOpen = open;
      }),

    setCreateServerModalOpen: (open) =>
      set((state) => {
        state.isCreateServerModalOpen = open;
      }),

    setSoundboardOpen: (open) =>
      set((state) => {
        state.isSoundboardOpen = open;
      }),

    openContextMenu: (x, y, targetUserId, targetUsername) =>
      set((state) => {
        state.contextMenu = {
          isOpen: true,
          x,
          y,
          targetUserId,
          targetUsername,
        };
      }),

    closeContextMenu: () =>
      set((state) => {
        state.contextMenu.isOpen = false;
        state.contextMenu.targetUserId = null;
        state.contextMenu.targetUsername = null;
      }),
  }))
);
