# 7.10 - Projeto - quinta e última fase

> Seção 7 - Controle de Acesso e Autenticação · Lição 10 de 12

Nesse exercício vamos criar uma **API REST**  que será um Sistema de Gestão de Pedidos para um E-commerce utilizando o **Express** e o **MySQL** como banco de dados. Nessa **API** você vai armazenar e recuperar dados de pessoas usuárias, produtos e pedidos por meio de **endpoints** que realizam o CRUD dos dados.

**Ao final da **desta fase** do projeto, você irá responder um quiz sobre tudo o que você implementou nessa fase.**

## Combinados

Para fazer o exercício, acesse esse repositório ➡️ [Projeto - Sistema de Gestão de Pedidos para um E-commerce](https://github.com/learnwithtrybe/flex-node-order-system-api).

Nesse repositório a estrutura do código já está disponível, bem como o banco de dados criado e carregado via Docker. Basta você fazer a implementação criando novos arquivos e atualizando o arquivo de rotas.

Leia o arquivo `README.md` do repositório com ⚠️ atenção ⚠️ para saber como desenvolver e entregar seu exercício.

**Nessa fase dos estudos, você irá concluir o projeto fazendo o **requisito 5**.**

## Quiz

### Questão 1

O que acontece ao chamar POST /register com um e-mail já cadastrado?

- **A)** Um novo usuário é criado com um ID diferente, mesmo com o mesmo e-mail.
- **B)** A API retorna 500 Internal Server Error.
- **C)** A API retorna 400 Bad Request com uma mensagem de erro.
- **D)** A senha do usuário antigo é redefinida automaticamente.
- **E)** O banco de dados remove o usuário existente e cria um novo.

### Questão 2

O que o middleware de autenticação JWT (validateToken.js) deve fazer ao receber uma requisição com um token inválido?

- **A)** Continuar o processamento da requisição normalmente.
- **B)** Lançar um erro 403 Forbidden e impedir o acesso.
- **C)** Criar um novo token automaticamente para o usuário.
- **D)** Retornar 401 Unauthorized e interromper a requisição.
- **E)** Substituir o token inválido por um token fixo temporário.

### Questão 3

Considere as seguintes afirmações sobre a autenticação JWT:

I. O middleware de autenticação deve verificar se o token JWT é válido antes de permitir o acesso a rotas protegidas.  
II. O token JWT deve ser enviado no header Authorization da requisição.  
III. O backend deve armazenar os tokens JWT no banco de dados para garantir segurança.  
IV. Se um token estiver ausente, a API deve retornar 403 Forbidden.  
V. Um usuário autenticado pode acessar todas as rotas protegidas, independentemente do seu papel (role).

- **A)** Apenas I e II são verdadeiras.
- **B)** Apenas III e IV são verdadeiras.
- **C)** Apenas I, II e IV são verdadeiras.
- **D)** Apenas II, III e V são verdadeiras.
- **E)** Todas as afirmações são verdadeiras.

### Questão 4

Considere as seguintes afirmações sobre a autenticação via GitHub OAuth:

I. O usuário deve ser redirecionado para a página do GitHub para se autenticar.  
II. O GitHub retorna diretamente os dados do usuário, sem necessidade de um token de acesso.  
III. Após a autenticação, o backend deve criar um usuário no banco, caso ele ainda não exista.  
IV. O token JWT gerado pelo backend após o login via GitHub pode ser usado para acessar rotas protegidas.  
V. O GitHub armazena todas as senhas dos usuários autenticados no banco da aplicação.

- **A)** Apenas I, II e IV são verdadeiras.
- **B)** Apenas II e V são verdadeiras.
- **C)** Apenas III, IV e V são verdadeiras.
- **D)** Apenas I, III e IV são verdadeiras.
- **E)** Todas as afirmações são verdadeiras.

### Questão 5

Se um usuário tentar acessar uma rota protegida com um token JWT expirado, o que deve acontecer?

- **A)** O token deve ser renovado automaticamente.
- **B)** A API deve retornar 401 Unauthorized.
- **C)** O usuário ainda pode acessar a rota, pois a API apenas emite um aviso.
- **D)** O servidor deve desconectar automaticamente todos os dispositivos do usuário.
- **E)** O token pode ser usado indefinidamente até o usuário fazer logout.

<details><summary>Gabarito</summary>

**1.** C

**2.** D

**3.** A

**4.** D

**5.** B

</details>
