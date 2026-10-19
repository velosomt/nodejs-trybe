# 3.13 - Evoluindo Aplicações com Middlewares

> Seção 3 - API REST com Express · Lição 13 de 20

Ao construir uma aplicação Express, o uso de middlewares permite adicionar funcionalidades cruciais que podem ser aplicadas em várias partes da aplicação, como validações, manipulação de dados e autenticação. Uma maneira poderosa de inserir middlewares de forma global é com o método `app.use()`.

## O que é o app.use()?

O método `app.use()` é utilizado para definir middlewares que serão aplicados em todas as rotas subsequentes da aplicação. Ou seja, qualquer requisição que passar pelo servidor vai atravessar os middlewares definidos por `app.use()` antes de chegar ao seu destino. Isso inclui middlewares para logging, tratamento de erros, autenticação, entre outros.

```javascript
// src/app.js

// ... Importações

// app.get('/', (req, res) => res.status(200).json({ message: 'Hello, World!' }));

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Passa para o próximo middleware ou rota
});

// ... Rotas da aplicação

// module.exports = app;
```

### Como o app.use() funciona?

Neste exemplo, o middleware definido pelo `app.use()` faz um log da requisição (`console.log(${req.method} ${req.url})`) antes de passar para a próxima função ou rota. Isso significa que toda vez que uma requisição for feita, esse log será exibido no console.

Porém, a rota `/` que retorna o famoso `Hello, World!`, foi declarada antes do middleware de log, o que significa que ela não será afetada pelo log e será executada diretamente.

> **De olho na dica 👀:** Faça novamente as requisições para a sua API e confira os logs que aparecerão no terminal da sua aplicação.

### Quando utilizar app.use()?

O `app.use()` é útil quando você deseja aplicar o mesmo middleware em várias rotas, sem precisar especificá-lo individualmente. Alguns exemplos comuns incluem:

-   **Autenticação:** Garantir que a pessoa usuária está autenticada em várias rotas.
-   **Validação de Dados:** Aplicar validações globais de dados.
-   **Tratamento de Erros:** Capturar e tratar erros de forma centralizada.

## O Papel do app.use(express.json())

Agora, um caso muito comum de uso do `app.use()` é a configuração do middleware `express.json()`. Esse middleware é essencial para permitir que o Express parseie (interprete) o corpo das requisições no formato JSON, disponibilizando os dados no objeto `req.body`.

```javascript
// src/app.js

// ...

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ... Rotas da aplicação

// Rota POST para criar um novo time
app.post('/teams', validateTeam, async (req, res) => {
  const { name, initials } = req.body; // Dados do time enviados via JSON

  // Lógica para criar o time
});

// Rota PUT para atualizar um time existente
app.put('/teams/:id', validateTeam, async (req, res) => {
  // const { id } = req.params;
  const { name, initials } = req.body; // Dados do time enviados via JSON

  // Lógica para atualizar o time
});

// module.exports = app;
```

### O que express.json() faz?

Quando utilizamos `app.use(express.json())`, esse middleware é aplicado logo no início da aplicação, permitindo que todas as rotas abaixo dele possam acessar o conteúdo do corpo das requisições via `req.body`. Sem ele, o corpo da requisição JSON não seria automaticamente convertido para um objeto JavaScript, tornando-se inacessível no `req.body`.

Por isso, ao enviar uma requisição `POST` para a rota `/teams` com o seguinte corpo:

```json
{
  "name": "São Paulo Futebol Clube",
  "initials": "SAO"
}
```

O Express vai interpretar esse JSON, e o `req.body` conterá o seguinte objeto:

```javascript
{
  name: 'São Paulo Futebol Clube',
  initials: 'SAO'
}
```

Dessa forma, o middleware `express.json()` facilita o processamento de dados em formato JSON, tornando-o indispensável para APIs modernas que manipulam esse tipo de conteúdo.

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   O curso já usa `express.json()` (correto; o pacote `body-parser` separado não é mais necessário). No Express 5, `express.urlencoded()` passa a usar `extended: false` por padrão.
-   Para logs de requisição, veja a OBS da lição 8.6.

**Para o SAP CAP**

-   No CAP o parse do body, o 404 de rota inexistente e os logs básicos já são feitos pelo framework.

</details>

## Tratando Rotas Não Encontradas com um Middleware Global

Por fim, é comum em aplicações Express a necessidade de lidar com rotas que não existem. Para isso, podemos utilizar um middleware global no final da cadeia de middlewares, que será acionado quando nenhuma rota anterior tiver respondido à requisição.

```javascript
// src/app.js

// ... Restante do código

// Middleware para rotas não encontradas
app.use((_req, res) => res.status(404).json({ message: 'Route Not Found!'}));

// module.exports = app;
```

Para conferir se este middleware esta funcionando, você pode acessar uma rota que não existe. Por exemplo, a URL `http://localhost:3001/testando`.

> **De olho na dica 👀:** O uso de `_req` (com "\_" no início) indica que o parâmetro `req` não será utilizado diretamente no middleware. Essa é uma convenção em JavaScript para deixar claro que, embora o parâmetro esteja disponível, ele não será necessário. Dessa forma, evitamos erros de linting ou warnings de variáveis não utilizadas.
