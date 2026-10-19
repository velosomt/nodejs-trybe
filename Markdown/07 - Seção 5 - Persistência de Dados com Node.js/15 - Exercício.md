# 5.15 - Exercício

> Seção 5 - Persistência de Dados com Node.js · Lição 15 de 16

Nesse exercício vamos criar uma **API REST** de Gerenciamento de Tarefas \`todo-list-manager\` utilizando o **Express** e o **MySQL** como banco de dados. Nessa **API** você vai armazenar e recuperar dados de tarefas por meio de **endpoints** que realizam o CRUD dos dados.

## Combinados

Para fazer o exercício, acesse esse repositório ➡️ [Exercício - Gerenciador de tarefas](https://github.com/learnwithtrybe/flex-node-todo-list-manager).

Nesse repositório a estrutura do código já está disponível, bem como o banco de dados criado e carregado via Docker. Basta você fazer a implementação criando novos arquivos e atualizando o arquivo de rotas.

Leia o arquivo `README.md` do repositório com ⚠️ atenção ⚠️ para saber como desenvolver e entregar seu exercício.

**Nessa fase dos estudos, você irá concluir o projeto fazendo os **exercícios 4 e 5**.**

**Solução**

Exercício 4. Teste de Integração - \`POST /tasks\`

```

// tests/mocks/taskMock.js
const taskMock = [
    {
      id: 1,
      nome: "Preparar relatório",
      descricao: "Tarefa de Trabalho"
    },
    {
      id: 2,
      nome: "Lavar louça",
      descricao: "Tarefa Doméstica"
    },
    {
      id: 3,
      nome: "Comprar ração pet",
      descricao: "Tarefa Doméstica"
    },
  ];
  
  module.exports = {
    taskMock,
  };
```

```

// tests/integration/tasksRoutes.test.js

const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/db/connection');
const { newTask  } = require('../mocks/taskMock');

jest.mock('../../src/db/connection'); // Mocka todo o módulo de conexão

describe('POST /tasks', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('Should create a new task with status 201', async () => {
      jest.spyOn(connection, 'execute').mockResolvedValue([{ insertId: 4 }, undefined]);
  
      const response = await request(app).post('/tasks').send(newTask);
  
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: 4,
        descricao: "Tarefa Pessoal",
        nome: "Ir na academia"
      });
    });
  });
```

Exercício 5. Teste de Integração - \`GET /tasks\`

```

// tests/mocks/taskMock.js
// const taskMock = [
//     {
//       id: 1,
//       nome: "Preparar relatório",
//       descricao: "Tarefa de Trabalho"
//     },
//     {
//       id: 2,
//       nome: "Lavar louça",
//       descricao: "Tarefa Doméstica"
//     },
//     {
//       id: 3,
//       nome: "Comprar ração pet",
//       descricao: "Tarefa Doméstica"
//     },
//   ];

  const newTask = {
    nome: "Ir na academia",
    descricao: "Tarefa Pessoal"
  };
  
//   module.exports = {
//     taskMock,
    newTask,
//   };
```

```

// tests/integration/tasksRoutes.test.js

// const request = require('supertest');
// const app = require('../../src/app');
// const connection = require('../../src/db/connection');
const { taskMock, newTask  } = require('../mocks/taskMock');

// jest.mock('../../src/db/connection'); // Mocka todo o módulo de conexão

describe('GET /tasks', () => {
  afterEach(() => {
    // Limpa o mock para evitar interferências em outros testes
    jest.clearAllMocks();
  });

  test('Return a task list with status 200', async () => {
    // Configura o mock para retornar dados específicos
    connection.execute.mockResolvedValue([taskMock, []]);

    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(taskMock);
  });
});

// describe('POST /tasks', () => {
//     afterEach(() => {
//       jest.clearAllMocks();
//     });
  
//     test('Should create a new task with status 201', async () => {
//       jest.spyOn(connection, 'execute').mockResolvedValue([{ insertId: 4 }, undefined]);
  
//       const response = await request(app).post('/tasks').send(newTask);
  
//       expect(response.status).toBe(201);
//       expect(response.body).toEqual({
//         id: 4,
//         descricao: "Tarefa Pessoal",
//         nome: "Ir na academia"
//       });
//     });
//   });
```
