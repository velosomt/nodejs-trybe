# 5.3 - Utilizando MySQL no Docker

> Seção 5 - Persistência de Dados com Node.js · Lição 3 de 16

Nas últimas seções, utilizamos o módulo `fs` para persistência de dados, fazendo a leitura e escrita em um arquivo `.json`. Agora, vamos evoluir a nossa aplicação para utilizar o MySQL, persistindo os dados em um banco de dados relacional.

## Configuração do MySQL no `docker-compose.yml`

> **Atenção ⚠️:** mesmo que você não tenha vastos conhecimentos em Docker, é possível acompanhar os próximos passos e montar seu ambiente. Não se apegue a entender o Docker, o momento agora é de aprender osbre banco de dados. Teremos um momento melhor para aprender sobre Docker.

Para começar, vamos conferir o serviço `mysqldb` ao arquivo `docker-compose.yml`:

```yaml
  mysqldb:
    image: mysql:8.0.34
    container_name: school_system_db
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: school_management_system
    restart: unless-stopped
    healthcheck:
      # Deve aguardar o banco ficar operacional
      test: [ "CMD", "mysqladmin", "ping", "-h", "localhost" ]
      interval: 10s
      timeout: 5s
      retries: 5
    ports:
      - "3306:3306"
    volumes:
      - ./school_db.sql:/docker-entrypoint-initdb.d/school_db.sql
    networks:
      - backend
```

### Explicando a configuração

Neste arquivo, estamos criando um serviço chamado **mysqldb**, que será responsável por rodar o MySQL em um container Docker. Vamos entender os principais parâmetros:

1.  **image:** Define a versão do MySQL que será utilizada (neste caso, a versão 8.0.34).
    
2.  **container\_name:** Especifica um nome personalizado para o container, facilitando sua identificação em vez de usar um nome gerado automaticamente pelo Docker. Neste caso, o container será chamado school\_system\_db.
    
3.  **environment:** Especifica variáveis de ambiente, como:
    
4.  **MYSQL\_ROOT\_PASSWORD:** Define a senha do usuário root do MySQL.
5.  **MYSQL\_DATABASE:** Cria o banco de dados `school_management_system` automaticamente ao iniciar o container.
    
6.  **restart:** Define que o container será reiniciado automaticamente caso pare por algum motivo, exceto se for parado manualmente.
    
7.  **healthcheck:** Define um teste para verificar se o container está em pleno funcionamento. O teste verifica se o MySQL está pronto para aceitar conexões, e o Docker reinicia o container se o teste falhar. Para mais informações do funcionamento do Healthcheck, consulte a [documentação](https://docs.docker.com/engine/reference/builder/#healthcheck)
    
8.  **ports:** Mapeia a porta 3306 (porta padrão do MySQL no container) para a porta 3306 no seu computador local.
    
9.  **volumes:** O volume montado permite que o arquivo school\_db.sql seja copiado automaticamente para o diretório de inicialização do MySQL dentro do container (/docker-entrypoint-initdb.d/). Dessa forma, quando o container for iniciado pela primeira vez, o MySQL executará esse script e inicializará o banco de dados com as informações fornecidas.
    
10.  **networks:** Define a rede à qual o container está conectado, neste caso, a rede backend. Isso permite que o container do MySQL se comunique com outros serviços Docker na mesma rede, facilitando o isolamento e a comunicação interna entre os containers da aplicação.
     

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   Use `docker compose` (Compose V2, sem hífen); o binário `docker-compose` V1 foi descontinuado. A chave `version:` no topo do arquivo também é obsoleta.
-   **MySQL 8.0** tem fim de suporte em abril/2026 — para projetos novos use a **8.4 LTS**.

**Para o SAP CAP**

-   MySQL não é banco oficialmente suportado pelo CAP. O padrão é **SQLite** em desenvolvimento (`@cap-js/sqlite`, sem Docker), **SAP HANA Cloud** em produção (`@cap-js/hana`) e há suporte a **PostgreSQL** (`@cap-js/postgres`).
-   As tabelas são geradas a partir do CDS (`cds deploy`) — não se escreve script SQL de criação.

</details>

## Configuração do Node no `docker-compose.yml`

Outro serviço que esta no mesmo arquivo `docker-compose.yml`:

```yaml
  node:
    image: node:20.18-alpine3.19
    container_name: school_system_api
    tty: true
    stdin_open: true
    restart: unless-stopped
    working_dir: /app
    volumes:
      - ./:/app
    ports:
      - 3001:3001
    depends_on:
      mysqldb:
        condition: service_healthy
    networks:
      - backend
```

1.  **image:** Define a versão da imagem Node.js que será utilizada. Estamos usando a versão 20.18-alpine3.19, que é uma versão leve, adequada para ambiente de produção.
    
2.  **container\_name:** Especifica um nome personalizado para o container, facilitando a sua identificação. Neste caso, o container será chamado `school_system_api`.
    
3.  **tty:** Ativa a alocação de um terminal para o container. Isso garante que o terminal do container permaneça ativo, semelhante ao uso de `docker run -t`.
    
4.  **stdin\_open:** Mantém o terminal do container aberto para entrada de dados, como se estivesse utilizando o comando `docker run -i`, permitindo interação com o terminal.
    
5.  **restart:** Define que o container será reiniciado automaticamente caso pare por algum motivo, exceto se for parado manualmente.
    
6.  **working\_dir:** Define o diretório padrão onde os comandos serão executados dentro do container. Aqui, o diretório `/app` será o local de trabalho da aplicação.
    
7.  **volumes:** Mapeia diretórios externos para dentro do container:
    
8.  **./:/app:** Monta o diretório atual da máquina host (o código-fonte da aplicação) dentro do diretório `/app` do container, permitindo que alterações no código local sejam refletidas dentro do container.
    
9.  **ports:** Mapeia a porta 3001 (porta padrão da aplicação) no container para a mesma porta no host, permitindo o acesso à aplicação via `localhost:3001`.
    
10.  **depends\_on:** Define a dependência do serviço `node` em relação ao serviço `mysqldb`. Isso garante que o container Node.js só será iniciado após o banco de dados MySQL estar em pleno funcionamento, utilizando a condição `service_healthy` para aguardar a conclusão do healthcheck do banco.
     
11.  **networks:** Define a rede backend na qual o container será conectado, permitindo que os serviços se comuniquem entre si dentro do Docker.
     

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   A imagem `node:20` tem fim de suporte do Node 20 em 30/04/2026. Use uma LTS atual (`node:22-alpine` ou `node:24-alpine`).

</details>

## Subindo os Containers

Com as configurações prontas, agora podemos subir os containers utilizando o comando abaixo:

```bash
docker-compose up -d
```

Este comando inicializa os containers em segundo plano (modo `detached`). Use o comando `docker-compose ps` para verificar se os serviços estão rodando corretamente.

Para recapitular sobre o docker e aprofundar mais na estrutura do projeto, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1039083052)
