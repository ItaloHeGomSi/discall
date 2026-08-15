# ✅ Clean Code Checklist — Auditoria Detalhada por Categoria

## 1. Nomenclatura e Legibilidade

| Item | Critério | Severidade |
|------|----------|------------|
| N-01 | Variáveis têm nomes que revelam intenção (não `x`, `tmp`, `data`) | MAJOR |
| N-02 | Funções são verbos ou frases verbais que descrevem a ação | MAJOR |
| N-03 | Classes são substantivos que representam conceitos do domínio | MAJOR |
| N-04 | Booleanos têm prefixo `is_`, `has_`, `pode_`, `deve_` | MINOR |
| N-05 | Constantes são UPPER_SNAKE_CASE com valor semântico claro | MINOR |
| N-06 | Não há abreviações crípticas (ex: `proc`, `mgr`, `calc`) | MINOR |
| N-07 | Nomes de parâmetros são auto-explicativos sem olhar a docstring | MAJOR |
| N-08 | Ausência de nomes enganosos (ex: `lista_de_contas` que retorna um dict) | BLOCKER |

---

## 2. Funções e Métodos

| Item | Critério | Severidade |
|------|----------|------------|
| F-01 | Função faz UMA coisa (SRP aplicado ao nível de função) | BLOCKER |
| F-02 | Função tem ≤ 20 linhas (excluindo docstring e comentários) | MAJOR |
| F-03 | Função tem ≤ 3 parâmetros. Se mais, usar objeto de configuração | MAJOR |
| F-04 | Parâmetros booleanos não são usados como flags de fluxo | MAJOR |
| F-05 | Sem efeitos colaterais inesperados (side effects ocultos) | BLOCKER |
| F-06 | Nível de aninhamento (indentação) ≤ 3 | MAJOR |
| F-07 | Sem código morto (funções não chamadas, blocos nunca atingidos) | MINOR |
| F-08 | Sem `return` múltiplo excessivo que confunde o fluxo | MINOR |
| F-09 | Guard clauses usadas para reduzir aninhamento | INFO |
| F-10 | Complexidade ciclomática ≤ 7 por função | MAJOR |

---

## 3. Comentários

| Item | Critério | Severidade |
|------|----------|------------|
| C-01 | Sem comentários que explicam "o quê" (o código deve ser autoexplicativo) | MINOR |
| C-02 | Comentários explicam "por quê" quando necessário (decisão de negócio, workaround) | INFO |
| C-03 | Sem código comentado no repositório (use git para isso) | MAJOR |
| C-04 | TODOs têm autor, data e ticket de rastreamento | INFO |
| C-05 | Docstrings presentes em módulos, classes e funções públicas | MINOR |

---

## 4. Estrutura e Organização

| Item | Critério | Severidade |
|------|----------|------------|
| E-01 | Imports organizados: stdlib → third-party → local, separados por linha em branco | MINOR |
| E-02 | Sem imports circulares | BLOCKER |
| E-03 | Arquivos têm responsabilidade única (não mixam modelos + rotas + lógica) | MAJOR |
| E-04 | Constantes e configurações centralizadas (não espalhadas) | MAJOR |
| E-05 | Sem magic numbers/strings — usar constantes nomeadas | MAJOR |
| E-06 | Máximo de 500 linhas por arquivo (se maior, refatorar em módulos) | MAJOR |

---

## 5. Tratamento de Erros

| Item | Critério | Severidade |
|------|----------|------------|
| ER-01 | Sem `except:` ou `except Exception:` genérico e silencioso | BLOCKER |
| ER-02 | Exceções específicas capturadas com tratamento real | MAJOR |
| ER-03 | Erros de usuário vs. erros de sistema tratados diferentemente | MAJOR |
| ER-04 | Sem swallow de exceções (captura e ignora silenciosamente) | BLOCKER |
| ER-05 | Logging de exceções com contexto suficiente para diagnóstico | MAJOR |
| ER-06 | Graceful degradation em integrações externas (fallback, retry, circuit breaker) | MAJOR |
| ER-07 | Timeouts configurados em todas as chamadas HTTP, DB e cache | MAJOR |

---

## 6. Princípios SOLID

| Item | Princípio | Critério | Severidade |
|------|-----------|----------|------------|
| S-01 | SRP | Cada classe/módulo tem UMA razão para mudar | BLOCKER |
| S-02 | OCP | Comportamento extensível via herança/composição sem alterar código existente | MAJOR |
| S-03 | LSP | Subclasses não quebram o contrato da classe base | BLOCKER |
| S-04 | ISP | Interfaces são pequenas e específicas, não genéricas e gordas | MAJOR |
| S-05 | DIP | Dependências apontam para abstrações (interfaces/ABCs), não implementações | MAJOR |

---

## 7. DRY e KISS

| Item | Critério | Severidade |
|------|----------|------------|
| DRY-01 | Sem lógica duplicada — mesma regra implementada em dois lugares | MAJOR |
| DRY-02 | Sem data duplicada — mesma constante declarada em múltiplos arquivos | MAJOR |
| KISS-01 | Sem abstrações prematuras — não criar interfaces para código que nunca vai variar | INFO |
| KISS-02 | Solução mais simples que resolve o problema atual (YAGNI) | INFO |
| KISS-03 | Sem over-engineering — padrões de design usados onde agregam valor real | MINOR |

---

## 8. Python-Específico

| Item | Critério | Severidade |
|------|----------|------------|
| PY-01 | Type hints em todas as funções públicas | MINOR |
| PY-02 | Sem mutáveis como default de parâmetro (`def f(lista=[])`) | BLOCKER |
| PY-03 | f-strings preferidas sobre `.format()` e `%` | INFO |
| PY-04 | Context managers (`with`) para recursos (arquivos, conexões, locks) | MAJOR |
| PY-05 | List/dict comprehensions preferidas sobre loops quando mais legíveis | INFO |
| PY-06 | `dataclasses` ou `Pydantic` para objetos de dados, não dicts raw | MINOR |
| PY-07 | `pathlib.Path` preferido sobre `os.path` | INFO |
| PY-08 | Sem comparação com `== True/False/None` (use `is None`, `is True`) | MINOR |
| PY-09 | Sem `global` ou `nonlocal` desnecessário | MAJOR |
| PY-10 | Ruff/Black/isort configurado e executado no pre-commit | MINOR |
