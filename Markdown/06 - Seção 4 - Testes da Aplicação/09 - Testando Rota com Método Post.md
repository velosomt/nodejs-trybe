# 4.9 - Testando Rota com Método Post

> Seção 4 - Testes da Aplicação · Lição 9 de 13

Vamos testar a rota com o método POST, que, diferentemente do método GET, não apenas consulta os dados, mas também faz alterações neles. Vamos criar a rota e seu respectivo teste, explorando possíveis problemas e soluções.

## Adicionando Rota para Cadastrar Chocolate

Primeiro, vamos adicionar a rota `POST /chocolates`:

```javascript
// src/app.js

// ... Restante do código

app.post('/chocolates', async (req, res) => {
  const { name, brandId } = req.body;

  const cacauFile = await readCacauTrybeFile();

  const createNewId = cacauFile.chocolates.at(-1).id + 1;

  // Adiciona o novo chocolate ao array de chocolates
  cacauFile.chocolates.push({ id: createNewId, name, brandId });

  await writeCacauTrybeFile(cacauFile);

  return res.status(201).json(
    {
      message: 'Chocolate added successfully!',
      chocolate: { name, brandId }
    }
  );
});

// module.exports = app;
```

> **Atenção ⚠️:** Ao fazer a requisição, você alterará as informações que estão no arquivo `cacau.json`. Isso quebrará os seus testes anteriores. Após fazer a requisição e conferir o resultado, volte o arquivo para os dados originais que adicionamos na construção da API.

## Testando a Nova Rota

Agora, vamos construir o teste para essa nova rota:

```javascript
// tests/integration/chocolates.test.js

// ... Restante do código

describe('Usando o método POST em /chocolates para adicionar um novo chocolate', () => {
  test('Adiciona e retorna o novo chocolate', async () => {
    const resultExpected = {
      message: "Chocolate added successfully!",
      chocolate: {
        name: "Truffe",
        brandId: 2
      }
    }

    const response = await request(app)
      .post('/chocolates')
      .send({ name: "Truffe", brandId: 2 })
      .expect(201);

    expect(response.body).toEqual(resultExpected);
  });
});
```

Os testes seguem a mesma estrutura dos anteriores, com duas diferenças principais:

1.  Agora utilizamos o `.post()` para fazer requisições, em vez de `.get()`.
2.  Usamos o `.send()` para enviar o corpo da requisição (nesse caso, `{ name: "Truffe", brandId: 2 }`), simulando o comportamento de uma requisição POST para a API.

Agora, execute os testes com o `npm test`, você verá que os testes passaram com sucesso. Porém, ao executar os testes novamente, o primeiro teste pode falhar, já que o POST adicionou um novo dado ao arquivo `cacau.json`, comprometendo a integridade de outros testes. Dessa forma, precisamos encontrar alternativas para que isso não ocorra.

## Soluções

### Mocks e Dublês de Teste (Test Doubles)

Uma solução é utilizar Mocks ou Dublês de Teste para **simular** funções do módulo `fs`. Dessa forma, podemos fazer o código acreditar que está interagindo com arquivos reais, quando na verdade estamos controlando o comportamento dessas funções, sem alterar de fato o conteúdo do arquivo. Exploraremos esse conceito mais a fundo quando conectarmos a aplicação a um banco de dados, na próxima seção.

### Reversão das alterações após os testes

A solução imediata que adotaremos será a reversão das alterações feitas no arquivo `cacau.json`, assim manteremos a integridade do arquivo e não afetamos outros testes. Para isso, criaremos um novo arquivo de dados de teste em `src/tests/integration/data-test/cacau-test.json` como o seguinte conteúdo:

