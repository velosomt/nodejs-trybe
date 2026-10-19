# IA.6 - CI/CD para SAP CAP no BTP

> [OBS da IA] - CI/CD: o mínimo para deploy automatizado · Lição 6 de 7

> **Conteúdo escrito pela IA** (GitHub Copilot) como complemento ao curso. Não faz parte do material original da Trybe. Versões de ferramentas e telas citadas refletem out/2026: confira a documentação oficial antes de usar em produção.

Tudo o que você viu nesta seção vale para um projeto SAP CAP. Mudam o **artefato** (um arquivo `.mtar` no lugar de uma imagem Docker), o **destino** (SAP BTP no lugar do Railway) e algumas ferramentas.

## Do curso para o CAP: o que muda

| Na API Cookmaster | No CAP (Cloud Foundry) |
| --- | --- |
| `npm ci` + `npm test` (Jest) | Igual. Testes com Jest ou `node --test` usando `cds.test`. |
| `Dockerfile` | `mta.yaml` (gerado com `cds add mta`), que descreve os módulos e os serviços do BTP |
| `docker build` | `mbt build`, que roda o `cds build --production` e gera o `.mtar` |
| Railway faz o deploy | `cf deploy arquivo.mtar` (plugin MultiApps da cf CLI) |
| Variáveis do MySQL no painel do Railway | Service bindings (HANA Cloud, XSUAA/IAS, destination), criados e vinculados pelo próprio deploy do MTA |
| Migrations do banco | O módulo `db-deployer` do MTA aplica o schema CDS no HANA a cada deploy |
| `RAILWAY_TOKEN` | Usuário técnico do BTP (usuário + senha) com permissão de *Space Developer* |

No Kyma (Kubernetes), o empacotamento é feito com `cds add helm` + imagens de container, e a credencial é um `kubeconfig` de um usuário técnico.

## Opção A: GitHub Actions gerado pelo CAP

O `cds-dk` gera os workflows prontos:

```bash
cds add github-actions   # atalho: cds add gha
```

Os workflows gerados fazem deploy em **staging** a cada push na `main` e em **produção** quando você publica uma **Release** no GitHub (ex.: tag `v1.0.0`), usando um environment `Production`. Você só precisa cadastrar em *Settings → Secrets and variables → Actions*:

| Tipo | Nome | Exemplo |
| --- | --- | --- |
| Variable | `CF_API` | `https://api.cf.us10-001.hana.ondemand.com` |
| Variable | `CF_USERNAME` | e-mail do usuário técnico |
| Variable | `CF_ORG` / `CF_SPACE` | org e space de destino |
| Secret | `CF_PASSWORD` | senha do usuário técnico |
| Secret (Kyma) | `KUBE_CONFIG` | kubeconfig em base64 |

No environment `Production`, sobrescreva `CF_ORG`/`CF_SPACE` para apontar para o subaccount de produção. É o mesmo conceito de environments da lição IA.4.

### O que esse workflow faz por baixo (versão simplificada)

Para você entender e conseguir ajustar, este é o essencial de um deploy CAP → Cloud Foundry:

```yaml
name: Deploy CAP

on:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm i -g @sap/cds-dk mbt

      - name: Build do MTA
        run: mbt build -t gen --mtar app.mtar

      - name: Instalar cf CLI e plugin MultiApps
        run: |
          curl -sL "https://packages.cloudfoundry.org/stable?release=linux64-binary&version=v8&source=github" | sudo tar -zx -C /usr/local/bin
          cf install-plugin multiapps -f

      - name: Deploy no Cloud Foundry
        env:
          CF_API: ${{ vars.CF_API }}
          CF_ORG: ${{ vars.CF_ORG }}
          CF_SPACE: ${{ vars.CF_SPACE }}
          CF_USERNAME: ${{ vars.CF_USERNAME }}
          CF_PASSWORD: ${{ secrets.CF_PASSWORD }}
        run: |
          cf api "$CF_API"
          cf auth
          cf target -o "$CF_ORG" -s "$CF_SPACE"
          cf deploy gen/app.mtar -f
```

-   `cf auth` sem argumentos lê `CF_USERNAME` e `CF_PASSWORD` do ambiente. A senha não aparece na linha de comando nem no log.
-   `mbt build` lê o `mta.yaml`, roda os builds de cada módulo (incluindo `cds build --production`) e gera `gen/app.mtar`.
-   `cf deploy` cria/atualiza as instâncias de serviço declaradas no `mta.yaml`, faz o deploy do schema no HANA (módulo `-db-deployer`) e sobe os apps.
-   Prefira o workflow gerado pelo `cds add gha` e use este exemplo só para entendê-lo. O gerado acompanha as mudanças do CAP.

## Opção B: SAP Continuous Integration and Delivery

Serviço do próprio BTP. Você assina no subaccount e configura o pipeline por uma interface gráfica, sem escrever YAML de runner e sem manter Jenkins.

-   Tem um pipeline **pronto para CAP** (Node.js, Java e projetos MTA): build, testes, e deploy em Cloud Foundry ou upload para o Cloud Transport Management.
-   Conecta a GitHub, GitLab, Bitbucket ou Azure Repos e é disparado por webhook a cada push.
-   As credenciais (usuário técnico, token do Git) ficam guardadas no próprio serviço.
-   Bom ponto de partida em projetos de cliente SAP, onde o código costuma ficar em repositórios corporativos e o time prefere ferramentas suportadas pela SAP.

## Opção C: Project Piper

Biblioteca open source da SAP com "steps" prontos (build MTA, deploy CF, testes, scans), usada em Jenkins, GitHub Actions ou Azure DevOps. Dá mais flexibilidade que o serviço gerenciado, em troca de mais configuração. É comum em clientes grandes.

## Promovendo entre ambientes: Cloud Transport Management

Em projetos SAP é comum ter subaccounts de **DEV → QAS → PRD**. Em vez de rodar o build três vezes, o pipeline gera **um** `.mtar`, faz deploy em DEV e o envia ao **SAP Cloud Transport Management service**. De lá, o mesmo artefato é *importado* em QAS e PRD, com aprovação e histórico. É o equivalente, no BTP, a "build once, deploy many".

## Cuidados específicos do BTP

-   **Usuário técnico:** crie um usuário só para o pipeline, sem MFA (o pipeline não consegue digitar código de autenticação), com o papel *Space Developer* apenas nos spaces necessários. O recomendado é que ele venha de um Identity Authentication (IAS) próprio. Nesse caso, use `cf auth --origin <origin-key>`.
-   **Não coloque credenciais no `mta.yaml` ou em `.cdsrc.json`/`package.json`:** elas chegam pelos service bindings. Valores por ambiente que precisam ir no deploy vão em arquivos de extensão `.mtaext`, mantidos fora do Git ou gerados no pipeline a partir de segredos.
-   **Testes sem HANA:** por padrão o `cds.test` usa SQLite em memória. Os testes rodam no runner sem banco externo, como os mocks da Seção 4.
-   **Versão do Node:** a mesma no `.nvmrc`, no `engines` do `package.json` (o buildpack Node.js do Cloud Foundry respeita o `engines`) e no workflow.
