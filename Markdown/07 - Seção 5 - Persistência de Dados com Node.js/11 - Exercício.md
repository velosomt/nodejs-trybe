# 5.11 - Exercício

> Seção 5 - Persistência de Dados com Node.js · Lição 11 de 16

Nesse exercício vamos criar uma **API REST** de Gerenciamento de Tarefas \`todo-list-manager\` utilizando o **Express** e o **MySQL** como banco de dados. Nessa **API** você vai armazenar e recuperar dados de tarefas por meio de **endpoints** que realizam o CRUD dos dados.

## Combinados

Para fazer o exercício, acesse esse repositório ➡️ [Exercício - Gerenciador de tarefas](https://github.com/learnwithtrybe/flex-node-todo-list-manager).

Nesse repositório a estrutura do código já está disponível, bem como o banco de dados criado e carregado via Docker. Basta você fazer a implementação criando novos arquivos e atualizando o arquivo de rotas.

Leia o arquivo `README.md` do repositório com ⚠️ atenção ⚠️ para saber como desenvolver e entregar seu exercício.

**Nessa fase dos estudos, você deverá fazer apenas os **exercícios 1, 2 e 3**. Os demais exercícios deverá ser feito em outra fase.**

**Solução**

Exercício 1. Crie um pool de conexões

```

// src/db/connection.js
const mysql = require('mysql2/promise');
const connection = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE_NAME || 'todo_list_db',
});
module.exports = connection;
```

Exercício 2. Criar o CRUD

```

// src/db/tasksDB.js
const conn = require('./connection');

const tableName = 'tasks';

const findAll = async () => {
  const [result] = await conn.execute(`SELECT * FROM ${tableName};`);
  return result;
};

const insert = async (task) => {
    const { nome, descricao } = task;
    const [result] = await conn.execute(
      `INSERT INTO ${tableName} (nome, descricao) VALUES (?, ?)`,
      [nome, descricao], 
    );
  
    return result.insertId;
  };

const findById = async (id) => {
    const [result] = await conn.execute(`SELECT * FROM ${tableName} WHERE id = ?;`, [id]);
    return result[0];
  };

  const update = async (id, updatedData) => {
    const { nome, descricao } = updatedData;
  
    const [result] = await conn.execute(
      `UPDATE ${tableName}
       SET nome = ?, descricao = ?
       WHERE id = ?`,
      [nome, descricao, id],
    );
  
    return result;
  };

  const remove = async (id) => {
    const [result] = await conn.execute(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    return result;
  };

module.exports = {
  findAll,
  insert,
  findById,
  update,
  remove,
};
```

Exercício 3. Ajustar as rotas

```

// src/routes/tasksRoutes.js

const express = require('express');
const tasksDB = require('../db/tasksDB');

const router = express.Router();
const internalMessage = 'Internal Server Error!';

router.post('/', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const task = { nome, descricao };
    const resultId = await tasksDB.insert(task);
    return res.status(201).json({
      id: resultId,
      nome,
      descricao,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: internalMessage });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const result = await tasksDB.update(id, updatedData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task Not Found!' });
    }

    return res.status(200).json({ message: 'Task Successfully Updated' });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: internalMessage });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await tasksDB.remove(id);

    if (result.affectedRows === 0) { // Como é igual a zero, sinal que nenhuma linha foi removida.
      return res.status(404).json({ message: 'Task Not Found!' });
    }

    return res.status(204).end();
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await tasksDB.findAll();
    return res.status(200).json(tasks);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await tasksDB.findById(id);
    return res.status(200).json(tasks);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});

module.exports = router;

```
