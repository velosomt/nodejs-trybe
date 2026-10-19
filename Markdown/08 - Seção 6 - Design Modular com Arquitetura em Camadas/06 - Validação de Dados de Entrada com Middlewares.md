# 6.6 - Validação de Dados de Entrada com Middlewares

> Seção 6 - Design Modular com Arquitetura em Camadas · Lição 6 de 19

Garantir que os dados recebidos pelas rotas estejam completos e corretos é essencial para a segurança e funcionalidade da API. Para isso, podemos usar middlewares de validação com [Joi](https://www.npmjs.com/package/joi), uma biblioteca poderosa e flexível para criar esquemas de validação.

## Por Que Usar Middlewares para Validação?

Os middlewares ajudam a isolar a lógica de validação, mantendo as funções de negócio mais limpas e organizadas. Isso:

-   **Centraliza a lógica de validação**, facilitando manutenção e reutilização.
-   **Padroniza as respostas de erro para o cliente**, melhorando a usabilidade da API.
-   **Previne inconsistências** e problemas ao lidar com dados inesperados.

## Tipos de Validação com Joi

Para nossa aplicação, vamos focar na validação de três partes da requisição:

1.  **Body**: Usado nas rotas POST e PUT para criação e atualização de registros.
2.  **Params**: Geralmente aplicado nas rotas GET, PUT e DELETE para validação de parâmetros de rota, como IDs.
3.  **Query**: Usado nas requisições GET para validações de filtros e paginação.

## Configurando a Biblioteca Joi

Para utilizar `joi` em seu projeto, instale a biblioteca:

```bash
npm install joi@17.13.3 -E
```

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   Joi segue mantido, mas **Zod** (ou Valibot) virou a escolha mais comum em projetos novos — especialmente com TypeScript, porque o schema também gera o tipo.

**Para o SAP CAP**

-   No CAP os tipos do CDS já validam tipo/tamanho (`String(14)`, `Date`, `Integer`) e as anotações `@mandatory`, `@assert.format`, `@assert.range` cobrem a maior parte do que o Joi faz aqui, sem middleware.

</details>

## Criando os Middlewares de Validação

### Validação do Body nas Rotas `POST` e `PUT`

Primeiro, criamos um esquema com joi para garantir que os dados enviados ao cadastrar ou atualizar uma pessoa estudante estejam completos e no formato esperado.

```javascript
// src/middlewares/validateStudentBody.js

const Joi = require('joi');

const studentSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  cpf: Joi.string().length(14).required(),
  birthDate: Joi.date().iso().required(),
  email: Joi.string().email().required(),
  cep: Joi.string().length(9).required(),
  address: Joi.string().max(100).required(),
});

const validateStudentBody = (req, res, next) => {
  const { error } = studentSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: 'Validation Error',
      details: error.details.map((err) => err.message),
    });
  }

  return next();
};

module.exports = validateStudentBody;
```

Neste middleware `validateStudentBody`, o método `validate()` verifica o `req.body` usando o esquema `studentSchema`. Se houver algum erro de validação, retornamos um código de status 400 com detalhes das falhas.

### Validação de Params nas Rotas `GET`, `PUT` e `DELETE`

Vamos agora definir um middleware que valide o ID de um estudante passado como parâmetro de rota, garantindo que ele seja um número válido.

```javascript
// src/middlewares/validateStudentId.js

const Joi = require('joi');

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const validateStudentId = (req, res, next) => {
  const { error } = idSchema.validate(req.params);

  if (error) {
    return res.status(400).json({
      message: 'Invalid ID',
      details: error.details.map((err) => err.message),
    });
  }

  return next();
};

module.exports = validateStudentId;
```

Este middleware `validateStudentId` verifica o `req.params.id`. Caso o ID não seja um número positivo, retorna um erro 400 com a mensagem adequada.

### Integrando os Middlewares nas Rotas

```javascript
// src/routes/studentsRoutes.js

const express = require('express');
const studentController = require('../controller/studentController');
const validateStudentBody = require('../middlewares/validateStudentBody');
const validateStudentId = require('../middlewares/validateStudentId');

const router = express.Router();

router.get('/', studentController.getAllStudents);
router.get('/:id', validateStudentId, studentController.getByIdStudent);
router.post('/', validateStudentBody, studentController.createStudent);
router.put('/:id', validateStudentId, validateStudentBody, studentController.updatedStudent);
router.delete('/:id', validateStudentId, studentController.removeStudent);

module.exports = router;
```

-   `validateStudentId` é aplicado nas rotas que utilizam um `ID` na URL (`GET /:id`, `PUT /:id`, `DELETE /:id`).
-   `validateStudentBody` é aplicado nas rotas que recebem dados no corpo da requisição (`POST /` e `PUT /:id`).

> **Relembrando 🧠:** O código apresentado no conteúdo até este momento, pode ser acessado na pasta `06-design-modular-com-arquitetura-em-camadas/parte-02-model-e-controller` ou através desse **[link](https://github.com/learnwithtrybe/node-codigos/tree/main/06-design-modular-com-arquitetura-em-camadas/parte-02-model-e-controller)**.

Para recapitular sobre o conteúdo e aprofundar mais na estrutura do projeto, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1040224981)
