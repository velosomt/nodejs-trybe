# 2.8 - Utilizando Módulos externos

> Seção 2 - Introdução ao Node.js · Lição 8 de 11

Para utilizarmos um módulo externo no `Node.js`, você deverá instalá-lo na sua aplicação. Hoje, vamos usar como exemplo o pacote [readline-sync](https://www.npmjs.com/package/readline-sync), que nos permitirá interagir com nossa aplicação diretamente pelo terminal.

Primeiro, crie uma pasta e inicie um novo projeto Node nessa pasta com o comando `npm init -y`. Em seguida, para instalar o pacote `readline-sync`, execute o comando:

```
npm i --save-exact readline-sync@1.4.10
```

Este comando irá instalar o pacote e adicionar a dependência `readline-sync` ao seu arquivo `package.json`.

> **De olho na dica 👀:** A letra `i` no comando acima é um atalho para `install`.

Agora, crie um arquivo `index.js` e configure o comando `start` nos scripts do `package.json` para executar o comando `node index.js`. Pronto! Agora podemos usar o pacote `readline-sync` em nossa aplicação.

## Lendo input no terminal

Para começar a usar o pacote, precisamos importá-lo, conforme o exemplo abaixo:

```
const readline = require('readline-sync');
```

Perceba que, apesar do pacote chamar-se `readline-sync`, podemos dar qualquer nome para a `const` que usamos para importá-lo.

Agora que temos o pacote disponível, podemos usar as funções `question` e `questionInt` para solicitar à pessoa usuária seu nome e idade:

```
// const readline = require('readline-sync');
const name = readline.question('Qual seu nome? ');
const age = readline.questionInt('Qual sua idade? ');
```

A função `question` interpreta a resposta como uma string comum, enquanto a função `questionInt` converte a resposta para número utilizando o `parseInt` e gera um erro caso a pessoa tente inserir algo que não seja um número válido.

Agora o último passo é utilizarmos essas novas variáveis para compor nossa mensagem de olá. Vamos lá:

```
// const readline = require('readline-sync');
// const name = readline.question('Qual seu nome? ');
// const age = readline.questionInt('Qual sua idade? ');
console.log(`Olá, ${name}! Você tem ${age} anos!`);
```

Se executarmos o script `npm start` poderemos ver o resultado da ação!

Caso tenha curiosidade, explore outros recursos do [readline-sync](https://www.npmjs.com/package/readline-sync).

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1022269540)

Agora é hora de praticar! Siga para o quiz e valide o seu conhecimento sobre o conteúdo aprendido durante a seção.

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   `readline-sync` está sem atualizações há anos. O Node tem nativamente `node:readline/promises`: `const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); const nome = await rl.question('Qual seu nome? ');` — sem dependência externa.
-   O conceito de dependências (`dependencies` x `devDependencies`, `--save-exact`) continua igual e é essencial para o CAP.

</details>

## Quiz

### Questão 1

Qual das opções abaixo descreve corretamente o NPM (Node Package Manager)?

- **A)** O NPM realiza o gerenciamento de módulos e também de processos do sistema.
- **B)** O NPM é o gerenciador de pacotes padrão para projetos Node.js.
- **C)** O NPM é uma ferramenta para compilar aplicativos Node.js em binários executáveis.
- **D)** O NPM gerencia pacotes e também controla o desempenho de aplicações Node.js em produção.
- **E)** O NPM permite gerenciar apenas pacotes relacionados a frontend no Node.js.

### Questão 2

Node.js é \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_.

- **A)** uma linguagem de programação para desenvolver aplicações back-end.
- **B)** um banco de dados para JavaScript.
- **C)** um ambiente de execução de JavaScript no lado do servidor.
- **D)** um framework para criar interfaces gráficas.
- **E)** um sistema de controle de versão.

### Questão 3

Sobre o sistema de módulos no Node.js, leia as afirmações abaixo:

