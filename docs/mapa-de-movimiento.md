# Mapa de movimiento — Zágari Resort Club

Especificación de la coreografía de scroll de todo el sitio. Es la fuente de
verdad del movimiento: el código debe poder leerse contra este documento.

Referencia de lenguaje: johannis.it. No se copia su código, sus textos, sus
imágenes ni sus maquetaciones; se reproduce su **gramática de movimiento**.

---

## 0. Vocabulario común

### Progreso

`at` es el progreso normalizado **de la sección**, de 0 a 1.

- `at: 0` — el borde superior de la sección toca el borde inferior del viewport
  (o el inicio del pin, si la sección está fijada).
- `at: 1` — el borde inferior de la sección abandona el viewport
  (o el final del pin).

Cuando una entrada no es scrub sino una línea de tiempo disparada una vez,
`at` se expresa en segundos relativos al inicio de esa línea.

### Tokens — `app/lib/motion.ts`

| Token | Valor | Uso |
|---|---|---|
| `duration.fast` | 0.45 s | microinteracción |
| `duration.base` | 0.8 s | entrada de una capa de texto |
| `duration.cinematic` | 1.4 s | titular, apertura de máscara |
| `duration.slow` | 2.0 s | escena final |
| `ease.ui` | `power2.out` | hover |
| `ease.cinematic` | `power3.out` | entradas |
| `ease.scrub` | `none` | todo lo ligado al scroll |
| `distance.text` | 40 px | desplazamiento de texto |
| `distance.imageParallax` | 10 | yPercent base de parallax |
| `pin.suave` | 120 % vh | pin narrativo corto |
| `pin.fuerte` | 180 % vh | transformación fuerte de imagen |
| `pin.secuencia` | 280 % vh | secuencia de varios frames |

### Escalera de dispositivos — `MEDIOS`

| Perfil | Rango | Amplitud |
|---|---|---|
| `movil` | ≤ 699.98 px | mínima: sin pin, parallax ≤ 4, sin transforms grandes |
| `tablet` | 700 – 1023.98 px | intermedia: pin corto, parallax ~60 % |
| `escritorio` | ≥ 1024 px | completa |
| `reducido` | `prefers-reduced-motion` | sin movimiento ligado al scroll |

Sin huecos sub-pixel entre condiciones: un hueco deja la escena muerta.

### Contrato anti-destello

El HTML del servidor pinta antes de que GSAP exista. Por eso:

- `app/layout.tsx` añade `html.motion` **antes del primer pintado**, salvo
  `prefers-reduced-motion`. La retira a los 4 s como red de seguridad.
- `app/globals.css` cuelga de esa clase el estado inicial oculto:
  `[data-entrada]` → `opacity: 0`; `="sube"` → `+ translateY(34px)`;
  `="mascara"` → `+ clip-path: inset(0 0 100% 0)`.
- El estado `from` de GSAP **debe coincidir** con el que declara el contrato.
- Prohibido `clearProps` sobre un elemento con `data-entrada`.
- Nada enfocable puede quedar invisible: `autoAlpha`, nunca `opacity` sola.

### Reglas transversales

- Se anima solo `transform`, `opacity` y `clip-path`.
- Un solo `useGSAP` con `{ scope }` por componente.
- Lenis se instancia **una vez**, en `SmoothScroll.tsx`.
- `will-change` solo mientras la sección está en juego.
- No se fija todo: se fija únicamente el momento narrativo.

---

## 1. Portada — `/`

Ritmo general: **respirar, mirar, entrar**. Dos secciones fijadas como máximo
antes del tercio final, para que el scroll no se sienta secuestrado.

### 1.1 `LandingNav` — persistente

| Frame | at | Qué cambia |
|---|---|---|
| A | carga | Logo y enlaces entran con `opacity 0→1`, `y 12→0`, escalonado 0.04 s, tras el titular del hero |
| B | scrollY > 24 px | Fondo opaco y sombra; franja de espectro siempre visible |
| C | scroll hacia abajo > 400 px | La barra se retira `y: -100%`; vuelve al subir |

Sin pin. Parallax: ninguno. Opacidad del fondo 0 → 1 en los primeros 24 px.
En móvil la barra no se retira: el acceso al menú manda sobre el efecto.

### 1.2 `LandingHero` — `#inicio`

Pin: **no**. Composición sobre blanco: el titular manda y el video emerge
por debajo, fundido con el fondo por arriba y por abajo. La entrada es CSS
puro (no GSAP): corre desde el primer pintado, sin JS y sin destello.

