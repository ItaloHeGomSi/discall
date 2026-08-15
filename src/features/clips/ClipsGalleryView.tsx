import React, { useState } from 'react';
import { useClipStore } from '../../stores/clipStore';
import { VideoClip } from '../../types/clip.types';
import { VoxelButton } from '../../components/ui/VoxelButton';
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
      await open('Videos/Discall/Clips');
    } catch {
      alert('Os clipes estão salvos no seu diretório: Vídeos > Discall > Clips');
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
    <div className="flex-1 flex flex-col h-full bg-[#0C0D10] overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-[#222634] px-6 flex items-center justify-between bg-[#14161C] shrink-0">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-[#3A82FF]" />
          <h2 className="font-semibold text-sm text-[#F0F2F8]">
            Galeria de Clipes Gravados
          </h2>
          <span className="text-xs font-mono text-[#646A7E]">
            ({clips.length} clipes no disco)
          </span>
        </div>

        <VoxelButton
          variant="secondary"
          size="sm"
          onClick={handleOpenFolder}
          className="flex items-center gap-1.5"
        >
          <FolderOpen className="w-4 h-4 text-[#3A82FF]" />
          <span>Abrir Pasta de Clipes</span>
        </VoxelButton>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-6 overflow-y-auto">
        {clips.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-[#646A7E] p-8">
            <Film className="w-12 h-12 mb-3 text-[#2B3142]" />
            <h3 className="text-base font-semibold text-[#F0F2F8]">
              Nenhum clipe gravado ainda.
            </h3>
            <p className="text-xs text-[#9DA3B4] mt-1 max-w-md">
              Durante uma chamada de voz e compartilhamento de tela, clique no botão **CLIPE** na
              barra inferior para salvar momentos épicos direto no seu disco.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className="bg-[#14161C] border border-[#222634] hover:border-[#3A82FF]/50 rounded-xl overflow-hidden shadow-lg transition-all flex flex-col group"
              >
                {/* Thumbnail / Card de Vídeo */}
                <div
                  onClick={() => setPlayingClip(clip)}
                  className="relative aspect-video bg-[#1E222D] flex items-center justify-center cursor-pointer overflow-hidden group-hover:brightness-110 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-[#3A82FF] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/75 px-1.5 py-0.5 rounded text-[11px] font-mono text-white flex items-center gap-1">
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
                          className="flex-1 bg-[#0C0D10] border border-[#3A82FF] rounded px-2 py-1 text-xs text-white"
                        />
                        <button
                          onClick={() => handleRename(clip.id)}
                          className="text-xs bg-[#228844] px-2 py-1 rounded text-white"
                        >
                          Salvar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-xs text-[#F0F2F8] truncate" title={clip.fileName}>
                          {clip.fileName}
                        </h4>
                        <button
                          onClick={() => {
                            setRenamingClipId(clip.id);
                            setNewNameInput(clip.fileName.replace('.webm', ''));
                          }}
                          className="p-1 text-[#646A7E] hover:text-white cursor-pointer"
                          title="Renomear Clipe"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <p className="text-[11px] text-[#55FF55] font-mono mt-0.5 truncate">
                      {clip.serverOrDmName || 'Gravação Rápida'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#222634] mt-3 text-[11px] text-[#646A7E] font-mono">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      {formatFileSize(clip.fileSizeBytes)}
                    </span>
                    <button
                      onClick={() => removeClip(clip.id)}
                      className="text-[#FF5555] hover:underline flex items-center gap-1 cursor-pointer"
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
            <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center border border-[#2B3142] relative overflow-hidden">
              <div className="flex flex-col items-center justify-center text-center p-6 text-[#9DA3B4]">
                <Film className="w-16 h-16 text-[#3A82FF] mb-2 animate-pulse" />
                <p className="text-sm font-semibold text-[#F0F2F8]">
                  Visualizador de Clipe Local ({playingClip.durationSeconds}s)
                </p>
                <p className="text-xs text-[#646A7E] font-mono mt-1">
                  Arquivo: {playingClip.filePath}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <VoxelButton
                variant="secondary"
                onClick={() => setPlayingClip(null)}
              >
                Fechar
              </VoxelButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
