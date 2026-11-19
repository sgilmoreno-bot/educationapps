#!/bin/sh
# Crea el ZIP de descarga de una app a partir de su COPIA en copias-apps/.
# Uso (desde la carpeta del proyecto):   sh herramientas/empaquetar.sh nombre-de-la-carpeta
# Resultado: docs/descargas/nombre-de-la-carpeta.zip  (y muestra su tamaño para la ficha)
# Solo usa herramientas que ya trae macOS. No toca nunca las apps originales.

set -e
cd "$(dirname "$0")/.."

SLUG="$1"
if [ -z "$SLUG" ] || [ ! -d "copias-apps/$SLUG" ]; then
  echo "Indica una carpeta que exista en copias-apps/. Disponibles:"
  ls copias-apps
  exit 1
fi

mkdir -p docs/descargas
rm -f "docs/descargas/$SLUG.zip"
( cd copias-apps && zip -r -X -q "../docs/descargas/$SLUG.zip" "$SLUG" -x '*.DS_Store' -x '__MACOSX/*' )

BYTES=$(wc -c < "docs/descargas/$SLUG.zip" | tr -d ' ')
echo "Creado docs/descargas/$SLUG.zip"
echo "Para la ficha:  zip: 'descargas/$SLUG.zip',  peso: $BYTES"
