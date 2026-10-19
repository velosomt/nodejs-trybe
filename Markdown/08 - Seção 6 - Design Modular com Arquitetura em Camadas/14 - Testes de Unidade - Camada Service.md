# 6.14 - Testes de Unidade - Camada Service

> Seção 6 - Design Modular com Arquitetura em Camadas · Lição 14 de 19

Agora que entendemos os testes de unidade na camada Model, vamos avançar para os testes unitários na camada Service. Nesta lição, focaremos nas funções de lógica de negócio e validações que interagem com a camada de dados e, em alguns casos, com serviços externos. A camada Service tem um papel essencial em nosso projeto, pois é onde implementamos as regras de negócio e a lógica de controle.

## Funções a serem testadas

As funções que vamos testar na camada Service estão no arquivo `src/service/studentService.js`:

1.  `enrollStudentInSubject`: função que gerencia a matrícula de um estudante em uma disciplina, verificando a quantidade máxima de alunos antes de permitir a matrícula;
2.  `createStudent`: função que valida o CEP de um estudante, utilizando a API do ViaCEP, e monta o endereço antes de cadastrar o estudante no banco de dados.

Para os testes unitários dessa camada, vamos isolar a lógica de cada função, usando mocks para simular a interação com a camada Model e com a API externa.

## Configuração de Testes Unitários para a Camada Service

No arquivo `tests/unit/service/studentService.test.js`, vamos escrever testes que cubram diferentes cenários de cada função. Primeiro, revisaremos as dependências que serão mockadas para evitar chamadas reais ao banco de dados e à API externa.

### Estrutura de mocks para os testes

Para simular respostas esperadas das funções dos modelos, criaremos um mock para a camada Model e para a biblioteca `axios`, que será utilizada para a função `createStudent`.

```javascript
// tests/unit/mocks/studentServiceMocks.js

const enrollmentMock = {
  enrollmentCount: 10,
  maxStudents: 20,
};

const invalidCepResponse = { erro: true };

const validCepResponse = {
  logradouro: 'Rua Z',
  bairro: 'Bairro W',
  localidade: 'Cidade Y',
  uf: 'SP',
};

module.exports = {
  enrollmentMock,
  invalidCepResponse,
  validCepResponse,
};
```

### Testando a Função `enrollStudentInSubject`

A função `enrollStudentInSubject` verifica a disponibilidade de vagas para um estudante em uma disciplina e realiza a matrícula se houver espaço.

```javascript
// tests/unit/service/studentService.test.js

const { enrollStudentInSubject } = require('../../../src/service/studentService');
const enrollmentModel = require('../../../src/model/enrollmentModel');
const { enrollmentMock } = require('../mocks/studentServiceMocks');

jest.mock('../../../src/model/enrollmentModel');

describe('Service - Função enrollStudentInSubject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deve retornar sucesso ao matricular um estudante com vagas disponíveis', async () => {
    // Configura o mock para simular dados de quantidade de estudantes
    enrollmentModel.getEnrollmentCountBySubject.mockResolvedValue(enrollmentMock);
    enrollmentModel.addEnrollment.mockResolvedValue();

    const result = await enrollStudentInSubject(1, 1);

    expect(result).toEqual({ status: 'success', message: 'Enrollment Successful' });
    expect(enrollmentModel.getEnrollmentCountBySubject).toHaveBeenCalledWith(1);
    expect(enrollmentModel.addEnrollment).toHaveBeenCalledWith(1, 1);
  });

  test('deve retornar erro se a disciplina não existir', async () => {
    enrollmentModel.getEnrollmentCountBySubject.mockResolvedValue(null);

    const result = await enrollStudentInSubject(1, 1);

    expect(result).toEqual({ status: 'error', message: 'Subject Not Found!' });
    expect(enrollmentModel.addEnrollment).not.toHaveBeenCalled();
  });

  test('deve retornar erro se a sala de aula estiver cheia', async () => {
    const fullEnrollmentMock = { maxStudents: 20, enrollmentCount: 20 };
    enrollmentModel.getEnrollmentCountBySubject.mockResolvedValue(fullEnrollmentMock);

    const result = await enrollStudentInSubject(1, 1);

    expect(result).toEqual({ status: 'error', message: 'Classroom is Full' });
    expect(enrollmentModel.addEnrollment).not.toHaveBeenCalled();
  });
});
```

#### Explicação dos Testes

1.  **Matrícula com vagas disponíveis**: simulamos uma resposta do banco indicando que há vagas e verificamos se o retorno da função é de sucesso.
2.  **Disciplina inexistente**: retornamos `null` no mock, simulando que a disciplina não foi encontrada.
3.  **Sala de aula cheia**: ajustamos o mock para indicar que o limite de alunos foi atingido, garantindo que a função retorna um erro.

### Testando a Função `createStudent`

A função `createStudent` faz uma validação de CEP com a API `ViaCEP` antes de cadastrar um novo estudante no banco de dados.

```javascript
// tests/unit/service/studentService.test.js

const axios = require('axios');

const { enrollStudentInSubject, createStudent } = require('../../../src/service/studentService');
// const enrollmentModel = require('../../../src/model/enrollmentModel');
const {
  // enrollmentMock,
  invalidCepResponse,
  validCepResponse,
} = require('../mocks/studentServiceMocks');

const studentModel = require('../../../src/model/studentModel');
const { studentMockFormated } = require('../mocks/studentModelMocks');

// jest.mock('../../../src/model/enrollmentModel');
jest.mock('../../../src/model/studentModel');
jest.mock('axios');

// Outro teste

describe('Service - Função createStudent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deve retornar sucesso ao criar um novo estudante com CEP válido', async () => {
    axios.get.mockResolvedValue({ data: validCepResponse });
    studentModel.insert.mockResolvedValue(studentMockFormated);

    const result = await createStudent(studentMockFormated);

    expect(result).toEqual({
      status: 'success',
      message: 'Student Created Successfully',
      student: studentMockFormated,
    });
    expect(axios.get).toHaveBeenCalledWith(`https://viacep.com.br/ws/${studentMockFormated.cep}/json/`);
    expect(studentModel.insert).toHaveBeenCalledWith(expect.objectContaining({
      ...studentMockFormated,
      address: 'Rua Z, Bairro W, Cidade Y - SP',
    }));
  });

  test('deve retornar erro ao encontrar um "CEP" inválido', async () => {
    axios.get.mockResolvedValue({ data: invalidCepResponse });

    const result = await createStudent(studentMockFormated);

    expect(result).toEqual({ status: 'error', message: 'Invalid "CEP"' });
    expect(studentModel.insert).not.toHaveBeenCalled();
  });

  test('deve retornar erro em caso de falha na API de CEP', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    const result = await createStudent(studentMockFormated);

    expect(result).toEqual({ status: 'error', message: 'Error Validating "CEP"' });
    expect(studentModel.insert).not.toHaveBeenCalled();
  });
});
```

#### Explicação dos Testes

1.  **Criação de estudante com CEP válido**: simulamos uma resposta da API de CEP com um endereço válido e verificamos o sucesso da criação do estudante.
2.  **CEP inválido**: a API retorna um erro de CEP, e verificamos que a função retorna uma mensagem de erro sem chamar o `studentModel.insert`.
3.  **Erro na API de CEP**: simulamos um erro na chamada da API e verificamos que a função retorna um erro apropriado, indicando a falha na validação do CEP.

Com esses testes, validamos algumas das principais regras de negócio da camada Service, garantindo que cada função cumpre seu papel e retorna o resultado esperado em diferentes cenários.

Para reforçar os conceitos sobre o conteúdo, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1040234921)
