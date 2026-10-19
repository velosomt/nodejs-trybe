# 2.7 - NPM

> Seção 2 - Introdução ao Node.js · Lição 7 de 11

O NPM (sigla para *Node Package Manager*) é a principal ferramenta para gerenciamento de pacotes e dependências no ecossistema `Node.js`. Ele não só permite que você publique seus próprios pacotes para que outras pessoas desenvolvedoras possam utilizá-los, como também fornece uma enorme coleção de pacotes prontos para uso, que podem ser baixados diretamente pelo seu terminal.

> 🎬 Caso você prefira consumir este conteúdo em vídeo, ele está disponível no final desta seção.

## Utilizando a CLI do `NPM`

A CLI (Command Line Interface) do `npm` é uma ferramenta oficial que nos auxilia no gerenciamento de pacotes. Com ela, você pode criar novos pacotes, instalar e remover dependências, executar scripts e publicar suas criações no repositório oficial.

> **De olho na dica 👀:** Publicar um pacote público no `npm` é gratuito e ilimitado. No entanto, existem taxas de assinaturas caso deseje hospedar pacotes de forma privada, ou seja, pacotes sob os quais só você terá o controle de acesso.

-   Você terá acesso a alguns comandos do `npm` [neste repositório](https://github.com/tryber/Trybe-CheatSheets/blob/master/backend/nodejs/npm/README.md) para consultas rápidas. No entanto, vamos passar por alguns deles para uma explicação mais aprofundada.

## npm init

O comando `npm init` nos permite criar de forma rápida e simplificada um novo pacote Node.js na pasta onde é executado. Ao executá-lo, você inicia um processo interativo onde são solicitadas informações básicas sobre o pacote, como nome, versão, autor, e outras configurações.

Caso queira agilizar esse processo, você pode utilizar a flag `-y`, que preenche todas as respostas com os valores padrão:

```
npm init -y
```

Esse comando gera um arquivo `package.json`, essencial para qualquer projeto `Node.js`. Neste arquivo, podemos definir configurações importantes para o nosso pacote como nome, versão, dependências e **scripts**.

> Para o Node.js, qualquer pasta contendo um arquivo `package.json` válido é um pacote.

## package.json

O `package.json` é a base do seu projeto `Node.js`. Além de armazenar informações, como nome, versão, e autor, ele também guarda informações cruciais, como as dependências do projeto e os scripts que podem ser executados.

Vamos focar na parte dos scripts dentro do `package.json`. Ao final do conteúdo, teremos um vídeo abordando todos os detalhes desse arquivo.

Execute os seguintes comandos para iniciar um novo projeto e realizarmos algumas análises:

```
mkdir projeto-node && cd projeto-node &&
npm init -y &&
touch index.js && echo "console.log('Hello World, boas vindas ao node!');" >> index.js &&
touch preIndex.js && echo "console.log('Configuracao do preIndex');" >> preIndex.js &&
touch postIndex.js && echo "console.log('Configuracao do postIndex');" >> posIndex.js
```

Aqui, criamos três arquivos JavaScript que utilizaremos nos exemplos a seguir. Eles conterão mensagens simples que serão exibidas no terminal ao serem executados.

## npm start

[](https://github.com/betrybe/conteudo-back-end-em-nodejs/blob/main/backend-em-nodejs/secao-02_introducao-ao-node/conteudo/licao-07_npm/index.md#npm-start)

Primeiramente, criaremos um script. Para isso, precisamos alterar o `package.json` e adicionar uma nova chave ao objeto `scripts`. O valor dessa chave deve ser o comando que desejamos que seja executado quando chamarmos aquele script. Sendo assim, adicione o script `start` no seu `package.json`, como no exemplo abaixo:

```
// package.json
  "scripts": {
    "start": "node index.js", // -> Adicione essa linha, não coloque esse comentário no arquivo
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

Adicione essa linha, não coloque esse comentário no arquivo

O comando `npm start` é uma convenção no ecossistema `Node.js`. Ele executa o script **start** definido no `package.json` e é amplamente utilizado para iniciar a aplicação principal do pacote. Scripts são "atalhos" que podemos definir para executar determinadas tarefas relacionadas ao pacote atual.

Para executar o nosso script, basta digitar o seguinte comando no seu terminal:

```
npm start
```

Após a execução, você verá em seu terminal que ele executou o arquivo `index.js` e que apareceu a informação "Hello World, boas vindas ao node!". Estamos utilizando o `npm start` em um cenário simples, mas este comando é extremamente útil para simplificar a execução de aplicações complexas.

## Scrips pre e post no npm

Caso você queira que ações específicas aconteçam antes ou depois do comando `npm start`, você pode definir scripts com os nomes `prestart` e `poststart`. Esses scripts serão executados, respectivamente, antes e depois da execução do `npm start`. Faça a mudança no seu script igual abaixo e depois execute o comando `npm start`:

```
  "scripts": {
    "prestart": "node preIndex.js",
    "start": "node index.js",
    "poststart": "node postIndex.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

> **De olho na dica 👀:** O `pre` e o `post` podem ser usados para qualquer script, e não apenas `start`.

## npm run

Com o comando `npm run`, você pode executar scripts personalizados definidos no `package.json`. Esses scripts são comandos que você frequentemente precisa executar no desenvolvimento do seu projeto, como executar testes ou iniciar a aplicação.

Você pode adicionar um script com o seu próprio nome e executá-lo, confira um exemplo a seguir:

```
// package.json
{
  "scripts": {
    "roberto": "node index.js"
  }
}
```

Agora execute o script:

```
npm run roberto
```

> **De olho na dica 👀:** Você pode criar quantos scripts quiser, para realizar as tarefas que desejar. Inclusive, pode criar scripts que chamam outros scripts, criando assim "pipelines". Isso é muito útil, por exemplo, quando trabalhamos com *supersets* do JavaScript como o `TypeScript`, ou transpiladores como o `Babel`, pois ambos exigem que executemos comandos adicionais antes de iniciar nossos pacotes.

Anota aí 🖊: scripts especiais como o `start` e o `test` não precisam do `run` para serem executados.

## npm install

O `npm install` é o comando responsável por baixar e instalar pacotes do repositório NPM. Ele pode ser usado de várias maneiras:

-   `npm install <nome do pacote>`: baixa o pacote do registro do NPM e o adiciona ao objeto `dependencies` do `package.json`;
-   `npm install -D <nome do pacote>`: baixa o pacote do registro do NPM, mas o adiciona ao objeto `devDependencies` do `package.json`, indicando que o pacote não é necessário para executar a aplicação, apenas para desenvolvimento. Isso é útil ao colocar a aplicação em produção, pois pacotes marcados como devDependencies podem ser ignorados. A versão longa equivalente dessa flag `(-D)` é `--save-dev`.
-   `npm install -E <nome do pacote>`: baixa uma versão exata de um pacote do registro do NPM e o adiciona ao objeto `dependencies` ou ao objeto `devDependencies` caso a flag `-D` também esteja presente. A diferença é que quando instalamos as dependências da nossa aplicação, novas versões que corrigem bugs ou introduzem novos recursos desses pacotes podem ser instaladas. Isso garante que a mesma versão do pacote sempre será instalada, independentemente se novas versões estão disponíveis ou não. A versão longa equivalente dessa flag `(-E)` é `--save-exact`.
-   `npm install`: baixa e instala todos os pacotes listados nos objetos de `dependencies` e `devDependencies` do `package.json`. Sempre deve ser executado ao clonar o repositório de um pacote para garantir que todas as dependências deste pacote estão instaladas.

Para recapitular todos esses pontos mais detalhadamente basta assistir ao vídeo a seguir! 😉

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1022269505)

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   Node 22+ tem `node --run <script>`, que executa scripts do `package.json` mais rápido que `npm run` (mas não executa os scripts `pre`/`post`).
-   `npm pkg set scripts.start="node index.js"` edita o `package.json` pela linha de comando.
-   Para projetos novos, considere `npm ci` em CI/Docker (instala exatamente o que está no `package-lock.json`).

**Para o SAP CAP**

-   O projeto CAP nasce com `cds init <nome>` (em vez de `npm init -y`) e roda em desenvolvimento com `cds watch`, que já faz o reload automático.
-   Instale a CLI globalmente com `npm i -g @sap/cds-dk`.

</details>

<details>
<summary>OBS da IA</summary>

**CI/CD**

-   Os scripts do `package.json` (`test`, `lint`, `start`) são o **contrato com o pipeline**: o servidor de CI só chama `npm test` e olha o código de saída. Faça commit do `package-lock.json` e use `npm ci` no pipeline e no Docker.
-   Veja [IA.2 - Preparando o projeto para a CI](../12%20-%20OBS%20da%20IA%20-%20CI-CD%20-%20o%20m%C3%ADnimo%20para%20deploy%20automatizado/02%20-%20Preparando%20o%20projeto%20para%20a%20CI.md).

</details>
