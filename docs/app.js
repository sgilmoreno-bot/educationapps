/* Dibuja la biblioteca a partir de datos/catalogo.js. No hace falta tocar este archivo para añadir apps.
   Direcciones: #/            → los cursos
                #/3-eso       → las asignaturas de un curso
                #/3-eso/lengua → las apps de esa asignatura */
(function () {
  'use strict';

  var CURSOS = window.CURSOS || [];
  // Las apps con «publicar: false» no se muestran.
  var APPS = (window.APPS || []).filter(function (a) { return a.publicar !== false; });
  var ENL = window.ENLACES || {};
  var DESC = window.DESCARGAS || {};
  var CONTADOR_ACTIVO = !!(DESC.usuario && DESC.repositorio);
  var cuentas = null; // { 'archivo.zip': número de descargas } cuando GitHub responde

  var $contenido = document.getElementById('contenido');
  var $estado = document.getElementById('estado');
  var $q = document.getElementById('q');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function normal(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function peso(b) {
    if (!b) return '';
    if (b < 1024 * 1024) return Math.max(1, Math.round(b / 1024)) + ' KB';
    return (b / 1048576).toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' MB';
  }
  function plural(n, uno, varios) { return n + ' ' + (n === 1 ? uno : varios); }
  function buscar(lista, id) { for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i]; return null; }
  function archivoDe(a) { return (a.zip || '').split('/').pop(); }
  function urlZip(a) {
    if (!CONTADOR_ACTIVO) return a.zip;
    return 'https://github.com/' + encodeURIComponent(DESC.usuario) + '/' + encodeURIComponent(DESC.repositorio) +
      '/releases/download/' + encodeURIComponent(DESC.etiqueta || 'apps') + '/' + encodeURIComponent(archivoDe(a));
  }
  function textoDescargas(n) {
    return n.toLocaleString('es-ES') + (n === 1 ? ' descarga' : ' descargas');
  }
  function appsDe(cursoId, asigId) {
    return APPS.filter(function (a) { return a.curso === cursoId && (!asigId || a.asignatura === asigId); });
  }

  /* ---------- Piezas ---------- */
  function ficha(a, conEtiquetas) {
    var curso = buscar(CURSOS, a.curso);
    var asig = curso ? buscar(curso.asignaturas, a.asignatura) : null;
    var tam = peso(a.peso);
    var etiquetas = '';
    if (conEtiquetas && curso) etiquetas += '<span class="etiqueta etiqueta--asig">' + esc(curso.nombre) + '</span>';
    if (conEtiquetas && asig) etiquetas += '<span class="etiqueta">' + esc(asig.nombre) + '</span>';
    if (a.idioma) etiquetas += '<span class="etiqueta">' + esc(a.idioma) + '</span>';

    var meta = 'Descomprime el ZIP y abre <code>' + esc(a.abrir || 'index.html') + '</code>.';
    if (a.nota) meta += ' ' + esc(a.nota);

    var nombreArchivo = archivoDe(a);
    var n = cuentas && cuentas[nombreArchivo] != null ? cuentas[nombreArchivo] : null;
    return '<li class="ficha">' +
      '<div class="ficha__texto">' +
        (etiquetas ? '<div class="ficha__etiquetas">' + etiquetas + '</div>' : '') +
        '<h3>' + esc(a.nombre) + '</h3>' +
        '<p>' + esc(a.descripcion) + '</p>' +
        '<p class="ficha__meta">' + meta + '</p>' +
      '</div>' +
      '<div class="ficha__accion">' +
        '<a class="marcador" href="' + esc(urlZip(a)) + '" download="' + esc(nombreArchivo) + '"' +
          ' aria-label="Descargar ' + esc(a.nombre) + ' (ZIP' + (tam ? ', ' + tam : '') + ')">Descargar</a>' +
        (tam ? '<span class="ficha__peso">ZIP · ' + tam + '</span>' : '') +
        (CONTADOR_ACTIVO ? '<span class="ficha__descargas" data-archivo="' + esc(nombreArchivo) + '"' +
          (n == null ? ' hidden>' : '>') + (n == null ? '' : textoDescargas(n)) + '</span>' : '') +
      '</div>' +
    '</li>';
  }

  function carpeta(href, nombre, n, detalle, grande) {
    var cuenta = n ? plural(n, 'aplicación', 'aplicaciones') : 'Próximamente';
    var clase = 'carpeta' + (grande ? ' carpeta--grande' : '') + (n ? '' : ' carpeta--vacia');
    var interior = '<span class="carpeta__nombre">' + esc(nombre) + '</span>' +
      '<span class="carpeta__cuenta">' + cuenta + '</span>' +
      (detalle ? '<span class="carpeta__cursos">' + esc(detalle) + '</span>' : '');
    // Una carpeta vacía no es un enlace: no lleva a ninguna parte.
    return '<li>' + (n ? '<a class="' + clase + '" href="' + href + '">' + interior + '</a>'
                       : '<div class="' + clase + '">' + interior + '</div>') + '</li>';
  }

  function migas(curso, asig) {
    var html = '<nav class="migas" aria-label="Estás en"><a href="#/">Todos los cursos</a>';
    if (asig) html += ' <span aria-hidden="true">/</span> <a href="#/' + esc(curso.id) + '">' + esc(curso.nombre) + '</a>';
    return html + '</nav>';
  }

  /* ---------- Vistas ---------- */
  function vistaCursos() {
    $contenido.innerHTML = '<ul class="carpetas carpetas--cursos">' + CURSOS.map(function (c) {
      var conApps = c.asignaturas.filter(function (s) { return appsDe(c.id, s.id).length; }).length;
      return carpeta('#/' + esc(c.id), c.nombre, appsDe(c.id).length,
        plural(c.asignaturas.length, 'asignatura', 'asignaturas') + ' · ' + conApps + ' con apps', true);
    }).join('') + '</ul>';
    $estado.textContent = plural(APPS.length, 'aplicación', 'aplicaciones') + ' en ' + plural(CURSOS.length, 'curso', 'cursos') + '.';
  }

  function titulo(texto) { return '<h2 class="rotulo" id="t-carpeta" tabindex="-1"><mark>' + esc(texto) + '</mark></h2>'; }

  function vistaCurso(curso) {
    $contenido.innerHTML = migas(curso) + titulo(curso.nombre) +
      '<ul class="carpetas">' + curso.asignaturas.map(function (s) {
        return carpeta('#/' + esc(curso.id) + '/' + esc(s.id), s.nombre, appsDe(curso.id, s.id).length, '', false);
      }).join('') + '</ul>';
    $estado.textContent = plural(appsDe(curso.id).length, 'aplicación', 'aplicaciones') + ' en ' + curso.nombre + '.';
  }

  function vistaAsignatura(curso, asig) {
    var lista = appsDe(curso.id, asig.id);
    $contenido.innerHTML = migas(curso, asig) + titulo(asig.nombre) +
      '<p class="subtitulo">' + esc(curso.nombre) + '</p>' +
      (lista.length
        ? '<ul class="fichas">' + lista.map(function (a) { return ficha(a, false); }).join('') + '</ul>'
        : '<p class="vacio">Todavía no hay aplicaciones en esta carpeta. ¿Tienes una? <a href="#sube">Súbela</a>.</p>');
    $estado.textContent = plural(lista.length, 'aplicación', 'aplicaciones') + ' en ' + asig.nombre + ', ' + curso.nombre + '.';
  }

  function vistaBusqueda(q) {
    var palabras = normal(q).split(/\s+/).filter(Boolean);
    var res = APPS.filter(function (a) {
      var curso = buscar(CURSOS, a.curso);
      var asig = curso ? buscar(curso.asignaturas, a.asignatura) : null;
      var texto = normal([a.nombre, a.descripcion, a.idioma, curso && curso.nombre, asig && asig.nombre].join(' '));
      return palabras.every(function (p) { return texto.indexOf(p) >= 0; });
    });
    $contenido.innerHTML = res.length
      ? '<ul class="fichas">' + res.map(function (a) { return ficha(a, true); }).join('') + '</ul>'
      : '<p class="vacio">No hay ninguna app que coincida. Prueba con otra palabra o <a href="#/">mira todos los cursos</a>.</p>';
    $estado.textContent = res.length
      ? plural(res.length, 'resultado', 'resultados') + ' para «' + q.trim() + '».'
      : 'Sin resultados para «' + q.trim() + '».';
  }

  /* ---------- Navegación ---------- */
  function ruta() {
    var m = location.hash.match(/^#\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?/);
    return m ? { curso: m[1], asig: m[2] || null } : null;
  }

  function pintar(enfocar) {
    var q = $q.value.trim();
    if (q) return vistaBusqueda(q);
    var r = ruta();
    var curso = r && buscar(CURSOS, r.curso);
    var asig = curso && r.asig ? buscar(curso.asignaturas, r.asig) : null;
    if (r && (!curso || (r.asig && !asig))) { location.hash = '#/'; return; }
    if (asig) vistaAsignatura(curso, asig);
    else if (curso) vistaCurso(curso);
    else vistaCursos();
    if (enfocar) { var t = document.getElementById('t-carpeta'); if (t) t.focus({ preventScroll: true }); }
  }

  window.addEventListener('hashchange', function () {
    var h = location.hash;
    if (h.indexOf('#/') !== 0) return; // anclas normales (#sube…)
    $q.value = '';
    pintar(true);
    var b = document.getElementById('biblioteca');
    if (h !== '#/' || window.scrollY > b.offsetTop) b.scrollIntoView({ block: 'start' });
  });

  var temporizador;
  $q.addEventListener('input', function () { clearTimeout(temporizador); temporizador = setTimeout(function () { pintar(false); }, 120); });
  $q.addEventListener('keydown', function (e) { if (e.key === 'Escape') { $q.value = ''; pintar(false); } });

  /* ---------- Enlace externo (Sube tu app) ---------- */
  function enlaceExterno(idEl, url) {
    var el = document.getElementById(idEl);
    if (!el) return;
    if (url) {
      el.href = url; el.target = '_blank'; el.rel = 'noopener';
      el.setAttribute('aria-label', el.textContent + ' (se abre en una pestaña nueva)');
    } else {
      el.removeAttribute('href');
      el.setAttribute('aria-disabled', 'true');
      el.setAttribute('role', 'link');
      el.insertAdjacentHTML('afterend', '<span class="proximamente">Próximamente.</span>');
    }
  }
  enlaceExterno('enlace-sube', ENL.subeTuApp);

  /* ---------- Contador de descargas (GitHub Releases, sin coste) ----------
     Una sola petición por visita a la API pública de GitHub; se guarda 10 minutos
     en el navegador. Si falla, la web funciona igual y no muestra contadores. */
  function aplicarCuentas(datos) {
    cuentas = datos;
    var spans = document.querySelectorAll('.ficha__descargas');
    for (var i = 0; i < spans.length; i++) {
      var n = cuentas[spans[i].getAttribute('data-archivo')];
      if (n != null) { spans[i].textContent = textoDescargas(n); spans[i].hidden = false; }
    }
  }
  function cargarCuentas() {
    if (!CONTADOR_ACTIVO || !window.fetch) return;
    var clave = 'descargas:' + DESC.usuario + '/' + DESC.repositorio + '@' + (DESC.etiqueta || 'apps');
    try {
      var guardado = JSON.parse(sessionStorage.getItem(clave) || 'null');
      if (guardado && Date.now() - guardado.t < 10 * 60 * 1000) { aplicarCuentas(guardado.d); return; }
    } catch (e) { /* sin almacenamiento: se pide a GitHub */ }
    fetch('https://api.github.com/repos/' + encodeURIComponent(DESC.usuario) + '/' + encodeURIComponent(DESC.repositorio) +
          '/releases/tags/' + encodeURIComponent(DESC.etiqueta || 'apps'), { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (rel) {
        var d = {};
        (rel.assets || []).forEach(function (as) { d[as.name] = as.download_count || 0; });
        try { sessionStorage.setItem(clave, JSON.stringify({ t: Date.now(), d: d })); } catch (e) { /* */ }
        aplicarCuentas(d);
      })
      .catch(function () { /* sin contador: no pasa nada */ });
  }
  cargarCuentas();

  /* ---------- Carpetas pequeñas de la portada (se generan desde CURSOS) ---------- */
  var $accesos = document.getElementById('accesos-cursos');
  if ($accesos) {
    $accesos.innerHTML = CURSOS.map(function (c) {
      var n = appsDe(c.id).length;
      return '<li><a class="mini-carpeta" href="#/' + esc(c.id) + '">' +
        '<span class="mini-carpeta__nombre">' + esc(c.nombre) + '</span>' +
        '<span class="mini-carpeta__cuenta">' + (n ? plural(n, 'app', 'apps') : 'Próximamente') + '</span>' +
      '</a></li>';
    }).join('');
  }

  pintar(false);
  if (ruta()) document.getElementById('biblioteca').scrollIntoView({ block: 'start' });
})();
