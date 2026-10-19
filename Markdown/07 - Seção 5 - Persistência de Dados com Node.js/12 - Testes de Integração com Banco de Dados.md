# 5.12 - Testes de Integração com Banco de Dados

> Seção 5 - Persistência de Dados com Node.js · Lição 12 de 16

Agora que implementamos operações de CRUD com banco de dados, é essencial garantir que essas operações funcionem como esperado. Nesta seção, vamos abordar como criar testes de integração para o método GET usando **Jest** e **Supertest**, como foco em **mockar o banco de dados** para simular as respostas esperadas.

## O que é "Mockar" uma função?

"Mockar" é uma técnica que usamos em testes para simular o comportamento de uma função ou módulo sem realmente executá-lo. Em vez de conectar-se ao banco de dados, por exemplo, podemos simular uma resposta específica para garantir que o código lide corretamente com diferentes cenários, como:

-   **Dados válidos** que deveriam ser retornados;
-   **Erros inesperados** que devem ser tratados de maneira adequada.

Ao usar mocks, conseguimos:

-   **Aumentar a velocidade dos testes**, evitando a conexão real com o banco de dados;
-   **Controlar os dados de resposta** para validar diferentes cenários de forma confiável;
-   **Evitar mudanças indesejadas na base de dados**, já que nenhum dado será persistido.

Neste caso, vamos mockar a conexão com o banco de dados para simular o retorno de dados de estudantes, sem realmente acessar uma base de dados.

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   O runner nativo também tem mocks: `import { mock } from 'node:test'; mock.method(objeto, 'metodo', impl)`.

**Para o SAP CAP**

-   No CAP prefira testar contra o SQLite em memória com dados de CSV (`cds.test`), que é rápido e exercita o modelo real. Mock fica para serviços externos (ex.: `cds.connect.to('ViaCEP')`).

</details>

## Configurando o Mock do banco de dados

Para organizar os dados de exemplo que vamos utilizar nos mocks, criaremos um arquivo de "mocks" com os dados que desejamos testar.

### Criando o arquivo de Mocks

Crie o arquivo `tests/integration/mocks/studentMocks.js` para armazenar os dados que usaremos como resposta mockada.

```javascript
// tests/integration/mocks/studentMocks.js

const studentMock = [
  {
    id: 1,
    name: 'Ana Souza',
    cpf: '123.456.789-01',
    birth_date: '2000-05-14T03:00:00.000Z',
    email: 'ana.souza@example.com',
    cep: '01000-000',
    address: 'Rua A, Bairro B, Cidade C - SP'
  },
  {
    id: 2,
    name: 'Bruno Lima',
    cpf: '987.654.321-02',
    birth_date: '1999-08-22T03:00:00.000Z',
    email: 'bruno.lima@example.com',
    cep: '02000-111',
    address: 'Rua D, Bairro E, Cidade F - RJ'
  },
  {
    id: 3,
    name: 'Carla Silva',
    cpf: '111.222.333-44',
    birth_date: '2001-11-10T02:00:00.000Z',
    email: 'carla.silva@example.com',
    cep: '03000-222',
    address: 'Rua G, Bairro H, Cidade I - MG'
  },
];

module.exports = {
  studentMock,
};
```

### Mockando a conexão do banco de dados

Para simular a conexão com o banco de dados, vamos utilizar o Jest para criar um mock da função `connection.execute`, que é responsável por executar as queries SQL.

Como o código de conexão está definido em `src/database/connection.js`, faremos um mock desse módulo em nosso arquivo de testes. No Jest, podemos utilizar a função `jest.mock()` para sobrescrever o comportamento padrão de um módulo.

### Testando o endpoint GET com mock de dados

Agora, vamos implementar o teste para o endpoint GET /students no arquivo `tests/integration/studentRoutes.test.js`.

```javascript
// tests/integration/studentRoutes.test.js

const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');
const { studentMock } = require('./mocks/studentMocks');

jest.mock('../../src/database/connection'); // Mocka todo o módulo de conexão

describe('GET /students', () => {
  afterEach(() => {
    // Limpa o mock para evitar interferências em outros testes
    jest.clearAllMocks();
  });

  test('Return a students list with status 200', async () => {
    // Configura o mock para retornar dados específicos
    connection.execute.mockResolvedValue([studentMock, []]);

    const response = await request(app).get('/students');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(studentMock);
  });
});
```

### Entendendo o Código

1.  **Criação do Mock de Dados**:
    
2.  O arquivo `studentMocks.js` contém um array `studentsMock` que representa um exemplo de resposta de dados para nossos testes. Isso permite alterar os dados de teste em um único lugar, facilitando a manutenção.
    
3.  **Configuração do Mock do Módulo**:
    
4.  Utilizamos `jest.mock('../../src/database/connection')` para simular o módulo de conexão, de forma que todas as chamadas para `connection.execute` serão controladas pelo Jest.
    
5.  **Limpeza do Mock**:
    
6.  Com `jest.clearAllMocks()` no `afterAll`, garantimos que o mock não interfira em outros testes.
    
7.  **Verificação do Endpoint**:
    
8.  No teste `test('Return a students list with status 200')`, fazemos uma requisição GET para `/students` e verificamos se o status retornado é `200`.
    
9.  Validamos se o `response.body` corresponde ao `studentMock`.
    

Agora, execute os testes com o comando `npm test` e confira se o teste foi aprovado!

### Testando o endpoint GET /students/:id

Para este teste, vamos definir um mock específico para o estudante com ID 1. No arquivo `studentMocks.js`, podemos adicionar:

```javascript
// tests/integration/mocks/studentMocks.js

const studentByIdMock = {
  id: 1,
  name: 'Ana Souza',
  cpf: '123.456.789-01',
  birth_date: '2000-05-14T03:00:00.000Z',
  email: 'ana.souza@example.com',
  cep: '01000-000',
  address: 'Rua A, Bairro B, Cidade C - SP',
};

module.exports = {
  // studentMock,
  studentByIdMock,
};
```

### Teste para o endpoint GET /students/:id

No arquivo `studentRoutes.test.js`, vamos adicionar o teste para o endpoint GET `/students/1`:

```javascript
// tests/integration/studentRoutes.test.js

// Outras Importações

const { studentMock, studentByIdMock } = require('./mocks/studentMocks');

describe('GET /students/:id', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  test('Return a student by id with status 200', async () => {
    connection.execute.mockResolvedValue([[studentByIdMock], []]);

    const response = await request(app).get('/students/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(studentByIdMock);
  });

  test('Return 404 if student not found', async () => {
    // Simula uma resposta vazia para um ID inexistente
    connection.execute.mockResolvedValue([[], []]);

    const response = await request(app).get('/students/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Student Not Found!' });
  });
});
```

Com isso, cobrimos a implementação dos testes para os endpoints que utilizam o método GET. Agora, vamos fixar os conceitos aprendidos com o vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1039253093)

<details>
<summary>OBS da IA</summary>

**CI/CD**

-   Testes que usam **mocks** (como os da 5.13) rodam em qualquer pipeline sem banco. Para testar contra um MySQL de verdade no pipeline, suba um **service container** descartável no próprio job do GitHub Actions.
-   Veja a seção "Indo além" de [IA.3 - GitHub Actions](../12%20-%20OBS%20da%20IA%20-%20CI-CD%20-%20o%20m%C3%ADnimo%20para%20deploy%20automatizado/03%20-%20GitHub%20Actions%20-%20o%20primeiro%20pipeline%20de%20CI.md).

</details>
