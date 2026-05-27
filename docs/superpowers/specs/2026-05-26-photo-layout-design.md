# Photo Layout — Design Spec
_2026-05-26_

## Propósito

Herramienta local para crear posts de Instagram tipo carrusel. Cada slide es un archivo HTML con un layout de fotos definido en CSS Grid. Un script de exportación (Bun + Playwright) convierte los HTML a PNG de 1080×1350px listos para subir.

## Estructura del proyecto

```
photo-layout/
├── posts/
│   └── <nombre-post>/
│       ├── 1.html
│       ├── 2.html
│       └── assets/
│           └── foto1.jpg
├── shared.css
├── _template.html
├── export.ts
└── export/
    └── <fecha>_<nombre-post>/
        ├── 1.png
        └── 2.png
```

## Dimensiones

- **Instagram vertical:** 1080×1350px (ratio 4:5)
- **Líneas blancas:** `--gap: 22px` (~2% del ancho) — usado tanto para padding exterior como para gap entre celdas

## shared.css

- Variable `--gap` controla grosor de líneas blancas globalmente
- `.page`: 1080×1350px, background white, padding y gap usan `--gap`, display grid
- `.page img`: `object-fit: contain`, `background: white` — imágenes nunca se recortan ni distorsionan

## _template.html

Cada HTML importa `../../shared.css` y define solo el grid de esa página en un bloque `<style>` con `grid-template-areas`. Los `<img>` tienen `style="grid-area: x"`.

## export.ts

- Uso: `bun export.ts posts/<nombre-post>`
- Tecnología: Playwright (chromium) — mejor manejo de assets locales via `file://`
- Viewport: 1080×1350px, `waitForLoadState("networkidle")` antes del screenshot
- Output: `export/<YYYY-MM-DD>_<nombre-post>/<n>.png`

## Setup inicial

```bash
bun init
bun add -d playwright
bunx playwright install chromium
```

## Workflow

1. `mkdir -p posts/<nombre>/assets && cp _template.html posts/<nombre>/1.html`
2. Editar el bloque `<style>` con el grid deseado
3. Agregar fotos a `assets/`
4. Previsualizar en browser: `open posts/<nombre>/1.html`
5. `bun export.ts posts/<nombre>`
6. Subir PNGs a Instagram
