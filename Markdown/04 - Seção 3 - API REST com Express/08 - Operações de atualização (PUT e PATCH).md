# 3.8 - Operações de atualização (PUT e PATCH)

> Seção 3 - API REST com Express · Lição 8 de 20

Depois de entendermos os métodos GET e POST, vamos aprender sobre os métodos PUT e PATCH, que são utilizados para atualizar recursos no servidor. Embora ambos sirvam para essa finalidade, há diferenças sutis entre eles que abordaremos a seguir.

## Diferença entre PUT e PATCH

-   `PUT`: Utilizamos o método PUT para atualizar um recurso por completo. Isso significa que, ao enviar uma requisição PUT, estamos substituindo o recurso original inteiramente pelos novos dados fornecidos.
    
-   `PATCH`: O método PATCH é utilizado para atualizações parciais. Em vez de substituir o recurso inteiro, o PATCH atualiza apenas os campos que foram modificados, mantendo o restante dos dados inalterados.
    

Vamos agora ver na prática como isso funciona.

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   O CAP aceita PUT e PATCH automaticamente; ambos disparam o evento `UPDATE`. Lógica customizada: `this.before('UPDATE', 'Teams', ...)`.
-   Use o aspect `managed` para preencher `createdAt/createdBy/modifiedAt/modifiedBy` sem código.

</details>

## Criando o endpoint PUT

Vamos começar criando um endpoint que atualiza completamente um time no arquivo `teams.json`. Suponhamos que queremos substituir todas as informações de um time com base em seu ID. O código ficaria assim:

```javascript
// src/app.js

// ...

app.put('/teams/:id', async (req, res) => {
  const { id } = req.params;
  const { name, initials } = req.body;

  const readTeamsFile = await fs.readFile(path.resolve(__dirname, 'data', 'teams.json'), 'utf8');
  const teams = JSON.parse(readTeamsFile);

  // Procura pelo índice do time com base no Id
  const teamIndex = teams.findIndex((team) => team.id === Number(id));

  if (teamIndex === -1) {
    return res.status(404).json({ message: 'Team Not Found!' });
  }

  // Substitui completamente o time
  teams[teamIndex] = { id: Number(id), name, initials };

  await fs.writeFile(path.resolve(__dirname, 'data', 'teams.json'), JSON.stringify(teams, null, 2));

  return res.status(200).json({ message: 'Team updated successfully!' });
});

// module.exports = app;
```

### Entendendo o código

Vamos destrinchar o que está acontecendo neste código:

1.  **Parâmetro na URL (`:id`):** A rota utiliza o `:id` para identificar qual time será atualizado. Esse parâmetro é extraído através de `req.params`.
    
2.  **Body da requisição:** O corpo da requisição (`req.body`) contém os novos valores para name e initials.
    
3.  **Verificação do time:** O código busca o índice do time no array com base no id recebido. Caso o time não seja encontrado, retornamos um status `404` (Not Found).
    
4.  **Substituição completa:** Após localizar o índice do time no array, será substituido completamente o objeto do time pelos novos dados fornecidos.
    
5.  **Resposta HTTP:** Retornamos o status 200 (OK) para indicar que a atualização foi concluída com sucesso.
    

> **Atenção ⚠️:** Neste exemplo, se algum campo não for enviado (por exemplo, `initials`), ele será removido do recurso original, pois estamos substituindo o time inteiro.

## Testando o endpoint PUT

Para testar essa funcionalidade, continue a usar um API Client como Postman, Insomnia ou ThunderClient. Aqui está um exemplo de como enviar uma requisição PUT para modificar um time:

-   `URL`: http://localhost:3001/teams/1
-   `Método`: PUT
-   Body no formato JSON e com os seguintes dados:

```json
{
  "name": "Grêmio",
  "initials": "GRE"
}
```

A resposta que receberemos será algo assim:

```json
{
  "message": "Team updated successfully!"
}
```

Verifique o arquivo `teams.json` para conferir as atualizações.

## Criando o endpoint PATCH

Agora, vamos criar um endpoint que atualiza apenas alguns campos de um time, em vez de substituir todas as suas informações:

```javascript
// src/app.js

// ...

app.patch('/teams/:id', async (req, res) => {
  const { id } = req.params;
  const { name, initials } = req.body;

  const readTeamsFile = await fs.readFile(path.resolve(__dirname, 'data', 'teams.json'), 'utf8');
  const teams = JSON.parse(readTeamsFile);

  const teamIndex = teams.findIndex((team) => team.id === Number(id));

  if (teamIndex === -1) {
    return res.status(404).json({ message: 'Team Not Found!' });
  }

  // Atualiza apenas os campos que foram enviados
  if (name) teams[teamIndex].name = name;
  if (initials) teams[teamIndex].initials = initials;

  await fs.writeFile(path.resolve(__dirname, 'data', 'teams.json'), JSON.stringify(teams, null, 2));

  return res.status(200).json({ message: 'Team partially updated successfully!' });
});

// module.exports = app;
```

### Entendendo o código

1.  **Parâmetro na URL (`:id`):** Assim como no PUT, utilizamos o `:id` para identificar o time.
    
2.  **Body da requisição:** O corpo da requisição contém os campos que queremos atualizar. No entanto, no PATCH, apenas os campos enviados serão atualizados. Se enviarmos apenas o `name`, somente este campo será alterado, enquanto `initials` permanecerá o mesmo.
    
3.  **Atualização parcial:** Utilizamos condicionais (if) para verificar quais campos foram fornecidos no body e atualizá-los individualmente.
    

## Testando o endpoint PATCH

Para testar essa funcionalidade, utilize os seguintes recursos:

-   `URL`: http://localhost:3001/teams/2
-   `Método`: PATCH
-   Body no formato JSON e com os seguintes dados:

```json
{
  "name": "Grêmio"
}
```

A resposta que receberemos será algo assim:

```json
{
  "message": "Team partially updated successfully!"
}
```

Verifique o arquivo `teams.json` para conferir as atualizações.

## Conclusão

-   O **PUT** é ideal quando você deseja substituir completamente um recurso, enquanto o **PATCH** é mais adequado para atualizações parciais.
    
-   Ambos utilizam o `req.body` para enviar os dados de atualização, mas diferem no comportamento quanto à substituição de campos.
    

Com esses métodos, você pode garantir que suas APIs permitam tanto a atualização completa quanto a parcial dos recursos, oferecendo flexibilidade.

Para consolidar o conhecimento, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1022283760)
