# 3.5 - Operações de leitura (GET)

> Seção 3 - API REST com Express · Lição 5 de 20

Vamos começar a utilizar os métodos do CRUD, iniciando pelo método GET, que é o mais comumente usado para **buscar informações** do servidor.

## Estrutura do Projeto

Primeiro, vamos adicionar um arquivo `teams.json` dentro na pasta `src/data/`. Confira abaixo como ficará a estrutura do projeto:

```bash
.
├── node_modules/
├── src/
├── ├── data/
│   │   ├── teams.json
│   ├── app.js
│   └── server.js
├── package-lock.json
├── package.json
└── .gitignore
```

Agora adicione o seguinte conteúdo em `teams.json`:

```json
[
  {
    "id": 1,
    "name": "Avaí/Kindermann",
    "initials": "AVA"
  },
  {
    "id": 2,
    "name": "Ferroviária",
    "initials": "FER"
  },
  {
    "id": 3,
    "name": "Napoli-SC",
    "initials": "NAP"
  }
]
```

Por fim, modifique o seu script `dev` no `package.json` para que o nodemon ignore quaisquer alterações que forem feitas no `teams.json`:

```json
// package.json
"dev": "nodemon src/server.js --ignore src/data/teams.json",
```

## Criando o Endpoint GET

Agora, vamos criar um endpoint do tipo `GET` com a rota `/teams`, que irá fazer a **leitura** do arquivo `teams.json` e retornar os dados. Veja o código:

```javascript
// src/app.js

// const express = require('express');
const fs = require('fs').promises;
const path = require('path');

// const app = express();

// app.get('/', (req, res) => res.status(200).json({ message: 'Hello, World!' }));

app.get('/teams', async (req, res) => {

  // Leitura do arquivo teams.json
  const readTeamsFile = await fs.readFile(path.resolve(__dirname, 'data', 'teams.json'), 'utf8');
  const teams = JSON.parse(readTeamsFile);

  return res.status(200).json({ teams })
});

// module.exports = app;
```

### Entendendo o código

Vamos destrinchar o que está acontecendo neste código:

1.  Importamos o módulo `fs` para realizar a leitura do arquivo `teams.json` de forma assíncrona;
2.  O módulo `path` nos ajuda a encontrar o caminho até o arquivo `teams.json`;
3.  A constante `readTeamsFile` recebe o conteúdo do arquivo `teams.json` utilizando `fs.readFile()`, que retorna uma **string** com o conteúdo do arquivo. Para ler o arquivo corretamente, usamos `path.resolve()` para indicar o caminho correto do arquivo.
4.  Como o conteúdo do arquivo é retornado como uma **string**, usamos `JSON.parse()` para converter essa string em um **array de objetos** JavaScript que podemos manipular.

> Quando lemos um arquivo **JSON** usando `fs`, o conteúdo é lido como uma **string**. Para transformá-lo em um objeto ou array JavaScript, usamos `JSON.parse()`.

1.  Depois de ler e converter os dados, retornamos o array de times dentro de um objeto JSON como resposta da requisição com o status `200` (sucesso).

Para ver a lista de times, certifique-se de que o servidor está rodando e acesse a URL `http://localhost:3001/teams` em seu API Client.

Para consolidar o conhecimento, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1022283636)

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   Ler o arquivo JSON a cada requisição é didático; em aplicação real os dados ficam em banco (seção 5).

**Para o SAP CAP**

-   No CAP o CRUD inteiro das seções 3.5 a 3.9 é **gerado a partir do modelo** — não se escreve rota GET/POST/PUT/PATCH/DELETE. Os dados iniciais vêm de um CSV e rodam em SQLite em memória no `cds watch`.
-   Endpoints resultantes: `GET /odata/v4/teams/Teams`, `GET /odata/v4/teams/Teams(1)`, `POST`, `PATCH`, `PUT` e `DELETE` no mesmo recurso.

```cds
// db/schema.cds
namespace soccer;

entity Teams {
  key ID   : Integer;
  name     : String(100);
  initials : String(3);
}

// srv/teams-service.cds
using soccer from '../db/schema';

service TeamsService {
  entity Teams as projection on soccer.Teams;
}

// db/data/soccer-Teams.csv
// ID;name;initials
// 1;Avaí/Kindermann;AVA
```

</details>
