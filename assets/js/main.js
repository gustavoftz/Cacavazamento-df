/* =========================================================
   Caça Vazamentos DF — main.js
   ========================================================= */

/* ── Carrega nav e footer via fetch (sem SSI) ───────────── */
function loadIncludes() {
  var includes = [
    { id: 'nav-placeholder',    file: '/assets/includes/nav.html' },
    { id: 'footer-placeholder', file: '/assets/includes/footer.html' }
  ];
  includes.forEach(function(inc) {
    var el = document.getElementById(inc.id);
    if (!el) return;
    fetch(inc.file)
      .then(function(r) { return r.text(); })
      .then(function(html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var nodes = doc.body.childNodes;
        while (nodes.length) el.appendChild(document.adoptNode(nodes[0]));
        initNav();
        initWhatsApp();
        initFloatBtn();
      })
      .catch(function() {
        // silently fail — página ainda funciona sem includes
      });
  });
}
document.addEventListener('DOMContentLoaded', loadIncludes);


/* ── WhatsApp links parametrizados ─────────────────────── */
var WA_NUMBER = '5561996553440';

var WA_MESSAGES = {
  nav:        'Olá! Vim do site e gostaria de saber mais sobre o serviço de caça vazamento.',
  home:       'Olá! Vim do site e gostaria de saber mais sobre o serviço de caça vazamento.',
  preco:      'Olá! Vim do site e gostaria de receber uma estimativa de preço para o meu caso.',
  laudo:      'Olá! Preciso de vistoria com laudo técnico para revisão de conta na CAESB.',
  funciona:   'Olá! Gostaria de agendar uma vistoria de caça vazamento.',
  urgente:    'Olá! Tenho um caso urgente de vazamento e preciso de atendimento hoje.',
  condominio: 'Olá! Sou síndico e preciso de diagnóstico técnico para o meu condomínio.',
  celular:    'Olá! Vim do site e gostaria de agendar uma vistoria de caça vazamento.',
  sinais:     'Olá! Li o guia sobre vazamento oculto e gostaria de verificar meu imóvel.',
  regiao:     'Olá! Gostaria de uma estimativa para diagnóstico de vazamento no meu imóvel.',
  blog:       'Olá! Li um artigo no site e gostaria de solicitar uma vistoria.'
};

function openWhatsApp(el) {
  var page = (el && el.dataset && el.dataset.page) ? el.dataset.page : 'home';
  var msg = encodeURIComponent(WA_MESSAGES[page] || WA_MESSAGES.home);
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + msg, '_blank', 'noopener');
}

function initWhatsApp() {
  document.querySelectorAll('[data-page]').forEach(function(el) {
    if (el._waInit) return;
    el._waInit = true;
    el.addEventListener('click', function(e) {
      e.preventDefault();
      openWhatsApp(el);
    });
  });
}
document.addEventListener('DOMContentLoaded', initWhatsApp);


/* ── Menu mobile (hamburger) ────────────────────────────── */
function initNav() {
  var btn  = document.querySelector('.nav-hamburger');
  var menu = document.querySelector('.nav-links');
  if (!btn || !menu || btn._navInit) return;
  btn._navInit = true;

  btn.addEventListener('click', function() {
    var isOpen = menu.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.classList.toggle('is-open', isOpen);
  });

  menu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      menu.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-open');
    });
  });

  document.addEventListener('click', function(e) {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-open');
    }
  });
}
document.addEventListener('DOMContentLoaded', initNav);


/* ── CTA flutuante WhatsApp (mobile) ────────────────────── */
function initFloatBtn() {
  var floatBtn = document.querySelector('.whatsapp-float');
  if (!floatBtn || floatBtn._floatInit) return;
  floatBtn._floatInit = true;

  var hero = document.querySelector('.hero');
  if (!hero) { floatBtn.classList.add('visible'); return; }

  var observer = new IntersectionObserver(function(entries) {
    floatBtn.classList.toggle('visible', !entries[0].isIntersecting);
  }, { threshold: 0 });
  observer.observe(hero);
}
document.addEventListener('DOMContentLoaded', initFloatBtn);


/* ── Visual system enhancers for inner pages ────────────── */
function decoratePageChrome() {
  var body = document.body;
  if (!body) return;

  var hero = document.querySelector('.hero');
  var articleHeader = document.querySelector('.article-header');
  var context = getPageContext();

  if (articleHeader) {
    body.classList.add('page-standard');
    decorateArticleHeader(articleHeader, context);
  }

  if (hero && !hero.querySelector('.hero-shell')) {
    body.classList.add('page-standard');
    decorateStandardHero(hero, context);
  }
}

