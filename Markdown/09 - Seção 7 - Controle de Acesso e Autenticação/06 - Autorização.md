# 7.6 - Autorização

> Seção 7 - Controle de Acesso e Autenticação · Lição 6 de 12

Após compreender e implementar o processo de autenticação, que garante a identificação de quem está acessando a aplicação, é hora de avançarmos para o próximo passo: a autorização.

## O que é autorização?

A autorização, diferentemente da autenticação, está relacionada a **permissões de acesso**. Enquanto a autenticação confirma quem você é, a autorização responde à pergunta: **o que você pode fazer**?

Esse processo é essencial em sistemas que possuem diferentes níveis de acesso. Por exemplo, em uma API como a Cookmaster, algumas ações, como excluir receitas, podem ser restritas a usuários administradores, enquanto outras, como criar receitas, podem estar disponíveis para todos os usuários autenticados.

A autorização é geralmente baseada em roles (funções) ou **perfis de usuário** que vêm anexados ao token JWT, gerado durante o processo de autenticação.

## Diferença entre autenticação e autorização

A tabela a seguir resume as principais diferenças entre autenticação e autorização:

<table><tbody><tr><td>Autenticação</td><td>Autorização</td></tr><tr><td>Verifica quem o usuário é.</td><td>Define o que o usuário pode fazer.</td></tr><tr><td>Ocorre primeiro.</td><td>Acontece após a autenticação.</td></tr><tr><td>Utiliza credenciais (e-mail, senha).</td><td>Utiliza roles, permissões ou regras.</td></tr></tbody></table>

## Contexto na API Cookmaster

Na API Cookmaster, já implementamos:

-   **Autenticação**: garantindo que apenas usuários com um token válido possam acessar rotas protegidas.
-   **Verificação de token JWT**: adicionando as informações do usuário autenticado (`req.user`) para uso nas próximas etapas.

Agora, aprimoraremos a autorização, utilizando as roles (`user`, `admin`, `manager`) para aplicar permissões específicas nas ações.

## Implementando a autorização

### 1\. Regras de negócio

Na API Cookmaster, as permissões serão organizadas da seguinte forma:

-   **user**: Pode criar receitas e gerenciar apenas suas próprias receitas.
-   **admin e manager**: Podem gerenciar qualquer receita, independentemente de quem a criou.

### 2\. Validação na camada Service

```javascript
// src/service/recipe.service.js
// Outras Implementações
// Função que valida permissões de um usuário
const checkUserPermission = async (id, user) => {
  // Admins e managers têm permissão total
  if (['admin', 'manager'].includes(user.role)) return true;
  // Busca a receita para verificar se o usuário é o proprietário
  const findRecipe = await recipeModel.findById(id);
  if (!findRecipe) return { error: `Recipe with id ${id} not found` };
  if (findRecipe.userId !== user.id) return { error: 'Access Denied' };
  return true;
};
// Função que valida permissões e atualiza a receita
const validateAndUpdateRecipe = async (id, recipe, user) => {
  const validUser = await checkUserPermission(id, user); // Valida permissão do usuário
  if (validUser.error) return validUser;
  return updateRecipe(id, recipe); // Atualiza a receita
};
// Função que valida permissões e deleta a receita
const validateAndDeleteRecipe = async (id, user) => {
  const validUser = await checkUserPermission(id, user);
  if (validUser.error) return validUser;
  return deleteRecipe(id);
};
module.exports = {
  findAllRecipes,
  findRecipeById,
  createRecipe,
  validateAndUpdateRecipe,
  validateAndDeleteRecipe,
};
```

#### Explicação das Alterações:

1.  `checkUserPermission`:
2.  Centraliza a validação de permissões.
3.  Retorna mensagens de erro padronizadas em caso de acesso negado ou receita inexistente.
4.  Facilita a reutilização em diferentes ações.
5.  `validateAndUpdateRecipe` e `validateAndDeleteRecipe`:
6.  Integram a validação de permissões com as ações de atualização e exclusão.

### 3\. Código na camada Controller

```javascript
// src/controller/recipe.controller.js
// Outras Implementações
// const updateRecipe = async (req, res) => {
//   const { id } = req.params;
//   const { user } = req;
//   const recipe = req.body;
//   const updatedRecipe = await recipeService.validateAndUpdateRecipe(id, recipe, user);
  if (updatedRecipe.error === 'Access Denied') {
    return res.status(403).json({ error: updatedRecipe.error });
  }
//   if (updatedRecipe.error) {
//     return res.status(404).json({ error: updatedRecipe.error });
//   }
//   return res.status(200).json({ message: updatedRecipe.message });
// };
// const deleteRecipe = async (req, res) => {
//   const { id } = req.params;
//   const { user } = req;
//   const removeRecipe = await recipeService.validateAndDeleteRecipe(id, user);
  if (removeRecipe.error === 'Access Denied') {
    return res.status(403).json({ error: removeRecipe.error });
  }
//   if (removeRecipe.error) {
//     return res.status(404).json({ error: removeRecipe.error });
//   }
//   return res.status(204).end();
// };
```

#### Explicação das Alterações:

`updateRecipe` e `deleteRecipe`: - Tratam os erros retornados do service com códigos HTTP apropriados: - **403**: Quando o usuário não tem permissão. - **404**: Quando a receita não existe.

Com essas alterações, a API Cookmaster agora possui um controle de acesso mais robusto, garantindo que apenas usuários autorizados possam realizar ações específicas.

> **Relembrando 🧠:** O código apresentado no conteúdo até este momento, pode ser acessado na pasta `07-autenticacao-e-controle-de-acesso/parte-02-jwt` ou através desse **[link](https://github.com/learnwithtrybe/node-codigos/tree/main/07-autenticacao-e-controle-de-acesso/parte-02-jwt)**.

Agora, vamos consolidar os conceitos aprendidos com o vídeo a seguir:

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   A regra desta lição (dono da receita ou admin/manager) é **declarativa** no CAP, sem `if` no service. Os papéis vêm do `xs-security.json` / IAS, e `createdBy` é preenchido pelo aspect `managed`.

```cds
annotate CookService.Recipes with @(restrict: [
  { grant: 'READ', to: 'authenticated-user' },
  { grant: ['CREATE'], to: 'authenticated-user' },
  { grant: ['UPDATE', 'DELETE'], to: 'authenticated-user', where: 'createdBy = $user' },
  { grant: '*', to: ['admin', 'manager'] }
]);
```

</details>
