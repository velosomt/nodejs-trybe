# 3.10 - E essa tal de arquitetura REST?

> Seção 3 - API REST com Express · Lição 10 de 20

Antes de falarmos sobre arquitetura REST, é importante entender o que são REST e RESTful:

-   `REST` é um conjunto de boas práticas para a construção de APIs;
-   `RESTful` refere-se a um serviço web (seja desenvolvido por nós ou por terceiros) que segue as diretrizes do REST.

Assim, as duas palavras não são exatamente diferentes, mas complementares.

A sigla `REST` vem do inglês Representational State Transfer (ou, em português, Transferência de Estado Representacional). Resumindo, REST é um estilo arquitetural definido pelo [W3C](https://www.w3c.br/) que impõe algumas restrições sobre como uma API deve, idealmente, funcionar.

## As 5 restrições para ser RESTful

Embora o foco aqui não seja entrar em todos os detalhes da construção de APIs RESTful (um tema que vai longe!), vamos listar as cinco principais restrições de forma simplificada:

1.  **Interface uniforme (Uniform Interface):** Seguir um padrão para a troca de informações;
2.  **Arquitetura cliente-servidor:** O REST organiza nossa API de maneira que ela atenda às solicitações dos clientes por meio de requisições HTTP;
3.  **Sem estado (Stateless):** Cada requisição é independente e não carrega informações de estado entre elas. A API não armazena dados de clientes entre uma solicitação e outra;
4.  **Cacheable:** Requisições repetidas podem ser otimizadas usando cache, uma vez que elas retornam os mesmos resultados;
5.  **Sistema em camadas (Layered System):** A implementação interna da API é invisível ao cliente, que interage apenas com a camada que gerencia as requisições.

Vale lembrar que você só precisa aplicar todas essas restrições se quiser que sua API seja totalmente RESTful. No entanto, esse padrão não é uma solução mágica. Em APIs mais simples, pode ser desnecessário aplicar todos esses princípios.

> **De olho na dica 👀:** Cada cenário pede uma solução diferente, e no desenvolvimento de software, nada é gravado em pedra. Você pode quebrar algumas dessas regras, desde que tenha uma justificativa plausível.

Agora, se essas restrições pareceram complicadas, fique tranquilo! Veja como aplicamos esse padrão usando Express — você vai se surpreender.

## REST no Express

Os princípios do REST devem ser seguidos independentemente da tecnologia utilizada na construção da API, seja `Node.js`, `Python`, `Java`, ou qualquer outra linguagem.

No Express, uma grande vantagem é a organização das rotas, que permite separá-las pelos métodos (ou verbos) HTTP usados na requisição. Isso facilita o retorno de um formato específico ao cliente e a definição de códigos de status HTTP adequados.

Aqui está um exemplo de como usamos os métodos HTTP no Express:

```javascript
app.get(...)
app.post(...)
app.put(...)
app.delete(...)
```

Esse é o *pulo do gato*! Durante as explicações ao longo do conteúdo, você já utilizou a arquitetura REST em sua API! 😮

O jeito que você aprendeu a criar APIs já é RESTful! Claro, se aprofundar e saber analisar se uma API respeita todos os princípios RESTful é algo mais avançado, mas por enquanto, o importante é saber que estamos seguindo boas práticas ao criar nossos endpoints.

> **De olho na dica 👀:** No decorrer do curso, você criará soluções que vão respeitar esses princípios naturalmente. Guarde essa página e volte a consultá-la de tempos em tempos — você vai perceber como buscamos seguir essas boas práticas em todas as criações.

E com isso, concluímos essa parte! Agora, atráves do vídeo a seguir, iremos consolidar todo o aprendizado aprendido.

Agora é hora de praticar! Siga para o quiz e valide o seu conhecimento sobre o conteúdo aprendido durante a seção.

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   O protocolo padrão do CAP é **OData V4** (REST com convenções de consulta, metadados e paginação), que é o que os apps SAP Fiori consomem.
-   Se precisar de REST "puro", anote o serviço com `@protocol: 'rest'` (ou `@rest`). Um mesmo serviço pode ser servido em mais de um protocolo.

</details>
