import { useRef } from 'react';
import { useCallStore } from '../../stores/callStore';
import { useClipStore } from '../../stores/clipStore';

export function useClipRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const { isRecording, setIsRecording } = useCallStore();
  const { addClip } = useClipStore();

  const startRecording = async (streamToRecord?: MediaStream | null) => {
    try {
      recordedChunksRef.current = [];

      // Se nenhum stream foi passado, captura a tela ou canvas ativo
      let stream = streamToRecord;
      if (!stream) {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 60 },
          audio: true,
        });
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9,opus')
        ? 'video/webm; codecs=vp9,opus'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 6_000_000,
      });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const duration = Math.round((Date.now() - recordingStartTimeRef.current) / 1000);
        const fullBlob = new Blob(recordedChunksRef.current, { type: mimeType });
        const arrayBuffer = await fullBlob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const fileName = `discall_gravacao_${timestamp}.webm`;

        try {
          // Tentativa de escrita nativa via Tauri Plugin FS v2
          const { writeFile, mkdir, BaseDirectory } = await import('@tauri-apps/plugin-fs');
          await mkdir('Discall/Gravacoes', { baseDir: BaseDirectory.Video, recursive: true });
          await writeFile(`Discall/Gravacoes/${fileName}`, uint8Array, {
            baseDir: BaseDirectory.Video,
          });
          console.log(`[Discall] Gravação salva em disco: ${fileName}`);
        } catch (tauriErr) {
          console.warn('[Discall] FS Tauri não disponível, salvando em memória web:', tauriErr);
        }

        // Adiciona à store de gravações
        addClip({
          id: `clip-${Date.now()}`,
          fileName,
          filePath: `Discall/Gravacoes/${fileName}`,
          durationSeconds: duration || 1,
          fileSizeBytes: fullBlob.size,
          createdAt: Date.now(),
          serverOrDmName: 'Gravação Rápida',
        });

        setIsRecording(false);
      };

      recordingStartTimeRef.current = Date.now();
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error('[Discall] Erro ao iniciar gravação:', err);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  return { isRecording, startRecording, stopRecording };
}
