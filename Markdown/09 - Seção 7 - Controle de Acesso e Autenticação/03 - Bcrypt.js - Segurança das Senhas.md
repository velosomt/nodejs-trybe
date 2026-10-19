# 7.3 - Bcrypt.js: Segurança das Senhas

> Seção 7 - Controle de Acesso e Autenticação · Lição 3 de 12

Até o momento, construímos aplicações nas quais não nos preocupávamos em utilizar e nem com a segurança do campo **senha**. No entanto, a partir de agora, utilizaremos esse campo, garantindo que as senhas sejam tratadas com segurança.

Salvar senhas no banco de dados exatamente como chegam ao servidor é um risco significativo. Em caso de invasão ao banco de dados, essas informações podem ser expostas, permitindo acesso indevido a outros serviços ou redes. Para evitar isso, implementaremos criptografia de senhas com o módulo `bcryptjs`.

## Instalando o bcrypt.js

Para começar, instalamos o pacote bcryptjs em nosso projeto:

```bash
npm i -E bcryptjs@2.4.3
```

<details>
<summary>OBS da IA</summary>

**Alternativa mais moderna**

-   O `bcryptjs` já tem versão 3 (ESM e tipos inclusos). Prefira as funções assíncronas `await bcrypt.hash(senha, 10)` e `await bcrypt.compare(...)`: `hashSync`/`compareSync` bloqueiam o event loop.
-   A OWASP recomenda hoje **Argon2id** (pacote `argon2`) como primeira opção; bcrypt continua aceitável. O Node também tem `crypto.scrypt` nativo.

**Para o SAP CAP**

-   Em CAP no SAP BTP a aplicação **não armazena senhas**: a autenticação é delegada ao **SAP Cloud Identity Services (IAS)** ou **XSUAA**. O conceito de hash continua importante, mas você não vai implementá-lo no CAP.

</details>

## Cadastrando Novas Pessoas com Senhas Criptografadas

Com o `bcryptjs`, podemos modificar o processo de cadastro para que as senhas sejam armazenadas de forma segura no banco de dados. Alteraremos a função `createUser` no arquivo `src/service/user.service.js`:

```javascript
// src/service/user.service.js

const bcrypt = require('bcryptjs');
// const userModel = require('../model/user.model');

// Outras Implementações

const createUser = async (user) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(user.password, salt);

  const newUserWithBcrypt = { ...user, password: hashedPassword };
  const newUser = await userModel.create(newUserWithBcrypt);

  return newUser;
};

// Outras Implementações
```

### Explicação do código

1.  `bcrypt.genSaltSync(10)`: O *salt* é um valor aleatório adicionado à senha antes da criptografia. Ele dificulta ataques de força bruta e torna cada senha única, mesmo que duas pessoas utilizem a mesma senha. O parâmetro 10 indica o custo computacional do salt, balanceando segurança e desempenho.
    
2.  `bcrypt.hashSync(user.password, salt)`: Combina a senha fornecida pelo usuário com o salt gerado, criando uma versão criptografada que será salva no banco de dados.
    
3.  `{ ...user, password: hashedPassword }`: Criamos um novo objeto substituindo o campo password pela versão criptografada.
    

Após essa alteração, qualquer senha cadastrada será automaticamente criptografada. Teste a funcionalidade enviando uma requisição POST e verifique a resposta.

## Realizando Login

A autenticação é um dos principais recursos de segurança em uma aplicação. No contexto deste projeto, o login envolve verificar se o email e a senha fornecidos pelo usuário estão corretos.

### Passo 1: Buscar um usuário pelo email

No arquivo `src/model/user.model.js`, criamos a função `findByEmail` para localizar usuários com base no email informado:

```javascript
// src/model/user.model.js

// Outras Implementações

const findByEmail = async (email) => {
  const [result] = await conn.execute('SELECT * FROM users WHERE email = ?;', [email]);
  return camelize(result[0]);
};
```

### Passo 2: Verificar a senha

No arquivo `src/service/user.service.js`, implementamos a função `findUserByEmail` para verificar se a senha informada corresponde à senha criptografada salva no banco:

```javascript
// src/service/user.service.js

// Outras Implementações

const findUserByEmail = async ({ email, password }) => {
  const user = await userModel.findByEmail(email);

  if (!user) return { error: 'Invalid fields' };

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) return { error: 'Invalid fields' };

  return user;
};
```

### Explicação do código

1.  `bcrypt.compareSync(password, user.password)`: Compara a senha fornecida pelo usuário (`password`) com a senha criptografada armazenada no banco de dados (`user.password`). O `bcrypt` cuida de todo o processo de descriptografia e validação internamente.
    
2.  `if (!user) e if (!isPasswordValid)`: Verificamos se o usuário existe e se a senha é válida. Em ambos os casos, retornamos `{ error: 'Invalid fields' }` para evitar o acesso não autorizado.
    

## Criando o Controller de Login

Criaremos e adicionaremos no arquivo `src/controller/auth.controller.js`, a lógica de autenticação:

```javascript
// src/controller/auth.controller.js

const userService = require('../service/user.service');

const login = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await userService.findUserByEmail({ email, password });

  if (findUser.error) {
    return res.status(400).json({ error: findUser.error });
  }

  return res.status(201).json(findUser);
};

module.exports = {
  login,
};
```

<details>
<summary>OBS da IA</summary>

**Atenção**

-   Nesta versão o login devolve o objeto do usuário inteiro, incluindo o hash da senha. Nunca retorne o hash na resposta (a lição 7.5 corrige isso ao devolver um token). Login bem-sucedido costuma responder `200`, não `201`.

</details>

## Criando a Rota de Login

Agora, criaremos uma rota no arquivo `src/routes/auth.route.js` para lidar com a autenticação.

```javascript
// src/routes/auth.route.js

const express = require('express');

const authController = require('../controller/auth.controller');

const router = express.Router();

router.post('/', authController.login);

module.exports = router;
```

Por fim, importaremos a rota no arquivo `src/app.js`.

```javascript
// src/app.js

// Outras Importações

const authRouter = require('./routes/auth.route');

// Outras Implementações

app.use('/login', authRouter);
// app.use((_req, res) => res.status(404).json({ message: 'Route Not Found!' }));
// app.use(errorHandler);

// module.exports = app;
```

## Testando a Funcionalidade

Faça requisições para a rota `/login` com um email e senha válidos.

-   `Credenciais corretas`: A resposta deve incluir as informações do usuário.
-   `Credenciais incorretas`: Deve retornar `{ error: 'Invalid fields' }` com status 400.

Agora, vamos fixar os conceitos aprendidos com o vídeo a seguir:
