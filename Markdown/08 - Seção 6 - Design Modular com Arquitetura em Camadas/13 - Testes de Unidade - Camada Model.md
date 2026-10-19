# 6.13 - Testes de Unidade - Camada Model

> Seção 6 - Design Modular com Arquitetura em Camadas · Lição 13 de 19

Até este ponto, concentramos nossos esforços em testes de integração, mas agora vamos explorar os **testes de unidade**. A diferença fundamental entre esses tipos de testes é a granularidade: um teste unitário valida uma única função ou método de forma isolada, variando apenas os cenários de entrada e saída esperados para essa unidade específica.

No caso da nossa aplicação, vamos criar nossos primeiros testes unitários para a camada Model da API. Validaremos o comportamento de funções específicas do `studentModel.js`, assegurando que cada função funcione corretamente e retorne os valores esperados, independentemente de outras partes do sistema.

## Funções a serem testadas

Vamos testar duas funções do arquivo `src/model/studentModel.js`:

1.  `findById`: responsável por buscar um estudante específico pelo `Id`;
2.  `insert`: responsável por cadastrar um novo estudante no banco de dados.

Para isso, criaremos o arquivo de testes `tests/unit/model/studentModel.test.js`, onde cada teste será independente e usará um mock de conexão para simular a interação com o banco de dados sem realizar operações reais.

> **Anota aí 📝:** um mock é um objeto simulado que imita o comportamento de dependências reais em testes. Tem o objetivo de substituir componentes externos ou complexos (como bancos de dados, APIs) durante os testes.

## Configurando o Jest para Testes Unitários

Para evitar conflitos com os testes de integração criados anteriormente, vamos configurar um arquivo de testes específico, `jest.config.unit.js`, que limitará a execução somente a testes unitários.

```javascript
// jest.config.unit.js
/** @type {import('jest').Config} */
module.exports = {
  rootDir: './tests',
  testMatch: ['/unit/**/*.test.js'],
  testTimeout: 10000,
  testEnvironment: 'node',
};
```

Em seguida, vamos adicionar um novo script ao `package.json` para rodar apenas os testes unitários:

```json
// "scripts": {
  "test:unit": "jest --config=jest.config.unit.js"
// }
```

Agora, podemos executar nossos testes unitários com o comando `npm run test:unit`.

## Código da Camada Model

Vamos revisar as funções que iremos testar:

```javascript
// src/model/studentModel.js

const findById = async (id) => {
  const [result] = await conn.execute('SELECT * FROM students WHERE id = ?;', [id]);
  return camelize(result[0]);
};

const insert = async (student) => {
  const { name, cpf, birthDate, email, cep, address } = student;
  const [result] = await conn.execute(
    `INSERT INTO students (name, cpf, birth_date, email, cep, address) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, cpf, birthDate, email, cep, address],
  );

  return { id: result.insertId, ...student };
};
```

### Estrutura de mocks para os testes

Criaremos o arquivo `tests/unit/mocks/studentModelMocks.js` para definir os dados de mock que usaremos nos testes:

```javascript
// tests/unit/mocks/studentModelMocks.js

const studentMock = {
  id: 1,
  name: 'Ana Souza',
  cpf: '123.456.789-01',
  birth_date: '2000-05-14T03:00:00.000Z',
  email: 'ana.souza@example.com',
  cep: '01000-000',
  address: 'Rua A, Bairro B, Cidade C - SP',
};

const studentMockFormated = {
  id: 1,
  name: 'Ana Souza',
  cpf: '123.456.789-01',
  birthDate: '2000-05-14T03:00:00.000Z',
  email: 'ana.souza@example.com',
  cep: '01000-000',
  address: 'Rua A, Bairro B, Cidade C - SP',
};

const newStudent = {
  name: 'Lucas Almeida',
  cpf: '321.654.987-00',
  birthDate: '1998-02-10',
  email: 'lucas.almeida@example.com',
  cep: '04000-000',
  address: 'Rua J, Bairro K, Cidade L - SP'
};

module.exports = {
  studentMock,
  studentMockFormated,
  newStudent,
};
```

### Arquivo: `tests/unit/model/studentModel.test.js` - Função `findById`

Para testar `findById`, utilizaremos `jest.spyOn` para simular o comportamento de `conn.execute`, evitando interações reais com o banco de dados.

```javascript
// tests/unit/model/studentModel.test.js

const { findById } = require('../../../src/model/studentModel');
const conn = require('../../../src/model/connection');
const { studentMock, studentMockFormated } = require('../mocks/studentModelMocks');

describe('Camada Model - studentModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    test('deve retornar o estudante correspondente ao ID fornecido', async () => {
      // Mock da conexão com banco de dados
      jest.spyOn(conn, 'execute').mockResolvedValue([[studentMock], undefined]);

      const STUDENT_ID = 1;

      // Chama a função e verifica o resultado
      const result = await findById(STUDENT_ID);
      expect(result).toEqual(studentMockFormated);
      expect(conn.execute).toHaveBeenCalled();
    });
  });
});
```

#### Explicação dos Testes

1.  Configuramos um mock para `conn.execute`, simulando um retorno específico para a função `findById`.
2.  Verificamos se `findById` retorna os dados transformados corretamente.
3.  Validamos que a função `execute` foi chamada, assegurando a interação com o banco.

### Arquivo: `tests/unit/model/studentModel.test.js` - Função `insert`

```javascript
// tests/unit/model/studentModel.test.js

const { findById, insert } = require('../../../src/model/studentModel');
// const conn = require('../../../src/model/connection');
const { studentMock, studentMockFormated, newStudent } = require('../mocks/studentModelMocks');

// describe('Camada Model - studentModel', () => {

// Outro teste

  describe('insert', () => {
    test('deve inserir um estudante e retornar o objeto com o ID gerado', async () => {
      const mockResult = [{ insertId: 2 }, undefined];
      jest.spyOn(conn, 'execute').mockResolvedValue(mockResult);

      // Chama a função e verifica o resultado
      const result = await insert(newStudent);
      expect(result).toEqual({ id: mockResult[0].insertId, ...newStudent });
      expect(conn.execute).toHaveBeenCalledWith(
        'INSERT INTO students (name, cpf, birth_date, email, cep, address) VALUES (?, ?, ?, ?, ?, ?)',
        [newStudent.name, newStudent.cpf, newStudent.birthDate, newStudent.email, newStudent.cep, newStudent.address]
      );
    });
  });
// });
```

#### Explicação dos Testes

1.  Configuramos o mock de `conn.execute` para simular a inserção de um estudante, retornando um `insertId`.
2.  Verificamos se a função `insert` retorna os dados do estudante com o novo `id` incluído.
3.  Checamos que a chamada a `execute` contém a query e os dados corretos, garantindo que a estrutura SQL está sendo gerada conforme esperado.

Para reforçar os conceitos sobre o conteúdo, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1040231272)

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   No CAP a maior parte dos testes é de integração com `cds.test` (rápidos com SQLite em memória). Testes de unidade com mocks continuam úteis para funções puras de regra de negócio e para isolar chamadas externas — o que se aprende nas lições 6.13 a 6.15 se aplica.

</details>
