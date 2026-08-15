# 🧪 Caso Prático: Antes & Depois — Python

## Contexto
Código de um sistema de classificação processual que busca processos
e calcula scores de similaridade para ranqueamento.

---

## CÓDIGO ANTES (Com Problemas)

```python
# arquivo: ranker.py
import pandas as pd

def process(data, x):
    result = []
    for i in range(len(data)):
        for j in range(len(data)):
            if data[i]['class'] == data[j]['class'] and i != j:
                score = 0
                for k in range(len(x)):
                    score += data[i]['features'][k] * x[k]
                result.append({'id': data[i]['id'], 'score': score, 'match': data[j]['id']})

    final = []
    seen = []
    for item in result:
        if item['id'] not in seen:
            final.append(item)
            seen.append(item['id'])  # O(n) lookup em lista!

    scores = []
    for item in final:
        scores.append(item['score'])

    max_s = max(scores)
    min_s = min(scores)

    normalized = []
    for item in final:
        n = {}
        for key in item:
            n[key] = item[key]
        n['score'] = (item['score'] - min_s) / (max_s - min_s) if max_s != min_s else 0
        normalized.append(n)

    normalized2 = []
    for item in normalized:
        n2 = {}
        for key in item:
            n2[key] = item[key]
        normalized2.append(n2)

    return normalized2
```

---

## RELATÓRIO GERADO PELO AGENTE

```
╔══════════════════════════════════════════════════════════════════╗
║         🧹 RELATÓRIO DE QUALIDADE — Clean Code & QE Audit       ║
╚══════════════════════════════════════════════════════════════════╝

📁 Arquivo/Módulo Analisado: ranker.py
🔢 Linhas Analisadas: 33
⚙️  Linguagem/Framework: Python 3.x
📅 Data da Auditoria: 2026-08-10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    📊 RESUMO EXECUTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 Blockers:  2   🟠 Majors: 4   🟡 Minors: 3   🔵 Infos: 2
Débito Técnico Estimado: 3–4 horas
Complexidade Ciclomática: 8 (recomendada ≤ 7)
Cobertura de Testes Recomendada: 90%

Veredicto: 🚫 BLOQUEADO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  ⚡ ANÁLISE DE PERFORMANCE (Big O)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Função/Bloco            | Tempo       | Espaço | Risco | Linha |
|-------------------------|-------------|--------|-------|-------|
| Loop duplo (i, j)       | O(n² × m)   | O(n²)  | 🔴    | L4-L9 |
| Dedup com lista (seen)  | O(n²)       | O(n)   | 🔴    | L12-L16|
| Cópia desnecessária     | O(n)        | O(n)   | 🟡    | L28-L33|

🔴 Gargalos Críticos:
- Loops aninhados O(n² × m): Com 10.000 processos e 768 features (BERT),
  isso equivale a 10.000² × 768 = 76,8 BILHÕES de operações. Inviável.
- `if item['id'] not in seen` onde `seen` é lista: O(n) por lookup,
  tornando a deduplicação O(n²). Usar `set` resolve para O(1) amortizado.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    🔁 DUPLICIDADE & AMBIGUIDADE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ID-DUP-001] 🟠 MAJOR — Cópia de Dict Duplicada
  Localização: L22-L26 e L28-L33
  Descrição: Dois blocos copiam dicts via loop de chaves. L28-L33 é
             uma cópia literal de L22-L26 sem transformação adicional.
             A cópia L28-L33 é completamente redundante.

[ID-AMB-001] 🔴 BLOCKER — Nomes Sem Intenção
  - `process` → não revela o que faz. Sugestão: `ranquear_processos_similares`
  - `data` → nome genérico. Sugestão: `registros_processuais`
  - `x` → parâmetro completamente opaco. Sugestão: `vetor_pesos`
  - `n`, `n2` → variáveis temporárias sem semântica

[ID-AMB-002] 🟡 MINOR — Import não utilizado
  Localização: L1 — `import pandas as pd` nunca é usado no código
```

---

## CÓDIGO DEPOIS (Refatorado)

