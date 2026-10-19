# IA.5 - Deploy contínuo da API Cookmaster

> [OBS da IA] - CI/CD: o mínimo para deploy automatizado · Lição 5 de 7

> **Conteúdo escrito pela IA** (GitHub Copilot) como complemento ao curso. Não faz parte do material original da Trybe. Versões de ferramentas e telas citadas refletem out/2026: confira a documentação oficial antes de usar em produção.

Com a CI funcionando (IA.3) e a `main` protegida (IA.4), falta a última peça: **só fazer deploy quando a CI passar**. Para a API Cookmaster no Railway há dois caminhos. Escolha **um**.

## Opção 1 (recomendada): Railway com "Wait for CI"

Mantém o deploy automático que você configurou na [lição 9.7](../11%20-%20Se%C3%A7%C3%A3o%209%20-%20Automatiza%C3%A7%C3%A3o%20e%20Deploy%20de%20Aplica%C3%A7%C3%B5es/07%20-%20Deploy%20da%20aplica%C3%A7%C3%A3o%20no%20Railway.md), mas o Railway passa a **esperar o GitHub Actions** terminar antes de publicar.

1.  Garanta que o workflow tem o gatilho de push na branch de deploy. O `ci.yml` da lição IA.3 já tem:
    
    ```yaml
    on:
      push:
        branches: [main]
    ```
    
2.  No Railway, abra o serviço `cookmaster-backend` → **Settings** → seção de deploy a partir do GitHub → ligue **Wait for CI**.  
    Se a opção não aparecer, aceite as permissões atualizadas do app do Railway no GitHub (*GitHub → Settings → Applications*).
3.  Faça um push na `main`. O deploy fica em estado **WAITING** enquanto os workflows rodam:
    -   workflow **falhou** → o deploy é **pulado** e a produção continua com a versão anterior;
    -   todos passaram → o deploy segue normalmente.

Vantagem: nenhuma credencial do Railway fica no GitHub. O Railway continua fazendo o build (pelo Dockerfile) e o deploy.

## Opção 2: o GitHub Actions faz o deploy

Útil quando você quer o controle no pipeline: aprovação manual via environment, deploy só por tag, vários serviços na ordem certa. Desligue o autodeploy no Railway (**Settings → Disable**) e acrescente um segundo job ao `ci.yml`:

```yaml
  deploy:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    concurrency:
      group: deploy-production
      cancel-in-progress: false
    steps:
      - uses: actions/checkout@v5

      - name: Deploy no Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: npx --yes @railway/cli up --service cookmaster-backend --detach
```

-   `needs: test` — o deploy só começa se o job `test` passou.
-   `if: ...` — pull requests rodam só os testes. Deploy só em push na `main`.
-   `environment: production` — usa o segredo `RAILWAY_TOKEN` desse ambiente e respeita as aprovações configuradas (lição IA.4).
-   `concurrency` com `cancel-in-progress: false` — dois deploys nunca rodam ao mesmo tempo e um deploy em andamento não é cancelado no meio.
-   `RAILWAY_TOKEN` é um **project token** criado nas configurações do projeto no Railway, com escopo só daquele projeto/ambiente. As opções da CLI podem mudar, então confira com `railway up --help` e na documentação do Railway.

## E o banco de dados?

Na [lição 9.7](../11%20-%20Se%C3%A7%C3%A3o%209%20-%20Automatiza%C3%A7%C3%A3o%20e%20Deploy%20de%20Aplica%C3%A7%C3%B5es/07%20-%20Deploy%20da%20aplica%C3%A7%C3%A3o%20no%20Railway.md) o banco foi populado **manualmente**. Isso funciona na primeira vez, mas não escala: toda mudança de tabela vira um passo manual que alguém esquece.

-   O caminho profissional são **migrations**: arquivos versionados no Git, cada um com uma alteração de schema, aplicados em ordem por uma ferramenta (Knex, Prisma Migrate, Sequelize, Flyway, entre outras). O pipeline, ou o próprio start da aplicação, aplica as que faltam.
-   No Railway, isso pode ir no **pre-deploy command** do serviço (ex.: `npm run migrate`): se a migration falhar, a nova versão não entra no ar.
-   Escreva migrations compatíveis com a versão anterior (adicionar coluna é seguro, renomear/remover exige duas etapas). Durante o deploy, as duas versões da aplicação podem conviver por alguns segundos.

## Verificar depois do deploy

-   Crie uma rota simples de saúde, por exemplo `GET /health` respondendo `200`, e configure-a como **healthcheck path** no Railway. A nova versão só recebe tráfego quando responder OK.
-   Um "smoke test" no fim do pipeline também ajuda: `curl --fail https://sua-api.up.railway.app/health`. Se falhar, o job fica vermelho e você é avisado.

## Quando algo dá errado: rollback

-   **Rápido:** no painel do Railway, faça *redeploy* de um deployment anterior que estava saudável.
-   **Definitivo:** `git revert <commit>` → pull request → CI → merge → deploy automático. O histórico fica limpo e o pipeline valida a correção.
-   Evite corrigir direto no servidor: a próxima execução do pipeline apaga a correção.

## Visão geral do fluxo

1.  Pull request aberto → **CI** (lint, testes, build da imagem).
2.  CI verde + revisão → merge na `main`.
3.  Push na `main` → CI de novo → **CD** (Railway com Wait for CI *ou* job `deploy`).
4.  Healthcheck/smoke test confirma a nova versão. Se falhar, rollback.
