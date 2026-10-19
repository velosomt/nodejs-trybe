# 8.9 - Documentação com Swagger

> Seção 8 - Protegendo APIs: Segurança em Node.js · Lição 9 de 12

A documentação é um elemento essencial no desenvolvimento de APIs, pois facilita a comunicação entre desenvolvedores, integradores e usuários. O [Swagger](https://swagger.io/) é uma das ferramentas mais populares para criar documentações interativas e dinâmicas, permitindo que os usuários explorem e testem endpoints diretamente em uma interface amigável.

## O que é o Swagger?

O **Swagger** é um ecossistema que inclui ferramentas para documentar, projetar e testar APIs RESTful. A documentação gerada é baseada na especificação **OpenAPI**, que define padrões para a descrição de APIs.

Com o **Swagger UI**, você pode visualizar a documentação em um formato interativo e executar chamadas HTTP diretamente na interface.

## Principais Benefícios

1.  **Facilidade de uso**: Com uma interface intuitiva, desenvolvedores e integradores podem explorar os endpoints rapidamente.
    
2.  **Testes diretos**: Permite testar os endpoints diretamente da documentação, reduzindo o tempo de desenvolvimento e depuração.
    
3.  **Melhora a comunicação**: Uma boa documentação elimina ambiguidades e garante que todos os usuários entendam os endpoints.
    
4.  **Padronização**: Seguir a especificação OpenAPI promove consistência no design da API.
    

## Instalando o Swagger na Cookmaster API

Para integrar o Swagger, utilizaremos o pacote [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express), que fornece uma interface baseada no Swagger UI.

```bash
npm install -E swagger-ui-express@5.0.1
```

Crie um arquivo swagger.json na pasta src para armazenar a especificação da API. Você pode gerar esse arquivo manualmente ou utilizar ferramentas como o [Swagger Editor](https://editor.swagger.io/).

### Estrutura do `swagger.json`

O conteúdo inicial do arquivo pode ser algo como:

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Cookmaster API",
    "description": "Documentação da API Cookmaster para gerenciamento de receitas e usuários.",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://localhost:3001",
      "description": "Servidor Local"
    }
  ],
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "paths": {}
}
```

**O que analisar**:

-   `openapi`: Define a versão da especificação OpenAPI que está sendo usada. No exemplo, `3.0.0` é a versão mais recente e amplamente compatível.
    
-   `info`: Metadados sobre a API, incluindo título, descrição e versão.
    
-   `servers`: Lista de URLs base para acessar a API. Cada entrada deve incluir:
    
-   `url`: O endereço do servidor. No exemplo, `http://localhost:3001`.
-   `description`: Descrição do ambiente, como "Servidor Local" ou "Produção".
    
-   `components`: Define partes reutilizáveis, como esquemas de segurança.
    
-   Define partes reutilizáveis, como esquemas de segurança.
-   `securitySchemes`: Esquemas de segurança disponíveis para a API.
-   No exemplo, o `bearerAuth` configura o uso do Bearer Token com JWT.
    -   `type`: O tipo de segurança usado, que neste caso é `http`.
    -   `scheme`: Especifica que o método é baseado em bearer.
    -   `bearerFormat`: Informa o formato do token (JWT), tornando explícito que é um JSON Web Token.

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   Manter o `swagger.json` à mão tende a desatualizar. Hoje é comum **gerar** a especificação a partir do código ou dos schemas (ex.: `zod-to-openapi`) e usar OpenAPI 3.1.

**Para o SAP CAP**

-   No CAP a especificação sai do próprio modelo: `cds compile srv --to openapi`. Para servir uma UI Swagger em desenvolvimento existe o plugin `cds-swagger-ui-express`.

</details>

### Configurando o Swagger na aplicação

No arquivo `src/app.js`, importe e configure o middleware `swagger-ui-express`:

```javascript
// src/app.js

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Outras importações e configurações

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota para acessar a documentação
console.log('Acesse a documentação em: http://localhost:3001/api-docs');
```

## Documentando Endpoints

Você pode adicionar os endpoints da API ao arquivo `swagger.json`. Por exemplo, para documentar o endpoint de listagem de receitas:

