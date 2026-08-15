# 🛡️ Padrões de QA — Testabilidade e Anti-Patterns

## Anti-Patterns de Testabilidade

### 1. God Object / God Function
**Problema:** Um único objeto ou função que sabe/faz tudo.
**Sintoma:** Classe com 20+ métodos ou função com 100+ linhas.
**Impacto:** Impossível de testar sem instanciar o mundo inteiro.
**Solução:** Decomposição por SRP. Extração em colaboradores com interfaces.

### 2. Dependência Direta de Implementação Concreta
**Problema:** Código cria instâncias de dependências internamente (`db = MySQLConnector()`).
**Sintoma:** `new` ou construtor chamado dentro de método de negócio.
**Impacto:** Impossível substituir por mock/stub em testes.
**Solução:** Injeção de Dependência (DI) — receber a dependência via construtor ou parâmetro.

```python
# Ruim — untestable
class ProcessoService:
    def __init__(self):
        self.db = PostgresDB(host="prod-server")  # hard-coded!

# Bom — testable
class ProcessoService:
    def __init__(self, db: DatabaseProtocol):
        self.db = db

# Em teste:
service = ProcessoService(db=MockDatabase())
```

### 3. Efeito Colateral em Construtor
**Problema:** `__init__` abre conexões, lê arquivos ou chama APIs.
**Sintoma:** Instanciar a classe em teste já causa IO.
**Solução:** Lazy initialization ou fábrica (factory method).

### 4. Singleton Global com Estado Mutável
**Problema:** Estado global que persiste entre testes.
**Sintoma:** Testes passam individualmente mas falham quando executados juntos.
**Solução:** Injetar o singleton como dependência; usar fixtures de setup/teardown.

### 5. Lógica Escondida em Callback / Lambda Anônimo
**Problema:** Lógica de negócio dentro de lambda não nomeado.
**Sintoma:** `df.apply(lambda x: x["campo_a"] * 0.15 if x["tipo"] == "B" else ...)`.
**Solução:** Extrair para função nomeada e testável separadamente.

### 6. Ausência de Guard Clauses (Validação de Entrada)
**Problema:** Função não valida seus parâmetros antes de processar.
**Sintoma:** Exceções vagas em linhas de processamento, não na entrada.
**Impacto:** Difícil rastrear a origem de dados inválidos.

```python
# Ruim
def calcular_score(registros, peso):
    return sum(r["valor"] * peso for r in registros)  # explode se lista vazia ou None

# Bom
def calcular_score(registros: list[dict], peso: float) -> float:
    if not registros:
        raise ValueError("registros não pode ser vazio")
    if peso <= 0:
        raise ValueError(f"peso deve ser positivo, recebido: {peso}")
    return sum(r["valor"] * peso for r in registros)
```

---

## Padrões de Resiliência

### Graceful Degradation
```python
# Sem graceful degradation (falha total)
def obter_configuracao_remota():
    return requests.get(CONFIG_URL).json()  # timeout? falha na rede? crash total.

# Com graceful degradation
DEFAULT_CONFIG = {"timeout": 30, "max_retries": 3}

def obter_configuracao_remota(fallback: dict = DEFAULT_CONFIG) -> dict:
    try:
        response = requests.get(CONFIG_URL, timeout=5)
        response.raise_for_status()
        return response.json()
    except (requests.Timeout, requests.ConnectionError) as e:
        logger.warning("Config remota indisponível, usando fallback. Erro: %s", e)
        return fallback
    except requests.HTTPError as e:
        logger.error("Erro HTTP ao buscar config: %s", e)
        return fallback
```

### Retry com Backoff Exponencial
```python
import time
from functools import wraps

def retry(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            attempt = 0
            current_delay = delay
            while attempt < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempt += 1
                    if attempt == max_attempts:
                        raise
                    logger.warning("Tentativa %d/%d falhou: %s", attempt, max_attempts, e)
                    time.sleep(current_delay)
                    current_delay *= backoff
        return wrapper
    return decorator
```

---

## Pirâmide de Testes — Guia de Cobertura

```
         /\
        /E2E\          ← 10% dos testes (lentos, caros, frágeis)
       /------\
      /  Integ. \      ← 20% dos testes (APIs, DB, integrações)
     /------------\
    /   Unitários   \  ← 70% dos testes (rápidos, isolados, confiáveis)
   /________________\
```

### Cenários Mínimos por Função
Para cada função com lógica de negócio, testar:
1. **Happy path** — entrada válida, comportamento esperado
2. **Edge case** — limites: lista vazia, string vazia, zero, None
3. **Entrada inválida** — tipo errado, valor fora do range
4. **Caminho de falha** — exceção levantada e propagada corretamente

### Métricas de Cobertura Recomendadas
| Camada          | Cobertura Mínima |
|-----------------|------------------|
| Lógica de Negócio | 90%            |
| Adaptadores/IO  | 70%              |
| Controllers/Views | 60%            |
| Utilitários     | 80%              |

---

## Checklist de Requisitos Não Funcionais

| Item | Verificação |
|------|-------------|
| SLA/SLO | Função/endpoint tem tempo de resposta medido e dentro do target? |
| Timeout | Toda chamada externa (HTTP, DB, cache) tem timeout configurado? |
| Rate Limiting | Endpoints públicos têm proteção contra abuso? |
| Logging | Logs têm nível correto (DEBUG/INFO/WARNING/ERROR)? Sem dados sensíveis? |
| Observabilidade | Métricas de negócio emitidas para rastreamento (Prometheus, Datadog)? |
| Segurança | Entrada do usuário sanitizada? SQL parametrizado? Sem secrets no código? |
| Acessibilidade | Interface UI segue WCAG 2.1 AA? |
| i18n | Strings de usuário externalizadas e traduzíveis? |
