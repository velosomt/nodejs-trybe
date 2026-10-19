# IA.7 - Para não esquecer mais + exercício + quiz

> [OBS da IA] - CI/CD: o mínimo para deploy automatizado · Lição 7 de 7

> **Conteúdo escrito pela IA** (GitHub Copilot) como complemento ao curso. Não faz parte do material original da Trybe. Versões de ferramentas e telas citadas refletem out/2026: confira a documentação oficial antes de usar em produção.

## Para não esquecer mais

-   **CI** = todo push/PR é instalado e testado automaticamente. **Continuous Delivery** = sempre pronto para deploy, com aprovação. **Continuous Deployment** = deploy automático quando tudo passa.
-   O pipeline roda em uma máquina **limpa**: commit do `package-lock.json`, `npm ci`, versão do Node fixada (`.nvmrc`/`engines`) e nada de depender do seu `.env` local.
-   Os **scripts do `package.json`** são o contrato com o pipeline. Código de saída diferente de `0` = pipeline vermelho. Nada de modo watch no `npm test`.
-   No GitHub Actions: **workflow** (arquivo em `.github/workflows/`) → **jobs** (uma máquina cada, em paralelo, ou em sequência com `needs`) → **steps** (`run` ou `uses`).
-   Rode a CI em `pull_request` **e** em `push` na `main`. Proteja a `main` exigindo PR e o status check da CI.
-   Credenciais vão em **Secrets** (`${{ secrets.X }}`), configuração não sensível em **Variables** (`${{ vars.X }}`). Passe segredos via `env`, nunca dê `echo` neles e use um usuário/token dedicado com a menor permissão possível.
-   **Environments** (`staging`, `production`) separam segredos por ambiente e permitem exigir aprovação antes do deploy.
-   Deploy só depois da CI: no Railway, **Wait for CI**; no pipeline, job `deploy` com `needs: test` e `if` restrito à `main`.
-   Mudanças de banco via **migrations** versionadas. Confirme cada deploy com **healthcheck** e tenha um caminho de **rollback**.
-   No **SAP CAP**: `cds add mta` → `mbt build` → `cf deploy`. Para gerar os workflows: `cds add gha` (variáveis `CF_API`, `CF_USERNAME`, `CF_ORG`, `CF_SPACE` e o segredo `CF_PASSWORD`). Alternativas da SAP: **SAP Continuous Integration and Delivery** e **Project Piper**. Para promover entre subaccounts: **Cloud Transport Management**.

## Exercício proposto

Use o repositório da API Cookmaster que você publicou na [lição 9.7](../11%20-%20Se%C3%A7%C3%A3o%209%20-%20Automatiza%C3%A7%C3%A3o%20e%20Deploy%20de%20Aplica%C3%A7%C3%B5es/07%20-%20Deploy%20da%20aplica%C3%A7%C3%A3o%20no%20Railway.md).

1.  Adicione um `.nvmrc` com a versão LTS do Node usada no Dockerfile e confira se `npm ci && npm test` passa em um clone limpo.
2.  Crie `.github/workflows/ci.yml` (lição IA.3) com os gatilhos `push` na `main` e `pull_request`, rodando `npm ci`, `npm test` e `docker build`.
3.  Crie uma ruleset para a `main` exigindo pull request e o status check do job `test`.
4.  Abra um PR que **quebra um teste** de propósito. Confira o ✗ e o bloqueio do merge. Corrija e veja o ✓.
5.  Ligue o **Wait for CI** no serviço do Railway, faça o merge e acompanhe o deploy passar de *WAITING* para ativo.
6.  **Desafio:** adicione a rota `GET /health`, configure-a como healthcheck no Railway e adicione o `.github/dependabot.yml` da lição IA.4.

**Bônus SAP CAP:** em um projeto `cds init` com `cds add sample,mta`, rode `cds add gha`, leia os workflows gerados e identifique onde ficam o build, os testes e o deploy.

## Quiz

### Questão 1

Qual a diferença entre **Continuous Delivery** e **Continuous Deployment**?

