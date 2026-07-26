/* Guía de Estados HTTP · EncomiExpress
   JS compartido por index.html, categorias.html y codigos-asignados.html */

document.addEventListener('DOMContentLoaded', function () {
  initNavToggle();
  highlightActiveNavLink();
  initBackToTop();
  initCodeSearch();
});

/* Menú hamburguesa: abre/cierra la navegación en móvil */
function initNavToggle() {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav-links');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  /* cerrar el menú al elegir una página */
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    });
  });
}

/* Resalta en la navegación la página que se está viendo */
function highlightActiveNavLink() {
  var links = document.querySelectorAll('nav.links a');
  if (!links.length) return;

  var current = location.pathname.split('/').pop();
  if (current === '') current = 'index.html';

  links.forEach(function (link) {
    var href = link.getAttribute('href');
    link.classList.toggle('active', href === current);
  });
}

/* Botón flotante "volver arriba", visible tras hacer scroll */
function initBackToTop() {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;

  var toggleVisibility = function () {
    btn.classList.toggle('visible', window.scrollY > 400);
  };
  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Buscador/filtro en vivo de la tabla de códigos asignados,
   por número de código o por texto de la descripción */
function initCodeSearch() {
  var input = document.getElementById('code-search');
  var table = document.getElementById('codes-table');
  if (!input || !table) return;

  var tbody = table.querySelector('tbody');
  var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
  var countEl = document.getElementById('search-count');

  var noMatchRow = document.createElement('tr');
  noMatchRow.className = 'no-match-row';
  noMatchRow.innerHTML = '<td colspan="3">No se encontraron códigos que coincidan con la búsqueda.</td>';
  noMatchRow.hidden = true;
  tbody.appendChild(noMatchRow);

  var updateCount = function (visible) {
    if (countEl) countEl.textContent = visible + ' de ' + rows.length + ' códigos';
  };

  var filterRows = function () {
    var term = input.value.trim().toLowerCase();
    var visible = 0;

    rows.forEach(function (row) {
      var matches = row.textContent.toLowerCase().indexOf(term) !== -1;
      row.hidden = !matches;
      if (matches) visible++;
    });

    noMatchRow.hidden = visible !== 0;
    updateCount(visible);
  };

  updateCount(rows.length);
  input.addEventListener('input', filterRows);
}
