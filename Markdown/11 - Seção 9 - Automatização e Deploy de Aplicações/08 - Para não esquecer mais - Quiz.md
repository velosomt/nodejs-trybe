# 9.8 - Para não esquecer mais | Quiz

> Seção 9 - Automatização e Deploy de Aplicações · Lição 8 de 11

Vamos revisar os principais conceitos abordados até aqui, para fixar o aprendizado e manter esses temas sempre em mente:

## Deploy

O **deploy** é o processo de disponibilizar uma aplicação para uso, seja em ambiente de desenvolvimento, teste ou produção.

-   **Importância**: Permite que sua aplicação esteja acessível e funcional para usuários reais.
-   **Fases**: Desenvolvimento → Testes → Deploy → Monitoramento e Manutenção.

## Computação em Nuvem

A computação em nuvem permite executar aplicações em servidores remotos, eliminando a necessidade de infraestrutura física própria.

**Modelos:**

-   **IaaS** (Infraestrutura como Serviço): Controle total sobre servidores virtuais.
-   **PaaS** (Plataforma como Serviço): Hospedagem simplificada, sem necessidade de gerenciar servidores.
-   **SaaS** (Software como Serviço): Softwares online prontos para uso.

## Docker e Docker Compose

**Docker** permite criar containers, que são ambientes isolados para executar aplicações de forma padronizada.

-   **Dockerfile:** Define como a aplicação será empacotada.
-   **Docker Compose:** Gerencia multiplos containers em um ambiente.

### Railway

O **Railway** é uma plataforma de deploy em nuvem que facilita a hospedagem de aplicações backend.

Passos para Deploy:

-   **Criar** uma conta e configurar um projeto no Railway.
-   **Vincular** um repositório Git para facilitar atualizações.
-   **Configurar** variáveis de ambiente para conexão segura.
-   **Implantar**a aplicação e monitorar seu funcionamento.

**📢 Dominar esses conceitos garantirá que você consiga publicar, manter e escalar suas aplicações com confiança. Agora, que tal praticar o que aprendeu? Lembre-se de que a aprovação de 80% das perguntas é o que permite você avançar para o gabarito e indicar que completou esta seção!**

<details>
<summary>OBS da IA</summary>

**CI/CD**

-   Para fechar a lacuna de CI/CD do curso há uma seção extra: [OBS da IA - CI/CD: o mínimo para deploy automatizado](../12%20-%20OBS%20da%20IA%20-%20CI-CD%20-%20o%20m%C3%ADnimo%20para%20deploy%20automatizado/01%20-%20O%20que%20%C3%A9%20CI-CD%20e%20onde%20o%20curso%20se%20encaixa.md). Ela inclui a versão para SAP CAP no BTP em [IA.6](../12%20-%20OBS%20da%20IA%20-%20CI-CD%20-%20o%20m%C3%ADnimo%20para%20deploy%20automatizado/06%20-%20CI-CD%20para%20SAP%20CAP%20no%20BTP.md).

</details>

## Quiz

### Questão 1

O que é deploy em uma aplicação?

- **A)** O processo de escrever o código-fonte da aplicação.
- **B)** A configuração do ambiente local para desenvolvimento.
- **C)** O ato de disponibilizar a aplicação para ser acessada em um servidor.
- **D)** A criação de um banco de dados para a aplicação.
- **E)** O processo de depuração e correção de bugs antes do lançamento.

### Questão 2

Qual das seguintes opções representa corretamente a diferença entre IaaS, PaaS e SaaS?

- **A)** IaaS oferece apenas aplicações prontas, PaaS fornece servidores físicos e SaaS gerencia máquinas virtuais.
- **B)** IaaS disponibiliza infraestrutura como serviço, PaaS fornece plataformas gerenciadas e SaaS são softwares prontos para uso.
- **C)** IaaS permite o gerenciamento de servidores físicos, enquanto PaaS e SaaS são serviços offline.
- **D)** PaaS é um serviço que apenas hospeda arquivos estáticos, enquanto IaaS e SaaS são utilizados para aplicações dinâmicas.
- **E)** SaaS é voltado para desenvolvedores, enquanto IaaS e PaaS são para usuários finais.

### Questão 3

Sobre Docker e Docker Compose, qual das afirmações está correta?

- **A)** O Docker Compose permite orquestrar múltiplos containers de uma aplicação.
- **B)** Docker é utilizado apenas para criar imagens de sistemas operacionais completos.
- **C)** Containers criados com Docker não podem ser replicados em outros ambientes.
- **D)** O Dockerfile é um script que exclui containers automaticamente após o uso.
- **E)** Docker não é compatível com aplicações desenvolvidas em Node.js.

### Questão 4

Sobre o Railway, qual das afirmações é falsa?

- **A)** Railway permite hospedar aplicações Node.js sem necessidade de gerenciar servidores.
- **B)** É possível vincular um repositório GitHub ao Railway para facilitar o deploy.
- **C)** O Railway oferece suporte para bancos de dados como PostgreSQL e MySQL.
- **D)** Para usar o Railway, é necessário configurar manualmente um servidor físico.
- **E)** A plataforma gera uma URL para acessar a aplicação após o deploy.

### Questão 5

Analise as seguintes assertivas sobre deploy e escolha a alternativa que contém apenas as afirmativas corretas:

I. O Docker Compose é uma ferramenta usada para gerenciar múltiplos containers simultaneamente.  
II. O IaaS fornece apenas software como serviço, sem acesso à infraestrutura de servidores.  
III. O deploy de uma aplicação pode ser feito de maneira automática sempre que um novo commit é enviado para um repositório Git integrado.  
IV. Railway é um serviço exclusivamente pago e não oferece plano gratuito para desenvolvedores.  
V. As variáveis de ambiente são usadas para armazenar configurações sensíveis, como credenciais de banco de dados, sem expô-las no código-fonte.

Estão corretas as assertivas:

- **A)** I e II
- **B)** II e IV
- **C)** I, III e V
- **D)** III, IV e V
- **E)** II, III e V

<details><summary>Gabarito</summary>

**1.** C

**2.** B

**3.** A

**4.** D

**5.** C

</details>
