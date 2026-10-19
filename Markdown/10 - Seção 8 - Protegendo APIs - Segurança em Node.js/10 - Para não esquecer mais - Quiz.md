# 8.10 - Para não esquecer mais | Quiz

> Seção 8 - Protegendo APIs: Segurança em Node.js · Lição 10 de 12

Vamos revisar os principais conceitos abordados, para consolidar o aprendizado e manter as boas práticas sempre em mente.

## Rate Limiting e Throttling

Essas técnicas controlam o tráfego de requisições à API, evitando abusos e sobrecarga no servidor.

-   **Rate Limiting**: Limita o número de requisições que um cliente pode fazer em um período.
-   **Throttling**: Reduz a velocidade das requisições após atingir um limite.

**Exemplo**: Usamos `express-rate-limit` e `express-slow-down` para proteger a aplicação contra ataques que possam sobrecarregar o servidor.

## Proteção contra SQL Injection

A SQL Injection é uma das vulnerabilidades mais comuns em aplicações que interagem com bancos de dados.

-   **Solução**: Utilizamos *Prepared Statements* para evitar que entradas maliciosas sejam interpretadas como comandos SQL.

**Exemplo**: No código, usamos `conn.execute('SELECT * FROM users WHERE email = ?', [email])` para separar dados da lógica SQL.

## Cabeçalhos de Segurança com Helmet

O Helmet protege a aplicação configurando cabeçalhos HTTP de forma segura.

**Exemplo**: Configuramos `app.use(helmet())` para habilitar proteções essenciais com uma única linha de código.

## Compressão com Compression

Reduz o tamanho das respostas HTTP, otimizando a performance e o consumo de largura de banda.

Exemplo: Usamos `app.use(compression())` para aplicar compressão Gzip às respostas da API.

## Logs de Requisição com Morgan

O Morgan registra logs detalhados das requisições HTTP, ajudando a monitorar e depurar a aplicação.

Exemplo: Configuramos `app.use(morgan('dev'))` para registrar logs detalhados no console durante o desenvolvimento.

## Controle do Tamanho do Corpo das Requisições

Limitar o tamanho do corpo das requisições evita sobrecargas e ataques de negação de serviço.

Exemplo: Configuramos `app.use(express.json({ limit: '1mb' }))` para rejeitar requisições com corpos maiores que 1 MB.

## Política de Origem com CORS

O CORS controla quais origens podem acessar os recursos da API.

Exemplo: Configuramos `app.use(cors({ origin: ['https://meu-site.com'] }))` para permitir acessos apenas de origens específicas.

## Documentação com Swagger

O Swagger cria uma documentação interativa, facilitando a exploração e o teste dos endpoints.

Exemplo: Configuramos o `swagger-ui-express` e criamos um arquivo `swagger.json` para documentar os endpoints da Cookmaster API.

**🏅 Agora é hora é praticar! Siga para o quiz e valide o seu conhecimento sobre segurança em Node.js.**

## Quiz

### Questão 1

Leia as afirmações abaixo sobre o uso de Rate Limiting e Throttling em uma API:

I - O `Rate Limiting` é uma técnica que define um limite máximo de requisições que podem ser feitas por um cliente em um intervalo de tempo.

II - O `Throttling` desacelera as requisições após o limite ser atingido, mas não bloqueia completamente o cliente.

III - O `Rate Limiting` é uma funcionalidade padrão do `Express.js`, não sendo necessário usar bibliotecas externas.

Quais dessas afirmativas estão corretas?

- **A)** I, III.
- **B)** I, II.
- **C)** II, III.
- **D)** I, II, III.
- **E)** Apenas III.

### Questão 2

Leia as afirmações abaixo sobre SQL Injection e formas de prevenção:

I - A `SQL Injection` ocorre quando entradas do usuário são concatenadas diretamente em comandos SQL, permitindo a execução de comandos maliciosos.

II - Prepared Statements são técnicas não recomendadas para prevenir `SQL Injection`, pois separam os dados da lógica SQL.

III - A `SQL Injection` só é possível em bancos de dados SQL e podem afetar outras partes do sistema.

Quais dessas afirmativas estão corretas?

- **A)** I, III.
- **B)** I, II.
- **C)** II, III.
- **D)** I, II, III.
- **E)** Apenas III.

### Questão 3

Leia as afirmações abaixo sobre o uso do middleware Helmet para proteção de cabeçalhos HTTP:

I - O Helmet adiciona proteções como HSTS e CSP automaticamente para todas as respostas HTTP, sem necessidade de configuração adicional.

