# CV interactivo — Martín Aguirre Herrera

*«Mi CV se sirve a la carta.»*

Carta de restaurante japonés, física y editorial, construida en HTML, CSS y JavaScript.
Abrir `index.html` en el navegador (no requiere servidor ni compilación).

## Estado

**Etapa 1 — terminada, pendiente de revisión.**
Portada · apertura · doble página interior · Nigiri / Wasabi / Omakase en estado cerrado · contraportada.

Las etapas 2–5 (interacciones de cada plato, pulido responsive y publicación) no están desarrolladas.

## Estructura

```
index.html                 objeto completo: tapas, caras, páginas, contenedores de servicio
css/styles.css             materia, tipografía, composición y giro 3D (todo en unidades --u)
js/interactions.js         estados (cerrada → abierta → contraportada), teclado, gesto táctil,
                           carga de assets pendientes, arquitectura de hotspots
assets/brand/sello-mah.png sello MAH en rojo #B12622 (extraído del sello proporcionado)
assets/decor/*.svg         sol y olas de pincel seco (portada y contraportada)
references/                referencias visuales maestras
```

## Navegación

- Clic / toque / Enter sobre la portada: abre la carta.
- Sobre la mesa, bajo la carta abierta: «Portada» y «Contraportada».
- Teclado: ← / →.
- Pantallas verticales: se ve una página a la vez; tocar el borde de la otra página o deslizar.

## Assets pendientes

Los contenedores ya existen y cargan el archivo automáticamente cuando aparece en la ruta indicada;
mientras tanto no muestran nada.

| Ruta                               | Contenido                                                     |
|------------------------------------|---------------------------------------------------------------|
| `assets/products/nigiri.png`       | Nigiri emplatado, PNG con fondo transparente                  |
| `assets/products/wasabi.png`       | Wasabi en cuenco, PNG con fondo transparente                  |
| `assets/products/omakase.png`      | Omakase emplatado, PNG con fondo transparente                 |
| `assets/decor/montanas-sumi.png`   | Franja de montañas sumi-e para el pie de ambas páginas        |
| `assets/decor/rama-sakura.png`     | Rama de cerezo en tinta para el borde derecho de la página    |
