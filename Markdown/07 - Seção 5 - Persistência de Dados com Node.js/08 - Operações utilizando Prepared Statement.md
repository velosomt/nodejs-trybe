# 5.8 - Operações utilizando Prepared Statement

> Seção 5 - Persistência de Dados com Node.js · Lição 8 de 16

Em algumas consultas, precisamos enviar informações adicionais para alterar a query que será executada. Um exemplo disso é buscar um registro específico pelo seu `id`. No entanto, se não utilizarmos práticas adequadas como o uso de *Prepared Statements*, a aplicação fica vulnerável a um tipo de ataque chamado `SQL Injection`.

> **⚠️ Atenção:** *SQL injection* é um tipo de ataque que insere comandos maliciosos no código SQL através de entradas que não tratam os dados de maneira adequada, permitindo que o invasor manipule a consulta e acesse ou modifique dados indevidamente.

## Entendendo o Conceito de Prepared Statements

Um *Prepared Statement* é uma forma de parametrizar consultas SQL, separando a lógica da consulta dos dados a serem passados. Ele define a estrutura da consulta e utiliza *placeholders* (`?`) para valores, o que evita que esses valores sejam interpretados como parte do código SQL. Isso é essencial para prevenir ataques de *SQL Injection*, pois os dados são tratados como dados puros, e não como comandos executáveis.

Além de aumentar a segurança, *Prepared Statements* podem melhorar o desempenho em consultas repetidas, pois o banco de dados pode compilar a estrutura da consulta uma única vez e apenas modificar os valores nos *placeholders*, sem precisar recompilar toda a *query* a cada execução.

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   O `cds.ql` gera consultas parametrizadas automaticamente: `SELECT.one.from(Students).where({ ID: id })`. Até a forma com template string é segura, pois vira parâmetro: `` SELECT.from(Students).where`ID = ${id}` ``.
-   O que **não** fazer: concatenar strings em `cds.run('SELECT ... ' + valor)` — volta o risco de SQL injection.

</details>

## Criando a função `findById` para Buscar um Estudante por ID

Para adicionar uma funcionalidade que retorna um estudante específico pelo seu `id`, vamos criar a função `findById` no arquivo `src/database/studentsDB.js`. Essa função usará um Prepared Statement para executar a consulta SQL de forma segura e eficiente.

```javascript
// src/database/studentsDB.js
// const conn = require('./connection');

// const findAll = async () => {
//   const [result] = await conn.execute('SELECT * FROM students;');
//   return result;
// };

const findById = async (id) => {
  const [result] = await conn.execute('SELECT * FROM students WHERE id = ?;', [id]);
  return result[0];
};

// module.exports = {
//   findAll,
  findById,
// };
```

### Entendendo o código

1.  **Uso do `?` como *placeholder***

No exemplo acima, usamos o `?` para marcar onde o `id` do estudante será inserido na consulta SQL. O `[id]` passado como segundo argumento para `conn.execute` é um array que contém o valor que substituirá o `?`. Esse valor é tratado pelo `mysql2` como um dado puro, evitando que qualquer conteúdo potencialmente malicioso seja executado como SQL.

> **Anota aí 🖊:** Usar *placeholders* é uma prática essencial de segurança. Caso concatenássemos diretamente o `id` na consulta, estaríamos vulneráveis a ataques de *SQL Injection*, onde um invasor poderia manipular a consulta SQL e comprometer a segurança do banco de dados. Com os *placeholders*, os valores são tratados como dados fixos e não podem alterar a estrutura da consulta.

1.  **Por que usamos result\[0\]?**

A função `findById` retorna apenas um registro, mas o `conn.execute` sempre devolve os resultados em um array. Como esperamos apenas um item, extraímos o primeiro elemento (`result[0]`) para simplificar o retorno, que contém o objeto do estudante correspondente ao `id` passado.

## Atualizando o arquivo de rotas para suportar a consulta por ID

Agora, vamos modificar `studentRoutes.js` para incluir uma nova rota `GET /students/:id`, que usará a função `findById` para retornar os dados de um estudante específico.

```javascript
// src/routes/studentRoutes.js

// const express = require('express');
// const studentsDB = require('../database/studentsDB');

// Outras implementações

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await studentsDB.findById(id);

    if (!student) {
      return res.status(404).json({ message: 'Student Not Found!' });
    }

    return res.status(200).json(student);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});

// module.exports = router;
```

Agora, vamos fixar os conceitos aprendidos com o vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1039088497)
