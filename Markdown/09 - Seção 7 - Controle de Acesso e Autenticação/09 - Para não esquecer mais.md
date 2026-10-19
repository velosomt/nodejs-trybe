# 7.9 - Para não esquecer mais

> Seção 7 - Controle de Acesso e Autenticação · Lição 9 de 12

Vamos revisar os principais conceitos abordados até aqui, para fixar o aprendizado e manter esses temas sempre em mente:

## Bcrypt.js

O **bcrypt.js** é uma biblioteca usada para criptografar senhas de forma segura. Ele aplica técnicas como salting e múltiplos rounds de hashing, dificultando ataques de força bruta.

-   **Responsabilidade**: Garantir que senhas armazenadas no banco não estejam em texto plano.
-   **Exemplo**: Ao criar um novo usuário, usamos `bcrypt.hash(password, saltRounds)` para criptografar a senha antes de salvá-la no banco.

## JWT (JSON Web Token)

O JWT é um padrão para transmitir informações seguras entre partes de um sistema, usado amplamente para autenticação e autorização.

### Estrutura de um Token

-   **Header**: Contém o tipo de token (JWT) e o algoritmo de assinatura.
-   **Payload**: Armazena as informações do usuário, como ID e permissões (claims).
-   **Signature**: Garante a integridade do token, confirmando que ele não foi alterado.

### Aplicações

-   **Autenticação**: Após login, o servidor gera um JWT que é enviado ao cliente. Nas requisições seguintes, o cliente inclui o token para acessar recursos protegidos.
    
-   **Autorização**: O token pode conter permissões ou papéis (roles) do usuário.
    
-   **Exemplo**: No login, usamos `jsonwebtoken.sign(payload, secret, options)` para criar um token, que é validado em middleware com `jsonwebtoken.verify(token, secret)`.
    

## Middleware de Proteção

Os **middlewares** são utilizados para proteger rotas, verificando se um token válido foi enviado na requisição.

-   **Exemplo**: Implementamos `authenticateToken`, que valida tokens JWT antes de permitir o acesso a endpoints protegidos.

## OAuth 2.0

O OAuth 2.0 é um protocolo que permite que aplicativos de terceiros acessem recursos protegidos com a autorização do usuário, sem a necessidade de compartilhar senhas.

### Benefícios

-   **Segurança**: O usuário autoriza o acesso sem expor suas credenciais.
-   **Praticidade**: Permite login com contas existentes (ex.: Google, GitHub).
-   **Flexibilidade**: Funciona em diversos tipos de aplicação (web, mobile, IoT).
-   **Controle**: O usuário decide quais dados podem ser acessados.
    
-   **Exemplo**: Implementamos um fluxo com GitHub, onde o usuário autoriza o acesso, o sistema troca um código de autorização por um token de acesso, e o aplicativo usa este token para acessar dados do usuário.
