# Apuntes: Diseño de interfaces web

> Apuntes construidos a partir del frontend de **PomodoroZion** y del curso
> **Responsive Web Design** de freeCodeCamp que estoy haciendo.

## 1. Jerarquía visual

Ordenar lo que se ve por importancia: lo que el ojo debe leer primero va arriba y/o más grande.

- Títulos (`h1`, `h2`...) organizan la página.
- Un "botón de acción principal" debe destacar sobre el resto.
- El contraste entre lo importante y lo secundario guía al usuario.

## 2. Color

- **Color de fondo vs. color de contenido**: debe haber contraste suficiente para leer.
- En PomodoroZion usamos un esquema de color con foco en la app (estilos en `style.css`).
- En el ejercicio de "business card" usé `rosybrown` como fondo de página.
- Paleta: elegir una **paleta reducida y consistente** (más fiable que muchos colores sueltos).

```css
body {
  background-color: rosybrown;      /* color de fondo */
  font-family: Arial, sans-serif;    /* tipografía */
}
```

## 3. Tipografía

- `font-family` define la fuente; se pueden dar **fallbacks** separados por coma:
  `font-family: Arial, sans-serif;` -> "prueba Arial; si no, una sans-serif genérica".
- El sistema de fallbacks hace más resistente el diseño.
- Tamaño de texto legible; los títulos más grandes que el cuerpo.

## 4. Espaciado y el modelo de caja (box model)

Cada elemento es una caja: contenido + padding + borde + margen.

```css
.business-card {
  width: 300px;
  padding: 20px;                 /* espacio DENTRO del borde */
  margin-top: 100px;             /* espacio FUERA (arriba) */
  margin-left: auto;             /* centrar horizontalmente */
  margin-right: auto;
  text-align: center;
  font-size: 16px;
}
```

- **Padding**: espacio entre el contenido y el borde (por dentro).
- **Margin**: espacio entre la caja y las demás (por fuera).
- **`margin-left: auto; margin-right: auto;` + un `width`** -> centra el elemento.

## 5. Componentes e interfaces

- Reutilizar **clases** (`business-card`, `profile-image`, `portfolio-link`) en vez de
  estilar elemento por elemento.
- Los componentes se componen: foto + nombre + puesto + empresa + enlaces.
- Separar estructura (HTML), estilo (CSS) y comportamiento (JS).

## 6. Responsive design (el foco del curso que estoy haciendo)

Hacer que el diseño **se adapte a cualquier pantalla** (móvil, tablet, escritorio).

- Imágenes fluidas con `max-width: 100%` (que nunca desborden):
  ```css
  .profile-image {
    max-width: 100%;
  }
  ```
- Enlaces sin subrayado se pueden estilar así:
  ```css
  a {
    text-decoration: none;
  }
  ```
- La base del responsive: **porcentajes y max-width** en vez de anchos fijos absolutos.

### Media queries (hecho de verdad en PomodoroZion)

Una **media query** aplica reglas solo cuando se cumple una condición. Patrón "desktop-first":

```css
@media (max-width: 600px) {
  /* reglas que solo aplican en pantallas de 600px o menos */
}
```

Todo lo que está FUERA del bloque rige en escritorio; dentro del bloque, overrides para móvil.

Lo que corregimos en la app (cada uno con su problema de fondo):

1. **`#user-bar` (barra de usuario) estaba en `position: absolute`** pegada al título.
   -> En móvil: `position: static; justify-content: center;` para que baje debajo del `h1`
   en vez de pisarse. Importante: si el original lleva `transform: translateY(-50%)`,
   hay que resetearlo con `transform: none`.

2. **`.stats-grid` tenía 4 columnas fijas** -> en móvil a 2:
   ```css
   .stats-grid { grid-template-columns: repeat(2, 1fr); }
   ```

3. **Botones del timer se solapaban y no se centraban** (por un selector mal escrito:
   `.timer-buttons button` cuando el contenedor era `.timer-buttons`). Además se repartían
   mal el ancho. La solución limpia:
   ```css
   .timer-buttons button { flex: 1; min-width: 0; }
   ```
   `flex: 1` = los botones se reparten el ancho disponible **por igual** (y `min-width: 0`
   permite que encojan sin desbordar). Resultado: Iniciar/Pausar/Reiniciar en fila centrada
   incluso a 320px, sin `flex-wrap` ni solapes.

4. **Antes el `button` genérico se estilaba para todos** -> mejor apuntar solo a los que
   queremos: `.timer-buttons button` (no perjudica a botones de login/edit/delete).

