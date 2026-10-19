# 2.5 - Leitura e Escrita de Arquivos

> Seção 2 - Introdução ao Node.js · Lição 5 de 11

A leitura e escrita de arquivos são operações comuns em back-end, sendo úteis para:

-   Armazenar logs da sua aplicação;
-   Ler arquivos de configuração para ações específicas;
-   Exportar dados em um arquivo [CSV](https://support.google.com/google-ads/answer/9004364?hl=pt-BR).

Sendo assim, é importante que você saiba como fazer a leitura e escrita de arquivos.

## Lendo arquivos com métodos síncronos

Vamos nos aprofundar no módulo `fs` do Node que permite a leitura e escrita de arquivos, assim como mostra a figura a seguir:

Imagem indisponível offline: mind\_map2

O módulo `fs` fornece o método `fs.readFileSync` para leitura síncrona de arquivos. Vamos utilizá-lo no exemplo a seguir, mas antes devemos realizar os seguintes passos:

1.  Criar uma pasta chamada `my-node-project`;
2.  Dentro dessa pasta, crie um arquivo chamado `readFileSync.js`;
3.  Insira o seguinte código no arquivo:

```
// my-node-project/readFileSync.js
const fs = require('fs');
const nomeDoArquivo = 'meu-arquivo.txt';
try {
  const data = fs.readFileSync(nomeDoArquivo, 'utf8');
  console.log(data);
} catch (err) {
  console.error(`Erro ao ler o arquivo: ${err.path}`);
  console.log(err);
}
```

Aqui estão os principais pontos do código:

1.  O módulo `fs` foi importado e a variável `nomeDoArquivo` armazena o nome do arquivo a ser lido;
2.  O bloco `try...catch` é usado para capturar quaisquer erros que possam acontecer durante a leitura do arquivo;
3.  O método `readFileSync` lê o arquivo de forma síncrona, ou seja, ele espera a conclusão da leitura antes de prosseguir com a execução do código. Ele recebe dois parâmetros: o nome do arquivo e um parâmetro opcional para definir o encoding (neste caso, `utf8`).

Execute o script no terminal com `node readFileSync.js` e analise o resultado. Se ocorrer um erro, é porque o arquivo `meu-arquivo.txt` não existe.

Para resolver o problema, basta criarmos um arquivo com o nome `meu-arquivo.txt` com algum conteúdo dentro!

Agora, ao executar o script `readFileSync.js` com o comando `node readFileSync.js`, o conteúdo do arquivo será exibido no terminal.

> E se tivéssemos que ler vários arquivos ao mesmo tempo?
> 
> *Resposta*: Para isso, utilizamos métodos **assíncronos**.

## Lendo arquivos com métodos assíncronos

Através do módulo `fs` temos acesso ao método `fs.readFile` que permite a leitura assíncrona de arquivos.

> Observação: Para utilizar as operações assíncronas do `fs`, precisamos alterar a importação do módulo `fs` para `require('fs').promises`. Dessa forma, poderemos chamar as funções assíncronas para leitura e escrita de arquivos que retornarão Promises.

Vamos ver como ficaria o código do exemplo anterior, usando Promises e `async/await`:

```
// my-node-project/readFileSync.js
const fs = require('fs').promises;
async function main() {
  try {
    const data = await fs.readFile('./meu-arquivo.txt', 'utf-8');
    console.log(data);
  } catch (err) {
    console.error(`Erro ao ler o arquivo: ${err.message}`);
  }
}
main();
```

Neste código, a função `main` foi criada para utilizar `async/await`, já que o `await` só pode ser usado dentro de funções assíncronas.

## Escrevendo dados em arquivos

Escrever dados em arquivos é um processo bem parecido com a leitura de dados! Assim como o módulo `('fs').promises` disponibiliza o método `readFile` para a leitura, há também o método `writeFile` para a escrita.

```
// my-node-project/writeFile.js
const fs = require('fs').promises;
async function main() {
  try {
    await fs.writeFile('./meu-arquivo.txt', 'Meu textão');
    console.log('Arquivo escrito com sucesso!');
  } catch (err) {
    console.error(`Erro ao escrever o arquivo: ${err.message}`);
  }
}
main();
```

Execute o script com `node writeFile.js` e repare que o conteúdo do `meu-arquivo.txt` foi alterado para "Meu textão".

Anota aí 🖊: No `writeFile`, assim como ocorre no `readFile`, você pode especificar algumas opções adicionais passando um terceiro parâmetro opcional (`flag`).

-   A opção `flag` especifica como o arquivo deve ser aberto e manipulado. No `WriteFile` o padrão é `'w'`, que especifica que o arquivo deve ser aberto para escrita. Dessa forma se o arquivo não existir, ele é criado. Caso contrário, é reescrito, ou seja, tem seu conteúdo apagado antes do novo conteúdo ser escrito. A flag `'wx'`, por exemplo, funciona como `'w'`, mas lança um erro caso o arquivo já exista.

Vamos modificar nosso exemplo anterior para utilizar as `flags`:

```
// my-node-project/writeFile.js
const fs = require('fs').promises;
async function main() {
  try {
    await fs.writeFile('./novo.txt', 'Meu textão', { flag: 'wx' });
    console.log('Arquivo escrito com sucesso!');
  } catch (err) {
    console.error(`Erro ao escrever o arquivo: ${err.message}`);
  }
}
main();
```

Execute o script com `node writeFile.js` **duas vezes** e repare que na primeira execução foi criado o arquivo `novo.txt` com o conteúdo "Meu textão". Na segunda execução será lançado um erro indicando que o arquivo `novo.txt` já existe.

Para consolidar o conhecimento, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1022269223)

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   O curso já usa a API de Promises (bom). A forma mais atual de importar é `require('node:fs/promises')` (ou `import { readFile } from 'node:fs/promises'`).
-   Evite `readFileSync`/`writeFileSync` em servidor: bloqueiam o event loop e travam todas as requisições enquanto o disco responde.
-   Em ESM dá para usar `await` direto no topo do arquivo, sem a função `main()`.

**Para o SAP CAP**

-   No CAP você praticamente não lê/escreve JSON em disco para dados: os dados ficam em entidades CDS e os dados iniciais em arquivos CSV em `db/data/`.

</details>
