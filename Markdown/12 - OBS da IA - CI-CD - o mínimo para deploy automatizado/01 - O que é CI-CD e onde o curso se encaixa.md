# IA.1 - O que é CI/CD e onde o curso se encaixa

> [OBS da IA] - CI/CD: o mínimo para deploy automatizado · Lição 1 de 7

> **Conteúdo escrito pela IA** (GitHub Copilot) como complemento ao curso. Não faz parte do material original da Trybe. Versões de ferramentas e telas citadas refletem out/2026: confira a documentação oficial antes de usar em produção.

Na [lição 9.7](../11%20-%20Se%C3%A7%C3%A3o%209%20-%20Automatiza%C3%A7%C3%A3o%20e%20Deploy%20de%20Aplica%C3%A7%C3%B5es/07%20-%20Deploy%20da%20aplica%C3%A7%C3%A3o%20no%20Railway.md) você ligou o repositório do GitHub ao Railway: a cada `git push` na branch principal, o Railway faz um novo deploy. Funciona, mas tem um problema sério: **o deploy acontece mesmo que os testes estejam quebrados**. Nada garante que os testes da Seção 4 rodaram antes do código ir para produção.

É exatamente isso que um pipeline de **CI/CD** resolve. Esta seção cobre o mínimo que você precisa saber para montar um, primeiro para a API Cookmaster do curso e depois para um projeto SAP CAP no BTP.

## CI, CD e CD: três ideias diferentes

| Termo | O que significa | Na prática |
| --- | --- | --- |
| **CI** — Continuous Integration (Integração Contínua) | Todo código enviado ao repositório é **instalado, verificado e testado automaticamente**. | Abriu um pull request ou fez push → o servidor de CI roda `npm ci`, lint e `npm test`. Se algo falha, o time fica sabendo na hora. |
| **CD** — Continuous Delivery (Entrega Contínua) | Todo código que passa na CI vira um **artefato pronto para produção**. O deploy é um clique (ou uma aprovação). | Pipeline gera a imagem Docker/o `.mtar`, faz deploy em homologação e espera alguém aprovar a produção. |
| **CD** — Continuous Deployment (Implantação Contínua) | Igual à anterior, mas **sem aprovação manual**: passou em tudo, vai para produção. | Merge na `main` → testes → deploy automático. |

O que o Railway faz hoje na Seção 9 é um "Continuous Deployment" *sem a parte de CI*. Vamos colocar a CI na frente dele.

## Anatomia de um pipeline

Quase todo pipeline, de um projeto pessoal a um projeto SAP corporativo, segue esta sequência:

1.  **Gatilho (trigger):** um evento inicia o pipeline — push, pull request, criação de tag/release, agendamento ou execução manual.
2.  **Checkout + instalação:** uma máquina limpa baixa o código e instala as dependências exatamente como estão no `package-lock.json` (`npm ci`).
3.  **Verificação:** lint e testes (unidade e integração). Qualquer comando que termine com código de saída diferente de `0` **quebra o pipeline**.
4.  **Build / empacotamento:** gera o artefato que vai para o servidor — imagem Docker, pasta `gen/` do `cds build` ou arquivo `.mtar`.
5.  **Deploy:** publica o artefato em um ambiente (homologação, produção), usando credenciais guardadas como **segredos**.
6.  **Verificação pós-deploy:** confirma que a aplicação subiu (health check, smoke test). Se não subiu, volta a versão anterior.

## Ferramentas

-   **GitHub Actions** — integrado ao GitHub, gratuito para repositórios públicos e com uma cota mensal de minutos para privados. É o que usaremos nesta seção.
-   **GitLab CI**, **Azure Pipelines**, **Jenkins** — mesmos conceitos, sintaxes diferentes.
-   **SAP Continuous Integration and Delivery** e **Project Piper** — as opções da SAP para projetos no BTP (assunto da lição IA.6).

Aprendendo bem os conceitos em uma ferramenta, a troca para outra é questão de consultar a sintaxe.

## Onde o conteúdo do curso se encaixa

| Etapa do pipeline | Onde você aprendeu |
| --- | --- |
| Scripts do `package.json`, `npm install` | [2.7 - NPM](../03%20-%20Se%C3%A7%C3%A3o%202%20-%20Introdu%C3%A7%C3%A3o%20ao%20Node.js/07%20-%20NPM.md) |
| Testes automatizados (Jest, Supertest, mocks) | [Seção 4](../06%20-%20Se%C3%A7%C3%A3o%204%20-%20Testes%20da%20Aplica%C3%A7%C3%A3o/03%20-%20Testes%20automatizados.md) e [5.13](../07%20-%20Se%C3%A7%C3%A3o%205%20-%20Persist%C3%AAncia%20de%20Dados%20com%20Node.js/13%20-%20Testes%20de%20Integra%C3%A7%C3%A3o%20com%20jest.spyOn.md) |
| Configuração por variáveis de ambiente | [5.5 - Variáveis de ambiente](../07%20-%20Se%C3%A7%C3%A3o%205%20-%20Persist%C3%AAncia%20de%20Dados%20com%20Node.js/05%20-%20Vari%C3%A1veis%20de%20Ambiente.md) |
| Empacotar a aplicação | [9.4 - Criando um Dockerfile](../11%20-%20Se%C3%A7%C3%A3o%209%20-%20Automatiza%C3%A7%C3%A3o%20e%20Deploy%20de%20Aplica%C3%A7%C3%B5es/04%20-%20Criando%20um%20Dockerfile.md) |
| Publicar | [9.7 - Deploy no Railway](../11%20-%20Se%C3%A7%C3%A3o%209%20-%20Automatiza%C3%A7%C3%A3o%20e%20Deploy%20de%20Aplica%C3%A7%C3%B5es/07%20-%20Deploy%20da%20aplica%C3%A7%C3%A3o%20no%20Railway.md) |

O que falta é **ligar essas peças** de forma automática e segura. É isso que as próximas lições fazem.

## Roteiro da seção

1.  **IA.2** — Deixar o projeto pronto para rodar em uma máquina limpa.
2.  **IA.3** — Escrever o primeiro workflow do GitHub Actions (CI).
3.  **IA.4** — Segredos, ambientes e proteção da branch `main`.
4.  **IA.5** — Deploy contínuo da API Cookmaster no Railway.
5.  **IA.6** — O mesmo raciocínio aplicado a SAP CAP no BTP (Cloud Foundry e Kyma).
6.  **IA.7** — Resumo, exercício e quiz.
