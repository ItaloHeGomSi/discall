# 🎮 Discall — Minecraft Themed Desktop Voice & Video

**Discall** é uma aplicação desktop nativa desenvolvida com **Tauri v2**, **React 19**, **TypeScript** estrito e **Tailwind CSS**, trazendo a atmosfera e nostalgia do Minecraft combinadas com uma interface moderna, rápida e altamente ergonômica.

---

## 🌟 Principais Recursos

- **⚔️ Design Minecraft Modern Clean**: Paleta inspirada em Obsidian, Redstone, Esmeralda e Bedrock, com tipografia legível, bordas voxel chanfradas e micro-animações.
- **🎨 Editor de Avatar Multi-Camadas (Canvas 64x64)**: Motor procedural que sobrepõe até 7 camadas (pele, olhos, cabelo 3D, barbas, elmos/óculos, armaduras e itens de mão) com interpolação pixelada nítida.
- **🔄 Flip 3D de Duplo Clique**: Transição tridimensional suave durante as chamadas para alternar entre a Skin do Minecraft e a Foto Real de perfil.
- **📞 Painel de Chamadas e WebRTC**: Grid dinâmico de participantes, controle individual de volume, reações de emojis flutuantes (💎, 🔥, 🥩, 💀) e chat lateral da chamada.
- **🖥️ Transmissão de Tela com Isolamento de Áudio**: Suporte a captura de tela inteira ou janelas de aplicativos a 1080p60.
- **🎬 Gravador de Clipes Nativo (Tauri FS)**: Salva gravações de tela e áudio misturado diretamente no disco (`Vídeos/Discall/Clips`) com visualizador e player embutidos.
- **🔊 Minecraft Soundboard com Audio Ducking**: Efeitos sonoros do jogo com atalhos de teclado (F1 a F8) e redução acústica automática dos canais de voz.
- **🌲 Status por Biomas e Dimensões**: Temas ambientais e auras visuais para Overworld, Nether, The End e Deep Dark.
- **🏕️ Campfire Voice Lounge**: Hub de espera 2D isométrico ao redor da fogueira com movimentação por teclado (WASD / Setas) e áudio ambiente relaxante.
- **🛡️ Hierarquia de Permissões com Bitflags**: Validação estrita de privilégios de Dono, Administrador e Membros.
- **🖱️ Menu de Contexto (Right-Click)**: Ações rápidas para perfil, DMs, apelidos locais, chamadas diretas P2P, convites de servidor e bloqueio.

---

## 🚀 Como Rodar Localmente

### 1. Pré-requisitos
- **Node.js**: v20+ LTS instalado ([nodejs.org](https://nodejs.org/))
- **Rust & Cargo**: Toolchain estável instalada ([rustup.rs](https://rustup.rs/))
- **Visual Studio C++ Build Tools** (obrigatório para compilação WebView2 no Windows)

### 2. Instalação e Execução

```powershell
# 1. Instalar as dependências isoladas do front-end
npm install

# 2. Iniciar o aplicativo desktop em modo de desenvolvimento
npm run tauri dev
```

### 3. Compilar para Produção (.exe instalador)

```powershell
npm run tauri build
```

---

## 🏗️ Estrutura do Projeto

```
discall/
├── src-tauri/                       # Backend Rust / Tauri v2
│   ├── Cargo.toml                   # Dependências e crates (FS, Dialog, Shell, Process)
│   ├── tauri.conf.json              # Configuração da janela e plugins
│   ├── capabilities/default.json    # Permissões nativas seguras
│   └── src/                         # Código Rust
├── src/                             # Front-end React 19 + TypeScript
│   ├── components/                  # VoxelButton, FlipCard, Modal, Menu de Contexto
│   ├── features/                    # Amigos, Servidores, Chamada, Clipes, Soundboard, Campfire
│   ├── stores/                      # Gerenciamento de estado global Zustand (Immer)
│   ├── types/                       # Schemas estritos e Bitflags de permissões
│   └── utils/                       # Motor Canvas da Skin e mixagem de áudio
└── package.json                     # Manifesto de dependências isoladas
```