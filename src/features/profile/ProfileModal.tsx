import React, { useState, useEffect, useRef } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Camera, LogOut } from 'lucide-react';

const STATUS_OPTIONS: { value: 'online' | 'away' | 'busy' | 'offline'; label: string }[] = [
  { value: 'online', label: 'Online' },
  { value: 'away', label: 'Ausente' },
  { value: 'busy', label: 'Ocupado' },
  { value: 'offline', label: 'Offline' },
];

export const ProfileModal: React.FC = () => {
  const { isProfileModalOpen, setProfileModalOpen } = useUIStore();
  const { user, updateProfile, setStatus, logout } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (user && isProfileModalOpen) {
      setUsername(user.username);
      setEmail(user.email);
      setStatusMessage(user.statusMessage || '');
    }
  }, [user, isProfileModalOpen]);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ username: username.trim() || user.username, email: email.trim(), statusMessage: statusMessage.trim() });
    setProfileModalOpen(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    logout();
    setProfileModalOpen(false);
  };

  return (
    <Modal
      isOpen={isProfileModalOpen}
      onClose={() => setProfileModalOpen(false)}
      title="Seu Perfil"
      subtitle="Edite suas informações de conta e status."
      maxWidth="sm"
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <Avatar username={user.username} avatarColor={user.avatarColor} avatarUrl={user.avatarUrl} size={72} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#5B7CFA] hover:bg-[#7089FB] text-white border-2 border-[#12151C] cursor-pointer"
              title="Alterar foto"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#9AA3B2] mb-1.5">Nome</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#0B0D12] border border-[#22262F] rounded-lg px-3 py-2 text-sm text-[#F1F3F8] focus:outline-none focus:border-[#5B7CFA]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#9AA3B2] mb-1.5">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0B0D12] border border-[#22262F] rounded-lg px-3 py-2 text-sm text-[#F1F3F8] focus:outline-none focus:border-[#5B7CFA]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#9AA3B2] mb-1.5">Mensagem de status</label>
          <input
            type="text"
            value={statusMessage}
            onChange={(e) => setStatusMessage(e.target.value)}
            placeholder="Ex: Em reunião até as 15h"
            className="w-full bg-[#0B0D12] border border-[#22262F] rounded-lg px-3 py-2 text-sm text-[#F1F3F8] focus:outline-none focus:border-[#5B7CFA]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#9AA3B2] mb-1.5">Presença</label>
          <div className="flex gap-1.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  user.status === opt.value
                    ? 'bg-[#1B2340] border-[#5B7CFA] text-[#93A6FF]'
                    : 'bg-[#181C25] border-[#22262F] text-[#9AA3B2] hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#22262F]">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-[#EF4444] hover:underline cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair da conta
          </button>
          <Button type="submit" variant="primary">
            Salvar alterações
          </Button>
        </div>
      </form>
    </Modal>
  );
};
