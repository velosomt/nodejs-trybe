# 5.14 - Para não esquecer mais

> Seção 5 - Persistência de Dados com Node.js · Lição 14 de 16

Vamos revisar os principais conceitos abordados até aqui, para fixar o aprendizado e manter esses temas sempre em mente:

## Docker Compose

O **Docker Compose** facilita a orquestração de containers para aplicações com múltiplos serviços, como bancos de dados e APIs. A configuração é feita em um arquivo `docker-compose.yml`, onde definimos serviços, volumes e networks para a comunicação entre os containers. Ao rodar `docker-compose up -d`, todos os containers são inicializados conforme a configuração, simplificando o setup do ambiente de desenvolvimento.

## Pool de Conexões

O **pool de conexões** é uma técnica para gerenciar várias conexões com o banco de dados, reutilizando-as em vez de abrir uma nova conexão a cada requisição. Isso otimiza a performance e evita sobrecarregar o banco, pois mantém um conjunto de conexões pré-estabelecidas, gerenciando a distribuição conforme a demanda.

-   **Exemplo**: Em uma aplicação Express com MySQL, um pool de conexões garante que as requisições de múltiplos usuários sejam atendidas rapidamente, reaproveitando conexões abertas.

## Prepared Statements

Os **prepared statements** são instruções SQL pré-compiladas que melhoram a segurança e a performance de queries dinâmicas. Eles ajudam a prevenir **SQL Injection** ao separar a lógica SQL dos dados que são inseridos, garantindo que os valores sejam tratados como parâmetros. Essa técnica também acelera a execução de queries frequentes, pois o banco de dados reutiliza o plano de execução gerado na primeira vez.

-   **Exemplo**: `connection.execute('SELECT * FROM students WHERE id = ?', [id])` permite passar o valor de `id` como parâmetro, evitando **SQL Injection** e otimizando a consulta.

## Variáveis de Ambiente

As **variáveis de ambiente** permitem armazenar dados sensíveis, como credenciais de banco de dados, em arquivos externos (.env). Isso facilita a configuração do ambiente em diferentes máquinas sem modificar o código.

No contexto do **Docker Compose**, as variáveis de ambiente podem ser declaradas diretamente no `docker-compose.yml` ou carregadas de um arquivo `.env`. Esse arquivo pode armazenar informações como senhas, nomes de banco de dados e URLs, que são então referenciadas no Compose, deixando o `docker-compose.yml` mais dinâmico e seguro.

-   **Exemplo**: Armazenar DB\_PASSWORD no arquivo .env e usar process.env.DB\_PASSWORD no código evita expor senhas e facilita a configuração em diferentes ambientes (desenvolvimento, teste, produção).

## Testes com Mock

Os **mocks** simulam o comportamento de partes do sistema, como funções, objetos ou módulos, para permitir testes controlados e independentes. Em testes de integração, o mocking é especialmente útil para isolar o que está sendo testado, evitando acessos reais a recursos externos, como bancos de dados. O `jest.spyOn` permite "espionar" funções e simular retornos personalizados, enquanto `jest.mock` permite substituir módulos inteiros, tornando os testes mais rápidos e confiáveis.

-   **Exemplo**: Em um teste de uma rota que consulta o banco de dados, `jest.spyOn(connection, 'execute')` permite simular diferentes respostas sem alterar a lógica do código, garantindo que o teste valide o comportamento esperado sem depender do banco.