### /login

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Cookmaster API",
    "description": "Documentação da API Cookmaster para gerenciamento de receitas, categorias e usuários.",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://localhost:3001",
      "description": "Servidor Local"
    }
  ],
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "paths": {
    "/login": {
      "post": {
        "tags": ["Login"],
        "summary": "Login de usuário",
        "description": "Autentica um usuário e retorna um token JWT.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": { "type": "string", "example": "alice@example.com" },
                  "password": { "type": "string", "example": "123456Alice" }
                },
                "required": ["email", "password"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Login bem-sucedido",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "token": { "type": "string", "example": "eyJhbGciOiJIUzI1NiIsInR..." }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Campos inválidos",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Invalid fields" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

**O que analisar**:

Cada rota é descrita em detalhes, incluindo seus métodos HTTP, parâmetros, corpos de requisição e respostas.

-   `path`: Define a URL do endpoint (ex.: `/login`, `/recipes`).
-   Deve ser explícito e consistente com os nomes no código da API.
    
-   Métodos HTTP (`get`, `post`, etc.):
    
-   Cada método descreve uma ação específica. No exemplo:
    -   `POST /login`: Autentica o usuário.
-   Use o `tags` para agrupar endpoints em categorias, como `Login`.
    
-   `requestBody`: Define os dados esperados na requisição, incluindo:
    
-   `required`: Determina se o corpo é obrigatório.
-   `content`: Tipo de conteúdo aceito, geralmente `application/json`.
-   `schema`: Estrutura do objeto esperado, com tipos e exemplos para cada campo.
    
-   `responses`: Documenta os possíveis códigos de resposta.
    
-   Cada resposta deve conter:
    -   `description`: Breve explicação do que o código indica.
    -   `content`: Tipo de conteúdo retornado (`application/json`).
    -   `schema`: Estrutura do objeto retornado, com tipos e exemplos para cada campo.

### /recipes

```json
{
  // Outras Configurações

  "path": {
    // Outros endpoints

    "/recipes": {
      "get": {
        "tags": ["Recipes"],
        "summary": "Listar todas as receitas",
        "description": "Retorna uma lista de todas as receitas cadastradas.",
        "responses": {
          "200": {
            "description": "Lista de receitas",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": { "type": "integer", "example": 1 },
                      "title": { "type": "string", "example": "Bolo de Cenoura" },
                      "ingredients": { "type": "string", "example": "cenoura, açúcar, farinha, ovos" },
                      "preparation": { "type": "string", "example": "1. Misture os ingredientes..." },
                      "userId": { "type": "integer", "example": 1 },
                      "createdAt": { "type": "string", "example": "2021-06-01T00:00:00.000Z" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": ["Recipes"],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Criar uma nova receita",
        "description": "Registra uma nova receita no sistema.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "title": { "type": "string", "example": "Bolo de Cenoura" },
                  "ingredients": { "type": "string", "example": "cenoura, açúcar, farinha, ovos" },
                  "preparation": { "type": "string", "example": "1. Misture os ingredientes..." },
                  "userId": { "type": "integer", "example": 1 },
                  "categoryIds": { "type": "array", "items": { "type": "integer", "example": [1, 2] } }
                },
                "required": ["name", "ingredients", "preparation", "userId", "categoryIds"]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Receita criada com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "integer", "example": 1 },
                    "title": { "type": "string", "example": "Bolo de Cenoura" },
                    "ingredients": { "type": "string", "example": "cenoura, açúcar, farinha, ovos" },
                    "preparation": { "type": "string", "example": "1. Misture os ingredientes..." },
                    "userId": { "type": "integer", "example": 1 },
                    "categoryIds": { "type": "array", "items": { "type": "integer" }, "example": [1, 2] }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Usuário não autenticado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": { "type": "string", "example": "Token Not Found!" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

**O que analisar**:

-   `/recipes`: é possível listarmos todos os metódos desse mesmo endpoint.
-   `get`: Método HTTP para listar as receitas.
-   `post`: Método HTTP para criar uma nova receita.
-   `security`: Define que o endpoint requer autenticação. Precisamos enviar o token JWT no cabeçalho da requisição.
-   `responses`: Respostas possíveis.
    -   `201`: Sucesso.
    -   `401`: Erro de autenticação.

<details>
<summary>OBS da IA</summary>

**Atenção**

-   No exemplo de endpoints a chave aparece como `"path"`; na especificação OpenAPI o nome correto é **`"paths"`**, senão o Swagger UI não lista as rotas.

</details>

## Acessando a Documentação

-   Inicie o servidor da Cookmaster API.
-   Acesse a rota `http://localhost:3001/api-docs` no navegador ou no Insomnia. Você verá uma interface interativa exibindo todos os endpoints documentados.
-   Clique nos endpoints para visualizar detalhes ou testar requisições diretamente.

## Melhores Práticas ao Usar o Swagger

1.  **Documente todos os endpoints**: Inclua descrições claras, parâmetros necessários e exemplos de respostas.
2.  **Atualize a documentação regularmente**: A documentação deve refletir a versão atual da API.
3.  **Use exemplos reais**: Forneça exemplos de requisições e respostas para facilitar o entendimento dos integradores.

Assista ao vídeo abaixo para ver uma demonstração prática da utilização do Swagger na Cookmaster API:

> **Relembrando 🧠:** O código apresentado durante toda a seção, pode ser acessado na pasta `08-protegendo-apis-seguranca-em-nodejs/parte-02-seguranca` ou através desse **[link](https://github.com/learnwithtrybe/node-codigos/tree/main/08-protegendo-apis-seguranca-em-nodejs/parte-02-seguranca)**.
