# 4.4 - Testes de Integração

> Seção 4 - Testes da Aplicação · Lição 4 de 13

Agora que entendemos o conceito básico de **testes automatizados**, vamos nos aprofundar nos **testes de integração**, que têm como foco testar múltiplas partes da aplicação em conjunto, especialmente em APIs.

## Testes em APIs

Nas APIs que construímos até o momento, é essencial garantir que elas cumpram seu papel: o cliente faz uma requisição, e o servidor responde com a informação correta. Diferente dos testes unitários, que validam componentes isolados, os testes de integração permitem verificar o comportamento de um sistema mais amplo, simulando o fluxo real entre os componentes da aplicação.

> **Anota aí 🖊:** Os testes de integração são responsáveis por verificar se a API responde corretamente a requisições, processa corretamente os dados e retorna o status e resposta esperados.

## Contratos de APIs

Sempre que fornecemos ou consumimos uma API, devemos garantir que o comportamento está conforme o esperado. Isso envolve validar as **regras de entrada e saída de dados da API**, conhecidas como **contratos**.

Por exemplo, considere um endpoint `GET /users/:userId`. O contrato pode ser definido da seguinte forma:

-   Se uma pessoa usuária com o ID fornecido existir, o código HTTP retornado será `200 - OK`, e o corpo da resposta **conterá os dados** dessa pessoa.
-   Caso a pessoa usuária não exista, o código HTTP será `404 - Not Found`.

Perceba que podemos ter vários padrões e comportamentos esperados. Dessa forma, é importante testar se esses comportamentos estão sendo cumpridos, retornando uma resposta compatível com o cenário.

> **Anota aí 🖊:** O contrato define aquilo que foi previamente acordado, ou seja, como a API deverá se comportar em um determinado cenário.

## Exemplo de Contrato

Para exemplificarmos o conceito de contrato, vamos utilizar novamente o endpoint `GET /users/:userId`. Podemos definir o contrato assim:

-   Se a pessoa usuária existir, o retorno esperado da API é:
    
-   Código HTTP: `200 - OK`;
    
-   Body(Resposta):

```json
{
  "id": "123",
  "name": "Rafael",
  "fullName": "Rafael Santos",
  "email": "rafael.santos@email.com"
}
```

-   Caso a pessoa usuária não seja encontrada, a API deverá retornar:
    
-   Código HTTP: `404 - Not Found`;
    
-   Body(Resposta):

```json
{
  "message": "User Not Found!"
}
```

Ao escrever testes de integração, garantimos que os contratos da nossa API estão sendo respeitados, ou seja, a API está respondendo conforme o acordo estabelecido e as regras definidas.
