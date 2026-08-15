import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { VideoClip } from '../types/clip.types';

interface ClipState {
  clips: VideoClip[];
  selectedClipId: string | null;
  addClip: (clip: VideoClip) => void;
  removeClip: (id: string) => void;
  renameClip: (id: string, newName: string) => void;
  setSelectedClip: (id: string | null) => void;
}

const INITIAL_CLIPS: VideoClip[] = [
  {
    id: 'clip-1',
    fileName: 'discall_clip_2026-08-15_14-22-10.webm',
    filePath: 'Discall/Clips/discall_clip_2026-08-15_14-22-10.webm',
    durationSeconds: 15,
    fileSizeBytes: 12_450_000,
    createdAt: Date.now() - 3600000 * 2,
    serverOrDmName: 'Expedição Nether 🔥',
  },
  {
    id: 'clip-2',
    fileName: 'discall_clip_2026-08-14_21-05-44.webm',
    filePath: 'Discall/Clips/discall_clip_2026-08-14_21-05-44.webm',
    durationSeconds: 28,
    fileSizeBytes: 24_800_000,
    createdAt: Date.now() - 86400000,
    serverOrDmName: 'Lobby da Fogueira 🏕️',
  },
];

export const useClipStore = create<ClipState>()(
  immer((set) => ({
    clips: INITIAL_CLIPS,
    selectedClipId: null,

    addClip: (clip) =>
      set((state) => {
        state.clips.unshift(clip);
      }),

    removeClip: (id) =>
      set((state) => {
        state.clips = state.clips.filter((c) => c.id !== id);
        if (state.selectedClipId === id) {
          state.selectedClipId = null;
        }
      }),

    renameClip: (id, newName) =>
      set((state) => {
        const target = state.clips.find((c) => c.id === id);
        if (target) {
          target.fileName = newName.endsWith('.webm') ? newName : `${newName}.webm`;
        }
      }),

    setSelectedClip: (id) =>
      set((state) => {
        state.selectedClipId = id;
      }),
  }))
);
