# CV interactivo — Martín Aguirre Herrera

*«Mi CV se sirve a la carta.»*

Carta de restaurante japonés, física y editorial, construida en HTML, CSS y JavaScript.
Abrir `index.html` en el navegador (no requiere servidor ni compilación).

## Estado

**Publicado (main).** Rama `claude/final-tipografia-mobile`: refinamiento tipográfico, papel seigaiha y corrección táctil — en revisión.
Portada · apertura · doble página interior · servicios Nigiri / Wasabi / Omakase · contraportada.

## Estructura

```
index.html                 objeto completo: tapas, caras, páginas, contenedores de servicio
css/styles.css             materia, tipografía, composición y giro 3D (todo en unidades --u)
js/interactions.js         estados (cerrada → abierta → contraportada), teclado, gesto táctil,
                           carga de assets pendientes, arquitectura de hotspots
assets/brand/sello-mah.webp sello MAH en rojo #B12622 (extraído del sello proporcionado)
assets/decor/              sol, olas, pincelada y seigaiha (SVG); montañas sumi y rama sakura (WebP)
assets/products/           Nigiri, Wasabi, Omakase y capas de Nigiri (WebP transparentes, 760 px)
references/                referencias visuales maestras; originales/ guarda los PNG a tamaño completo
```

## Navegación

- Clic / toque / Enter sobre la portada: abre la carta.
- Sobre la mesa, bajo la carta abierta: «Portada» y «Contraportada».
- Teclado: ← / →.
- Platos: clic/tap abre su servicio; segundo clic, ESC o clic fuera lo cierran. Uno a la vez.
- Pantallas verticales: se ve una página a la vez; deslizar, tocar el borde de la otra página o usar «Página» sobre la mesa. El zoom con pellizco del navegador funciona y no cambia de página.

## Assets

| Ruta                               | Uso                                                          |
|------------------------------------|--------------------------------------------------------------|
| `assets/brand/sello-mah.webp`       | Sello MAH (portada, página izquierda, contraportada)         |
| `assets/decor/*.svg`               | Sol y olas de pincel seco                                    |
| `assets/decor/montanas-sumi.webp`  | Montañas sumi-e al pie de las páginas                        |
| `assets/decor/rama-sakura.webp`    | Rama de cerezo en el borde derecho                           |
| `assets/decor/giro-wasabi.svg`     | Pincelada sumi del «giro» (servicio Wasabi)                  |
| `assets/decor/seigaiha-*.svg`      | Olas seigaiha muy tenues en el papel interior                |
| `assets/products/nigiri.webp`      | Selección del chef — Nigiri                                  |
| `assets/products/wasabi.webp`      | Selección del chef — Wasabi                                  |
| `assets/products/omakase.webp`     | Selección del chef — Omakase                                 |
| `assets/products/nigiri-pescado.webp` | Servicio Nigiri — capa pescado                             |
| `assets/products/nigiri-union.webp`  | Servicio Nigiri — capa unión                               |
| `assets/products/nigiri-arroz.webp`  | Servicio Nigiri — capa arroz                               |
