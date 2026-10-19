# 7.8 - Introdução ao OAuth 2.0

> Seção 7 - Controle de Acesso e Autenticação · Lição 8 de 12

OAuth 2.0 é um **protocolo de autorização** que permite que aplicativos obtenham acesso limitado a recursos de usuários hospedados em servidores de terceiros. Ele trabalha como um "intermediário confiável" entre o cliente (aplicativo) e o servidor que detém os dados do usuário, garantindo a segurança das informações.

Imagine que você deseja usar sua conta do Google para acessar um aplicativo de terceiros. Com OAuth 2.0, o aplicativo pode solicitar permissões específicas (como visualizar seu nome ou e-mail) sem nunca ter acesso à sua senha.

## Principais Benefícios

1.  **Segurança**: O usuário nunca compartilha sua senha diretamente com aplicativos de terceiros. O acesso é concedido por meio de tokens temporários.
2.  **Praticidade**: Permite que usuários façam login com contas existentes (Google, GitHub, Facebook), evitando criar novas credenciais.
3.  **Flexibilidade**: Suporta diversos tipos de aplicações (web, mobile, IoT).
4.  **Controle do usuário**: Escopos de permissão permitem que o usuário defina exatamente quais dados o aplicativo pode acessar.

## Funcionamento do OAuth 2.0

O OAuth 2.0 utiliza tokens de acesso para gerenciar permissões de forma segura. Seu funcionamento baseia-se em quatro partes:

1.  **Usuário**: Quem concede permissão para o acesso.
2.  **Cliente**: O aplicativo que solicita o acesso aos dados.
3.  **Provedor de autorização**: O serviço que autentica o usuário e emite o token (ex.: Google, Facebook, GitHub).
4.  **Recurso protegido**: Os dados do usuário armazenados no servidor.

### Fluxo Básico

1.  O aplicativo redireciona o usuário ao provedor de autorização para login.
2.  O usuário faz login e aprova (ou não) o acesso solicitado.
3.  O provedor retorna um token de autorização ao aplicativo.
4.  O aplicativo usa esse token para acessar os recursos permitidos.

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   Implementar o fluxo na mão é ótimo para aprender. Em produção use bibliotecas como **openid-client**, **Passport** ou **Auth.js**, e inclua o parâmetro `state` (proteção CSRF) e **PKCE**, hoje recomendado para todos os clientes OAuth 2.0.

**Para o SAP CAP**

-   No BTP quem faz o fluxo OAuth/OIDC é o **approuter** (`@sap/approuter`) junto com IAS/XSUAA; login social ou corporativo é configurado no IAS. O CAP só recebe o JWT já validado.

</details>

## Implementação prática: Login com GitHub

Vamos implementar um fluxo simples de autenticação com o GitHub como provedor OAuth 2.0. Assista ao vídeo abaixo para ver o passo a passo:

## Código utilizado no vídeo

### Service

```javascript
// src/service/login.github.service.js

const axios = require('axios');

const { createToken } = require('../utils/manager.JWT');

// Variáveis de configuração
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

const createRequestBody = (code) => ({
  client_id: process.env.GITHUB_CLIENT_ID,
  client_secret: process.env.GITHUB_CLIENT_SECRET,
  code,
});

const fetchAccessToken = async (body) => {
  const tokenResponse = await axios.post(
    GITHUB_TOKEN_URL,
    body,
    { headers: { Accept: 'application/json' } },
  );
  return tokenResponse.data.access_token;
};

const fetchUserData = async (accessToken) => {
  const userResponse = await axios.get(GITHUB_USER_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const { id, email, name } = userResponse.data;
  return { id, email, name };
};

// Processa o código recebido no redirecionamento do GitHub
const createAccess = async (code) => {
  const body = createRequestBody(code);
  const accessToken = await fetchAccessToken(body);
  const userData = await fetchUserData(accessToken);
  return createToken({ ...userData, role: 'user' });
};

module.exports = {
  createAccess,
};
```

### Controller

```javascript
// src/controller/auth.controller.js

// const userService = require('../service/user.service');
const loginGitHubService = require('../service/login.github.service');

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   const token = await userService.findUserByEmail({ email, password });

//   if (token.error) {
//     return res.status(400).json({ error: token.error });
//   }

//   return res.status(200).json({ token });
// };

const loginWithGitHub = (_req, res) => {
  const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
  const { GITHUB_CLIENT_ID } = process.env;

  const redirectUri = `${GITHUB_AUTH_URL}?client_id=${GITHUB_CLIENT_ID}&scope=read:user`;
  return res.redirect(redirectUri);
};

// função que recebe o código de autorização e troca por um token de acesso
const callback = async (req, res) => {
  const { code } = req.query;

  const token = await loginGitHubService.createAccess(code);

  return res.status(200).json({ token });
};

// module.exports = {
//   login,
  loginWithGitHub,
  callback,
// };
```

### Routes

```javascript
// src/routes/auth.routes.js

// const express = require('express');

// const authController = require('../controller/auth.controller');

// const router = express.Router();

// router.post('/', authController.login);
router.get('/github', authController.loginWithGitHub);
router.get('/github/callback', authController.callback);

// module.exports = router;
```

### .env.example

```javascript
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE_NAME=database
JWT_SECRET=secret
GITHUB_CLIENT_ID=GITHUB_CLIENT_ID
GITHUB_SECRET=GITHUB_SECRET
```

> **Relembrando 🧠:** O código apresentado no conteúdo desta lição, pode ser acessado na pasta `07-autenticacao-e-controle-de-acesso/parte-03-0Auth-2.0` ou através desse **[link](https://github.com/learnwithtrybe/node-codigos/tree/main/07-autenticacao-e-controle-de-acesso/parte-03-0Auth-2.0)**.

<details>
<summary>OBS da IA</summary>

**Atenção**

-   O `.env.example` declara `GITHUB_SECRET`, mas o service lê `process.env.GITHUB_CLIENT_SECRET`. Use o mesmo nome nos dois lugares, senão o segredo chega `undefined`.

</details>
