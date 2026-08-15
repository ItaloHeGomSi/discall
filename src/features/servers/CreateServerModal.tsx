import React, { useState } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useServerStore } from '../../stores/serverStore';
import { useAuthStore } from '../../stores/authStore';
import { Modal } from '../../components/ui/Modal';
import { VoxelButton } from '../../components/ui/VoxelButton';
import { Shield } from 'lucide-react';

export const CreateServerModal: React.FC = () => {
  const { isCreateServerModalOpen, setCreateServerModalOpen } = useUIStore();
  const { createServer } = useServerStore();
  const { user } = useAuthStore();
  const [serverName, setServerName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim() || !user) return;
    createServer(serverName.trim(), user.id);
    setServerName('');
    setCreateServerModalOpen(false);
  };

  return (
    <Modal
      isOpen={isCreateServerModalOpen}
      onClose={() => setCreateServerModalOpen(false)}
      title="Criar um Novo Servidor"
      subtitle="Crie um espaço no Discall para reunir seus amigos e jogar."
      maxWidth="md"
    >
      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase text-[#9DA3B4] mb-1.5">
            Nome do Servidor:
          </label>
          <input
            type="text"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            placeholder="Ex: Reino dos Construtores 🏰"
            autoFocus
            className="w-full bg-[#0C0D10] border border-[#2B3142] rounded-lg px-3 py-2 text-sm text-[#F0F2F8] focus:outline-none focus:border-[#55FF55]"
          />
        </div>

        <div className="p-3 bg-[#1A1D26] border border-[#2B3142] rounded-lg text-xs text-[#9DA3B4] flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-[#55FF55] shrink-0 mt-0.5" />
          <span>
            Ao criar um servidor, você recebe automaticamente o cargo de **Dono do Reino** com
            permissões administrativas completas.
          </span>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#222634]">
          <VoxelButton
            type="button"
            variant="ghost"
            onClick={() => setCreateServerModalOpen(false)}
          >
            Cancelar
          </VoxelButton>
          <VoxelButton type="submit" variant="emerald">
            Criar Servidor
          </VoxelButton>
        </div>
      </form>
    </Modal>
  );
};
