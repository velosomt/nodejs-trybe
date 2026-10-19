# 6.16 - Para não esquecer mais

> Seção 6 - Design Modular com Arquitetura em Camadas · Lição 16 de 19

Vamos revisar os principais conceitos abordados até aqui, para fixar o aprendizado e manter esses temas sempre em mente:

## Arquitetura em Camadas

A arquitetura em camadas organiza o código em diferentes níveis de responsabilidade, facilitando o desenvolvimento, a manutenção e os testes. Cada camada tem um papel bem definido:

### Camada Model

A camada Model é responsável por interagir diretamente com o banco de dados. Aqui, centralizamos a lógica para manipular as tabelas e realizar operações CRUD.

-   **Responsabilidade**: Garantir que todas as consultas e interações com o banco estejam encapsuladas.
-   **Exemplo**: Criar métodos como `createStudent`, que insere os dados do estudante na tabela correspondente.

### Camada Service

A camada Service contém a lógica de negócio da aplicação, sendo o local onde regras mais complexas são implementadas.

-   **Responsabilidade**: Garantir que as regras de negócio sejam aplicadas antes ou depois de interagir com outras camadas.
    
-   **Exemplo**:
    
-   Validar a quantidade máxima de estudantes por disciplina.
-   Aprovação ou reprovação automática.
-   Utilizar uma API externa para validação de CEP.

### Camada Controller

A camada Controller atua como intermediária entre as requisições do cliente e a lógica de negócio, centralizando a validação inicial dos dados de entrada e as respostas HTTP.

**Responsabilidade**: Processar os dados recebidos, chamar o serviço correspondente e retornar a resposta ao cliente.

### Regras de Negócio

As regras de negócio na arquitetura apresentada, são implementadas na camada Service e representam os comportamentos específicos da aplicação, refletindo as necessidades e restrições que fazem parte do domínio do problema.

**O que são?**

Regras de negócio são condições ou restrições que regem como a aplicação deve processar os dados ou tomar decisões. Elas definem o "como" e "por quê" certos comportamentos ocorrem dentro do sistema.

## Validação de Dados de Entrada com Joi

O Joi é uma biblioteca poderosa para validação de dados de entrada, garantindo que apenas informações corretas e completas sejam processadas pelas camadas seguintes.

## Testes de Unidade

Os **testes de unidade** verificam o comportamento de funções ou métodos de forma isolada, garantindo que cada unidade do código funcione como esperado. No caso do Node.js, combinamos o Jest com mocks para testar partes específicas, como Controllers e Services, sem depender de recursos externos.

## Mocks com Jest

Os mocks são fundamentais para isolar componentes durante os testes, permitindo simular comportamentos de funções ou módulos. No Jest, usamos `jest.spyOn` para observar e alterar o comportamento de funções específicas, e `jest.fn()` para criar funções simuladas.

-   **Exemplo**: Mockar `studentService.createStudent` para retornar diferentes cenários (sucesso, erro de validação ou erro interno) e verificar como o Controller lida com cada caso.
