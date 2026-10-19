# 6.17 - Projeto - terceira fase | Quiz

> Seção 6 - Design Modular com Arquitetura em Camadas · Lição 17 de 19

Nesse exercício vamos criar uma **API REST**  que será um Sistema de Gestão de Pedidos para um E-commerce utilizando o **Express** e o **MySQL** como banco de dados. Nessa **API** você vai armazenar e recuperar dados de pessoas usuárias, produtos e pedidos por meio de **endpoints** que realizam o CRUD dos dados.

**Ao final da **desta fase** do projeto, você irá responder um quiz sobre tudo o que você implementou nessa fase.**

## Combinados

Para fazer o exercício, acesse esse repositório ➡️ [Projeto - Sistema de Gestão de Pedidos para um E-commerce](https://github.com/learnwithtrybe/flex-node-order-system-api).

Nesse repositório a estrutura do código já está disponível, bem como o banco de dados criado e carregado via Docker. Basta você fazer a implementação criando novos arquivos e atualizando o arquivo de rotas.

Leia o arquivo `README.md` do repositório com ⚠️ atenção ⚠️ para saber como desenvolver e entregar seu exercício.

**Nessa fase dos estudos, você irá concluir o projeto fazendo o **requisito 3**.**

## Quiz

### Questão 1

Considere as seguintes afirmativas sobre os testes automatizados da API:

I. Um teste de integração deve fazer uma requisição à API e verificar se a resposta contém os dados esperados.  
II. Nos testes unitários da Model, é necessário se conectar a um banco de dados real.  
III. Um teste unitário da Service pode simular a Model para evitar dependências diretas do banco de dados.  
IV. Um teste deve garantir que a API retorna um status 201 ao criar um novo recurso, como um produto ou pedido.  
V. Se um teste de integração falhar, é sempre um problema no banco de dados.

- **A)** Apenas I, III e IV são verdadeiras
- **B)** Apenas II e V são verdadeiras.
- **C)** Apenas I, II e V são verdadeiras.
- **D)** Apenas III, IV e V são verdadeiras.
- **E)** Todas as afirmativas são verdadeiras.

### Questão 2

Na API, a criação de um produto (POST /products) deve validar os dados antes de inseri-los no banco. Qual das seguintes regras foi exigida no projeto?

- **A)** O campo price pode ser qualquer número, inclusive negativo.
- **B)** O name pode ser nulo, pois o banco gerará um nome padrão.
- **C)** Nenhuma validação foi exigida para os produtos.
- **D)** O quantity deve ser um número inteiro positivo.
- **E)** O name pode ter qualquer tamanho, incluindo uma string vazia.

### Questão 3

A camada Service de pedidos (orders) possui uma regra de negócio que impede a criação de um pedido em determinada situação. Qual é essa situação?

- **A)** Quando o usuário já tem um pedido pendente.
- **B)** Quando um pedido contém produtos de categorias diferentes.
- **C)** Quando não há estoque suficiente para todos os produtos do pedido.
- **D)** Quando o total do pedido é valor negativo.
- **E)** Quando o usuário não tem pelo menos três produtos no pedido.

### Questão 4

Considere as seguintes afirmações sobre a camada Service e suas regras de negócio:

I. A camada Service é responsável por validar o estoque antes de criar um pedido.  
II. A camada Controller deve aplicar a lógica de negócio antes de chamar a camada Service.  
III. A camada Service deve chamar diretamente o banco de dados, sem passar pela Model.  
IV. A camada Service pode lançar erros e a Controller deve capturá-los para retornar respostas adequadas.  
V. Se um pedido for criado com sucesso, a Service deve retornar um objeto contendo as informações do pedido.

- **A)** Apenas II, III e IV são verdadeiras.
- **B)** Apenas I, II e V são verdadeiras.
- **C)** Apenas I, IV e V são verdadeiras.
- **D)** Apenas III e IV são verdadeiras.
- **E)** Todas as afirmações são verdadeiras.

### Questão 5

Após cadastrar um novo produto (POST /products), qual é o formato mais adequado da resposta esperada da API?

- **A)** { "message": "Produto cadastrado com sucesso!" }
- **B)** { "id": 1, "name": "Notebook", "price": 2500.00, "quantity": 10 }
- **C)** { "success": true, "product": { "id": 1, "name": "Notebook" } }
- **D)** { "productId": 1, "status": "created" }
- **E)** { "error": "Produto criado com erro!" }

<details><summary>Gabarito</summary>

**1.** A

**2.** D

**3.** C

**4.** C

**5.** B

</details>
