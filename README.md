# CV interactivo — Martín Aguirre Herrera

*«Mi CV se sirve a la carta.»*

Carta de restaurante japonés, física y editorial, construida en HTML, CSS y JavaScript.
Abrir `index.html` en el navegador (no requiere servidor ni compilación).

## Estado

**Etapa 1 — terminada con assets integrados, pendiente de revisión.**
Portada · apertura · doble página interior · Nigiri / Wasabi / Omakase en estado cerrado · contraportada.

Las etapas 2–5 (interacciones de cada plato, pulido responsive y publicación) no están desarrolladas.

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
- Pantallas verticales: se ve una página a la vez; tocar el borde de la otra página o deslizar.

## Assets

| Ruta                               | Uso                                                          |
|------------------------------------|--------------------------------------------------------------|
| `assets/brand/sello-mah.png`       | Sello MAH (portada, página izquierda, contraportada)         |
| `assets/decor/*.svg`               | Sol y olas de pincel seco                                    |
| `assets/decor/montanas-sumi.png`   | Montañas sumi-e al pie de las páginas                        |
| `assets/decor/rama-sakura.png`     | Rama de cerezo en el borde derecho                           |
| `assets/products/nigiri.png`       | Selección del chef — Nigiri                                  |
| `assets/products/wasabi.png`       | Selección del chef — Wasabi                                  |
| `assets/products/omakase.png`      | Selección del chef — Omakase                                 |
