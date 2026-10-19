# 5.1 - Introdução da seção

> Seção 5 - Persistência de Dados com Node.js · Lição 1 de 16

## Onde estamos?

Olá, pessoal!

Você aprenderá como integrar o banco de dados `MySQL` a uma aplicação Express, permitindo que você construa uma API robusta capaz de realizar operações de **Cadastro, Consulta, Atualização e Exclusão** de dados (CRUD) diretamente no `MySQL`.

### Você será capaz de:

-   Configurar um ambiente com Docker, utilizando um container MySQL;
-   Desenvolver um CRUD completo com Express, interagindo diretamente com o MySQL;
-   Escrever consultas SQL seguras utilizando **prepared statements**;
-   Aplicar variáveis de ambiente para isolar as configurações do seu código;
-   Criar testes de integração eficientes simulando o comportamento do banco de dados.

## Por que isso é importante?

Manipular dados de maneira eficiente é uma das competências mais requisitadas no desenvolvimento de software. Esses dados, muitas vezes, chegam até a aplicação por meio de formulários ou de requisições **HTTP** via **JSON** a um **endpoint** de uma *API REST*.

Em projetos reais, é fundamental que os dados sejam armazenados de forma segura e estejam disponíveis para futuras consultas ou operações, seja para alimentar funcionalidades da aplicação ou fornecer serviços. Bancos de dados relacionais, como o MySQL, são amplamente utilizados para esse fim, devido à sua capacidade de organizar, consultar e gerenciar grandes volumes de dados de maneira confiável. Portanto, dominar a integração entre uma aplicação Express e o MySQL não só é uma habilidade valiosa, mas também é essencial para criar soluções escaláveis e robustas no desenvolvimento de aplicações web modernas.
