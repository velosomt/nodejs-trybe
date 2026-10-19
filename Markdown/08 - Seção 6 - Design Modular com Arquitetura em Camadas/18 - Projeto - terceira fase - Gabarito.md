# 6.18 - Projeto - terceira fase | Gabarito

> Seção 6 - Design Modular com Arquitetura em Camadas · Lição 18 de 19

**Exercício 1**

Considere as seguintes afirmativas sobre os testes automatizados da API:  
  
I. Um teste de integração deve fazer uma requisição à API e verificar se a resposta contém os dados esperados.  
II. Nos testes unitários da Model, é necessário se conectar a um banco de dados real.  
III. Um teste unitário da Service pode simular a Model para evitar dependências diretas do banco de dados.  
IV. Um teste deve garantir que a API retorna um status 201 ao criar um novo recurso, como um produto ou pedido.  
V. Se um teste de integração falhar, é sempre um problema no banco de dados.

A) Apenas I, IV e V são verdadeiras. ✅  
B) Apenas II, III e IV são verdadeiras.  
C) Apenas I, II e V são verdadeiras.  
D) Apenas III e IV são verdadeiras.  
E) Todas as afirmações são verdadeiras.  

**Justificativa:**

**I. Verdadeiro** → Um teste de integração verifica a resposta da API.  
**III. Verdadeiro** → Testes unitários da Service podem simular a Model.  
**IV. Verdadeiro** → A API deve retornar 201 ao criar um novo recurso.

Por que as outras estão erradas?

**II. Falso** → Testes da Model **podem usar um banco simulado**, sem necessidade de um banco real.  
**V. Falso** → Falha no teste **não significa necessariamente** um erro no banco, pode ser um erro na lógica da aplicação.

**Exercício 2**

Considere as seguintes afirmações sobre a camada Service e suas regras de negócio:  
  
I. A camada Service é responsável por validar o estoque antes de criar um pedido.  
II. A camada Controller deve aplicar a lógica de negócio antes de chamar a camada Service.  
III. A camada Service deve chamar diretamente o banco de dados, sem passar pela Model.  
IV. A camada Service pode lançar erros e a Controller deve capturá-los para retornar respostas adequadas.  
V. Se um pedido for criado com sucesso, a Service deve retornar um objeto contendo as informações do pedido.

A) Apenas I, II e V são verdadeiras.  
B) Apenas II, III e IV são verdadeiras.  
C) Apenas I, IV e V são verdadeiras. ✅  
D) Apenas III e IV são verdadeiras.  
E) Todas as afirmações são verdadeiras.

**Justificativa:**

**I. Verdadeiro** → A Service valida o estoque antes de criar o pedido.  
**IV. Verdadeiro** → A Service pode lançar erros, e a Controller deve tratá-los.  
**V. Verdadeiro** → A Service retorna um objeto com as informações do pedido criado.

Por que as outras estão erradas?  
**II. Falso** → A Controller não deve aplicar regras de negócio, isso é responsabilidade da Service.  
**III. Falso** → A Service deve chamar a Model, não o banco de dados diretamente.

**Exercício 3**

Na API, a criação de um produto (POST /products) deve validar os dados antes de inseri-los no banco. Qual das seguintes regras foi exigida no projeto?

A) O campo price pode ser qualquer número, inclusive negativo.  
B) O name pode ser nulo, pois o banco gerará um nome padrão.  
C) O quantity deve ser um número inteiro positivo. ✅  
D) Nenhuma validação foi exigida para os produtos.  
E) O name pode ter qualquer tamanho, incluindo uma string vazia.

**Justificativa:**

A validação correta exige que quantity seja um número inteiro positivo, pois um produto não pode ter quantidade negativa ou fracionada no estoque.

Por que as outras estão erradas?

A) O campo price pode ser qualquer número, inclusive negativo. ❌  
🚫 Errado! O preço não pode ser negativo, pois um produto não pode custar menos que zero.  
B) O name pode ser nulo, pois o banco gerará um nome padrão. ❌  
🚫 Errado! O nome do produto é obrigatório, e não há nenhum mecanismo no projeto que gere um nome padrão automaticamente.  
D) Nenhuma validação foi exigida para os produtos. ❌  
🚫 Errado! O projeto exige validações com Joi na camada Controller.  
E) O name pode ter qualquer tamanho, incluindo uma string vazia. ❌  
🚫 Errado! O nome do produto deve ter um tamanho mínimo para evitar registros inválidos.

**Exercício 4**

A camada Service de pedidos (orders) possui uma regra de negócio que impede a criação de um pedido em determinada situação. Qual é essa situação?

A) Quando o usuário já tem um pedido pendente.  
B) Quando um pedido contém produtos de categorias diferentes.  
C) Quando não há estoque suficiente para todos os produtos do pedido. ✅  
D) Quando o total do pedido é valor negativo.  
E) Quando o usuário não tem pelo menos três produtos no pedido.

**Justificativa:**

A camada Service deve garantir que haja estoque suficiente antes de criar um pedido. Se um produto estiver esgotado, o pedido não pode ser finalizado.

Por que as outras estão erradas?

A) Quando o usuário já tem um pedido pendente. ❌  
🚫 Errado! O sistema não impede que um usuário faça mais de um pedido ao mesmo tempo.  
B) Quando um pedido contém produtos de categorias diferentes. ❌  
🚫 Errado! O projeto não possui restrição de categorias no pedido.  
D) Quando o total do pedido ultrapassa R$ 500,00. ❌  
🚫 Errado! Não há limite de valor para um pedido.  
E) Quando o usuário não tem pelo menos três produtos no pedido. ❌  
🚫 Errado! O pedido pode ter qualquer quantidade de produtos, desde que tenha estoque disponível.

**Exercício 4**

Após cadastrar um novo produto (POST /products), qual é o formato mais adequado da resposta esperada da API  

A) { "message": "Produto cadastrado com sucesso!" }  
B) { "id": 1, "name": "Notebook", "price": 2500.00, "quantity": 10 } ✅  
C) { "success": true, "product": { "id": 1, "name": "Notebook" } }  
D) { "productId": 1, "status": "created" }  
E) { "error": "Produto criado com erro!" }

**Justificativa:**

A API deve retornar os dados completos do produto cadastrado, incluindo **id, nome, preço e quantidade**.

Por que as outras estão erradas?

A) { "message": "Produto cadastrado com sucesso!" } ❌  
🚫 Errado! A resposta deve conter os dados do produto, não apenas uma mensagem.  
C) { "success": true, "product": { "id": 1, "name": "Notebook" } } ❌  
🚫 Errado! A resposta deve incluir **todos os detalhes do produto**, incluindo preço e quantidade.  
D) { "productId": 1, "status": "created" } ❌  
🚫 Errado! A chave correta do ID do produto na resposta não deveria ser productId, mas sim id.  
E) { "error": "Produto criado com erro!" } ❌  
🚫 Errado! Se a criação foi bem-sucedida, não deve haver uma mensagem de erro.
