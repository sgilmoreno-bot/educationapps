/* =====================================================================
   CATÁLOGO DE LA BIBLIOTECA
   Este es el ÚNICO archivo que hay que tocar para añadir o cambiar apps.
   El diseño se genera solo a partir de estos datos.
   Instrucciones paso a paso: COMO_AÑADIR_UNA_APP.md (carpeta del proyecto).
   ===================================================================== */

/* Enlace de «Sube tu app». Si está vacío (''), el botón muestra
   «Próximamente» y no lleva a ningún sitio. */
window.ENLACES = {
  subeTuApp: ''    // p. ej. el enlace de tu formulario de Google Forms
};

/* Contador de descargas (gratuito, con GitHub Releases).
   Cuando la web se publique en GitHub, los ZIP se suben a una «release»
   y GitHub cuenta cada descarga. Rellena estos tres datos y la web:
     · descargará los ZIP desde esa release, y
     · mostrará en cada ficha cuántas veces se ha descargado.
   Mientras «usuario» esté vacío, los ZIP se descargan desde docs/descargas/
   y no se muestra ningún contador. */
window.DESCARGAS = {
  usuario: 'sgilmoreno-bot',    // usuario de GitHub
  repositorio: 'educationapps', // nombre del repositorio de la web
  etiqueta: 'apps'    // etiqueta (tag) de la release donde están los ZIP
};

/* Carpetas principales (cursos) y, dentro de cada una, sus asignaturas.
   El orden de las listas es el orden en la web.
   id: palabra corta sin espacios ni tildes (se usa en la dirección).
   Una asignatura sin apps se muestra como «Próximamente». */
window.CURSOS = [
  {
    id: '6-primaria', nombre: '6.º Primaria',
    asignaturas: [
      { id: 'lengua',      nombre: 'Lengua' },
      { id: 'ingles',      nombre: 'Inglés' },
      { id: 'social',      nombre: 'Social' },
      { id: 'sciences',    nombre: 'Sciences' },
      { id: 'matematicas', nombre: 'Matemáticas' }
    ]
  },
  {
    id: '3-eso', nombre: '3.º ESO',
    asignaturas: [
      { id: 'fisica-quimica', nombre: 'Física y Química' },
      { id: 'lengua',         nombre: 'Lengua' },
      { id: 'historia',       nombre: 'Historia' },
      { id: 'matematicas',    nombre: 'Matemáticas' },
      { id: 'tecnologia',     nombre: 'Tecnología' },
      { id: 'biologia',       nombre: 'Biología' },
      { id: 'ingles',         nombre: 'Inglés' }
    ]
  }
];

/* Aplicaciones. Campos:
   nombre       título visible
   curso        id de un curso de arriba
   asignatura   id de una asignatura de ese curso
   descripcion  una o dos frases
   zip          ruta al ZIP dentro de docs/  (lo crea herramientas/empaquetar.sh)
   peso         bytes del ZIP (lo indica empaquetar.sh); opcional
   abrir        archivo que hay que abrir tras descomprimir
   idioma       opcional
   nota         opcional: aviso breve
   fecha        opcional: día en que se añadió, 'AAAA-MM-DD'. Las apps con fecha
                de los últimos 30 días salen en el aviso «Últimos temas subidos» de la portada
                (las 3 más recientes). Pasados 30 días, el aviso desaparece solo.
   publicar     opcional: false = la app NO aparece en la web (p. ej. pendiente
                de revisar derechos). Su ZIP se guarda fuera de docs/, en pendientes/. */
window.APPS = [
  {
    nombre: 'Lengua · Tema 2: la literatura',
    curso: '6-primaria',
    asignatura: 'lengua',
    descripcion: 'Qué es la literatura, para qué sirve y sus géneros, con pasos cortos, ejemplos e ilustraciones. Contenido adaptado para alumnado con TEL.',
    zip: 'descargas/lengua-tema-2-literatura.zip',
    peso: 63365,
    abrir: 'Lengua-Tema-2.html',
    nota: 'Lee los textos en voz alta con la voz de tu ordenador.'
  },
  {
    nombre: 'Ciencias · La electricidad',
    curso: '6-primaria',
    asignatura: 'sciences',
    descripcion: 'La electricidad como forma de energía, circuitos y símbolos, con simuladores para experimentar y predecir qué pasará.',
    zip: 'descargas/ciencias-electricidad.zip',
    peso: 69724,
    abrir: 'Ciencias-Electricidad.html',
    nota: 'Lee los textos en voz alta con la voz de tu ordenador.'
  },
  {
    nombre: 'Gases and Solutions',
    curso: '3-eso',
    asignatura: 'fisica-quimica',
    descripcion: 'El estado gaseoso, las leyes de los gases, los cambios de estado y las disoluciones, con simuladores, predicciones y problemas paso a paso.',
    zip: 'descargas/gases-y-disoluciones.zip',
    peso: 89417,
    abrir: 'Gases-and-Solutions.html',
    idioma: 'Inglés y español'
  },
  {
    nombre: 'Lengua y Literatura: clases de palabras',
    curso: '3-eso',
    asignatura: 'lengua',
    descripcion: 'Sustantivos, adjetivos, verbos, morfemas y más, en ocho bloques con actividades y repaso final.',
    zip: 'descargas/lengua-y-literatura-clases-de-palabras.zip',
    peso: 81990,
    abrir: 'Lengua-y-Literatura.html',
    nota: 'Lee los textos en voz alta con la voz de tu ordenador.',
    fecha: '2026-11-20'
  },
  {
    nombre: 'Nutrition & Digestion',
    curso: '3-eso',
    asignatura: 'biologia',
    descripcion: 'La función de nutrición, los nutrientes, la energía, la dieta saludable y el aparato digestivo, con simuladores, un plato para montar, un recorrido por el tubo digestivo y modo examen.',
    zip: 'descargas/nutrition-and-digestion.zip',
    peso: 105998,
    abrir: 'Nutrition-and-Digestion.html',
    idioma: 'Inglés y español',
    fecha: '2026-11-20'
  }
];