```json
{
  "brands": [
    {
      "id": 1,
      "name": "Lindt & Sprungli"
    },
    {
      "id": 2,
      "name": "Ferrero"
    },
    {
      "id": 3,
      "name": "Ghirardelli"
    }
  ],
  "chocolates": [
    {
      "id": 1,
      "name": "Mint Intense",
      "brandId": 1
    },
    {
      "id": 2,
      "name": "White Coconut",
      "brandId": 1
    },
    {
      "id": 3,
      "name": "Mon Chéri",
      "brandId": 2
    },
    {
      "id": 4,
      "name": "Mounds",
      "brandId": 3
    }
  ]
}
```

> **De olho na dica 👀:** Perceba que é o mesmo conteúdo que adicionamos no arquivo `cacau.json`.

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   Em vez de chamar `restoreAllMocks` manualmente, dá para configurar `restoreMocks: true` no `jest.config.js`.

**Para o SAP CAP**

-   No CAP raramente se mocka o acesso a dados: o teste usa um banco SQLite em memória carregado dos CSVs. Para voltar ao estado inicial entre testes: `const { data } = cds.test(...); beforeEach(data.reset);`.

</details>

### Alterando nossos Testes

Agora, vamos ajustar nossos testes para usar o novo arquivo `cacau-test.json`, garantindo que as alterações feitas pelo POST não afetem outros testes.

```javascript
// tests/integration/chocolates.test.js

const fs = require('fs');
const path = require('path');

// ... Restante do código

// describe('Usando o método POST em /chocolates para adicionar um novo chocolate', () => {
  const pathFileCacau = path.resolve(__dirname, '..', '..', 'src', 'data', 'cacau.json');
  const pathFileCacauTest = path.resolve(__dirname, 'data-test', 'cacau-test.json');

  const readFileCacauTest = fs.readFileSync(pathFileCacauTest, 'utf8');

  beforeEach(() => {
    fs.writeFileSync(pathFileCacau, readFileCacauTest);
  });

  afterEach(() => {
    fs.writeFileSync(pathFileCacau, readFileCacauTest);
  });

//   test('Adiciona e Retorna o novo chocolate', async () => {
//     const resultExpected = {
//       message: "Chocolate added successfully!",
//       chocolate: {
//         name: "Truffe",
//         brandId: 2
//       }
//     }

//     const response = await request(app)
//       .post('/chocolates')
//       .send({ name: "Truffe", brandId: 2 })
//       .expect(201);

//     expect(response.body).toEqual(resultExpected);
//   });
// });
```

### Entendendo as Alterações

1.  Importamos o módulos `path` e `fs` (sem utilizar o `.promises`);
2.  Definimos os caminhos para os arquivos `cacau.json` e `cacau-test.json` com as constantes `pathFileCacau` e `pathFileCacauTest`.
3.  O conteúdo de `cacau-test.json` é lido na constante `readFileCacauTest`.
    
4.  `beforeEach`:
    
5.  Esse bloco executa um código **antes de cada teste**.
6.  Dentro do `beforeEach`, usamos o `fs.writeFileSync` para sobrescrever o arquivo `cacau.json` com os dados do arquivo `cacau-test.json`, que tem as informações padrão para os testes.
7.  Isso garante que cada teste comece com a mesma base de dados, evitando que um teste influencie o outro. Por exemplo, se um teste adicionar um chocolate, esse dado extra não estará presente no próximo teste, pois o arquivo é restaurado para seu estado original antes do início de cada execução.
    
8.  `afterEach`:
    
9.  Esse bloco executa um código **depois de cada teste**.
10.  Após cada teste, o `afterEach` sobrescreve novamente o arquivo `cacau.json` com os dados do arquivo `cacau-test.json`, revertendo qualquer modificação feita. Isso mantém a integridade dos dados para os testes subsequentes.

> **Anota aí 🖊:** O uso conjunto de `beforeEach` e `afterEach` elimina problemas como inconsistências entre testes que poderiam ocorrer se a base de dados fosse alterada permanentemente por um teste anterior.

Agora, podemos rodar os testes quantas vezes forem necessárias, que não quebraremos outros cenários.

Para fixar os conceitos sobre o conteúdo, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1022293800)
