# 7.11 - Projeto - quinta e última fase | Gabarito

> Seção 7 - Controle de Acesso e Autenticação · Lição 11 de 12

**Exercício 1**

O que acontece ao chamar **POST /register** com um e-mail já cadastrado?

A) Um novo usuário é criado com um ID diferente, mesmo com o mesmo e-mail.  
B) A API retorna **500 Internal Server Error**.  
C) A API retorna **400 Bad Request** com a mensagem **"Email já cadastrado"**. ✅  
D) A senha do usuário antigo é redefinida automaticamente.  
E) O banco de dados remove o usuário existente e cria um novo.

**Justificativa:**

O sistema não permite e-mails duplicados. A API deve verificar se o e-mail já existe e, caso positivo, retornar um erro **400 Bad Request**.

Por que as outras estão erradas?

A) ❌ **Errado!** O sistema não deve permitir dois usuários com o mesmo e-mail.  
B) ❌ **Errado!** O erro correto para esse caso é **400 Bad Request**, não um erro de servidor **500**.  
D) ❌ **Errado!** O sistema não deve redefinir senhas automaticamente, isso seria uma falha de segurança.  
E) ❌ **Errado!** O banco não deve excluir um usuário existente para criar outro com o mesmo e-mail.

**Exercício 2**

O que o middleware de autenticação JWT (**validateToken.js**) deve fazer ao receber uma requisição com um token inválido?

A) Continuar o processamento da requisição normalmente.  
B) Lançar um erro **403 Forbidden** e impedir o acesso.  
C) Retornar **401 Unauthorized** e interromper a requisição. ✅  
D) Criar um novo token automaticamente para o usuário.  
E) Substituir o token inválido por um token fixo temporário.

**Justificativa:**

Um token inválido significa que o usuário não pode ser autenticado. O status correto a ser retornado é **401 Unauthorized**.

Por que as outras estão erradas?

A) ❌ **Errado!** Um token inválido não pode ser aceito.  
B) ❌ **Errado!** **403 Forbidden** indica falta de permissão, mas um token inválido não significa necessariamente que o usuário não tem acesso.  
D) ❌ **Errado!** Gerar um novo token automaticamente pode comprometer a segurança do sistema.  
E) ❌ **Errado!** Um token inválido não pode ser substituído por um fixo, pois comprometeria a segurança da autenticação.

**Exercício 3**

Se um usuário tentar acessar uma rota protegida com um token JWT expirado, o que deve acontecer?

A) O token deve ser renovado automaticamente.  
B) A API deve retornar **401 Unauthorized**. ✅  
C) O usuário ainda pode acessar a rota, pois a API apenas emite um aviso.  
D) O servidor deve desconectar automaticamente todos os dispositivos do usuário.  
E) O token pode ser usado indefinidamente até o usuário fazer logout.

**Justificativa:**

Um token JWT tem um **tempo de expiração**. Se estiver expirado, o usuário deve receber um erro **401 Unauthorized**.

Por que as outras estão erradas?

A) ❌ **Errado!** A API não deve renovar tokens automaticamente por questões de segurança.  
C) ❌ **Errado!** Um token expirado não pode ser usado, independentemente de avisos.  
D) ❌ **Errado!** O servidor não desconecta dispositivos automaticamente quando um token expira.  
E) ❌ **Errado!** O token JWT não pode ser usado indefinidamente, pois ele expira conforme a configuração.

**Exercício 4**

Considere as seguintes afirmações sobre a autenticação JWT:  
  
I. O middleware de autenticação deve verificar se o token JWT é válido antes de permitir o acesso a rotas protegidas.  
II. O token JWT deve ser enviado no header **Authorization** da requisição.  
III. O backend deve armazenar os tokens JWT no banco de dados para garantir segurança.  
IV. Se um token estiver ausente, a API deve retornar **403 Forbidden**.  
V. Um usuário autenticado pode acessar todas as rotas protegidas, independentemente do seu papel (**role**).

A) Apenas I e II são verdadeiras. ✅  
B) Apenas III e IV são verdadeiras.  
C) Apenas I, II e IV são verdadeiras.  
D) Apenas II, III e V são verdadeiras.  
E) Todas as afirmações são verdadeiras.

**Justificativa:**

**I. Verdadeiro** → O middleware de autenticação deve verificar se o token JWT é válido antes de permitir acesso a rotas protegidas.  
**II. Verdadeiro** → O token JWT deve ser enviado no header **Authorization** da requisição.

Por que as outras estão erradas?

**III. Falso** → O JWT **não deve ser armazenado no banco**, pois ele é autossuficiente e já contém todas as informações do usuário.  
**IV. Falso** → Se um token estiver ausente, a API deve retornar **401 Unauthorized**, não **403 Forbidden**. O código 403 é usado quando o usuário não tem permissão para acessar o recurso.  
**V. Falso** → Algumas rotas protegidas exigem um papel específico, como **admin**, então o backend deve verificar a role do usuário.

**Exercício 5**

Considere as seguintes afirmações sobre a autenticação via GitHub OAuth:  
  
I. O usuário deve ser redirecionado para a página do GitHub para se autenticar.  
II. O GitHub retorna diretamente os dados do usuário, sem necessidade de um token de acesso.  
III. Após a autenticação, o backend deve criar um usuário no banco, caso ele ainda não exista.  
IV. O token JWT gerado pelo backend após o login via GitHub pode ser usado para acessar rotas protegidas.  
V. O GitHub armazena todas as senhas dos usuários autenticados no banco da aplicação.

A) Apenas I, III e IV são verdadeiras. ✅  
B) Apenas II e V são verdadeiras.  
C) Apenas I, II e IV são verdadeiras.  
D) Apenas III, IV e V são verdadeiras.  
E) Todas as afirmações são verdadeiras.

**Justificativa:**

**I. Verdadeiro** → O usuário precisa ser redirecionado para o GitHub para se autenticar.  
**III. Verdadeiro** → Após autenticação, o backend deve criar um usuário no banco de dados caso ele ainda não exista.  
**IV. Verdadeiro** → O backend gera um token JWT após o login via GitHub para permitir que o usuário acesse rotas protegidas.

Por que as outras estão erradas?

**II. Falso** → O GitHub **não retorna os dados do usuário diretamente**. Primeiro, o backend recebe um código de autorização e precisa trocá-lo por um token de acesso para obter os dados.  
**V. Falso** → O GitHub **não armazena senhas** dos usuários autenticados dentro do banco da aplicação. A autenticação é feita por meio de tokens OAuth.