5. **`overflow-x: hidden` en `body`** -> evita scroll horizontal "fantasma" si algo se sale.
   Y `html { -webkit-text-size-adjust: 100%; }` evita auto-zoom del iOS al tocar inputs.

6. **Objetivo táctil**: en móvil los botones deben ser generosos (≈44px). Ajustamos padding
   de `#logoutBtn` y reducimos el global de la app vía media query.

7. **Márgenes de respiración**: en pantalla pequeña reducimos `header`, `section` y `main`
   (padding/margen) para ganar espacio útil para el contenido.

> Lección: **los selectores importan**. Un `#` vs `.` (o un falso `.x button` cuando la clase
> es el contenedor) rompe todo el layout sin "dar error". El responsive no solo es "¿cabo?",
> es verificar que cada botón/barrera/tarjeta se comporta en TODOS los tamaños (320, 375, 480).

### (Pendiente de profundizar en el curso)

- **Flexbox** (disposición en fila/columna flexible).
- **CSS Grid** (layout en rejilla de 2D).
- Unidades relativas (`rem`, `em`, `vh`, `vw`).

## 7. Wireframes y prototipos

- **Wireframe**: esquema en blanco y negro de la estructura (muy rápido de dibujar).
- **Prototipo**: versión más acabada que se puede probar con un usuario.
- Se hacen ANTES de escribir el HTML/CSS final para definir dónde va cada cosa.

## 8. Accesibilidad (aplicada al curso)

- `alt` en imágenes con descripción significativa (p.ej. "a red flower").
- Texto de enlaces claro (uso del texto visible como "Portfolio" / "Twitter", no "click aquí").
- Contraste adecuado texto/fondo.
- La accesibilidad no es un lujo: es para que pueda usarlo todo el mundo.

### 8.1 Checklist que preguntan SIEMPRE (WCAG + SEO)

**WCAG** (Pautas de Accesibilidad al Contenido Web, del W3C) — lo que debes saber:

- Se organiza en **4 principios**: Perceptible, Operable, Comprensible, Robusto
  (mnemónico: **POCR**).
- **Niveles de conformidad: A, AA, ABB**. El estándar legal/común es **AA** (el título
  completo: *WCAG 2.2 / AA* es lo que ve en webs dentro de la UE por la Directiva de
  Accesibilidad).
- Los puntos que más se ponen en examen:
  - **Perceptible**: `alt` descriptivo, subtítulos en vídeos, contraste mínimo 4.5:1
    para texto normal.
  - **Operable**: todo navegable por **teclado** (sin ratón → foco visible móvil),
    no temporizadores cortos, contenido no parpadea (epilepsia), encabezados de página
    (h1, h2) que estructuran.
  - **Comprensible**: idioma declarado (`lang="es"`), etiquetas visibles en formularios.
  - **Robusto**: HTML semántico válido, ARIA solo cuando el HTML no basta.

**SEO (posicionamiento) — lo mínimo que preguntan:**

- **`<title>`** única por página (lo que se ve en la pestaña y en Google).
- **HTML semántico**: `h1` por página, jerarquía `h1>h2>h3`, `<nav>`, `<main>`,
  `<section>`, `<article>` — a los buscadores les encanta.
- **Metadatos**: `<meta name="description">` (el texto gris del resultado en Google).
- **Accesible = amigo de Google**: un `alt` bueno y contraste hacen que tu página
  puntúe mejor también en SEO. Van de la mano.

> Regla: en examen, si ves *"Percepcible/Operable/Comprensible/Robusto"* o
> *"A / AA / AAA"* o el número *4.5:1* → estás ante WCAG. Si ves *"title, meta,
> description, semántico"* → SEO. Ambos potencian tu página.

## 9. Prácticas del temario y cómo se cubren

- [x] Rediseñar una página simple -> retoques a PomodoroZion.
- [x] Crear un sistema de botones -> estilos de botones de la app.
- [x] Diseño responsive de la app -> media query a 600px (módulo 04, reto completado).
- [ ] Crear una tabla responsive (pendiente).
- [ ] Diseñar un formulario largo (pendiente).
- [ ] Mejorar accesibilidad de una interfaz (empezado con alt/contraste).

## Dudas pendientes

- [x] Media queries para que PomodoroZion se vea bien en móvil -> hecho (ver sección 6).
- [ ] Flexbox y Grid a fondo (en curso en freeCodeCamp).

## Repaso

- [ ] Lo entiendo.
- [ ] Lo he practicado (estilos de la app + ejercicios de responsive).
- [ ] Podría explicarlo a otra persona.
