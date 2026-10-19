# 5.4 - Configurando o MySQL no Node com Express

> Seção 5 - Persistência de Dados com Node.js · Lição 4 de 16

Para conectar o MySQL ao Node, vamos começar instalando a dependência `mysql2`. No diretório raiz do projeto, execute o comando:

```bash
npm install mysql2@3.11.3 --save-exact
```

## A Biblioteca MySQL2 e o Uso de Promises

O `mysql2` é um driver que permite a comunicação entre o Node.js e o banco MySQL, viabilizando o envio de comandos SQL e o recebimento de respostas. Ele suporta `Promises`, o que significa que podemos usar `async` e `await` para gerenciar operações de consulta de maneira mais limpa e evitar *callbacks*. Agora, criaremos o arquivo `src/database/connection.js` para configurar a conexão:

```javascript
// src/database/connection.js
const mysql = require('mysql2/promise');
const connection = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE_NAME || 'school_management_system',
});
module.exports = connection;
```

No código acima, importamos **mysql2** com suporte a `promises` e criamos uma constante `connection` que armazena o `pool de conexões`, criado com **createPool**.

### Benefícios do Pool de Conexões

O `pool de conexões` é uma prática recomendada para aumentar a eficiência e a escalabilidade da aplicação. Ao invés de abrir uma nova conexão com o MySQL para cada operação, um pool estabelece várias conexões de uma só vez, que são reutilizadas conforme necessário. Isso reduz a sobrecarga do sistema e melhora o desempenho da aplicação, especialmente em ambientes de alta carga.

### Por que usar um pool?

1.  **Economia de recursos:** Cada nova conexão ao banco requer tempo e recursos do sistema, então, ao reutilizar conexões, o pool otimiza a comunicação com o MySQL.
2.  **Redução de latência:** Conexões reutilizáveis diminuem o tempo de resposta de cada operação.
3.  **Controle de carga:** O pool permite limitar o número de conexões simultâneas, evitando que a aplicação sobrecarregue o banco.

## Entendendo a Configuração de Parâmetros

A função **createPool** recebe um objeto com os seguintes parâmetros de configuração:

<table><tbody><tr><td>Parâmetro</td><td>Descrição</td><td>Observações</td></tr><tr><td>host</td><td>O endereço do servidor MySQL</td><td>Como estamos usando um container Docker localmente, o valor é localhost, que representa o IP local da máquina.</td></tr><tr><td>user</td><td>Usuário que a aplicação utiliza para conectar ao MySQL</td><td>Aqui usamos `root`, que é o superusuário padrão. Em produção, é recomendado um usuário com permissões restritas.</td></tr><tr><td>port</td><td>Porta de comunicação com o MySQL</td><td>3306 é a porta exposta pelo container Docker.</td></tr><tr><td>password</td><td>Senha do usuário configurado</td><td>Para `root`, a senha é definida na variável `MYSQL_ROOT_PASSWORD` no `docker-compose`. Em ambiente de produção, use variáveis de ambiente seguras.</td></tr><tr><td>database</td><td>Nome do banco de dados que a aplicação acessa</td><td>Aqui, usamos `school_management_system`, conforme definido no `docker-compose`. É essencial verificar que este nome corresponda ao banco de dados criado.</td></tr></tbody></table>

<details>
<summary>OBS da IA</summary>

**Atenção**

-   Os valores padrão com `||` (ex.: senha `'password'`) são práticos em estudo, mas em produção é melhor falhar ao iniciar se a variável não existir do que conectar com credencial embutida no código.

**Para o SAP CAP**

-   No CAP não se cria pool de conexões: o banco é configurado em `cds.requires.db` (no `package.json` ou `.cdsrc.json`) e o framework gerencia conexões, pool e transação por requisição. Acesso via `cds.connect.to('db')` ou direto com `SELECT`/`INSERT` do `cds.ql`.

</details>

## Integrando o Express e Testando a Conexão

No arquivo `src/server.js`, vamos configurar o servidor e verificar a conexão com o MySQL:

```javascript
// src/server.js
const app = require('./app');
const connection = require('./database/connection');
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // Verificação de conexão com o MySQL
  const [result] = await connection.execute('SELECT 1');
  if (result) {
    console.log('MySQL connection successfully established');
  }
});
```

No `app.listen()`, testamos a conexão com o MySQL usando a query `SELECT 1`, que valida se o banco está acessível. A resposta é armazenada em `result`, e caso seja recebida, indica que a conexão foi bem-sucedida.

### Testando conexão MySQL e Node `Local`

Primeiro, subiremos o container do MySQL via Docker, enquanto o Node será executado localmente. Certifique-se de que não há outros containers ativos:

Para parar todos os containers da aplicação:

```bash
docker compose down
```

Agora, inicie apenas o container do MySQL:

```bash
docker compose up -d mysqldb
```

Após isso, você terá apenas o container do MySQL ativo. Agora, inicie a aplicação Node com o comando:

```bash
npm run dev
```

Se visualizar a mensagem `MySQL connection successfully established`, você completou a configuração da conexão MySQL com o Express! 🎉

### Testando conexão MySQL e Node via Docker

Agora, para rodar o Node também no Docker, pare a execução local do Node para evitar conflitos de porta e inicie a aplicação com:

```bash
docker compose up -d
```

Entre no container com o comando:

```bash
docker exec -it school_system_api sh
```

Ao tentar rodar `npm run dev`, pode aparecer um erro de conexão com o MySQL. Isso acontece porque o `host` do MySQL agora é o nome do serviço Docker, que configuramos como `mysqldb`.

```javascript
// const mysql = require('mysql2/promise');
// const connection = mysql.createPool({
  host: process.env.MYSQL_HOST || 'mysqldb',
//   port: process.env.MYSQL_PORT || 3306,
//   user: process.env.MYSQL_USER || 'root',
//   password: process.env.MYSQL_PASSWORD || 'password',
//   database: process.env.MYSQL_DATABASE_NAME || 'school_management_system',
// });
// module.exports = connection;
```

Agora, com o host `mysqldb`, a conexão deverá funcionar e você deverá visualizar a mensagem `MySQL connection successfully established`.

Para fixar os conceitos sobre o conteúdo, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1039084911)