```python
"""
Módulo de ranqueamento de processos similares por score de similaridade.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field

import numpy as np

logger = logging.getLogger(__name__)

# Constante nomeada em vez de magic number embutido no código
SCORE_MIN_NORMALIZACAO = 0.0


@dataclass(frozen=True)
class ProcessoRanqueado:
    """Representa um processo com seu score de similaridade normalizado."""
    id: str
    id_similar: str
    score_normalizado: float


def calcular_score_similaridade(
    features_processo: list[float],
    vetor_pesos: list[float],
) -> float:
    """
    Calcula o score de similaridade via produto escalar.

    Complexidade: O(m) onde m = número de features.
    Prefere numpy para vetorização.
    """
    return float(np.dot(features_processo, vetor_pesos))


def encontrar_pares_por_classe(
    registros: list[dict],
    vetor_pesos: list[float],
) -> list[dict]:
    """
    Encontra todos os pares de processos da mesma classe e calcula scores.

    Complexidade: O(n²) no pior caso — documentado e esperado para este
    algoritmo de comparação par-a-par. Para n > 10.000, considere
    aproximações via FAISS ou similaridade por clusters.

    Args:
        registros: Lista de dicts com chaves 'id', 'class', 'features'.
        vetor_pesos: Vetor de pesos para o produto escalar.

    Returns:
        Lista de pares com scores calculados.
    """
    if not registros:
        raise ValueError("registros não pode ser vazio")
    if not vetor_pesos:
        raise ValueError("vetor_pesos não pode ser vazio")

    pares: list[dict] = []
    for i, registro_a in enumerate(registros):
        for j, registro_b in enumerate(registros):
            if i != j and registro_a["class"] == registro_b["class"]:
                score = calcular_score_similaridade(
                    registro_a["features"], vetor_pesos
                )
                pares.append({
                    "id": registro_a["id"],
                    "score": score,
                    "id_similar": registro_b["id"],
                })
    return pares


def deduplicate_por_id(pares: list[dict]) -> list[dict]:
    """
    Remove duplicatas mantendo o primeiro par por ID.

    Complexidade: O(n) — usa set para lookup O(1).
    """
    vistos: set[str] = set()
    unicos: list[dict] = []
    for par in pares:
        if par["id"] not in vistos:
            vistos.add(par["id"])
            unicos.append(par)
    return unicos


def normalizar_scores(pares: list[dict]) -> list[ProcessoRanqueado]:
    """
    Normaliza scores para o intervalo [0, 1] via min-max scaling.

    Complexidade: O(n).
    """
    if not pares:
        return []

    scores = [p["score"] for p in pares]
    score_max = max(scores)
    score_min = min(scores)
    amplitude = score_max - score_min

    return [
        ProcessoRanqueado(
            id=par["id"],
            id_similar=par["id_similar"],
            score_normalizado=(
                (par["score"] - score_min) / amplitude
                if amplitude > 0
                else SCORE_MIN_NORMALIZACAO
            ),
        )
        for par in pares
    ]


def ranquear_processos_similares(
    registros_processuais: list[dict],
    vetor_pesos: list[float],
) -> list[ProcessoRanqueado]:
    """
    Pipeline completo: calcula, deduplica e normaliza scores de similaridade.

    Args:
        registros_processuais: Processos com id, class e features.
        vetor_pesos: Pesos para cálculo do score de similaridade.

    Returns:
        Lista de ProcessoRanqueado ordenada por score decrescente.
    """
    logger.info(
        "Iniciando ranqueamento para %d registros com %d pesos.",
        len(registros_processuais),
        len(vetor_pesos),
    )

    pares = encontrar_pares_por_classe(registros_processuais, vetor_pesos)
    pares_unicos = deduplicate_por_id(pares)
    ranqueados = normalizar_scores(pares_unicos)

    resultado = sorted(ranqueados, key=lambda r: r.score_normalizado, reverse=True)

    logger.info("Ranqueamento concluído. %d pares únicos encontrados.", len(resultado))
    return resultado
```

---

## Comparação de Complexidade

| Métrica                    | Antes                  | Depois               |
|----------------------------|------------------------|----------------------|
| Complexidade Ciclomática   | 8                      | ≤ 4 por função       |
| Lookup de deduplicação     | O(n²) — lista          | O(n) — set           |
| Cópia redundante           | Sim (2x)               | Eliminada            |
| Testabilidade              | 0% — função monolítica | Alta — 5 funções independentes |
| Type hints                 | Ausentes               | Completos            |
| Nomes expressivos          | Não                    | Sim                  |
| Logging                    | Ausente                | Entrada e saída logadas |
| Dataclass tipada           | Não (dict raw)         | Sim (ProcessoRanqueado) |
| Docstrings                 | Ausentes               | Presentes com Big O documentado |
