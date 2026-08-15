import React, { useState } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { Modal } from '../../components/ui/Modal';
import { VoxelButton } from '../../components/ui/VoxelButton';
import { CanvasAvatarRenderer } from '../../components/avatar/CanvasAvatarRenderer';
import {
  AvatarComposition,
  SkinTone,
  EyeColor,
  HairStyle,
  HairColor,
  FacialHair,
  Accessory,
  Outfit,
  HeldItem,
} from '../../types/skin.types';
import { Sparkles, Camera, RefreshCw } from 'lucide-react';

export const SkinEditorModal: React.FC = () => {
  const { isSkinEditorOpen, setSkinEditorOpen } = useUIStore();
  const { user, updateAvatar, updateRealPhoto } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'skin' | 'real_photo'>('skin');
  const [tempConfig, setTempConfig] = useState<AvatarComposition>(
    user ? { ...user.avatarConfig } : ({} as AvatarComposition)
  );
  const [photoUrlInput, setPhotoUrlInput] = useState(user?.realPhotoUrl || '');

  if (!user) return null;

  const handleSave = () => {
    updateAvatar(tempConfig);
    updateRealPhoto(photoUrlInput.trim() || undefined);
    setSkinEditorOpen(false);
  };

  const handleRandomize = () => {
    const tones: SkinTone[] = ['pale', 'fair', 'tan', 'olive', 'dark', 'ebony'];
    const eyes: EyeColor[] = ['blue', 'green', 'brown', 'amber', 'purple', 'red'];
    const styles: HairStyle[] = ['steve_classic', 'alex_ponytail', 'curly_crop', 'undercut', 'hoodie'];
    const hairColors: HairColor[] = ['brown', 'black', 'blonde', 'ginger', 'white', 'cyan'];
    const beards: FacialHair[] = ['beard_full', 'goatee', 'mustache', 'stubbled', 'none'];
    const accs: Accessory[] = ['vr_headset', 'pixel_glasses', 'iron_helmet', 'diamond_crown', 'headphones', 'none'];
    const outfits: Outfit[] = ['tuxedo', 'overalls', 'hoodie_emerald', 'diamond_chestplate', 'netherite_armor', 'flannel'];
    const items: HeldItem[] = ['diamond_sword', 'golden_apple', 'totem_of_undying', 'potion_healing', 'redstone_torch', 'none'];

    setTempConfig({
      skinTone: tones[Math.floor(Math.random() * tones.length)],
      eyeColor: eyes[Math.floor(Math.random() * eyes.length)],
      hairStyle: styles[Math.floor(Math.random() * styles.length)],
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
      facialHair: beards[Math.floor(Math.random() * beards.length)],
      accessory: accs[Math.floor(Math.random() * accs.length)],
      outfit: outfits[Math.floor(Math.random() * outfits.length)],
      heldItem: items[Math.floor(Math.random() * items.length)],
    });
  };

  return (
    <Modal
      isOpen={isSkinEditorOpen}
      onClose={() => setSkinEditorOpen(false)}
      title="Editor de Avatar & Skin Minecraft"
      subtitle="Monte seu visual customizado com composição dinâmica em Canvas 64x64."
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Abas */}
        <div className="flex border-b border-[#222634] gap-2 pb-2">
          <button
            onClick={() => setActiveTab('skin')}
            className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider font-mono cursor-pointer transition-colors ${
              activeTab === 'skin'
                ? 'bg-[#153D22] text-[#55FF55] border border-[#228844]'
                : 'text-[#9DA3B4] hover:text-white'
            }`}
          >
            Avatar Procedural (Canvas)
          </button>
          <button
            onClick={() => setActiveTab('real_photo')}
            className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider font-mono cursor-pointer transition-colors ${
              activeTab === 'real_photo'
                ? 'bg-[#1E222D] text-[#55FFFF] border border-[#55FFFF]/40'
                : 'text-[#9DA3B4] hover:text-white'
            }`}
          >
            Foto Real (Flip 3D)
          </button>
        </div>

        {activeTab === 'skin' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {/* Coluna 1: Preview do Canvas */}
            <div className="flex flex-col items-center justify-center p-4 bg-[#14161C] border border-[#222634] rounded-lg">
              <CanvasAvatarRenderer avatarConfig={tempConfig} size={140} className="shadow-2xl mb-3" />
              <span className="text-xs font-mono text-[#55FF55] font-semibold">
                Preview em Tempo Real
              </span>
              <p className="text-[11px] text-[#646A7E] text-center mt-1">
                64x64 Pixels com interpolação pixelada nativa
              </p>

              <VoxelButton
                variant="secondary"
                size="sm"
                onClick={handleRandomize}
                className="mt-3 w-full flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Aleatório</span>
              </VoxelButton>
            </div>

            {/* Coluna 2 e 3: Controles das Camadas */}
            <div className="md:col-span-2 space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {/* Tom de Pele */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DA3B4] mb-1">
                  1. Tom de Pele:
                </label>
                <select
                  value={tempConfig.skinTone}
                  onChange={(e) =>
                    setTempConfig({ ...tempConfig, skinTone: e.target.value as SkinTone })
                  }
                  className="w-full bg-[#0C0D10] border border-[#2B3142] rounded px-2.5 py-1.5 text-xs text-[#F0F2F8]"
                >
                  <option value="pale">Pálido (Pale)</option>
                  <option value="fair">Claro (Fair)</option>
                  <option value="tan">Bronzeado (Tan)</option>
                  <option value="olive">Oliva (Olive)</option>
                  <option value="dark">Escuro (Dark)</option>
                  <option value="ebony">Ébano (Ebony)</option>
                </select>
              </div>

              {/* Cor dos Olhos */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DA3B4] mb-1">
                  2. Cor dos Olhos:
                </label>
                <select
                  value={tempConfig.eyeColor}
                  onChange={(e) =>
                    setTempConfig({ ...tempConfig, eyeColor: e.target.value as EyeColor })
                  }
                  className="w-full bg-[#0C0D10] border border-[#2B3142] rounded px-2.5 py-1.5 text-xs text-[#F0F2F8]"
                >
                  <option value="blue">Azul Steve</option>
                  <option value="green">Verde Esmeralda</option>
                  <option value="brown">Castanho Terra</option>
                  <option value="amber">Âmbar Dourado</option>
                  <option value="purple">Roxo Ender</option>
                  <option value="red">Vermelho Redstone</option>
                </select>
              </div>

              {/* Estilo e Cor do Cabelo */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#9DA3B4] mb-1">
                    3. Cabelo (Corte):
                  </label>
                  <select
                    value={tempConfig.hairStyle}
                    onChange={(e) =>
                      setTempConfig({ ...tempConfig, hairStyle: e.target.value as HairStyle })
                    }
                    className="w-full bg-[#0C0D10] border border-[#2B3142] rounded px-2 py-1.5 text-xs text-[#F0F2F8]"
                  >
                    <option value="steve_classic">Steve Clássico</option>
                    <option value="alex_ponytail">Alex Trança</option>
                    <option value="curly_crop">Encaracolado</option>
                    <option value="undercut">Undercut Moderno</option>
                    <option value="hoodie">Capuz de Aventureiro</option>
                    <option value="none">Careca</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#9DA3B4] mb-1">
                    Cor do Cabelo:
                  </label>
                  <select
                    value={tempConfig.hairColor}
                    onChange={(e) =>
                      setTempConfig({ ...tempConfig, hairColor: e.target.value as HairColor })
                    }
                    className="w-full bg-[#0C0D10] border border-[#2B3142] rounded px-2 py-1.5 text-xs text-[#F0F2F8]"
                  >
                    <option value="brown">Castanho</option>
                    <option value="black">Preto</option>
                    <option value="blonde">Loiro Ouro</option>
                    <option value="ginger">Ruivo</option>
                    <option value="white">Branco Neve</option>
                    <option value="cyan">Azul Diamante</option>
                  </select>
                </div>
              </div>

              {/* Barba / Pelos Faciais */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DA3B4] mb-1">
                  4. Barba & Bigode:
                </label>
                <select
                  value={tempConfig.facialHair}
                  onChange={(e) =>
                    setTempConfig({ ...tempConfig, facialHair: e.target.value as FacialHair })
                  }
                  className="w-full bg-[#0C0D10] border border-[#2B3142] rounded px-2.5 py-1.5 text-xs text-[#F0F2F8]"
                >
                  <option value="none">Nenhum (Sem barba)</option>
                  <option value="beard_full">Barba Cheia Clássica</option>
                  <option value="goatee">Cavanhaque</option>
                  <option value="mustache">Bigode</option>
                  <option value="stubbled">Barba por Fazer</option>
                </select>
              </div>

              {/* Acessórios */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DA3B4] mb-1">
                  5. Acessório de Cabeça:
                </label>
                <select
                  value={tempConfig.accessory}
                  onChange={(e) =>
                    setTempConfig({ ...tempConfig, accessory: e.target.value as Accessory })
                  }
                  className="w-full bg-[#0C0D10] border border-[#2B3142] rounded px-2.5 py-1.5 text-xs text-[#F0F2F8]"
                >
                  <option value="none">Nenhum</option>
                  <option value="headphones">Headphone Gamer Verde</option>
                  <option value="pixel_glasses">Óculos Pixel Escuros</option>
                  <option value="diamond_crown">Coroa de Diamante</option>
                  <option value="iron_helmet">Capacete de Ferro</option>
                  <option value="vr_headset">Óculos VR Futurista</option>
                </select>
              </div>

              {/* Roupas / Armadura */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DA3B4] mb-1">
                  6. Roupa / Armadura:
                </label>
                <select
                  value={tempConfig.outfit}
                  onChange={(e) =>
                    setTempConfig({ ...tempConfig, outfit: e.target.value as Outfit })
                  }
                  className="w-full bg-[#0C0D10] border border-[#2B3142] rounded px-2.5 py-1.5 text-xs text-[#F0F2F8]"
                >
                  <option value="hoodie_emerald">Moletom Esmeralda</option>
                  <option value="diamond_chestplate">Peitoral de Diamante</option>
                  <option value="netherite_armor">Armadura de Netherite</option>
                  <option value="tuxedo">Smoking / Terno Elegante</option>
                  <option value="overalls">Macacão de Minerador</option>
                  <option value="flannel">Camisa Xadrez Flanela</option>
                </select>
              </div>

              {/* Item Seguro na Mão */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9DA3B4] mb-1">
                  7. Item na Mão:
                </label>
                <select
                  value={tempConfig.heldItem}
                  onChange={(e) =>
                    setTempConfig({ ...tempConfig, heldItem: e.target.value as HeldItem })
                  }
                  className="w-full bg-[#0C0D10] border border-[#2B3142] rounded px-2.5 py-1.5 text-xs text-[#F0F2F8]"
                >
                  <option value="none">Nenhum</option>
                  <option value="diamond_sword">Espada de Diamante ⚔️</option>
                  <option value="golden_apple">Maçã Dourada 🍏</option>
                  <option value="totem_of_undying">Totem da Imortalidade 🗿</option>
                  <option value="potion_healing">Poção de Cura 🧪</option>
                  <option value="redstone_torch">Tocha de Redstone 🕯️</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          /* Aba de Foto Real */
          <div className="space-y-4 p-2">
            <div className="p-4 bg-[#14161C] border border-[#222634] rounded-lg">
              <h4 className="text-sm font-semibold text-[#F0F2F8] flex items-center gap-2 mb-1">
                <Camera className="w-4 h-4 text-[#55FFFF]" />
                Foto de Perfil Real (Para Transição 3D)
              </h4>
              <p className="text-xs text-[#9DA3B4] mb-3">
                Ao dar um duplo clique no seu card durante uma chamada, o Discall gira suavemente
                em 3D entre a sua Skin Minecraft e a sua Foto Real.
              </p>

              <input
                type="url"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                placeholder="Insira a URL da sua foto (ex: https://i.imgur.com/...)"
                className="w-full bg-[#0C0D10] border border-[#2B3142] rounded-lg px-3 py-2 text-sm text-[#F0F2F8] focus:outline-none focus:border-[#55FFFF]"
              />
            </div>
          </div>
        )}

        {/* Rodapé com Salvar */}
        <div className="flex justify-end gap-2 pt-3 border-t border-[#222634]">
          <VoxelButton
            type="button"
            variant="ghost"
            onClick={() => setSkinEditorOpen(false)}
          >
            Cancelar
          </VoxelButton>
          <VoxelButton type="button" variant="emerald" onClick={handleSave}>
            Salvar Avatar
          </VoxelButton>
        </div>
      </div>
    </Modal>
  );
};
