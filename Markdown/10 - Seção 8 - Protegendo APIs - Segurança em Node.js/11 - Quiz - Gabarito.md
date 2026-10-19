# 8.11 - Quiz | Gabarito

> Seção 8 - Protegendo APIs: Segurança em Node.js · Lição 11 de 12

****Questão 1**.** Leia as afirmações abaixo sobre o uso de Rate Limiting e Throttling em uma API:

I - O \`Rate Limiting\` é uma técnica que define um limite máximo de requisições que podem ser feitas por um cliente em um intervalo de tempo.  
II - O \`Throttling\` desacelera as requisições após o limite ser atingido, mas não bloqueia completamente o cliente.  
III - O \`Rate Limiting\` é uma funcionalidade padrão do \`Express.js\`, não sendo necessário usar bibliotecas externas.  

Quais dessas afirmativas estão corretas?

a) I, III.  
b) I, II.  
c) II, III.  
d) I, II, III.  
e) Apenas III.  

**Justificativa:**

I. Correta.  
II. Correta  
III. Incorreta, pois o Express.js não possui Rate Limiting nativo, sendo necessário utilizar bibliotecas como express-rate-limit. Sendo assim, as afirmativas I e II são corretas.  
  
Com isso, resposta correta a **alternativa B**.

****Questão 2.**** Leia as afirmações abaixo sobre SQL Injection e formas de prevenção:

I - A \`SQL Injection\` ocorre quando entradas do usuário são concatenadas diretamente em comandos SQL, permitindo a execução de comandos maliciosos.  
II - *Prepared Statements* são técnicas não recomendadas para prevenir \`SQL Injection\`, pois separam os dados da lógica SQL.  
III - A \`SQL Injection\` só é possível em bancos de dados SQL e podem afetar outras partes do sistema

Quais dessas afirmativas estão corretas?

a) I, III.  
b) I, II.  
c) II, III.  
d) I, II, III.  
e) Apenas III.

**Justificativa:**

I. Correta  
II. Incorreta, pois *Prepared Statements* é um técnica recomendada contra SQL Injection.  
III. Correta  
  
Portanto, **alternativa A.**

****Questão 3.**** Leia as afirmações abaixo sobre o uso do middleware Helmet para proteção de cabeçalhos HTTP:

I - O Helmet adiciona proteções como HSTS e CSP automaticamente para todas as respostas HTTP, sem necessidade de configuração adicional.  
II - A funcionalidade Content-Security-Policy (CSP) do Helmet ajuda a prevenir ataques de XSS, controlando as fontes de conteúdo que podem ser carregadas pelo navegador.  
III - O Helmet impede totalmente a possibilidade de ataques de injeção de código, protegendo contra todas as vulnerabilidades existentes.

Quais dessas afirmativas estão corretas?

a) I, III.  
b) I, II.  
c) Apenas III.  
d) Apenas II.  
e) Todas as afirmativas estão corretas.

**Justificativa:**

I. Parcialmente verdadeira, pois algumas proteções, como CSP, exigem configuração adicional.  
II. Correta  
III Incorreta, pois o Helmet não impede todas as vulnerabilidades; ele reduz riscos específicos. Além disso, a afirmativa I é parcialmente verdadeira, mas algumas proteções, como CSP, exigem configuração adicional.  
  
Sendo assim, apenas a II está correta. **Alternativa D.**

****Questão 4.**** Qual das opções a seguir descreve corretamente a funcionalidade de compressão de respostas HTTP com o middleware Compression?

a) A compressão aumenta o tamanho das respostas HTTP para facilitar a leitura pelo navegador.  
**Alternativa incorreta**. A compressão reduz, e não aumenta, o tamanho das respostas.  
b) A compressão funciona apenas para arquivos estáticos e não pode ser aplicada a respostas dinâmicas.  
**Alternativa incorreta.** A compressão pode ser aplicada a qualquer resposta HTTP, seja estática ou dinâmica.  
c) A compressão elimina a necessidade de configurar o cabeçalho \`Content-Encoding\`.  
**Alternativa incorreta.** O cabeçalho \`Content-Encoding\` é essencial para informar ao cliente o tipo de compressão usado, como Gzip ou Brotli.  
d) A compressão reduz o tamanho das respostas HTTP, melhorando o tempo de carregamento.  
**Alternativa correta.** Essa é a principal função do middleware Compression.  
e) A compressão é configurada automaticamente pelo \`Express.js\` e não precisa de um middleware específico.  
**Alternativa incorreta.** É necessário usar middlewares como Compression para habilitar a compressão.

****Questão 5.**** Qual das opções a seguir descreve corretamente o uso do middleware Morgan para monitorar logs de requisições HTTP em uma API?

a) O Morgan impede a exibição de status de erro no log para proteger informações confidenciais.  
**Alternativa incorreta.** O Morgan exibe status de erro, mas não oculta informações por padrão.  
b) O Morgan funciona apenas no ambiente de produção e não pode ser usado em desenvolvimento.  
**Alternativa incorreta.** O Morgan pode ser configurado para qualquer ambiente, inclusive desenvolvimento.  
c) O Morgan permite registrar logs detalhados de cada requisição HTTP, ajudando a monitorar a aplicação.  
**Alternativa correta.** Essa é a principal função do Morgan.  
d) O Morgan registra apenas logs de requisições bem-sucedidas, ignorando erros.  
**Alternativa incorreta.** O Morgan registra todos os logs, incluindo os de erros.  
e) O Morgan substitui a necessidade de ferramentas externas de monitoramento.  
**Alternativa incorreta.** O Morgan não substitui ferramentas avançadas de monitoramento; ele complementa o processo de logging básico.

****Questão 6.**** Qual das opções descreve corretamente a funcionalidade de limitar o tamanho do corpo das requisições HTTP em uma API Express?

a) Limitar o corpo da requisição impede qualquer tipo de payload maior que o limite, independentemente de seu conteúdo ou origem, sem permitir exceções ou configurações adicionais.**  
Alternativa incorreta.** Embora o limite restrinja requisições grandes, ele pode ser configurado para permitir exceções ou diferentes tamanhos dependendo da rota.  
b) O limite do corpo da requisição evita que a aplicação processe dados muito grandes, protegendo contra sobrecarga do servidor e ataques como DoS.**  
Alternativa correta.** Essa é a principal função dessa configuração.  
c) O limite é aplicado apenas para requisições POST, ignorando métodos como PUT e PATCH.**  
Alternativa incorreta.** O limite se aplica a qualquer método HTTP que envie payloads no corpo da requisição.  
d) Configurar o limite do corpo remove automaticamente a necessidade de validação manual dos dados enviados.**  
Alternativa incorreta.** Embora o limite evite payloads muito grandes, validações específicas ainda são necessárias para garantir que os dados estejam no formato esperado.  
e) Limitar o corpo da requisição aumenta o uso de memória no servidor, pois exige buffer adicional para processar os dados antes de rejeitá-los.**  
Alternativa incorreta.** O limite impede que grandes payloads sejam aceitos, economizando memória e processamento.  

****Questão 7.**** Qual das opções descreve corretamente a funcionalidade do middleware CORS em uma API?

a) O middleware CORS protege contra ataques de XSS (Cross-Site Scripting), impedindo que scripts maliciosos sejam executados no navegador do cliente.**  
Alternativa incorreta.** O CORS não protege contra XSS, mas sim controla quais origens podem acessar os recursos da API.  
b) O middleware CORS valida todas as requisições feitas à API e bloqueia automaticamente aquelas consideradas suspeitas, independentemente de sua origem.**  
Alternativa incorreta.** O CORS não valida o conteúdo ou objetivo das requisições, apenas controla acessos com base nas configurações de origem.  
c) O middleware CORS é ativado automaticamente em APIs Express e não precisa de nenhuma configuração adicional para funcionar corretamente.**  
Alternativa incorreta.** O CORS precisa ser configurado manualmente, com opções como origin, methods e credentials.  
d) O middleware CORS controla quais origens podem acessar os recursos da API, configurando permissões específicas para garantir segurança em requisições de diferentes domínios.**  
Alternativa correta.** Essa é a principal função do CORS.  
e) O middleware CORS só é útil em servidores de produção e deve ser desativado no ambiente de desenvolvimento.**  
Alternativa incorreta.** O CORS é útil em qualquer ambiente, especialmente se múltiplos front-ends consomem a API.  

****Questão 8.**** Leia as afirmações abaixo sobre a criação de documentações interativas com Swagger:

I - O Swagger permite testar endpoints diretamente da documentação gerada, fornecendo uma interface interativa que simula requisições HTTP.  
II - É necessário configurar manualmente o esquema de segurança no Swagger para rotas que exigem autenticação, como as que utilizam Bearer Tokens.  
III - O Swagger gera automaticamente a documentação da API com base nas rotas existentes no arquivo app.js, sem a necessidade de arquivos JSON ou YAML adicionais.

Quais dessas afirmativas estão corretas?

a) I, II.  
b) I, III.  
c) II, III.  
d) Apenas III.  
e) I, II, III.

**Justificativa:**

I. **Correta**. Descreve a funcionalidade interativa do Swagger.  
II. **Correta**. Destaca a necessidade de configurar esquemas de autenticação manualmente.  
III. **Incorreta**. Pois o Swagger não gera automaticamente a documentação a partir do código; ela deve ser configurada manualmente ou com ferramentas adicionais.

Portanto, apenas I e II estão corretas. **Alternativa A**
