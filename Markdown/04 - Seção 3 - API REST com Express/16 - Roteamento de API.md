# 3.16 - Roteamento de API

> Seção 3 - API REST com Express · Lição 16 de 20

Agora que chegamos até aqui, você pode estar pensando: "Com todas essas rotas, meu arquivo principal vai ficar enorme!" 😱

Não se preocupe! O Express nos oferece uma maneira eficiente de organizar as rotas e os middlewares: o `Router`.

O `Router` é como uma mini aplicação dentro do Express, permitindo agrupar rotas de forma modular e fácil de gerenciar. Após isso, ele é conectado ao aplicativo principal, o que ajuda a manter o código mais limpo e organizado.

## Vamos ver como organizar o nosso código na prática

```javascript
// src/app.js

const express = require('express');

// Importa o nosso arquivo de rotas
const teamsRouter = require('./routes/teamsRouter');

const app = express();

app.use(express.json());

app.get('/', (_req, res) => res.status(200).json({ message: 'Hello, World!' }));

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Conecta o Router na rota '/teams'
app.use('/teams', teamsRouter);

app.use((_req, res) => res.status(404).json({ message: 'Route Not Found!'}));

app.use((error, _req, res, _next) => {
  return res.status(500).json({ error: error.message });
});

module.exports = app;
```

Agora, crie um diretório `routes` e o arquivo `teamsRouter.js`. Veja abaixo como deve ficar:

```javascript
// src/routes/teamsRouter.js

const express = require('express');
const fs = require('fs').promises;
const path = require('path');

// O require é relativo ao arquivo em que ele se encontra, então o caminho muda ligeiramente
const validateTeam = require('../middlewares/validateTeam');

// Cria um router middleware
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // Mudar em todas as rotas o caminho do 'path'
    const readTeamsFile = await fs.readFile(path.resolve(__dirname, '..', 'data', 'teams.json'), 'utf8');
    const teams = JSON.parse(readTeamsFile);

    return res.status(200).json({ teams });
  } catch (error) {
    return next(error);
  }
});

router.get('/search', async (req, res) => {
  const { filterTeamByInitial } = req.query;

  const readTeamsFile = await fs.readFile(path.resolve(__dirname, '..', 'data', 'teams.json'), 'utf8');
  const teams = JSON.parse(readTeamsFile);

  const filterTeams = teams.filter((team) => team.initials.includes(filterTeamByInitial));

  return res.status(200).json(filterTeams);
});

router.get('/:teamId', async (req, res) => {
  const { teamId } = req.params;

  const readTeamsFile = await fs.readFile(path.resolve(__dirname, '..', 'data', 'teams.json'), 'utf8');
  const teams = JSON.parse(readTeamsFile);

  const findTeam = teams.find((team) => team.id === Number(teamId));

  return res.status(200).json(findTeam);
});

router.post('/', validateTeam, async (req, res) => {
  const { name, initials } = req.body;

  const readTeamsFile = await fs.readFile(path.resolve(__dirname, '..', 'data', 'teams.json'), 'utf8');
  const teams = JSON.parse(readTeamsFile);

  const createNewId = teams.at(-1).id + 1;

  teams.push({ id: createNewId, name, initials });

  await fs.writeFile(path.resolve(__dirname, '..', 'data', 'teams.json'), JSON.stringify(teams, null, 2));

  return res.status(201).json({ message: 'Team added successfully!' });
});

router.put('/:id', validateTeam, async (req, res) => {
  const { id } = req.params;
  const { name, initials } = req.body;

  const readTeamsFile = await fs.readFile(path.resolve(__dirname, '..', 'data', 'teams.json'), 'utf8');
  const teams = JSON.parse(readTeamsFile);


  const teamIndex = teams.findIndex((team) => team.id === Number(id));

  if (teamIndex === -1) {
    return res.status(404).json({ message: 'Team Not Found!' });
  }

  teams[teamIndex] = { id: Number(id), name, initials };

  await fs.writeFile(path.resolve(__dirname, '..', 'data', 'teams.json'), JSON.stringify(teams, null, 2));

  return res.status(200).json({ message: 'Team updated successfully!' });
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, initials } = req.body;

  const readTeamsFile = await fs.readFile(path.resolve(__dirname, '..', 'data', 'teams.json'), 'utf8');
  const teams = JSON.parse(readTeamsFile);

  const teamIndex = teams.findIndex((team) => team.id === Number(id));

  if (teamIndex === -1) {
    return res.status(404).json({ message: 'Team not found' });
  }

  if (name) teams[teamIndex].name = name;
  if (initials) teams[teamIndex].initials = initials;

  await fs.writeFile(path.resolve(__dirname, '..', 'data', 'teams.json'), JSON.stringify(teams, null, 2));

  return res.status(200).json({ message: 'Team partially updated successfully!' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const readTeamsFile = await fs.readFile(path.resolve(__dirname, '..', 'data', 'teams.json'), 'utf8');
  const teams = JSON.parse(readTeamsFile);

  const teamIndex = teams.findIndex((team) => team.id === Number(id));

  if (teamIndex === -1) {
    return res.status(404).json({ message: 'Team Not Found!' });
  }

  teams.splice(teamIndex, 1);

  await fs.writeFile(path.resolve(__dirname, '..', 'data', 'teams.json'), JSON.stringify(teams, null, 2));

  return res.status(204).end();
});

module.exports = router;
```

### Detalhes importantes

1.  **Modularização das rotas:** No arquivo `app.js`, usamos `app.use('/teams', teamsRouter)` para dizer ao Express que todas as rotas começando com `/teams` devem ser tratadas pelo `teamsRouter`. Isso evita repetição de código.
    
2.  **Concisão nas rotas:** No arquivo `teamsRouter.js`, a rota `/teams/:id` é configurada como `router.get('/:id')`, já que a parte inicial `/teams` já foi registrada no `app.js` => (`app.use('/teams', teamsRouter)`).
    
3.  **Middlewares dentro do Router:** O `Router` suporta middlewares, como o `validateTeam`, para validar dados antes de prosseguir para a lógica principal da rota. Isso permite criar rotas protegidas ou aplicáveis a grupos específicos de rotas.
    

## Estrutura atual do Projeto

Com toda a implementação até aqui, a nossa estrutura final será essa:

```bash
.
├── node_modules/
├── src/
├── ├── data/
│   │   ├── teams.json
├── ├── middlewares/
│   │   ├── validateTeam.js
├── ├── routes/
│   │   ├── teamsRouter.js
│   ├── app.js
│   └── server.js
├── package-lock.json
├── package.json
└── .gitignore
```

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   No CAP não há `express.Router`: cada `service` CDS vira um conjunto de endpoints. O caminho padrão é derivado do nome (`TeamsService` → `/odata/v4/teams`) e pode ser alterado com `@path: '/teams'`.

</details>
