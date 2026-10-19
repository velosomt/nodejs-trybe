# 8.3 - SQL Injection

> Seção 8 - Protegendo APIs: Segurança em Node.js · Lição 3 de 12

A **SQL Injection** é uma das vulnerabilidades mais comuns e perigosas em aplicações que interagem com bancos de dados. Trata-se de um ataque onde entradas maliciosas são enviadas para manipular ou executar comandos SQL não previstos, permitindo acesso, modificação ou até exclusão de dados.

## O que é SQL Injection?

A SQL Injection ocorre quando entradas do usuário são concatenadas diretamente em consultas SQL, sem validação ou sanitização. Isso pode permitir que atacantes injetem comandos maliciosos no banco de dados.

**Exemplo de ataque:**

Considere uma consulta que busca usuários no banco:

```sql
SELECT * FROM users WHERE username = '' AND password = '';
```

Se o atacante inserir o seguinte no campo `username`:

```sql
' OR 1=1 --
```

O SQL resultante será:

```sql
SELECT * FROM users WHERE username = '' OR 1=1 -- ' AND password = '';
```

-   O `OR 1=1` sempre avalia como TRUE, permitindo o acesso indevido.
-   O `--` comenta o restante da consulta, ignorando a verificação de senha.

## Riscos da SQL Injection

1.  **Exfiltração de Dados Sensíveis**: Atacantes podem consultar tabelas inteiras, incluindo informações confidenciais como senhas, e-mails e dados financeiros.
    
2.  **Modificação ou Exclusão de Dados**: Com comandos como `UPDATE` ou `DELETE`, um invasor pode modificar ou apagar registros.
    
3.  **Execução Remota de Comandos**: Em casos graves, SQL Injection pode levar à execução de comandos no servidor subjacente, comprometendo todo o sistema.
    
4.  **Escalada de Privilégios**: Se a aplicação utiliza credenciais privilegiadas para conectar ao banco, o invasor pode comprometer o banco de dados inteiro.
    

## Como Prevenir SQL Injection

### 1\. Use *Prepared Statements*

Esse é o padrão que já utilizamos no projeto **Cookmaster**. *Prepared Statements* separam os dados da lógica SQL, protegendo contra injeções.

```javascript
const update = async (id, recipe) => {
  const { title, ingredients, preparation } = recipe;
  const [result] = await conn.execute(
    'UPDATE recipes SET title = ?, ingredients = ?, preparation = ? WHERE id = ?;',
    [title, ingredients, preparation, id],
  );

  return result.affectedRows;
};
```

**Por que funciona?**

Os valores passados nos placeholders (?) são escapados pela biblioteca antes da execução, bloqueando códigos maliciosos.

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   Com `cds.ql` (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) os valores são sempre enviados como parâmetros. O risco só volta se você montar SQL com concatenação em `cds.run(...)`. Autorização com `@restrict`/`where` também ajuda a limitar o que cada usuário enxerga.

</details>

### 2\. Valide e Sanitize Entradas

Garantir que as entradas do usuário sejam validadas e sanitizadas antes de serem usadas em consultas SQL é essencial para evitar SQL Injection.

No Cookmaster, utilizamos o `Joi` para validação:

```javascript
const Joi = require('joi');

const recipeCreateSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  ingredients: Joi.string().min(10).max(150).required(),
  preparation: Joi.string().min(10).required(),
  userId: Joi.number().integer().required(),
  categoryIds: Joi.array().items(Joi.number()).min(1).required(),
});

const validateCreateRecipe = (req, res, next) => {
  const { error } = recipeCreateSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      error: 'Validation Error',
      details: error.details.map((err) => err.message),
    });
  }

  return next();
};
```

### 3\. Minimize Privilégios no Banco de Dados

A conta usada pela aplicação para acessar o banco de dados deve ter apenas os privilégios necessários.

**Boas práticas**:

-   **Evite permissões administrativas**: Não conceda `GRANT ALL`(todos os privilégios) ao usuário da aplicação.
-   **Divida permissões por operação**: Use uma conta para leitura e outra para escrita.

### Resumo das Boas Práticas

-   Use ***Prepared Statements*** para todas as consultas SQL.
-   **Valide entradas** com ferramentas como `Joi` para garantir a conformidade dos dados.
-   **Sanitize dados** para remover caracteres perigosos antes do uso.
-   **Restringa privilégios** no banco para minimizar o impacto de possíveis brechas.
