// "OBS da IA": observações adicionadas ao site/Markdown SEM alterar o conteúdo do curso.
// Cada item: slug da lição, `after` (id de um h2/h3 — a OBS entra no fim dessa seção;
// sem `after`, entra no fim da lição) e listas em mini-markdown (`código`, **negrito**).

const OBS = [
  // ---------------- Seção 2 — Node.js / módulos ----------------
  {
    slug: '4207878-2-2-sistema-de-modulos',
    moderno: [
      'O curso usa **CommonJS** (`require` / `module.exports`). O padrão oficial do JavaScript é **ES Modules** (`import` / `export`), habilitado com `"type": "module"` no `package.json` ou arquivos `.mjs`. Node 22+ já consegue até fazer `require()` de módulos ESM.',
      'Com ESM você ganha `await` no topo do arquivo (top-level await) e importações estáticas analisáveis por ferramentas.',
    ],
    cap: [
      'O CAP Node.js (`@sap/cds`) funciona com CommonJS e com ESM. Escolha um dos dois e use no projeto inteiro — nunca misture.',
      'O conceito de módulos continua valendo: handlers em `srv/*.js` são módulos que exportam a implementação do serviço.',
    ],
  },
  {
    slug: '4207900-2-3-utilizando-modulos-locais',
    moderno: [
      'Equivalente em ESM: `export function soma() {}` / `export default ...` e `import { soma } from \'./calc.js\'` (em ESM a extensão `.js` é obrigatória no caminho).',
    ],
    cap: [
      'No CAP, um módulo típico exporta a classe do serviço: `module.exports = class CatalogService extends cds.ApplicationService { ... }` (ou `export default class ...` em ESM).',
    ],
  },
  {
    slug: '4207902-2-4-utilizando-modulos-internos',
    moderno: [
      'Prefira o prefixo `node:` para módulos nativos: `require(\'node:fs\')`, `require(\'node:path\')`. Deixa explícito que é built-in e evita conflito com pacotes do npm de mesmo nome.',
    ],
  },
  {
    slug: '4207905-2-5-leitura-e-escrita-de-arquivos',
    moderno: [
      'O curso já usa a API de Promises (bom). A forma mais atual de importar é `require(\'node:fs/promises\')` (ou `import { readFile } from \'node:fs/promises\'`).',
      'Evite `readFileSync`/`writeFileSync` em servidor: bloqueiam o event loop e travam todas as requisições enquanto o disco responde.',
      'Em ESM dá para usar `await` direto no topo do arquivo, sem a função `main()`.',
    ],
    cap: [
      'No CAP você praticamente não lê/escreve JSON em disco para dados: os dados ficam em entidades CDS e os dados iniciais em arquivos CSV em `db/data/`.',
    ],
  },
  {
    slug: '4207908-2-6-combinando-modulos-internos',
    moderno: [
      '`__dirname` só existe em CommonJS. Em ESM use `import.meta.dirname` e `import.meta.filename` (Node 20.11+ / 21.2+).',
      'O curso usa `path.resolve(__dirname, ...)` — continua sendo a forma correta de montar caminhos independentes da pasta de onde o comando foi executado.',
    ],
  },
  {
    slug: '4207913-2-7-npm',
    moderno: [
      'Node 22+ tem `node --run <script>`, que executa scripts do `package.json` mais rápido que `npm run` (mas não executa os scripts `pre`/`post`).',
      '`npm pkg set scripts.start="node index.js"` edita o `package.json` pela linha de comando.',
      'Para projetos novos, considere `npm ci` em CI/Docker (instala exatamente o que está no `package-lock.json`).',
    ],
    cap: [
      'O projeto CAP nasce com `cds init <nome>` (em vez de `npm init -y`) e roda em desenvolvimento com `cds watch`, que já faz o reload automático.',
      'Instale a CLI globalmente com `npm i -g @sap/cds-dk`.',
    ],
  },
  {
    slug: '4207914-2-8-utilizando-modulos-externos',
    moderno: [
      '`readline-sync` está sem atualizações há anos. O Node tem nativamente `node:readline/promises`: `const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); const nome = await rl.question(\'Qual seu nome? \');` — sem dependência externa.',
      'O conceito de dependências (`dependencies` x `devDependencies`, `--save-exact`) continua igual e é essencial para o CAP.',
    ],
  },

  // ---------------- Seção 3 — Express ----------------
  {
    slug: '4476469-3-2-express',
    after: 'instalando-o-express',
    moderno: [
      'O curso fixa **Express 4.17.1**. A versão estável atual é o **Express 5** (`npm i express` já instala a 5.x). Principais mudanças: erros de handlers `async` vão sozinhos para o middleware de erro, sintaxe de rotas mais rígida (`*` precisa de nome, `?` opcional mudou para `{/:id}`), `req.body` fica `undefined` sem parser e `req.query` passa a ser somente leitura.',
      'O código básico do curso (`express()`, `app.get`, `app.listen`, `express.Router`) funciona igual no Express 5.',
    ],
  },
  {
    slug: '4476469-3-2-express',
    after: 'ganhando-produtividade-com-nodemon',
    moderno: [
      'O Node tem watch mode nativo (estável no Node 22+): `"dev": "node --watch src/server.js"` — dispensa o `nodemon`. Combina com `--env-file`: `node --watch --env-file=.env src/server.js`.',
    ],
    cap: [
      'No CAP você **não cria o servidor Express na mão**: o `@sap/cds` sobe um Express internamente e expõe os serviços definidos em CDS. `cds watch` faz o papel do `nodemon`.',
      'Se precisar de middlewares próprios, crie um `server.js` na raiz e use `cds.on(\'bootstrap\', (app) => app.use(...))`.',
    ],
  },
  {
    slug: '4476470-3-3-nossa-primeira-api-hello-world',
    cap: [
      'O "Hello World" no CAP é uma **function** declarada em CDS e implementada em JS. O endpoint fica em `GET /odata/v4/hello/hello(to=\'Mundo\')`.',
    ],
    exemplo: [
      { lang: 'cds', src: `// srv/hello-service.cds
service HelloService {
  function hello(to : String) returns String;
}` },
      { lang: 'javascript', src: `// srv/hello-service.js
const cds = require('@sap/cds');

module.exports = class HelloService extends cds.ApplicationService {
  init() {
    this.on('hello', (req) => \`Hello, \${req.data.to}!\`);
    return super.init();
  }
};` },
    ],
  },
  {
    slug: '4476471-3-4-api-clients',
    moderno: [
      'Além de Postman/Insomnia/Thunder Client, uma opção leve e versionável é a extensão **REST Client** do VS Code com arquivos `.http` (as requisições ficam no repositório junto com o código).',
    ],
    cap: [
      'Arquivos `.http` são muito usados em projetos CAP — `cds add http` gera exemplos de requisições para os serviços do projeto.',
    ],
  },
  {
    slug: '4476472-3-5-operacoes-de-leitura-get',
    after: 'criando-o-endpoint-get',
    moderno: [
      'Ler o arquivo JSON a cada requisição é didático; em aplicação real os dados ficam em banco (seção 5).',
    ],
    cap: [
      'No CAP o CRUD inteiro das seções 3.5 a 3.9 é **gerado a partir do modelo** — não se escreve rota GET/POST/PUT/PATCH/DELETE. Os dados iniciais vêm de um CSV e rodam em SQLite em memória no `cds watch`.',
      'Endpoints resultantes: `GET /odata/v4/teams/Teams`, `GET /odata/v4/teams/Teams(1)`, `POST`, `PATCH`, `PUT` e `DELETE` no mesmo recurso.',
    ],
    exemplo: [
      { lang: 'cds', src: `// db/schema.cds
namespace soccer;

entity Teams {
  key ID   : Integer;
  name     : String(100);
  initials : String(3);
}

// srv/teams-service.cds
using soccer from '../db/schema';

service TeamsService {
  entity Teams as projection on soccer.Teams;
}

// db/data/soccer-Teams.csv
// ID;name;initials
// 1;Avaí/Kindermann;AVA` },
    ],
  },
  {
    slug: '4476473-3-6-query-strings-e-url-parameters',
    after: 'cuidado-com-a-ordem-das-rotas',
    moderno: [
      'No Express 5 a sintaxe de rota mudou: parâmetro opcional é `/teams{/:id}` e curinga precisa de nome (`/*splat`). Rotas simples como `/teams/:teamId` não mudam. A regra de ordem das rotas continua valendo.',
    ],
    cap: [
      'No CAP (OData V4) os equivalentes são padronizados: chave na URL `/Teams(1)` e filtros com opções de consulta como `?$filter=contains(initials,\'A\')`, `$select`, `$orderby`, `$top`, `$skip`, `$expand` — sem escrever código para cada filtro.',
    ],
  },
  {
    slug: '4476474-3-7-operacoes-de-criacao-post',
    moderno: [
      'Para gerar IDs únicos, use o nativo `crypto.randomUUID()` (global no Node 19+) em vez de calcular a partir do tamanho da lista.',
      'No Express 5, sem `app.use(express.json())` o `req.body` fica `undefined` (no 4 era `{}`).',
    ],
    cap: [
      'No CAP o POST é automático. Para gerar ID use o aspect `cuid` (`entity Teams : cuid { ... }`) e, para lógica antes de gravar, `this.before(\'CREATE\', \'Teams\', (req) => { ... })` com os dados em `req.data`.',
    ],
  },
  {
    slug: '4476475-3-8-operacoes-de-atualizacao-put-e-patch',
    after: 'diferenca-entre-put-e-patch',
    cap: [
      'O CAP aceita PUT e PATCH automaticamente; ambos disparam o evento `UPDATE`. Lógica customizada: `this.before(\'UPDATE\', \'Teams\', ...)`.',
      'Use o aspect `managed` para preencher `createdAt/createdBy/modifiedAt/modifiedBy` sem código.',
    ],
  },
  {
    slug: '4476476-3-9-operacoes-de-remocao-delete',
    cap: [
      'DELETE também é gerado. Regras como "não excluir se tiver vínculo" vão em `this.before(\'DELETE\', \'Teams\', (req) => req.reject(409, \'...\'))`.',
    ],
  },
  {
    slug: '4476477-3-10-e-essa-tal-de-arquitetura-rest',
    cap: [
      'O protocolo padrão do CAP é **OData V4** (REST com convenções de consulta, metadados e paginação), que é o que os apps SAP Fiori consomem.',
      'Se precisar de REST "puro", anote o serviço com `@protocol: \'rest\'` (ou `@rest`). Um mesmo serviço pode ser servido em mais de um protocolo.',
    ],
  },
  {
    slug: '4476479-3-12-middlewares-no-express',
    moderno: [
      'Validações manuais campo a campo costumam ser trocadas por schemas declarativos (Joi, visto na seção 6, ou **Zod**, hoje muito popular).',
    ],
    cap: [
      'No CAP boa parte dessas validações é **declarativa no CDS**: `@mandatory`, `@assert.range`, `@assert.format`, `@assert.target`, `@readonly`. O restante vai em handlers `before` usando `req.error()` / `req.reject()`.',
    ],
    exemplo: [
      { lang: 'cds', src: `entity Teams {
  key ID   : Integer;
  name     : String(100) @mandatory;
  initials : String(3)   @mandatory @assert.format: '^[A-Z]{3}$';
}` },
    ],
  },
  {
    slug: '4476480-3-13-evoluindo-aplicacoes-com-middlewares',
    after: 'o-que-express-json-faz',
    moderno: [
      'O curso já usa `express.json()` (correto; o pacote `body-parser` separado não é mais necessário). No Express 5, `express.urlencoded()` passa a usar `extended: false` por padrão.',
      'Para logs de requisição, veja a OBS da lição 8.6.',
    ],
    cap: [
      'No CAP o parse do body, o 404 de rota inexistente e os logs básicos já são feitos pelo framework.',
    ],
  },
  {
    slug: '4476481-3-14-middlewares-de-erro',
    moderno: [
      'No **Express 5**, se um handler `async` lançar erro ou tiver uma Promise rejeitada, o erro vai **automaticamente** para o middleware de erro — o `try/catch` só para chamar `next(error)` deixa de ser necessário (e o pacote `express-async-errors`, citado na seção 8, fica obsoleto).',
      'A assinatura de 4 parâmetros `(err, req, res, next)` continua obrigatória para o middleware de erro.',
    ],
    cap: [
      'No CAP use `req.reject(404, \'TEAM_NOT_FOUND\')` para abortar ou `req.error(...)` para acumular vários erros de validação. O CAP converte para resposta HTTP/OData com status correto e mensagens traduzíveis (i18n em `_i18n/messages.properties`). Evite `throw new Error()` cru em handler.',
    ],
  },
  {
    slug: '4476483-3-16-roteamento-de-api',
    cap: [
      'No CAP não há `express.Router`: cada `service` CDS vira um conjunto de endpoints. O caminho padrão é derivado do nome (`TeamsService` → `/odata/v4/teams`) e pode ser alterado com `@path: \'/teams\'`.',
    ],
  },

  // ---------------- Seção 4 — Testes ----------------
  {
    slug: '4476415-4-3-testes-automatizados',
    after: 'introducao-ao-jest',
    moderno: [
      'O Node tem test runner nativo estável (`node:test` + `node:assert`, Node 20+): `node --test`. **Vitest** é outra alternativa moderna com API compatível com Jest. Jest 29 continua amplamente usado — o conhecimento é transferível.',
    ],
    cap: [
      'O CAP tem o `cds.test`, que sobe o servidor do projeto (com SQLite em memória) dentro do teste e funciona com Jest, Mocha ou `node --test`. Em versões recentes ele é instalado pelo pacote `@cap-js/cds-test`.',
    ],
  },
  {
    slug: '4476419-4-7-testes-de-integracao-com-supertest',
    after: 'supertest',
    moderno: [
      'O `@types/jest` só serve para autocompletar no editor quando o projeto é JS puro.',
    ],
    cap: [
      'No CAP o `cds.test` substitui o supertest: ele devolve clientes HTTP prontos.',
    ],
    exemplo: [
      { lang: 'javascript', src: `const cds = require('@sap/cds');

const { GET, POST, expect } = cds.test(__dirname + '/..');

test('lista os times', async () => {
  const { status, data } = await GET('/odata/v4/teams/Teams');
  expect(status).to.equal(200);
  expect(data.value).to.have.length(3);
});` },
    ],
  },
  {
    slug: '4476421-4-9-testando-rota-com-metodo-post',
    after: 'reversao-das-alteracoes-apos-os-testes',
    moderno: [
      'Em vez de chamar `restoreAllMocks` manualmente, dá para configurar `restoreMocks: true` no `jest.config.js`.',
    ],
    cap: [
      'No CAP raramente se mocka o acesso a dados: o teste usa um banco SQLite em memória carregado dos CSVs. Para voltar ao estado inicial entre testes: `const { data } = cds.test(...); beforeEach(data.reset);`.',
    ],
  },
  {
    slug: '4476422-4-10-configuracoes-do-jest',
    after: 'cobertura-de-codigo-coverage',
    moderno: [
      'Com o runner nativo, a cobertura sai com `node --test --experimental-test-coverage`. As opções de Jest mostradas na lição continuam válidas.',
    ],
  },

  // ---------------- Seção 5 — Banco de dados ----------------
  {
    slug: '4476558-5-3-utilizando-mysql-no-docker',
    after: 'configuracao-do-mysql-no-docker-compose-yml',
    moderno: [
      'Use `docker compose` (Compose V2, sem hífen); o binário `docker-compose` V1 foi descontinuado. A chave `version:` no topo do arquivo também é obsoleta.',
      '**MySQL 8.0** tem fim de suporte em abril/2026 — para projetos novos use a **8.4 LTS**.',
    ],
    cap: [
      'MySQL não é banco oficialmente suportado pelo CAP. O padrão é **SQLite** em desenvolvimento (`@cap-js/sqlite`, sem Docker), **SAP HANA Cloud** em produção (`@cap-js/hana`) e há suporte a **PostgreSQL** (`@cap-js/postgres`).',
      'As tabelas são geradas a partir do CDS (`cds deploy`) — não se escreve script SQL de criação.',
    ],
  },
  {
    slug: '4476558-5-3-utilizando-mysql-no-docker',
    after: 'configuracao-do-node-no-docker-compose-yml',
    moderno: [
      'A imagem `node:20` tem fim de suporte do Node 20 em 30/04/2026. Use uma LTS atual (`node:22-alpine` ou `node:24-alpine`).',
    ],
  },
  {
    slug: '4476559-5-4-configurando-o-mysql-no-node-com-express',
    after: 'entendendo-a-configuracao-de-parametros',
    atencao: [
      'Os valores padrão com `||` (ex.: senha `\'password\'`) são práticos em estudo, mas em produção é melhor falhar ao iniciar se a variável não existir do que conectar com credencial embutida no código.',
    ],
    cap: [
      'No CAP não se cria pool de conexões: o banco é configurado em `cds.requires.db` (no `package.json` ou `.cdsrc.json`) e o framework gerencia conexões, pool e transação por requisição. Acesso via `cds.connect.to(\'db\')` ou direto com `SELECT`/`INSERT` do `cds.ql`.',
    ],
  },
  {
    slug: '4476560-5-5-variaveis-de-ambiente',
    after: 'configurando-o-arquivo-env',
    moderno: [
      'O curso já usa a forma moderna: `node --env-file=.env` (Node 20.6+), dispensando o pacote `dotenv`. Também existe `process.loadEnvFile()` (Node 21.7+) para carregar via código.',
    ],
    cap: [
      'O CAP centraliza configuração em `cds.env` (`package.json` → `cds`, `.cdsrc.json`) com **profiles** (`[development]`, `[production]`, `[hybrid]`). Credenciais locais vão em `.cdsrc-private.json` (fora do git). No SAP BTP as credenciais vêm dos service bindings, e `cds bind` conecta o ambiente local a serviços reais da nuvem.',
    ],
  },
  {
    slug: '4476562-5-7-operacoes-de-leitura',
    after: 'estruturando-a-conexao-com-o-banco-de-dados',
    cap: [
      'Equivalente com `cds.ql`, sem SQL escrito à mão e já parametrizado: `await SELECT.from(Students).columns(\'ID\', \'name\')`. Selecione só as colunas necessárias e prefira `$expand`/projeções a consultas dentro de loop (N+1).',
    ],
  },
  {
    slug: '4476563-5-8-operacoes-utilizando-prepared-statement',
    after: 'entendendo-o-conceito-de-prepared-statements',
    cap: [
      'O `cds.ql` gera consultas parametrizadas automaticamente: `SELECT.one.from(Students).where({ ID: id })`. Até a forma com template string é segura, pois vira parâmetro: ``SELECT.from(Students).where`ID = ${id}` ``.',
      'O que **não** fazer: concatenar strings em `cds.run(\'SELECT ... \' + valor)` — volta o risco de SQL injection.',
    ],
  },
  {
    slug: '4476564-5-9-operacoes-de-criacao',
    cap: [
      'Equivalente: `await INSERT.into(Students).entries(dados)`. Para vários registros, passe o array inteiro em uma única chamada (escrita em lote), nunca um INSERT por item em loop.',
    ],
  },
  {
    slug: '4476565-5-10-operacoes-de-atualizacao-e-remocao',
    cap: [
      'Equivalentes: `await UPDATE(Students, id).with(dados)` e `await DELETE.from(Students).where({ ID: id })`. Também existe `UPSERT.into(...)`. Em handlers CAP tudo roda na transação da requisição (commit/rollback automático).',
    ],
  },
  {
    slug: '4476567-5-12-testes-de-integracao-com-banco-de-dados',
    after: 'o-que-e-mockar-uma-funcao',
    moderno: [
      'O runner nativo também tem mocks: `import { mock } from \'node:test\'; mock.method(objeto, \'metodo\', impl)`.',
    ],
    cap: [
      'No CAP prefira testar contra o SQLite em memória com dados de CSV (`cds.test`), que é rápido e exercita o modelo real. Mock fica para serviços externos (ex.: `cds.connect.to(\'ViaCEP\')`).',
    ],
  },

  // ---------------- Seção 6 — Arquitetura em camadas ----------------
  {
    slug: '4476575-6-3-arquitetura-em-camadas-model-service-e-controller',
    cap: [
      'Mapeamento para o CAP: **Model** → entidades CDS em `db/*.cds`; **Service** → definição em `srv/*.cds` (projeções) + regras de negócio em `srv/*.js`; **Controller** → não existe, os adaptadores de protocolo do CAP (OData/REST) recebem a requisição e montam a resposta.',
      'Os ganchos `before` (validar/rejeitar), `on` (substituir a implementação) e `after` (enriquecer o resultado) substituem a maior parte do código das três camadas.',
    ],
  },
  {
    slug: '4476576-6-4-camada-model',
    after: 'instalando-e-configurando-camelize',
    moderno: [
      'Sem biblioteca extra, dá para resolver o snake_case com alias no próprio SQL (`SELECT birth_date AS birthDate`).',
    ],
    cap: [
      'No CAP não há conversão manual: os nomes vêm do CDS e o framework gera as tabelas/colunas a partir dele. `camelize` não é necessário.',
    ],
  },
  {
    slug: '4476577-6-5-camada-controller',
    cap: [
      'No CAP o papel do controller (ler `req.params`/`req.body`, escolher status HTTP) é feito pelo framework. No handler você recebe `req.data`, `req.params`, `req.user` e devolve dados ou usa `req.reject(status, msg)`.',
    ],
  },
  {
    slug: '4476578-6-6-validacao-de-dados-de-entrada-com-middlewares',
    after: 'configurando-a-biblioteca-joi',
    moderno: [
      'Joi segue mantido, mas **Zod** (ou Valibot) virou a escolha mais comum em projetos novos — especialmente com TypeScript, porque o schema também gera o tipo.',
    ],
    cap: [
      'No CAP os tipos do CDS já validam tipo/tamanho (`String(14)`, `Date`, `Integer`) e as anotações `@mandatory`, `@assert.format`, `@assert.range` cobrem a maior parte do que o Joi faz aqui, sem middleware.',
    ],
  },
  {
    slug: '4476580-6-8-camada-service-e-as-regras-de-negocio',
    cap: [
      'Regras de negócio no CAP ficam em handlers de serviço: `this.before(\'CREATE\', \'Enrollments\', async (req) => { ... req.reject(409, \'SUBJECT_FULL\') })`. A lógica é a mesma ensinada aqui, só muda o "encaixe".',
    ],
  },
  {
    slug: '4476581-6-9-implementando-a-camada-service',
    after: 'implementando-a-regra-de-negocio-limite-de-estudantes-por-disciplina',
    cap: [
      'Contagem no CAP sem trazer as linhas: ``const { count } = await SELECT.one`count(*) as count`.from(Enrollments).where({ subject_ID: id })``. Evite consultar dentro de loop: agrupe com `IN` + `Map` quando precisar de vários.',
    ],
  },
  {
    slug: '4476583-6-11-chamadas-externas-como-parte-da-regra-de-negocio',
    after: 'arquivo-src-service-studentservice-js',
    moderno: [
      'O Node 18+ tem `fetch` nativo (estável no 21+), então o `axios` deixou de ser obrigatório: `const res = await fetch(url); const data = await res.json();`. Lembre de definir timeout (`AbortSignal.timeout(5000)`).',
    ],
    cap: [
      'No CAP, APIs externas viram **remote services**: configure em `cds.requires` (ex.: `ViaCEP: { kind: \'rest\', credentials: { url: \'https://viacep.com.br\' } }`) e use `const viacep = await cds.connect.to(\'ViaCEP\'); await viacep.get(\'/ws/01001000/json/\')`. Para APIs SAP, `cds import` gera o modelo a partir do EDMX/OpenAPI e, no BTP, a URL/credenciais vêm de destinations.',
    ],
  },
  {
    slug: '4476585-6-13-testes-de-unidade-camada-model',
    cap: [
      'No CAP a maior parte dos testes é de integração com `cds.test` (rápidos com SQLite em memória). Testes de unidade com mocks continuam úteis para funções puras de regra de negócio e para isolar chamadas externas — o que se aprende nas lições 6.13 a 6.15 se aplica.',
    ],
  },

  // ---------------- Seção 7 — Autenticação ----------------
  {
    slug: '4476597-7-3-bcrypt-js-seguranca-das-senhas',
    after: 'instalando-o-bcrypt-js',
    moderno: [
      'O `bcryptjs` já tem versão 3 (ESM e tipos inclusos). Prefira as funções assíncronas `await bcrypt.hash(senha, 10)` e `await bcrypt.compare(...)`: `hashSync`/`compareSync` bloqueiam o event loop.',
      'A OWASP recomenda hoje **Argon2id** (pacote `argon2`) como primeira opção; bcrypt continua aceitável. O Node também tem `crypto.scrypt` nativo.',
    ],
    cap: [
      'Em CAP no SAP BTP a aplicação **não armazena senhas**: a autenticação é delegada ao **SAP Cloud Identity Services (IAS)** ou **XSUAA**. O conceito de hash continua importante, mas você não vai implementá-lo no CAP.',
    ],
  },
  {
    slug: '4476597-7-3-bcrypt-js-seguranca-das-senhas',
    after: 'criando-o-controller-de-login',
    atencao: [
      'Nesta versão o login devolve o objeto do usuário inteiro, incluindo o hash da senha. Nunca retorne o hash na resposta (a lição 7.5 corrige isso ao devolver um token). Login bem-sucedido costuma responder `200`, não `201`.',
    ],
  },
  {
    slug: '4476598-7-4-introducao-ao-jwt',
    cap: [
      'No BTP os JWTs são emitidos pelo XSUAA/IAS e validados pelo CAP (biblioteca `@sap/xssec`). A estrutura header/payload/signature explicada aqui é exatamente o que você vai ver ao inspecionar esses tokens.',
    ],
  },
  {
    slug: '4476599-7-5-autenticacao',
    after: 'instalacao-do-jwt-no-node-js',
    moderno: [
      '`jsonwebtoken` ainda é muito usado; a alternativa moderna é **`jose`** (sem dependências, ESM, Web Crypto, funciona em Node/Deno/edge).',
      'Ao verificar, fixe o algoritmo: `jwt.verify(token, secret, { algorithms: [\'HS256\'] })`.',
    ],
    atencao: [
      '`process.env.JWT_SECRET || \'secret\'`: se a variável faltar, a API assina tokens com um segredo público. Em produção, aborte a inicialização quando o segredo não estiver definido.',
    ],
  },
  {
    slug: '4476599-7-5-autenticacao',
    after: '2-criando-o-middleware-de-autenticacao',
    atencao: [
      'No middleware mostrado, a linha `if (!token)` aparece **antes** de `const token = ...` — isso gera `ReferenceError`. A primeira verificação deveria ser `if (!bearerToken)`.',
    ],
    cap: [
      'No CAP não há middleware de JWT manual. Declare no CDS: `@requires: \'authenticated-user\'` no serviço/entidade. Em desenvolvimento use `cds.requires.auth.kind: \'mocked\'` (usuários de teste no `package.json`); em produção `xsuaa` ou `ias`. O usuário logado fica em `req.user` (`req.user.id`, `req.user.is(\'admin\')`).',
    ],
  },
  {
    slug: '4476600-7-6-autorizacao',
    after: 'implementando-a-autorizacao',
    cap: [
      'A regra desta lição (dono da receita ou admin/manager) é **declarativa** no CAP, sem `if` no service. Os papéis vêm do `xs-security.json` / IAS, e `createdBy` é preenchido pelo aspect `managed`.',
    ],
    exemplo: [
      { lang: 'cds', src: `annotate CookService.Recipes with @(restrict: [
  { grant: 'READ', to: 'authenticated-user' },
  { grant: ['CREATE'], to: 'authenticated-user' },
  { grant: ['UPDATE', 'DELETE'], to: 'authenticated-user', where: 'createdBy = $user' },
  { grant: '*', to: ['admin', 'manager'] }
]);` },
    ],
  },
  {
    slug: '4476602-7-8-introducao-ao-oauth-2-0',
    after: 'fluxo-basico',
    moderno: [
      'Implementar o fluxo na mão é ótimo para aprender. Em produção use bibliotecas como **openid-client**, **Passport** ou **Auth.js**, e inclua o parâmetro `state` (proteção CSRF) e **PKCE**, hoje recomendado para todos os clientes OAuth 2.0.',
    ],
    cap: [
      'No BTP quem faz o fluxo OAuth/OIDC é o **approuter** (`@sap/approuter`) junto com IAS/XSUAA; login social ou corporativo é configurado no IAS. O CAP só recebe o JWT já validado.',
    ],
  },
  {
    slug: '4476602-7-8-introducao-ao-oauth-2-0',
    after: 'env-example',
    atencao: [
      'O `.env.example` declara `GITHUB_SECRET`, mas o service lê `process.env.GITHUB_CLIENT_SECRET`. Use o mesmo nome nos dois lugares, senão o segredo chega `undefined`.',
    ],
  },

  // ---------------- Seção 8 — Segurança e boas práticas ----------------
  {
    slug: '4476617-8-2-rate-limiting-e-throttling',
    after: 'instalacao-de-pacotes',
    atencao: [
      'O comando aparece como `npm install - E` (com espaço); o correto é `npm install -E ...`.',
    ],
  },
  {
    slug: '4476617-8-2-rate-limiting-e-throttling',
    after: 'aplicando-os-middlewares',
    moderno: [
      'O store padrão fica na memória do processo: com várias instâncias, cada uma conta separado. Em produção use um store compartilhado (ex.: Redis com `rate-limit-redis`) ou faça o limite no gateway/proxy.',
    ],
    cap: [
      'No BTP o rate limiting costuma ficar na borda (ex.: **SAP API Management** na Integration Suite). Se quiser no próprio app CAP, o mesmo middleware pode ser registrado em `cds.on(\'bootstrap\', (app) => app.use(limiter))`.',
    ],
  },
  {
    slug: '4476618-8-3-sql-injection',
    after: '1-use-prepared-statements',
    cap: [
      'Com `cds.ql` (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) os valores são sempre enviados como parâmetros. O risco só volta se você montar SQL com concatenação em `cds.run(...)`. Autorização com `@restrict`/`where` também ajuda a limitar o que cada usuário enxerga.',
    ],
  },
  {
    slug: '4476619-8-4-protecao-de-cabecalho-com-helmet',
    after: 'adicionando-o-helmet-a-sua-aplicacao-cookmaster',
    moderno: [
      'Helmet 8 é a versão atual. O `require(\'express-async-errors\')` que aparece no código é dispensável no **Express 5**, que já trata erros de handlers `async` (veja a OBS da lição 3.14), e o pacote está sem manutenção.',
    ],
    cap: [
      'No CAP o Helmet entra via `cds.on(\'bootstrap\', (app) => app.use(helmet()))`. Em apps Fiori no BTP, cabeçalhos como CSP costumam ser definidos no approuter.',
    ],
  },
  {
    slug: '4476620-8-5-compression-compressao-de-respostas-http',
    moderno: [
      'Em produção a compressão geralmente fica no proxy/CDN (nginx, load balancer), que também oferece **Brotli**, mais eficiente que gzip.',
    ],
    cap: [
      'No BTP o **approuter** tem configuração de compressão (`compression` no `xs-app.json`).',
    ],
  },
  {
    slug: '4476621-8-6-monitorando-logs-de-requisicoes-com-morgan',
    moderno: [
      'Morgan gera linhas de texto. Em produção o padrão atual é **log estruturado em JSON** (ex.: `pino` + `pino-http`), mais fácil de filtrar em ferramentas de observabilidade.',
    ],
    cap: [
      'No CAP use o logger do framework: `const LOG = cds.log(\'teams\'); LOG.info(\'...\')`, com níveis configuráveis por módulo em `cds.log.levels`. No BTP os logs vão para o SAP Cloud Logging, e o plugin `@cap-js/telemetry` adiciona OpenTelemetry.',
    ],
  },
  {
    slug: '4476622-8-7-limitando-o-tamanho-do-corpo-das-requisicoes',
    moderno: [
      'No Express 5, `express.urlencoded()` tem `extended: false` por padrão; o curso passa `extended: true` explicitamente, então o comportamento se mantém.',
    ],
    cap: [
      'No CAP o limite do body é configurado em `cds.server.body_parser.limit` (ex.: `"1mb"`), sem middleware próprio.',
    ],
  },
  {
    slug: '4476623-8-8-politica-de-origem-com-cors',
    cap: [
      'Em apps SAP Fiori no BTP o **approuter** serve a UI e encaminha as chamadas para o CAP na mesma origem, então normalmente **não é preciso CORS**. Se precisar (ex.: front separado), adicione o `cors` via `cds.on(\'bootstrap\')`.',
    ],
  },
  {
    slug: '4476624-8-9-documentacao-com-swagger',
    after: 'estrutura-do-swagger-json',
    moderno: [
      'Manter o `swagger.json` à mão tende a desatualizar. Hoje é comum **gerar** a especificação a partir do código ou dos schemas (ex.: `zod-to-openapi`) e usar OpenAPI 3.1.',
    ],
    cap: [
      'No CAP a especificação sai do próprio modelo: `cds compile srv --to openapi`. Para servir uma UI Swagger em desenvolvimento existe o plugin `cds-swagger-ui-express`.',
    ],
  },
  {
    slug: '4476624-8-9-documentacao-com-swagger',
    after: 'documentando-endpoints',
    atencao: [
      'No exemplo de endpoints a chave aparece como `"path"`; na especificação OpenAPI o nome correto é **`"paths"`**, senão o Swagger UI não lista as rotas.',
    ],
  },

  // ---------------- Seção 9 — Deploy ----------------
  {
    slug: '4505299-9-3-computacao-em-nuvem',
    cap: [
      'O **SAP BTP** é a PaaS onde apps CAP costumam rodar, com dois runtimes principais: **Cloud Foundry** e **Kyma** (Kubernetes).',
    ],
  },
  {
    slug: '4505300-9-4-criando-um-dockerfile',
    after: 'entendendo-o-dockerfile',
    moderno: [
      'Imagem base: Node 20 tem fim de suporte em 30/04/2026 → use `node:22-alpine` ou `node:24-alpine`.',
      'Em imagem de produção prefira `RUN npm ci --omit=dev` (reprodutível e sem devDependencies), rode como usuário sem privilégio (`USER node`) e tenha um `.dockerignore` (ex.: `node_modules`, `.env`).',
      'Use `docker compose` (V2) no lugar de `docker-compose`.',
    ],
    cap: [
      'No **Cloud Foundry** um app CAP normalmente não precisa de Dockerfile: `cds add mta` → `mbt build` → `cf deploy`. No **Kyma**, `cds add helm` prepara os charts e a imagem de container.',
    ],
  },
  {
    slug: '4505302-9-6-configurando-servicos-no-railway',
    cap: [
      'Equivalente no BTP: em vez de criar o banco manualmente, o `mta.yaml` declara os serviços (HANA Cloud, XSUAA/IAS, destination) e o deploy cria e vincula tudo.',
    ],
  },
  {
    slug: '4505303-9-7-deploy-da-aplicacao-no-railway',
    after: 'adicionando-variaveis-de-ambiente',
    cap: [
      'No BTP não se configuram usuário/senha do banco em variáveis: as credenciais chegam pelo service binding (`VCAP_SERVICES` no Cloud Foundry, secrets no Kyma) e o CAP as lê sozinho. Para testar localmente com serviços reais use `cds bind` + `cds watch --profile hybrid`.',
    ],
  },

  // ---------------- CI/CD (ligações com a seção "[OBS da IA] - CI/CD") ----------------
  {
    slug: '4207913-2-7-npm',
    cicd: [
      'Os scripts do `package.json` (`test`, `lint`, `start`) são o **contrato com o pipeline**: o servidor de CI só chama `npm test` e olha o código de saída. Faça commit do `package-lock.json` e use `npm ci` no pipeline e no Docker.',
      'Veja [IA.2 - Preparando o projeto para a CI](lesson:ia-cicd-2-preparando-o-projeto).',
    ],
  },
  {
    slug: '4476415-4-3-testes-automatizados',
    cicd: [
      'Testes automatizados rendem mais quando rodam **sozinhos a cada pull request**, antes do merge. Isso é a CI. Sem ela, os testes dependem de alguém lembrar de rodá-los.',
      'Veja [IA.3 - GitHub Actions: o primeiro pipeline de CI](lesson:ia-cicd-3-github-actions).',
    ],
  },
  {
    slug: '4476422-4-10-configuracoes-do-jest',
    cicd: [
      'Com `coverageThreshold` no `jest.config.js`, o Jest **falha** se a cobertura cair abaixo do mínimo, e o pipeline bloqueia o merge.',
      'Cuidado com `.only` esquecido: no pipeline, só aquele teste roda e o resto passa "verde" sem ter sido executado. Uma regra de lint (`jest/no-focused-tests`) evita isso.',
      'Veja [IA.2 - Preparando o projeto para a CI](lesson:ia-cicd-2-preparando-o-projeto).',
    ],
  },
  {
    slug: '4476560-5-5-variaveis-de-ambiente',
    cicd: [
      'No pipeline não existe `.env`: os valores sensíveis vêm de **Secrets** do GitHub (`${{ secrets.NOME }}`) e chegam à aplicação como variáveis de ambiente. Faça commit só de um `.env.example`, com as chaves e valores fictícios.',
      'Veja [IA.4 - Segredos, ambientes e proteção da branch main](lesson:ia-cicd-4-segredos-e-protecao).',
    ],
  },
  {
    slug: '4476567-5-12-testes-de-integracao-com-banco-de-dados',
    cicd: [
      'Testes que usam **mocks** (como os da 5.13) rodam em qualquer pipeline sem banco. Para testar contra um MySQL de verdade no pipeline, suba um **service container** descartável no próprio job do GitHub Actions.',
      'Veja a seção "Indo além" de [IA.3 - GitHub Actions](lesson:ia-cicd-3-github-actions).',
    ],
  },
  {
    slug: '4505298-9-2-deploy',
    cicd: [
      'O curso mostra o deploy disparado por push, sem nada que verifique o código antes. Em times, o deploy vem depois de um **pipeline de CI/CD**: instalar → testar → empacotar → publicar → verificar, tudo automático e repetível.',
      'Veja a seção [OBS da IA - CI/CD](lesson:ia-cicd-1-introducao).',
    ],
  },
  {
    slug: '4505300-9-4-criando-um-dockerfile',
    cicd: [
      'Inclua `docker build` na CI para garantir que o Dockerfile continua compilando a cada PR, e não descobrir o erro só na hora do deploy.',
      'Veja [IA.3 - GitHub Actions](lesson:ia-cicd-3-github-actions).',
    ],
  },
  {
    slug: '4505303-9-7-deploy-da-aplicacao-no-railway',
    cicd: [
      'Do jeito configurado aqui, o Railway faz deploy de **todo** push na branch, **mesmo com testes quebrados**. Ative **Wait for CI** no serviço para que ele espere o GitHub Actions passar, ou faça o deploy pelo próprio pipeline.',
      'Popular o banco manualmente funciona uma vez. Para as próximas mudanças, use **migrations** versionadas aplicadas no deploy.',
      'Veja [IA.5 - Deploy contínuo da API Cookmaster](lesson:ia-cicd-5-deploy-continuo).',
    ],
  },
  {
    slug: '4505304-9-8-para-nao-esquecer-mais-quiz',
    cicd: [
      'Para fechar a lacuna de CI/CD do curso há uma seção extra: [OBS da IA - CI/CD: o mínimo para deploy automatizado](lesson:ia-cicd-1-introducao). Ela inclui a versão para SAP CAP no BTP em [IA.6](lesson:ia-cicd-6-sap-cap).',
    ],
  },
];

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// mini-markdown: ``código com `crase` `` , `código`, **negrito**
const inline = (s) => escapeHtml(s)
  .replace(/``\s?(.+?)\s?``|`([^`]+)`/g, (_, a, b) => `<code>${a ?? b}</code>`)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(lesson:([\w-]+)\)/g, '<a href="@@LESSON:$2@@">$1</a>');

const list = (items) => `<ul>${items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`;

const codeBlock = ({ lang, src }) => lang === 'cds'
  ? `<pre data-lang="cds"><code class="language-plaintext">${escapeHtml(src)}</code></pre>`
  : `<pre><code class="language-${lang}">${escapeHtml(src)}</code></pre>`;

function renderObsBody(o) {
  return [
    o.moderno && `<p class="obs-ia__label">Alternativa mais moderna</p>${list(o.moderno)}`,
    o.atencao && `<p class="obs-ia__label obs-ia__label--warn">Atenção</p>${list(o.atencao)}`,
    o.cap && `<p class="obs-ia__label obs-ia__label--cap">Para o SAP CAP</p>${list(o.cap)}`,
    o.cicd && `<p class="obs-ia__label obs-ia__label--cicd">CI/CD</p>${list(o.cicd)}`,
    o.exemplo && o.exemplo.map(codeBlock).join(''),
  ].filter(Boolean).join('');
}

const bySlug = new Map();
for (const o of OBS) {
  if (!bySlug.has(o.slug)) bySlug.set(o.slug, []);
  bySlug.get(o.slug).push({ after: o.after, html: renderObsBody(o) });
}

module.exports = { obsFor: (slug) => bySlug.get(slug) ?? [], obsSlugs: [...bySlug.keys()] };
