# 4.5 - Definindo Cenários de Teste

> Seção 4 - Testes da Aplicação · Lição 5 de 13

Para exemplificar como funcionam os testes de integração, iremos construir uma nova API chamada **Cacau Trybe**, que oferece *endpoints* para gerenciar uma lista de chocolates de diferentes marcas da França 🍫.

A **API Cacau Trybe** será composta por quatro *endpoints*, e abaixo estão os contratos que definem o comportamento esperado para cada um:

👉 **GET** *`/chocolates`*

-   Objetivo: Retornar uma lista com todos os chocolates cadastrados.
-   Código HTTP: `200 - OK`;
-   Body (exemplo):

```json
[
  { "id": 1, "name": "Mint Intense", "brandId": 1 },
  { "id": 2, "name": "White Coconut", "brandId": 1 },
  { "id": 3, "name": "Mon Chéri", "brandId": 2 },
  { "id": 4, "name": "Mounds", "brandId": 3 }
]
```

👉 **GET** *`/chocolates/:id`*

-   Objetivo: Buscar um chocolate específico pelo ID.
-   Código HTTP: `200 - OK`;
-   Body Resultado (exemplo, se encontrado):

```json
{
  "id": 4,
  "name": "Mounds",
  "brandId": 3
}
```

-   Objetivo: Retornar mensagem de erro se o chocolate não for encontrado.
-   Código HTTP: `404 - Not Found`;
-   Body (exemplo, se não encontrado):

```json
{
  "message": "Chocolate Not Found!"
}
```

👉 **GET** *`/chocolates/brand/:brandId`*

-   Objetivo: Buscar uma lista de chocolates por brandId (ID da marca).
-   Código HTTP: `200 - OK`;
-   Body (exemplo):

```json
[
  {
    "id": 1,
    "name": "Mint Intense",
    "brandId": 1
  },
  {
    "id": 2,
    "name": "White Coconut",
    "brandId": 1
  }
]
```

👉 **POST** *`/chocolates`*

-   Objetivo: Adicionar um novo chocolate à lista.
-   Código HTTP: `201 - Created`;
-   Body Requisição (exemplo):

```json
{
  "name": "Truffe",
  "brandId": 2
}
```

-   Body Resposta (exemplo):

```json
{
  "message": "Chocolate added successfully!",
  "chocolate": {
    "name": "Truffe",
    "brandId": 2
  }
}
```

Com os contratos definidos, estamos prontos para criar nossa API e implementar os testes de integração que irão garantir que esses contratos sejam respeitados.
