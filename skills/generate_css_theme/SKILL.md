---
name: generate_css_theme
description: >
  Ativa a skill de Geração de Tema CSS seguindo a linguagem de design
  Minimals UI para o dashboard jurídico. Acionar quando o usuário solicitar:
  criar componente visual, gerar CSS, estilizar, criar tema, dark mode,
  light mode, card de métrica, gráfico donut, gráfico de barras, badge,
  chip, floating label, responsividade, design system, animação, hover,
  transition, Minimals UI, dashboard de métricas.
---

# Skill: Geração de Tema CSS — Minimals UI para Dashboard Jurídico

## Objetivo

Gerar componentes CSS/JS dinâmicos seguindo a linguagem de design **Minimals UI**, focada em dashboards de métricas de IA para o domínio jurídico. Os componentes devem ser limpos, modernos, responsivos e integráveis ao design system existente.

---

## Referência de Design: Minimals UI

### Princípios Fundamentais
1. **Espaçamento Generoso**: Mínimo 16px entre elementos, 24px entre seções
2. **Tipografia Limpa**: Sans-serif moderna, hierarquia clara (h1 > h2 > body > caption)
3. **Cores Controladas**: Paleta HSL via custom properties, sem cores hardcoded
4. **Superfícies**: Cards com `border-radius: 12-16px`, sombras sutis em camadas
5. **Micro-animações**: Transitions 200-300ms ease, hover states em todos os interativos
6. **Dados Visuais**: Gráficos inline com cores da paleta, labels flutuantes

---

## Design System Existente

O projeto já possui um design system maduro em `static/css/style.css`. **Sempre estenda-o, nunca o substitua.**

### Custom Properties (Variáveis CSS)
Todas as cores são definidas via custom properties e trocadas para dark mode:

```css
:root {
  /* Exemplo de variáveis que podem existir */
  --primary: hsl(...);
  --bg: hsl(...);
  --surface: hsl(...);
  --text: hsl(...);
  --text-secondary: hsl(...);
  --border: hsl(...);
  --success: hsl(...);
  --warning: hsl(...);
  --danger: hsl(...);
}

[data-theme="dark"] {
  /* Override para dark mode */
}
```

### Convenção de Nomes
- Classes CSS: kebab-case descritivo (ex: `metric-card`, `donut-wrapper`)
- IDs: camelCase descritivo (ex: `heroClass`, `donutStopwords`)
- Componentes: prefixo por tipo (ex: `btn-primary`, `card-title`, `nav-icon`)

---

## Padrões de Componentes

### 1. Card de Métrica
```css
.metric-card {
  background: var(--surface);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### 2. Gráfico Donut (SVG)
O projeto já possui donuts SVG. Para novos, seguir o padrão:
```html
<div class="donut-wrapper donut-emerald">
  <svg viewBox="0 0 100 100">
    <circle class="donut-bg" cx="50" cy="50" r="45" />
    <circle class="donut-fill" id="donut-id" cx="50" cy="50" r="45"
            stroke-dasharray="283" stroke-dashoffset="283" />
  </svg>
  <div class="donut-value" id="val-id">0%</div>
</div>
```

### 3. Gráfico de Barras Horizontal (CSS Grid)
Para métricas comparativas (Baseline vs ClassHead vs SubjectHead):
```css
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar-row {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  align-items: center;
  gap: 12px;
}

.bar-fill {
  height: 8px;
  border-radius: 4px;
  background: var(--primary);
  transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

.bar-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.bar-value {
  font-size: 0.85rem;
  font-weight: 600;
  text-align: right;
}
```

### 4. Floating Label
```css
.floating-label {
  position: absolute;
  top: -8px;
  left: 12px;
  background: var(--surface);
  padding: 0 6px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  letter-spacing: 0.02em;
}
```

### 5. Badge / Chip
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.badge-success {
  background: hsl(142 72% 94%);
  color: hsl(142 72% 29%);
}

.badge-warning {
  background: hsl(38 92% 94%);
  color: hsl(38 92% 35%);
}

.badge-danger {
  background: hsl(0 84% 94%);
  color: hsl(0 84% 40%);
}
```

---

## Gráficos para Métricas de IA

### Dashboard de Performance
Exibir comparação entre modelos treinados:

```
┌──────────────────────────────────────┐
│  Performance dos Modelos             │
│                                      │
│  Macro F1-Score                      │
│  Baseline (SVM)  ████████░░  0.82    │
│  ClassHead       █████████░  0.91    │
│  SubjectHead     ███████░░░  0.78    │
│                                      │
│  Accuracy                            │
│  Baseline (SVM)  ████████░░  0.85    │
│  ClassHead       █████████░  0.93    │
│  SubjectHead     ████████░░  0.81    │
└──────────────────────────────────────┘
```

### Distribuição de Classes
Gráfico de barras verticais ou treemap mostrando a distribuição das 21+1 classes no dataset.

---

## Responsividade

```css
/* Mobile-first breakpoints */
@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    transform: translateX(-100%);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Checklist de Geração

Ao gerar um novo componente CSS/JS:

- [ ] Usar custom properties existentes (nunca cores hardcoded)
- [ ] Testar em dark mode e light mode
- [ ] Incluir hover state com transition
- [ ] Verificar contraste WCAG 2.1 AA (4.5:1 mínimo)
- [ ] Responsivo em 3 breakpoints (mobile, tablet, desktop)
- [ ] ID único e descritivo para JS
- [ ] Animação de entrada suave (se aplicável)
- [ ] Integração com o `main.js` existente
