# 3.9 - Operações de Remoção (DELETE)

> Seção 3 - API REST com Express · Lição 9 de 20

Depois de aprender sobre os métodos GET, POST, PUT e PATCH, vamos falar sobre o método `DELETE`, que é utilizado para remover recursos do servidor. A função do DELETE é simples: ele recebe uma solicitação para excluir um recurso específico e o remove permanentemente.

## Criando o endpoint DELETE

Agora, vamos criar um endpoint para deletar um time do arquivo `teams.json` com base no seu `id`. Confira o código abaixo:

```javascript
// src/app.js

// ...

app.delete('/teams/:id', async (req, res) => {
  const { id } = req.params;

  const readTeamsFile = await fs.readFile(path.resolve(__dirname, 'data', 'teams.json'), 'utf8');
  const teams = JSON.parse(readTeamsFile);

  const teamIndex = teams.findIndex((team) => team.id === Number(id));

  if (teamIndex === -1) {
    return res.status(404).json({ message: 'Team Not Found!' });
  }

  // Remove o time do array
  teams.splice(teamIndex, 1);

  await fs.writeFile(path.resolve(__dirname, 'data', 'teams.json'), JSON.stringify(teams, null, 2));

  return res.status(204).end();
});

// module.exports = app;
```

### Entendendo o código

1.  **Parâmetro na URL (`:id`):** Assim como em PUT e PATCH, o DELETE usa o `:id` na URL para identificar o time que será removido.
    
2.  **Verificação do time:** O código busca o índice do time no array com base no id recebido. Caso o time não seja encontrado, retornamos um status `404` (Not Found).
    
3.  **Remoção do time:** Utilizamos o método `splice` para remover o time da lista de `teams` com base no índice encontrado.
    
4.  **Atualização do arquivo JSON:** Após a remoção, escrevemos o array atualizado de volta no arquivo `teams.json` com `fs.writeFile`.
    
5.  **Resposta HTTP:** Retornamos um status `204` (No Content), que indica que a remoção foi realizada com sucesso, mas sem retornar conteúdo no corpo da resposta. Também precisamos adicionar o `.end()` para finalizar a resposta da nossa API.
    

> **Anota aí 🖊:** O status `204` é utilizado quando a operação foi bem-sucedida, mas não há necessidade de enviar nenhuma informação adicional no corpo da resposta.
> 
> **Atenção ⚠️:** O método DELETE deve ser utilizado com cautela, pois, como o nome sugere, ele remove recursos permanentemente. Em alguns casos, é melhor implementar uma "remoção lógica", onde o recurso é marcado como inativo, mas não removido fisicamente do banco de dados ou do arquivo.

## Testando o endpoint DELETE

Para testar essa funcionalidade, utilize os seguintes recursos:

-   `URL`: http://localhost:3001/teams/1
-   `Método`: DELETE

A resposta que você receberá será um retorno vazio, já que o status `204` não retorna conteúdo no corpo da resposta. No entanto, o status da operação será mostrado na interface da ferramenta que você estiver usando.

Após realizar a requisição, verifique o arquivo `teams.json` para garantir que o time foi removido da lista.

Com o método `DELETE`, podemos garantir que nossas APIs permitam a remoção de recursos de forma eficiente e seguindo as boas práticas de status HTTP.

Para consolidar o conhecimento, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1022283790)

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   DELETE também é gerado. Regras como "não excluir se tiver vínculo" vão em `this.before('DELETE', 'Teams', (req) => req.reject(409, '...'))`.

</details>