I - O sistema de módulos no Node.js permite a reutilização de código em diferentes partes da aplicação.

II - O método require é utilizado para importar módulos em um arquivo Node.js.

III - O sistema de módulos do Node.js segue o padrão utilizado pelo navegador para carregar scripts de forma automática.

Quais dessas afirmativas estão corretas?

- **A)** I, III.
- **B)** I, II.
- **C)** II, III.
- **D)** I, II, III.
- **E)** Apenas II.

### Questão 4

Como um módulo local pode ser exportado e importado em Node.js, por padrão?

- **A)** Usando import e export.
- **B)** Usando define e include.
- **C)** Usando global.exports e global.import.
- **D)** Usando module.exports para exportar e require() para importar.
- **E)** Usando o objeto exports diretamente, sem precisar de require.

### Questão 5

Observe o código abaixo:

const fs = require('fs');

const nomeDoArquivo = 'meu-arquivo.txt';

const data = fs.readFileSync(nomeDoArquivo, 'utf8');  
console.log(data);

Qual é a funcionalidade do módulo fs utilizado no código acima?

- **A)** O módulo fs é responsável por gerenciar processos no sistema operacional.
- **B)** O módulo fs permite interagir com o sistema de arquivos, realizando operações como leitura e escrita de arquivos.
- **C)** O módulo fs é responsável pela comunicação em rede no Node.js.
- **D)** O módulo fs pode ser utilizado para manipular a memória do sistema.
- **E)** O módulo fs permite interagir com APIs externas.

### Questão 6

O que acontece ao combinar os módulos fs e path para manipular arquivos no Node.js?

- **A)** O módulo fs lida com banco de dados e o módulo path realiza autenticação de usuários.
- **B)** O módulo path é responsável por mover arquivos, enquanto o fs apenas realiza cópias.
- **C)** O módulo fs pode ser usado para ler e escrever arquivos, enquanto o módulo path auxilia na manipulação de caminhos de arquivo.
- **D)** O módulo fs é usado para criar e excluir diretórios, enquanto o path manipula URLs.
- **E)** O módulo path substitui o fs em operações de leitura de arquivos quando combinado.

### Questão 7

Qual das opções a seguir descreve corretamente a utilização de módulos externos no Node.js?

- **A)** Módulos externos podem ser instalados usando o NPM e são listados no arquivo package.json do projeto.
- **B)** Módulos externos são sempre carregados automaticamente pelo Node.js sem precisar de instalação.
- **C)** Todos os módulos externos são instalados diretamente no núcleo do Node.js sem necessidade de configuração adicional.
- **D)** Módulos externos no Node.js devem ser sempre importados usando import ao invés de require.
- **E)** Módulos externos precisam ser carregados manualmente no terminal sempre que o servidor é iniciado.

### Questão 8

O que acontece quando o código abaixo é executado no Node.js?

const fs = require('fs').promises;

async function main() {  
try {  
await fs.writeFile('./meu-arquivo.txt', 'Meu textão');  
console.log('Arquivo escrito com sucesso!');  
} catch (err) {  
console.error(`Erro ao escrever o arquivo: ${err.message}`);  
}  
}

Assinale a alternativa correta.

- **A)** Um erro é gerado porque a função writeFile não suporta async/await.
- **B)** O código falha porque require('fs').promises não é uma sintaxe válida.
- **C)** O arquivo "meu-arquivo.txt" é criado ou sobrescrito com o texto "Meu textão".
- **D)** Um erro será lançado porque o caminho do arquivo precisa ser absoluto.
- **E)** A função writeFile sempre cria um novo arquivo e nunca sobrescreve um existente.

<details><summary>Gabarito</summary>

**1.** B

