// Gera o site offline (HTML) e a versão em Markdown a partir de _ferramentas/raw.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const { gfm } = require('turndown-plugin-gfm');
const { obsFor, obsSlugs } = require('./obs-ia');
const aiSection = require('./secao-ia');

const TOOLS = __dirname;
const OUT = path.resolve(TOOLS, '..');
const RAW = path.join(TOOLS, 'raw');
const SRC = path.join(TOOLS, 'site-src');
const ASSETS = path.join(OUT, 'assets');
const MD_ROOT = 'Markdown';
const SITE = 'https://cursos.betrybe.com';
const COURSE_PATH = '/200838-back-end-em-node-js/';
const HLJS = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0';
const BUILD_DATE = new Date().toLocaleDateString('pt-BR');

const LANG = { js: 'javascript', javascript: 'javascript', bash: 'bash', sh: 'bash', shell: 'bash', json: 'json', yml: 'yaml', yaml: 'yaml', sql: 'sql', dockerfile: 'dockerfile' };

const readJson = (f) => JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8'));
const pad = (n) => String(n).padStart(2, '0');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const encPath = (p) => p.split('/').map(encodeURIComponent).join('/');
const slugify = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const safeName = (s) => s
  .replace(/\s*[:|]\s*/g, ' - ')
  .replace(/[\\/*?"<>]+/g, '-')
  .replace(/\s+/g, ' ')
  .replace(/[ .]+$/, '')
  .trim();
const stripNumber = (t) => t.replace(/^\d+(\.\d+)*\s*-?\s*/, '').trim() || t;

const ICON = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  moon: '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  sun: '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 8-4 4 4 4M16 8l4 4-4 4"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></svg>',
  quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z"/><path d="M19 16v4M17 18h4"/></svg>',
};

// ---------- Carregar dados ----------
const course = readJson('_course.json');
const quizzes = new Map(
  fs.readdirSync(RAW).filter((f) => f.startsWith('_quiz_')).map((f) => {
    const q = readJson(f);
    return [q.slug, q];
  }),
);

const sections = course.sections.map((s, si) => {
  const isExtra = /complementar/i.test(s.title);
  const dir = `${pad(si + 1)} - ${safeName(s.title.replace(/^\[([^\]]+)\]/, '$1'))}`;
  const lessons = s.lessons.map((l, li) => {
    const data = readJson(`${l.slug}.json`);
    const title = data.title || l.title;
    const base = `${pad(li + 1)} - ${safeName(stripNumber(title))}`;
    return { slug: l.slug, title, data, si, li, dir, rel: `${dir}/${base}.html`, mdRel: `${dir}/${base}.md` };
  });
  return { title: s.title, isExtra, dir, lessons };
});
{
  const si = sections.length;
  const dir = `${pad(si + 1)} - ${safeName(aiSection.title.replace(/^\[([^\]]+)\]/, '$1'))}`;
  const lessons = aiSection.lessons.map((l, li) => {
    const base = `${pad(li + 1)} - ${safeName(l.title.replace(/^IA\.\d+\s*-\s*/, ''))}`;
    const html = fs.readFileSync(path.join(TOOLS, 'secao-ia', l.file), 'utf8');
    return { slug: l.slug, title: l.title, data: { title: l.title, html, videos: [] }, aiQuiz: l.quiz, isAi: true, si, li, dir, rel: `${dir}/${base}.html`, mdRel: `${dir}/${base}.md` };
  });
  sections.push({ title: aiSection.title, isExtra: false, isAi: true, dir, lessons });
}
const allLessons = sections.flatMap((s) => s.lessons);
const bySlug = new Map(allLessons.map((l) => [l.slug, l]));

// ---------- Downloads (imagens e highlight.js) ----------
const download = async (url, attempt = 1) => {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (offline-course-builder)' }, redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { buf: Buffer.from(await res.arrayBuffer()), type: res.headers.get('content-type') ?? '' };
  } catch (err) {
    if (attempt < 3) return download(url, attempt + 1);
    throw err;
  }
};

