# 3.18 - Para não esquecer mais

> Seção 3 - API REST com Express · Lição 18 de 20

Ao longo desta seção, vimos diversos conceitos importantes que serão essenciais para continuarmos desenvolvendo aplicações web com Node.js e construindo APIs. Para ajudar você a relembrar esses pontos-chave, preparamos este mini resumo com os principais termos abordados. Ele será uma ótima referência rápida!

## Framework Express

O Express é um framework que nos ajuda a organizar e construir APIs robustas e flexíveis, nos dando ferramentas que fazem as coisas acontecerem com poucas linhas de código, abstraindo a lógica e códigos por trás de funcionalidades muito comuns nas aplicações.

## C.R.U.D. (ou CRUD)

Esse é um acrônimo para um conjunto de operações muito comuns no mundo do desenvolvimento, elas são:

-   **Create:** Criar;
-   **Read:** Ler;
-   **Update:** Alterar;
-   **Delete:** Deletar

Essas operações são a base para quase toda a manipulação de informações em uma aplicação.

## API Clients

Ferramentas como o Postman e Insomnia são conhecidas como API clients. Elas permitem que você envie requisições HTTP para testar e interagir com APIs, sem precisar construir uma interface de usuário. Você pode configurar requisições com diferentes métodos, parâmetros, headers e visualizar as respostas, facilitando o teste e depuração da sua API.

## Métodos de Envio de Dados

Existem três principais formas de enviar dados para uma API:

1.  **Query params (parâmetros de consulta):** São anexados à URL após um `?`. Por exemplo, `/teams?filterTeamByInitial=A`. São comumente usados para enviar filtros ou informações adicionais.
    
2.  **Route params (parâmetros de rota):** São parte da própria URL e geralmente representam um recurso específico. Exemplo: `/teams/:id`, onde `:id` seria substituído pelo identificador de um time.
    
3.  **Body:** O corpo da requisição é utilizado especialmente em métodos como POST e PUT, para enviar dados mais complexos, geralmente no formato JSON.
    

## HTTP

O protocolo HTTP é a base da comunicação na web. Aqui estão os principais métodos utilizados em APIs:

-   **GET:** Utilizado para recuperar dados.
-   **POST:** Utilizado para enviar dados e criar novos recursos no servidor.
-   **PUT:** Utilizado para atualizar um recurso de forma completa.
-   **PATCH:** Utilizado para atualizar parte de um recurso.
-   **DELETE:** Utilizado para remover um recurso do servidor.

## Middlewares

Middlewares no Express são funções que interceptam as requisições antes de chegarem às rotas finais. Eles podem realizar diversas tarefas, como validações, autenticação, ou até mesmo alterar o conteúdo da requisição e resposta. São extremamente úteis para modularizar o código e reutilizar funcionalidades comuns em diferentes rotas.

## Express.json

O `express.json()` é um middleware embutido no Express que é responsável por processar o corpo de requisições que contenham JSON. Ele converte automaticamente o conteúdo do `req.body` em um objeto JavaScript, facilitando o trabalho com dados enviados em requisições POST, PUT ou PATCH.

## Middlewares Globais

Middlewares globais são middlewares que afetam todas as rotas da aplicação. Eles são úteis para tarefas como registro de logs, tratamento de autenticação, entre outros. Eles podem ou não influenciar o comportamento de todas as requisições.

## Middlewares de Erro

Os middlewares de erro têm a função específica de capturar e tratar erros que ocorrem na aplicação. Eles permitem uma gestão centralizada dos erros, garantindo que a API responda de forma apropriada. Um exemplo seria capturar erros de leitura e escrita de arquivos, e retornar uma mensagem alertando sobre o problema.

## Roteamento de API

O roteamento no Express permite que você organize as rotas da sua aplicação de forma modular, usando o `express.Router()`. Com isso, você pode separar grupos de rotas relacionados, facilitando a manutenção e a leitura do código.

## Para onde vamos?

No próximo conteúdo, você aprenderá a:

-   Testes Automatizados;
-   Testes de Integração;
-   Definir cenários de testes;
-   Cobertura de testes;
-   Configuração de testes com Jest.
