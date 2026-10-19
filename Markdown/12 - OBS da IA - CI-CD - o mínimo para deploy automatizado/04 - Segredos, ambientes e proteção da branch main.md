# IA.4 - Segredos, ambientes e proteção da branch main

> [OBS da IA] - CI/CD: o mínimo para deploy automatizado · Lição 4 de 7

> **Conteúdo escrito pela IA** (GitHub Copilot) como complemento ao curso. Não faz parte do material original da Trybe. Versões de ferramentas e telas citadas refletem out/2026: confira a documentação oficial antes de usar em produção.

Um pipeline que faz deploy precisa de credenciais: token do Railway, senha do banco, usuário técnico do BTP. Esta lição mostra onde guardá-las, como evitar vazamentos e como impedir que código não testado chegue à `main`.

## Secrets e Variables

No repositório: **Settings → Secrets and variables → Actions**. Existem dois tipos:

|  | Secrets | Variables |
| --- | --- | --- |
| Para quê | Senhas, tokens, chaves | Configuração não sensível (URL de API, nome da org/space, região) |
| Uso no YAML | `${{ secrets.RAILWAY_TOKEN }}` | `${{ vars.CF_API }}` |
| Pode ser lido depois de salvo? | Não. Só pode ser sobrescrito. | Sim |
| Aparece no log? | Não. É mascarado como `***`. | Sim |

Passe segredos para os comandos via `env`, não colados direto no script:

```yaml
      - name: Deploy
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: npx --yes @railway/cli up --service cookmaster-backend --detach
```

### Regras de ouro

-   **Nunca** faça commit de segredo (nem "só para testar"). Se aconteceu, considere-o vazado: **revogue e gere outro**. Apagar o commit não basta, porque o histórico e os forks continuam com ele.
-   Não imprima segredos (`echo $TOKEN`), nem transformados (base64, substring). A máscara só reconhece o valor exato.
-   Workflows disparados por pull request vindo de **fork** não recebem os segredos. Isso é proposital: não tente contornar.
-   Use um token/usuário **dedicado ao pipeline**, com a menor permissão possível, nunca a sua conta pessoal. Assim dá para revogá-lo sem afetar ninguém.
-   Para nuvens que suportam **OIDC** (AWS, Azure, GCP), prefira-o a segredos fixos: o GitHub troca uma identidade temporária por uma credencial de curta duração, e não há senha para vazar.

## Environments: homologação e produção

Em **Settings → Environments** você cria ambientes como `staging` e `production`. Cada um pode ter:

-   **Segredos e variáveis próprios.** O mesmo nome (`CF_SPACE`, `RAILWAY_TOKEN`) com valor diferente por ambiente.
-   **Required reviewers.** O job só roda depois que alguém aprova. É a diferença entre Continuous *Delivery* e Continuous *Deployment*.
-   **Deployment branches.** Só a `main` (ou só tags) pode fazer deploy em produção.

```yaml
  deploy:
    needs: test
    runs-on: ubuntu-latest
    environment: production   # usa os segredos e as regras desse ambiente
    steps:
      - ...
```

Em repositórios privados de contas gratuitas, algumas regras de proteção (como required reviewers) podem não estar disponíveis. Os segredos por ambiente funcionam do mesmo jeito.

## Proteja a branch main

De nada adianta a CI ficar vermelha se ainda for possível fazer merge. Em **Settings → Rules → Rulesets** (ou *Branches → Branch protection rules*), crie uma regra para a `main` com:

-   **Require a pull request before merging** — ninguém faz push direto na `main`.
-   **Require status checks to pass** — selecione o job `test` do workflow da lição IA.3. Com o ✗ vermelho, o botão de merge fica bloqueado.
-   **Block force pushes** — protege o histórico.

O fluxo do dia a dia passa a ser:

1.  Criar uma branch → commitar → abrir um pull request.
2.  A CI roda no PR. Se falhar, corrigir e dar push de novo.
3.  Revisão de código → merge na `main`.
4.  O push na `main` dispara a CI de novo e, se passar, o deploy (lição IA.5).

## Dependências e actions atualizadas (Dependabot)

Crie `.github/dependabot.yml` para receber pull requests automáticos de atualização das dependências npm e das actions. Cada PR passa pela CI antes de você aceitar:

```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
```

Se quiser, adicione também um passo `npm audit --audit-level=high` na CI para barrar dependências com vulnerabilidade conhecida grave.

Para segurança máxima, há quem fixe as actions pelo **SHA do commit** (`uses: actions/checkout@<sha>`) em vez da tag, porque uma tag pode ser movida. O Dependabot também atualiza esse formato.
