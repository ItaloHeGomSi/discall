import { AvatarComposition, SkinTone, EyeColor, HairColor } from '../types/skin.types';

// Paleta de tons de pele (Base + Sombra)
const SKIN_PALETTES: Record<SkinTone, { base: string; shadow: string; highlight: string }> = {
  pale: { base: '#FFE0BD', shadow: '#E4BE9E', highlight: '#FFF0DE' },
  fair: { base: '#F1C27D', shadow: '#D09E5B', highlight: '#F7D69E' },
  tan: { base: '#C68642', shadow: '#A2652B', highlight: '#D99B5B' },
  olive: { base: '#8D5524', shadow: '#6F3E15', highlight: '#A86C37' },
  dark: { base: '#5C3818', shadow: '#42240B', highlight: '#734823' },
  ebony: { base: '#36200D', shadow: '#221206', highlight: '#4C2F17' },
};

const EYE_PALETTES: Record<EyeColor, { pupil: string; iris: string }> = {
  blue: { pupil: '#153A6B', iris: '#3D8EFF' },
  green: { pupil: '#184E28', iris: '#44CC66' },
  brown: { pupil: '#2B1408', iris: '#704222' },
  amber: { pupil: '#6B3C00', iris: '#FFAA00' },
  purple: { pupil: '#3E1053', iris: '#AA44DD' },
  red: { pupil: '#590B0B', iris: '#FF3333' },
};

const HAIR_PALETTES: Record<HairColor, { main: string; dark: string; light: string }> = {
  brown: { main: '#4A2A18', dark: '#31180A', light: '#613922' },
  black: { main: '#1A181B', dark: '#0C0A0D', light: '#2D2A2F' },
  blonde: { main: '#E4B849', dark: '#BA8E23', light: '#F5CE6E' },
  ginger: { main: '#B34A1B', dark: '#802D09', light: '#CF612F' },
  white: { main: '#DDE2E8', dark: '#B0B8C4', light: '#FFFFFF' },
  cyan: { main: '#25A9B8', dark: '#12737E', light: '#46CCE0' },
};

