# 4.11 - Para não esquecer mais

> Seção 4 - Testes da Aplicação · Lição 11 de 13

## Testes automatizados

Nos testes automatizados, criamos um script que define as funções, pré-condições, casos de teste e os resultados esperados. Ao ser executado, esse script faz todo o trabalho de rodar os testes, comparar os resultados obtidos com os esperados, e gerar um relatório.

O maior benefício dos testes automatizados é a eficiência: tarefas repetitivas e demoradas podem ser automatizadas, liberando o tempo das pessoas para se concentrarem em atividades de maior valor, como o [teste exploratório](https://www.atlassian.com/br/continuous-delivery/software-testing/exploratory-testing#:~:text=Testes%20explorat%C3%B3rios%20%C3%A9%20a%20abordagem,no%20escopo%20de%20outros%20testes), que requer interpretação e julgamento humanos.

## Tipos de teste

Os testes podem ser classificados de acordo com o **escopo** e o nível de **interação**:

1.  `Testes Unitários`: Testam uma unidade isolada do código, geralmente uma função ou método, sem interações externas. São rápidos e precisos, ajudando a garantir que cada parte do código funcione conforme o esperado de forma individual.
    
2.  `Testes de Integração`: Verificam se várias unidades ou componentes do sistema funcionam juntos corretamente. Aqui, o foco está nas interações entre diferentes partes da aplicação, como módulos, APIs ou banco de dados.
    
3.  `Testes de Ponta-a-ponta (End-to-End; E2E)`: Simulam o fluxo completo de uso de uma aplicação, cobrindo desde a interface do usuário até o banco de dados e tudo o que acontece entre eles. São os mais abrangentes, porém mais lentos, pois dependem da integração de todos os sistemas envolvidos.
    

> **Relembrando 🧠:** Nenhum teste é mais importante que o outro: uma boa combinação de testes unitários, de integração e E2E é o que vai garantir a qualidade e confiabilidade do seu código.

## Assertion (Asserção)

Para testar corretamente uma função, precisamos executar a função com os inputs desejados e, em seguida, verificar se a saída é a esperada. Essa validação é chamada de assertion, ou "asserção" em português, e base dos testes automatizados, pois garante que o código esteja funcionando como previsto.

## Contratos de APIs

Os contratos de APIs definem como uma API deve se comportar em diferentes cenários. Eles especificam:

-   Estrutura de Requisição: Quais dados devem ser enviados, o formato e as validações necessárias.
-   Método HTTP: Determina se a requisição será feita via GET, POST, PUT, DELETE, etc.
-   Status Code: Define os códigos de status que indicam o sucesso ou falha da requisição (ex.: 200, 404, 500).
-   Estrutura de Resposta: Define o formato e os dados esperados na resposta da API.

Testar contratos de API é crucial para garantir que a comunicação entre serviços esteja de acordo com o que foi definido e que mudanças no código não quebrem essa integração.

## Cenários de Teste

Os cenários de teste descrevem as situações em que o código será testado. Um bom cenário de teste cobre tanto os casos positivos (quando tudo funciona como esperado) quanto os casos negativos (quando algo dá errado ou parâmetros inválidos são fornecidos). A ideia é antecipar diferentes comportamentos e garantir que o código lide bem com todos eles.

Exemplos de Cenários de Teste:

-   Testar uma função com inputs válidos e verificar a resposta correta.
-   Testar uma função com inputs inválidos e garantir que ela retorna um erro ou trata a situação de forma adequada.
-   Verificar se uma API retorna o status code esperado em uma situação de sucesso ou erro.

## Jest

O Jest é uma das ferramentas de testes automatizados mais populares para JavaScript e Node.js. Ele oferece um ambiente completo para criar e rodar testes de unidade, integração e até mesmo de ponta a ponta. Entre suas principais funcionalidades estão:

-   *`Matchers`*: Ferramentas que permitem comparar resultados e validar asserções.
-   `Cobertura de Código (Coverage)`: Gera relatórios que mostram quais partes do código foram cobertas pelos testes.

## Supertest

O Supertest é uma biblioteca que permite testar APIs de forma eficiente, simulando requisições HTTP e verificando as respostas. É ideal para escrever testes de integração, garantindo que os endpoints da API funcionem conforme o esperado.

## Para onde vamos?

Na próxima lição, você terá a oportunidade de colocar em prática tudo o que aprendeu até agora, desenvolvendo um projeto real. Siga para a próxima lição e descubra todos os detalhes sobre o projeto!
