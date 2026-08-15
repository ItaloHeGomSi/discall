# 📚 Big O Cheatsheet — Referência Rápida de Complexidade

## Tabela de Complexidades

| Notação      | Nome            | Exemplo Típico                         | n=1.000     | n=1.000.000    |
|--------------|-----------------|----------------------------------------|-------------|----------------|
| O(1)         | Constante       | Acesso a dicionário/hashmap            | 1 op        | 1 op           |
| O(log n)     | Logarítmica     | Busca binária, árvore balanceada       | ~10 ops     | ~20 ops        |
| O(n)         | Linear          | Iteração simples sobre lista           | 1.000 ops   | 1.000.000 ops  |
| O(n log n)   | Linearítmica    | Merge sort, Heap sort, Timsort         | ~10.000 ops | ~20.000.000    |
| O(n²)        | Quadrática      | Loops aninhados, Bubble Sort           | 1.000.000   | 10¹²           |
| O(n³)        | Cúbica          | 3 loops aninhados, Floyd-Warshall      | 10⁹         | 10¹⁸           |
| O(2^n)       | Exponencial     | Subconjuntos, força bruta combinatória | Inviável    | Inviável       |
| O(n!)        | Fatorial        | Permutações, TSP força bruta           | Inviável    | Inviável       |

---

## Padrões de Código → Complexidade

### Loops

```python
# O(n) — linear
for item in lista:
    processar(item)

# O(n²) — quadrático (RED FLAG)
for i in lista:
    for j in lista:
        comparar(i, j)

# O(n²) oculto — consulta dentro de loop (RED FLAG)
for registro in registros:
    if registro in outra_lista:  # "in" em lista é O(n)!
        processar(registro)      # Total: O(n²)

# O(n) — correto com set O(1) lookup
conjunto = set(outra_lista)      # O(n) uma vez
for registro in registros:
    if registro in conjunto:     # O(1)
        processar(registro)      # Total: O(n)
```

### Operações com Pandas / NumPy

```python
# O(n²) — apply com operação que itera internamente (RED FLAG)
df["resultado"] = df["coluna"].apply(lambda x: df[df["id"] == x].sum())

# O(n) — merge vetorizado
df = df.merge(lookup_df, on="id", how="left")

# O(n²) oculto — concatenação em loop (RED FLAG)
resultado = pd.DataFrame()
for chunk in chunks:
    resultado = pd.concat([resultado, chunk])  # Recria o df a cada iteração

# O(n) — correto
resultado = pd.concat(chunks)  # Uma única operação
```

### Strings

```python
# O(n²) — concatenação em loop com strings imutáveis (RED FLAG)
resultado = ""
for item in lista:
    resultado += str(item)

# O(n) — correto com join
resultado = "".join(str(item) for item in lista)
```

### Banco de Dados / IO

```python
# N+1 Problem — O(n) queries (CRÍTICO em produção)
for processo in processos:
    classe = db.query(f"SELECT * FROM classes WHERE id={processo.classe_id}")

# O(1) queries — correto com JOIN ou batch load
classes = {c.id: c for c in db.query("SELECT * FROM classes WHERE id IN (...)")}
for processo in processos:
    classe = classes.get(processo.classe_id)
```

---

## Heurísticas de Detecção Rápida

| Sinal no Código                         | Suspeita de Complexidade |
|-----------------------------------------|--------------------------|
| Loop dentro de loop sobre mesma coleção | O(n²)                    |
| `.append()` ou concatenação em loop     | Pode ser O(n²) em strings|
| DB/HTTP call dentro de for loop         | N+1, O(n) I/O            |
| `list.index()` ou `in list` em loop     | O(n²)                    |
| `pd.concat` em loop                     | O(n²) em memória         |
| Recursão sem memoização                 | Pode ser O(2^n)          |
| Sort repetido dentro de loop            | O(n² log n)              |
| DataFrame.iterrows() com operação       | Geralmente ineficiente   |

---

## Regra do Polegar para Limites Práticos

- **n < 10.000** → O(n²) pode ser aceitável dependendo do contexto
- **n < 1.000** → Quase qualquer algoritmo funciona
- **n > 100.000** → Exige O(n log n) ou melhor
- **n > 10.000.000** → Exige O(n) ou O(log n)
