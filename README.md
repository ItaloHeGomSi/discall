# Discall — Chat, Voz e Vídeo para Equipes

**Discall** é uma aplicação desktop nativa desenvolvida com **Tauri v2**, **React 19**, **TypeScript** estrito e **Tailwind CSS**, com uma interface simples e funcional para comunicação de equipes.

---

## Principais Recursos

- **Contas de Usuário**: Criação de conta e edição de perfil (nome, e-mail, foto, status).
- **Chat de Texto e Mensagens Diretas**: Conversas privadas e em salas de grupo.
- **Chamadas de Voz e Vídeo**: Grid dinâmico de participantes, controle individual de volume, reações rápidas e chat lateral da chamada.
- **Compartilhamento de Tela**: Suporte a captura de tela inteira ou janelas de aplicativos a 1080p60.
- **Gravação Nativa (Tauri FS)**: Salva gravações de reuniões diretamente no disco (`Vídeos/Discall/Gravacoes`) com visualizador embutido.
- **Grupos e Salas**: Criação de grupos de trabalho com salas de texto e voz dentro de cada grupo.
- **Configurações de Dispositivo**: Seleção de microfone, alto-falante e câmera, com cancelamento de eco e supressão de ruído.
- **Hierarquia de Permissões com Bitflags**: Validação estrita de privilégios de Proprietário, Administrador e Membros.
- **Menu de Contexto (Right-Click)**: Ações rápidas para perfil, DMs, apelidos locais, chamadas diretas e convites de grupo.

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