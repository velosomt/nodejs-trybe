# 3.6 - Query Strings e URL Parameters

> Seção 3 - API REST com Express · Lição 6 de 20

Quando trabalhamos com requisições GET em APIs, pode ser necessário enviar informações adicionais. No Express, isso é possível através de *query strings* e *URL parameters*, duas formas de passar dados na URL.

## URL Parameters

Os `URL Parameters` são partes variáveis da URL que identificam recursos específicos. Eles são definidos usando `:param` na rota e são úteis quando queremos acessar um recurso específico, como um item por seu ID.

Confira o exemplo abaixo:

```javascript
// src/app.js

// ...

app.get('/teams/:id', async (req, res) => {
  const { id } = req.params;

  const readTeamsFile = await fs.readFile(path.resolve(__dirname, 'data', 'teams.json'), 'utf8');
  const teams = JSON.parse(readTeamsFile);

  const findTeam = teams.find((team) => team.id === Number(id));

  return res.status(200).json(findTeam);
});

// module.exports = app;
```

Neste exemplo, criamos uma rota `/teams/:id`, onde `:id` é um parâmetro dinâmico. Se acessarmos a rota com `http://localhost:3001/teams/1`, o valor de `id` será `'1'`. Como esse valor é passado como **string**, fazemos a conversão para número com `Number(id)` para encontrar o time correspondente. O resultado deste endpoint será:

```json
{
  "id": 1,
  "name": "Avaí/Kindermann",
  "initials": "AVA"
}
```

O formato `:id` é comum quando buscamos informações por uma propriedade única, como o ID. Contudo, você pode utilizar outro nome para o parâmetro, como `:teamId`, e a lógica continuaria a mesma.

```javascript
// src/app.js

// ...

app.get('/teams/:teamId', async (req, res) => {
  const { teamId } = req.params;

  // const readTeamsFile = await fs.readFile(path.resolve(__dirname, 'data', 'teams.json'), 'utf8');
  // const teams = JSON.parse(readTeamsFile);

  const findTeam = teams.find((team) => team.id === Number(teamId));

//   return res.status(200).json(findTeam);
// });

// module.exports = app;
```

Perceba que só alteramos as referências de `id` para `teamId`, mantendo o restante do código intacto.

## Query String

As *query strings* são parâmetros que passamos diretamente na URL, após o símbolo `?`, em formato de pares chave-valor. Elas são úteis para buscar ou filtrar dados.

Veja o exemplo abaixo, onde filtramos os times pelas suas iniciais:

```javascript
// src/app.js

// ...

app.get('/teams/search', async (req, res) => {
  const { filterTeamByInitial } = req.query;

  const readTeamsFile = await fs.readFile(path.resolve(__dirname, 'data', 'teams.json'), 'utf8');
  const teams = JSON.parse(readTeamsFile);

  const filterTeams = teams.filter((team) => team.initials.includes(filterTeamByInitial));

  return res.status(200).json(filterTeams);
});

// module.exports = app;
```

Aqui, podemos acessar a rota `http://localhost:3001/teams/search?filterTeamByInitial=A`. O resultado será uma lista de times cuja chave `initials` contenha a letra 'A':

> **Atenção ⚠️:** Caso não retorne nenhuma informação, continue a leitura do conteúdo.

```json
[
  {
    "id": 1,
    "name": "Avaí/Kindermann",
    "initials": "AVA"
  },
  {
    "id": 3,
    "name": "Napoli-SC",
    "initials": "NAP"
  }
]
```

Vamos entender o que temos nessa rota:

1.  `http://localhost:3001/teams/search`: Esse é o caminho do nosso endpoint;
2.  `?`: Indica o início da *query string*;
3.  `filterTeamByInitial=A`: Nome da *query string* e seu valor.

Essa abordagem permite filtrar os times com base nas iniciais e que tenham pelo menos uma letra `A`.

## Cuidado com a ordem das rotas

Ao adicionar a rota `/teams/search`, é importante prestar atenção à **ordem** das rotas. Se a rota `/teams/:teamId` estiver acima da rota `/teams/search`, pode ocorrer um problema, pois o Express tratará search como se fosse um `teamId`. Isso acontece porque a rota `/teams/:teamId` captura qualquer valor após `/teams/`.

Se tivermos o seguinte código:

```javascript
app.get('/teams/:teamId', async (req, res) => {
  // código da rota
});

app.get('/teams/search', async (req, res) => {
  // código da rota
});
```

Ao tentar acessar a rota `http://localhost:3001/teams/search`, o Express entenderá search como o valor de `:teamId`, resultando em um erro. Para evitar isso, a rota `/teams/search` deve vir antes de `/teams/:teamId`, igual abaixo:

```javascript
app.get('/teams/search', async (req, res) => {
  // código da rota
});

app.get('/teams/:teamId', async (req, res) => {
  // código da rota
});
```

Dessa forma, o Express verificará primeiro a rota `/teams/search` e só buscará a rota dinâmica `/teams/:teamId` se nenhuma outra rota combinar.

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   No Express 5 a sintaxe de rota mudou: parâmetro opcional é `/teams{/:id}` e curinga precisa de nome (`/*splat`). Rotas simples como `/teams/:teamId` não mudam. A regra de ordem das rotas continua valendo.

**Para o SAP CAP**

-   No CAP (OData V4) os equivalentes são padronizados: chave na URL `/Teams(1)` e filtros com opções de consulta como `?$filter=contains(initials,'A')`, `$select`, `$orderby`, `$top`, `$skip`, `$expand` — sem escrever código para cada filtro.

</details>

## Quando usar Query Strings ou URL Parameters?

-   **URL Parameters:** São usados para identificar recursos específicos (como IDs de usuários, produtos, ou artigos).
    
-   **Query Strings:** São ideais para enviar dados opcionais ou filtros em uma busca (como paginação, ordenação, e palavras-chave).
    

Para consolidar o conhecimento, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1022283667)
