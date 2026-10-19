# 3.19 - Exercício Ecotourism API

> Seção 3 - API REST com Express · Lição 19 de 20

Para este exercício, você terá que construir uma aplicação back-end que auxilie na criação e compartilhamento de locais ainda não registrados na natureza para uma startup de Ecoturismo. O objetivo é valorizar e promover a capacidade turística do Brasil e os principais requisitos da API que essa startup solicitou são.

## Combinados

Para fazer o exercício, acesse esse repositório ➡️ [Exercício Ecotourism API](https://github.com/learnwithtrybe/flex-node-exercise-ecotourism-api).

Leia o arquivo `README.md` do repositório com ⚠️ atenção ⚠️ para saber como desenvolver e entregar seu exercício.

**Solução**

***Requisito 1: Crie um middleware para validar o campo name***

**Obs**: Será utilizado algumas variações de implementação em alguns requisitos, mas funcionam da mesma forma que no conteúdo

1.  Faça a instalação de todas as dependências que já estão no exercício com `npm install`.
2.  Crie o arquivo `src/middlewares/validateName.js` e adicione o seguinte código:

```javascript
// src/middlewares/validateName.js
function validateName(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json(
      { message: 'O campo name é obrigatório' },
    );
  }
  if (name.length < 4) { return res.status(400).json( { message: 'O campo name deve ter pelo menos 4 caracteres' }, ); } return next(); } module.exports = validateName; 
```

1.  Confira que essa implementação é a mesma utilizada no conteúdo estudado.
2.  Importe esse middleware no seu arquivo `src/app.js` e valide o campo `name` na rota POST `/activities`.

```javascript
// src/app.js
// const express = require('express');
const validateName = require('./middlewares/validateName');
// const app = express();
// app.use(express.json());
// const HTTP_OK_STATUS = 200;
// não remova e nem modifique esse endpoint
// app.get('/', (_request, response) => {
//   response.status(HTTP_OK_STATUS).send();
// });
// app.post('/activities',
  validateName,
//   (_req, res) => {
//   res.status(201).json({ message: 'Atividade cadastrada com sucesso!' });
// });
// module.exports = app;
```

1.  Execute a sua aplicação e faça uma requisição para rota `http://localhost:3001/activities` utilizando o método POST e confira se o campo `name` está sendo validado.
2.  Se tudo estiver certo, confira se o teste do requisito 1 está passando com o comando `npm test 01`.

***Requisito 2: Crie um middleware para validar o campo price***

1.  Crie o arquivo `src/middlewares/validatePrice.js` e adicione o seguinte código:

```javascript
// src/middlewares/validatePrice.js
const validatePrice = (req, res, next) => {
  const { price } = req.body;
  if (price === undefined) {
    return res.status(400).json(
      { message: 'O campo price é obrigatório' },
    );
  }
  if (price < 0 || typeof price !== 'number') { return res.status(400).json( { message: 'O campo price deve ser um número maior ou igual a zero' }, ); } return next(); }; module.exports = validateName; 
```

1.  Confira que essa implementação utiliza *arrow function* " => ". É outra forma para construir seus middlewares
2.  Importe esse middleware no seu arquivo `src/app.js` e valide o campo `price` na rota POST `/activities`.

```javascript
// src/app.js
// ... Importações
const validatePrice = require('./middlewares/validatePrice');
// ... Restante do código
// app.post('/activities',
//   validateName,
  validatePrice,
//   (_req, res) => {
//   res.status(201).json({ message: 'Atividade cadastrada com sucesso!' });
// });
// module.exports = app;
```

1.  Execute a sua aplicação e faça uma requisição para rota `http://localhost:3001/activities` utilizando o método POST e confira se o campo `price` está sendo validado.
2.  Se tudo estiver certo, confira se o teste do requisito 2 está passando com o comando `npm test 02`.

***Requisito 3: Crie um middleware para validar o campo description, que possui as chaves createdAt, rating e difficulty***

1.  Crie o arquivo `src/middlewares/validateDescription.js` e adicione o seguinte código:

```javascript
// src/middlewares/validateDescription.js
// função usada para conferir se o campo existe e retornar
// uma mensagem indicando qual campo não é válido
const validateField = (descriptionExist, field) => {
  if (descriptionExist === undefined) {
    return { message: `O campo ${field} é obrigatório` };
  }
  // retorna false caso o campo exista
  return false;
};
const validateDescription = (req, res, next) => {
  const { description } = req.body;
  // A constante message receberá o valor do primeiro campo que não for válido
  // e retornar alguma mensagem
  const message = validateField(description, 'description') // primeira validação
    || validateField(description.createdAt, 'createdAt') // segunda validação
    || validateField(description.rating, 'rating') // terceira validação
    || validateField(description.difficulty, 'difficulty'); // quarta validação
  if (message) return res.status(400).json(message);
  // Se nenhum campo apresentar "erro"
  return next();
};
module.exports = validateDescription;
```

1.  Importe esse middleware no seu arquivo `src/app.js` e valide o campo `price` na rota POST `/activities`.

```javascript
// src/app.js
// ... Importações
const validateDescription = require('./middlewares/validateDescription');
// ... Restante do código
// app.post('/activities',
//   validateName,
//   validatePrice,
  validateDescription,
//   (_req, res) => {
//   res.status(201).json({ message: 'Atividade cadastrada com sucesso!' });
// });
// module.exports = app;
```

1.  Execute a sua aplicação e faça uma requisição para rota `http://localhost:3001/activities` utilizando o método POST e confira se o campo `description` e os seus campos internos estão sendo validados.
2.  Se tudo estiver certo, confira se o teste do requisito 3 está passando com o comando `npm test 03`.

***Requisito 4: Crie um middleware para validar o campo createdAt no formato dd/mm/aaaa***

1.  Crie o arquivo `src/middlewares/validateCreatedAt.js` e adicione o seguinte código:

```javascript
// src/middlewares/validateCreatedAt.js
const validateCreatedAt = (req, res, next) => {
  const { createdAt } = req.body.description;
  // regex utilizado para validar o formato da data
  const isFormatDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  // método para validar a data com o formato do regex
  if (!isFormatDate.test(createdAt)) {
    return res.status(400).json(
      { message: 'O campo createdAt deve ter o formato \'dd/mm/aaaa\'' },
    );
  }
  return next();
};
module.exports = validateCreatedAt;
```

1.  Importe esse middleware no seu arquivo `src/app.js` e valide o campo `createdAt` na rota POST `/activities`.

```javascript
// src/app.js
// ... Importações
const validateCreatedAt = require('./middlewares/validateCreatedAt');
// ... Restante do código
// app.post('/activities',
//   validateName,
//   validatePrice,
//   validateDescription,
  validateCreatedAt,
//   (_req, res) => {
//   res.status(201).json({ message: 'Atividade cadastrada com sucesso!' });
// });
// module.exports = app;
```

1.  Execute a sua aplicação e faça uma requisição para rota `http://localhost:3001/activities` utilizando o método POST e confira se o campo `createdAt` está com o formato correto.
2.  Se tudo estiver certo, confira se o teste do requisito 4 está passando com o comando `npm test 04`.

***Requisito 5: Crie um middleware para validar o campo rating***

1.  Crie o arquivo `src/middlewares/validateRating.js` e adicione o seguinte código:

```javascript
// src/middlewares/validateRating.js
const validateRating = (req, res, next) => {
  const { rating } = req.body.description;
  if (rating === undefined) {
    return res.status(400).json(
      { message: 'O campo rating é obrigatório' },
    );
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json(
      { message: 'O campo rating deve ser um número inteiro entre 1 e 5' },
    );
  }
  return next();
};
module.exports = validateRating;
```

1.  Importe esse middleware no seu arquivo `src/app.js` e valide o campo `rating` na rota POST `/activities`.

```javascript
// src/app.js
// ... Importações
const validateRating = require('./middlewares/validateRating');
// ... Restante do código
// app.post('/activities',
//   validateName,
//   validatePrice,
//   validateDescription,
//   validateCreatedAt,
  validateRating,
//   (_req, res) => {
//   res.status(201).json({ message: 'Atividade cadastrada com sucesso!' });
// });
// module.exports = app;
```

1.  Execute a sua aplicação e faça uma requisição para rota `http://localhost:3001/activities` utilizando o método POST e confira se o campo `rating` está sendo validado.
2.  Se tudo estiver certo, confira se o teste do requisito 5 está passando com o comando `npm test 05`.

***Requisito 6: Crie um middleware para validar o campo difficulty***

1.  Crie o arquivo `src/middlewares/validateDifficulty.js` e adicione o seguinte código:

```javascript
// src/middlewares/validateDifficulty.js
const validateDifficulty = (req, res, next) => {
  const { difficulty } = req.body.description;
  const classifications = ['Fácil', 'Médio', 'Difícil'];
  if (!classifications.includes(difficulty)) {
    return res.status(400).json(
      { message: 'O campo difficulty deve ser \'Fácil\', \'Médio\' ou \'Difícil\'' },
    );
  }
  return next();
};
module.exports = validateDifficulty;
```

1.  Importe esse middleware no seu arquivo `src/app.js` e valide o campo `difficulty` na rota POST `/activities`.

```javascript
// src/app.js
// ... Importações
const validateDifficulty = require('./middlewares/validateDifficulty');
// ... Restante do código
// app.post('/activities',
//   validateName,
//   validatePrice,
//   validateDescription,
//   validateCreatedAt,
//   validateRating,
  validateDifficulty,
//   (_req, res) => {
//   res.status(201).json({ message: 'Atividade cadastrada com sucesso!' });
// });
// module.exports = app;
```

1.  Execute a sua aplicação e faça uma requisição para rota `http://localhost:3001/activities` utilizando o método POST e confira se o campo `difficulty` está sendo validado.
2.  Se tudo estiver certo, confira se o teste do requisito 6 está passando com o comando `npm test 06`.

***Requisito 7: Finalize a implementação da rota POST /activities***

1.  Caso todas as validações tenham sido feitas, esse requisito deverá ser aprovado.
