import React, { useState } from 'react';
import { useClipStore } from '../../stores/clipStore';
import { VideoClip } from '../../types/clip.types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Film, Play, Trash2, Edit2, FolderOpen, Clock, HardDrive } from 'lucide-react';

export const ClipsGalleryView: React.FC = () => {
  const { clips, removeClip, renameClip } = useClipStore();
  const [playingClip, setPlayingClip] = useState<VideoClip | null>(null);
  const [renamingClipId, setRenamingClipId] = useState<string | null>(null);
  const [newNameInput, setNewNameInput] = useState('');

  const handleOpenFolder = async () => {
    try {
      const { open } = await import('@tauri-apps/plugin-shell');
      await open('Videos/Discall/Gravacoes');
    } catch {
      alert('As gravações estão salvas no seu diretório: Vídeos > Discall > Gravações');
    }
  };

  const handleRename = (id: string) => {
    if (newNameInput.trim()) {
      renameClip(id, newNameInput.trim());
      setRenamingClipId(null);
      setNewNameInput('');
    }
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0D12] overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-[#22262F] px-6 flex items-center justify-between bg-[#12151C] shrink-0">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-[#5B7CFA]" />
          <h2 className="font-semibold text-sm text-[#F1F3F8]">
            Gravações
          </h2>
          <span className="text-xs text-[#626B7A]">
            ({clips.length} gravações no disco)
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleOpenFolder}
          className="flex items-center gap-1.5"
        >
          <FolderOpen className="w-4 h-4 text-[#5B7CFA]" />
          <span>Abrir Pasta de Gravações</span>
        </Button>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-6 overflow-y-auto">
        {clips.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-[#626B7A] p-8">
            <Film className="w-12 h-12 mb-3 text-[#333A48]" />
            <h3 className="text-base font-semibold text-[#F1F3F8]">
              Nenhuma gravação ainda.
            </h3>
            <p className="text-xs text-[#9AA3B2] mt-1 max-w-md">
              Durante uma chamada, clique no botão GRAVAR na barra inferior para salvar a
              reunião diretamente no seu disco.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className="bg-[#12151C] border border-[#22262F] hover:border-[#5B7CFA]/50 rounded-xl overflow-hidden shadow-lg transition-all flex flex-col group"
              >
                {/* Thumbnail / Card de Vídeo */}
                <div
                  onClick={() => setPlayingClip(clip)}
                  className="relative aspect-video bg-[#1B1F29] flex items-center justify-center cursor-pointer overflow-hidden group-hover:brightness-110 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-[#5B7CFA] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/75 px-1.5 py-0.5 rounded text-[11px] text-white flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{clip.durationSeconds}s</span>
                  </div>
                </div>

                {/* Detalhes */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    {renamingClipId === clip.id ? (
                      <div className="flex items-center gap-1 mb-1">
                        <input
                          type="text"
                          value={newNameInput}
                          onChange={(e) => setNewNameInput(e.target.value)}
                          autoFocus
                          className="flex-1 bg-[#0B0D12] border border-[#5B7CFA] rounded px-2 py-1 text-xs text-white"
                        />
                        <button
                          onClick={() => handleRename(clip.id)}
                          className="text-xs bg-[#5B7CFA] px-2 py-1 rounded text-white"
                        >
                          Salvar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-xs text-[#F1F3F8] truncate" title={clip.fileName}>
                          {clip.fileName}
                        </h4>
                        <button
                          onClick={() => {
                            setRenamingClipId(clip.id);
                            setNewNameInput(clip.fileName.replace('.webm', ''));
                          }}
                          className="p-1 text-[#626B7A] hover:text-white cursor-pointer"
                          title="Renomear Gravação"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <p className="text-[11px] text-[#5EDB8F] mt-0.5 truncate">
                      {clip.serverOrDmName || 'Gravação Rápida'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#22262F] mt-3 text-[11px] text-[#626B7A]">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      {formatFileSize(clip.fileSizeBytes)}
                    </span>
                    <button
                      onClick={() => removeClip(clip.id)}
                      className="text-[#EF4444] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Reprodução de Vídeo */}
      {playingClip && (
        <Modal
          isOpen={!!playingClip}
          onClose={() => setPlayingClip(null)}
          title={`Reproduzindo: ${playingClip.fileName}`}
          maxWidth="xl"
        >
          <div className="space-y-4">
            <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center border border-[#22262F] relative overflow-hidden">
              <div className="flex flex-col items-center justify-center text-center p-6 text-[#9AA3B2]">
                <Film className="w-16 h-16 text-[#5B7CFA] mb-2 animate-pulse" />
                <p className="text-sm font-semibold text-[#F1F3F8]">
                  Visualizador de Gravação Local ({playingClip.durationSeconds}s)
                </p>
                <p className="text-xs text-[#626B7A] mt-1">
                  Arquivo: {playingClip.filePath}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setPlayingClip(null)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
