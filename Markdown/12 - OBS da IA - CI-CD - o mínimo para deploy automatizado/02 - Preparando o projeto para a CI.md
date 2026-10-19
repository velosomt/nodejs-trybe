# IA.2 - Preparando o projeto para a CI

> [OBS da IA] - CI/CD: o mínimo para deploy automatizado · Lição 2 de 7

> **Conteúdo escrito pela IA** (GitHub Copilot) como complemento ao curso. Não faz parte do material original da Trybe. Versões de ferramentas e telas citadas refletem out/2026: confira a documentação oficial antes de usar em produção.

O servidor de CI é uma máquina **nova e vazia a cada execução**: não tem o seu `node_modules`, nem o seu `.env`, nem o MySQL rodando no seu Docker. Se o projeto só funciona "na minha máquina", o pipeline vai mostrar isso rapidinho. Antes de escrever qualquer YAML, garanta os pontos abaixo.

## 1\. Os scripts do package.json são o contrato com o pipeline

O pipeline não deve saber *como* seus testes rodam, só *qual script* chamar. Padronize:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "lint": "eslint .",
    "test": "jest"
  }
}
```

-   **Código de saída é tudo.** O pipeline só sabe que algo falhou porque o comando termina com código diferente de `0`. Jest e ESLint já fazem isso. Nunca "engula" o erro com `|| true` ou `; exit 0`.
-   **Nada interativo ou infinito no `test`.** Modo watch (`jest --watch`, `nodemon`) prende o pipeline até estourar o tempo limite. Deixe o watch em outro script.
-   O GitHub Actions define a variável `CI=true`. O Jest detecta isso e passa a se comportar como se tivesse recebido `--ci` (por exemplo, não grava snapshots novos).

## 2\. Instalação reprodutível: package-lock.json + npm ci

-   **Faça commit do `package-lock.json`.** Ele fixa as versões exatas de todas as dependências (inclusive as indiretas).
-   No pipeline e no Docker, use `npm ci` no lugar de `npm install`: apaga o `node_modules`, instala exatamente o que está no lock e **falha** se o lock estiver desatualizado em relação ao `package.json`. É mais rápido e evita a surpresa "ontem funcionava".
-   `node_modules` nunca vai para o Git (já está no `.gitignore` que o curso usa).

## 3\. Fixe a versão do Node.js

Teste na mesma versão que roda em produção. Duas formas simples, que podem ser usadas juntas:

```bash
# .nvmrc (na raiz do projeto) — lido pelo nvm e pelo actions/setup-node
22
```

```json
{
  "engines": { "node": ">=22" }
}
```

Lembre que o Node 20 saiu de suporte em 30/04/2026. Use uma versão LTS ativa (22 ou 24), a mesma da imagem do [Dockerfile](../11%20-%20Se%C3%A7%C3%A3o%209%20-%20Automatiza%C3%A7%C3%A3o%20e%20Deploy%20de%20Aplica%C3%A7%C3%B5es/04%20-%20Criando%20um%20Dockerfile.md).

## 4\. Testes que não dependem do seu computador

Os testes de unidade e de integração da Seção 4 e da [lição 5.13](../07%20-%20Se%C3%A7%C3%A3o%205%20-%20Persist%C3%AAncia%20de%20Dados%20com%20Node.js/13%20-%20Testes%20de%20Integra%C3%A7%C3%A3o%20com%20jest.spyOn.md) usam **mocks** (`jest.spyOn`) no lugar do banco. Isso é ótimo para CI: eles rodam em qualquer máquina, sem MySQL.

Se você tiver testes que precisam de um banco de verdade, há dois caminhos:

-   Separá-los em outro script (ex.: `"test": "jest tests/unit"` e `"test:db": "jest tests/db"`) e rodar só onde houver banco.
-   Subir um MySQL descartável **dentro do pipeline** com um *service container* (veja a lição IA.3).

## 5\. Configuração só por variáveis de ambiente

-   Tudo que muda entre ambientes (host do banco, senha, `JWT_SECRET`, porta) vem de `process.env`, como na [lição 5.5](../07%20-%20Se%C3%A7%C3%A3o%205%20-%20Persist%C3%AAncia%20de%20Dados%20com%20Node.js/05%20-%20Vari%C3%A1veis%20de%20Ambiente.md).
-   `.env` fica fora do Git. Faça commit de um `.env.example` com as **chaves** e valores fictícios, para documentar o que precisa ser configurado.
-   No pipeline, os valores sensíveis vêm de **segredos** (lição IA.4), nunca do código.

## 6\. (Opcional) Um portão de cobertura

A [lição 4.10](../06%20-%20Se%C3%A7%C3%A3o%204%20-%20Testes%20da%20Aplica%C3%A7%C3%A3o/10%20-%20Configura%C3%A7%C3%B5es%20do%20Jest.md) mostra o relatório de cobertura. Com `coverageThreshold`, o Jest **falha** se a cobertura cair abaixo do mínimo, e o pipeline barra o merge:

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: { lines: 80, branches: 70 },
  },
};
```

## Teste rápido: simule a CI na sua máquina

Clone o repositório em uma pasta nova e rode o mesmo que o pipeline vai rodar. Se passar aqui, é bem provável que passe lá:

```bash
git clone https://github.com/SEU-USUARIO/cookmaster.git cookmaster-ci
cd cookmaster-ci
npm ci
npm run lint --if-present
npm test
```
