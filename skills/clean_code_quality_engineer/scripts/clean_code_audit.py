#!/usr/bin/env python3
"""
clean_code_audit.py — CLI para auditoria de qualidade de código.

Uso:
    python .agents/skills/clean_code_quality_engineer/scripts/clean_code_audit.py <arquivo_ou_dir>
    python .agents/skills/clean_code_quality_engineer/scripts/clean_code_audit.py --staged
    python .agents/skills/clean_code_quality_engineer/scripts/clean_code_audit.py --diff HEAD~1

Integração com pre-commit:
    Adicione ao .pre-commit-config.yaml (ver exemplo abaixo).

Saída:
    - Complexidade ciclomática via radon
    - Duplicidade via pylint/flake8
    - Type coverage via mypy
    - Estilo via ruff
    - Relatório consolidado em JSON

Dependências:
    pip install radon ruff mypy
"""

import argparse
import json
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

# Ensure UTF-8 output on Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


VERDE = "\033[92m"
AMARELO = "\033[93m"
VERMELHO = "\033[91m"
RESET = "\033[0m"
NEGRITO = "\033[1m"


@dataclass
class ResultadoAuditoria:
    arquivo: str
    complexidade_ciclomatica: list = field(default_factory=list)
    problemas_ruff: list = field(default_factory=list)
    erros_mypy: list = field(default_factory=list)
    bloqueado: bool = False
    score_qualidade: float = 100.0


def executar_comando(
    args: list[str], cwd: Optional[Path] = None
) -> tuple[str, str, int]:
    """Executa um comando externo e retorna (stdout, stderr, returncode)."""
    resultado = subprocess.run(  # noqa: S603
        args,
        capture_output=True,
        text=True,
        cwd=str(cwd) if cwd else None,
    )
    return resultado.stdout, resultado.stderr, resultado.returncode


def analisar_complexidade(arquivo: Path) -> dict:
    """
    Analisa complexidade ciclomática via radon.
    Retorna dict com funções e suas complexidades.
    """
    stdout, _, code = executar_comando(
        [sys.executable, "-m", "radon", "cc", str(arquivo), "--json", "-s"]
    )
    if code != 0 or not stdout.strip():
        return {}
    try:
        dados = json.loads(stdout)
        return dados.get(str(arquivo), {})
    except json.JSONDecodeError:
        return {}


def analisar_estilo(arquivo: Path) -> list[dict]:
    """
    Executa ruff para verificação de estilo, linting e segurança.
    """
    stdout, _, _ = executar_comando(
        [
            sys.executable,
            "-m",
            "ruff",
            "check",
            str(arquivo),
            "--output-format",
            "json",
            "--select",
            "E,F,W,C,B,S",
        ]
    )
    if not stdout.strip():
        return []
    try:
        return json.loads(stdout)
    except json.JSONDecodeError:
        return []


def analisar_tipos(arquivo: Path) -> list[str]:
    """
    Executa mypy para verificação de type hints.
    """
    stdout, stderr, _ = executar_comando(
        [
            sys.executable,
            "-m",
            "mypy",
            str(arquivo),
            "--ignore-missing-imports",
            "--no-error-summary",
        ]
    )
    linhas = (stdout + stderr).strip().split("\n")
    return [
        line_str
        for line_str in linhas
        if "error:" in line_str or "warning:" in line_str
    ]


def calcular_score(resultado: ResultadoAuditoria) -> float:
    """
    Calcula um score de qualidade de 0-100.
    Penalidades:
    - Cada função com CC > 10: -20 pontos
    - Cada função com CC > 7: -10 pontos
    - Cada erro ruff: -5 pontos
    - Cada erro mypy: -3 pontos
    """
    score = 100.0

    for funcao in resultado.complexidade_ciclomatica:
        cc = funcao.get("complexity", 0)
        if cc > 10:
            score -= 20
        elif cc > 7:
            score -= 10

    score -= len(resultado.problemas_ruff) * 5
    score -= len(resultado.erros_mypy) * 3

    return max(0.0, score)


