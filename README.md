# CV interactivo — Martín Aguirre Herrera

*«Mi CV se sirve a la carta.»*

Carta de restaurante japonés, física y editorial, construida en HTML, CSS y JavaScript.
Abrir `index.html` en el navegador (no requiere servidor ni compilación).

## Estado

**Publicado (main).** Rama `claude/final-ajustes-tipografia-fondo-mobile`: cuerpo en Noto Sans JP, papel con koi y auditoría táctil — en revisión. Titulares en Playfair Display (alternativa libre a Hanami).
Portada · apertura · doble página interior · servicios Nigiri / Wasabi / Omakase · contraportada.

## Estructura

```
index.html                 objeto completo: tapas, caras, páginas, contenedores de servicio
css/styles.css             materia, tipografía, composición y giro 3D (todo en unidades --u)
js/interactions.js         estados (cerrada → abierta → contraportada), teclado, gesto táctil,
                           carga de assets pendientes, arquitectura de hotspots
assets/brand/sello-mah.webp sello MAH en rojo #B12622 (extraído del sello proporcionado)
assets/decor/              sol, olas y pincelada (SVG); koi del papel, montañas sumi y rama sakura (WebP)
assets/products/           Nigiri, Wasabi, Omakase y capas de Nigiri (WebP transparentes, 760 px)
references/                referencias visuales maestras; originales/ guarda los PNG a tamaño completo
```

## Navegación

- Clic / toque / Enter sobre la portada: abre la carta.
- Sobre la mesa, bajo la carta abierta: «Portada» y «Contraportada».
- Teclado: ← / →.
- Platos: clic/tap abre su servicio; segundo clic, ESC o clic fuera lo cierran. Uno a la vez.
- Teléfonos en vertical: la carta se vuelve alta (aprovecha toda la pantalla) y el texto crece para leerse sin zoom; una página a la vez: deslizar, tocar el borde o usar «Página». El pellizco funciona y no cambia de página.
- Teléfonos en horizontal: la carta abierta ocupa el ancho y se desplaza en vertical.
- Escritorio y tablet: sin cambios respecto al diseño aprobado.

## Assets

| Ruta                               | Uso                                                          |
|------------------------------------|--------------------------------------------------------------|
| `assets/brand/sello-mah.webp`       | Sello MAH (portada, página izquierda, contraportada)         |
| `assets/decor/*.svg`               | Sol y olas de pincel seco                                    |
| `assets/decor/montanas-sumi.webp`  | Montañas sumi-e al pie de las páginas                        |
| `assets/decor/rama-sakura.webp`    | Rama de cerezo en el borde derecho                           |
| `assets/decor/giro-wasabi.svg`     | Pincelada sumi del «giro» (servicio Wasabi)                  |
| `assets/decor/koi-papel.webp`      | Koi en tinta tenue sobre el papel interior (multiply)        |
| `assets/products/nigiri.webp`      | Selección del chef — Nigiri                                  |
| `assets/products/wasabi.webp`      | Selección del chef — Wasabi                                  |
| `assets/products/omakase.webp`     | Selección del chef — Omakase                                 |
| `assets/products/nigiri-pescado.webp` | Servicio Nigiri — capa pescado                             |
| `assets/products/nigiri-union.webp`  | Servicio Nigiri — capa unión                               |
| `assets/products/nigiri-arroz.webp`  | Servicio Nigiri — capa arroz                               |
