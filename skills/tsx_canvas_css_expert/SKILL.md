---
name: tsx_canvas_css_expert
description: >
  Especialidade em desenvolvimento de animações ultra-performáticas com Canvas 2D,
  TypeScript e CSS/Tailwind. Foco em física de forças/molas (Force-Directed Graphs),
  nitidez absoluta em telas Retina/HiDPI, zero vazamento de memória (zero-GC),
  áudio-reatividade e integração suave com estados reativos (Zustand/React).
---

# Skill: TSX, Canvas 2D & CSS Expert

## Objetivo

Projetar e implementar interfaces visuais dinâmicas e animações ricas no navegador utilizando **Canvas 2D nativo**, **TypeScript rigoroso** e **Tailwind CSS/CSS Moderno**, garantindo:
1. **Desempenho Extremo (60+ FPS):** Consumo mínimo de CPU/GPU, evitando renderizações desnecessárias do React DOM.
2. **Nitidez Cristalina (High-DPI / Retina):** Compensação perfeita de `devicePixelRatio`.
3. **Física Suave e Orgânica:** Sistemas de partículas, gravidade zero, amortecimento (*damping*), molas elásticas (*spring physics*) e conexões de rede em tempo real.
4. **Áudio-Reatividade e Micro-interações:** Pulsos visuais sincronizados com fala, partículas de energia viajantes e transições suaves de entrada/saída de nós.

---

## 1. Princípios de Alta Performance em Canvas 2D + React

### 1.1 Isolamento do Ciclo de Renderização (Zero React Re-render)
O loop `requestAnimationFrame` **nunca** deve depender de re-renders do React para atualizar posições.
- Armazene o estado de física (nós, posições, velocidades) em `useRef` ou classes TypeScript dedicadas.
- O componente React apenas inicializa o `<canvas>`, redimensiona e sincroniza nós a partir dos stores (ex: Zustand) via `ref` ou subscrições finas.

```typescript
// Padrão correto: Refs para estado volátil
const nodesRef = useRef<Node[]>([]);
const animFrameRef = useRef<number | null>(null);
```

### 1.2 Nitidez Perfeita em Telas HiDPI / Retina
Para evitar que textos, círculos e linhas fiquem embaçados ou borrados:

```typescript
function setupHiDPICanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limita a 2x para equilibrar nitidez e performance
  
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  
  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
}
```

### 1.3 Prevenção de Coleta de Lixo (Zero-GC Pressure)
- Evite instanciar objetos, arrays ou strings complexas dentro do loop `draw()` / `update()`.
- Reutilize vetores e estruturas de dados (*object pooling*).
- Pré-calcule gradientes ou use valores hexadecimais/rgba diretos.

---

## 2. Motor de Física de Partículas e Nós (*Force-Directed & Springs*)

### 2.1 Equações Fundamentais de Movimento

1. **Amortecimento de Euler (Damping):**
   ```typescript
   node.vx *= 0.94; // Fricção suave
   node.vy *= 0.94;
   node.x += node.vx;
   node.y += node.vy;
   ```

2. **Atração de Mola (Lei de Hooke) para Conexões Ativas:**
   ```typescript
   const dx = target.x - node.x;
   const dy = target.y - node.y;
   const distance = Math.hypot(dx, dy) || 1;
   const force = (distance - restLength) * springStiffness;
   
   const fx = (dx / distance) * force;
   const fy = (dy / distance) * force;
   
   node.vx += fx;
   node.vy += fy;
   target.vx -= fx;
   target.vy -= fy;
   ```

3. **Repulsão Suave (Prevenção de Sobreposição):**
   ```typescript
   const minDist = node.radius + other.radius + 20;
   if (distance < minDist && distance > 0) {
     const repelForce = (minDist - distance) * 0.05;
     node.vx -= (dx / distance) * repelForce;
     node.vy -= (dy / distance) * repelForce;
   }
   ```

---

## 3. Renderização Visual e Efeitos Gráficos

### 3.1 Balões de Usuário / Avatares no Canvas
- **Círculo com Borda e Sombra de Brilho:**
  ```typescript
  ctx.save();
  ctx.shadowColor = node.color;
  ctx.shadowBlur = node.isSpeaking ? 16 : 6;
  ctx.fillStyle = node.color;
  ctx.beginPath();
  ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ```

- **Iniciais e Tipografia Nítida:**
  ```typescript
  ctx.fillStyle = '#0B0D12';
  ctx.font = `600 ${Math.round(node.radius * 0.8)}px "Geist", "Inter", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(node.initials, node.x, node.y + 1);
  ```

### 3.2 Linhas de Conexão com Feixes de Energia (Pulsos)
- Desenhar linhas com opacidade proporcional à força/distância.
- Criar partículas luminosas que viajam ao longo das linhas entre os nós conectados:

```typescript
function drawEnergyPulse(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, progress: number, color: string) {
  const px = x1 + (x2 - x1) * progress;
  const py = y1 + (y2 - y1) * progress;
  
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(px, py, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
```

### 3.3 Ondas de Áudio-Reatividade (*Speaking Wave*)
Quando `isSpeaking === true`, renderizar anéis concêntricos que se expandem e desaparecem em fade:
```typescript
function drawAudioRipple(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, progress: number, color: string) {
  const currentRadius = radius + progress * 24;
  const opacity = (1 - progress) * 0.6;
  
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = opacity;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
```

---

## 4. Integração com Tailwind e Layout

### Camada de Fundo (Stacking Context)
Posicione o canvas atrás da interface sem interceptar cliques de botões ou chats:
```html
<canvas class="fixed inset-0 pointer-events-none -z-0 w-full h-full opacity-60" />
```

Combine com `backdrop-blur-md` e cores escuras semitransparentes nos painéis do aplicativo (`bg-[#0E1015]/80`) para criar profundidade de vidro (*glassmorphism*).

---

## 5. Checklist de Qualidade para Animações TSX / Canvas

- [ ] `devicePixelRatio` devidamente configurado e recalculado no evento `resize`.
- [ ] `cancelAnimationFrame` invocado obrigatoriamente no cleanup do `useEffect`.
- [ ] Ausência de `setState` dentro do loop de animação.
- [ ] Transições suaves de opacidade e escala para nós que entram ou saem (sem cortes bruscos).
- [ ] `pointer-events: none` ativado no canvas para não travar cliques nos menus da aplicação.
- [ ] Testado a 60 FPS com 50+ nós simultâneos.
