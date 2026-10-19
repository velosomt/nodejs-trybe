# 5.7 - Operações de Leitura

> Seção 5 - Persistência de Dados com Node.js · Lição 7 de 16

Após configurar o ambiente utilizando Node.js, MySQL e Docker, vamos implementar uma funcionalidade que permite recuperar informações cadastradas no banco de dados. Neste lição, exploraremos a estruturação das operações de leitura, abordando desde a conexão com o banco até a criação das rotas que disponibilizam esses dados via API.

## Estruturando a Conexão com o Banco de Dados

Vamos criar um arquivo em `src/database/studentsDB.js`, responsável por agrupar todas as operações SQL relacionadas à tabela `students`. Começaremos pelo código que permite buscar todos os registros de estudantes no banco.

### Retornando todos os registros

No arquivo `src/database/studentsDB.js`, adicione a função `findAll` para executar a consulta de leitura no banco. Observe que utilizamos `await` e um colchete ao redor de `result` para extrair corretamente os dados retornados:

```javascript
const conn = require('./connection');

const findAll = async () => {
  const [result] = await conn.execute('SELECT * FROM students;');
  return result;
};

module.exports = {
  findAll,
};
```

1.  **Por que usar `await`?**

O `await` é usado aqui para garantir que o código aguarde o término da execução do comando `SELECT * FROM students;`. Como as operações de banco de dados são assíncronas, o `await` impede que o código avance antes de recebermos o resultado, evitando problemas de leitura antes da finalização da consulta.

1.  **Por que \[result\]?**

O uso dos colchetes `[result]` ocorre porque `conn.execute()` retorna um array, onde o primeiro item é o resultado da consulta e o segundo, geralmente, contém metadados sobre a execução. Colocando o resultado em colchetes, estamos selecionando apenas o primeiro item do array, que contém os dados que queremos.

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   Equivalente com `cds.ql`, sem SQL escrito à mão e já parametrizado: `await SELECT.from(Students).columns('ID', 'name')`. Selecione só as colunas necessárias e prefira `$expand`/projeções a consultas dentro de loop (N+1).

</details>

## Organizando as Rotas da Aplicação

Para uma estrutura de projeto organizada, vamos criar um subdiretório chamado `routes` dentro de `src`. Nele, armazenaremos os arquivos de rotas, que gerenciam o tráfego das requisições dentro da aplicação.

### Criando o Arquivo de Rotas: `studentRoutes.js`

Dentro de `src/routes`, criaremos o arquivo `studentRoutes.js` para definir a rota que retornará a lista de estudantes:

```javascript
// src/routes/studentRoutes.js

const express = require('express');
const studentsDB = require('../database/studentsDB');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const students = await studentsDB.findAll();
    return res.status(200).json(students);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});

module.exports = router;
```

**Tratamento de Erros**: O bloco `try-catch` é essencial para capturar e lidar com possíveis erros de conexão ou consulta. No caso de falhas, a resposta retorna um status 500 e uma mensagem de erro.

## Configurando a Aplicação para Utilizar as Rotas

Por fim, vamos importar a rota que criamos no arquivo principal da aplicação, `src/app.js`, tornando o recurso disponível na URL `/students`.

```javascript
// src/app.js

// const express = require('express');
const studentRouter = require('./routes/studentRoutes');

// const app = express();

// app.use(express.json());
app.use('/students', studentRouter);

// module.exports = app;
```

Agora, a aplicação está pronta para responder a requisições `GET` no endpoint `/students`, retornando todos os registros da tabela `students` diretamente do banco de dados.

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1039088467)