-   **A)**Alternativa incorreta. O NPM não gerencia processos, apenas pacotes.
-   **B)**Alternativa correta!
-   **C)**Alternativa incorreta. O NPM gerencia pacotes, não compila binários.
-   **D)**Alternativa incorreta. O NPM gerencia pacotes, mas o controle de desempenho requer outras ferramentas.
-   **E)**Alternativa incorreta. O NPM pode gerenciar pacotes tanto para frontend quanto para backend.

**2.** C

-   **A)**Alternativa incorreta. Node.js não é uma linguagem de programação, é um runtime.
-   **B)**Alternativa incorreta. Node.js não é um banco de dados, ele é utilizado para executar JavaScript no servidor.
-   **C)**Alternativa correta! Node.js é um runtime que permite executar JavaScript fora do navegador.
-   **D)**Alternativa incorreta. Node.js não é usado para criar interfaces gráficas, mas sim para construir aplicações server-side.
-   **E)**Alternativa incorreta. Node.js não tem relação com controle de versão, isso é feito por ferramentas como Git.

**3.** B

-   **A)**Alternativa incorreta. O Node.js não segue o padrão de carregamento automático de scripts utilizado no navegador.
-   **B)**Alternativa correta!
-   **C)**Alternativa incorreta. A afirmativa III está incorreta, já que o Node.js utiliza um sistema de módulos próprio e não o do navegador.
-   **D)**Alternativa incorreta. Apenas as afirmativas I e II estão corretas.
-   **E)**Alternativa incorreta. Embora a afirmativa II esteja correta, a afirmativa I também está.

**4.** D

-   **A)**Alternativa incorreta. Essas sintaxes são do padrão ESModules e requerem configuração especial no Node.js.
-   **B)**Alternativa incorreta. Esses métodos não são o padrão do Node.js.
-   **C)**Alternativa incorreta. Não existe global.exports ou global.import no Node.js.
-   **D)**Alternativa correta!
-   **E)**Alternativa incorreta. O objeto exports pode ser utilizado para exportar, mas require ainda é necessário para importar.

**5.** B

-   **A)**Alternativa incorreta. A responsabilidade do fs é manipular arquivos, e não processos.
-   **B)**Alternativa correta!
-   **C)**Alternativa incorreta. A comunicação em rede é tratada por módulos como http e net.
-   **D)**Alternativa incorreta. O fs manipula arquivos no disco, não a memória diretamente.
-   **E)**Alternativa incorreta. O fs não interage com APIs externas; ele trabalha com o sistema de arquivos local.

**6.** C

-   **A)**Alternativa incorreta. O fs não interage com bancos de dados, e o path manipula caminhos, não usuários.
-   **B)**Alternativa incorreta. O fs manipula arquivos, enquanto o path apenas lida com caminhos.
-   **C)**Alternativa correta!
-   **D)**Alternativa incorreta. Embora o fs crie diretórios, o path não manipula URLs diretamente, mas caminhos de arquivo.
-   **E)**Alternativa incorreta. O path não substitui o fs; ambos têm funções diferentes.

**7.** A

-   **A)**Alternativa correta!
-   **B)**Alternativa incorreta. Módulos externos precisam ser instalados via NPM.
-   **C)**Alternativa incorreta. Os módulos são instalados no diretório do projeto, não no núcleo do Node.js.
-   **D)**Alternativa incorreta. Embora o import seja possível, o require é amplamente utilizado no CommonJS.
-   **E)**Alternativa incorreta. Os módulos instalados via NPM são carregados automaticamente pelo código.

**8.** C

-   **A)**Alternativa incorreta. fs.promises.writeFile é compatível com async/await.
-   **B)**Alternativa incorreta. Essa é uma sintaxe válida para trabalhar com o sistema de arquivos de forma assíncrona.
-   **C)**Alternativa correta! A função writeFile cria ou sobrescreve o arquivo especificado com o conteúdo fornecido.
-   **D)**Alternativa incorreta. O Node.js suporta caminhos relativos como o especificado.
-   **E)**Alternativa incorreta. A função sobrescreve arquivos, se já existirem.

</details>
