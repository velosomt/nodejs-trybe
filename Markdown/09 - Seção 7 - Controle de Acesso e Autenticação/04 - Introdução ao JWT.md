# 7.4 - Introdução ao JWT

> Seção 7 - Controle de Acesso e Autenticação · Lição 4 de 12

À medida que construímos aplicações mais robustas, surge a necessidade de autenticar usuários de forma segura e eficiente. É aqui que entra o **JWT (JSON Web Token)**, uma solução amplamente utilizada para autenticação em APIs e aplicações web.

O JWT funciona como um token que carrega informações sobre o usuário e suas permissões. Após a autenticação, o servidor emite um token assinado digitalmente, garantindo que seus dados não sejam alterados. Esse token pode ser armazenado pelo cliente e enviado em todas as requisições subsequentes, permitindo que o servidor valide a identidade do usuário sem precisar consultar o banco de dados a cada solicitação.

Além de simplificar a autenticação, o JWT também é extremamente flexível. Ele permite armazenar tanto informações essenciais para o sistema quanto dados complementares, como permissões específicas ou metadados.

De maneira geral, o JWT é uma ferramenta poderosa que combina segurança, flexibilidade e eficiência para proteger os recursos de uma aplicação e melhorar a experiência do usuário.

## Entendendo a estrutura do JWT

De maneira geral, o `JWT` é um `JSON` codificado que contém chaves `Header`, `Payload` e `Signature`.

> **Anota aí 🖊:** Um token nada mais é do que uma chave ou uma assinatura digital. O token `JWT`, especificamente, é uma string composta por três partes sequenciais: `Header`, `Payload` e `Signature`.

Esses três componentes são separados por pontos de maneira sequencial, como por exemplo: `hhhhh.ppppp.sssss`.

Nesse exemplo, os caracteres `h` representam o ***Header***, os caracteres `p` correspondem ao ***Payload*** e os caracteres `s` ao ***Signature***.

Agora, vamos explorar cada uma dessas partes em detalhe.

### Header

Como o próprio nome sugere, o `Header` se refere ao cabeçalho de um `JWT`, composto por dois campos. Primeiramente, o campo `alg`, que indica o algoritmo utilizado para a codificação dele, e `typ`, que o identifica como um token `JWT`. Dessa forma, esses dois campos em conjunto formam a primeira chave presente no token.

Exemplo do JSON formado de um cabeçalho JWT:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Esse `JSON` contém as informações de cabeçalho do token, onde é codificado em `Base64`.

O `JSON` exemplificado para o `Header` transformado em `Base64` forma a seguinte sequência de caracteres: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`.

Dessa forma, esse sequencial de caracteres forma a primeira parte do JWT: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ppppp.sssss`.

### Payload

A segunda parte de um `JWT` consiste no componente `Payload`, que se refere aos dados que são relevantes para a aplicação de quem o usa. Essa parte do token contém o que chamamos de `claims`.

> **Anota aí 🖊:** `Claims` são declarações sobre uma entidade, como, por exemplo, informações sobre a pessoa usuária.

São declarações de segurança de possível verificação, possuindo um formato `JSON` e, no momento de formação do Token, são encriptadas para `Base64`.

Payload `JSON` de Exemplo:

```json
{
  "email": "mayara@betrybe.com",
  "name": "Mayara Marcela"
}
```

Encriptado em `Base64`:

`eyJlbWFpbCI6Im1heWFyYUBiZXRyeWJlLmNvbSIsIm5hbWUiOiJNYXlhcmEgTWFyY2VsYSJ9`.

Dessa forma, esse sequencial de caracteres forma a segunda parte do JWT: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1heWFyYUBiZXRyeWJlLmNvbSIsIm5hbWUiOiJNYXlhcmEgTWFyY2VsYSJ9.sssss`.

### Signature

O último elemento do `JWT`, a `Signature`, ou Assinatura, é um componente único e tem como principal objetivo aumentar a segurança do Token, garantindo que a informação não foi alterada ao longo do trajeto. Por consequência, certifica uma maior confiabilidade ao Token gerado.

A formação desse componente é uma codificação do `Header` e do `Payload` em conjunto com uma `palavra-chave`.

> **Anota aí 🖊:** A `palavra-chave` garante uma maior segurança na formação do último elemento e, por consequência, no Token como um todo. A escolha dessa palavra-chave fica a critério de quem está criando a estrutura JWT no projeto.

Supondo que a palavra-chave de nossa aplicação fica guardada em uma constante chamada `secret` entre sete chaves, a estrutura da Assinatura ficaria a seguinte:

```json
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

O resultado dessa codificação única é a seguinte sequência de caracteres: `-JNlIH951NG31kf7F4xt_k4nbWcX9jsNR97D6SyvRSM`.

Dessa forma, esse sequencial de caracteres forma a terceira e última parte do JWT, resultando no seguinte Token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1heWFyYUBiZXRyeWJlLmNvbSIsIm5hbWUiOiJNYXlhcmEgTWFyY2VsYSJ9.JNlIH951NG31kf7F4xt_k4nbWcX9jsNR97D6SyvRSM`.

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   No BTP os JWTs são emitidos pelo XSUAA/IAS e validados pelo CAP (biblioteca `@sap/xssec`). A estrutura header/payload/signature explicada aqui é exatamente o que você vai ver ao inspecionar esses tokens.

</details>
