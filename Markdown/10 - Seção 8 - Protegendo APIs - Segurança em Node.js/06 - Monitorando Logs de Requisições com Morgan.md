# 8.6 - Monitorando Logs de Requisições com Morgan

> Seção 8 - Protegendo APIs: Segurança em Node.js · Lição 6 de 12

O [Morgan](https://www.npmjs.com/package/morgan) é uma biblioteca de middleware para o Express que facilita o registro de logs de requisições HTTP feitas à sua aplicação. Ele é extremamente útil para monitorar acessos, rastrear problemas e analisar o comportamento dos usuários, seja durante o desenvolvimento ou em produção.

## O que é o Morgan?

O **Morgan** é uma ferramenta de logging para aplicações Node.js, projetada para registrar informações detalhadas sobre cada requisição recebida pelo servidor. Ele permite acompanhar métricas como:

-   Método HTTP (GET, POST, etc.).
-   URL da rota acessada.
-   Código de status da resposta.
-   Tempo de resposta do servidor.
-   Tamanho do payload transferido.

## Principais Benefícios

1.  **Diagnóstico rápido**: Logs detalhados ajudam a identificar gargalos ou falhas no sistema.
    
2.  **Facilidade de integração**: Simples de configurar, com suporte a diversos formatos de log.
    
3.  **Flexibilidade**: Permite personalizar os formatos dos logs para incluir apenas as informações que você precisa.
    
4.  **Monitoramento em produção**: Quando integrado a serviços de log remoto, ajuda a rastrear problemas em tempo real.
    

## Adicionando o Morgan à sua Aplicação Cookmaster

Primeiro, instale o Morgan na sua aplicação com o seguinte comando:

```bash
npm install -E morgan@1.10.0
```

No arquivo `src/app.js`, importe e configure o Morgan como middleware:

```javascript
// src/app.js

// const express = require('express');
// const helmet = require('helmet');
// const compression = require('compression');
const morgan = require('morgan');
// require('express-async-errors');

// Outras Importações

// const app = express();

app.use(morgan('dev'));

// Outras Configurações e Rotas
```

Com essa configuração, o Morgan registrará logs detalhados de cada requisição feita à sua aplicação.

## Formatos de Log

O Morgan suporta diferentes formatos de log, como:

-   **`dev`**: Formato detalhado, ideal para desenvolvimento. Exibe método, URL, status, tempo de resposta e tamanho do payload.
    
-   **`combined`**: Inclui informações completas como o IP do cliente e o agente do usuário (navegador). Ótimo para produção.
    
-   **`common`**: Formato resumido, similar ao `combined`, mas sem o agente do usuário.
    
-   **`short`**: Menos detalhado que o `dev`, focado em tempo de resposta.
    
-   **`tiny`**: O mais minimalista, exibindo apenas método, status e tempo de resposta.
    

Você pode alterar o formato para um mais adequado ao seu ambiente de produção:

```javascript
app.use(morgan('combined')); // Ideal para produção
```

## Teste: Log no Console

Com o Morgan configurado, faça uma requisição para qualquer rota da aplicação e observe o log gerado no console. Por exemplo `GET /recipes/1`, você verá algo parecido com:

```bash
GET /recipes/1 200 9.255 ms - 203
```

**O que analisar**:

-   **Método e URL**: `GET /recipes/1`.
-   **Código de status**: `200`.
-   **Tempo de resposta**: `9.255 ms`.
-   **Tamanho do payload**: `203 bytes`.

## Logs Personalizados

O Morgan também permite criar formatos de log personalizados. Por exemplo, para registrar o método HTTP, URL, e tempo de resposta:

```javascript
// src/app.js
morgan.token('custom-date', () => new Date().toISOString());

app.use(
  morgan(':custom-date :method :url :status - :response-time ms', {
    skip: (_req, res) => res.statusCode < 400, // Apenas loga respostas com erro (status >= 400)
  }),
);
```

Com essa configuração, o Morgan exibirá logs apenas para requisições com status de erro, no formato `2024-12-03T17:25:54.391Z POST /recipes 401 - 7.617 ms`.

## Resumo

O Morgan é uma ferramenta poderosa para registrar logs de requisições HTTP. Sua facilidade de uso e flexibilidade o tornam indispensável para monitorar e depurar aplicações Node.js.

Com ele, você pode:

-   Acompanhar o comportamento dos usuários.
-   Diagnosticar problemas em produção.
-   Personalizar logs para atender às necessidades específicas do seu projeto.

Integrar o Morgan à API Cookmaster adiciona um nível de rastreabilidade essencial para o crescimento e a manutenção da aplicação.

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   Morgan gera linhas de texto. Em produção o padrão atual é **log estruturado em JSON** (ex.: `pino` + `pino-http`), mais fácil de filtrar em ferramentas de observabilidade.

**Para o SAP CAP**

-   No CAP use o logger do framework: `const LOG = cds.log('teams'); LOG.info('...')`, com níveis configuráveis por módulo em `cds.log.levels`. No BTP os logs vão para o SAP Cloud Logging, e o plugin `@cap-js/telemetry` adiciona OpenTelemetry.

</details>
