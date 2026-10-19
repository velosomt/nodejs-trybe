# 3.11 - Exercício Movie JSON CRUD

> Seção 3 - API REST com Express · Lição 11 de 20

Para este exercício, você vai criar uma API de filmes utilizando Node & Express. Você irá desenvolver um servidor express onde seja possível acessar todos os endpoints da aplicação (CRUD).

## Combinados

Para fazer o exercício, acesse esse repositório ➡️ [Exercício Movie JSON CRUD](https://github.com/learnwithtrybe/flex-node-01-exercise-movie-json-crud).

Leia o arquivo `README.md` do repositório com ⚠️ atenção ⚠️ para saber como desenvolver e entregar seu exercício.

**Solução**

***Requisito 1: Crie um servidor Node.js utilizando o framework Express***

1.  Faça a instalação de todas as dependências que já estão no exercício com `npm install`
2.  Crie o arquivo `src/server.js` e adicione o seguinte código:

```javascript
const app = require('./app');
const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
```

1.  Faça a instalação do `nodemon` para facilitar o desenvolvimento do projeto:

```bash
npm i nodemon@2.0.15 --save-dev --save-exact
```

1.  Altere o package.json para utilizar o `nodemon` e o `node`:

```json
// package.json
"start": "node src/server.js",
"dev": "nodemon src/server.js",
```

1.  Confira se a sua aplicação fica ativa com o comando `npm run dev`.
2.  Se tudo estiver certo, confira se o teste do requisito 1 está passando com o comando `npm test 01`.

***Requisito 2: Crie um endpoint para a listagem de um filme pelo seu id***

1.  Adicione o seguinte código no arquivo `src/app.js`.

```javascript
// src/app.js
// const express = require('express');
const fs = require('fs').promises;
const path = require('path');
// const app = express();
const filePath = path.resolve(__dirname, 'movies.json');
app.get('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const readMoviesFile = await fs.readFile(filePath, 'utf8');
  const movies = JSON.parse(readMoviesFile);
  const movieFound = movies.find((movie) => movie.id === Number(id));
  if (!movieFound) return res.status(404).json({ message: 'Filme não encontrado' });
  return res.status(200).json(movieFound);
});
// module.exports = app;
```

1.  Execute a sua aplicação e faça uma requisição para rota `http://localhost:3001/movies/1` para retornar o filme de id 1.
2.  Execute a sua aplicação e faça uma requisição para rota `http://localhost:3001/movies/99` para retornar a mensagem 'Filme não encontrado'.
3.  Se tudo estiver certo, confira se o teste do requisito 2 está passando com o comando `npm test 02`.

***Requisito 3: Crie um endpoint que possa listar todos os filmes do JSON***

1.  Adicione o seguinte código no arquivo `src/app.js`

```javascript
// src/app.js
// ... Restante do código
app.get('/movies', async (_req, res) => {
  const readMoviesFile = await fs.readFile(filePath, 'utf8');
  const movies = JSON.parse(readMoviesFile);
  return res.status(200).json(movies);
});
// module.exports = app;
```

1.  Execute a sua aplicação e faça uma requisição para rota `http://localhost:3001/movies` para retornar todos os filmes.
2.  Se tudo estiver certo, confira se o teste do requisito 3 esta passando com o comando `npm test 03`.

***Requisito 4: Crie um endpoint para cadastrar um filme***

1.  Adicione o seguinte código no arquivo `src/app.js`

```javascript
// src/app.js
// ... Importações
app.use(express.json());
// ... Restante do código
app.post('/movies', async (req, res) => {
  const { movie, price } = req.body;
  const readMoviesFile = await fs.readFile(filePath, 'utf8');
  const movies = JSON.parse(readMoviesFile);
    // Cria novo Id para o filme
  const createNewId = movies.at(-1).id + 1;
  // Adiciona o novo filme ao array
  movies.push({ id: createNewId, movie, price });
  // Escreve o array atualizado de volta no arquivo
  await fs.writeFile(filePath, JSON.stringify(movies, null, 2));
  return res.status(201).json({ id: createNewId, movie, price });
});
// module.exports = app;
```

1.  Execute a sua aplicação e faça uma requisição para rota `http://localhost:3001/movies` utilizando o método POST.
2.  Confira se o teste do requisito 4 está passando com o comando `npm test 04`.

***Requisito 5: Crie um endpoint para a atualização de um filme***

1.  Adicione o seguinte código no arquivo `src/app.js`

```javascript
// src/app.js
// ... Restante do código
app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { movie, price } = req.body;
  const readMoviesFile = await fs.readFile(filePath, 'utf8');
  const movies = JSON.parse(readMoviesFile);
  // Procura pelo índice do filme com base no Id
  const movieIndex = movies.findIndex((mov) => mov.id === Number(id));
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Filme não encontrado' });
  }
  // Substitui completamente o filme
  movies[movieIndex] = { id: Number(id), movie, price };
  await fs.writeFile(filePath, JSON.stringify(movies, null, 2));
  return res.status(200).json(movies[movieIndex]);
});
// module.exports = app;
```

1.  Execute a sua aplicação e faça uma requisição para rota `http://localhost:3001/movies/2` utilizando o método PUT.
2.  Confira se o teste do requisito 5 está passando com o comando `npm test 05`.

***Requisito 6: Crie um endpoint para a exclusão de um filme***

1.  Adicione o seguinte código no arquivo `src/app.js`

```javascript
// src/app.js
// ... Restante do código
app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const readMoviesFile = await fs.readFile(filePath, 'utf8');
  const movies = JSON.parse(readMoviesFile);
  const movieIndex = movies.findIndex((mov) => mov.id === Number(id));
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Filme não encontrado' });
  }
  // Remove o filme do array
  movies.splice(movieIndex, 1);
  await fs.writeFile(filePath, JSON.stringify(movies, null, 2));
  return res.status(200).json({ message: 'Filme deletado com sucesso' });
});
// module.exports = app;
```

1.  Execute a sua aplicação e faça uma requisição para rota `http://localhost:3001/movies/1` utilizando o método DELETE.
2.  Faça uma requisição para rota `http://localhost:3001/movies/1` utilizando o método GET, para confirmar a remoção do Filme.
3.  Confira se o teste do requisito 6 está passando com o comando `npm test 06`.

Parabéns pela conclusão do exercício!
