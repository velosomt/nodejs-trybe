# 4.6 - Construindo a nossa API

> Seção 4 - Testes da Aplicação · Lição 6 de 13

## Estrutura do Projeto

Para iniciar nosso projeto, crie uma pasta chamada `cacau-trybe` e, dentro dela, organize a seguinte estrutura:

```bash
.
├── src/
│   ├── data/
│   │   └── cacau.json
│   ├── util/
│   │   └── readAndWriteFile.js
│   ├── app.js
│   └── server.js
├── tests/
│   └── integration/
│       └── chocolates.test.js
└── package.json
```

> **Atenção ⚠️:** Não iremos utilizar o `Router` do Express, para facilitar a compreensão do conteúdo. Lembramos, porém, que ele é importante para o gerenciamento e organização das nossas rotas.

### Instalando Dependências

Vamos instalar o Express para gerenciar nossos endpoints, e o Nodemon para facilitar o desenvolvimento:

```bash
npm install express@4.17.1 --save-exact && npm i nodemon@2.0.15 --save-dev --save-exact
```

### Dados Iniciais

Agora, preencha o arquivo `src/data/cacau.json` com o seguinte conteúdo. Obs: ele contém duas chaves principais: `brands` e `chocolates`.

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

### Funções para Ler e Escrever Arquivos

Vamos criar funções para leitura e escrita no arquivo `cacau.json`:

```javascript
// src/util/readAndWriteFile.js

const fs = require('fs').promises;
const path = require('path');

const pathFileCacau = path.resolve(__dirname, '..', 'data', 'cacau.json');

const readCacauTrybeFile = async () => {
  const readCacauFile = await fs.readFile(pathFileCacau, 'utf8');
  const cacauResult = JSON.parse(readCacauFile);

  return cacauResult;
}

const writeCacauTrybeFile = async (chocolate) => {
  await fs.writeFile(pathFileCacau, JSON.stringify(chocolate, null, 2));
}

module.exports = {
  readCacauTrybeFile,
  writeCacauTrybeFile,
}
```

### Criando a primeria Rota

Agora vamos adicionar a nossa rota para retornar todos os chocolates:

```javascript
// src/app.js

const express = require('express');
const { readCacauTrybeFile } = require('./util/readAndWriteFile');

const app = express();

app.use(express.json());

app.get('/chocolates', async (_req, res) => {
  const cacauFile = await readCacauTrybeFile();
  console.log('cacauFile: ', cacauFile); // Confira o resultado do console.log no terminal

  return res.status(200).json({ chocolates: cacauFile.chocolates });
});

module.exports = app;
```

### Subindo o Servidor

Por fim, vamos configurar o servidor:

```javascript
// server.js
const app = require('./app');

app.listen(3001, () => console.log('Server running on port 3001'));
```

### Ajustando os Scripts do `package.json`

Ajuste os scripts no `package.json` para facilitar a execução do projeto:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js --ignore src/data/cacau.json"
},
```

### Executando a API e Conferindo os Logs

Inicie a aplicação com o comando `npm start`, ou com o comando `npm run dev`, se preferir rodar com o nodemon.

Agora que a aplicação está rodando, faça uma requisição ao endpoint http://localhost:3001/chocolates. Ao receber a resposta, observe dois pontos importantes:

1.  **Logs no Terminal:** Fique atento aos logs exibidos no terminal. O `console.log('cacauFile:', cacauFile)` mostrará o conteúdo completo do arquivo `cacau.json`. Isso é essencial para entender como as informações estão sendo lidas e processadas pelas rotas da API.
    
2.  **Estrutura da Resposta:** O JSON retornado contém um array com dados dos chocolates. Note que, na resposta da nossa rota, o código `json({ chocolates: cacauFile.chocolates })` está acessando diretamente a chave `chocolates`, o que significa que apenas essa parte do conteúdo é retornada na resposta.
    

Agora que a API está funcionando, talvez você se pergunte: já podemos começar os testes com o Jest? Estamos quase lá! Na próxima lição, aprenderemos a usar o `Supertest`, uma ferramenta essencial para realizar testes de integração de forma eficiente.
