# 2.3 - Utilizando Módulos locais

> Seção 2 - Introdução ao Node.js · Lição 3 de 11

> **Sugestão**: A partir deste momento, utilizaremos exemplos práticos para facilitar o aprendizado. Sugerimos que você organize o código em uma pasta descritiva para praticar e reforçar os conceitos.

Para exportar elementos usando o padrão CommonJS, utilizamos a variável global `module.exports`, atribuindo a ela o valor que desejamos exportar:

```
// brlValue.js
const brl = 5.37;
module.exports = brl;
```

O `module.exports` nos permite definir quais desses "elementos" internos ao módulo serão **exportados**, ou seja, estarão acessíveis a outros arquivos que importarem aquele módulo. Ele pode receber **qualquer valor válido em JavaScript, incluindo objetos, classes, funções e afins.**

No exemplo acima, estamos exportando o valor da constante `brl`(que é `5.37`). Ao importar esse módulo, receberemos o valor `5.37` como resposta. Apesar disso funcionar, exportar um único valor constante não é comum. Vamos observar um caso mais frequente:

```
// brlValue.js
const brl = 5.37;
const usdToBrl = (valueInUsd) => valueInUsd * brl;
module.exports = usdToBrl;
```

Agora, estamos exportando uma função que converte um valor recebido em dólares, para reais.

**Vamos ver na prática como utilizar esse módulo:**

O uso desse módulo em outro arquivo, se daria da seguinte forma:

```
// index.js
const convert = require('./brlValue');
const usd = 10;
const brl = convert(usd);
console.log(brl) // 53.7
```

Perceba dois detalhes importantes:

1.  Observe que podemos nomear a função importada da forma que quisermos, independentemente do nome que ela tinha dentro do módulo (`usdToBrl -> convert`).
2.  Para importar um módulo local, precisamos utilizar o `require` recebendo o caminho até o módulo que queremos utilizar, neste caso, `./brlValue`.

> **Anota aí 🖊:** No `require` a extensão do arquivo (`.js`) não é necessária, pois o Node procura por padrão arquivos terminados em `.js`.

Agora, suponha que desejamos exportar tanto a função de conversão quanto o valor do dólar (a variável `brl`). Para isso, podemos exportar um objeto contendo as duas constantes da seguinte forma:

```
// brlValue.js
const brl = 5.37;
const usdToBrl = (valueInUsd) => valueInUsd * brl;
module.exports = {
  brl,
  usdToBrl,
};
```

Dessa forma, ao importarmos o módulo, receberemos o seguinte objeto:

```
// index.js
const brlValue = require('./brlValue');
console.log(brlValue); // { brl: 5.37, usdToBrl: [Function: usdToBrl] }
console.log(`Valor do dólar: ${brlValue.brl}`); // Valor do dólar: 5.37
console.log(`10 dólares em reais: ${brlValue.usdToBrl(10)}`); // 10 dólares em reais: 53.7
```

Como estamos lidando com um objeto, podemos utilizar *object destructuring* para transformar as propriedades do objeto importado em constantes no escopo global:

```
// index.js
// Os nomes devem ser os mesmos que os utilizados no arquivo brlValue.js "neste caso"
const { brl, usdToBrl } = require('./brlValue');
console.log(`Valor do dólar: ${brl}`); // Valor do dólar: 5.37
console.log(`10 dólares em reais: ${usdToBrl(10)}`); // 10 dólares em reais: 53.7
```

Para recapitular sobre módulos locais, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1022269105)

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   Equivalente em ESM: `export function soma() {}` / `export default ...` e `import { soma } from './calc.js'` (em ESM a extensão `.js` é obrigatória no caminho).

**Para o SAP CAP**

-   No CAP, um módulo típico exporta a classe do serviço: `module.exports = class CatalogService extends cds.ApplicationService { ... }` (ou `export default class ...` em ESM).

</details>
