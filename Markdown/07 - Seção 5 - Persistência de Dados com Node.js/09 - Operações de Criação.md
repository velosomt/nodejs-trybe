# 5.9 - Operações de Criação

> Seção 5 - Persistência de Dados com Node.js · Lição 9 de 16

Agora que já temos rotas para buscar informações no banco de dados, vamos adicionar uma funcionalidade para criar novos registros. Para isso, vamos implementar uma operação que permite inserir dados de estudantes diretamente no banco.

## Criando a função `insert` para Inserir Novos Registros

Para adicionar estudantes à nossa base de dados, criaremos a função `insert` no arquivo `src/database/studentsDB.js`. Nessa função, precisaremos exercutar a query de inserção:

```sql
INSERT INTO students (name, cpf, birth_date, email, cep, address) VALUES (?, ?, ?, ?, ?, ?)
```

Cada uma dessas `?` serão os valores passados em *placeholders* para manter a segurança e integridade da query SQL.

```javascript
// src/database/studentsDB.js

// Outras implementações

const insert = async (student) => {
  const { name, cpf, birthDate, email, cep, address } = student;
  const [result] = await conn.execute(
    'INSERT INTO students (name, cpf, birth_date, email, cep, address) VALUES (?, ?, ?, ?, ?, ?)',
    [name, cpf, birthDate, email, cep, address], // <- valres que substituirão as `?` respeitando a sequência.
  );

  return result.insertId;
};

// module.exports = {
//   findAll,
//   findById,
  insert,
// };
```

### Entendendo o Código

1.  **Parâmetros do `INSERT INTO`:** A função `insert` recebe o objeto `student`, que contém todos os dados necessários para a criação do novo registro, como `name`, `cpf`, `birth_date`, `email`, `cep` e `address`. Esses valores são então passados no array para substituir os *placeholders* (`?`) na query SQL.
    
2.  **Retorno do `insertId`:** Após a execução do comando, obtemos o `insertId`, que é o ID do novo registro criado. Esse ID será útil para referenciar o novo estudante e é retornado para confirmação da criação do registro.
    

## Criando a rota POST para inserir estudante

Com a função `insert` pronta, vamos agora configurar uma nova rota POST em `studentRoutes.js` para receber os dados enviados na requisição e chamá-la para inserir um novo registro.

```javascript
// src/routes/studentRoutes.js

// Outras implementações

router.post('/', async (req, res) => {
  const { name, cpf, birthDate, email, cep, address } = req.body;
  const student = { name, cpf, birthDate, email, cep, address };

  try {
    const resultId = await studentsDB.insert(student);

    return res.status(201).json({
      message: `Student successfully registered with ID ${resultId}`,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: 'Internal Server Error!' });
  }
});

// module.exports = router;
```

Com essas modificações, nossa aplicação agora permite a criação de novos registros de estudantes na base de dados de forma organizada e segura.

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   Equivalente: `await INSERT.into(Students).entries(dados)`. Para vários registros, passe o array inteiro em uma única chamada (escrita em lote), nunca um INSERT por item em loop.

</details>
