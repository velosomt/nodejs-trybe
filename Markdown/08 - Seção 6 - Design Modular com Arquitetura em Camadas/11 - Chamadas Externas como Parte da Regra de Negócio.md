# 6.11 - Chamadas Externas como Parte da Regra de Negócio

> Seção 6 - Design Modular com Arquitetura em Camadas · Lição 11 de 19

Ao construir a camada Service, é importante considerar que a lógica de negócio pode incluir integrações com serviços externos. Quando interagimos com APIs externas, estamos adicionando uma camada de validação ou complementando dados que são essenciais para o funcionamento do sistema — como validação de CEP para endereços de estudantes.

## Por que chamadas externas são regras de negócio?

Quando uma funcionalidade do sistema depende de uma validação ou processamento realizado por um serviço externo, essa lógica passa a fazer parte das regras de negócio. No caso da validação de CEP, a camada Service incorpora a responsabilidade de verificar se o CEP do estudante é válido antes de permitir o cadastro ou atualização de endereço. Essa verificação é fundamental para garantir dados precisos e endereços válidos, especialmente em aplicações que dependem da localização para outras operações.

Vamos ver como isso se aplica ao código.

## Implementando a Regra de Negócio: Validação de CEP utilizando uma API Externa

**Estrutura do Código**: Vamos utilizar três arquivos principais:

-   `studentModel.js` na Model, responsável por armazenar e manipular o endereço do estudante;
-   `studentService.js` na Service, que centraliza a lógica de validação de CEP e faz a chamada para a API externa;
-   `studentController.js` na Controller, que organiza o fluxo de requisição e resposta.

### Arquivo: `src/model/studentModel.js`

Na Model, modificaremos o retorno da nossa função, aqui garantimos que ela insira o endereço validado pela camada Service.

```javascript
// src/model/enrollmentModel.js

// Outras Implementações

// const insert = async (student) => {
//   const { name, cpf, birthDate, email, cep, address } = student;
//   const [result] = await conn.execute(
//     `INSERT INTO students (name, cpf, birth_date, email, cep, address) VALUES (?, ?, ?, ?, ?, ?)`,
//     [name, cpf, birthDate, email, cep, address],
//   );

  return { id: result.insertId, ...student };
// };

// Outras Implementações
```

### Arquivo: `src/service/studentService.js`

O Service centraliza a lógica de negócio, incluindo a chamada para a API externa de validação de CEP. Aqui, usaremos o `axios` para fazer uma requisição HTTP.

> **`axios`**: é uma biblioteca que facilita fazer requisições HTTP em aplicações Node.js. Ele é amplamente utilizado para consumir APIs externas e facilita o manuseio de dados, simplificando operações de GET, POST, entre outras.

Para instalar o axios, execute o comando:

```bash
npm install axios@1.7.7 -E
```

Agora, continuando com a implementação do código:

```javascript
// src/service/studentService.js

const axios = require('axios');

// const enrollmentModel = require('../model/enrollmentModel');
const studentModel = require('../model/studentModel');

const createStudent = async (studentData) => {
  const { cep } = studentData;

  try {
    // Chamada para API externa para validar o CEP
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    if (data.erro) {
      return { status: 'error', message: 'Invalid "CEP"' };
    }

    // Monta o endereço completo com os dados retornados pela API
    const address = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
    const newStudentData = { ...studentData, address };

    const newStudent = await studentModel.insert(newStudentData);

    return { status: 'success', message: 'Student Created Successfully', student: newStudent };
  } catch (err) {
    console.error('API Error:', err.message);
    return { status: 'error', message: 'Error Validating "CEP"' };
  }
};

// module.exports = {
//   enrollStudentInSubject,
//   updateEnrollmentGradeStatus,
  createStudent,
// }
```

> **Anota aí 📝:** para saber mais sobre o funcionamento da API ViaCEP acesse a [documentação](https://viacep.com.br/)

#### Lógica da Regra de Negócio:

-   **Validação de CEP**: A função `createStudent` faz uma chamada para a API ViaCEP para validar o CEP fornecido. Caso o CEP seja inválido, retorna um erro.
-   **Construção do Endereço**: Monta o endereço completo usando `logradouro`, `bairro`, `localidade`, e `uf` retornados pela API.
-   **Criação do Estudante**: Caso o CEP seja válido, os dados são enviados para o Model, que salva o novo estudante no banco de dados.

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   O Node 18+ tem `fetch` nativo (estável no 21+), então o `axios` deixou de ser obrigatório: `const res = await fetch(url); const data = await res.json();`. Lembre de definir timeout (`AbortSignal.timeout(5000)`).

**Para o SAP CAP**

-   No CAP, APIs externas viram **remote services**: configure em `cds.requires` (ex.: `ViaCEP: { kind: 'rest', credentials: { url: 'https://viacep.com.br' } }`) e use `const viacep = await cds.connect.to('ViaCEP'); await viacep.get('/ws/01001000/json/')`. Para APIs SAP, `cds import` gera o modelo a partir do EDMX/OpenAPI e, no BTP, a URL/credenciais vêm de destinations.

</details>

### Arquivo: `src/controller/stundentController.js`

No Controller, fazemos modificações na nossa função `createStudent`:

```javascript
// src/controller/stundentController.js

// Outras Implementações

const createStudent = async (req, res) => {
  const { name, cpf, birthDate, email, cep } = req.body;

  try {
    const result = await studentService.createStudent({ name, cpf, birthDate, email, cep });

    if (result.status === 'error') return res.status(400).json({ message: result.message });

    return res.status(201).json({ message: result.message, student: result.student });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

// Outras Implementações
```

-   `createStudent`: Recebe os dados do estudante na requisição (`name`, `cpf`, `birthDate`, `email`, `cep`), chama o Service para validar e criar o estudante, e retorna uma resposta adequada conforme o status da operação.

### Arquivo: `src/middlewares/validateStudentBody.js`

Como a validação do campo `address` agora é feita pela `API`, removemos o campo `address` do schema de validação no middleware:

```javascript
// src/middlewares/validateStudentBody.js

const studentSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  cpf: Joi.string().length(11).required(),
  birthDate: Joi.date().iso().required(),
  email: Joi.string().email().required(),
  cep: Joi.string().length(8).required(),
});

// Outras Implementações
```

O fluxo de validação do CEP é um exemplo de como chamadas a serviços externos podem se tornar uma parte integrante das regras de negócio. Isso melhora a precisão dos dados, assegurando que apenas endereços válidos sejam inseridos no sistema.

> **Relembrando 🧠:** O código apresentado no conteúdo até este momento, pode ser acessado na pasta `06-design-modular-com-arquitetura-em-camadas/parte-03-service` ou através desse **[link](https://github.com/learnwithtrybe/node-codigos/tree/main/06-design-modular-com-arquitetura-em-camadas/parte-03-service)**.

Para recapitular sobre o conteúdo, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1040231250)
