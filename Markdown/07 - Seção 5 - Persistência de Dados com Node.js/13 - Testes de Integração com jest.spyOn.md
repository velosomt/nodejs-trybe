# 5.13 - Testes de Integração com jest.spyOn

> Seção 5 - Persistência de Dados com Node.js · Lição 13 de 16

Outro recurso útil para realizar testes é o `jest.spyOn`. Esse método permite que façamos "espionagem" em funções específicas de um módulo, rastreando chamadas e manipulando o comportamento delas sem sobrescrever totalmente o módulo, como é o caso com `jest.mock()`. Assim, podemos testar funcionalidades individualmente, interceptando chamadas e simular respostas controladas para verificar como o código reage em diferentes cenários.

## O que é o `jest.spyOn`?

O `jest.spyOn` intercepta funções específicas de um módulo para observar seu comportamento, permitindo que:

-   **Contemos quantas vezes** uma função é chamada;
-   **Simulemos o retorno da função**, substituindo o comportamento original apenas durante o teste;
-   **Restauramos o comportamento original**, para que a função volte ao normal em outros testes.

Esse método é útil para testar endpoints que realizam operações específicas e nos dá controle sobre o que deve ser retornado, sem alterar o comportamento geral do sistema.

## Estrutura dos Testes com `jest.spyOn`

Para evitar interferência dos testes anteriores com `jest.mock`, organizamos os testes em um novo arquivo chamado `studentRoutesSpy.test.js`.

### Criando novos Mocks

Para os próximos testes, iremos criar dois novos mocks para os testes de criação e atualização respectivamente.

```javascript
// tests/integration/mocks/studentMocks.js

// Outros Mocks

const newStudent = {
  name: 'Lucas Almeida',
  cpf: '321.654.987-00',
  birthDate: '1998-02-10',
  email: 'lucas.almeida@example.com',
  cep: '04000-000',
  address: 'Rua J, Bairro K, Cidade L - SP'
};

const updatedStudent = {
  name: 'Lucas Almeida da Silva',
  cpf: '321.654.987-00',
  birthDate: '1998-02-10',
  email: 'lucas.silva@example.com',
  cep: '04000-000',
  address: 'Rua M, Bairro N, Cidade O - RJ'
};

module.exports = {
  // studentMock,
  // studentByIdMock,
  newStudent,
  updatedStudent,
};
```

## Testando o Método POST com `jest.spyOn`

O método POST permite adicionar novos estudantes ao banco de dados. Com `jest.spyOn`, vamos interceptar a função de execução da query SQL para simular uma resposta com o ID do novo registro.

```javascript
// studentRoutesSpy.test.js

const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');
const { newStudent } = require('./mocks/studentMocks');

describe('POST /students', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should create a new student with status 201', async () => {
    jest.spyOn(connection, 'execute').mockResolvedValue([{ insertId: 4 }, undefined]);

    const response = await request(app).post('/students').send(newStudent);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Student successfully registered with ID 4',
    });
  });
});
```

### Entendendo o Código

**Simulação do Retorno**: Usamos `jest.spyOn(connection, 'execute')` para "espionar" a função execute do módulo de conexão, simulando o retorno com um objeto que representa um novo ID `({ insertId: 4 })`.

## Testando o Método PUT com `jest.spyOn`

O método PUT atualiza informações de um estudante existente. Nesse teste, configuraremos o `jest.spyOn` para retornar `affectedRows: 1` caso o estudante seja encontrado e atualizado, ou `affectedRows: 0` caso não exista, permitindo verificar o tratamento de ambas as respostas.

```javascript
// studentRoutesSpy.test.js

// const request = require('supertest');
// const app = require('../../src/app');
// const connection = require('../../src/database/connection');
const { newStudent, updatedStudent } = require('./mocks/studentMocks');

describe('PUT /students/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should update student information with status 200', async () => {
    jest.spyOn(connection, 'execute').mockResolvedValue([{ affectedRows: 1 }, undefined]);

    const response = await request(app).put('/students/4').send(updatedStudent);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Student Successfully Updated' });
  });

  test('Should return 404 if student is not found', async () => {
    const executeSpy = jest.spyOn(connection, 'execute').mockResolvedValue([{ affectedRows: 0 }, undefined]);

    const response = await request(app).put('/students/999').send({ name: 'name student' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Student Not Found!' });
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});
```

### Entendendo o Código

1.  **Teste de atualização existente**: Simulamos uma resposta bem-sucedida com `affectedRows: 1`, o que indica que uma linha foi atualizada no banco.  
    
2.  **Teste de estudante inexistente**: Simulamos `affectedRows: 0`, resultando em um erro 404 com mensagem personalizada.  
    
3.  Validação da Chamada: Com `expect(executeSpy).toHaveBeenCalledTimes(...)`, validamos quantas vezes a função foi chamada.

## Testando o Método DELETE com jest.spyOn

O método DELETE remove um estudante com base no seu ID. Para esses testes, utilizaremos `jest.spyOn` para simular duas situações: exclusão bem-sucedida (retornando `affectedRows: 1`) e tentativa de exclusão de um ID inexistente (retornando `affectedRows: 0`).

```javascript
// studentRoutesSpy.test.js

describe('DELETE /students/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should remove a student with status 204', async () => {
    const executeSpy = jest.spyOn(connection, 'execute').mockResolvedValue([{ affectedRows: 1 }, undefined]);

    const response = await request(app).delete('/students/4');

    expect(response.status).toBe(204);
    expect(executeSpy).toHaveBeenCalledWith(expect.any(String), ["4"]);
  });

  test('Should return 404 if student is not found', async () => {
    const executeSpy = jest.spyOn(connection, 'execute').mockResolvedValue([{ affectedRows: 0 }, undefined]);

    const response = await request(app).delete('/students/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Student Not Found!' });
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});
```

### Entendendo o Código

**Validação da Chamada**: Com `expect(executeSpy).toHaveBeenCalledWith(...)`, validamos que a função foi chamada com a query e os valores do novo estudante.

Esses testes garantem a integridade das operações principais da API, fornecendo um ambiente controlado e previsível para validar as respostas esperadas.

> **Relembrando 🧠:** O código apresentado no conteúdo até este momento, pode ser acessado na pasta `05-persistencia-de-dados/parte-03-testes` ou através desse **[link](https://github.com/learnwithtrybe/node-codigos/tree/main/05-persistencia-de-dados/parte-03-testes)**.

Para fixar esses conceitos, vamos ao vídeo a seguir.

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1039253352)
