# 8.8 - Política de Origem com CORS

> Seção 8 - Protegendo APIs: Segurança em Node.js · Lição 8 de 12

O [CORS (Cross-Origin Resource Sharing)](https://developer.mozilla.org/pt-BR/docs/Glossary/CORS) é um mecanismo que controla como os recursos de uma aplicação web podem ser acessados por origens diferentes daquela em que o servidor está hospedado. Configurar o CORS corretamente é essencial para garantir a segurança e funcionalidade de APIs modernas, como a Cookmaster API, especialmente quando há consumo de recursos de diferentes domínios.

## O que é o CORS?

Por padrão, navegadores bloqueiam requisições feitas por uma aplicação que não esteja hospedada no mesmo domínio, protocolo ou porta do servidor. Esse bloqueio é uma medida de segurança conhecida como [Same-Origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).

O **CORS** permite que o servidor especifique quais origens externas têm permissão para acessar os recursos, flexibilizando a política de mesma origem sem comprometer a segurança.

## Principais Benefícios

1.  **Permitir integrações**: APIs frequentemente precisam ser consumidas por diferentes front-ends ou aplicativos, hospedados em domínios distintos.
    
2.  **Evitar erros no cliente**: Sem o CORS configurado, navegadores rejeitarão requisições, exibindo erros como "*Access to fetch at... has been blocked by CORS policy*".
    
3.  **Manter controle de acesso**: Configurações de CORS permitem especificar quem pode acessar os recursos e de que maneira.
    

## Configurando o CORS na API Cookmaster

Para configurar o CORS na Cookmaster API, utilizaremos o middleware [cors](https://www.npmjs.com/package/cors), que simplifica o processo de configuração.

Primeiro, instale o pacote `cors` na sua aplicação com o seguinte comando:

```bash
npm install -E cors@2.8.5
```

Em seguida, adicione o middleware ao arquivo `src/app.js`:

```javascript
// src/app.js

const cors = require('cors');
// Outras Importações

app.use(cors());

// Outras Configurações e Rotas
```

Essa configuração básica permite que qualquer cliente acesse os recursos da API. É útil para `desenvolvimento`, mas `não é recomendada para produção` devido à falta de restrição.

## Personalizando o CORS

Para maior segurança, você pode especificar quais origens têm permissão para acessar os recursos:

```javascript
const corsOptions = {
  origin: ['https://myfrontend.com', 'https://admin.myfrontend.com'], // Apenas essas origens podem acessar
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true, // Permite envio de cookies e credenciais
};

app.use(cors(corsOptions));
```

**O que analisar**:

-   `origin`: Define quais domínios têm permissão para acessar os recursos.
    
-   `'*'` permite todas as origens (não recomendado em produção).
    
-   Uma lista específica, como no exemplo, restringe o acesso.
    
-   `methods`: Limita os métodos HTTP permitidos, como GET, POST, etc.
    
-   `allowedHeaders`: Especifica quais cabeçalhos são aceitos nas requisições, como Authorization para tokens JWT.
    
-   `credentials`: Permite que cookies ou credenciais sejam enviados junto às requisições.
    

## Boas Práticas ao Configurar o CORS

-   **Restringer origens em produção**: Permita apenas os domínios que realmente precisam acessar a API.
    
-   **Evitar '\*' em credenciais**: Ao usar `credentials: true`, o origin deve ser específico e não um caractere curinga.
    
-   **Documentar as permissões**: Certifique-se de documentar claramente as origens e métodos permitidos para facilitar manutenção.
    

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   Em apps SAP Fiori no BTP o **approuter** serve a UI e encaminha as chamadas para o CAP na mesma origem, então normalmente **não é preciso CORS**. Se precisar (ex.: front separado), adicione o `cors` via `cds.on('bootstrap')`.

</details>
