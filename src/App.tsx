import React from 'react';
import { useUIStore } from './stores/uiStore';
import { useCallStore } from './stores/callStore';
import { TopBar } from './components/navigation/TopBar';
import { Sidebar } from './components/navigation/Sidebar';
import { FriendsView } from './features/friends/FriendsView';
import { ServerView } from './features/servers/ServerView';
import { ClipsGalleryView } from './features/clips/ClipsGalleryView';
import { CampfireLoungeView } from './features/campfire/CampfireLoungeView';
import { SkinEditorModal } from './features/avatar-editor/SkinEditorModal';
import { DeviceSettingsModal } from './features/settings/DeviceSettingsModal';
import { CreateServerModal } from './features/servers/CreateServerModal';
import { SoundboardDrawer } from './features/soundboard/SoundboardDrawer';
import { UserContextMenu } from './components/context-menu/UserContextMenu';

import { useWebRTC } from './hooks/useWebRTC';

const BIOME_BACKGROUNDS: Record<string, string> = {
  plains: '/backgrounds/plains-bg.jpg',
  nether: '/backgrounds/nether-bg.jpg',
  the_end: '/backgrounds/the-end-bg.jpg',
  deep_dark: '/backgrounds/deepdark-bg.jpg',
};

export function App() {
  const { activeMainTab } = useUIStore();
  const { activeBiomeTheme } = useCallStore();
  useWebRTC();

  const currentBgImage = BIOME_BACKGROUNDS[activeBiomeTheme] || BIOME_BACKGROUNDS.plains;

  const renderActiveView = () => {
    switch (activeMainTab) {
      case 'server':
        return <ServerView />;
      case 'clips':
        return <ClipsGalleryView />;
      case 'campfire_lounge':
        return <CampfireLoungeView />;
      case 'friends':
      default:
        return <FriendsView />;
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-screen bg-[#07080A] text-[#E2E4EB] overflow-hidden select-none">
      {/* Camada 1: Background com Opacidade Visível (40%) e Transição Suave */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          key={currentBgImage}
          src={currentBgImage}
          alt="Cenário do Bioma"
          className="w-full h-full object-cover opacity-45 scale-100 transition-all duration-700 ease-in-out filter saturate-130 brightness-90 animate-in fade-in duration-500"
        />
        {/* Vinheta Escura Suave que não bloqueia a imagem */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080A]/60 via-[#07080A]/50 to-[#07080A]/80 pointer-events-none" />
      </div>

      {/* Camada 2: Conteúdo da Aplicação com Translucidez para o Cenário Aparecer */}
      <div className="relative z-10 flex flex-col h-full w-full bg-transparent">
        {/* TopBar */}
        <TopBar />

        {/* Área Central */}
        <div className="flex-1 flex overflow-hidden bg-transparent">
          <Sidebar />
          <main className="flex-1 flex overflow-hidden bg-transparent">{renderActiveView()}</main>
        </div>
      </div>

      {/* Modais Globais e Overlays */}
      <SkinEditorModal />
      <DeviceSettingsModal />
      <CreateServerModal />
      <SoundboardDrawer />
      <UserContextMenu />
    </div>
  );
}

export default App;
