# 9.4 - Criando um Dockerfile

> Seção 9 - Automatização e Deploy de Aplicações · Lição 4 de 11

Nessa etapa, vamos configurar um Dockerfile para a aplicação **Cookmaster**, possibilitando a criação de uma imagem Docker e facilitando o deploy da aplicação.

> **Relembrando 🧠:** O **Dockerfile** é um arquivo que contém instruções para criar uma imagem Docker. Nele, definimos os passos necessários para configurar o ambiente e executar a aplicação. Ao seguir essas instruções, o Docker automatiza o processo de criação da imagem.

## Dockefile

Na raiz do projeto Cookmaster, crie um arquivo chamado `Dockerfile` com o seguinte conteúdo:

```dockerfile
FROM node:20.18-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/ ./src/

EXPOSE 3001

ENTRYPOINT [ "npm", "run" ]

CMD [ "start" ]
```

### Entendendo o Dockerfile

-   `FROM node:20.18-alpine3.19`: define a imagem base, neste caso, a oficial do Node.js na versão 20.18, utilizando o Alpine Linux 3.19, uma distribuição Linux leve e otimizada para containers.
    
-   `WORKDIR /app`: define o diretório de trabalho dentro do container onde os comandos subsequentes serão executados.
    
-   `COPY package*.json ./`: copia os arquivos `package.json` e `package-lock.json` para o diretório de trabalho.
    
-   `RUN npm install`: instala as dependências listadas no arquivo `package.json`.
    
-   `COPY src/ ./src/`: copia o diretório `src` (que contém o código da aplicação) para o container.
    
-   `EXPOSE 3001`: informa ao Docker que o container usará a porta 3001.
    
-   `ENTRYPOINT [ "npm", "run" ]`: define o comando principal que será executado no container.
    
-   `CMD [ "start" ]`: especifica o argumento para o comando definido no `ENTRYPOINT`.
    

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   Imagem base: Node 20 tem fim de suporte em 30/04/2026 → use `node:22-alpine` ou `node:24-alpine`.
-   Em imagem de produção prefira `RUN npm ci --omit=dev` (reprodutível e sem devDependencies), rode como usuário sem privilégio (`USER node`) e tenha um `.dockerignore` (ex.: `node_modules`, `.env`).
-   Use `docker compose` (V2) no lugar de `docker-compose`.

**Para o SAP CAP**

-   No **Cloud Foundry** um app CAP normalmente não precisa de Dockerfile: `cds add mta` → `mbt build` → `cf deploy`. No **Kyma**, `cds add helm` prepara os charts e a imagem de container.

</details>

## Ajustando o docker-compose.yml

Para integrar o `Dockerfile` ao `docker-compose.yml`, precisamos alterar o serviço `node`. O novo trecho ficará assim:

```yaml
services:
  node:
    container_name: cookmaster_api
    build: # novas configurações
      context: .
      dockerfile: Dockerfile
    tty: true
    stdin_open: true
    restart: unless-stopped
    ports:
      - 3001:3001
    environment:
      MYSQL_USER: root
      MYSQL_PASSWORD: password
      MYSQL_HOST: mysqldb
      MYSQL_PORT: 3306
      MYSQL_DATABASE_NAME: cookmaster_db
    depends_on:
      mysqldb:
        condition: service_healthy
    networks:
      - backend

  mysqldb:
  # Restante das configurações
```

### Explicando as mudanças

-   `build`: indica ao Docker Compose que o serviço será construído a partir do Dockerfile localizado no diretório atual (context) e utiliza o arquivo Dockerfile.
    
-   **Remoção de `volumes` e `working_dir`**: como o código já está embutido na imagem Docker, essas configurações não são mais necessárias.
    

## Ajustando o package.json

A configuração atual do script `start` no arquivo `package.json` utiliza a flag `--env-file`, que busca um arquivo `.env`. No entanto, como as variáveis de ambiente serão fornecidas diretamente pelo `docker-compose.yml`, e futuramente pelo serviço que usaremos para fazer o deploy, vamos modificar o script `start` para:

```json
{
  // "name": "cookmaster",
  // "version": "1.0.0",
  // "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    // "dev": "nodemon --env-file=.env src/server.js",
    // "lint": "eslint --no-inline-config --no-error-on-unmatched-pattern -c .eslintrc.json ."
  }
}
```

## Executando a aplicação

Agora, podemos construir a imagem e subir os containers com o comando:

```bash
docker-compose up -d --build
```

Se tudo estiver configurado corretamente, a aplicação Cookmaster estará rodando em um container Docker. Acesse a aplicação pelo endereço `http://localhost:3001` e verifique se tudo está funcionando corretamente.

Não será mais necessário executar manualmente os comandos `npm start` ou `npm run dev`, pois tudo será gerenciado pelo Docker.

<details>
<summary>OBS da IA</summary>

**CI/CD**

-   Inclua `docker build` na CI para garantir que o Dockerfile continua compilando a cada PR, e não descobrir o erro só na hora do deploy.
-   Veja [IA.3 - GitHub Actions](../12%20-%20OBS%20da%20IA%20-%20CI-CD%20-%20o%20m%C3%ADnimo%20para%20deploy%20automatizado/03%20-%20GitHub%20Actions%20-%20o%20primeiro%20pipeline%20de%20CI.md).

</details>
