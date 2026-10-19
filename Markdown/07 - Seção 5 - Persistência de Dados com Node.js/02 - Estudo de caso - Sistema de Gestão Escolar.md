# 5.2 - Estudo de caso: Sistema de Gestão Escolar

> Seção 5 - Persistência de Dados com Node.js · Lição 2 de 16

Nosso objetivo será construir gradualmente uma aplicação de **Sistema de Gestão Escolar** que gerencie o fluxo de dados de uma escola, desde o cadastro de alunos até análises mais complexas.

Conforme avançarmos, iremos introduzir novos recursos e camadas à aplicação, simulando situações reais que você pode encontrar no desenvolvimento de sistemas de gerenciamento. Esse projeto será dividido em fases, e a cada nova etapa implementaremos funcionalidades utilizando boas práticas de desenvolvimento. A ideia é que você não só entenda a teoria, mas veja como ela se aplica no mundo real.

Nosso objetivo é simular um cenário real, para que você compreenda de forma prática como resolver problemas comuns em aplicações e se familiarize com a arquitetura e as ferramentas utilizadas no mercado.

## Repositório base para acompanhar as próximas lições

Para começar os estudos, faça os passos abaixo:

1.  Clone o repositório [node-codigos](https://github.com/learnwithtrybe/node-codigos);
2.  Navegue até o diretório do projeto inicial `cd node-codigos/05-persistencia-de-dados/parte-01-inicio`;
3.  Dentro do projeto, execute o comando `code .` para abrir o VS Code;
4.  Instale as dependências com `npm install`.

A estrutura será semelhante ao formato abaixo:

```bash
.
├── node_modules/
├── src/
│  ├── database/
│  ├── app.js
│  └── server.js
├── tests/
├── .eslintignore
├── .eslintrc.json
├── .gitignore
├── docker-compose.yml
├── Insomnia_gestao_escolar-v1.json
├── jest.config.js
├── package-lock.json
├── package.json
├── README.md
└── school_db.sql
```

Com o projeto baixado e as dependências instaladas, estaremos prontos para começar a entender o temos no projeto e a construir a API que se conectará ao banco de dados.

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1039082937)
