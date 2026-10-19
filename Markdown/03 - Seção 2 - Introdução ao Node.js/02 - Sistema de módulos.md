# 2.2 - Sistema de módulos

> Seção 2 - Introdução ao Node.js · Lição 2 de 11

Segundo o [ModuleCounts.com](http://www.modulecounts.com/), o NPM — repositório onde os pacotes Node.js são disponibilizados — está entre os maiores do mundo.

Essa vasta quantidade de pacotes reflete duas grandes forças do Node.js: uma comunidade altamente ativa e uma infinidade de ferramentas para resolver os mais diversos problemas de desenvolvimento.

Mas, o que é um pacote Node e como podemos utilizá-los no nosso código?🤔

Anota aí 🖊: um módulo em Node.js é um "pedaço de código" que pode ser organizado em um ou mais arquivos e possui um escopo próprio. Isso significa que as variáveis, funções, classes e outros elementos dentro de um módulo estão disponíveis apenas dentro dos arquivos que pertencem a ele.

Em outras palavras, um módulo é uma funcionalidade ou um conjunto de funcionalidades isoladas do restante do código. No Node.js, existem **três** tipos principais de módulos: **internos, locais e de terceiros**.

## Módulos internos

Os módulos internos (ou *core modules*) vêm integrados ao Node.js e são instalados automaticamente quando baixamos o próprio Node.js. Alguns exemplos de *core modules* são:

-   [`fs`](https://nodejs.org/api/fs.html): fornece uma API para interagir com o sistema de arquivos de forma geral;
-   [`url`](https://nodejs.org/api/url.html): provê utilitários para ler e manipular URLs;
-   [`util`](https://nodejs.org/api/util.html): oferece ferramentas e funcionalidades comumente úteis a pessoas programadoras.
-   [`os`](https://nodejs.org/api/os.html): oferece ferramentas e funcionalidades relacionadas ao sistema operacional.

⚠️ **Aviso**: clique no nome de cada módulo para abrir a documentação oficial (em inglês).

## Módulos locais

Os módulos locais são aqueles que criamos dentro da nossa própria aplicação. Eles representam funcionalidades que decidimos separar em arquivos diferentes para manter o código organizado. Além disso, módulos locais podem ser publicados no NPM, permitindo que outras pessoas os utilizem em seus projetos.

## Módulos externos

Os módulos externos ou de terceiros são aqueles criados por outras pessoas desenvolvedoras e disponibilizados para uso por meio do `npm`. Podemos criar e publicar nossos próprios módulos para reutilização em diferentes aplicações ou para compartilhá-los com a comunidade. Veremos como fazer isso em breve.

Agora, que tal ver um apanhado geral do que aprendemos para consolidar de vez esse conhecimento? Para isso, é só assistir ao vídeo abaixo!

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1022272691)

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   O curso usa **CommonJS** (`require` / `module.exports`). O padrão oficial do JavaScript é **ES Modules** (`import` / `export`), habilitado com `"type": "module"` no `package.json` ou arquivos `.mjs`. Node 22+ já consegue até fazer `require()` de módulos ESM.
-   Com ESM você ganha `await` no topo do arquivo (top-level await) e importações estáticas analisáveis por ferramentas.

**Para o SAP CAP**

-   O CAP Node.js (`@sap/cds`) funciona com CommonJS e com ESM. Escolha um dos dois e use no projeto inteiro — nunca misture.
-   O conceito de módulos continua valendo: handlers em `srv/*.js` são módulos que exportam a implementação do serviço.

</details>
