import React from 'react';
import { useUIStore } from './stores/uiStore';
import { useAuthStore } from './stores/authStore';
import { useCallStore } from './stores/callStore';
import { TopBar } from './components/navigation/TopBar';
import { Sidebar } from './components/navigation/Sidebar';
import { FriendsView } from './features/friends/FriendsView';
import { ServerView } from './features/servers/ServerView';
import { ClipsGalleryView } from './features/clips/ClipsGalleryView';
import { LoginView } from './features/auth/LoginView';
import { ProfileModal } from './features/profile/ProfileModal';
import { DeviceSettingsModal } from './features/settings/DeviceSettingsModal';
import { CreateServerModal } from './features/servers/CreateServerModal';
import { UserContextMenu } from './components/context-menu/UserContextMenu';
import { CallGrid } from './features/call/CallGrid';

import { useWebRTC } from './hooks/useWebRTC';

export function App() {
  const { activeMainTab } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const { isInCall, callType } = useCallStore();
  useWebRTC();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    // Chamadas diretas (P2P) usam a mesma grade de chamada dos grupos,
    // independente da aba principal selecionada.
    if (isInCall && callType === 'p2p') {
      return <CallGrid />;
    }

    switch (activeMainTab) {
      case 'server':
        return <ServerView />;
      case 'clips':
        return <ClipsGalleryView />;
      case 'friends':
      default:
        return <FriendsView />;
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-screen bg-[#0B0D12] text-[#E2E4EB] overflow-hidden select-none">
      <div className="relative z-10 flex flex-col h-full w-full">
        <TopBar />

        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex overflow-hidden">{renderActiveView()}</main>
        </div>
      </div>

      {/* Modais Globais e Overlays */}
      <ProfileModal />
      <DeviceSettingsModal />
      <CreateServerModal />
      <UserContextMenu />
    </div>
  );
}

export default App;
