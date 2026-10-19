# 2.6 - Combinando módulos internos

> Seção 2 - Introdução ao Node.js · Lição 6 de 11

Já vimos como usar o módulo `fs` para leitura de arquivos, mas podemos nos deparar com diferentes cenários. Execute os comandos abaixo no terminal para podermos abordar sobre um cenário do cotidiano.

1.  Para criar um arquivo que será lido:

```
mkdir content &&
touch content/novo-arquivo.txt &&
echo "Novo conteúdo" >> content/novo-arquivo.txt
```

1.  Para criar nosso código para fazer a leitura de outros arquivos:

```
mkdir read && touch read/readFile.js
```

Adicione o seguinte conteúdo no arquivo `readFile.js`

```
// read/readFile.js
const fs = require('fs').promises;
const caminhoDoArquivo = '../content/novo-arquivo.txt';
async function main() {
  try {
    const data = await fs.readFile(caminhoDoArquivo, 'utf8');
    console.log(data);
  } catch (err) {
    console.log(err.message);
  }
}
main();
```

Ao executar esse código com `node read/readFile.js`, você verá um erro indicando que o arquivo não foi encontrado. Mas por que isso acontece?

O problema está no uso do caminho relativo. O `fs.readFile` espera um caminho absoluto, ou seja, ele procura o arquivo começando da `raiz` do projeto. Para corrigir isso, podemos alterar o caminho na constante caminhoDoArquivo para começar com `./`, assim:

```
// read/readFile.js
// const fs = require('fs').promises;
const caminhoDoArquivo = './content/arquivo.txt';
/// função main
```

Repare que mudamos o início do nosso caminho de `'../'` para `'./'`. No entanto, e se quisermos manter o caminho relativo original `'../content/novo-arquivo.txt'`? Nesse caso, podemos usar o módulo interno `path`.

## Módulo `path`

O módulo `path` é uma ferramenta essencial para manipular e trabalhar com caminhos de arquivos e diretórios de maneira independente do sistema operacional. Ele oferece métodos úteis que facilitam a criação, combinação e resolução de caminhos de arquivos, garantindo que seu código funcione de maneira consistente em diferentes ambientes.

### Método `resolve`

O método `resolve` do módulo `path` é útil para encontrar um arquivo quando precisamos seguir um caminho específico. Veja um exemplo simples:

```
const path = require('path');
const caminhoAbsoluto = path.resolve('diretorio', 'arquivo-test.txt');
console.log(caminhoAbsoluto);
```

Ao executar esse código, você verá o caminho completo até a raiz do seu sistema, seguido por `/diretorio/arquivo-test.txt`. O `path.resolve` nos ajuda a construir um caminho absoluto a partir de um caminho relativo. Mas, para resolver nosso problema, ainda precisamos lidar com caminhos relativos.

### \`\_\_dirname\`\`

O `__dirname` é uma variável global no `Node` que contém o caminho absoluto do diretório onde o script atual está localizado. Quando combinado com o `path`, ele permite resolver caminhos relativos com facilidade. Vamos voltar ao nosso exemplo e utilizar os novos recursos aprendidos.

```
// read/readFile.js
// const fs = require('fs').promises;
const path = require('path');
const caminhoDoArquivo = path.resolve(__dirname, '..', 'content', 'novo-arquivo.txt');
/// função main
```

Agora, ao combinar `path.resolve` com `__dirname`, conseguimos utilizar o caminho relativo do nosso arquivo `readFile.js` em relação ao arquivo `novo-arquivo.txt`.

Caso tenha curiosidade, explore outros recursos do módulo `path` na [Documentação Oficial do Node.js](https://nodejs.org/api/path.html).

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1022269350)

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   `__dirname` só existe em CommonJS. Em ESM use `import.meta.dirname` e `import.meta.filename` (Node 20.11+ / 21.2+).
-   O curso usa `path.resolve(__dirname, ...)` — continua sendo a forma correta de montar caminhos independentes da pasta de onde o comando foi executado.

</details>