export function renderAvatarToCanvas(canvas: HTMLCanvasElement, config: AvatarComposition): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const pixelSize = w / 16; // Grid 16x16 pixels para renderização de busto/cabeça

  // Desabilita interpolação para manter os pixels nítidos (Estética Minecraft)
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, w, h);

  const skin = SKIN_PALETTES[config.skinTone] || SKIN_PALETTES.fair;
  const eye = EYE_PALETTES[config.eyeColor] || EYE_PALETTES.blue;
  const hair = HAIR_PALETTES[config.hairColor] || HAIR_PALETTES.brown;

  // Helper para desenhar pixel no grid 16x16
  const drawPixel = (gx: number, gy: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(gx * pixelSize, gy * pixelSize, pixelSize, pixelSize);
  };

  const drawRectGrid = (gx: number, gy: number, gw: number, gh: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(gx * pixelSize, gy * pixelSize, gw * pixelSize, gh * pixelSize);
  };

  // --- 1. CABEÇA / BASE DA PELE (8x8 no centro, gx 4..11, gy 2..9) ---
  drawRectGrid(4, 2, 8, 8, skin.base);
  // Sombras nas bordas da cabeça
  drawRectGrid(4, 9, 8, 1, skin.shadow); // queixo
  drawRectGrid(4, 2, 1, 8, skin.shadow); // lateral esquerda
  drawRectGrid(11, 2, 1, 8, skin.shadow); // lateral direita

  // --- 2. PESCOÇO E CORPO/ROUPA BASE (gx 2..13, gy 10..15) ---
  // Pescoço
  drawRectGrid(6, 10, 4, 1, skin.shadow);

  // Roupa / Armadura
  switch (config.outfit) {
    case 'tuxedo':
      drawRectGrid(3, 11, 10, 5, '#1A181C'); // Casaco preto
      drawRectGrid(6, 11, 4, 5, '#FFFFFF'); // Camisa branca
      drawPixel(7, 11, '#FF2222'); // Gravata borboleta
      drawPixel(8, 11, '#FF2222');
      drawPixel(7, 13, '#1A181C'); // Botões
      drawPixel(7, 14, '#1A181C');
      break;
    case 'diamond_chestplate':
      drawRectGrid(3, 11, 10, 5, '#55FFFF');
      drawRectGrid(3, 11, 10, 1, '#7AFFFF');
      drawRectGrid(4, 12, 8, 4, '#33CCCC');
      drawRectGrid(6, 11, 4, 2, '#209999');
      break;
    case 'netherite_armor':
      drawRectGrid(3, 11, 10, 5, '#353135');
      drawRectGrid(3, 11, 10, 1, '#4A464A');
      drawRectGrid(5, 12, 6, 4, '#242124');
      drawPixel(6, 13, '#AA7755'); // Detalhe em ouro
      drawPixel(9, 13, '#AA7755');
      break;
    case 'overalls':
      drawRectGrid(3, 11, 10, 5, '#CC2222'); // Camisa vermelha
      drawRectGrid(5, 12, 6, 4, '#2244AA'); // Macacão jeans
      drawPixel(5, 12, '#FFAA00'); // Fivelas douradas
      drawPixel(10, 12, '#FFAA00');
      break;
    case 'flannel':
      drawRectGrid(3, 11, 10, 5, '#882222');
      for (let y = 11; y <= 15; y += 2) {
        drawRectGrid(3, y, 10, 1, '#AA3333');
      }
      break;
    case 'hoodie_emerald':
    default:
      drawRectGrid(3, 11, 10, 5, '#1A6633');
      drawRectGrid(6, 11, 4, 5, '#228844');
      drawPixel(6, 12, '#55FF55'); // Cordões da blusa
      drawPixel(9, 12, '#55FF55');
      break;
  }

  // --- 3. OLHOS (gx 5..6 e gx 9..10, gy 6) ---
  // Olho Esquerdo
  drawPixel(5, 6, '#FFFFFF');
  drawPixel(6, 6, eye.iris);
  drawPixel(6, 7, eye.pupil);

  // Olho Direito
  drawPixel(10, 6, '#FFFFFF');
  drawPixel(9, 6, eye.iris);
  drawPixel(9, 7, eye.pupil);

  // Nariz
  drawPixel(7, 7, skin.shadow);
  drawPixel(8, 7, skin.shadow);

  // --- 4. BARBA / FACIAL HAIR ---
  if (config.facialHair !== 'none') {
    const beardColor = hair.dark;
    switch (config.facialHair) {
      case 'beard_full':
        drawRectGrid(5, 8, 6, 2, beardColor);
        drawPixel(7, 8, skin.shadow); // Boca
        drawPixel(8, 8, skin.shadow);
        drawPixel(4, 7, beardColor);
        drawPixel(11, 7, beardColor);
        break;
      case 'goatee':
        drawRectGrid(6, 9, 4, 1, beardColor);
        drawRectGrid(7, 8, 2, 1, beardColor);
        break;
      case 'mustache':
        drawRectGrid(5, 8, 6, 1, beardColor);
        break;
      case 'stubbled':
        drawPixel(5, 9, skin.shadow);
        drawPixel(7, 9, skin.shadow);
        drawPixel(9, 9, skin.shadow);
        drawPixel(11, 9, skin.shadow);
        break;
    }
  } else {
    // Boca sutil
    drawPixel(7, 8, skin.shadow);
    drawPixel(8, 8, skin.shadow);
  }

  // --- 5. CABELO (CAMADA 2 OVERLAY) ---
  if (config.hairStyle !== 'none') {
    switch (config.hairStyle) {
      case 'alex_ponytail':
        drawRectGrid(4, 2, 8, 3, hair.main);
        drawRectGrid(4, 3, 2, 4, hair.main);
        drawRectGrid(10, 3, 2, 4, hair.main);
        drawRectGrid(3, 7, 2, 5, hair.dark); // Trança caindo lateral
        break;
      case 'curly_crop':
        drawRectGrid(3, 1, 10, 4, hair.main);
        drawPixel(4, 1, hair.light);
        drawPixel(7, 1, hair.light);
        drawPixel(10, 1, hair.light);
        drawRectGrid(4, 4, 1, 2, hair.dark);
        drawRectGrid(11, 4, 1, 2, hair.dark);
        break;
      case 'undercut':
        drawRectGrid(4, 2, 8, 3, hair.main);
        drawRectGrid(3, 2, 2, 3, hair.light);
        drawRectGrid(4, 5, 1, 2, hair.dark);
        drawRectGrid(11, 5, 1, 2, hair.dark);
        break;
      case 'hoodie':
        drawRectGrid(3, 1, 10, 9, '#1A6633');
        drawRectGrid(5, 3, 6, 7, skin.base); // recorte do capuz
        break;
      case 'steve_classic':
      default:
        drawRectGrid(4, 2, 8, 2, hair.main);
        drawRectGrid(4, 3, 1, 4, hair.dark);
        drawRectGrid(11, 3, 1, 4, hair.dark);
        drawPixel(5, 4, hair.main);
        drawPixel(10, 4, hair.main);
        break;
    }
  }

  // --- 6. ACESSÓRIOS ---
  if (config.accessory !== 'none') {
    switch (config.accessory) {
      case 'pixel_glasses':
        drawRectGrid(4, 5, 8, 2, '#0A0A0A');
        drawPixel(5, 5, '#FFFFFF'); // Reflexo nos óculos
        drawPixel(9, 5, '#FFFFFF');
        break;
      case 'vr_headset':
        drawRectGrid(4, 5, 8, 3, '#1E222D');
        drawRectGrid(6, 6, 4, 1, '#3B82F6'); // Faixa LED azul
        break;
      case 'iron_helmet':
        drawRectGrid(3, 1, 10, 4, '#D6D6D6');
        drawRectGrid(3, 3, 2, 5, '#BCBCBC');
        drawRectGrid(11, 3, 2, 5, '#BCBCBC');
        drawRectGrid(4, 1, 8, 1, '#EDEDED');
        break;
      case 'diamond_crown':
        drawRectGrid(4, 1, 8, 2, '#55FFFF');
        drawPixel(5, 0, '#55FFFF');
        drawPixel(7, 0, '#55FFFF');
        drawPixel(9, 0, '#55FFFF');
        drawPixel(7, 2, '#FFAA00'); // Joia dourada
        break;
      case 'headphones':
        drawRectGrid(3, 1, 10, 1, '#222222'); // Arco
        drawRectGrid(3, 4, 2, 4, '#55FF55'); // Concha esquerda
        drawRectGrid(11, 4, 2, 4, '#55FF55'); // Concha direita
        drawPixel(3, 5, '#111111');
        drawPixel(12, 5, '#111111');
        break;
    }
  }

  // --- 7. ITEM NA MÃO (gx 0..3 ou 12..15, gy 10..15) ---
  if (config.heldItem !== 'none') {
    switch (config.heldItem) {
      case 'diamond_sword':
        drawPixel(1, 10, '#55FFFF'); // Lâmina
        drawPixel(2, 11, '#55FFFF');
        drawPixel(3, 12, '#33CCCC');
        drawPixel(2, 13, '#555555'); // Guarda
        drawPixel(4, 13, '#555555');
        drawPixel(3, 14, '#5C3818'); // Cabo
        break;
      case 'golden_apple':
        drawRectGrid(1, 11, 3, 3, '#FFAA00');
        drawPixel(2, 10, '#55FF55'); // Folhinha
        drawPixel(2, 12, '#FFEE55'); // Brilho
        break;
      case 'totem_of_undying':
        drawRectGrid(1, 11, 3, 4, '#FFAA00');
        drawPixel(1, 11, '#55FF55'); // Olhos do totem
        drawPixel(3, 11, '#55FF55');
        drawPixel(2, 13, '#AA6600');
        break;
      case 'potion_healing':
        drawRectGrid(1, 12, 3, 3, '#FF2255'); // Líquido vermelho
        drawPixel(2, 11, '#CCCCCC'); // Gargalo
        drawPixel(2, 10, '#8B5A2B'); // Rolha
        break;
      case 'redstone_torch':
        drawPixel(2, 10, '#FF2222'); // Chama redstone
        drawPixel(2, 11, '#FF4444');
        drawRectGrid(2, 12, 1, 3, '#8B5A2B'); // Graveto
        break;
    }
  }
}

export function generateAvatarDataUrl(config: AvatarComposition, size = 64): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  renderAvatarToCanvas(canvas, config);
  return canvas.toDataURL('image/png');
}
