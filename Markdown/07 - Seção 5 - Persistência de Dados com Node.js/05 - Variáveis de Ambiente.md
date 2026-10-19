# 5.5 - Variáveis de Ambiente

> Seção 5 - Persistência de Dados com Node.js · Lição 5 de 16

Um ponto importante para mantermos a segurança e a flexibilidade da nossa aplicação é o uso correto de variáveis de ambiente. Isso evita que dados sensíveis, como credenciais de banco de dados, fiquem expostos em nossos arquivos de código, especialmente em ambientes de versionamento público como o **GitHub**.

Quando deixamos as informações de acesso ao banco de dados diretamente no código, por exemplo, no arquivo `src/database/connection.js`, arriscamos expor essas credenciais. Se este código for enviado para um repositório público, qualquer pessoa terá acesso aos dados, podendo comprometer até mesmo um banco de dados de produção!

A solução para essa situação é o uso de `variáveis de ambiente`, onde essas informações sensíveis são armazenadas fora do código e são acessadas por meio do `process.env` no Node.js.

## Utilizando Variáveis de Ambiente

No Node.js, podemos ler variáveis de ambiente diretamente do sistema operacional. Para exemplificar, execute o comando abaixo que exibe o valor da variável `$USER`, com o nome de usuário atual do sistema:

```bash
echo $USER
```

O Node.js possui acesso direto às variáveis de ambiente por meio do objeto `process.env`. Vamos verificar um exemplo de como isso funciona. Adicione o seguinte trecho ao seu arquivo `server.js`:

```javascript
// app.listen(PORT, async () => {
//   console.log(`Server running on port ${PORT}`);

  console.log(`Valor da variável de ambiente $USER: ${process.env.USER}`);

  // Verificação de conexão com o MySQL
  // const [result] = await connection.execute('SELECT 1');
  // if (result) {
  //   console.log('MySQL connection successfully established');
  // }
// });
```

## Configurando o Arquivo `.env`

Para facilitar a criação e a organização das variáveis de ambiente, utilizamos um arquivo `.env` na raiz do projeto. Esse arquivo armazena variáveis no formato `NOME_DA_VARIÁVEL=VALOR`. No nosso caso, ele pode ser configurado assim:

```bash
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE_NAME=school_management_system
```

O próximo passo é configurar o ambiente para carregar automaticamente essas variáveis. Agora iremos modificar os nossos scrits para utilizar a flag `--env-file=.env` no `package.json`. Isso permite que a aplicação carregue o arquivo `.env` diretamente, simplificando a inicialização.

```json
  "start": "node --env-file=.env src/server.js",
  "dev": "nodemon --env-file=.env src/server.js",
```

Vamos, então, refatorar nosso arquivo `src/database/connection.js` para se conectar ao MySQL utilizando apenas variáveis de ambiente através do `process.env`:

```javascript
// src/database/connection.js

const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE_NAME,
});

module.exports = connection;
```

**Anota aí 🖊:** Para garantir a segurança, adicione o arquivo `.env` ao `.gitignore` para evitar que ele seja versionado.

É também uma boa prática criar um `.env-example` para indicar quais variáveis de ambiente o projeto utiliza, facilitando a configuração do ambiente para outras pessoas:

```bash
MYSQL_HOST=
MYSQL_PORT=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE_NAME=
```

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   O curso já usa a forma moderna: `node --env-file=.env` (Node 20.6+), dispensando o pacote `dotenv`. Também existe `process.loadEnvFile()` (Node 21.7+) para carregar via código.

**Para o SAP CAP**

-   O CAP centraliza configuração em `cds.env` (`package.json` → `cds`, `.cdsrc.json`) com **profiles** (`[development]`, `[production]`, `[hybrid]`). Credenciais locais vão em `.cdsrc-private.json` (fora do git). No SAP BTP as credenciais vêm dos service bindings, e `cds bind` conecta o ambiente local a serviços reais da nuvem.

</details>

## Variáveis de Ambiente no Docker Compose

Para configurar variáveis de ambiente no Docker Compose, temos algumas opções:

1.  **Direto no arquivo**:

Inclua as variáveis diretamente no arquivo `docker-compose.yml` usando o atributo environment:

```yaml
    # depends_on:
    #   mysqldb:
    #     condition: service_healthy
    environment:
      MYSQL_USER: root
      MYSQL_PASSWORD: password
      MYSQL_HOST: mysqldb
      MYSQL_PORT: 3306
      MYSQL_DATABASE_NAME: school_management_system
    # networks:
    #   - backend
```

1.  **Usando env\_file**:

Especifique o caminho do arquivo `.env`, de modo que o Docker Compose carrega as variáveis automaticamente:

```yaml
    # depends_on:
    #   mysqldb:
    #     condition: service_healthy
    env_file:
      - .env
    # networks:
    #   - backend
```

É possível também combinar as duas abordagens para maior flexibilidade.

Vamos agora fixar os conceitos aprendidos com o vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1039088065)

<details>
<summary>OBS da IA</summary>

**CI/CD**

-   No pipeline não existe `.env`: os valores sensíveis vêm de **Secrets** do GitHub (`${{ secrets.NOME }}`) e chegam à aplicação como variáveis de ambiente. Faça commit só de um `.env.example`, com as chaves e valores fictícios.
-   Veja [IA.4 - Segredos, ambientes e proteção da branch main](../12%20-%20OBS%20da%20IA%20-%20CI-CD%20-%20o%20m%C3%ADnimo%20para%20deploy%20automatizado/04%20-%20Segredos%2C%20ambientes%20e%20prote%C3%A7%C3%A3o%20da%20branch%20main.md).

</details>
