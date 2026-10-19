# Curso Back-end em Node.js (Trybe) — cópia offline pessoal

Cópia **pessoal e privada** do curso *Back-end em Node.js* da Trybe para estudo offline: site estático (HTML) + versão em Markdown, com busca, progresso, anotações, quizzes com gabarito e notas extras escritas por IA ("OBS da IA") pensando em SAP CAP.

> ⚠️ O conteúdo do curso é material pago e protegido por direitos autorais da Trybe. **Este repositório deve permanecer privado.** Não publique, não faça fork público e não envie o conteúdo para serviços externos.

---

## Instruções para o agente de IA (setup em outra máquina)

Você é um agente de IA ajudando o dono deste repositório a deixar o curso funcionando localmente. Siga os passos em ordem e pare para perguntar se algum pré-requisito faltar.

### Regras

1. **Não altere o conteúdo original do curso** (`_ferramentas/raw/*.json`, nem o HTML/Markdown gerado a partir dele). Complementos vão **somente** em `_ferramentas/obs-ia.js` ou `_ferramentas/secao-ia/`.
2. Não torne o repositório público e não envie o conteúdo do curso para outros lugares.
3. Arquivos gerados (pastas `NN - ...`, `Markdown/`, `index.html`, `assets/js/course.js`, `assets/js/search-index.js`, `assets/css/style.css`, `assets/js/app.js`) **são sobrescritos pelo build**. Edite as fontes em `_ferramentas/`, nunca os gerados.
4. Não rode `_ferramentas/receiver.js`. Ele só serviu para capturar o curso uma vez e não é necessário.

### Pré-requisitos

- **Git**
- **Node.js 22 ou 24 (LTS)**. Confira com `node -v`.
- Acesso ao repositório privado (o usuário faz o login no GitHub quando o `git clone` pedir).

### Passo 1 — Clonar

```bash
git clone https://github.com/velosomt/nodejs-trybe.git
cd nodejs-trybe
```

### Passo 2 — Abrir o site (sem build)

O site já vem gerado no repositório. Basta abrir `index.html` em um navegador comum (Chrome, Edge, Firefox):

- Windows: `start index.html`
- macOS: `open index.html`
- Linux: `xdg-open index.html`

Se o navegador bloquear `file://` (por exemplo, o navegador integrado do VS Code), sirva a pasta por HTTP local:

```bash
npx --yes http-server -p 8765 -a 127.0.0.1 -c-1
# abra http://127.0.0.1:8765/index.html
```

Os vídeos são links para Vimeo/YouTube e exigem internet. Todo o resto funciona offline.

### Passo 3 — (Opcional) Regerar o site

Necessário apenas depois de editar algo em `_ferramentas/` (OBS da IA, seção da IA, estilos, scripts):

```bash
cd _ferramentas
npm ci
node build.js
cd ..
```

Saída esperada: `Lições: 125 · ... · Questões: 58`. Um aviso `falhou: ... mind_map2.png (HTTP 404)` é normal: essa imagem não existe mais na origem e aparece como "Imagem indisponível offline". As demais imagens ficam em cache em `assets/img/` e não são baixadas de novo.

O build apaga e recria as pastas `NN - ...` e `Markdown/`. Ele não toca em `_ferramentas/`, `assets/img/`, `assets/vendor/` nem neste README.

### Passo 4 — (Opcional, Windows) Atalho na área de trabalho

```powershell
powershell -ExecutionPolicy Bypass -File _ferramentas\criar-atalho.ps1
```

Cria o ícone `assets/curso.ico` e o atalho "Curso Node.js (offline)" na área de trabalho, apontando para o `index.html` desta pasta.

### Passo 5 — Validar

- `index.html` mostra 9 seções (+2 complementares · +1 da IA), 125 lições e 58 questões de quiz.
- Abra uma lição: menu lateral, sumário à direita, busca (`Ctrl K`), tema claro/escuro e as caixas recolhíveis "OBS da IA" funcionam.
- A seção **"[OBS da IA] - CI/CD"** aparece no fim da trilha.

### Progresso do usuário

Progresso, anotações e respostas dos quizzes ficam no `localStorage` do navegador, não no repositório. Para levar de uma máquina para outra, use **Exportar progresso** na página inicial da máquina antiga e **Importar progresso** na nova.

---

## Estrutura

```
index.html                     página inicial (gerada)
NN - Seção .../*.html          lições (geradas)
Markdown/                      mesma coisa em .md (gerada) + "00 - Sumário.md"
assets/
  img/                         imagens do curso (cache, versionado)
  vendor/                      highlight.js (versionado)
  css/, js/                    copiados/gerados pelo build
_ferramentas/
  build.js                     gera site + Markdown a partir de raw/
  raw/                         conteúdo capturado do curso (JSON) — NÃO editar
  obs-ia.js                    "OBS da IA" inseridas nas lições (mini-markdown)
  secao-ia/                    seção extra escrita pela IA (index.js + HTML por lição + quiz)
  site-src/                    style.css e app.js do site
  criar-atalho.ps1             atalho na área de trabalho (Windows)
  receiver.js                  usado só na captura original — não rodar
```

### Como adicionar uma "OBS da IA"

Em `_ferramentas/obs-ia.js`, acrescente um item ao array `OBS`:

```js
{
  slug: '4476560-5-5-variaveis-de-ambiente', // nome do arquivo em raw/ sem .json
  after: 'configurando-o-arquivo-env',        // opcional: id de um h2/h3; sem ele vai para o fim da lição
  moderno: ['...'],                           // "Alternativa mais moderna"
  atencao: ['...'],                           // "Atenção"
  cap: ['...'],                               // "Para o SAP CAP"
  cicd: ['Veja [IA.3](lesson:ia-cicd-3-github-actions).'], // "CI/CD"; [texto](lesson:slug) vira link interno
  exemplo: [{ lang: 'javascript', src: '...' }],           // blocos de código (lang 'cds' também é aceito)
}
```

Os textos aceitam `código` e **negrito**. Depois rode `node build.js`. O build falha com mensagem clara se o `slug`, o `after` ou um link `lesson:` não existir.
