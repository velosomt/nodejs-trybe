# 2.4 - Utilizando Módulos internos

> Seção 2 - Introdução ao Node.js · Lição 4 de 11

Para utilizarmos um módulo interno no `Node.js`, você deve passar o nome do pacote como parâmetro para a função `require`. Por exemplo, `require('fs')` importa o pacote `fs`, responsável pelo sistema de arquivos.

Após importar um pacote, você pode utilizá-lo como uma variável em seu código da seguinte forma:

```
const fs = require('fs');

fs.readFileSync('./meuArquivo.txt');
```

Note que a forma de importar um módulo interno é semelhante à de importar um módulo local de outro arquivo.

Na próxima lição iremos utilizar alguns módulos internos, além de abordar a Leitura e Escrita de arquivos com o módulo `fs`. Caso tenha curiosidade, explore outros módulos internos na [Documentação Oficial do Node.js](https://nodejs.org/docs/latest/api/).

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   Prefira o prefixo `node:` para módulos nativos: `require('node:fs')`, `require('node:path')`. Deixa explícito que é built-in e evita conflito com pacotes do npm de mesmo nome.

</details>
