import { useEffect, useRef } from 'react';
import { useCallStore } from '../stores/callStore';
import { useMediaDeviceStore } from '../stores/mediaDeviceStore';
import { LOCAL_USER_ID } from '../constants';

export function useWebRTC() {
  const {
    isInCall,
    activeRoomId,
    isAudioMuted,
    isVideoMuted,
    isScreenSharing,
    setLocalStream,
    setParticipantSpeaking,
  } = useCallStore();

  const {
    selectedAudioInputId,
    selectedVideoInputId,
    noiseSuppression,
    echoCancellation,
  } = useMediaDeviceStore();

  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Inicialização e captura do fluxo de mídia local (Áudio / Vídeo)
  useEffect(() => {
    if (!isInCall) {
      // Limpeza de tracks de mídia ao sair da chamada
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        setLocalStream(null);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      return;
    }

    let isMounted = true;

    async function initMedia() {
      try {
        const constraints: MediaStreamConstraints = {
          audio: {
            deviceId: selectedAudioInputId !== 'default' ? { exact: selectedAudioInputId } : undefined,
            noiseSuppression,
            echoCancellation,
          },
          video: !isVideoMuted
            ? {
                deviceId: selectedVideoInputId !== 'default' ? { exact: selectedVideoInputId } : undefined,
                width: { ideal: 1280 },
                height: { ideal: 720 },
              }
            : false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);

        // Configuração do analisador de volume RMS para detectar fala em tempo real
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const detectSpeaking = () => {
            if (!analyserRef.current || !isInCall) return;
            analyserRef.current.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            const isSpeaking = average > 18 && !isAudioMuted;

            setParticipantSpeaking(LOCAL_USER_ID, isSpeaking);
            animationFrameRef.current = requestAnimationFrame(detectSpeaking);
          };

          detectSpeaking();
        } catch (audioErr) {
          console.warn('[WebRTC] Áudio Context Analyzer indisponível:', audioErr);
        }
      } catch (err) {
        console.warn('[WebRTC] Não foi possível capturar dispositivos físicos:', err);
      }
    }

    initMedia();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isInCall, activeRoomId, selectedAudioInputId, selectedVideoInputId, noiseSuppression, echoCancellation, isVideoMuted]);

  // Controle de Mute de Áudio em tempo de execução
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioMuted;
      });
    }
  }, [isAudioMuted]);

  return { localStream: localStreamRef.current };
}
