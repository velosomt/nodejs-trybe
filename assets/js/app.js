(() => {
  'use strict';

  const root = document.documentElement.dataset.root ?? '';
  const COURSE = window.COURSE;
  const PREFIX = 'trybe-node:';
  const page = document.body.dataset.page;
  const current = document.body.dataset.lesson;

  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(PREFIX + key);
        return v === null ? fallback : JSON.parse(v);
      } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* armazenamento indisponível */ }
    },
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const ACCENTS = { a: 'aáàâãä', e: 'eéèêë', i: 'iíìîï', o: 'oóòôõö', u: 'uúùûü', c: 'cç', n: 'nñ' };
  const termsRegex = (terms) => new RegExp(
    terms.map((t) => [...t].map((ch) => (ACCENTS[ch] ? `[${ACCENTS[ch]}]` : ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).join('')).join('|'),
    'gi',
  );
  const splitTerms = (q) => norm(q).split(/\s+/).filter((t) => t.length > 1);

  const lessons = COURSE.sections.flatMap((s, si) => s.lessons.map((l) => ({ ...l, si })));
  const done = new Set(store.get('done', []));
  const saveDone = () => store.set('done', [...done]);
  const progressOf = (list) => {
    const n = list.filter((l) => done.has(l.slug)).length;
    return { n, total: list.length, pct: list.length ? Math.round((n * 100) / list.length) : 0 };
  };

  // ---------- Tema ----------
  $('#theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    store.set('theme', next);
  });

  // ---------- Sidebar ----------
  const renderSidebar = () => {
    const nav = $('#sidebar');
    if (!nav) return;
    const currentSection = lessons.find((l) => l.slug === current)?.si;
    nav.innerHTML = COURSE.sections.map((s, si) => {
      const p = progressOf(s.lessons);
      const items = s.lessons.map((l) => {
        const cls = ['nav-lesson', l.slug === current && 'is-current', done.has(l.slug) && 'is-done'].filter(Boolean).join(' ');
        return `<li><a class="${cls}" href="${root}${l.u}"><span class="check"></span><span>${esc(l.title)}</span></a></li>`;
      }).join('');
      return `<details class="nav-section"${si === currentSection ? ' open' : ''}>
        <summary><span>${esc(s.title)}</span><span class="nav-section__count">${p.n}/${p.total}</span><span class="mini-bar"><span style="width:${p.pct}%"></span></span></summary>
        <ol>${items}</ol></details>`;
    }).join('');
  };
  renderSidebar();
  $('#sidebar .is-current')?.scrollIntoView({ block: 'center' });
  $('#menu-toggle')?.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  document.addEventListener('click', (e) => {
    if (document.body.classList.contains('nav-open') && !e.target.closest('#sidebar, #menu-toggle')) document.body.classList.remove('nav-open');
  });

  // ---------- Busca ----------
  const modal = $('#search');
  const input = $('#search-input');
  const results = $('#search-results');
  let index = null;
  let active = 0;

  const loadIndex = () => new Promise((resolve) => {
    if (index) return resolve();
    const build = () => {
      index = window.SEARCH_INDEX.map((d) => ({ ...d, nt: norm(d.t), nx: norm(d.x) }));
      resolve();
    };
    if (window.SEARCH_INDEX) return build();
    const s = document.createElement('script');
    s.src = `${root}assets/js/search-index.js`;
    s.onload = build;
    document.head.append(s);
  });

  const countOf = (hay, term) => {
    let n = 0;
    for (let i = hay.indexOf(term); i !== -1 && n < 50; i = hay.indexOf(term, i + term.length)) n++;
    return n;
  };

  const runSearch = () => {
    const q = input.value.trim();
    const terms = splitTerms(q);
    if (!terms.length) {
      results.innerHTML = '<p class="search__empty">Digite para buscar em todas as 118 lições.<br><small>Dica: use várias palavras, ex.: <em>jwt autorização</em></small></p>';
      return;
    }
    const re = termsRegex(terms);
    const hits = index
      .filter((d) => terms.every((t) => d.nt.includes(t) || d.nx.includes(t)))
      .map((d) => ({ d, score: terms.reduce((acc, t) => acc + (d.nt.includes(t) ? 40 : 0) + countOf(d.nx, t), 0) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);
    if (!hits.length) {
      results.innerHTML = `<p class="search__empty">Nada encontrado para “${esc(q)}”.</p>`;
      return;
    }
    active = 0;
    results.innerHTML = hits.map(({ d }, i) => {
      const found = terms.map((t) => d.nx.indexOf(t)).filter((p) => p >= 0);
      const pos = found.length ? Math.min(...found) : 0;
      const start = Math.max(0, pos - 70);
      const snippet = (start ? '…' : '') + d.x.slice(start, pos + 150) + '…';
      return `<a class="result${i === 0 ? ' is-active' : ''}" href="${root}${d.u}?q=${encodeURIComponent(q)}">
        <span class="result__section">${esc(d.s)}</span>
        <strong>${esc(d.t).replace(re, '<mark>$&</mark>')}</strong>
        <span class="result__snippet">${esc(snippet).replace(re, '<mark>$&</mark>')}</span></a>`;
    }).join('');
  };

  const openSearch = async () => {
    modal.hidden = false;
    input.focus();
    input.select();
    await loadIndex();
    runSearch();
  };
  const closeSearch = () => { modal.hidden = true; };

  $('#search-open')?.addEventListener('click', openSearch);
  modal?.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeSearch(); });
  input?.addEventListener('input', () => index && runSearch());
  input?.addEventListener('keydown', (e) => {
    const items = $$('.result', results);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!items.length) return;
      items[active]?.classList.remove('is-active');
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[active].classList.add('is-active');
      items[active].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && items[active]) {
      location.href = items[active].href;
    }
  });

  document.addEventListener('keydown', (e) => {
    const typing = e.target.closest?.('input, textarea, [contenteditable="true"]');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); return; }
    if (e.key === 'Escape' && modal && !modal.hidden) { closeSearch(); return; }
    if (typing || e.ctrlKey || e.metaKey || e.altKey || (modal && !modal.hidden)) return;
    if (e.key === '/') { e.preventDefault(); openSearch(); }
    if (page === 'lesson' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      const link = $(e.key === 'ArrowRight' ? '#next-link' : '#prev-link');
      if (!link) return;
      if (e.key === 'ArrowRight') { done.add(current); saveDone(); }
      location.href = link.href;
    }
  });

  // ---------- Página de lição ----------
  const highlightInPage = (container, q) => {
    const terms = splitTerms(q);
    if (!terms.length || !container) return;
    const re = termsRegex(terms);
    const probe = new RegExp(re.source, 'i');
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (probe.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const frag = document.createDocumentFragment();
      let last = 0;
      const text = node.nodeValue;
      re.lastIndex = 0;
      for (const m of text.matchAll(re)) {
        frag.append(text.slice(last, m.index));
        const mark = document.createElement('mark');
        mark.className = 'search-hit';
        mark.textContent = m[0];
        frag.append(mark);
        last = m.index + m[0].length;
      }
      frag.append(text.slice(last));
      node.replaceWith(frag);
    }
    $('.search-hit', container)?.scrollIntoView({ block: 'center' });
  };

  if (page === 'lesson') {
    store.set('last', current);
    const content = $('.content');

    // Conclusão
    const btn = $('#complete');
    const syncBtn = () => {
      const isDone = done.has(current);
      btn.classList.toggle('is-done', isDone);
      btn.textContent = isDone ? '✓ Lição concluída' : 'Marcar como concluída';
    };
    btn?.addEventListener('click', () => {
      if (done.has(current)) done.delete(current); else done.add(current);
      saveDone();
      syncBtn();
      renderSidebar();
    });
    if (btn) syncBtn();
    $('#next-link')?.addEventListener('click', () => { done.add(current); saveDone(); });

    // Código: realce, linguagem e botão copiar
    if (window.hljs) {
      hljs.configure({ ignoreUnescapedHTML: true, languages: ['javascript', 'bash', 'json', 'yaml', 'sql', 'dockerfile', 'xml'] });
      $$('pre code', document).forEach((c) => hljs.highlightElement(c));
    }
    $$('.content pre').forEach((pre) => {
      const code = $('code', pre);
      const lang = code?.className.match(/language-([\w-]+)/)?.[1];
      if (lang && lang !== 'plaintext') pre.dataset.lang = lang;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'copy-btn';
      b.textContent = 'Copiar';
      b.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText((code ?? pre).innerText);
          b.textContent = 'Copiado!';
          b.classList.add('is-ok');
        } catch {
          b.textContent = 'Erro';
        }
        setTimeout(() => { b.textContent = 'Copiar'; b.classList.remove('is-ok'); }, 1600);
      });
      pre.append(b);
    });

    // OBS da IA: abre a caixa quando o link (chip) ou a URL apontam para ela
    const openObs = () => {
      const target = location.hash.startsWith('#obs-ia-') ? document.getElementById(location.hash.slice(1)) : null;
      if (target?.tagName === 'DETAILS') target.open = true;
    };
    openObs();
    window.addEventListener('hashchange', openObs);

    // Índice da lição (TOC) com destaque da seção visível
    const heads = $$('.content h2, .content h3');
    const toc = $('#toc');
    if (toc && heads.length > 1) {
      toc.innerHTML = `<p class="toc__title">Nesta lição</p><ul>${heads.map((h) => `<li class="toc__${h.tagName.toLowerCase()}"><a href="#${h.id}">${esc(h.textContent.trim())}</a></li>`).join('')}</ul>`;
      const linkFor = new Map($$('a', toc).map((a) => [a.getAttribute('href').slice(1), a]));
      const obs = new IntersectionObserver((entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          $$('a.is-active', toc).forEach((a) => a.classList.remove('is-active'));
          linkFor.get(en.target.id)?.classList.add('is-active');
        }
      }, { rootMargin: '-70px 0px -70% 0px' });
      heads.forEach((h) => obs.observe(h));
    } else {
      toc?.remove();
    }

    // Barra de progresso de leitura
    const bar = $('.read-progress');
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = `${max > 0 ? Math.min(100, (scrollY / max) * 100) : 100}%`;
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Zoom nas imagens
    $$('.content img').forEach((img) => img.addEventListener('click', () => {
      const lb = document.createElement('div');
      lb.className = 'lightbox';
      const big = new Image();
      big.src = img.src;
      big.alt = img.alt;
      lb.append(big);
      lb.addEventListener('click', () => lb.remove());
      document.body.append(lb);
    }));

    // Anotações
    const notes = $('#notes');
    const status = $('#notes-status');
    if (notes) {
      notes.value = store.get(`note:${current}`, '');
      let t;
      notes.addEventListener('input', () => {
        status.textContent = 'Salvando…';
        clearTimeout(t);
        t = setTimeout(() => { store.set(`note:${current}`, notes.value); status.textContent = 'Salvo neste navegador'; }, 400);
      });
    }

    // Quiz
    $$('.quiz').forEach((quiz) => {
      const known = quiz.dataset.known === 'true';
      const key = `quiz:${current}`;
      const answers = store.get(key, {});
      const qs = $$('.quiz-q', quiz);
      const apply = () => {
        let correct = 0;
        let answered = 0;
        qs.forEach((q, qi) => {
          const sel = answers[qi];
          const opts = $$('.quiz-opt', q);
          opts.forEach((o, oi) => {
            const isRight = o.dataset.correct === 'true';
            o.classList.toggle('is-selected', sel === oi && !known);
            o.classList.toggle('is-correct', known && sel !== undefined && isRight);
            o.classList.toggle('is-wrong', known && sel === oi && !isRight);
            o.disabled = known && sel !== undefined;
          });
          if (sel === undefined) return;
          answered++;
          if (known && opts[sel]?.dataset.correct === 'true') correct++;
          const ex = $('.quiz-q__explanation', q);
          if (ex && known) ex.hidden = false;
        });
        $('.quiz__score', quiz).textContent = known
          ? `${correct}/${qs.length} corretas${answered < qs.length ? ` · ${answered} respondidas` : ''}`
          : `${answered}/${qs.length} respondidas`;
      };
      qs.forEach((q, qi) => $$('.quiz-opt', q).forEach((o, oi) => o.addEventListener('click', () => {
        if (known && answers[qi] !== undefined) return;
        answers[qi] = oi;
        store.set(key, answers);
        apply();
      })));
      $('.quiz__reset', quiz)?.addEventListener('click', () => {
        Object.keys(answers).forEach((k) => delete answers[k]);
        store.set(key, answers);
        $$('.quiz-q__explanation', quiz).forEach((e) => { e.hidden = true; });
        apply();
      });
      apply();
    });

    const q = new URLSearchParams(location.search).get('q');
    if (q) highlightInPage(content, q);
  }

  // ---------- Página inicial ----------
  if (page === 'home') {
    const o = progressOf(lessons);
    requestAnimationFrame(() => $('#ring')?.style.setProperty('--p', o.pct));
    $('#ring-value').textContent = `${o.pct}%`;
    $('#ring-label').textContent = `${o.n} de ${o.total} lições`;

    const last = lessons.find((l) => l.slug === store.get('last'));
    const target = last ?? lessons.find((l) => !done.has(l.slug)) ?? lessons[0];
    const cont = $('#continue');
    cont.href = root + target.u;
    $('#continue-label').textContent = last ? 'Continuar de onde parei' : 'Começar o curso';
    $('#continue-title').textContent = target.title;

    $$('.section-card').forEach((card) => {
      const p = progressOf(COURSE.sections[Number(card.dataset.section)].lessons);
      requestAnimationFrame(() => { $('.bar > span', card).style.width = `${p.pct}%`; });
      $('.section-card__count', card).textContent = `${p.n}/${p.total}`;
      card.classList.toggle('is-complete', p.n === p.total);
    });
    $$('[data-lesson-link]').forEach((a) => a.classList.toggle('is-done', done.has(a.dataset.lessonLink)));

    // Exportar / importar / zerar dados locais
    const ownKeys = () => Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
    $('#export-data')?.addEventListener('click', () => {
      const data = Object.fromEntries(ownKeys().map((k) => [k, localStorage.getItem(k)]));
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `progresso-curso-node-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    });
    $('#import-file')?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        const entries = Object.entries(data).filter(([k, v]) => k.startsWith(PREFIX) && typeof v === 'string');
        if (!entries.length) throw new Error('vazio');
        entries.forEach(([k, v]) => localStorage.setItem(k, v));
        location.reload();
      } catch {
        alert('Arquivo inválido. Use um arquivo gerado por “Exportar progresso”.');
      }
    });
    $('#reset-data')?.addEventListener('click', () => {
      if (!confirm('Apagar progresso, anotações e respostas de quiz deste navegador?')) return;
      ownKeys().filter((k) => k !== `${PREFIX}theme`).forEach((k) => localStorage.removeItem(k));
      location.reload();
    });
  }
})();