function decorateStandardHero(hero, context) {
  if (!hero || hero.dataset.decorated === 'true') return;

  var inner = hero.querySelector('.hero-inner');
  if (!inner) return;

  hero.dataset.decorated = 'true';
  hero.classList.add('hero-standard');

  var container = hero.querySelector('.container');
  if (!container) return;

  var shell = document.createElement('div');
  shell.className = 'hero-shell--standard';
  container.insertBefore(shell, inner);
  shell.appendChild(inner);

  var chips = Array.prototype.slice.call(inner.querySelectorAll('.chip'));
  var spotlight = document.createElement('aside');
  spotlight.className = 'hero-spotlight hero-spotlight--compact';
  spotlight.setAttribute('aria-label', 'Destaques da página');

  var heroConfig = getHeroConfig(context, chips);
  var proof = document.createElement('div');
  proof.className = 'hero-proof-card';
  proof.innerHTML =
    '<div class="hero-proof-card__eyebrow">' + escapeHtml(heroConfig.eyebrow) + '</div>' +
    '<div class="hero-proof-card__value">' + escapeHtml(heroConfig.value) + '</div>' +
    '<p>' + escapeHtml(heroConfig.body) + '</p>' +
    '<span class="hero-proof-card__kicker">' + escapeHtml(heroConfig.kicker) + '</span>';
  spotlight.appendChild(proof);

  var pillars = document.createElement('div');
  pillars.className = 'hero-pillars';
  heroConfig.pillars.forEach(function(pillar) {
    pillars.appendChild(createHeroPillar(pillar.label, pillar.text));
  });
  spotlight.appendChild(pillars);

  shell.appendChild(spotlight);
}

function createHeroPillar(label, text) {
  var item = document.createElement('div');
  item.className = 'hero-pillar';
  item.innerHTML = '<span>' + escapeHtml(label) + '</span><strong>' + escapeHtml((text || '').trim()) + '</strong>';
  return item;
}

function decorateArticleHeader(header, context) {
  if (!header || header.dataset.decorated === 'true') return;
  header.dataset.decorated = 'true';

  var lead = header.querySelector('.lead');
  if (!lead) return;

  var articleConfig = getArticleConfig(context);
  var meta = document.createElement('div');
  meta.className = 'article-meta';
  meta.innerHTML = articleConfig.map(function(item) {
    return '<span>' + escapeHtml(item) + '</span>';
  }).join('');
  lead.insertAdjacentElement('afterend', meta);
}

function getPageContext() {
  var path = window.location.pathname || '/';
  return {
    path: path,
    isHome: path === '/',
    isRegion: path.indexOf('/regioes/') === 0,
    isBlogIndex: path === '/blog' || path === '/blog/',
    isBlogArticle: path.indexOf('/blog/') === 0 && path !== '/blog/' && path !== '/blog',
    isPrice: path.indexOf('/preco-caca-vazamento-brasilia') === 0,
    isLaudo: path.indexOf('/laudo-caesb-revisao-conta') === 0,
    isProcess: path.indexOf('/como-funciona-caca-vazamento') === 0,
    isUrgent: path.indexOf('/caca-vazamento-urgente-brasilia') === 0,
    isApartment: path.indexOf('/caca-vazamento-apartamento-brasilia') === 0,
    isCondo: path.indexOf('/caca-vazamento-condominio-brasilia') === 0,
    isCellphone: path.indexOf('/caca-vazamento-pelo-celular') === 0,
    isSigns: path.indexOf('/como-identificar-vazamento-oculto-agua') === 0
  };
}

