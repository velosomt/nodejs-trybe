# 6.15 - Testes de Unidade - Camada Controller

> Seção 6 - Design Modular com Arquitetura em Camadas · Lição 15 de 19

Para finalizar a implementação dos nossos testes unitários, vamos fazer a implementação de testes para a camada de Controller.

## Estrutura de Testes para createStudent

A função createStudent pode ter os seguintes cenários de teste:

1.  **Criação bem-sucedida de estudante**: quando o serviço retorna uma resposta de sucesso.
2.  **Erro de validação**: quando o serviço retorna uma resposta de erro com status "error" (por exemplo, CEP inválido ou dados incompletos).
3.  **Erro interno do servidor**: quando ocorre um erro não previsto no serviço.

### Testando a Função `createStudent`

Vamos criar o arquivo `tests/unit/controller/studentController.test.js` e estruturar os testes com o Jest, mockando `studentService`.

```javascript
// tests/unit/controller/studentController.test.js

const { createStudent } = require('../../../src/controller/studentController');
const studentService = require('../../../src/service/studentService');

describe('Controller - Função createStudent', () => {
  const mockReq = (body) => ({ body });

  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deve retornar 201 e mensagem de sucesso ao criar um estudante com sucesso', async () => {
    const student = {
      id: 1,
      name: 'Carlos Santos',
      birthDate: '1990-01-01',
      cpf: '123.4567.89-00',
      email: 'carlos@example.com',
      cep: "07410-930",
    };

    // Usa jest.spyOn para simular o comportamento de createStudent
    jest.spyOn(studentService, 'createStudent').mockResolvedValue({
      status: 'success',
      message: 'Student Created Successfully',
      student,
    });

    const req = mockReq({
      name: 'Carlos Santos',
      birthDate: '1990-01-01',
      cpf: '123.4567.89-00',
      email: 'carlos@example.com',
      cep: "07410-930",
    });

    await createStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Student Created Successfully',
      student,
    });
  });

  test('deve retornar 400 e mensagem de erro se houver um problema na criação do estudante', async () => {
    jest.spyOn(studentService, 'createStudent')
      .mockResolvedValue({ status: 'error', message: 'Invalid "CEP"' });

    const req = mockReq({
      name: 'Carlos Santos',
      cpf: '123.456.789-00',
      birthDate: '1990-01-01',
      email: 'carlos@example.com',
      cep: '000000-00', // CEP inválido
    });

    await createStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid "CEP"' });
  });

  test('deve retornar 500 e mensagem de erro interno se houver um erro inesperado', async () => {
    jest.spyOn(studentService, 'createStudent')
      .mockRejectedValue(new Error('Service Error'));

    const req = mockReq({
      name: 'Carlos Santos',
      cpf: '123.456.789-00',
      birthDate: '1990-01-01',
      email: 'carlos@example.com',
      cep: '010010-00',
    });

    await createStudent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error!' });
  });
});
```

### Explicação dos Testes

**mockReq**: Esta função auxilia na criação de um objeto `req` de forma simplificada, aceitando um parâmetro body que é passado diretamente ao objeto, simulando um request.

**mock `res`**: O objeto `res` é configurado com métodos `status` e `json` usando `jest.fn()` para mockar o comportamento de uma resposta HTTP. Ambos os métodos retornam `res`, permitindo o encadeamento para chamadas subsequentes, o que simula a resposta da API corretamente.

**Descrição dos Testes**:

1.  **Teste de Sucesso (201)**: Aqui usamos `jest.spyOn` para simular um retorno bem-sucedido da função `studentService.createStudent`, verificando se o `res.status` retorna `201` com a mensagem de sucesso e os dados do estudante.
    
2.  **Erro de Validação (400)**: Simula um retorno de erro do serviço com status `"error"` e verifica se o `res.status` retorna `400` com a mensagem `"Invalid 'CEP'"`.
    
3.  **Erro Interno (500)**: Simula uma exceção inesperada (rejeição da Promise) em `studentService.createStudent`, verificando se o `res.status` retorna `500` e uma mensagem de erro interno.
    

> **Relembrando 🧠:** O código apresentado no conteúdo até este momento, pode ser acessado na pasta `06-design-modular-com-arquitetura-em-camadas/parte-04-testes-unitarios` ou através desse **[link](https://github.com/learnwithtrybe/node-codigos/tree/main/06-design-modular-com-arquitetura-em-camadas/parte-04-testes-unitarios)**.

Para reforçar os conceitos sobre o conteúdo, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1040235732)