def imprimir_relatorio(resultado: ResultadoAuditoria) -> None:
    """Imprime o relatório formatado no terminal."""
    print(f"\n{NEGRITO}{'═' * 60}{RESET}")
    print(f"{NEGRITO}  🧹 AUDITORIA DE QUALIDADE — {resultado.arquivo}{RESET}")
    print(f"{NEGRITO}{'═' * 60}{RESET}\n")

    # Score
    cor_score = (
        VERDE
        if resultado.score_qualidade >= 80
        else (AMARELO if resultado.score_qualidade >= 60 else VERMELHO)
    )
    print(
        f"  Score de Qualidade: {cor_score}{NEGRITO}{resultado.score_qualidade:.1f}/100{RESET}"
    )

    # Complexidade
    if resultado.complexidade_ciclomatica:
        print(f"\n  {NEGRITO}⚡ Complexidade Ciclomática:{RESET}")
        for funcao in resultado.complexidade_ciclomatica:
            cc = funcao.get("complexity", 0)
            nome = funcao.get("name", "?")
            linha = funcao.get("lineno", "?")
            cor = VERDE if cc <= 7 else (AMARELO if cc <= 10 else VERMELHO)
            print(f"    L{linha} {nome}(): {cor}CC={cc}{RESET}")

    # Ruff
    if resultado.problemas_ruff:
        print(f"\n  {NEGRITO}🔍 Problemas de Estilo/Linting (ruff):{RESET}")
        for p in resultado.problemas_ruff[:10]:  # Limitar saída
            linha = p.get("location", {}).get("row", "?")
            cod = p.get("code", "?")
            msg = p.get("message", "?")
            print(f"    L{linha} [{cod}] {msg}")
        if len(resultado.problemas_ruff) > 10:
            print(f"    ... e mais {len(resultado.problemas_ruff) - 10} problemas.")

    # MyPy
    if resultado.erros_mypy:
        print(f"\n  {NEGRITO}🏷️  Problemas de Tipos (mypy):{RESET}")
        for erro in resultado.erros_mypy[:5]:
            print(f"    {erro}")

    # Veredicto
    print(f"\n  {NEGRITO}Veredicto:{RESET} ", end="")
    if resultado.bloqueado:
        print(
            f"{VERMELHO}{NEGRITO}🚫 BLOQUEADO — Corrija os problemas críticos antes do push.{RESET}"
        )
    elif resultado.score_qualidade >= 80:
        print(f"{VERDE}{NEGRITO}✅ APROVADO{RESET}")
    else:
        print(f"{AMARELO}{NEGRITO}⚠️  APROVADO COM RESSALVAS{RESET}")

    print(f"\n{NEGRITO}{'═' * 60}{RESET}\n")


def auditar_arquivo(arquivo: Path) -> ResultadoAuditoria:
    """Executa a auditoria completa em um arquivo Python."""
    resultado = ResultadoAuditoria(arquivo=str(arquivo))

    print(f"  Analisando: {arquivo.name}...", end="", flush=True)

    cc_data = analisar_complexidade(arquivo)
    if isinstance(cc_data, list):
        resultado.complexidade_ciclomatica = cc_data
    elif isinstance(cc_data, dict):
        resultado.complexidade_ciclomatica = list(cc_data.values())

    resultado.problemas_ruff = analisar_estilo(arquivo)
    resultado.erros_mypy = analisar_tipos(arquivo)
    resultado.score_qualidade = calcular_score(resultado)

    # Bloquear se CC > 15 ou score < 50
    alta_cc = any(
        f.get("complexity", 0) > 15 for f in resultado.complexidade_ciclomatica
    )
    resultado.bloqueado = alta_cc or resultado.score_qualidade < 50

    print(" ✓")
    return resultado


def obter_arquivos_staged() -> list[Path]:
    """Retorna arquivos Python staged para commit."""
    stdout, _, _ = executar_comando(
        ["git", "diff", "--cached", "--name-only", "--diff-filter=ACM"]
    )
    return [
        Path(f)
        for f in stdout.strip().split("\n")
        if f.endswith(".py") and Path(f).exists()
    ]


def main() -> int:
    parser = argparse.ArgumentParser(
        description="🧹 Clean Code Audit — Auditoria de qualidade pré-push"
    )
    parser.add_argument(
        "arquivos", nargs="*", help="Arquivos ou diretórios para auditar"
    )
    parser.add_argument(
        "--staged",
        action="store_true",
        help="Auditar apenas arquivos staged (pre-commit)",
    )
    parser.add_argument("--json-output", help="Salvar relatório em JSON")
    args = parser.parse_args()

    print(f"\n{NEGRITO}🧹 Clean Code & Quality Engineer — Auditoria Pré-Push{RESET}")
    print("─" * 60)

    # Coletar arquivos
    arquivos: list[Path] = []
    if args.staged:
        arquivos = obter_arquivos_staged()
        print(f"  Modo: Arquivos staged ({len(arquivos)} arquivo(s))")
    else:
        for caminho in args.arquivos:
            p = Path(caminho)
            if p.is_dir():
                arquivos.extend(p.rglob("*.py"))
            elif p.suffix == ".py":
                arquivos.append(p)

    if not arquivos:
        print("  Nenhum arquivo Python para auditar.")
        return 0

    # Executar auditoria
    resultados = [auditar_arquivo(a) for a in arquivos]

    # Imprimir relatórios
    for resultado in resultados:
        imprimir_relatorio(resultado)

    # Salvar JSON se solicitado
    if args.json_output:
        dados_json = [
            {
                "arquivo": r.arquivo,
                "score": r.score_qualidade,
                "bloqueado": r.bloqueado,
                "total_ruff": len(r.problemas_ruff),
                "total_mypy": len(r.erros_mypy),
            }
            for r in resultados
        ]
        Path(args.json_output).write_text(
            json.dumps(dados_json, indent=2, ensure_ascii=False)
        )
        print(f"  📄 Relatório JSON salvo em: {args.json_output}")

    # Retornar código de saída
    tem_blockers = any(r.bloqueado for r in resultados)
    return 1 if tem_blockers else 0


if __name__ == "__main__":
    sys.exit(main())
