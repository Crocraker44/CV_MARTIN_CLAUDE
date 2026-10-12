# CV interactivo — Martín Aguirre Herrera

*«Mi CV se sirve a la carta.»*

Carta de restaurante japonés, física y editorial, construida en HTML, CSS y JavaScript.
Abrir `index.html` en el navegador (no requiere servidor ni compilación).

## Estado

**Etapas 1–4 aprobadas. Etapa 5 (pulido final + QA) — en revisión.** Sin publicar.
Portada · apertura · doble página interior · servicios Nigiri / Wasabi / Omakase · contraportada.

## Estructura

```
index.html                 objeto completo: tapas, caras, páginas, contenedores de servicio
css/styles.css             materia, tipografía, composición y giro 3D (todo en unidades --u)
js/interactions.js         estados (cerrada → abierta → contraportada), teclado, gesto táctil,
                           carga de assets pendientes, arquitectura de hotspots
assets/brand/sello-mah.png sello MAH en rojo #B12622 (extraído del sello proporcionado)
assets/decor/              sol y olas (SVG), montañas sumi y rama sakura (PNG)
assets/products/           Nigiri, Wasabi y Omakase (PNG transparentes)
references/                referencias visuales maestras
```

## Navegación

- Clic / toque / Enter sobre la portada: abre la carta.
- Sobre la mesa, bajo la carta abierta: «Portada» y «Contraportada».
- Teclado: ← / →.
- Platos: clic/tap abre su servicio; segundo clic, ESC o clic fuera lo cierran. Uno a la vez.
- Pantallas verticales: se ve una página a la vez; tocar el borde de la otra página o deslizar. El zoom con pellizco del navegador sigue disponible para leer de cerca.

## Assets

| Ruta                               | Uso                                                          |
|------------------------------------|--------------------------------------------------------------|
| `assets/brand/sello-mah.png`       | Sello MAH (portada, página izquierda, contraportada)         |
| `assets/decor/*.svg`               | Sol y olas de pincel seco                                    |
| `assets/decor/montanas-sumi.png`   | Montañas sumi-e al pie de las páginas                        |
| `assets/decor/rama-sakura.png`     | Rama de cerezo en el borde derecho                           |
| `assets/decor/giro-wasabi.svg`     | Pincelada sumi del «giro» (servicio Wasabi)                  |
| `assets/products/nigiri.png`       | Selección del chef — Nigiri                                  |
| `assets/products/wasabi.png`       | Selección del chef — Wasabi                                  |
| `assets/products/omakase.png`      | Selección del chef — Omakase                                 |
| `assets/products/nigiri-pescado.png` | Servicio Nigiri — capa pescado                             |
| `assets/products/nigiri-union.png`   | Servicio Nigiri — capa unión                               |
| `assets/products/nigiri-arroz.png`   | Servicio Nigiri — capa arroz                               |
