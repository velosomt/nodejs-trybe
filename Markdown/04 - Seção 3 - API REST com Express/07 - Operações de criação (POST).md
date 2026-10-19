# 3.7 - Operações de criação (POST)

> Seção 3 - API REST com Express · Lição 7 de 20

Agora que já entendemos o método GET, vamos falar sobre o método POST, que é amplamente utilizado para criação de novos recursos no servidor. Diferente do GET, o POST nos permite enviar dados no corpo da requisição (body) e armazená-los.

## Criando o endpoint POST

Agora, vamos adicionar uma nova rota POST para permitir que adicionemos novos times ao arquivo `teams.json`. Confira o código abaixo:

```javascript
// src/app.js

// ...

// const app = express();

app.use(express.json());

// ...

app.post('/teams', async (req, res) => {
  const { name, initials } = req.body;

  const readTeamsFile = await fs.readFile(path.resolve(__dirname, 'data', 'teams.json'), 'utf8');
  const teams = JSON.parse(readTeamsFile);

  // Cria novo Id para o time
  const createNewId = teams.at(-1).id + 1;

  // Adiciona o novo time ao array
  teams.push({ id: createNewId, name, initials });

  // Escreve o array atualizado de volta no arquivo
  await fs.writeFile(path.resolve(__dirname, 'data', 'teams.json'), JSON.stringify(teams, null, 2));

  return res.status(201).json({ message: 'Team added successfully!' });
});

// module.exports = app;
```

### Entendendo o código

Vamos destrinchar o que está acontecendo neste código:

1.  `express.json()`: O Express precisa entender o corpo da requisição que estamos enviando no formato JSON. Para isso, utilizamos o middleware `express.json()`, que faz com que o `body` da requisição seja convertido automaticamente para um objeto JavaScript. Sem ele não conseguimos ter acesso ao conteúdo que chega no `body`.

> **Anota aí 📝:** Middlewares são elementos muito importantes no contexto de Node, iremos nos aprofundar neste conceito mais a frente no conteúdo.

1.  A rota `POST /teams`: Esta rota recebe os dados de um novo time através do `req.body`. O corpo da requisição contém as propriedades `name` e `initials`, que são usadas para criar um novo objeto de time.
    
2.  Leitura e escrita no arquivo `teams.json`:
    
3.  Usamos o `fs.readFile` para ler o arquivo `teams.json` e convertê-lo para um array utilizando `JSON.parse`.
4.  O ID do novo time é gerado dinamicamente com base no último time existente no array, incrementando o ID com `teams.at(-1).id + 1`.
5.  O novo time é adicionado ao array existente com o método `push`.
6.  Por fim, usamos o `fs.writeFile` para gravar o array atualizado de volta no arquivo `teams.json`. O método `JSON.stringify` é usado para converter o array de objetos para o formato JSON:
    
    -   O primeiro parâmetro do `JSON.stringify` é o array que será convertido.
    -   O segundo parâmetro (nulo) indica que não faremos nenhuma modificação nos dados.
    -   O terceiro parâmetro define o espaçamento da indentação, neste caso, 2 espaços, para tornar o arquivo legível.
7.  `Resposta HTTP`: O *status code* `201` Created é o mais adequado para indicar que um novo recurso foi criado com sucesso no servidor.
    

> **Anota aí 🖊:** O *status code* 201 Created é o mais comum e adequado para indicar a criação bem-sucedida de um novo recurso.

## Testando o endpoint

Para testar essa funcionalidade, continue a usar um API Client como Postman, Insomnia ou ThunderClient. Aqui está um exemplo de como enviar uma requisição POST para criar um novo time:

-   `URL`: http://localhost:3001/teams
-   `Método`: POST
-   Body no formato JSON e com os seguintes dados:

```json
{
  "name": "Bahia",
  "initials": "BAH"
}
```

A resposta que receberemos será algo assim:

```json
{
  "message": "Team added successfully!"
}
```

Após a requisição, ao verificar o conteúdo do arquivo `teams.json`, você verá que o time "Bahia" foi adicionado ao final do array de times.

Para consolidar o conhecimento, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1022283725)

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   Para gerar IDs únicos, use o nativo `crypto.randomUUID()` (global no Node 19+) em vez de calcular a partir do tamanho da lista.
-   No Express 5, sem `app.use(express.json())` o `req.body` fica `undefined` (no 4 era `{}`).

**Para o SAP CAP**

-   No CAP o POST é automático. Para gerar ID use o aspect `cuid` (`entity Teams : cuid { ... }`) e, para lógica antes de gravar, `this.before('CREATE', 'Teams', (req) => { ... })` com os dados em `req.data`.

</details>
