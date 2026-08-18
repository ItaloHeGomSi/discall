import React, { useEffect, useRef } from 'react';
import { useCallStore } from '../../stores/callStore';
import { useServerStore } from '../../stores/serverStore';
import { useUIStore } from '../../stores/uiStore';
import { useFriendStore } from '../../stores/friendStore';
import { useAuthStore } from '../../stores/authStore';
import { colorForId } from '../../utils/avatarColor';
import { LOCAL_USER_ID } from '../../constants';

interface VisualNode {
  id: string;
  name: string;
  initials: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  scale: number;
  opacity: number;
  isSpeaking: boolean;
  speakingTimer: number;
  roleName?: string;
  isExiting?: boolean;
}

interface EnergyPulse {
  id: string;
  fromId: string;
  toId: string;
  progress: number;
  speed: number;
  color: string;
}

export const ConnectionBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stores Zustand
  const { isInCall, participants } = useCallStore();
  const { activeServerId, servers } = useServerStore();
  const { activeMainTab } = useUIStore();
  const { friends, activeDmFriendId } = useFriendStore();
  const { user } = useAuthStore();

  // Refs para física e renderização (Zero React re-renders no canvas)
  const nodesRef = useRef<VisualNode[]>([]);
  const pulsesRef = useRef<EnergyPulse[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const dimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  // 1. Sincronização dos nós conforme o modo ativo
  useEffect(() => {
    const { width, height } = dimensionsRef.current;
    const cx = width > 0 ? width / 2 : window.innerWidth / 2;
    const cy = height > 0 ? height / 2 : window.innerHeight / 2;

    const currentNodes = nodesRef.current;
    const nextNodes: VisualNode[] = [];

    // --- MODO 1: Chamada Ativa (1v1 ou Servidor/Grupo) ---
    if (isInCall) {
      const pList = Object.values(participants);
      const total = Math.max(pList.length, 1);

      pList.forEach((p, idx) => {
        const existing = currentNodes.find((n) => n.id === p.id);
        const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
        const orbitRadius = Math.min(width, height) * 0.3 || 180;
        const targetX = cx + Math.cos(angle) * orbitRadius;
        const targetY = cy + Math.sin(angle) * orbitRadius;

        const initials = p.username
          .split(' ')
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
          .toUpperCase() || 'U';

        if (existing) {
          existing.name = p.username;
          existing.initials = initials;
          existing.color = p.avatarColor || colorForId(p.id);
          existing.targetRadius = 26;
          existing.isSpeaking = !!p.isSpeaking;
          existing.isExiting = false;
          existing.vx += (targetX - existing.x) * 0.05;
          existing.vy += (targetY - existing.y) * 0.05;
          nextNodes.push(existing);
        } else {
          nextNodes.push({
            id: p.id,
            name: p.username,
            initials,
            color: p.avatarColor || colorForId(p.id),
            x: targetX + (Math.random() - 0.5) * 40,
            y: targetY + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            radius: 0,
            targetRadius: 26,
            scale: 0,
            opacity: 0,
            isSpeaking: !!p.isSpeaking,
            speakingTimer: 0,
          });
        }
      });
    }
    // --- MODO 2: Mensagens Diretas (Exatamente os 2 usuários da conversa) ---
    else if (activeMainTab === 'friends' && activeDmFriendId && friends[activeDmFriendId]) {
      const friend = friends[activeDmFriendId];
      const myId = user?.id || LOCAL_USER_ID;
      const myName = user?.username || 'Você';
      const myColor = user?.avatarColor || colorForId(myId);

      const dmUsers = [
        {
          id: myId,
          name: `${myName} (Você)`,
          initials: myName.slice(0, 2).toUpperCase(),
          color: myColor,
          targetX: cx - (Math.min(width, height) * 0.22 || 140),
          targetY: cy,
        },
        {
          id: friend.id,
          name: friend.customNickname || friend.username,
          initials: friend.username.slice(0, 2).toUpperCase(),
          color: friend.avatarColor || colorForId(friend.id),
          targetX: cx + (Math.min(width, height) * 0.22 || 140),
          targetY: cy,
        },
      ];

      dmUsers.forEach((u) => {
        const existing = currentNodes.find((n) => n.id === u.id);
        if (existing) {
          existing.name = u.name;
          existing.initials = u.initials;
          existing.color = u.color;
          existing.targetRadius = 28;
          existing.isSpeaking = false;
          existing.isExiting = false;
          existing.vx += (u.targetX - existing.x) * 0.04;
          existing.vy += (u.targetY - existing.y) * 0.04;
          nextNodes.push(existing);
        } else {
          nextNodes.push({
            id: u.id,
            name: u.name,
            initials: u.initials,
            color: u.color,
            x: u.targetX,
            y: u.targetY,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: 0,
            targetRadius: 28,
            scale: 0,
            opacity: 0,
            isSpeaking: false,
            speakingTimer: 0,
          });
        }
      });
    }
    // --- MODO 3: Servidor / Grupo (Balões Flutuantes dos membros daquele servidor, SEM interligação) ---
    else if (activeMainTab === 'server' && activeServerId && servers[activeServerId]) {
      const srv = servers[activeServerId];
      const memberIds = Object.keys(srv.members);

      memberIds.forEach((uid, idx) => {
        const existing = currentNodes.find((n) => n.id === uid);
        const memberInfo = srv.members[uid];
        const primaryRoleId = memberInfo?.roleIds[0];
        const role = primaryRoleId ? srv.roles[primaryRoleId] : undefined;

        let name = uid === (user?.id || LOCAL_USER_ID) ? `${user?.username || 'Você'} (Você)` : 'Membro';
        let color = role?.colorHex || colorForId(uid);

        if (friends[uid]) {
          name = friends[uid].username;
        } else if (uid === 'friend-ana') {
          name = 'Ana Torres';
        } else if (uid === 'friend-marcos') {
          name = 'Marcos Lima';
        } else if (uid === 'friend-beatriz') {
          name = 'Beatriz Souza';
        }

        const initials = name
          .split(' ')
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
          .toUpperCase() || 'M';

        if (existing) {
          existing.name = name;
          existing.initials = initials;
          existing.color = color;
          existing.roleName = role?.name;
          existing.targetRadius = 22;
          existing.isSpeaking = false;
          existing.isExiting = false;
          nextNodes.push(existing);
        } else {
          const angle = (idx / Math.max(memberIds.length, 1)) * Math.PI * 2;
          const dist = 120 + Math.random() * (Math.min(width, height) * 0.28);
          nextNodes.push({
            id: uid,
            name,
            initials,
            color,
            roleName: role?.name,
            x: cx + Math.cos(angle) * dist,
            y: cy + Math.sin(angle) * dist,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: 0,
            targetRadius: 22,
            scale: 0,
            opacity: 0,
            isSpeaking: false,
            speakingTimer: 0,
          });
        }
      });
    }
    // --- MODO 4: Lobby de Contatos (Navegação em Disponíveis, Todos, Pendentes, Bloqueados, Adicionar) ---
    else {
      const totalParticles = 28;
      for (let i = 0; i < totalParticles; i++) {
        const id = `lobby-particle-${i}`;
        const existing = currentNodes.find((n) => n.id === id);
        if (existing) {
          existing.targetRadius = 4 + (i % 4) * 2;
          existing.isExiting = false;
          nextNodes.push(existing);
        } else {
          const col = ['#5B7CFA', '#22C55E', '#A855F7', '#F59E0B', '#38BDF8', '#EC4899'][i % 6];
          nextNodes.push({
            id,
            name: '',
            initials: '',
            color: col,
            x: Math.random() * (width || window.innerWidth),
            y: Math.random() * (height || window.innerHeight),
            vx: (Math.random() - 0.5) * 0.55,
            vy: (Math.random() - 0.5) * 0.55,
            radius: 0,
            targetRadius: 4 + (i % 4) * 2,
            scale: 0,
            opacity: 0,
            isSpeaking: false,
            speakingTimer: 0,
          });
        }
      }
    }

    // Saída suave dos nós desativados
    currentNodes.forEach((oldNode) => {
      if (!nextNodes.some((n) => n.id === oldNode.id)) {
        oldNode.isExiting = true;
        nextNodes.push(oldNode);
      }
    });

    nodesRef.current = nextNodes;
  }, [isInCall, participants, activeMainTab, activeServerId, servers, friends, activeDmFriendId, user]);

  // 2. Loop de animação física e renderização
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Ajuste de DPI (Retina Sharpness)
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      dimensionsRef.current = { width: w, height: h };

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const isCallActive = useCallStore.getState().isInCall;
      const activeTab = useUIStore.getState().activeMainTab;
      const activeDmId = useFriendStore.getState().activeDmFriendId;

      const isDmActive = activeTab === 'friends' && !!activeDmId && !isCallActive;
      const isServerActive = activeTab === 'server' && !isCallActive;
      const isLobbyActive = activeTab === 'friends' && !activeDmId && !isCallActive;

      // --- A. FÍSICA E ATUALIZAÇÃO ---
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];

        if (node.isExiting) {
          node.scale = Math.max(0, node.scale - dt * 3.5);
          node.opacity = Math.max(0, node.opacity - dt * 3.5);
          if (node.scale <= 0.01) {
            nodes.splice(i, 1);
            continue;
          }
        } else {
          node.scale += (1 - node.scale) * Math.min(1, dt * 6);
          node.opacity += (1 - node.opacity) * Math.min(1, dt * 6);
        }

        node.radius = node.targetRadius * node.scale;

        // Movimento
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.95;
        node.vy *= 0.95;

        // Drift suave constante
        node.vx += (Math.random() - 0.5) * 0.08;
        node.vy += (Math.random() - 0.5) * 0.08;

        // Limites da tela
        const margin = node.radius + 20;
        if (node.x < margin) {
          node.x = margin;
          node.vx = Math.abs(node.vx) * 0.8;
        } else if (node.x > width - margin) {
          node.x = width - margin;
          node.vx = -Math.abs(node.vx) * 0.8;
        }
        if (node.y < margin) {
          node.y = margin;
          node.vy = Math.abs(node.vy) * 0.8;
        } else if (node.y > height - margin) {
          node.y = height - margin;
          node.vy = -Math.abs(node.vy) * 0.8;
        }

        // Repulsão mútua
        for (let j = i - 1; j >= 0; j--) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.hypot(dx, dy) || 1;
          const minDist = (node.radius + other.radius) * 2.2 + 20;

          if (dist < minDist) {
            const force = ((minDist - dist) / minDist) * 0.4;
            const nx = dx / dist;
            const ny = dy / dist;
            node.vx -= nx * force;
            node.vy -= ny * force;
            other.vx += nx * force;
            other.vy += ny * force;
          }
        }

        // Timer de fala e disparo de pulsos (Chamadas)
        if (node.isSpeaking) {
          node.speakingTimer = (node.speakingTimer + dt * 2.5) % 1;
          if (Math.random() < 0.05 && nodes.length > 1) {
            const targetNode = nodes.find((n) => n.id !== node.id && !n.isExiting);
            if (targetNode) {
              pulsesRef.current.push({
                id: `pulse-${Date.now()}-${Math.random()}`,
                fromId: node.id,
                toId: targetNode.id,
                progress: 0,
                speed: 0.9 + Math.random() * 0.4,
                color: node.color,
              });
            }
          }
        }

        // No modo DM: gera fluxo contínuo de dados entre os 2 usuários
        if (isDmActive && Math.random() < 0.02 && nodes.length === 2) {
          const other = nodes.find((n) => n.id !== node.id);
          if (other) {
            pulsesRef.current.push({
              id: `pulse-dm-${Date.now()}-${Math.random()}`,
              fromId: node.id,
              toId: other.id,
              progress: 0,
              speed: 0.7 + Math.random() * 0.3,
              color: node.color,
            });
          }
        }
      }

      // --- B. DESENHO DAS CONEXÕES E LINHAS ---
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy) || 1;

          let shouldConnect = false;
          let maxDist = 150;
          let lineAlpha = 0;

          if (isCallActive) {
            // Em chamada (1v1 ou Servidor): todos os participantes se conectam em malha elástica
            shouldConnect = true;
            maxDist = Math.max(width, height);
            lineAlpha = Math.min(n1.opacity, n2.opacity) * (n1.isSpeaking || n2.isSpeaking ? 0.6 : 0.35);
          } else if (isDmActive) {
            // Em Mensagens Diretas: feixe direto e nítido entre os 2 usuários
            shouldConnect = true;
            maxDist = Math.max(width, height);
            lineAlpha = Math.min(n1.opacity, n2.opacity) * 0.45;
          } else if (isLobbyActive) {
            // No Lobby de Contatos: conexão aleatória por proximidade entre partículas
            maxDist = 140;
            if (dist < maxDist) {
              shouldConnect = true;
              lineAlpha = (1 - dist / maxDist) * 0.28 * Math.min(n1.opacity, n2.opacity);
            }
          } else if (isServerActive) {
            // Nos Servidores (Salas de texto/repouso): Balões flutuantes SEM interligação
            shouldConnect = false;
          }

          if (shouldConnect && lineAlpha > 0.01) {
            ctx.save();
            ctx.lineWidth = isCallActive
              ? n1.isSpeaking || n2.isSpeaking
                ? 2.2
                : 1.5
              : isDmActive
              ? 1.8
              : 1;

            const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
            grad.addColorStop(0, `${n1.color}${Math.round(lineAlpha * 255).toString(16).padStart(2, '0')}`);
            grad.addColorStop(1, `${n2.color}${Math.round(lineAlpha * 255).toString(16).padStart(2, '0')}`);

            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // --- C. PULSOS DE ENERGIA (Sparks) ---
      // Pulsos só trafegam em conexões ativas (Chamadas e DMs)
      if (isCallActive || isDmActive) {
        const pulses = pulsesRef.current;
        for (let pIdx = pulses.length - 1; pIdx >= 0; pIdx--) {
          const pulse = pulses[pIdx];
          pulse.progress += dt * pulse.speed;

          const fromNode = nodes.find((n) => n.id === pulse.fromId);
          const toNode = nodes.find((n) => n.id === pulse.toId);

          if (!fromNode || !toNode || pulse.progress >= 1) {
            pulses.splice(pIdx, 1);
            continue;
          }

          const px = fromNode.x + (toNode.x - fromNode.x) * pulse.progress;
          const py = fromNode.y + (toNode.y - fromNode.y) * pulse.progress;

          ctx.save();
          ctx.shadowColor = pulse.color;
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(px, py, isDmActive ? 3.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else {
        pulsesRef.current = [];
      }

      // --- D. BALÕES E AVATARES ---
      for (const node of nodes) {
        if (node.radius <= 0) continue;

        ctx.save();
        ctx.globalAlpha = node.opacity;

        // 1. Onda de Áudio-Reatividade (apenas em chamadas quando falando)
        if (node.isSpeaking) {
          const rippleR = node.radius + node.speakingTimer * 22;
          const rippleAlpha = (1 - node.speakingTimer) * 0.75;
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = rippleAlpha * node.opacity;
          ctx.beginPath();
          ctx.arc(node.x, node.y, rippleR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = node.opacity;
        }

        // 2. Halo de Brilho
        ctx.shadowColor = node.color;
        ctx.shadowBlur = node.isSpeaking ? 24 : node.initials ? 12 : 5;

        // 3. Círculo do Balão
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // 4. Borda de Contraste
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = node.initials ? 1.5 : 0.8;
        ctx.stroke();

        // 5. Iniciais dentro do balão
        if (node.initials && node.radius > 12) {
          ctx.fillStyle = '#0B0D12';
          ctx.font = `700 ${Math.round(node.radius * 0.75)}px "Geist", "Inter", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.initials, node.x, node.y + 1);
        }

        // 6. Rótulo com Nome e Cargo (embaixo do nó)
        if (node.name && node.radius > 12) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#000000';
          ctx.fillStyle = '#E2E4EB';
          ctx.font = `500 11px "Geist", "Inter", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(node.name, node.x, node.y + node.radius + 6);

          if (node.roleName) {
            ctx.fillStyle = '#9AA3B2';
            ctx.font = `400 9px "JetBrains Mono", monospace`;
            ctx.fillText(node.roleName.toUpperCase(), node.x, node.y + node.radius + 20);
          }
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-0 w-full h-full opacity-75 transition-opacity duration-700"
      style={{ willChange: 'transform' }}
    />
  );
};
