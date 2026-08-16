# 📊 Template de Saída — Relatório de Auditoria de Qualidade

Use este template como base para todo relatório gerado pela skill
clean_code_quality_engineer.

```
╔══════════════════════════════════════════════════════════════════╗
║         🧹 RELATÓRIO DE QUALIDADE — Clean Code & QE Audit       ║
╚══════════════════════════════════════════════════════════════════╝

📁 Arquivo/Módulo Analisado: [nome]
🔢 Linhas Analisadas: [N]
⚙️  Linguagem/Framework: [linguagem]
📅 Data da Auditoria: [data]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    📊 RESUMO EXECUTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 Blockers:  [N]   🟠 Majors: [N]   🟡 Minors: [N]   🔵 Infos: [N]
Débito Técnico Estimado: [X horas]
Complexidade Ciclomática Média: [N]
Cobertura de Testes Recomendada: [X%]

Veredicto: [✅ APROVADO | ⚠️ APROVADO COM RESSALVAS | 🚫 BLOQUEADO]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  ⚡ ANÁLISE DE PERFORMANCE (Big O)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Função/Bloco        | Complexidade Tempo | Complexidade Espaço | Risco | Linha |
|---------------------|--------------------|---------------------|-------|-------|
| [nome_funcao()]     | O(n²)              | O(n)                | 🔴    | L42   |
| [outra_funcao()]    | O(n log n)         | O(1)                | 🟢    | L87   |

🔴 Gargalos Críticos:
[descrição do gargalo + impacto estimado em produção com n realista]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    🔁 DUPLICIDADE & AMBIGUIDADE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ID-DUP-001] 🟠 MAJOR — Duplicidade de Lógica
  Localização: L23–L35 e L67–L79
  Descrição: [lógica duplicada explicada claramente]
  Impacto: [risco de divergência de comportamento entre as cópias]

[ID-AMB-001] 🟡 MINOR — Nome Ambíguo
  Localização: L12 — variável `data`
  Sugestão: Renomear para `processo_payload` ou `registro_entrada`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                 🛡️ AUDITORIA CLEAN CODE & SOLID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ID-CC-001] 🔴 BLOCKER — Violação de SRP
  Princípio: Single Responsibility (SOLID)
  Localização: [classe/função] L10–L80
  Descrição: A função `processar_dados()` realiza validação, transformação,
             persistência e notificação. Isso viola SRP e torna o teste
             unitário inviável sem mocks excessivos.
  Impacto: Alta complexidade ciclomática, dificuldade de teste, risco de
           regressão em qualquer alteração.

[ID-CC-002] 🟡 MINOR — Complexidade Ciclomática Alta
  Localização: [função] L45
  CC Atual: 12 | CC Recomendada: ≤ 7
  Sugestão: Extrair os blocos condicionais em funções auxiliares nomeadas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              🧪 ALERTAS DE TESTABILIDADE & QA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ID-QA-001] 🟠 MAJOR — Efeito Colateral Oculto
  Localização: [função] L32
  Descrição: A função modifica o objeto passado como argumento (mutação
             in-place) sem que a assinatura ou docstring deixe isso claro.
  Impacto: Comportamento surpreendente, difícil de debugar.
  Sugestão: Retornar uma cópia modificada ou documentar explicitamente.

[ID-QA-002] 🟡 MINOR — Validação de Entrada Ausente
  Localização: L15 — parâmetro `registros`
  Edge Cases não tratados: lista vazia, None, tipos incorretos.
  Sugestão: Adicionar guard clause no início da função.

[ID-QA-003] 🔵 INFO — Logging Insuficiente
  Localização: Bloco de exceção L78
  Sugestão: Adicionar `logger.exception()` com contexto (ID do registro,
            tipo da operação) para facilitar diagnóstico em produção.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              🔧 SUGESTÕES DE REFATORAÇÃO (DIFF)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Um bloco diff por cada item BLOCKER e MAJOR]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              📋 CHECKLIST PRÉ-PUSH (Para o Desenvolvedor)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] Todos os BLOCKERs resolvidos
[ ] MAJORs revisados e aceitos ou resolvidos
[ ] Testes unitários escritos para funções refatoradas
[ ] Linter/formatter executado (ruff, black, eslint, etc.)
[ ] CHANGELOG ou comentário no PR atualizado
[ ] Self-review: "Esse código é legível por um dev júnior?"

╔══════════════════════════════════════════════════════════════════╗
║  Auditoria concluída. Bom código é código que envergonha você   ║
║  só na primeira vez. Na revisão, você já deveria estar orgulhoso.║
╚══════════════════════════════════════════════════════════════════╝
```
