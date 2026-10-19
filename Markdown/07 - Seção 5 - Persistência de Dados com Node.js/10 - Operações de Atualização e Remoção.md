# 5.10 - Operações de Atualização e Remoção

> Seção 5 - Persistência de Dados com Node.js · Lição 10 de 16

Agora que implementamos as funcionalidades de criação e busca de registros no banco de dados, vamos adicionar as operações de **atualização** e **remoção**. Essas funcionalidades vão permitir **modificar** ou **excluir** registros de estudantes na base de dados, completando o conjunto básico de operações de um CRUD.

## Criando a função `update` para Atualizar Registros

Para modificar informações dos estudantes, criaremos a função `update` no arquivo `src/database/studentsDB.js`.

```javascript
// src/database/studentsDB.js

// Outras implementações

const update = async (id, updatedData) => {
  const { name, cpf, birthDate, email, cep, address } = updatedData;

  const [result] = await conn.execute(
    `UPDATE students
     SET name = ?, cpf = ?, birth_date = ?, email = ?, cep = ?, address = ?
     WHERE id = ?`,
    [name, cpf, birthDate, email, cep, address, id],
  );

  return result;
};

// module.exports = {
//   findAll,
//   findById,
//   insert,
  update,
// };
```

### Entendendo o Código

1.  **Retorno do Objeto `result`**: O retorno da função é o objeto `result`, que contém a propriedade `affectedRows`, indicando quantas linhas foram afetadas pela operação. Isso nos permite validar se o `id` existe antes de confirmar a atualização.
    
2.  **Validação do Registro**: No próximo passo, vamos utilizar essa validação na rota para garantir que apenas registros existentes sejam atualizados.
    

## Criando a rota PUT para atualização de estudante

Na rota PUT, vamos chamar a função `update` e verificar o resultado para validar a existência do `id`.

```javascript
// src/routes/studentRoutes.js

// Outras implementações

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const result = await studentsDB.update(id, updatedData);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student Not Found!' });
    }

    return res.status(200).json({ message: 'Student Successfully Updated' });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});
```

**Observação**: A validação `if (result.affectedRows === 0)` indica que nenhum estudante com o `id` informado foi encontrado, respondendo com um status 404 e a mensagem `Student Not Found!`.

## Criando a função `remove` para Excluir Registros

Para modificar informações dos estudantes, criaremos a função `remove` no arquivo `src/database/studentsDB.js`.

```javascript
// src/database/studentsDB.js

// Outras implementações

const remove = async (id) => {
  const [result] = await conn.execute('DELETE FROM students WHERE id = ?', [id]);
  return result;
};

// module.exports = {
//   findAll,
//   findById,
//   insert,
//   update,
  remove,
// };
```

### Entendendo o Código

1.  **Retorno do Objeto `result`**: Assim como na função `update`, `remove` retorna o objeto `result`, que indica se algum registro foi excluído por meio de `affectedRows`.

## Criando a rota DELETE para remoção de estudante

Na rota DELETE, chamamos a função `remove` que retorna um objeto, e nele contem a propriedade `affectedRows`, que indica quantas linhas foram afetadas ao rodar a query do DELETE. Isto é, se retornar 0 nesse valor, sinal que nenhuma linha foi removida.

```javascript
// src/routes/studentRoutes.js

// Outras implementações

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await studentsDB.remove(id);

    if (result.affectedRows === 0) { // Como é igual a zero, sinal que nenhuma linha foi removida.
      return res.status(404).json({ message: 'Student Not Found!' });
    }

    return res.status(204).end();
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});
```

Com essas implementações, nossa API agora possui um CRUD completo para manipulação dos dados referente a estudantes.

> **Relembrando 🧠:** O código apresentado no conteúdo até este momento, pode ser acessado na pasta `05-persistencia-de-dados/parte-02-conexao-mysql` ou através desse **[link](https://github.com/learnwithtrybe/node-codigos/tree/main/05-persistencia-de-dados/parte-02-conexao-mysql)**.

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   Equivalentes: `await UPDATE(Students, id).with(dados)` e `await DELETE.from(Students).where({ ID: id })`. Também existe `UPSERT.into(...)`. Em handlers CAP tudo roda na transação da requisição (commit/rollback automático).

</details>