II - A funcionalidade Content-Security-Policy (CSP) do Helmet ajuda a prevenir ataques de XSS, controlando as fontes de conteúdo que podem ser carregadas pelo navegador.

III - O Helmet impede totalmente a possibilidade de ataques de injeção de código, protegendo contra todas as vulnerabilidades existentes.

Quais dessas afirmativas estão corretas?

- **A)** I, III.
- **B)** I, II.
- **C)** Apenas III.
- **D)** Apenas II.
- **E)** Todas as afirmativas estão corretas.

### Questão 4

Qual das opções a seguir descreve corretamente a funcionalidade de compressão de respostas HTTP com o middleware Compression?

- **A)** A compressão aumenta o tamanho das respostas HTTP para facilitar a leitura pelo navegador.
- **B)** A compressão funciona apenas para arquivos estáticos e não pode ser aplicada a respostas dinâmicas.
- **C)** A compressão elimina a necessidade de configurar o cabeçalho `Content-Encoding`.
- **D)** A compressão reduz o tamanho das respostas HTTP, melhorando o tempo de carregamento.
- **E)** A compressão é configurada automaticamente pelo `Express.js` e não precisa de um middleware específico.

### Questão 5

Qual das opções a seguir descreve corretamente o uso do middleware Morgan para monitorar logs de requisições HTTP em uma API?

- **A)** O Morgan impede a exibição de status de erro no log para proteger informações confidenciais.
- **B)** O Morgan funciona apenas no ambiente de produção e não pode ser usado em desenvolvimento.
- **C)** O Morgan permite registrar logs detalhados de cada requisição HTTP, ajudando a monitorar a aplicação.
- **D)** O Morgan registra apenas logs de requisições bem-sucedidas, ignorando erros.
- **E)** O Morgan substitui a necessidade de ferramentas externas de monitoramento.

### Questão 6

Qual das opções descreve corretamente a funcionalidade de limitar o tamanho do corpo das requisições HTTP em uma API Express?

- **A)** Limitar o corpo da requisição impede qualquer tipo de payload maior que o limite, independentemente de seu conteúdo ou origem, sem permitir exceções ou configurações adicionais.
- **B)** O limite do corpo da requisição evita que a aplicação processe dados muito grandes, protegendo contra sobrecarga do servidor e ataques como DoS.
- **C)** O limite é aplicado apenas para requisições POST, ignorando métodos como PUT e PATCH.
- **D)** Configurar o limite do corpo remove automaticamente a necessidade de validação manual dos dados enviados.
- **E)** Limitar o corpo da requisição aumenta o uso de memória no servidor, pois exige buffer adicional para processar os dados antes de rejeitá-los.

### Questão 7

Qual das opções descreve corretamente a funcionalidade do middleware CORS em uma API?

- **A)** O middleware CORS protege contra ataques de XSS (Cross-Site Scripting), impedindo que scripts maliciosos sejam executados no navegador do cliente.
- **B)** O middleware CORS valida todas as requisições feitas à API e bloqueia automaticamente aquelas consideradas suspeitas, independentemente de sua origem.
- **C)** O middleware CORS é ativado automaticamente em APIs Express e não precisa de nenhuma configuração adicional para funcionar corretamente.
- **D)** O middleware CORS controla quais origens podem acessar os recursos da API, configurando permissões específicas para garantir segurança em requisições de diferentes domínios.
- **E)** O middleware CORS só é útil em servidores de produção e deve ser desativado no ambiente de desenvolvimento.

### Questão 8

Leia as afirmações abaixo sobre a criação de documentações interativas com Swagger:

I - O Swagger permite testar endpoints diretamente da documentação gerada, fornecendo uma interface interativa que simula requisições HTTP.

II - É necessário configurar manualmente o esquema de segurança no Swagger para rotas que exigem autenticação, como as que utilizam Bearer Tokens.

III - O Swagger gera automaticamente a documentação da API com base nas rotas existentes no arquivo app.js, sem a necessidade de arquivos JSON ou YAML adicionais.

Quais dessas afirmativas estão corretas?

- **A)** I, II.
- **B)** I, III.
- **C)** II, III.
- **D)** Apenas III.
- **E)** Todas as afirmativas estão corretas.

<details><summary>Gabarito</summary>

**1.** B

Apenas a afirmativa III está incorreta, pois o Express.js não possui Rate Limiting nativo, sendo necessário utilizar bibliotecas como express-rate-limit. Sendo assim, as afirmativas I e II são corretas.

Com isso, resposta correta a alternativa B.

**2.** A

**3.** D

**4.** D

**5.** C

**6.** B

**7.** D

**8.** A

</details>
