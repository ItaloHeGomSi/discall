import React, { useEffect, useState } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useMediaDeviceStore } from '../../stores/mediaDeviceStore';
import { Modal } from '../../components/ui/Modal';
import { VoxelButton } from '../../components/ui/VoxelButton';
import { Mic, Headphones, Video, RefreshCw, Volume2 } from 'lucide-react';

export const DeviceSettingsModal: React.FC = () => {
  const { isDeviceSettingsOpen, setDeviceSettingsOpen } = useUIStore();
  const {
    audioInputDevices,
    audioOutputDevices,
    videoInputDevices,
    selectedAudioInputId,
    selectedAudioOutputId,
    selectedVideoInputId,
    inputVolume,
    outputVolume,
    noiseSuppression,
    echoCancellation,
    enumerateAllDevices,
    setSelectedAudioInput,
    setSelectedAudioOutput,
    setSelectedVideoInput,
    setInputVolume,
    setOutputVolume,
    toggleNoiseSuppression,
    toggleEchoCancellation,
  } = useMediaDeviceStore();

  const [micTestLevel, setMicTestLevel] = useState(45);

  useEffect(() => {
    if (isDeviceSettingsOpen) {
      enumerateAllDevices();
    }
  }, [isDeviceSettingsOpen, enumerateAllDevices]);

  // Efeito decorativo de teste de microfone
  useEffect(() => {
    let interval: any;
    if (isDeviceSettingsOpen) {
      interval = setInterval(() => {
        setMicTestLevel(Math.floor(20 + Math.random() * 60));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isDeviceSettingsOpen]);

  return (
    <Modal
      isOpen={isDeviceSettingsOpen}
      onClose={() => setDeviceSettingsOpen(false)}
      title="Configurações de Dispositivos e Mídia"
      subtitle="Gerencie microfones, headsets, webcams físicas e DroidCam/OBS."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Microfone de Entrada */}
        <div className="p-3.5 bg-[#14161C] border border-[#222634] rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#F0F2F8] flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#55FF55]" />
              Dispositivo de Entrada de Áudio (Microfone):
            </label>
            <button
              onClick={() => enumerateAllDevices()}
              className="text-[11px] text-[#55FF55] hover:underline font-mono flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Re-escanear
            </button>
          </div>

          <select
            value={selectedAudioInputId}
            onChange={(e) => setSelectedAudioInput(e.target.value)}
            className="w-full bg-[#0C0D10] border border-[#2B3142] rounded px-3 py-2 text-xs text-[#F0F2F8]"
          >
            {audioInputDevices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label} {d.isVirtual ? ' (Driver Virtual / DroidCam)' : ''}
              </option>
            ))}
            {audioInputDevices.length === 0 && (
              <option value="default">Microfone Padrão do Sistema</option>
            )}
          </select>

          {/* Teste de Microfone */}
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#9DA3B4]">
              <span>Sensibilidade do Microfone:</span>
              <span className="text-[#55FF55]">{inputVolume}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={inputVolume}
              onChange={(e) => setInputVolume(Number(e.target.value))}
              className="w-full accent-[#55FF55] cursor-pointer"
            />
            {/* Medidor VU bar */}
            <div className="w-full h-1.5 bg-[#0C0D10] rounded overflow-hidden mt-1">
              <div
                className="h-full bg-[#55FF55] transition-all duration-100"
                style={{ width: `${micTestLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dispositivo de Saída (Fones) */}
        <div className="p-3.5 bg-[#14161C] border border-[#222634] rounded-lg space-y-2">
          <label className="text-xs font-semibold text-[#F0F2F8] flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#55FFFF]" />
            Dispositivo de Saída de Áudio (Headset / Alto-Falantes):
          </label>

          <select
            value={selectedAudioOutputId}
            onChange={(e) => setSelectedAudioOutput(e.target.value)}
            className="w-full bg-[#0C0D10] border border-[#2B3142] rounded px-3 py-2 text-xs text-[#F0F2F8]"
          >
            {audioOutputDevices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label}
              </option>
            ))}
            {audioOutputDevices.length === 0 && (
              <option value="default">Alto-Falante Padrão do Sistema</option>
            )}
          </select>

          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#9DA3B4]">
              <span>Volume Geral de Saída:</span>
              <span className="text-[#55FFFF]">{outputVolume}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={outputVolume}
              onChange={(e) => setOutputVolume(Number(e.target.value))}
              className="w-full accent-[#55FFFF] cursor-pointer"
            />
          </div>
        </div>

        {/* Câmera / DroidCam */}
        <div className="p-3.5 bg-[#14161C] border border-[#222634] rounded-lg space-y-2">
          <label className="text-xs font-semibold text-[#F0F2F8] flex items-center gap-2">
            <Video className="w-4 h-4 text-[#FFAA00]" />
            Câmera de Vídeo (Webcam / DroidCam / OBS):
          </label>

          <select
            value={selectedVideoInputId}
            onChange={(e) => setSelectedVideoInput(e.target.value)}
            className="w-full bg-[#0C0D10] border border-[#2B3142] rounded px-3 py-2 text-xs text-[#F0F2F8]"
          >
            {videoInputDevices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label} {d.isVirtual ? ' (Câmera Virtual)' : ''}
              </option>
            ))}
            {videoInputDevices.length === 0 && (
              <option value="default">Câmera Padrão</option>
            )}
          </select>
        </div>

        {/* Processamento de Voz */}
        <div className="p-3.5 bg-[#14161C] border border-[#222634] rounded-lg space-y-3">
          <span className="text-xs font-semibold text-[#F0F2F8] block">
            Processamento e Redução de Ruído
          </span>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9DA3B4]">Cancelamento de Eco Acústico</span>
            <input
              type="checkbox"
              checked={echoCancellation}
              onChange={toggleEchoCancellation}
              className="accent-[#55FF55] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9DA3B4]">Supressão de Ruído de Fundo (AI)</span>
            <input
              type="checkbox"
              checked={noiseSuppression}
              onChange={toggleNoiseSuppression}
              className="accent-[#55FF55] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#222634]">
          <VoxelButton
            variant="emerald"
            onClick={() => setDeviceSettingsOpen(false)}
          >
            Concluído
          </VoxelButton>
        </div>
      </div>
    </Modal>
  );
};