| Frame | Cuándo | Video | Texto |
|---|---|---|---|
| **Inicial** | primer pintado | `opacity 0`, caja desde `top: 300px` hasta el fondo | titular, párrafo y CTA a `opacity 0`, `translate 0 20px` |
| **Entrada** | 0 → 1.2 s | — | titular 0 s · párrafo 0.2 s · CTA 0.4 s; cada uno 0.8 s `ease-out` a `opacity 1`, `translate 0 0` |
| **Vuelta del video** | cada ciclo | `opacity 0 → 1` en los primeros 0.5 s; `1 → 0` en los últimos 0.5 s; al terminar, 100 ms en blanco y reinicio | fijo |

- Velo: degradado blanco → blanco 85 % (18 %) → transparente (55 %) → blanco.
  El tramo al 85 % protege el párrafo en tablet, donde cae sobre el video.
- El bucle es manual (sin atributo `loop`) y lo mide `requestAnimationFrame`
  **solo mientras el video se reproduce**.
- Fuera de pantalla el video se pausa; vuelve al entrar, salvo pausa manual.
- Sin autoarranque con `prefers-reduced-motion` ni con `saveData`.
- Botón de pausa abajo a la izquierda (la derecha es de WhatsApp), siempre
  dentro de la primera pantalla: el hero mide `100svh - --alto-nav`.
- El hover del CTA usa `scale`; la entrada usa `translate`. Si la entrada
  animara `transform` con `fill-mode: both`, anularía el hover para siempre.
- Transición a 1.3: ninguna; el hero sale con el scroll normal.

### 1.3 `SplitSection` «El club» — `#club`

Pin: **no**. Patrón editorial, reutilizado 4 veces en la portada.

| Frame | at | Figura principal | Figura secundaria | Texto |
|---|---|---|---|---|
| **Inicial** | 0 | `clip-path: inset(10% 14% 10% 0)`, `scale 1.06` | `clip-path: inset(0 0 100% 0)`, `yPercent +8` | capas ocultas por contrato |
| **Apertura** | 0 → 0.35 | `clip-path → inset(0)`, `scale → 1.00` | — | — |
| **Texto** | 0.12 → 0.55 | — | entra tras la principal | eyebrow 0.12 · titular (máscara) 0.20 · párrafo 1 0.30 · párrafo 2 0.38 · dato 0.46 · enlace 0.54 |
| **Parallax** | 0 → 1 | `yPercent 0 → -7` | `yPercent 0 → -14` | — |
| **Final** | 1 | — | — | el texto **no** revierte |

- Separación de capas de texto: 0.08–0.10 de progreso.
- Profundidad: principal −7, secundaria −14 → la secundaria flota por delante.
- Con `invertido`, las direcciones de entrada se espejan (la máscara abre desde
  el lado contrario).
- El parallax **sí** es reversible; el texto **no**: una vez leído, se queda.
- Transición a 1.4: cambio de tono de fondo (`claro` ↔ `crema`) sin animación;
  el corte de color es el separador.

### 1.4 `SplitSection` «Agua» — `tono="crema"`, `invertido`

Idéntica a 1.3 con las direcciones espejadas. Añade el bloque `dato` («4
elementos»), que entra en `at 0.46` con `y 20 → 0`.

### 1.5 `SpaceCarousel` — `#espacios` — **GALERÍA FIJADA**

Pin: **sí**, solo en `escritorio` y `tablet`. Recorrido = ancho desbordado de
la pista, acotado a un máximo de `pin.secuencia` (280 % vh).

| Frame | at | Pista | Cards | Cabecera |
|---|---|---|---|---|
| **Inicial** | 0 | `x: 0` | la primera a `scale 1`, el resto `0.94` | entra con contrato |
| **Recorrido** | 0 → 1 | `x: 0 → -(scrollWidth - innerWidth)`, `ease: none` | la card más centrada sube a `scale 1`, las demás bajan a `0.94` | fija durante todo el pin |
| **Final** | 1 | última card alineada al borde derecho | — | — |

- `clip-path`: no se usa aquí; la galería es movimiento puro en X.
- Parallax interno: la `<Image>` de cada card deriva `x: 6% → -6%` respecto a
  su marco, para que la foto no viaje pegada a la tarjeta.
- Barra de progreso bajo la cabecera: `scaleX 0 → 1`, dentro de la línea de
  tiempo, **no** en un `onUpdate`.
- **Móvil y `reducido`**: sin pin. Vuelve a ser scroll-snap horizontal con el
  dedo y las flechas visibles.
- Presupuesto vertical: el contenido fijado debe caber en una pantalla, o
  queda material inalcanzable durante todo el pin.
- Transición a 1.6: al soltar el pin, la sección siguiente ya está debajo.