- **A)** Nenhuma, são sinônimos.
- **B)** Na Delivery o código aprovado na CI fica pronto para produção, mas o deploy depende de uma aprovação/ação manual. No Deployment ele vai para produção automaticamente.
- **C)** Delivery só existe com Docker. Deployment só existe com Railway.
- **D)** Delivery roda os testes e Deployment não roda testes.

### Questão 2

Por que usar `npm ci` em vez de `npm install` no pipeline?

- **A)** Porque `npm ci` instala as versões mais novas de todos os pacotes.
- **B)** Porque `npm ci` não precisa de internet.
- **C)** Porque `npm ci` instala exatamente o que está no `package-lock.json`, parte de um `node_modules` limpo e falha se o lock estiver desatualizado.
- **D)** Porque `npm install` não funciona no Linux.

### Questão 3

Como o pipeline sabe que os testes falharam?

- **A)** Lendo o texto "FAIL" no log.
- **B)** Pelo código de saída do comando: qualquer valor diferente de `0` faz o step (e o job) falhar.
- **C)** Pelo número de arquivos de teste.
- **D)** O GitHub analisa a cobertura de código e decide.

### Questão 4

Onde deve ficar o token de deploy do Railway (ou a senha do usuário técnico do BTP)?

- **A)** No arquivo `.env` commitado no repositório.
- **B)** Direto no YAML do workflow, já que o repositório é privado.
- **C)** Em uma **Variable** do GitHub, acessada com `vars`.
- **D)** Em um **Secret** do GitHub (de preferência no environment de destino), acessado com `${{ secrets.NOME }}` e passado ao comando via `env`.

### Questão 5

No workflow abaixo, o que garante que o deploy só acontece se os testes passarem?

```yaml
jobs:
  test: ...
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
```

- **A)** O `needs: test`: o job `deploy` só começa depois que o job `test` termina com sucesso.
- **B)** O `if`, que verifica se os testes passaram.
- **C)** A ordem em que os jobs aparecem no arquivo.
- **D)** Nada: jobs sempre rodam em paralelo.

### Questão 6

Na API Cookmaster com autodeploy no Railway, qual a forma mais simples de impedir o deploy quando a CI falha?

- **A)** Apagar o Dockerfile.
- **B)** Ativar a opção **Wait for CI** no serviço do Railway, com um workflow disparado por `push` na `main`.
- **C)** Rodar os testes dentro do `CMD` do Dockerfile.
- **D)** Fazer deploy só às sextas-feiras.

### Questão 7

Em um projeto **SAP CAP** para Cloud Foundry, qual sequência representa build e deploy no pipeline?

- **A)** `docker build` → `docker push` → `railway up`
- **B)** `cds watch` → `git push`
- **C)** `mbt build` (lê o `mta.yaml` e roda o `cds build --production`) → `cf deploy arquivo.mtar`
- **D)** `npm start` → `cf push` com usuário e senha no `mta.yaml`

<details><summary>Gabarito</summary>

**1.** B

As duas partem de uma CI confiável. A diferença é só o último passo: com aprovação humana (Delivery) ou automático (Deployment).

**2.** C

Instalação reprodutível: o pipeline testa exatamente as mesmas versões que você testou localmente e que irão para produção.

**3.** B

Por isso nunca se deve "engolir" o erro com `|| true`: o pipeline ficaria verde com testes quebrados.

**4.** D

Secrets são criptografados, não podem ser lidos depois de salvos e aparecem mascarados no log. Variables são para configuração não sensível.

**5.** A

Sem `needs`, os jobs rodam em paralelo. O `if` só restringe o deploy à branch `main`.

**6.** B

Com Wait for CI, o Railway deixa o deploy em WAITING e o pula se algum workflow do GitHub Actions falhar.

**7.** C

O `mta.yaml` (criado com `cds add mta`) descreve módulos e serviços. O `cf deploy` cria os serviços, faz o deploy do schema no HANA e sobe os apps. O `cds add gha` gera um workflow que faz exatamente isso.

</details>
