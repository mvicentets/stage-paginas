/* STAGE® — página de venda de páginas */

// ▸ WhatsApp de vendas (DDI 55 + DDD + número)
const WHATSAPP = '5567991697998';
// ▸ Supabase (mesma chave pública do app): os contatos caem na aba Leads do app
const SUPABASE = { url: 'https://bfpzjpwtzogtgwwklkjz.supabase.co', key: 'sb_publishable_S_0MZ2yopkPPBIOT3dERmw_IQPvdAzE' };
// ▸ Pacotes e preços
const PACOTES = {
  captura: { nome: 'Página de Captura', base: 950, copy: 250 },
  vendas: { nome: 'Página de Vendas', base: 1450, copy: 450 }
};
// ▸ Projetos (imagens em img/ e img/full/)
const PROJETOS = [
  { img: 'baseus', t: 'Baseus', k: 'Página de Vendas', s: 'SaaS' },
  { img: 'guitarrista', t: 'Guitarra aos 40', k: 'Página de Vendas', s: 'Curso online' },
  { img: 'criativos', t: 'Booster Pages', k: 'Vendas + Criativos', s: 'Produto digital' },
  { img: 'robson', t: 'Robson Galvão', k: 'Página de Vendas', s: 'Mentoria' },
  { img: 'maquiadora', t: 'Maquiadora', k: 'Página de Vendas', s: 'Beleza' },
  { img: 'visagista', t: 'Visagista', k: 'Página de Consultoria', s: 'Imagem' },
  { img: 'renata', t: 'Dra. Renata Congro', k: 'Página de Captura', s: 'Saúde' },
  { img: 'taina', t: 'Dra. Tainá', k: 'Site Institucional', s: 'Saúde' },
  { img: 'gabriela', t: 'Dra. Gabriela', k: 'Site Institucional', s: 'Saúde' }
];

