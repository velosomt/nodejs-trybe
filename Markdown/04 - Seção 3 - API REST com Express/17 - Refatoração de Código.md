# 3.17 - Refatoração de Código

> Seção 3 - API REST com Express · Lição 17 de 20

Para finalizarmos a implementação da nossa API, podemos aplicar uma refatoração para melhorar a legibilidade do nosso código e evitar repetição de lógica em diferentes partes da aplicação.

Vamos tomar como exemplo o uso das funções `fs.readFile` e `fs.writeFile`. Perceba que essas operações se repetem em várias rotas. Para otimizar nosso código e centralizar essa lógica, criaremos duas funções que servirão para leitura e escrita de arquivos, com foco no arquivo teams.json.

Primeiro, crie um novo arquivo em `src/util/readAndWriteFile.js` com o seguinte conteúdo:

```javascript
// src/util/readAndWriteFile.js

const fs = require('fs').promises;
const path = require('path');

const pathFileTeams = path.resolve(__dirname, '..', 'data', 'teams.json');

const readFile = async () => {
  const readTeamsFile = await fs.readFile(pathFileTeams, 'utf8');
  const teams = JSON.parse(readTeamsFile);

  return teams;
}

const writeFile = async (teams) => {
  await fs.writeFile(pathFileTeams, JSON.stringify(teams, null, 2)
  );
}

module.exports = {
  readFile,
  writeFile,
}
```

### Refatorando o Código Existente

Agora que temos funções específicas para leitura e escrita de arquivos, podemos simplificar o código dentro de `teamsRouter.js`, removendo as repetições do uso de `fs` e `path`. Além disso, renomeamos as funções para `readFile` e `writeFile`, deixando nítido o que elas fazem, mas não vá confundir com os métodos originas do módulo `fs`.

Vamos ver como podemos refatorar a rota POST:

```javascript
// src/routes/teamsRouter.js

// Outras importações

const { readFile, writeFile } = require('../util/readAndWriteFile');

// const router = express.Router();

router.post('/', validateTeam, async (req, res) => {
  const { name, initials } = req.body;

  // Utilizamos a função readFile que criamos
  const teams = await readFile();

  const createNewId = teams.at(-1).id + 1;

  teams.push({ id: createNewId, name, initials });

  // Utilizamos a função writeFile que criamos
  await writeFile(teams);

  return res.status(201).json({ message: 'Team added successfully!' });
});

// ... Outras rotas da aplicação

// module.exports = router;
```

### Detalhando as alterações

-   **Reutilização de código:** Com a criação das funções `readFile` e `writeFile`, removemos a necessidade de duplicar a lógica de leitura e escrita em múltiplas rotas.
    
-   **Código mais limpo e organizado:** Agora, o arquivo `teamsRouter.js` está mais enxuto e fácil de entender.
    
-   **Manutenção facilitada:** Se o formato do arquivo `teams.json` mudar no futuro por exemplo, precisaremos ajustar a lógica de leitura e escrita em apenas um lugar.
    

Você pode aplicar a mesma abordagem para refatorar as outras rotas, como GET, PUT e DELETE, utilizando as funções criadas para manter a consistência em todo o projeto.

## Estrutura Final do Projeto

Com toda a implementação feita, a nossa estrutura final será essa:

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
├── ├── util/
│   │   ├── readAndWriteFile.js
│   ├── app.js
│   └── server.js
├── package-lock.json
├── package.json
└── .gitignore
```

Com isso, garantimos uma estrutura modular e bem organizada, facilitando futuras manutenções e extensões da aplicação.

Assista ao vídeo abaixo para reforçar seus conhecimentos sobre o roteamento e refatoração no Express!

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1022293691)
