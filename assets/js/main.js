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