### 1.6 `VideoSection` «La piscina que mira al valle» — **CONTENIDA → A SANGRE**

Pin: **sí** (`position: sticky`), `pin.fuerte` (180 % vh), desde `tablet`.

| Frame | at | Medio | Velo | Texto |
|---|---|---|---|---|
| **A** | 0 | `clip-path: inset(6% 8% 6% 8% round 24px)`, `scale 1.04` | 0 | oculto |
| **B** | 0 → 0.45 | `clip-path → inset(0% round 0px)`, `scale → 1.00` | 0 → 0.20 | oculto |
| **C** | 0.45 → 0.75 | `yPercent 0 → -6` | 0.20 → 0.50 | eyebrow 0.48 · titular (máscara) 0.54 · párrafo 0.62 · botón 0.70 |
| **D** | 0.75 → 1 | `scale 1.00 → 1.05` | 0.50 | el texto se retira `y -20`, `autoAlpha → 0` |

- El `<video>` arranca al entrar en viewport y **no** con `reducido`.
- El botón de pausa es obligatorio (WCAG 2.2.2) y nunca queda invisible.
- El póster optimizado se pinta siempre bajo el video.
- **Móvil**: sin pin. El medio nace a sangre y solo entra el texto.
- Transición a 1.7: el video se queda a sangre y la sección siguiente entra
  por encima; la continuidad espacial la da que la imagen no se encoge.

### 1.7 `StackedScroll` «Experiencias exclusivas» — `#exclusivas` — **BARAJA 3D**

Pin: **sí** (`sticky`). Recorrido = `nº de tarjetas × 70 vh + 100 vh`
(escritorio/tablet), `× 48 vh` en móvil. Unidades coherentes con `.sticky`.

Huecos de la baraja, con `s` = distancia al frente:

| Hueco | z | yPercent | rotateX | opacidad |
|---|---|---|---|---|
| 0 (al frente) | 0 | 0 | 0° | 1 |
| 1 | −120 px | +7.5 % | 2° | 0.78 |
| 2 | −240 px | +15 % | 4° | 0.56 |
| 3 | −360 px | +22.5 % | 6° | 0.34 |
| ≥ 4 | −480 px | +30 % | 8° | 0 |

En móvil, la profundidad en Z se reduce a la mitad.

| Frame | at (por paso) | Tarjeta saliente | Tarjetas de atrás | Media de la que entra |
|---|---|---|---|---|
| **Inicial** | 0 | hueco 0 | huecos 1..n | `clip-path: inset(0 100% 0 0)` |
| **Avance** | k → k+1 | `yPercent -118`, `z +320`, `rotateX -16°`, `opacity → 0`, `ease: power2.in` | cada una sube un hueco, `ease: power2.inOut` | `clip-path → inset(0)` mientras llega al frente |
| **Al frente** | — | — | — | la `<Image>` deriva `yPercent 0 → -6` mientras manda |

- El estado inicial de la baraja está **replicado en CSS** con `nth-child` bajo
  `:global(html.motion)`: sin eso hay destello en cada carga.
- La escena recorta con `overflow: clip` y `overflow-clip-margin: 56px`, para
  que la tarjeta saliente no vuele sobre la cabecera y la sombra sobreviva.
- La lista numerada de la izquierda marca la activa: `color` y `translateX 6px`.
  Es `aria-hidden`; el contenido real son los `h3` de las tarjetas.
- **`reducido`**: la baraja se convierte en una rejilla de 1–2 columnas,
  `height: auto`, sin `sticky` ni perspectiva.
- Transición a 1.8: al agotarse los pasos el pin se suelta sobre fondo claro.

### 1.8 `SplitSection` «Gastronomía» — `tono="crema"`

Como 1.3. Sirve de respiro entre las dos barajas: **sin pin**, a propósito.

### 1.9 `StackedScroll` «En familia» — `#familiares` — `tono="tinta"`

Como 1.7, sobre fondo oscuro. El cambio de fondo claro → tinta es el corte
narrativo: el ojo descansa y la fotografía gana peso.

### 1.10 `VideoSection` «Cabañas»

Como 1.6. Cierra el bloque de experiencias devolviendo la escala al paisaje.

### 1.11 `SplitSection` «Naturaleza» — `invertido`, `tono="crema"`

Como 1.3. Último respiro antes del bloque de conversión.

### 1.12 `MembershipSection` — `#membresias`

Pin: **no**. Es contenido de decisión: el usuario necesita leer y comparar,
no mirar.

