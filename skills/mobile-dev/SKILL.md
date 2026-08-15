---
name: Mobile Web Specialist & Responsive UX
description: Conhecimento específico para desenvolvimento web mobile, ergonomia touch (44px), safe-area, isolamento desktop, performance e otimização responsiva.
---

# Mobile Web Specialist & Responsive UX

Guia e regras de arquitetura para otimização e desenvolvimento web mobile no projeto EscóriaClub.

## Passo 1: Isolamento de Arquivos e Código
- Mantenha o código Desktop intacto.
- Modele a arquitetura isolando adaptações mobile em hooks dedicados, variantes responsivas (ex: `sm:`, `lg:`) ou componentes específicos de plataforma, mantendo a lógica de negócios central compartilhada sem colaterais no layout Desktop.

## Passo 2: Adaptação Ergonomia e Interface (UI/UX)
- Garanta que todas as áreas interativas (botões, ícones clicáveis e links) possuam dimensão mínima de toque de **44x44px** em dispositivos mobile.
- Implemente estados de feedback imediato (`:active`, loaders ou feedback tátil) para cada ação do usuário.
- Mantenha a rolagem nativa e fluida utilizando `-webkit-overflow-scrolling: touch` e `touch-action: pan-y` com suporte a gesto elástico nas áreas de scroll.
- Substitua ou proteja pseudo-classes `:hover` e manipuladores `onMouseEnter` em dispositivos sensíveis ao toque usando `@media (hover: hover)` ou estados `:active`, evitando travamentos e a persistência indesejada do estado hover na tela touch.

## Passo 3: Gestão de Performance e Hardware
- Aplique desmontagem estrita (*unmount*) em modais contendo mídias pesadas (leitores de livros, players de vídeo) imediatamente após o fechamento, liberando memória do dispositivo.
- Assegure a inclusão da tag viewport adequada no cabeçalho global:
  `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />`
- Aplique classes de utilidade para Safe Area (`safe-area-inset`) nos componentes de topo e rodapé para contornar o Notch e a barra de navegação por gestos.

## Passo 4: Persistência, Rede e Recursos
- Implemente persistência de estado via `@capacitor/preferences` ou `LocalStorage` para manter o progresso do usuário (ex: página atual do livro, segundo do vídeo).
- Adicione tratamento para perda de conectividade (*offline state*) exibindo alertas informativos em vez de falhas de renderização.
- Documente a geração de assets utilizando o fluxo automatizado `@capacitor/assets` a partir de uma fonte master.

## Protocolo de Segurança
1. **Restrição de Modificação**: O agente está terminantemente proibido de alterar arquivos e estilos configurados exclusivamente para a visualização Desktop.
2. **Isolamento Semântico**: Nenhuma biblioteca nativa adicional deve ser instalada sem validação de compatibilidade prévia.
3. **Preservação de Estado**: A lógica mobile deve herdar as mesmas regras de validação e segurança já aplicadas na API backend da web.
