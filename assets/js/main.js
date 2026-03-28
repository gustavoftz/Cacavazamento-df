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

  decorateConversionPaths(context);
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

  spotlight.appendChild(createHeroIllustrationCard(context));

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

  if (context.isBlogArticle) {
    meta.insertAdjacentElement('afterend', createArticleVisualBreak(context));
  }
}

function createHeroIllustrationCard(context) {
  return document.createDocumentFragment();
}

function createArticleVisualBreak(context) {
  var config = getArticleVisualConfig(context);
  var box = document.createElement('div');
  box.className = 'article-visual-break';
  box.innerHTML =
    '<div class="article-visual-break__content">' +
      '<strong>' + escapeHtml(config.title) + '</strong>' +
      '<p>' + escapeHtml(config.body) + '</p>' +
      '<ul class="article-visual-break__list">' +
        config.points.map(function(point) {
          return '<li>' + escapeHtml(point) + '</li>';
        }).join('') +
      '</ul>' +
    '</div>' +
    '<img src="' + escapeHtml(config.src) + '" alt="' + escapeHtml(config.alt) + '">';
  return box;
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
    kicker: 'Atendimento com processo claro, comunicação direta e foco em diagnóstico sem quebra desnecessária.',
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

function getArticleVisualConfig(context) {
  var defaults = {
    src: '/assets/img/illustration-guia.svg',
    alt: 'Ilustração editorial com checklist técnico',
    title: 'O objetivo aqui é reduzir tentativa e erro',
    body: 'Cada guia ajuda você a separar sintoma, teste simples e o momento certo de chamar um diagnóstico com equipamento.',
    points: [
      'Entender o problema antes de gastar com reparo errado',
      'Saber quando a situação pede laudo técnico',
      'Chegar no WhatsApp já com contexto claro do caso'
    ]
  };

  if (context.path.indexOf('/blog/revisao-conta-agua-caesb-como-pedir') === 0) {
    defaults.title = 'Na revisão da CAESB, o documento pesa mais do que o protocolo';
    defaults.body = 'O pedido até pode ser aberto sem laudo, mas a chance de indeferimento aumenta quando faltam localização precisa, método e evidências.';
    defaults.points = [
      'Laudo completo ajuda a delimitar o período analisado',
      'Histórico de consumo e comprovantes reforçam o caso',
      'Quanto antes detectar, menor a perda de água e dinheiro'
    ];
  } else if (context.path.indexOf('/blog/conta-de-agua-alta-o-que-fazer') === 0) {
    defaults.title = 'Conta alta pede teste rápido e ação sem demora';
    defaults.body = 'Se o hidrômetro seguir girando com tudo fechado, cada dia sem diagnóstico tende a virar mais água perdida e mais conta acumulada.';
    defaults.points = [
      'Teste do hidrômetro antes de chamar qualquer reparo',
      'Laudo técnico quando o vazamento está oculto',
      'Estimativa pelo WhatsApp antes de agendar a visita'
    ];
  }

  return defaults;
}

function decorateConversionPaths(context) {
  decoratePricingSection(context);
  decorateFaqAssurance(context);

  if (context.isRegion) {
    enhanceRegionPage(context);
  }

  if (context.isBlogArticle) {
    enhanceBlogArticle(context);
  }

  if (context.isBlogIndex) {
    enhanceBlogIndex(context);
  }
}

function decoratePricingSection(context) {
  if (!context.isHome && !context.isPrice) return;

  var cards = document.querySelector('.price-cards');
  if (!cards || cards.dataset.enhanced === 'true') return;
  cards.dataset.enhanced = 'true';

  var band = createConversionBand({
    eyebrow: 'Confirmação rápida pelo WhatsApp',
    title: context.isPrice ? 'Receba a faixa certa antes de reservar horário' : 'Se o preço já faz sentido, o próximo passo é confirmar a faixa do seu caso',
    body: context.isPrice
      ? 'Descreva tipo de imóvel, sintoma e região. A resposta já sai com previsão de faixa, prazo e se o atendimento no mesmo dia é viável.'
      : 'Você pode validar o caso pelo WhatsApp sem custo para consultar e sem deixar o agendamento em aberto.',
    page: 'preco',
    primary: context.isPrice ? 'Confirmar valor pelo WhatsApp' : 'Confirmar estimativa pelo WhatsApp',
    secondaryHref: '/como-funciona-caca-vazamento',
    secondaryText: 'Entender como funciona',
    proof: [
      'Sem cobrança para consultar',
      'Não achou, não cobra',
      'Conserto só depois do diagnóstico'
    ]
  });

  cards.insertAdjacentElement('afterend', band);
}

function decorateFaqAssurance(context) {
  var faq = document.querySelector('.faq');
  if (!faq || faq.nextElementSibling && faq.nextElementSibling.classList && faq.nextElementSibling.classList.contains('faq-assurance')) return;

  var config = getFaqAssuranceConfig(context);
  var box = document.createElement('div');
  box.className = 'faq-assurance';
  box.innerHTML =
    '<div class="faq-assurance__title">' + escapeHtml(config.title) + '</div>' +
    '<p>' + escapeHtml(config.body) + '</p>' +
    '<button class="btn-primary" data-page="' + escapeHtml(config.page) + '">' + escapeHtml(config.primary) + '</button>' +
    '<a href="' + escapeHtml(config.secondaryHref) + '" class="btn-ghost">' + escapeHtml(config.secondaryText) + '</a>';
  faq.insertAdjacentElement('afterend', box);
}

function enhanceRegionPage(context) {
  var ctaStrip = document.querySelector('.cta-strip');
  if (ctaStrip && !(ctaStrip.previousElementSibling && ctaStrip.previousElementSibling.querySelector && ctaStrip.previousElementSibling.querySelector('.resource-links'))) {
    ctaStrip.insertAdjacentElement('beforebegin', createResourceLinks({
      label: 'Antes de agendar',
      title: 'Veja o que costuma ajudar antes da vistoria',
      body: 'Esses links respondem às perguntas que mais travam a decisão: preço, laudo e como funciona o diagnóstico sem quebra.',
      cards: [
        { href: '/preco-caca-vazamento-brasilia', title: 'Preço do diagnóstico', text: 'Faixas por tipo de imóvel e o que entra no valor' },
        { href: '/como-funciona-caca-vazamento', title: 'Como funciona', text: 'Do WhatsApp ao laudo, sem surpresa na visita' },
        { href: '/laudo-caesb-revisao-conta', title: 'Laudo CAESB', text: 'Quando ele importa e o que vem no documento' }
      ]
    }, true));
  }
}

function enhanceBlogArticle(context) {
  var articleBody = document.querySelector('.article-body');
  if (!articleBody) return;

  var related = articleBody.querySelector('.related-articles');
  if (related && !(related.previousElementSibling && related.previousElementSibling.classList && related.previousElementSibling.classList.contains('resource-links'))) {
    related.insertAdjacentElement('beforebegin', createResourceLinks(getBlogArticleLinks(context), false));
  }
}

function enhanceBlogIndex() {
  var grid = document.querySelector('.blog-grid');
  if (!grid || grid.previousElementSibling && grid.previousElementSibling.classList && grid.previousElementSibling.classList.contains('blog-quick-start')) return;

  var intro = document.createElement('div');
  intro.className = 'blog-quick-start';
  intro.innerHTML =
    '<span class="label">Comece por aqui</span>' +
    '<h2>Leituras rápidas para decidir melhor</h2>' +
    '<p>Se você está comparando preço, tentando entender se precisa de laudo ou quer saber como funciona o diagnóstico, estes atalhos encurtam o caminho.</p>' +
    '<div class="blog-quick-grid">' +
      createResourceCard('/preco-caca-vazamento-brasilia', 'Preço do diagnóstico', 'Faixas de valor, o que entra e o que fica para o reparo') +
      createResourceCard('/como-funciona-caca-vazamento', 'Como funciona a vistoria', 'Equipamentos, etapas e o que esperar da visita') +
      createResourceCard('/laudo-caesb-revisao-conta', 'Laudo CAESB', 'Quando o documento pesa na revisão da conta de água') +
    '</div>';
  grid.insertAdjacentElement('beforebegin', intro);
}

function getFaqAssuranceConfig(context) {
  if (context.isPrice) {
    return {
      title: 'Ainda comparando opções? O preço exato pode ser confirmado sem marcar visita.',
      body: 'A mensagem ideal já traz tipo de imóvel, região e sintoma principal. Com isso, você recebe faixa de valor e entende se vale agir agora ou apenas monitorar.',
      page: 'preco',
      primary: 'Confirmar valor pelo WhatsApp',
      secondaryHref: '/blog/conta-de-agua-alta-o-que-fazer',
      secondaryText: 'Ver o que testar antes'
    };
  }

  if (context.isBlogArticle) {
    return {
      title: 'Se o conteúdo bate com o seu caso, não precisa adivinhar o próximo passo.',
      body: 'Descreva o sintoma pelo WhatsApp e receba orientação inicial com faixa de preço antes de qualquer visita. Isso ajuda a agir cedo e evita deixar o problema crescer.',
      page: 'blog',
      primary: 'Falar sobre meu caso',
      secondaryHref: '/preco-caca-vazamento-brasilia',
      secondaryText: 'Ver preço do diagnóstico'
    };
  }

  if (context.isRegion) {
    return {
      title: 'Atendimento na região com clareza antes da visita.',
      body: 'Confirmamos faixa de preço, se o laudo faz sentido no seu caso e se há agenda no mesmo dia. Sem compromisso para consultar.',
      page: 'regiao',
      primary: 'Solicitar estimativa agora',
      secondaryHref: '/preco-caca-vazamento-brasilia',
      secondaryText: 'Conferir faixas de preço'
    };
  }

  return {
    title: 'Ainda com dúvida? O atendimento pelo WhatsApp já resolve o primeiro filtro.',
    body: 'Você pode validar o caso, confirmar preço e entender se precisa do laudo sem marcar visita de imediato.',
    page: 'home',
    primary: 'Falar no WhatsApp',
    secondaryHref: '/como-funciona-caca-vazamento',
    secondaryText: 'Ver como funciona'
  };
}

function getBlogArticleLinks(context) {
  var base = {
    label: 'Próximo passo',
    title: 'Links úteis para sair da leitura e decidir',
    body: 'Se você quer entender custo, processo ou quando o laudo entra na história, estes atalhos ajudam sem precisar voltar para o menu.',
    cards: [
      { href: '/preco-caca-vazamento-brasilia', title: 'Preço do diagnóstico', text: 'Faixas reais e o que está incluso na vistoria' },
      { href: '/como-funciona-caca-vazamento', title: 'Como funciona a vistoria', text: 'Etapas, equipamentos e o que acontece na visita' },
      { href: '/laudo-caesb-revisao-conta', title: 'Laudo técnico CAESB', text: 'Quando o documento importa para revisão de conta' }
    ]
  };

  if (context.path.indexOf('/blog/revisao-conta-agua-caesb-como-pedir') === 0) {
    base.cards[2] = { href: '/caca-vazamento-apartamento-brasilia', title: 'Diagnóstico em apartamento', text: 'Um dos cenários mais comuns para conta alta e laudo CAESB' };
  }

  return base;
}

function createConversionBand(config) {
  var band = document.createElement('div');
  band.className = 'conversion-band';
  band.innerHTML =
    '<span class="label conversion-band__eyebrow">' + escapeHtml(config.eyebrow) + '</span>' +
    '<div class="conversion-band__grid">' +
      '<div>' +
        '<h3>' + escapeHtml(config.title) + '</h3>' +
        '<p>' + escapeHtml(config.body) + '</p>' +
        '<div class="conversion-proof">' +
          config.proof.map(function(item) {
            return '<span>' + escapeHtml(item) + '</span>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="conversion-band__actions">' +
        '<button class="btn-primary" data-page="' + escapeHtml(config.page) + '">' + escapeHtml(config.primary) + '</button>' +
        '<a href="' + escapeHtml(config.secondaryHref) + '" class="btn-ghost">' + escapeHtml(config.secondaryText) + '</a>' +
      '</div>' +
    '</div>';
  return band;
}

function createResourceLinks(config, asSection) {
  if (asSection) {
    var section = document.createElement('section');
    section.className = 'bg-white';
    section.innerHTML =
      '<div class="container">' +
        createResourceLinksInner(config) +
      '</div>';
    return section;
  }

  var wrap = document.createElement('div');
  wrap.innerHTML = createResourceLinksInner(config);
  return wrap.firstElementChild;
}

function createResourceLinksInner(config) {
  return '<div class="resource-links">' +
    '<span class="label">' + escapeHtml(config.label) + '</span>' +
    '<h2>' + escapeHtml(config.title) + '</h2>' +
    '<p>' + escapeHtml(config.body) + '</p>' +
    '<div class="resource-links__grid">' +
      config.cards.map(function(card) {
        return createResourceCard(card.href, card.title, card.text);
      }).join('') +
    '</div>' +
  '</div>';
}

function createResourceCard(href, title, text) {
  return '<a href="' + escapeHtml(href) + '" class="resource-card"><strong>' + escapeHtml(title) + '</strong><span>' + escapeHtml(text) + '</span></a>';
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
