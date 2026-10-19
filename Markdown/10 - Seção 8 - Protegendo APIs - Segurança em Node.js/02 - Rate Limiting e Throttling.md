# 8.2 - Rate Limiting e Throttling

> Seção 8 - Protegendo APIs: Segurança em Node.js · Lição 2 de 12

Quando desenvolvemos APIs, garantir a estabilidade e proteger os serviços contra abusos é uma prioridade. **Rate Limiting e Throttling** são estratégias fundamentais para controlar o tráfego de requisições, mitigar ataques e assegurar uma experiência consistente para os usuários.

## Conceitos Fundamentais

-   **Rate Limiting**: Define o número máximo de requisições que um cliente pode fazer em um determinado período. Por exemplo, 100 requisições por minuto.
    
-   **Throttling**: É a prática de desacelerar o envio de requisições após atingir o limite permitido, em vez de bloqueá-las completamente. Assim, o cliente pode continuar a utilizar a API, mas de forma mais controlada.
    

## Principais Benefícios

1.  **Proteger contra abusos**: Evita que bots ou usuários mal-intencionados sobrecarreguem o servidor.
2.  **Estabilizar a API**: Garante que o serviço continue funcionando mesmo sob alta carga.
3.  **Melhorar a experiência do usuário**: Impede que o mau uso de alguns degrade o desempenho para todos.
4.  **Reduzir custos operacionais**: Controlando o uso excessivo, você otimiza recursos e evita gastos desnecessários.

## Instalação de Pacotes

Para implementar Rate Limiting e Throttling em uma aplicação Node.js, podemos utilizar bibliotecas como [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) e [express-slow-down](https://www.npmjs.com/package/express-slow-down). Ambas são mantidas pela mesma equipe e oferecem uma integração simples e eficaz.

```bash
npm install - E express-rate-limit@7.4.1 express-slow-down@2.0.3
```

<details>
<summary>OBS da IA</summary>

**Atenção**

-   O comando aparece como `npm install - E` (com espaço); o correto é `npm install -E ...`.

</details>

## Implementação na API Cookmaster

Continuaremos utilizando a API Cookmaster como exemplo nessa seção.

Você pode acessar o projeto por meio do mesmo repositório utilizado na seções anteriores ou diretamente neste link: [08-protegendo-apis-seguranca-em-nodejs/parte-01-inicio](https://github.com/learnwithtrybe/node-codigos/tree/main/08-protegendo-apis-seguranca-em-nodejs/parte-01-inicio).

### Rate Limiting com `express-rate-limit`

Podemos limitar o número de requisições por cliente usando o código abaixo:

```javascript
// src/middlewares/rate.limiter.middleware.js

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: 'Muitas requisições vindas deste IP. Por favor, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
```

#### Explicação das Configurações:

1.  `windowMs`: Define o intervalo de tempo para aplicar o limite de requisições, em milissegundos.
2.  No exemplo, configuramos 15 minutos (15 \* 60 \* 1000 ms). Isso significa que cada IP tem um período de 15 minutos para realizar um número limitado de requisições.
    
3.  `limit`: O número máximo de requisições permitidas por cada cliente (identificado pelo IP) durante o intervalo definido por `windowMs`
    
4.  No exemplo, cada cliente pode realizar até **100 requisições** dentro do intervalo de 15 minutos.
    
5.  `message`: Mensagem de erro retornada quando o cliente excede o limite de requisições.
    
6.  `standardHeaders`: Quando habilitado como `true`, os headers `RateLimit-*` são incluídos nas respostas. Eles informam o estado atual do limite. Alguns exemplos:
    
7.  **RateLimit-Limit**: O número máximo de requisições permitidas (neste caso, 100).
8.  **RateLimit-Remaining**: Quantas requisições ainda podem ser feitas antes do bloqueio.
9.  **RateLimit-Reset**: Quando o limite será resetado (tempo restante em segundos).
    
10.  `legacyHeaders`: Determina se os headers`X-RateLimit-*` (antigos) devem ser usados.
     
11.  Quando `false`, os headers antigos são desabilitados para evitar redundância ou confusão.
12.  Essa prática é recomendada em APIs modernas, pois os headers antigos são considerados obsoletos.

### Throttling com `express-slow-down`

Para desacelerar requisições após um limite inicial, usamos o `express-slow-down`:

```javascript
// src/middlewares/throttle.middleware.js

const slowDown = require('express-slow-down');

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: (hits) => hits * 100,
});

module.exports = speedLimiter;
```

#### Explicação do Código

1.  `windowMs`: Define o intervalo de tempo para aplicar o limite de requisições, em milissegundos.
2.  No exemplo, configuramos 15 minutos (15 \* 60 \* 1000 ms). Isso significa que cada IP tem um período de 15 minutos para realizar um número limitado de requisições.
    
3.  `delayAfter`: Indica o número de requisições que podem ser feitas livremente antes de o Throttling entrar em ação.
    
4.  No exemplo, após **50 requisições** dentro de 15 minutos, o Throttling começa a aplicar atrasos nas requisições adicionais.
    
5.  `delayMs`: Define o atraso (em milissegundos) adicionado a cada requisição extra após atingir o limite configurado em delayAfter.
    
6.  No exemplo, usamos uma função para calcular o atraso progressivamente com base no número de requisições feitas;
7.  `hits` representa o número de requisições feitas além do limite.
8.  Para cada requisição extra, o atraso aumenta em **100ms** (progressivo).
9.  Exemplo:
10.  Requisição 51: 100ms de atraso.
11.  Requisição 52: 200ms de atraso.
12.  Requisição 53: 300ms de atraso.
13.  E assim por diante.

### Aplicando os Middlewares

No arquivo principal da aplicação, o uso dos middlewares é feito com `app.use`. O middleware do **Rate Limiting** bloqueia requisições após atingir o limite, enquanto o **Throttling** desacelera requisições após um limite inicial.

```javascript
// src/app.js

// Outras Importações

const rateLimiter = require('./middlewares/rate.limiter.middleware');
const speedLimiter = require('./middlewares/throttle.middleware');

// const app = express();

app.set('trust proxy', 1); // Evita bloqueios da aplicação devido ao express-rate-limit

// app.use(express.json());
app.use(rateLimiter);
app.use(speedLimiter);

// Rotas

// module.exports = app;
```

Assista ao vídeo abaixo para ver uma demonstração prática da implementação de Rate Limiting e Throttling em uma API Node.js:

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   O store padrão fica na memória do processo: com várias instâncias, cada uma conta separado. Em produção use um store compartilhado (ex.: Redis com `rate-limit-redis`) ou faça o limite no gateway/proxy.

**Para o SAP CAP**

-   No BTP o rate limiting costuma ficar na borda (ex.: **SAP API Management** na Integration Suite). Se quiser no próprio app CAP, o mesmo middleware pode ser registrado em `cds.on('bootstrap', (app) => app.use(limiter))`.

</details>
