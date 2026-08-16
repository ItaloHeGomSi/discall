import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';

export const LoginView: React.FC = () => {
  const { login } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;
    login(username.trim(), email.trim());
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0B0D12] px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#3B4A8C] border border-[#5B7CFA] flex items-center justify-center font-bold text-xl text-white mb-3">
            D
          </div>
          <h1 className="text-xl font-semibold text-[#F1F3F8]">Discall</h1>
          <p className="text-sm text-[#9AA3B2] mt-1">Chat, chamadas e reuniões da sua equipe</p>
        </div>

        <div className="bg-[#12151C] border border-[#22262F] rounded-xl p-6">
          <div className="flex mb-5 rounded-lg bg-[#181C25] p-1 border border-[#22262F]">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                mode === 'login' ? 'bg-[#1F242F] text-[#F1F3F8]' : 'text-[#9AA3B2] hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                mode === 'register' ? 'bg-[#1F242F] text-[#F1F3F8]' : 'text-[#9AA3B2] hover:text-white'
              }`}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#9AA3B2] mb-1.5">Nome</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome completo"
                autoFocus
                className="w-full bg-[#0B0D12] border border-[#22262F] rounded-lg px-3 py-2 text-sm text-[#F1F3F8] focus:outline-none focus:border-[#5B7CFA]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9AA3B2] mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com"
                className="w-full bg-[#0B0D12] border border-[#22262F] rounded-lg px-3 py-2 text-sm text-[#F1F3F8] focus:outline-none focus:border-[#5B7CFA]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9AA3B2] mb-1.5">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B0D12] border border-[#22262F] rounded-lg px-3 py-2 text-sm text-[#F1F3F8] focus:outline-none focus:border-[#5B7CFA]"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2">
              {mode === 'login' ? 'Entrar' : 'Criar conta e entrar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
