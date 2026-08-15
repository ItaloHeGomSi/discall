# ⚗️ Exemplos SOLID — Violações e Correções

## S — Single Responsibility Principle (SRP)

### Violação

```python
class RelatorioProcessos:
    """Uma classe que faz tudo — viola SRP."""

    def buscar_processos_do_banco(self, filtro: dict) -> list:
        # Responsabilidade 1: Acesso a dados
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM processos WHERE ...", filtro)
        return cursor.fetchall()

    def calcular_estatisticas(self, processos: list) -> dict:
        # Responsabilidade 2: Lógica de negócio
        total = len(processos)
        por_classe = {}
        for p in processos:
            por_classe[p["classe"]] = por_classe.get(p["classe"], 0) + 1
        return {"total": total, "por_classe": por_classe}

    def formatar_para_pdf(self, estatisticas: dict) -> bytes:
        # Responsabilidade 3: Formatação/apresentação
        ...

    def enviar_email(self, destinatario: str, pdf: bytes) -> None:
        # Responsabilidade 4: Infraestrutura/comunicação
        smtp = smtplib.SMTP("mail.tjgo.jus.br")
        ...
```

### Correção

```python
# Responsabilidade 1: Acesso a dados
class ProcessoRepository:
    def __init__(self, db_connection):
        self._conn = db_connection

    def buscar(self, filtro: dict) -> list[dict]:
        ...

# Responsabilidade 2: Lógica de negócio
class ProcessoStatsCalculator:
    def calcular(self, processos: list[dict]) -> dict:
        ...

# Responsabilidade 3: Formatação
class RelatorioFormatter:
    def para_pdf(self, estatisticas: dict) -> bytes:
        ...

# Responsabilidade 4: Notificação
class NotificacaoService:
    def enviar_email(self, destinatario: str, anexo: bytes) -> None:
        ...

# Orquestrador que compõe as responsabilidades
class GerarRelatorioUseCase:
    def __init__(
        self,
        repo: ProcessoRepository,
        calculator: ProcessoStatsCalculator,
        formatter: RelatorioFormatter,
        notificacao: NotificacaoService,
    ):
        self._repo = repo
        self._calculator = calculator
        self._formatter = formatter
        self._notificacao = notificacao

    def executar(self, filtro: dict, destinatario: str) -> None:
        processos = self._repo.buscar(filtro)
        stats = self._calculator.calcular(processos)
        pdf = self._formatter.para_pdf(stats)
        self._notificacao.enviar_email(destinatario, pdf)
```

---

## D — Dependency Inversion Principle (DIP)

### Violação

```python
class PreditorClasse:
    def __init__(self):
        # Dependência direta de implementação concreta — não testável
        self.model = LongformerModel.from_pretrained("tjgo/modelo-prod")
        self.db = psycopg2.connect(DATABASE_URL)
```

### Correção

```python
from abc import ABC, abstractmethod

# Abstrações (interfaces)
class ModeloClassificadorProtocol(ABC):
    @abstractmethod
    def predizer(self, texto: str) -> dict: ...

class DatabaseProtocol(ABC):
    @abstractmethod
    def salvar_predicao(self, predicao: dict) -> None: ...

# Implementação de produção
class LongformerClassificador(ModeloClassificadorProtocol):
    def predizer(self, texto: str) -> dict:
        ...

# Dependência invertida — recebe abstrações, não concretos
class PreditorClasse:
    def __init__(
        self,
        modelo: ModeloClassificadorProtocol,
        db: DatabaseProtocol,
    ):
        self._modelo = modelo
        self._db = db

    def classificar(self, texto: str) -> dict:
        resultado = self._modelo.predizer(texto)
        self._db.salvar_predicao(resultado)
        return resultado
```

---

## O — Open/Closed Principle (OCP)

### Violação

```python
def calcular_desconto(tipo_processo: str, valor: float) -> float:
    if tipo_processo == "criminal":
        return valor * 0.0
    elif tipo_processo == "civel":
        return valor * 0.1
    elif tipo_processo == "trabalhista":
        return valor * 0.15
    # Cada novo tipo exige modificar esta função — viola OCP
```

### Correção

```python
from abc import ABC, abstractmethod

class EstrategiaDesconto(ABC):
    @abstractmethod
    def calcular(self, valor: float) -> float: ...

class DescontoCriminal(EstrategiaDesconto):
    def calcular(self, valor: float) -> float:
        return 0.0

class DescontoCivel(EstrategiaDesconto):
    def calcular(self, valor: float) -> float:
        return valor * 0.1

class DescontoTrabalhista(EstrategiaDesconto):
    def calcular(self, valor: float) -> float:
        return valor * 0.15

# Adicionar novo tipo = nova classe, sem modificar código existente
ESTRATEGIAS: dict[str, EstrategiaDesconto] = {
    "criminal": DescontoCriminal(),
    "civel": DescontoCivel(),
    "trabalhista": DescontoTrabalhista(),
}

def calcular_desconto(tipo_processo: str, valor: float) -> float:
    estrategia = ESTRATEGIAS.get(tipo_processo)
    if estrategia is None:
        raise ValueError(f"Tipo de processo desconhecido: {tipo_processo!r}")
    return estrategia.calcular(valor)
```
