import React, { useState } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useServerStore } from '../../stores/serverStore';
import { useAuthStore } from '../../stores/authStore';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
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
      title="Criar um Novo Grupo"
      subtitle="Crie um espaço no Discall para reunir sua equipe."
      maxWidth="md"
    >
      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#9AA3B2] mb-1.5">
            Nome do Grupo:
          </label>
          <input
            type="text"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            placeholder="Ex: Equipe de Marketing"
            autoFocus
            className="w-full bg-[#0B0D12] border border-[#22262F] rounded-lg px-3 py-2 text-sm text-[#F1F3F8] focus:outline-none focus:border-[#5B7CFA]"
          />
        </div>

        <div className="p-3 bg-[#181C25] border border-[#22262F] rounded-lg text-xs text-[#9AA3B2] flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-[#5B7CFA] shrink-0 mt-0.5" />
          <span>
            Ao criar um grupo, você recebe automaticamente o cargo de Proprietário com
            permissões administrativas completas.
          </span>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#22262F]">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCreateServerModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Criar Grupo
          </Button>
        </div>
      </form>
    </Modal>
  );
};