function getHeroConfig(context, chips) {
  var defaults = {
    eyebrow: 'Atendimento local',
    value: 'Brasília e DF',
    body: 'Diagnóstico com equipamento, estimativa antes da visita e orientação clara sobre o próximo passo.',
    kicker: 'Sem depoimentos por enquanto, então o foco visual aqui fica em processo, clareza e sinais de confiança.',
    pillars: [
      { label: 'Transparência', text: chips[0] ? chips[0].textContent : 'Faixa de preço antes do agendamento' },
      { label: 'Método', text: chips[1] ? chips[1].textContent : 'Diagnóstico com geofone e termografia' },
      { label: 'Segurança', text: chips[2] ? chips[2].textContent : 'Laudo técnico aceito pela CAESB' }
    ]
  };

  if (context.isPrice) {
    defaults.eyebrow = 'Transparência de preço';
    defaults.value = 'Valores claros';
    defaults.body = 'A página já mostra faixas reais e deixa claro o que entra no diagnóstico antes de qualquer visita.';
    defaults.pillars = [
      { label: 'Faixas', text: 'Apartamento, casa e condomínio com preço de referência' },
      { label: 'Incluso', text: 'Laudo técnico e vistoria com equipamentos' },
      { label: 'Sem surpresa', text: 'Conserto orçado só depois do diagnóstico' }
    ];
    return defaults;
  }

  if (context.isLaudo) {
    defaults.eyebrow = 'Documento técnico';
    defaults.value = 'Laudo CAESB';
    defaults.body = 'A revisão de conta depende da qualidade do documento, não apenas do protocolo feito junto à concessionária.';
    defaults.pillars = [
      { label: 'Formato', text: 'Localização precisa, método e evidências técnicas' },
      { label: 'Prazo', text: 'Laudo entregue no mesmo dia na maior parte dos casos' },
      { label: 'Objetivo', text: 'Apoiar o pedido de revisão com base técnica' }
    ];
    return defaults;
  }

  if (context.isProcess) {
    defaults.eyebrow = 'Processo definido';
    defaults.value = '4 etapas';
    defaults.body = 'Do primeiro contato ao laudo, cada parte do serviço existe para reduzir surpresa e evitar tentativa e erro.';
    defaults.pillars = [
      { label: 'Antes', text: 'Estimativa pelo WhatsApp antes de agendar' },
      { label: 'Durante', text: 'Leitura com instrumentos em vez de quebra por suspeita' },
      { label: 'Depois', text: 'Laudo e orientação clara sobre reparo' }
    ];
    return defaults;
  }

  if (context.isUrgent) {
    defaults.eyebrow = 'Atendimento urgente';
    defaults.value = 'Mesmo dia';
    defaults.body = 'Quando há agenda disponível, a confirmação acontece em tempo real pelo WhatsApp, sem empurrar promessa vaga.';
    defaults.pillars = [
      { label: 'Prioridade', text: 'Conta disparada, mancha crescendo ou som contínuo de água' },
      { label: 'Clareza', text: 'Disponibilidade confirmada em tempo real' },
      { label: 'Preço', text: 'Urgência não muda o valor da vistoria' }
    ];
    return defaults;
  }

  if (context.isRegion) {
    defaults.eyebrow = 'Cobertura local';
    defaults.value = 'Atendimento na região';
    defaults.body = 'Página pensada para a realidade da região, com sintomas frequentes e contexto de imóveis típicos do local.';
    defaults.pillars = [
      { label: 'Contexto', text: chips[0] ? chips[0].textContent : 'Atendimento especializado no DF' },
      { label: 'Diagnóstico', text: chips[1] ? chips[1].textContent : 'Leitura com equipamento, sem quebra desnecessária' },
      { label: 'Laudo', text: chips[2] ? chips[2].textContent : 'Documento técnico para revisão de conta' }
    ];
    return defaults;
  }

  if (context.isBlogIndex) {
    defaults.eyebrow = 'Conteúdo útil';
    defaults.value = 'Guias práticos';
    defaults.body = 'O blog agora acompanha a mesma linguagem visual do site principal, com leitura mais editorial e direta.';
    defaults.pillars = [
      { label: 'Tom', text: 'Sem enrolação e sem jargão desnecessário' },
      { label: 'Base', text: 'Conteúdo inspirado em casos reais do DF' },
      { label: 'Próximo passo', text: 'Leitura para ajudar antes do contato' }
    ];
    return defaults;
  }

  if (context.isApartment) {
    defaults.eyebrow = 'Diagnóstico em apartamento';
    defaults.value = 'Entre unidades';
    defaults.body = 'Quando a umidade aparece em teto, parede ou laje, o desafio é localizar a origem certa antes de abrir qualquer ponto.';
    return defaults;
  }

  if (context.isCondo) {
    defaults.eyebrow = 'Condomínios e síndicos';
    defaults.value = 'Áreas comuns';
    defaults.body = 'A página agora apresenta o serviço com mais peso institucional para combinar com o perfil de síndicos e administradoras.';
    return defaults;
  }

  if (context.isCellphone || context.isSigns) {
    defaults.eyebrow = 'Diagnóstico orientado';
    defaults.value = 'Sem adivinhação';
    defaults.body = 'Mesmo nas páginas mais educativas, a nova lateral ajuda a reforçar clareza, método e segurança para o visitante.';
    return defaults;
  }

  return defaults;
}

function getArticleConfig(context) {
  if (context.isBlogArticle) {
    return [
      'Conteúdo técnico e direto',
      'Baseado em atendimento no DF',
      'Leitura prática para decidir o próximo passo'
    ];
  }

  return [
    'Conteúdo objetivo',
    'Leitura guiada',
    'Próximo passo mais claro'
  ];
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
document.addEventListener('DOMContentLoaded', decoratePageChrome);


/* ── FAQ accordion ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  var details = document.querySelectorAll('.faq details');
  details.forEach(function(d) {
    d.addEventListener('toggle', function() {
      if (d.open) {
        details.forEach(function(other) {
          if (other !== d) other.open = false;
        });
      }
    });
  });
});
