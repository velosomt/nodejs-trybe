# 9.2 - Deploy

> Seção 9 - Automatização e Deploy de Aplicações · Lição 2 de 11

No desenvolvimento de software, **deploy** refere-se ao processo de publicar uma aplicação em um servidor, tornando-a acessível para outros usuários, seja em um ambiente de desenvolvimento, teste ou produção.

Em outras palavras, fazer o deploy é "colocar no ar" uma aplicação para que ela possa ser utilizada, seja por desenvolvedores, testadores ou pelo público final.

## O ciclo de vida do software e o papel do deploy

Dentro do ciclo de vida do desenvolvimento de software (SDLC – Software Development Life Cycle), o deploy é uma etapa essencial. Ele acontece após as fases de planejamento, desenvolvimento e testes. Quando o código está pronto, ele é disponibilizado em um servidor por meio do deploy, permitindo que o sistema entre em produção e, posteriormente, passe por manutenção contínua.

## Serviços em Nuvem e o Deploy

Hoje em dia, a maioria dos deploys utiliza serviços em nuvem, que simplificam as etapas complexas de configuração de servidores. Esses serviços oferecem infraestrutura e ferramentas prontas para hospedar aplicações, permitindo que você se concentre no desenvolvimento.

### Exemplos de serviços populares:

-   Amazon AWS
-   Microsoft Azure
-   Google Cloud Platform
-   Railway
-   Heroku
-   Netlify

Cada serviço tem suas características e vantagens, mas todos permitem realizar o deploy de forma prática e eficiente.

## Por que usar serviços em nuvem?

Os serviços em nuvem eliminam a necessidade de gerenciar diretamente a infraestrutura física, como discos e redes. Eles também oferecem escalabilidade, ou seja, você pode aumentar ou reduzir os recursos conforme sua aplicação cresce ou reduz seu uso.

Para iniciantes, plataformas como Railway ou Netlify são ideais, pois possuem interfaces simples e gratuitas para pequenos projetos.

<details>
<summary>OBS da IA</summary>

**CI/CD**

-   O curso mostra o deploy disparado por push, sem nada que verifique o código antes. Em times, o deploy vem depois de um **pipeline de CI/CD**: instalar → testar → empacotar → publicar → verificar, tudo automático e repetível.
-   Veja a seção [OBS da IA - CI/CD](../12%20-%20OBS%20da%20IA%20-%20CI-CD%20-%20o%20m%C3%ADnimo%20para%20deploy%20automatizado/01%20-%20O%20que%20%C3%A9%20CI-CD%20e%20onde%20o%20curso%20se%20encaixa.md).

</details>
