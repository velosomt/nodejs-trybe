# Próximos passos

> [Conteúdo Complementar] - Docker · Lição 1 de 1

Nas próximas seções, iremos abordar conteúdos que exigem conhecimento prévio em **[Docker](https://cursos.betrybe.com/191919)**. Se você já tem familiaridade com esse tema, pode seguir diretamente para as próximas lições. Caso contrário, recomendamos que faça nosso curso complementar de Docker.

Se você avançar e perceber que está tendo dificuldades por falta de conhecimento em Docker, sugerimos que volte e complete o curso complementar antes de continuar.

Para ajudar na decisão, preparamos um quiz com perguntas sobre os tópicos necessários. Se você acertar as questões, pode prosseguir com confiança. Caso contrário, será fundamental fazer o curso complementar para garantir o melhor aproveitamento do conteúdo.

## Quiz

### Questão 1

Qual das alternativas a seguir descreve corretamente o conceito de “empacotamento de aplicações” com Docker?

- **A)** É o processo de agrupar o código-fonte da aplicação em um único arquivo executável, incluindo todas as dependências necessárias.
- **B)** É o processo de encapsular uma aplicação e suas dependências em um container Docker para garantir a consistência em diferentes ambientes.
- **C)** É o processo de criar uma imagem Docker com o código-fonte da aplicação, mas sem incluir dependências externas para reduzir o tamanho da imagem.
- **D)** É a prática de empacotar uma aplicação com todas as suas bibliotecas e configurações em uma imagem Docker, garantindo que ela seja executada de forma consistente em qualquer ambiente.
- **E)** É o processo de compilar o código e gerar uma imagem Docker sem a necessidade de incluir bibliotecas e configurações do sistema.

### Questão 2

Quais problemas o Docker resolve no processo de desenvolvimento e distribuição de software?

- **A)** Docker resolve o problema de isolamento de processos no host, garantindo que cada aplicação tenha seu próprio sistema operacional.
- **B)** Docker resolve problemas relacionados à instalação de múltiplas versões de uma mesma aplicação no mesmo ambiente.
- **C)** Docker resolve problemas de inconsistência de ambiente, empacotando a aplicação e suas dependências, garantindo que o comportamento seja o mesmo em diferentes ambientes, como desenvolvimento e produção.
- **D)** Docker resolve o problema de escalabilidade horizontal de aplicações, permitindo que múltiplos containers sejam criados em uma única máquina.
- **E)** Docker resolve o problema de múltiplos desenvolvedores modificando a mesma aplicação ao mesmo tempo, garantindo controle de versão e rollback automático.

### Questão 3

Qual é a diferença entre uma imagem Docker e um container Docker?

- **A)** Uma imagem Docker é a instância em execução de um container, que pode ser escalada para múltiplos hosts simultaneamente.
- **B)** Uma imagem Docker é um arquivo que contém todas as instruções para criar um container, enquanto um container é a instância em execução dessa imagem.
- **C)** Um container Docker é uma imagem que foi baixada de um registry e armazenada localmente para ser reutilizada quando necessário.
- **D)** Um container Docker é uma cópia de uma imagem que foi transformada em um executável, mas não pode ser modificada após a criação.
- **E)** Um container Docker é criado a partir de uma imagem Docker e é responsável por armazenar o código-fonte da aplicação.

### Questão 4

Ao utilizar o docker-compose, o que é necessário para gerenciar múltiplos containers de maneira eficiente e automática?

- **A)** Utilizar o comando docker-compose up, que automaticamente cria e gerencia os containers, redes e volumes de acordo com as configurações no arquivo docker-compose.yml.
- **B)** Configurar o docker-compose.yml com as definições de cada container, mas sem incluir redes e volumes, que precisam ser configurados manualmente após o docker-compose up.
- **C)** Criar imagens personalizadas para cada serviço, que devem ser gerenciadas manualmente pelo Docker CLI, sem a necessidade de um arquivo de configuração.
- **D)** Configurar múltiplos arquivos YAML, um para cada container, e usar o Docker Compose para sincronizar todos eles em um único ambiente.
- **E)** Configurar os containers manualmente pelo terminal, criando scripts para automatizar o processo de conexão entre redes e volumes.

### Questão 5

Quais são os benefícios de persistir dados de containers Docker utilizando volumes em vez de armazená-los diretamente no sistema de arquivos do container?

- **A)** Volumes garantem que os dados sejam acessíveis para todos os containers no mesmo host, até que o container original seja removido.
- **B)** Volumes mantêm os dados do container no sistema de arquivos do container, garantindo que eles sejam acessados com segurança após a reinicialização do host.
- **C)** Volumes permitem que os dados sejam compartilhados entre múltiplos containers, mas são excluídos automaticamente quando o container é removido.
- **D)** Volumes garantem que os dados do container sejam replicados em todos os nós do cluster, independentemente de onde o container seja executado.
- **E)** Volumes permitem que os dados persistam independentemente do ciclo de vida do container, garantindo que os dados não sejam perdidos quando o container é recriado ou apagado.

### Questão 6

Qual comando Docker é usado para listar todos os containers, incluindo aqueles que não estão em execução?

- **A)** docker ps
- **B)** docker ps -a
- **C)** docker container ls
- **D)** docker list --all
- **E)** docker container show --all

### Questão 7

Qual comando abaixo é utilizado para criar uma nova imagem Docker a partir de um arquivo Dockerfile?

- **A)** docker build .
- **B)** docker create -f Dockerfile
- **C)** docker make Dockerfile
- **D)** docker build -create .
- **E)** docker image build Dockerfile

### Questão 8

Você deseja acessar o terminal de um container em execução para executar comandos diretamente dentro do container. Qual é o comando correto para isso? \[ID\_CONTAINER\] é o identificador do container em questão.

- **A)** docker run -it \[ID\_CONTAINER\] bash
- **B)** docker attach \[ID\_CONTAINER\]
- **C)** docker container access \[ID\_CONTAINER\] --bash
- **D)** docker exec -it \[ID\_CONTAINER\] /bin/bash
- **E)** docker container exec --bash \[ID\_CONTAINER\]

### Questão 9

Qual comando no Dockerfile é utilizado para executar um comando durante a construção da imagem, como a instalação de pacotes?

- **A)** CMD
- **B)** EXEC
- **C)** EXPOSE
- **D)** INSTALL
- **E)** RUN

### Questão 10

Qual comando no Dockerfile define a imagem base a ser usada para a construção de uma nova imagem Docker?

- **A)** BASE
- **B)** IMAGE
- **C)** FROM
- **D)** RUN
- **E)** START

<details><summary>Gabarito</summary>

**1.** D

**2.** C

**3.** B

**4.** A

**5.** E

**6.** B

**7.** A

**8.** D

**9.** E

**10.** C

</details>