// ▸ Rastreamento: o script do STAGE LEADS (no <head>) cuida do pixel da Meta + API de conversões.
//   PageView e Lead do formulário ele dispara sozinho; aqui mandamos o que ele não enxerga nesta página.
window.tf = window.tf || function () { (window.tf.q = window.tf.q || []).push(arguments); };
const track = (ev, data) => { try { window.tf('send', ev, data || {}); } catch (e) {} };

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = () => innerWidth <= 860;
  const brl = n => n.toLocaleString('pt-BR');
  const pad2 = n => String(n).padStart(2, '0');

  // ---- logos
  if (typeof STAGE_LOGO !== 'undefined') $$('.logo-svg').forEach(s => { s.innerHTML = STAGE_LOGO.d.map(d => `<path d="${d}"/>`).join(''); });

  // =========================================================
  // Visualizador de projeto: abre a página inteira num popup
  // =========================================================
  const pv = $('#pv'), pvImg = $('#pvImg'), pvScroll = $('#pvScroll');
  let pvI = 0, pvFocus = null;
  const pvShow = i => {
    pvI = (i + PROJETOS.length) % PROJETOS.length; const p = PROJETOS[pvI];
    $('#pvK').textContent = `${pad2(pvI + 1)} — ${p.k} · ${p.s}`;
    $('#pvT').textContent = p.t;
    $('#pvN').textContent = `${pad2(pvI + 1)} / ${pad2(PROJETOS.length)}`;
    pvImg.classList.remove('ok'); pvImg.alt = `${p.k} ${p.t}, página inteira`;
    pvImg.onload = () => pvImg.classList.add('ok');
    pvImg.src = `img/full/${p.img}.webp`;
    pvScroll.scrollTop = 0;
  };
  const pvOpen = i => {
    pvFocus = document.activeElement; pvShow(i); pv.hidden = false;
    track('ViewContent', { content_name: PROJETOS[i] ? PROJETOS[i].t : 'Projeto', content_category: 'Portfólio' });
    if (window.__lenis) window.__lenis.stop();
    requestAnimationFrame(() => requestAnimationFrame(() => { pv.classList.add('on'); pvScroll.focus({ preventScroll: true }); }));
  };
  const pvClose = () => {
    pv.classList.remove('on');
    if (window.__lenis) window.__lenis.start();
    setTimeout(() => { pv.hidden = true; pvImg.removeAttribute('src'); if (pvFocus && pvFocus.focus) pvFocus.focus({ preventScroll: true }); }, 350);
  };
  document.addEventListener('click', e => { const a = e.target.closest('[data-pj]'); if (!a) return; e.preventDefault(); pvOpen(+a.dataset.pj); });
  $$('[data-pvclose]', pv).forEach(b => b.addEventListener('click', pvClose));
  $('#pvPrev').addEventListener('click', () => pvShow(pvI - 1));
  $('#pvNext').addEventListener('click', () => pvShow(pvI + 1));

  // =========================================================
  // Anel 3D de projetos (gira sozinho, arrasta, clica para abrir)
  // =========================================================
  const stage = $('#ringStage'), ring = $('#ring');
  const ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 3, 2];
  let rCards = [], R = 0, ang = 0, vel = 0, intro = reduce ? 1 : 0;
  const buildRing = () => {
    const w = small() ? 120 : Math.round(Math.min(190, Math.max(140, innerHeight * .17))), h = Math.round(w * 1.28), gap = small() ? 10 : 16, N = ORDER.length;
    R = Math.round(((w + gap) * N) / (2 * Math.PI));
    ring.style.setProperty('--w', w + 'px'); ring.style.setProperty('--h', h + 'px');
    ring.innerHTML = ORDER.map((p, i) => `<div class="rc" data-pj="${p}" style="transform:rotateY(${(360 / N) * i}deg) translateZ(${R}px)">
      <div class="rc-face"><img src="img/t/${PROJETOS[p].img}.webp" alt="${PROJETOS[p].k} ${PROJETOS[p].t}" width="420" height="538" draggable="false" decoding="async"><b>${PROJETOS[p].t}</b></div>
      <div class="rc-face back" aria-hidden="true"><img src="img/t/${PROJETOS[p].img}.webp" alt="" width="420" height="538" draggable="false" decoding="async"><b>${PROJETOS[p].t}</b></div></div>`).join('');
    rCards = $$('.rc', ring);
    stage.style.height = stage.style.minHeight = (small() ? Math.round(h * 1.8) : h + 190) + 'px';
  };
  buildRing();
  let lastW = innerWidth; addEventListener('resize', () => { if (Math.abs(innerWidth - lastW) > 60) { lastW = innerWidth; buildRing(); } });
  let dragging = false, sx = 0, lx = 0, moved = 0;
  stage.addEventListener('pointerdown', e => { dragging = true; moved = 0; sx = lx = e.clientX; stage.classList.add('drag'); stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', e => { if (!dragging) return; const dx = e.clientX - lx; lx = e.clientX; moved += Math.abs(dx); vel = dx * .22; ang += vel; });
  const endDrag = e => {
    if (!dragging) return; dragging = false; stage.classList.remove('drag');
    if (moved < 6 && e.type === 'pointerup') {
      stage.releasePointerCapture(e.pointerId);
      const el = document.elementFromPoint(e.clientX, e.clientY); const c = el && el.closest('.rc');
      if (c) pvOpen(+c.dataset.pj);
    }
  };
  stage.addEventListener('pointerup', endDrag); stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('click', e => e.stopPropagation(), true); // o clique é tratado no pointerup
  let ringOn = true;
  new IntersectionObserver(es => { ringOn = es[0].isIntersecting; }).observe(stage);
  const ringTick = () => {
    if (ringOn) {
      if (!dragging) { vel += ((reduce ? 0 : -.09) - vel) * .03; ang += vel; }
      const k = intro, tilt = -8 - (1 - k) * 50, sc = .55 + .45 * k;
      ring.style.transform = `translateY(0px) scale(${sc}) rotateX(${tilt}deg) rotateY(${ang}deg)`;
    }
    requestAnimationFrame(ringTick);
  };
  requestAnimationFrame(ringTick);

  // =========================================================
  // Projetos: lista + case
  // =========================================================
  const list = $('#caseList'), caseImg = $('#caseImg'), frame = $('#caseFrame');
  let cur = 0, caseTimer = null;
  list.innerHTML = PROJETOS.map((p, i) => `<li><button type="button" data-c="${i}"><span>${p.t}</span><small>${p.k}</small></button></li>`).join('');
  const fitShot = () => {
    const sh = caseImg.parentElement; const max = caseImg.offsetHeight - sh.clientHeight;
    caseImg.style.setProperty('--max', `${-Math.max(0, Math.min(max, sh.clientHeight * 3.2))}px`);
  };
  const setCase = (i, user) => {
    cur = (i + PROJETOS.length) % PROJETOS.length; const p = PROJETOS[cur];
    $$('button', list).forEach((b, j) => b.classList.toggle('on', j === cur));
    $('#caseK').textContent = p.k; $('#caseS').textContent = p.s;
    $('#caseUrl').textContent = `stage · ${p.t.toLowerCase()}`;
    frame.setAttribute('aria-label', `Abrir a página inteira de ${p.t}`);
    caseImg.style.opacity = 0;
    setTimeout(() => {
      caseImg.onload = () => { fitShot(); caseImg.style.animation = 'none'; void caseImg.offsetWidth; caseImg.style.animation = ''; caseImg.style.opacity = 1; };
      caseImg.removeAttribute('width'); caseImg.removeAttribute('height');
      caseImg.src = `img/${p.img}.webp`; caseImg.alt = `${p.k} ${p.t}`;
      if (caseImg.complete) caseImg.onload();
    }, 220);
    if (small() && user) { const b = $$('button', list)[cur]; b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); }
    clearInterval(caseTimer); caseTimer = setInterval(() => setCase(cur + 1), 9000);
  };
  caseImg.style.transition = 'opacity .25s';
  list.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) setCase(+b.dataset.c, true); });
  list.addEventListener('mouseover', e => { const b = e.target.closest('[data-c]'); if (b && !small() && +b.dataset.c !== cur) setCase(+b.dataset.c, true); });
  $('#casePrev').addEventListener('click', () => setCase(cur - 1, true));
  $('#caseNext').addEventListener('click', () => setCase(cur + 1, true));
  frame.addEventListener('click', () => pvOpen(cur));
  setCase(0);

  // =========================================================
  // Preços com copy opcional
  // =========================================================
  const priceOf = (key, withCopy) => { const p = PACOTES[key]; const v = p.base + (withCopy ? p.copy : 0); return { v, half: v / 2 }; };
  const countTo = (el, to) => {
    const from = parseInt(el.textContent.replace(/\D/g, ''), 10) || to;
    if (reduce || !window.gsap) { el.textContent = brl(to); return; }
    const o = { v: from }; gsap.to(o, { v: to, duration: .7, ease: 'power3.out', onUpdate: () => { el.textContent = brl(Math.round(o.v / 5) * 5); } });
  };
  $$('.plan').forEach(card => {
    const key = card.dataset.plan, cb = $('.cp', card);
    cb.addEventListener('change', () => { const { v, half } = priceOf(key, cb.checked); countTo($('.pval', card), v); countTo($('.phalf', card), half); });
  });

  // =========================================================
  // Contato: salva no Supabase e abre o WhatsApp
  // =========================================================
  const origem = () => {
    const q = new URLSearchParams(location.search); const utm = ['utm_source', 'utm_medium', 'utm_campaign'].map(k => q.get(k)).filter(Boolean).join(' / ');
    let ref = ''; try { ref = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
    return (utm || ref || 'direto');
  };
  const salvarLead = body => {
    try {
      fetch(`${SUPABASE.url}/rest/v1/rpc/lead_new`, {
        method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE.key, Authorization: `Bearer ${SUPABASE.key}` },
        body: JSON.stringify(body)
      }).catch(() => {});
    } catch (e) {}
  };
  const lead = $('#lead'), form = $('#leadForm'), err = $('#leadErr'), copyRow = $('.lead-copy'), copyTxt = $('#leadCopyTxt'), total = $('#leadTotal');
  let lastFocus = null;
  const pacoteAtual = () => (form.querySelector('input[name="pacote"]:checked') || {}).value || 'duvida';
  const syncLead = () => {
    const k = pacoteAtual(), p = PACOTES[k];
    copyRow.hidden = !p;
    if (!p) { total.textContent = 'A gente te ajuda a escolher no WhatsApp.'; return; }
    copyTxt.innerHTML = `Quero a copy também <b>+R$ ${brl(p.copy)}</b>`;
    const { v, half } = priceOf(k, form.copy.checked);
    total.textContent = `Total: R$ ${brl(v)} · ou 2x de R$ ${brl(half)}`;
  };
  const maskTel = v => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  };
  const openLead = key => {
    lastFocus = document.activeElement;
    const k = PACOTES[key] ? key : 'duvida';
    form.querySelector(`input[name="pacote"][value="${k}"]`).checked = true;
    const card = PACOTES[key] ? $(`.plan[data-plan="${key}"]`) : null;
    form.copy.checked = !!(card && $('.cp', card).checked);
    syncLead(); err.textContent = ''; lead.hidden = false;
    const pk = PACOTES[k]; track('InitiateCheckout', pk ? { content_name: pk.nome, value: pk.base, currency: 'BRL' } : { content_name: 'Ainda não sabe' });
    if (window.__lenis) window.__lenis.stop();
    requestAnimationFrame(() => requestAnimationFrame(() => { lead.classList.add('on'); setTimeout(() => form.nome.focus(), 250); }));
  };
  const closeLead = () => {
    lead.classList.remove('on');
    if (window.__lenis && pv.hidden) window.__lenis.start();
    setTimeout(() => { lead.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); }, 300);
  };
  $$('[data-buy]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openLead(b.dataset.buy); }));
  $$('[data-close]', lead).forEach(el => el.addEventListener('click', closeLead));
  $$('input[name="pacote"]', form).forEach(r => r.addEventListener('change', syncLead));
  form.copy.addEventListener('change', syncLead);
  form.whats.addEventListener('input', () => { form.whats.value = maskTel(form.whats.value); });
  form.insta.addEventListener('input', () => { form.insta.value = form.insta.value.replace(/^@+/, '').replace(/\s/g, ''); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nome = form.nome.value.trim(), tel = form.whats.value.replace(/\D/g, ''), ig = form.insta.value.trim().replace(/^@+/, '');
    if (nome.length < 2) { err.textContent = 'Coloca seu nome pra gente saber com quem fala.'; form.nome.focus(); return; }
    if (tel.length < 10) { err.textContent = 'Confere o WhatsApp com DDD.'; form.whats.focus(); return; }
    if (ig.length < 2) { err.textContent = 'Qual é o seu @ no Instagram?'; form.insta.focus(); return; }
    if (form.site && form.site.value) { closeLead(); return; } // campo invisível: só robô preenche
    const k = pacoteAtual(), p = PACOTES[k], comCopy = !!(p && form.copy.checked);
    let msg, resumo;
    if (p) {
      const { v, half } = priceOf(k, comCopy);
      resumo = `${p.nome}${comCopy ? ' + copy' : ''}`;
      msg = `Olá! Vim pelo site da STAGE e quero uma *${p.nome}*${comCopy ? ` *com a copy* (+R$ ${brl(p.copy)})` : ', já tenho a copy'}.\nTotal: R$ ${brl(v)}, em até 2x de R$ ${brl(half)} no cartão.`;
    } else {
      resumo = 'Ainda não sabe';
      msg = 'Olá! Vim pelo site da STAGE e quero uma página, mas ainda não sei se a de captura ou a de vendas. Pode me ajudar a escolher?';
    }
    track('Contact', p ? { content_name: resumo, value: priceOf(k, comCopy).v, currency: 'BRL' } : { content_name: resumo }); // abriu o WhatsApp (o Lead sai automático pelo formulário)
    salvarLead({ p_nome: nome, p_whats: tel, p_insta: ig, p_plano: 'outro', p_origem: `Páginas STAGE: ${resumo} | ${origem()}`.slice(0, 200) });
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`${msg}\n\n*Nome:* ${nome}\n*WhatsApp:* ${form.whats.value}\n*Instagram:* @${ig}`)}`, '_blank', 'noopener');
    closeLead();
  });

  // teclado: Esc fecha o que estiver aberto; setas trocam projeto no popup
  document.addEventListener('keydown', e => {
    if (!lead.hidden) { if (e.key === 'Escape') closeLead(); return; }
    if (pv.hidden) return;
    if (e.key === 'Escape') pvClose();
    if (e.key === 'ArrowRight') pvShow(pvI + 1);
    if (e.key === 'ArrowLeft') pvShow(pvI - 1);
  });

  // FAQ: um aberto por vez
  $$('.faq-list details').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('.faq-list details').forEach(o => { if (o !== d) o.open = false; }); }));

  // menu: item ativo conforme a seção
  const links = $$('.nav-pill a');
  const secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const navIO = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => navIO.observe(s));

  // ondas de cores: as 6 faixas da STAGE com as páginas correndo por cima (meio da página e rodapé)
  const WAVE_D = 'M-80 210 C 160 40, 380 40, 600 170 S 1000 300, 1220 150 S 1500 70, 1560 120';
  const WAVE_C = ['#FF3822', '#FF7F22', '#FFB320', '#1F97FF', '#1F4BFF', '#20FF8F'];
  $$('.wave').forEach((wave, wi) => {
    const dir = +wave.dataset.dir || 1;
    wave.innerHTML = `<svg viewBox="0 0 1440 320" preserveAspectRatio="none"><g fill="none" stroke-linecap="round">${WAVE_C.map((c, i) => `<path class="wp" d="${WAVE_D}" stroke="${c}" transform="${dir < 0 ? 'scale(1,-1) translate(0,-320) ' : ''}translate(0,${(i - 2.5) * 12})"/>`).join('')}</g></svg><div class="wave-thumbs"></div>`;
    const path = wave.querySelectorAll('.wp')[3], box = $('.wave-thumbs', wave);
    const N = small() ? 7 : 10, L = path.getTotalLength();
    const order = wi % 2 ? [4, 6, 0, 8, 2, 5, 1, 7, 3, 0] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 1];
    box.innerHTML = Array.from({ length: N }, (_, i) => `<span class="wt" data-pj="${order[i]}"><img src="img/t/${PROJETOS[order[i]].img}.webp" alt="" width="420" height="538" loading="lazy" decoding="async"></span>`).join('');
    const th = $$('.wt', box); let on = false; const t0 = performance.now();
    new IntersectionObserver(es => { on = es[0].isIntersecting; if (on) requestAnimationFrame(tick); }).observe(wave);
    function tick(now) {
      if (!on) return;
      const W = wave.clientWidth, H = wave.clientHeight, sx = W / 1440, sy = H / 320;
      const sp = reduce ? 0 : ((now - t0) / 1000) * 0.022 * dir;
      th.forEach((el, i) => {
        const f = (((i / N + sp) % 1) + 1) % 1, l = f * L, p = path.getPointAtLength(l), q = path.getPointAtLength(Math.min(L, l + 2));
        let y = p.y + 6, qy = q.y + 6;
        if (dir < 0) { y = 320 - y; qy = 320 - qy; }
        const a = Math.atan2((qy - y) * sy, (q.x - p.x) * sx) * 180 / Math.PI;
        el.style.transform = `translate(${p.x * sx}px, ${y * sy}px) rotate(${a}deg)`;
      });
      requestAnimationFrame(tick);
    }
  });

  // celular do "Pensada no celular": rola até o fim exato da página, sem sobrar branco
  const phImg = $('.ph-screen img');
  const fitPhone = () => { if (!phImg) return; const max = phImg.offsetHeight - phImg.parentElement.clientHeight; phImg.style.setProperty('--max', `${-Math.max(0, max)}px`); };
  if (phImg) { phImg.complete ? fitPhone() : phImg.addEventListener('load', fitPhone); addEventListener('resize', fitPhone); }

  if (!window.gsap || !window.ScrollTrigger || reduce) { intro = 1; return; }
  gsap.registerPlugin(ScrollTrigger);

  // rolagem suave
  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href'); const t = id.length > 1 && $(id); if (!t || a.hasAttribute('data-pj')) return;
      e.preventDefault(); lenis.scrollTo(t, { offset: id === '#topo' ? 0 : -20, duration: 1.6 });
    }));
  }

  // menu some ao descer e volta ao subir
  const nav = $('#nav'); let lastY = 0;
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => { const y = s.scroll(); nav.classList.toggle('hide', y > 600 && y > lastY && lead.hidden && pv.hidden); lastY = y; } });

  // abertura
  const o = { k: 0 };
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.nav > *', { y: -30, opacity: 0, duration: 1, stagger: .08 }, .1)
    .fromTo('.hero-title .ln > span', { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: .12 }, .2)
    .to(o, { k: 1, duration: 2.2, ease: 'expo.out', onUpdate: () => { intro = o.k; } }, .3)
    .add(() => { vel = -3.2; }, .5);

  // entradas ao rolar
  $$('[data-up]').forEach(el => gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } }));
  gsap.from('.stat', { y: 50, opacity: 0, scale: .96, duration: 1.1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.stats', start: 'top 92%' } });
  gsap.from('.aa-1', { y: 120, rotate: -14, opacity: 0, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: '.about-art', start: 'top 85%' } });
  gsap.from('.aa-2', { y: 160, rotate: 12, opacity: 0, duration: 1.5, delay: .1, ease: 'expo.out', scrollTrigger: { trigger: '.about-art', start: 'top 85%' } });
  gsap.from('.aa-chip', { scale: 0, duration: 1, stagger: .15, delay: .5, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.about-art', start: 'top 85%' } });
  gsap.to('.aa-2', { y: -60, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.case-left', { y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.cases', start: 'top 80%' } });
  gsap.from('.case-list li', { x: 40, opacity: 0, duration: 1, stagger: .05, ease: 'expo.out', scrollTrigger: { trigger: '.cases', start: 'top 75%' } });
  gsap.fromTo('.cases', { scale: .94 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.cases', start: 'top bottom', end: 'top 40%', scrub: true } });

  // passos empilhados: o card de trás encolhe quando o próximo chega
  const steps = $$('.step');
  steps.forEach((s, i) => {
    s.style.setProperty('--i', i); s.style.zIndex = i + 1;
    if (i < steps.length - 1) gsap.to(s, { scale: .94, ease: 'none', scrollTrigger: { trigger: steps[i + 1], start: 'top 90%', end: 'top 25%', scrub: true } });
  });
  gsap.from('.plan', { y: 100, opacity: 0, rotate: i => (i ? 3 : -3), duration: 1.3, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.plans', start: 'top 88%' } });
  gsap.fromTo('.rb-a', { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: '.ribbons', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.rb-b', { xPercent: 6 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: '.ribbons', start: 'top bottom', end: 'bottom top', scrub: true } });
  $$('.wave').forEach(w => gsap.from($$('.wp', w), { strokeDasharray: 3000, strokeDashoffset: 3000, duration: 2.4, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: w, start: 'top 85%' } }));
  gsap.from('.foot-big > *', { yPercent: 100, opacity: 0, duration: 1.3, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.foot-big', start: 'top 95%' } });

  addEventListener('load', () => { fitShot(); ScrollTrigger.refresh(); });
})();
