# 8.7 - Limitando o Tamanho do Corpo das Requisições

> Seção 8 - Protegendo APIs: Segurança em Node.js · Lição 7 de 12

Controlar o tamanho do corpo das requisições HTTP enviadas à sua aplicação é uma medida essencial para melhorar a segurança e a performance do servidor. Isso evita que usuários mal-intencionados ou erros acidentais enviem dados excessivamente grandes, que podem sobrecarregar o sistema ou criar vulnerabilidades, como [ataques de negação de serviço (DoS)](https://developer.mozilla.org/en-US/docs/Glossary/DOS_attack).

## Principais Benefícios

1.  **Mitigação de Ataques DoS**: Requisições com corpos muito grande podem consumir recursos desnecessários e sobrecarregar o servidor.
    
2.  **Proteção contra falhas**: Dados excessivamente grandes podem causar falhas em operações como parsing ou validação.
    
3.  **Melhoria de performance**: Limitar o tamanho evita o processamento desnecessário de grandes quantidades de dados.
    
4.  **Boa prática de segurança**: Estabelece limites nítidos para a aplicação, evitando comportamentos imprevisíveis.
    

## Como funciona o controle de tamanho?

O middleware `express.json` ou `express.urlencoded`, utilizado para parsing de requisições JSON ou dados codificados como URL, permite definir o tamanho máximo do corpo da requisição. Isso é feito configurando o parâmetro limit ao inicializar esses middlewares.

## Implementação na API Cookmaster

Para implementar o controle de tamanho, basta ajustar as configurações do middleware no arquivo `src/app.js`:

```javascript
// src/app.js

// const express = require('express');
// Outras Importações

// const app = express();

app.use(express.json({ limit: '1mb' })); // Limita o corpo JSON a 1 MB
app.use(express.urlencoded({ limit: '1mb', extended: true })); // Limita dados de formulários a 1 MB


// Outras Configurações e Rotas
```

**O que analisar**:

-   `limit: '1mb'`: Define que o tamanho máximo permitido para o corpo da requisição é de 1 megabyte.
    
-   `extended: true`: Permite o parsing de dados complexos em `urlencoded`.
    

## Teste: Enviando uma Requisição Excedente

Se o corpo da requisição ultrapassar o limite configurado, o Express retornará uma resposta com `status 413` (Payload Too Large) por padrão. Para facilitar o teste, você pode alterar o limite para um valor menor e enviar uma requisição que exceda esse tamanho.

```javascript
app.use(express.json({ limit: '1b' })); // Limita o corpo JSON a 1 byte
```

Para visualizar o erro, execute uma requisicão POST com um corpo maior que 1 byte e crie um middleware de tratamento de erros no arquivo `src/app.js`:

```javascript
// src/app.js

// Outras Configurações e Rotas

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload Too Large' });
  }
  next(err);
});
app.use(errorHandler);

module.exports = app;
```

**O que analisar**:

-   `err.type === 'entity.too.large'`: Verifica se o erro gerado é devido ao tamanho do corpo da requisição.
    
-   `res.status(413).json({ error: 'Payload Too Large' })`: Retorna uma resposta com status 413 e uma mensagem de erro.
    
-   `next(err)`: Chama o próximo middleware de tratamento de erros (`app.use(errorHandler)`).
    

## Boas Práticas

1.  **Defina limites realistas**: Ajuste o tamanho máximo permitido com base nas necessidades da aplicação.
    
2.  APIs que lidam com arquivos podem ter limites mais altos (ex.: 10 MB para imagens).
    
3.  APIs apenas com texto (ex.: dados de cadastro) podem ter limites menores (ex.: 500 KB ou 1 MB).
    
4.  **Monitore a utilização**: Use ferramentas de log, como o Morgan, para identificar requisições que frequentemente atingem o limite.
    
5.  **Valide dados no cliente**: Antes de enviar grandes payloads, valide e compacte os dados no lado do cliente, quando possível.
    

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   No Express 5, `express.urlencoded()` tem `extended: false` por padrão; o curso passa `extended: true` explicitamente, então o comportamento se mantém.

**Para o SAP CAP**

-   No CAP o limite do body é configurado em `cds.server.body_parser.limit` (ex.: `"1mb"`), sem middleware próprio.

</details>
