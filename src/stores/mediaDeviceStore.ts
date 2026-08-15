import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface DeviceInfo {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
  isVirtual?: boolean;
}

interface MediaDeviceState {
  audioInputDevices: DeviceInfo[];
  audioOutputDevices: DeviceInfo[];
  videoInputDevices: DeviceInfo[];
  
  selectedAudioInputId: string;
  selectedAudioOutputId: string;
  selectedVideoInputId: string;

  inputVolume: number;
  outputVolume: number;
  noiseSuppression: boolean;
  echoCancellation: boolean;

  // Ações
  enumerateAllDevices: () => Promise<void>;
  setSelectedAudioInput: (id: string) => void;
  setSelectedAudioOutput: (id: string) => void;
  setSelectedVideoInput: (id: string) => void;
  setInputVolume: (vol: number) => void;
  setOutputVolume: (vol: number) => void;
  toggleNoiseSuppression: () => void;
  toggleEchoCancellation: () => void;
}

export const useMediaDeviceStore = create<MediaDeviceState>()(
  immer((set, get) => ({
    audioInputDevices: [],
    audioOutputDevices: [],
    videoInputDevices: [],
    
    selectedAudioInputId: 'default',
    selectedAudioOutputId: 'default',
    selectedVideoInputId: 'default',

    inputVolume: 100,
    outputVolume: 100,
    noiseSuppression: true,
    echoCancellation: true,

    enumerateAllDevices: async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          console.warn('[Discall Media] MediaDevices API não disponível.');
          return;
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioIns: DeviceInfo[] = [];
        const audioOuts: DeviceInfo[] = [];
        const videoIns: DeviceInfo[] = [];

        devices.forEach((d) => {
          const isVirtual = /droidcam|obs|virtual|vban|cable|voicemeeter/i.test(d.label);
          const info: DeviceInfo = {
            deviceId: d.deviceId,
            label: d.label || `${d.kind} (${d.deviceId.slice(0, 5)}...)`,
            kind: d.kind,
            isVirtual,
          };

          if (d.kind === 'audioinput') audioIns.push(info);
          if (d.kind === 'audiooutput') audioOuts.push(info);
          if (d.kind === 'videoinput') videoIns.push(info);
        });

        set((state) => {
          state.audioInputDevices = audioIns;
          state.audioOutputDevices = audioOuts;
          state.videoInputDevices = videoIns;

          // Valida seleção existente ou fallback
          if (!audioIns.some((d) => d.deviceId === state.selectedAudioInputId) && audioIns.length > 0) {
            state.selectedAudioInputId = audioIns[0].deviceId;
          }
          if (!audioOuts.some((d) => d.deviceId === state.selectedAudioOutputId) && audioOuts.length > 0) {
            state.selectedAudioOutputId = audioOuts[0].deviceId;
          }
          if (!videoIns.some((d) => d.deviceId === state.selectedVideoInputId) && videoIns.length > 0) {
            state.selectedVideoInputId = videoIns[0].deviceId;
          }
        });
      } catch (err) {
        console.error('[Discall Media] Erro ao enumerar dispositivos:', err);
      }
    },

    setSelectedAudioInput: (id) =>
      set((state) => {
        state.selectedAudioInputId = id;
      }),

    setSelectedAudioOutput: (id) =>
      set((state) => {
        state.selectedAudioOutputId = id;
      }),

    setSelectedVideoInput: (id) =>
      set((state) => {
        state.selectedVideoInputId = id;
      }),

    setInputVolume: (vol) =>
      set((state) => {
        state.inputVolume = vol;
      }),

    setOutputVolume: (vol) =>
      set((state) => {
        state.outputVolume = vol;
      }),

    toggleNoiseSuppression: () =>
      set((state) => {
        state.noiseSuppression = !state.noiseSuppression;
      }),

    toggleEchoCancellation: () =>
      set((state) => {
        state.echoCancellation = !state.echoCancellation;
      }),
  }))
);
