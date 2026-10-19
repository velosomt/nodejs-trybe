# 2.9 - Para não esquecer mais

> Seção 2 - Introdução ao Node.js · Lição 9 de 11

Quantos conceitos diferentes e novas habilidades adquiridas, hein? Sabendo disso, nós preparamos este mini resumo com os principais termos vistos, caso você queira fazer uma breve recapitulação!

## Módulos

Módulos são como "caixinhas" que isolam suas funções, variáveis e afins de outras partes do código. **O Node.js possui três tipos de módulos:**

1.  **Módulos internos**: também chamados de *core modules*, são módulos que já vêm com o Node.js quando baixamos o *runtime*.
2.  **Módulos locais**: são aqueles criados por nós na nossa máquina. Eles representam as funcionalidades ou partes do nosso programa que foram separados em arquivos diferentes.
3.  **Módulos externos**: são módulos publicados no NPM, que as pessoas podem baixar e utilizar em suas aplicações.

## Node.js

O Node.js é um interpretador de JavaScript construído a partir do V8 (interpretador utilizado pelo Google Chrome) e que permite a execução de códigos JavaScript fora de navegadores web. De forma resumida, ele nos permite utilizar o JavaScript no backend da aplicação.

## NPM

O [NPM](https://www.npmjs.com/) é o site em que são publicados os pacotes Node.js.

## npm

`npm` é a ferramenta de linha de comando(CLI) que realiza o gerenciamento dos pacotes `Node.js` para nós.

> [Neste repositório](https://github.com/tryber/Trybe-CheatSheets/blob/master/backend/nodejs/npm/README.md) você encontra uma lista para consultas rápidas dos principais comandos `npm` (Cheat Sheet).

## Pacote

Um pacote é um conjunto de arquivos que exportam um ou mais módulos `Node.js`, facilitando a reutilização de código.

## package.json

O `package.json` é o arquivo onde estão configuradas informações importantes sobre o seu projeto, como nome, versão, dependências e scripts.

## Scripts

Scripts são "atalhos" que podemos definir no arquivo `package.json` para executar tarefas específicas relacionadas ao projeto. Eles são configurados no objeto scripts, onde definimos pares de chave e valor que correspondem ao nome do script e ao comando que será executado.

## Para onde vamos?

No próximo conteúdo, você aprenderá a:

-   Utilizar o Framework Express;
-   Criar sua API com Node.js;
-   Utilizar métodos HTTP na sua API;
-   Trabalhar com Middlewares;
-   Construir roteamento na API.