| Frame | at | Qué cambia |
|---|---|---|
| **Inicial** | 0 | pestañas y panel ocultos por contrato |
| **A** | 0.10 | las tres pestañas entran escalonadas 0.06 s, `y 24 → 0` |
| **B** | 0.20 | el panel activo entra con `clip-path: inset(0 0 100% 0) → inset(0)` |
| **C** | 0.30 | los beneficios entran en rejilla, escalonados 0.04 s |
| **Cambio de nivel** | al pulsar | `duration.fast`, crossfade del panel + `y 12`; **sin** máscara, para que no se lea como una entrada nueva |

- La tarjeta de membresía (Plata / Oro / Platino) conserva su degradado
  metálico: ahí el color nombra un material, no la marca.
- El `aria-selected` y el foco del `tablist` mandan sobre cualquier animación.

### 1.13 `LocationRoute` — `#ubicacion`

Pin: **no**. Ya tiene su propia animación de recorrido con `requestAnimationFrame`,
que **no** se liga al scroll: la controla el usuario con los botones.

| Frame | at | Qué cambia |
|---|---|---|
| **Inicial** | 0 | mapa oculto por contrato |
| **A** | 0.15 | el mapa entra con `clip-path: inset(0 0 100% 0)` abriendo de abajo arriba, `duration.cinematic` |
| **B** | 0.25 | título, dato de distancia y controles, escalonados |
| — | — | el recorrido del coche **nunca** arranca solo |

### 1.14 `ContactForm` — `#reserva`

| Frame | at | Qué cambia |
|---|---|---|
| **Inicial** | 0 | ocultos por contrato |
| **A** | 0.10 | titular con máscara |
| **B** | 0.18 | entradilla |
| **C** | 0.26 | el formulario entra como bloque, `y 30 → 0` — **no** campo a campo: un formulario que se monta por partes se siente lento |

Ningún campo ni botón puede estar invisible y enfocable: `autoAlpha`.

### 1.15 `LandingFooter` — escena final

Pin: **no**. Aquí el ritmo **desacelera**.

| Frame | at | Qué cambia |
|---|---|---|
| **Inicial** | 0 | fondo a `yPercent +6`; capas ocultas |
| **A** | 0 → 1 | la imagen de fondo deriva `yPercent +6 → -6` (parallax muy suave) |
| **B** | 0.15 | bloque de contacto y redes (están arriba en el DOM) |
| **C** | 0.30 | el wordmark «Zágari» abre con máscara, `duration.slow` |
| **D** | 0.45 | las tres columnas, escalonadas 0.08 s, `y 18 → 0` |

Movimiento mínimo. Nada rebota, nada escala. La franja de espectro superior
es estática.

### 1.16 `WhatsAppWidget` — persistente

Entra una sola vez, a los 2 s de la carga: `scale 0.8 → 1`, `opacity 0 → 1`,
`ease.cinematic`. No se mueve con el scroll. Nunca se oculta.

---

## 2. `/eventos`

Misma gramática, ritmo más corto: es una página de conversión.

| # | Sección | Pin | Notas |
|---|---|---|---|
| 2.1 | `PageHero` | no | Como 1.2 pero sin el aviso «Desliza». Imagen `scale 1.08 → 1.00`; parallax fondo −8, contenido −3 |
| 2.2 | `SplitSection` corporativos | no | Como 1.3 |
| 2.3 | `StackedScroll` corporativos | sí | Como 1.7, `tono="crema"` |
| 2.4 | `SplitSection` sociales | no | Como 1.3, `invertido` |
| 2.5 | `StackedScroll` sociales | sí | Como 1.7, `tono="tinta"` |
| 2.6 | `ContactForm` | no | Como 1.14 |

---

## 3. Páginas legales — `/terminos`, `/privacidad`, `/cookies`

Sin coreografía. Solo la entrada del contrato sobre el titular y el cuerpo,
`duration.base`. Son documentos para leer, no escenas.

---

## 4. Presupuesto de movimiento

| Métrica | Límite | Por qué |
|---|---|---|
| Secciones fijadas en la portada | 3 | Más secuestra el scroll |
| Recorrido fijado por sección | ≤ 280 % vh | Tres pantallas es el techo tolerable |
| `ScrollTrigger` activos | ≤ 25 por página | Agrupar en líneas de tiempo, no uno por elemento |
| Capas con `will-change` | ≤ 6 simultáneas | Cada una es memoria de GPU |
| Parallax en móvil | ≤ 4 yPercent | Por encima se percibe como un fallo de render |

---

## 5. Qué NO se anima

- Los campos del formulario, uno a uno.
- Los enlaces del footer, uno a uno.
- El logo de la barra en cada scroll.
- Nada con `elastic`, `bounce` ni rebote: el registro es editorial, no lúdico.
- Nada que mueva texto mientras el usuario lo está leyendo.