const EXT = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/gif': '.gif', 'image/webp': '.webp', 'image/svg+xml': '.svg', 'image/avif': '.avif' };

async function downloadImages() {
  const imgDir = path.join(ASSETS, 'img');
  fs.mkdirSync(imgDir, { recursive: true });
  const urls = new Set();
  const collect = (html) => {
    const $ = cheerio.load(html ?? '', null, false);
    $('img[src]').each((_, el) => {
      try { urls.add(new URL($(el).attr('src'), SITE).href); } catch { /* src inválido */ }
    });
  };
  allLessons.forEach((l) => collect(l.data.html));
  quizzes.forEach((q) => q.questions.forEach((qq) => { collect(qq.prompt); qq.options.forEach((o) => collect(o.html)); }));

  const existing = fs.readdirSync(imgDir);
  const map = new Map();
  const queue = [...urls];
  const failures = [];
  const worker = async () => {
    for (let url = queue.shift(); url; url = queue.shift()) {
      const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 14);
      const cached = existing.find((f) => f.startsWith(hash + '.'));
      if (cached) { map.set(url, `assets/img/${cached}`); continue; }
      try {
        const { buf, type } = await download(url);
        const ext = EXT[type.split(';')[0].trim()] ?? (path.extname(new URL(url).pathname) || '.png');
        fs.writeFileSync(path.join(imgDir, hash + ext), buf);
        map.set(url, `assets/img/${hash}${ext}`);
      } catch (err) {
        failures.push(`${url} (${err.message})`);
      }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  console.log(`Imagens: ${map.size}/${urls.size} disponíveis offline`);
  failures.forEach((f) => console.warn('  falhou:', f));
  return map;
}

async function downloadVendor() {
  const dir = path.join(ASSETS, 'vendor');
  fs.mkdirSync(dir, { recursive: true });
  for (const [file, url] of [['highlight.min.js', `${HLJS}/highlight.min.js`], ['dockerfile.min.js', `${HLJS}/languages/dockerfile.min.js`]]) {
    const target = path.join(dir, file);
    if (fs.existsSync(target)) continue;
    try {
      fs.writeFileSync(target, (await download(url)).buf);
    } catch (err) {
      console.warn(`Aviso: não baixou ${file} (${err.message}); o código ficará sem cores.`);
    }
  }
}

// ---------- Processamento de HTML ----------
const videoCard = (src) => {
  const isVimeo = /vimeo\.com/.test(src);
  const isYoutube = /youtu\.?be/.test(src);
  const where = isVimeo ? 'Vimeo' : isYoutube ? 'YouTube' : 'site original';
  return `<a class="video-card" href="${esc(src)}" target="_blank" rel="noopener noreferrer"><span class="video-card__icon">${ICON.play}</span><span><strong>Vídeo da aula</strong><small>Abrir no ${where} (requer internet)</small></span></a>`;
};

function sanitize($) {
  $('script, style, link, meta, object, embed').remove();
  $('*').each((_, el) => {
    for (const attr of Object.keys(el.attribs ?? {})) {
      if (/^on/i.test(attr)) $(el).removeAttr(attr);
    }
  });
}

function processHtml(html, imgMap) {
  const $ = cheerio.load(html ?? '', null, false);
  sanitize($);

  const embedded = [];
  $('iframe').each((_, el) => {
    const src = $(el).attr('src') ?? '';
    embedded.push(src);
    const wrapper = $(el).closest('.aspect-w-16, .embed-content');
    (wrapper.length ? wrapper : $(el)).replaceWith(videoCard(src));
  });

  $('pre').each((_, el) => {
    const pre = $(el);
    let code = pre.children('code');
    if (!code.length) {
      pre.html(`<code>${pre.html()}</code>`);
      code = pre.children('code');
    }
    const cls = (code.attr('class') ?? '').trim().toLowerCase();
    const lang = LANG[cls] ?? (cls.replace(/^language-/, '') || '');
    if (lang) code.attr('class', `language-${lang}`);
    else code.removeAttr('class');
  });

  $('img').each((_, el) => {
    const img = $(el);
    let abs = null;
    try { abs = new URL(img.attr('src') ?? '', SITE).href; } catch { /* src inválido */ }
    const local = abs && imgMap.get(abs);
    if (!local) {
      const box = img.parent('a').length && img.parent('a').children().length === 1 ? img.parent('a') : img;
      box.replaceWith(`<span class="img-missing">Imagem indisponível offline: ${esc(img.attr('alt') || 'sem descrição')}</span>`);
      return;
    }
    img.attr('src', `@@ROOT@@${local}`);
    img.attr('loading', 'lazy');
    img.removeAttr('data-image').removeAttr('width').removeAttr('height');
    const parentLink = img.parent('a');
    if (parentLink.length && parentLink.children().length === 1) parentLink.replaceWith(img);
  });

  $('a[href]').each((_, el) => {
    const a = $(el);
    if (a.hasClass('video-card')) return;
    const href = a.attr('href');
    if (href.startsWith('#')) return;
    if (href.startsWith('@@LESSON:')) {
      const slug = href.slice(9, -2);
      if (!bySlug.has(slug)) throw new Error(`Link para lição inexistente: ${slug}`);
      return;
    }
    let url;
    try { url = new URL(href, SITE); } catch { a.removeAttr('href'); return; }
    if (!/^https?:$|^mailto:$/.test(url.protocol)) { a.removeAttr('href'); return; }
    if (url.origin === SITE && url.pathname.startsWith(COURSE_PATH)) {
      const slug = url.pathname.slice(COURSE_PATH.length).split('/')[0];
      if (bySlug.has(slug)) {
        a.attr('href', `@@LESSON:${slug}@@`).removeAttr('target');
        return;
      }
    }
    a.attr('href', url.href).attr('target', '_blank').attr('rel', 'noopener noreferrer').addClass('external');
  });

  const used = new Set();
  $('h2, h3').each((_, el) => {
    const base = slugify($(el).text()) || 'topico';
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    $(el).attr('id', id);
  });

  $('table').each((_, el) => { $(el).wrap('<div class="table-wrap"></div>'); });

  return {
    html: $.html().trim(),
    text: $.root().text().replace(/\s+/g, ' ').trim(),
    codeBlocks: $('pre').length,
    embedded,
  };
}

function processQuiz(quiz, imgMap) {
  const questions = quiz.questions.map((q) => {
    const $raw = cheerio.load(q.raw ?? '', null, false);
    $raw('meta').remove();
    const explanation = $raw('.question > .mt-2 .w-full').html()?.trim() ?? '';
    return {
      prompt: processHtml(q.prompt, imgMap).html,
      options: q.options.map((o) => ({
        letter: o.letter,
        html: processHtml(o.html, imgMap).html,
        correct: /question-response--correct/.test(o.cls),
      })),
      explanation: explanation ? processHtml(explanation, imgMap).html : '',
    };
  });
  return { title: quiz.title, questions, known: questions.some((q) => q.options.some((o) => o.correct)) };
}

// ---------- Templates ----------
const resolvePlaceholders = (html, root, linkFor) => html
  .replace(/@@ROOT@@([^"')\s]+)/g, (_, p) => root + encPath(p))
  .replace(/@@LESSON:([\w-]+)@@/g, (_, slug) => linkFor(bySlug.get(slug)));

const head = (title, root) => `<!doctype html>
<html lang="pt-BR" data-root="${root}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<script>(()=>{try{const t=JSON.parse(localStorage.getItem('trybe-node:theme'));document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{document.documentElement.dataset.theme='light'}})()</script>
<link rel="stylesheet" href="${root}assets/css/style.css">
</head>`;

const topbar = (root) => `<header class="topbar">
  <button class="icon-btn" id="menu-toggle" type="button" aria-label="Abrir menu">${ICON.menu}</button>
  <a class="brand" href="${root}index.html"><span class="brand__logo">{ }</span><span>Back-end em Node.js</span><span class="brand__tag">offline</span></a>
  <button class="search-trigger" id="search-open" type="button">${ICON.search}<span>Buscar no curso…</span><kbd>Ctrl K</kbd></button>
  <button class="icon-btn" id="theme-toggle" type="button" aria-label="Alternar tema claro/escuro">${ICON.moon}${ICON.sun}</button>
</header>`;

const searchModal = `<div class="search" id="search" hidden>
  <div class="search__backdrop" data-close></div>
  <div class="search__panel" role="dialog" aria-label="Buscar no curso">
    <div class="search__bar">${ICON.search}<input id="search-input" type="search" placeholder="Buscar em todas as lições… (ex.: middleware, jwt, prepared statement)" autocomplete="off"><kbd>Esc</kbd></div>
    <div class="search__results" id="search-results"></div>
  </div>
</div>`;

const scripts = (root, withHljs) => `${withHljs ? `<script src="${root}assets/vendor/highlight.min.js"></script>
<script src="${root}assets/vendor/dockerfile.min.js"></script>
` : ''}<script src="${root}assets/js/course.js"></script>
<script src="${root}assets/js/app.js"></script>`;

function renderQuizHtml(quiz) {
  const hint = quiz.known
    ? 'Clique em uma alternativa para conferir. O gabarito e as explicações aparecem na hora.'
    : 'O gabarito deste quiz não estava liberado no momento da cópia. Marque suas respostas para revisar depois; elas ficam salvas neste navegador.';
  const items = quiz.questions.map((q) => `<li class="quiz-q">
      <div class="quiz-q__prompt">${q.prompt}</div>
      <div class="quiz-q__options">${q.options.map((o) => `<button type="button" class="quiz-opt"${o.correct ? ' data-correct="true"' : ''}><span class="quiz-opt__letter">${esc(o.letter ?? '')}</span><span>${o.html}</span></button>`).join('')}</div>
      ${q.explanation ? `<div class="quiz-q__explanation" hidden>${q.explanation}</div>` : ''}
    </li>`).join('');
  return `<section class="quiz" data-known="${quiz.known}">
    <div class="quiz__head"><h2>${ICON.quiz.replace('<svg', '<svg width="22" height="22" style="vertical-align:-4px;margin-right:6px"')}Quiz</h2><div><span class="quiz__score"></span> <button type="button" class="btn quiz__reset" style="margin-left:8px;padding:6px 12px">Refazer</button></div></div>
    <p class="quiz__hint">${hint}</p>
    <ol class="quiz__list">${items}</ol>
  </section>`;
}

function renderLesson(l, prev, next, processed, quiz) {
  const root = '../';
  const section = sections[l.si];
  const link = (target) => root + encPath(target.rel);
  const extraVideos = l.data.videos.filter((v) => !processed.embedded.includes(v));
  const videosCount = extraVideos.length + processed.embedded.length;
  const minutes = Math.max(1, Math.round(processed.text.split(' ').length / 180));
  const body = processed.html
    ? `<div class="content">${resolvePlaceholders(processed.html, root, link)}</div>`
    : '<div class="notice"><strong>Conteúdo bloqueado no momento da cópia.</strong><br>No site, este gabarito só é liberado depois que o quiz anterior é concluído.</div>';

  return `${head(`${l.title} · Node.js offline`, root)}
<body data-page="lesson" data-lesson="${l.slug}">
<div class="read-progress"></div>
${topbar(root)}
<div class="layout">
  <nav class="sidebar" id="sidebar" aria-label="Conteúdo do curso"></nav>
  <div class="main">
    <article class="lesson">
      <div class="crumb"><a href="${root}index.html">Início</a><span>/</span><span>${esc(section.title)}</span><span>·</span><span>Lição ${l.li + 1} de ${section.lessons.length}</span></div>
      <h1>${esc(l.title)}</h1>
      <div class="chips">
        <span class="chip">${ICON.clock}${minutes} min de leitura</span>
        ${processed.codeBlocks ? `<span class="chip">${ICON.code}${processed.codeBlocks} ${processed.codeBlocks === 1 ? 'bloco' : 'blocos'} de código</span>` : ''}
        ${videosCount ? `<span class="chip">${ICON.video}${videosCount} ${videosCount === 1 ? 'vídeo' : 'vídeos'}</span>` : ''}
        ${quiz ? `<span class="chip">${ICON.quiz}Quiz com ${quiz.questions.length} questões</span>` : ''}
        ${processed.obsCount ? `<a class="chip chip--obs" href="#obs-ia-1">${ICON.spark}${processed.obsCount} ${processed.obsCount === 1 ? 'OBS' : 'OBSs'} da IA</a>` : ''}
      </div>
      ${l.isAi ? `<div class="ai-banner">${ICON.spark}<p><strong>Conteúdo escrito pela IA</strong> (GitHub Copilot) como complemento ao curso. Não faz parte do material original da Trybe. Versões de ferramentas e telas citadas refletem out/2026: confira a documentação oficial antes de usar em produção.</p></div>` : ''}
      ${extraVideos.map(videoCard).join('\n')}
      ${body}
      ${quiz ? renderQuizHtml(quiz) : ''}
      <section class="notes">
        <div class="notes__head"><h2>Minhas anotações</h2><span class="notes__status" id="notes-status"></span></div>
        <textarea id="notes" placeholder="Escreva aqui seus resumos, dúvidas e insights desta lição…"></textarea>
      </section>
      <div class="lesson-actions"><button class="btn" id="complete" type="button">Marcar como concluída</button></div>
      <nav class="pager" aria-label="Navegação entre lições">
        ${prev ? `<a class="prev" id="prev-link" href="${link(prev)}"><small>← Anterior</small><strong>${esc(prev.title)}</strong></a>` : ''}
        ${next ? `<a class="next" id="next-link" href="${link(next)}"><small>Próxima →</small><strong>${esc(next.title)}</strong></a>` : ''}
      </nav>
      <p class="shortcut-hint">Atalhos: <kbd>←</kbd> <kbd>→</kbd> navegar · <kbd>Ctrl K</kbd> ou <kbd>/</kbd> buscar</p>
    </article>
    <aside class="toc" id="toc"></aside>
  </div>
</div>
${searchModal}
${scripts(root, true)}
</body>
</html>
`;
}

function renderHome(stats) {
  const root = '';
  const card = (s, si) => {
    const videos = s.lessons.reduce((n, l) => n + l.videos, 0);
    const quizCount = s.lessons.filter((l) => l.hasQuiz).length;
    const meta = [`${s.lessons.length} ${s.lessons.length === 1 ? 'lição' : 'lições'}`, videos && `${videos} ${videos === 1 ? 'vídeo' : 'vídeos'}`, quizCount && `${quizCount} quiz`].filter(Boolean).join(' · ');
    const label = s.isAi ? 'IA' : s.isExtra ? '+' : String(sections.filter((x, i) => !x.isExtra && !x.isAi && i <= si).length);
    const mod = s.isAi ? ' section-card--ai' : s.isExtra ? ' section-card--extra' : '';
    const badge = s.isAi ? '<span class="badge badge--ai">OBS da IA</span>' : s.isExtra ? '<span class="badge">Complementar</span>' : '';
    return `<article class="section-card${mod}" data-section="${si}">
      <header>
        <span class="section-card__num">${label}</span>
        <div>${badge}<h3>${esc(s.title.replace(/^Seção \d+ - /, '').replace(/^\[[^\]]+\] - /, ''))}</h3><p>${meta}</p></div>
        <span class="section-card__count"></span>
      </header>
      <div class="bar"><span></span></div>
      <details><summary>Ver lições</summary><ol>${s.lessons.map((l) => `<li><a data-lesson-link="${l.slug}" href="${encPath(l.rel)}"><span class="check"></span><span>${esc(l.title)}</span></a></li>`).join('')}</ol></details>
      <a class="section-card__open" href="${encPath(s.lessons[0].rel)}">Abrir seção →</a>
    </article>`;
  };
  const quickLabel = (l) => (/^(\d|IA\.)/.test(l.title) ? l.title : `${l.title} (${sections[l.si].title.replace(/^.*- /, '')})`);
  const quickList = (items) => `<ul>${items.map((l) => `<li><a data-lesson-link="${l.slug}" href="${encPath(l.rel)}"><span class="check"></span><span>${esc(quickLabel(l))}</span></a></li>`).join('')}</ul>`;
  const summaries = allLessons.filter((l) => /para não esquecer mais/i.test(l.title));
  const quizLessons = allLessons.filter((l) => l.hasQuiz);
  const projects = allLessons.filter((l) => (l.isAi ? /exerc[ií]cio/i : /projeto|exerc[ií]cio/i).test(l.title) && !/gabarito/i.test(l.title));

  return `${head('Back-end em Node.js · Curso offline', root)}
<body data-page="home">
${topbar(root)}
<main class="home">
  <section class="hero">
    <div>
      <div class="hero__eyebrow">Trybe · Escola de Programação</div>
      <h1>${esc(course.title)}</h1>
      <p>${esc(course.description)}</p>
      <div class="hero__cta">
        <a class="btn btn--primary" id="continue" href="#"><span><span id="continue-label">Começar o curso</span><small id="continue-title"></small></span></a>
        <button class="btn" type="button" onclick="document.getElementById('search-open').click()">${ICON.search.replace('<svg', '<svg width="16" height="16"')} Buscar conteúdo</button>
      </div>
    </div>
    <div class="ring" id="ring"><div class="ring__inner"><div><div class="ring__value" id="ring-value">0%</div><div class="ring__label" id="ring-label"></div></div></div></div>
  </section>

  <div class="stats">
    <div class="stat"><strong>${stats.sections}</strong><span>seções (+${stats.extras} complementares${stats.ai ? ` · +${stats.ai} da IA` : ''})</span></div>
    <div class="stat"><strong>${allLessons.length}</strong><span>lições</span></div>
    <div class="stat"><strong>${stats.code}</strong><span>exemplos de código</span></div>
    <div class="stat"><strong>${stats.videos}</strong><span>vídeos (link online)</span></div>
    <div class="stat"><strong>${stats.quizQuestions}</strong><span>questões de quiz</span></div>
  </div>

  <h2 class="block-title">Trilha do curso</h2>
  <div class="cards">${sections.map(card).join('')}</div>

  <h2 class="block-title">Acesso rápido</h2>
  <div class="quick">
    <div class="quick__box"><h3>Resumos para revisão</h3><p>As lições “Para não esquecer mais” de cada seção.</p>${quickList(summaries)}</div>
    <div class="quick__box"><h3>Quizzes</h3><p>Pratique offline. Suas respostas ficam salvas.</p>${quickList(quizLessons)}</div>
    <div class="quick__box"><h3>Projetos e exercícios</h3><p>Hora de colocar a mão no código.</p>${quickList(projects)}</div>
  </div>

  <div class="data-tools">
    <p>Progresso, anotações e respostas ficam salvos <strong>neste navegador</strong>. Exporte um backup para não perder nada ou para levar para outro computador.</p>
    <button class="btn" id="export-data" type="button">Exportar progresso</button>
    <label class="btn" for="import-file">Importar progresso<input id="import-file" type="file" accept="application/json" hidden></label>
    <button class="btn" id="reset-data" type="button">Zerar</button>
  </div>
  <p class="footer-note">Cópia pessoal para estudo offline · gerada em ${BUILD_DATE} a partir de cursos.betrybe.com · versão em Markdown na pasta <code>${MD_ROOT}</code></p>
</main>
${searchModal}
${scripts(root, false)}
</body>
</html>
`;
}

// ---------- Markdown ----------
const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-', emDelimiter: '*' });
turndown.use(gfm);
turndown.addRule('videoCard', {
  filter: (node) => node.nodeName === 'A' && /video-card/.test(node.getAttribute('class') ?? ''),
  replacement: (_, node) => `\n\n> **Vídeo da aula:** [assistir online](${node.getAttribute('href')})\n\n`,
});
turndown.addRule('mark', { filter: 'mark', replacement: (c) => `**${c}**` });
const isObs = (node) => node?.nodeName === 'DETAILS' && /\bobs-ia\b/.test(node.getAttribute('class') ?? '');
turndown.addRule('obsIa', {
  filter: isObs,
  replacement: (content) => `\n\n<details>\n<summary>OBS da IA</summary>\n\n${content.trim()}\n\n</details>\n\n`,
});
turndown.addRule('obsIaSummary', { filter: (node) => node.nodeName === 'SUMMARY' && isObs(node.parentNode), replacement: () => '' });
turndown.addRule('obsIaLabel', {
  filter: (node) => node.nodeName === 'P' && /\bobs-ia__label\b/.test(node.getAttribute('class') ?? ''),
  replacement: (content) => `\n\n**${content}**\n\n`,
});
turndown.addRule('cdsCode', {
  filter: (node) => node.nodeName === 'PRE' && node.getAttribute('data-lang') === 'cds',
  replacement: (_, node) => `\n\n\`\`\`cds\n${node.textContent.replace(/\n$/, '')}\n\`\`\`\n\n`,
});

// Insere as "OBS da IA" (caixas recolhíveis) no fim da seção indicada, sem tocar no conteúdo do curso.
function injectObs(html, slug) {
  const notes = obsFor(slug);
  if (!html || !notes.length) return { html, count: 0 };
  const $ = cheerio.load(html, null, false);
  notes.forEach((n, i) => {
    const box = `<details class="obs-ia" id="obs-ia-${i + 1}"><summary>${ICON.spark}<span>OBS da IA</span></summary><div class="obs-ia__body">${n.html}</div></details>`;
    if (!n.after) { $.root().append(box); return; }
    const head = $(`[id="${n.after}"]`).first();
    if (!head.length) throw new Error(`OBS da IA: título #${n.after} não encontrado em ${slug}`);
    const level = Number(head.get(0).tagName[1]);
    const stop = head.nextAll().filter((_, el) => /^h[1-6]$/.test(el.tagName) && Number(el.tagName[1]) <= level).first();
    if (stop.length) stop.before(box);
    else (head.parent().length ? head.parent() : $.root()).append(box);
  });
  return { html: $.html(), count: notes.length };
}

function renderMarkdown(l, processed, quiz) {
  const section = sections[l.si];
  const root = '../../';
  const mdLink = (target) => `../${encPath(target.mdRel)}`;
  const parts = [`# ${l.title}`, `> ${section.title} · Lição ${l.li + 1} de ${section.lessons.length}`];
  if (l.isAi) parts.push('> **Conteúdo escrito pela IA** (GitHub Copilot) como complemento ao curso. Não faz parte do material original da Trybe. Versões de ferramentas e telas citadas refletem out/2026: confira a documentação oficial antes de usar em produção.');
  l.data.videos.filter((v) => !processed.embedded.includes(v)).forEach((v) => parts.push(`> **Vídeo da aula:** [assistir online](${v})`));
  parts.push(processed.html
    ? turndown.turndown(resolvePlaceholders(processed.html, root, mdLink))
    : '> **Conteúdo bloqueado no momento da cópia.** No site, este gabarito só é liberado depois que o quiz anterior é concluído.');
  if (quiz) {
    parts.push('## Quiz');
    quiz.questions.forEach((q, i) => {
      parts.push(`### Questão ${i + 1}\n\n${turndown.turndown(resolvePlaceholders(q.prompt, root, mdLink))}\n\n${q.options.map((o) => `- **${o.letter})** ${turndown.turndown(o.html).replace(/\n+/g, ' ')}`).join('\n')}`);
    });
    if (quiz.known) {
      parts.push('<details><summary>Gabarito</summary>\n\n' + quiz.questions.map((q, i) => {
        const right = q.options.find((o) => o.correct);
        return `**${i + 1}.** ${right ? right.letter : '?'}${q.explanation ? `\n\n${turndown.turndown(q.explanation)}` : ''}`;
      }).join('\n\n') + '\n\n</details>');
    }
  }
  return parts.join('\n\n') + '\n';
}

// ---------- Build ----------
async function main() {
  // Remove apenas as pastas geradas anteriormente.
  for (const entry of fs.readdirSync(OUT, { withFileTypes: true })) {
    if (entry.isDirectory() && (/^\d{2} - /.test(entry.name) || entry.name === MD_ROOT)) {
      fs.rmSync(path.join(OUT, entry.name), { recursive: true, force: true });
    }
  }
  fs.mkdirSync(path.join(ASSETS, 'css'), { recursive: true });
  fs.mkdirSync(path.join(ASSETS, 'js'), { recursive: true });

  const [imgMap] = await Promise.all([downloadImages(), downloadVendor()]);

  const searchIndex = [];
  const stats = { sections: sections.filter((s) => !s.isExtra && !s.isAi).length, extras: sections.filter((s) => s.isExtra).length, ai: sections.filter((s) => s.isAi).length, code: 0, videos: 0, quizQuestions: 0 };

  const unknownObs = obsSlugs.filter((s) => !allLessons.some((l) => l.slug === s));
  if (unknownObs.length) throw new Error(`OBS da IA para lições inexistentes: ${unknownObs.join(', ')}`);

  const processedAll = allLessons.map((l) => {
    const processed = processHtml(l.data.html, imgMap);
    const obs = injectObs(processed.html, l.slug);
    processed.html = obs.html;
    processed.obsCount = obs.count;
    const quiz = l.aiQuiz ?? (quizzes.has(l.slug) ? processQuiz(quizzes.get(l.slug), imgMap) : null);
    l.videos = l.data.videos.filter((v) => !processed.embedded.includes(v)).length + processed.embedded.length;
    l.hasQuiz = Boolean(quiz);
    stats.code += processed.codeBlocks;
    stats.videos += l.videos;
    stats.quizQuestions += quiz?.questions.length ?? 0;
    return { l, processed, quiz };
  });

  processedAll.forEach(({ l, processed, quiz }, i) => {
    const prev = allLessons[i - 1];
    const next = allLessons[i + 1];
    const htmlFile = path.join(OUT, l.rel);
    const mdFile = path.join(OUT, MD_ROOT, l.mdRel);
    fs.mkdirSync(path.dirname(htmlFile), { recursive: true });
    fs.mkdirSync(path.dirname(mdFile), { recursive: true });
    fs.writeFileSync(htmlFile, renderLesson(l, prev, next, processed, quiz));
    fs.writeFileSync(mdFile, renderMarkdown(l, processed, quiz));

    const quizText = quiz ? quiz.questions.map((q) => cheerio.load(q.prompt, null, false).root().text()).join(' ') : '';
    searchIndex.push({ t: l.title, s: sections[l.si].title, u: encPath(l.rel), x: `${processed.text} ${quizText}`.replace(/\s+/g, ' ').trim() });
  });

  const courseNav = {
    title: course.title,
    sections: sections.map((s) => ({ title: s.title, lessons: s.lessons.map((l) => ({ slug: l.slug, title: l.title, u: encPath(l.rel) })) })),
  };
  fs.writeFileSync(path.join(ASSETS, 'js', 'course.js'), `window.COURSE = ${JSON.stringify(courseNav)};\n`);
  fs.writeFileSync(path.join(ASSETS, 'js', 'search-index.js'), `window.SEARCH_INDEX = ${JSON.stringify(searchIndex)};\n`);
  fs.copyFileSync(path.join(SRC, 'style.css'), path.join(ASSETS, 'css', 'style.css'));
  fs.copyFileSync(path.join(SRC, 'app.js'), path.join(ASSETS, 'js', 'app.js'));
  fs.writeFileSync(path.join(OUT, 'index.html'), renderHome(stats));

  const summary = [`# ${course.title}`, '', course.description, ''];
  sections.forEach((s) => {
    summary.push(`## ${s.title}`, '');
    s.lessons.forEach((l) => summary.push(`- [${l.title}](${encPath(l.mdRel)})`));
    summary.push('');
  });
  fs.writeFileSync(path.join(OUT, MD_ROOT, '00 - Sumário.md'), summary.join('\n'));

  console.log(`Lições: ${allLessons.length} · Código: ${stats.code} · Vídeos: ${stats.videos} · Questões: ${stats.quizQuestions}`);
  console.log(`Abra: ${path.join(OUT, 'index.html')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
