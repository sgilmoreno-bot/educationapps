# Biblioteca de apps educativas: cómo funciona y cómo añadir apps

## Qué hay en esta carpeta

| Carpeta / archivo | Para qué sirve | ¿Se publica? |
|---|---|---|
| `docs/` | La web completa (GitHub Pages publica esta carpeta). | Sí |
| `docs/datos/catalogo.js` | **El catálogo.** Cursos, asignaturas, apps, enlace de «Sube tu app» y datos del contador. | Sí |
| `docs/descargas/` | Los ZIP que descarga la gente. | Sí |
| `copias-apps/` | Copias de trabajo de tus apps, de las que salen los ZIP. Los originales nunca se tocan. | No |
| `pendientes/` | ZIP y fichas de apps que aún no se publican (derechos por revisar). | No |
| `herramientas/empaquetar.sh` | Crea el ZIP de una app a partir de su copia. | No |
| `imagenes/portada.webp` | La referencia visual aprobada. | No |

La web no ejecuta ninguna app: solo ofrece los ZIP para descargarlos.

## Añadir una app nueva (4 pasos)

1. **Comprueba que cumple las condiciones:** se abre con doble clic en un `.html`, funciona sin internet y no necesita instalar nada (ni Node, ni Python, ni servidores).
2. **Copia la app** en `copias-apps/` con un nombre corto, sin espacios ni tildes, por ejemplo `copias-apps/mates-fracciones/`. Copia, no muevas: el original se queda donde está.
3. **Crea el ZIP.** Abre Terminal en la carpeta del proyecto y escribe:
   ```
   sh herramientas/empaquetar.sh mates-fracciones
   ```
   Te dirá la ruta del ZIP y su peso.
4. **Añade la ficha** al final de la lista `window.APPS` en `docs/datos/catalogo.js`:
   ```js
   {
     nombre: 'Fracciones paso a paso',
     curso: '6-primaria',          // id del curso: '6-primaria' o '3-eso'
     asignatura: 'matematicas',    // id de una asignatura de ese curso
     descripcion: 'Una o dos frases sobre qué aprende el alumnado.',
     zip: 'descargas/mates-fracciones.zip',
     peso: 123456,
     abrir: 'index.html'
   },
   ```
   Los cursos y sus asignaturas están en `window.CURSOS`. Para añadir una asignatura o un curso nuevos, se añade una línea allí. Una asignatura sin apps aparece como «Próximamente».

Abre `docs/index.html` con doble clic para ver el resultado. El diseño, las carpetas, el buscador y el contador se actualizan solos.

## Actualizar una app

Sustituye su copia en `copias-apps/`, vuelve a ejecutar `empaquetar.sh` y corrige el `peso` en el catálogo. Si el contador está activo, sustituye el ZIP en la release. Al subir un archivo con el mismo nombre, su contador vuelve a 0.

## Quitar una app

Borra su bloque en `catalogo.js`, su ZIP en `docs/descargas/` y, si el contador está activo, el ZIP de la release.

## «Sube tu app»

Rellena `window.ENLACES.subeTuApp` al principio de `catalogo.js`. Mientras esté vacío, el botón aparece como «Próximamente».

## Contador de descargas

Es gratuito y no necesita ninguna cuenta de pago: lo lleva GitHub.

1. En el repositorio de la web en GitHub, entra en **Releases → Create a new release**, ponle la etiqueta `apps` y arrastra todos los ZIP de `docs/descargas/`. Publica la release.
2. En `catalogo.js`, rellena `window.DESCARGAS` con tu usuario y el nombre del repositorio.
3. Desde ese momento, el botón DESCARGAR baja cada ZIP desde la release, GitHub cuenta cada descarga y la ficha muestra, por ejemplo, «128 descargas».

Para una app nueva, añade su ZIP a esa misma release (**Edit release** → arrastrar el archivo). El nombre del ZIP tiene que coincidir con el de su ficha.

Mientras `usuario` esté vacío, la web descarga los ZIP desde `docs/descargas/` y no muestra contadores. Así funciona al probarla en local.

Si GitHub no responde, la web sigue funcionando: solo se oculta la cifra.
