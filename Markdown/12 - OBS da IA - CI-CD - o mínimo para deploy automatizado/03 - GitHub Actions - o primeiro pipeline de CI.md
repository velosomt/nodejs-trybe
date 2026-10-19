# IA.3 - GitHub Actions: o primeiro pipeline de CI

> [OBS da IA] - CI/CD: o mínimo para deploy automatizado · Lição 3 de 7

> **Conteúdo escrito pela IA** (GitHub Copilot) como complemento ao curso. Não faz parte do material original da Trybe. Versões de ferramentas e telas citadas refletem out/2026: confira a documentação oficial antes de usar em produção.

O **GitHub Actions** executa automações descritas em arquivos YAML dentro da pasta `.github/workflows/` do repositório. Nesta lição você vai criar a CI da API Cookmaster: a cada push e a cada pull request, instalar, verificar e testar o projeto.

## Vocabulário mínimo

| Conceito | O que é |
| --- | --- |
| **Workflow** | Um arquivo `.yml` em `.github/workflows/`. Um repositório pode ter vários (ex.: `ci.yml`, `deploy.yml`). |
| **Evento** (`on`) | O que dispara o workflow: `push`, `pull_request`, `release`, `schedule`, `workflow_dispatch` (botão manual). |
| **Job** | Um conjunto de passos que roda em **uma** máquina. Jobs rodam em paralelo, a menos que você declare dependência com `needs`. |
| **Step** | Um passo do job: ou um comando de terminal (`run`), ou uma action pronta (`uses`). |
| **Runner** | A máquina virtual que executa o job (`runs-on: ubuntu-latest`). Já vem com Node, Docker, Git etc. É descartada no fim. |
| **Action** | Um passo reutilizável publicado por alguém, como `actions/checkout` (baixa o código) e `actions/setup-node` (instala o Node). |

## O primeiro workflow

Crie o arquivo `.github/workflows/ci.yml` na raiz do projeto Cookmaster:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Baixar o código
        uses: actions/checkout@v5

      - name: Instalar Node.js
        uses: actions/setup-node@v5
        with:
          node-version-file: .nvmrc
          cache: npm

      - name: Instalar dependências
        run: npm ci

      - name: Lint
        run: npm run lint --if-present

      - name: Testes
        run: npm test

      - name: Garantir que a imagem Docker compila
        run: docker build -t cookmaster-backend .
```

### Linha a linha

-   `on.push.branches: [main]` — roda a cada push na `main` (é isso que vai liberar o deploy na lição IA.5).
-   `on.pull_request` — roda em todo pull request, **antes** do merge. É aqui que a CI te salva.
-   `permissions: contents: read` — o token automático do workflow (`GITHUB_TOKEN`) só pode ler o repositório. Dê apenas a permissão necessária.
-   `actions/checkout` — sem ele o runner não tem o seu código.
-   `actions/setup-node` com `node-version-file: .nvmrc` — usa a mesma versão de Node do projeto. `cache: npm` guarda o cache do npm entre execuções e acelera o `npm ci`.
-   `npm run lint --if-present` — roda o lint se o script existir. Se não existir, segue em frente.
-   `npm test` — se algum teste falhar, o job fica vermelho e os passos seguintes não rodam.
-   `docker build` — confirma que o [Dockerfile](../11%20-%20Se%C3%A7%C3%A3o%209%20-%20Automatiza%C3%A7%C3%A3o%20e%20Deploy%20de%20Aplica%C3%A7%C3%B5es/04%20-%20Criando%20um%20Dockerfile.md) continua válido. Não publica a imagem em lugar nenhum.

As versões das actions (`@v5`) evoluem. Confira a mais recente na página de cada action no GitHub Marketplace. Na lição IA.4 você verá como o **Dependabot** pode atualizá-las para você.

## Vendo o resultado

1.  Faça commit e push do arquivo: `git add .github && git commit -m "ci: adiciona workflow" && git push`.
2.  No GitHub, abra a aba **Actions** do repositório. Clique na execução para ver o log de cada passo.
3.  O commit e o pull request ganham um ✓ verde ou um ✗ vermelho. Esse status é o que você vai exigir antes do merge (lição IA.4) e antes do deploy (lição IA.5).

Experimente quebrar um teste de propósito e abrir um pull request: o ✗ aparece no PR, com o link para o log do erro.

## Dois ajustes úteis

### Cancelar execuções antigas

Se você der vários pushes seguidos no mesmo PR, não faz sentido testar todos. Adicione no nível raiz do workflow:

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

A expressão só cancela execuções de pull request. Na `main`, cada commit é testado até o fim.

### Testar em mais de uma versão do Node (matriz)

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [22, 24]
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: ${{ matrix.node }}
          cache: npm
      - run: npm ci
      - run: npm test
```

Útil para bibliotecas ou para validar uma troca de versão. Para uma API com uma única versão em produção, uma versão basta.

## Indo além: MySQL de verdade dentro do pipeline

Se você tiver testes que precisam do banco (como a ideia da [lição 5.12](../07%20-%20Se%C3%A7%C3%A3o%205%20-%20Persist%C3%AAncia%20de%20Dados%20com%20Node.js/12%20-%20Testes%20de%20Integra%C3%A7%C3%A3o%20com%20Banco%20de%20Dados.md)), o job pode subir um MySQL descartável como **service container**, igual ao que você fez com Docker na [lição 5.3](../07%20-%20Se%C3%A7%C3%A3o%205%20-%20Persist%C3%AAncia%20de%20Dados%20com%20Node.js/03%20-%20Utilizando%20MySQL%20no%20Docker.md):

```yaml
jobs:
  test-db:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.4
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: cookmaster_test
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping -h 127.0.0.1 -proot"
          --health-interval=5s --health-timeout=5s --health-retries=10
    env:
      MYSQLHOST: 127.0.0.1
      MYSQLPORT: 3306
      MYSQLUSER: root
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: cookmaster_test
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - name: Criar tabelas e dados de teste
        run: mysql -h 127.0.0.1 -uroot -proot cookmaster_test < database/schema.sql
      - run: npm run test:db
```

-   O `options` com `--health-cmd` faz o job esperar o MySQL ficar pronto antes de começar os passos.
-   A senha `root` aqui não é segredo: o banco nasce e morre com o job e não guarda dado real. Senhas de bancos **reais** vão sempre em segredos (lição IA.4).
-   Os nomes das variáveis são os mesmos que o `connection.js` da [lição 9.7](../11%20-%20Se%C3%A7%C3%A3o%209%20-%20Automatiza%C3%A7%C3%A3o%20e%20Deploy%20de%20Aplica%C3%A7%C3%B5es/07%20-%20Deploy%20da%20aplica%C3%A7%C3%A3o%20no%20Railway.md) lê. A mesma aplicação roda local, no CI e em produção, mudando só o ambiente.
-   Ajuste o caminho do script SQL (`database/schema.sql`) para o do seu projeto.
