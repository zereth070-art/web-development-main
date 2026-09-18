# Apuntes: Desarrollo web en cliente (JavaScript en el navegador)

> Apuntes construidos a partir del frontend de **PomodoroZion**:
> JS moderno, DOM, eventos, formularios, Fetch, y dos retos de seguridad
> (XSS y un sistema de notificaciones toast).

## 1. JavaScript moderno (sintaxis que usamos)

- **const / let** para declarar variables (evita `var`).
- **Arrow functions**: `(x) => x * 2` (más cortas que `function`).
- **Template literals** (comillas invertidas) para interpolar: `` `Hola ${nombre}` ``.
- **async/await** para código asíncrono legible (en vez de cadenas de `.then`).
- **Destructuring y spread**: `const { id, title } = tarea`.

## 2. El DOM (Document Object Model)

El navegador convierte el HTML en un árbol de objetos. Con JS lo recorremos y modificamos.

```js
document.getElementById("task-input")  // pillo un elemento por su id
element.value                          // su valor (input)
element.innerHTML = "..."              // su HTML interior
element.classList.add("oculto")        // añadir/quitar clases CSS
element.addEventListener("click", f)   // escuchar eventos
```

> Patrón que usamos: **seleccionar un elemento, colgarle un `addEventListener`,
> y de dentro leer campos o mostrar resultados** (p. ej. leer la tarea y listarla).

## 3. Eventos

Un **evento** es una acción que el navegador detecta: clic, teclado, envío de formulario.

- `click` en botones.
- `submit` en formularios -> casi siempre `e.preventDefault()` para que no recargue la página.
- `change` / `input` en campos.
- `keydown` / `keyup` para teclado.

```js
form.addEventListener("submit", async (e) => {
  e.preventDefault();            // no recargar la página
  const titulo = input.value;
  // ...enviar a la API
});
```

## 4. Formularios

- Capturar valores de inputs y validar antes de enviar.
- **Nunca fiarse solo del frontend**: es bueno validar aquí para dar feedback rápido,
  pero el backend vuelve a validar.
- Evitar recargar la página al enviar (`preventDefault`).

### Mini-taller: expresiones regulares (lo que valida el email del registro)

Una **expresión regular (regex)** es un patrón de texto. Se escribe entre `/ /`
y deja que JS "detecte" lo que pides. Usamos `escapaHtml` con regex sin saberlo:
`/&/g` busca todos los `&` — la `g` final = *global* (todas, no solo la primera).

- `[a-z]` = UN carácter; `[0-9]` = una cifra; `[a-zA-Z]` = letra de cualquier caja.
- **El patrón manda:** si el texto no tiene lo que pides, `match()` no inventa nada
  (devuelve las pocas coincidencias que haya) y `replace()` no toca nada.
- **`match()`** recolecta las coincidencias (array); **`replace()`** las cambia.
- **`+`** = la pieza anterior **una o más** veces (exige mínimo 1: "campo con contenido").
- **`*`** = **cero o más** veces (perdona la ausencia: "puede ir vacío").
- **El patrón camina hasta la frontera:** `[a-z]+` se traga todas las letras seguidas
  y se detiene en el primer carácter que no es letra (un `@`, un número...).

Diferencia vista con `texto2 = "solo@ @fin @ @medio@medio"`:
`/[a-z]+@[a-z]+/` → solo `medio@medio` (exige letras a ambos lados).
`/[a-z]*@[a-z]*/` → hasta los `@` solitarios.

El **email** se valida con `test()` — el corazón del chequeo del formulario:

```js
const valido = /^[a-z]+@[a-z]+$/.test("hola@prueba");   // true (^ inicio, $ final)
```

## 5. Fetch y APIs (conectar frontend con backend)

`fetch` hace peticiones HTTP desde el navegador y devuelve una promesa.

```js
const res = await fetch(`${API_URL}/tasks`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Mi tarea" }),   // 'Authorization' con la sesión si hace falta
});
const data = await res.json();
```

- `GET` para leer, `POST` para crear, `PUT` para actualizar, `DELETE` para borrar.
- `await res.json()` transforma la respuesta a objeto JS.
- La URL de la API suele estar centralizada (`const API_URL = "/api/tasks"`).

### AJAX clásico (el temario pregunta esto) vs `fetch` (lo que usamos)

- **AJAX** (Asynchronous JavaScript And XML) = la TÉCNICA de hablar con el servidor
  **sin recargar la página**. No es un lenguaje: es el concepto. `fetch` ES AJAX.
- Antes de `fetch`, el estándar era **`XMLHttpRequest`** (XHR). Mismo viaje, sintaxis fea:

```js
const xhr = new XMLHttpRequest();              // crear la petición
xhr.open("GET", "/api/tasks");                 // configurar método + URL
xhr.onload = () => { console.log(xhr.responseText); };  // qué hacer cuando llegue
xhr.send();                                    // lanzar
```

- `fetch` = evolución moderna del mismo concepto: más corto, devuelve **promesas**
  (`await`), y maneja JSON con `res.json()` en vez de `xhr.responseText`.
- Reconocerlo en examen: si ves `new XMLHttpRequest()`, `onreadystatechange`,
  `readyState`, `responseText`, `send()` → están hablando de **AJAX clásico/XHR**.
- **Regla de oro:** el resultado del tema es saber que AMBOS hacen lo mismo
  (petición al servidor desde JS, sin recarga) — `fetch` es el moderno, XHR el abuelo.

## 6. Estado en el cliente y "SPA"

- **Estado** = los datos "vivos" de la interfaz (lista de tareas, usuario conectado...).
- Tras crear/modificar/borrar, **recargamos la lista desde el servidor** para que UI y datos
  cuadren.
- Un **SPA** (Single Page Application) actualiza partes de la página sin recargarla.
  Nuestro `script.js` hace eso: una sola página que se repinta según la acción.

## 7. Reto: escape de HTML (seguridad XSS) — concepto clave

Cuando insertamos datos del usuario en el HTML (`innerHTML`), un texto malicioso como
`<img src=x onerror=...>` **se ejecuta**. Eso es **XSS (Cross-Site Scripting)**.

La defensa: **escapar el HTML** = convertir caracteres peligrosos en entidades seguras,
SIEMPRE con `&` primero:

```js
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

- `&` -> `&amp;`
- `<` y `>` -> `&lt;` / `&gt;` (los corchetes ya no abren etiquetas)
- `"` y `'` -> entidades de comillas

Así el navegador lo muestra como **texto**, no como HTML ejecutable.

> Regla: **nunca inyectar datos del usuario en `innerHTML` sin escapar**.
> Esto es seguridad de alto valor y difícil de "ver" — por eso es un gran logro.

### El CICLO DE VIDA de un dato (lo que une fetch, el estado y XSS)

No son 3 temas sueltos: es EL MISMO dato recorriendo un camino. El conducto que lo
transporta (fetch) y la parada donde se pinta (renderTasks) son los 2 puntos frágiles.

```
[1] ENTRADA              [2] MOSTRAR                [3] RIESGO
fetch / res.json()  →    estado + applySearch() →   innerHTML sin escapar
(how the data arrives)   (how it lives / paints)    (si falla aquí → XSS)
```

La conexión killer: **la MISMA función que pinta es la que puede matarte.**
`renderTasks()` es la que protagonizó el bug del buscador (pintaba todo sin respetar
el filtro) *y* es la que mete `innerHTML` (donde un dato malvado se vuelve código).
Por eso la regla vale doble: **un solo camino de pintado + desinfectar lo que toca
la pantalla**.

Mi analogía (de la ronda de repaso): fetch = pedir la pizza; mostrar = enseñar qué
hay en la casa; XSS = pedir una pizza *con el ingrediente malvado* y que se la
entreguen en casa de OTRA persona — y lo que ella ve/live vuelve a mis manos. 🍕🧨

Extra que descubrí y vale preguntas de entrevista: "estado optimista" (actualizar la
UI desde la memoria en vez de re-fetch) es real y se usa, pero duplica el estado
(memoria + BD) y hay que revertir si el servidor dice que no. El re-fetch de BD que
hacemos aquí mantiene a todas las pestañas sincronizadas "sin pagar complejidad".

## 8. Reto: notificaciones tipo "toast" y DRY

Reemplazamos un montón de `alert()` y 3 funciones repetidas por **una sola función
reutilizable** (`showToast`):

```js
function showToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 3000);  // se oculta sola
}
```

### Principio DRY (Don't Repeat Yourself)

Había 3+ funciones casi iguales (`showAuthError`, `showTaskError`, más los `alert`).
**DRY = si repites el mismo código, extráelo a UNA función y úsala en todos lados.**

- Refactorificar = **reorganizar código sin cambiar su comportamiento**, para dejarlo más limpio.
- Ventajas: menos duplicación, tocar en un solo sitio si algo cambia, más fácil de leer.
- Es lo que separa código "amateur" de código "profesional".

## 9. Reto: buscador con filtros (filtrado en el cliente)

Un buscador que filtra la lista **sin consultar al servidor** (los datos ya están en memoria).

### La pieza clave: centralizar el pintado en UNA función

Antes del refactor, cada acción repintaba la lista a su manera. Ahora hay **una sola
función que pinta** (`renderTasks`) y un **único punto donde se decide el filtro**:

```js
function applySearch() {
  const texto = taskSearch.value.trim().toLowerCase();
  const filtradas = allTasks.filter((t) => t.title.toLowerCase().includes(texto));
  renderTasks(filtradas);
}
```

- `.trim()` quita espacios sobrantes (que " hola " buscara igual).
- `.toLowerCase()` hace la búsqueda **insensible a mayúsculas** ("HOLA" == "hola").
  Hay que bajar a minúsculas AMBOS lados (el texto y el título).
- `.includes()` mira si la cadena contiene el texto en cualquier posición.

### Por qué es así (el bug del "solo aparecían al buscar")

La función que trae los datos del servidor (`loadTasks`) **no devolvía a llamar al filtro**:
la lista arrancaba vacía y lo único que la pintaba era el buscador. La clave del patrón:

```js
async function loadTasks() {
  const response = await fetch(API_URL);
  allTasks = await response.json();
  applySearch();        // respeta lo que haya escrito el usuario
}
```

> Regla: **toda recarga de datos debe pasar por el MISMO camino de pintado** que el buscador.
> Si un botón (crear, +1 pomodoro, eliminar) repinta de otra forma, se pierden los filtros
> y la UI queda "mentirosa" (se ve toda la lista aunque busques "hola").

### El mensaje "No se encontraron tareas"

Va DENTRO de `renderTasks`, no en el listener del buscador, para que aplique siempre
(también cuando la lista esté vacía de verdad):

```js
if (filtradas.length === 0) {
  taskList.innerHTML = "<li class='empty'>No se encontraron tareas</li>";
  return;
}
```

## 10. Reto (secundario): manejo de sesión en el cliente

Cuando el servidor pierde la sesión (p. ej. tras un redeploy), las peticiones devuelven
**401/403**. Si el frontend las ignora, se queda en un **bucle infinito** de errores.

Solución en `poll()`:

```js
if (response.status === 401 || response.status === 403) {
  sessionAlive = false;
  if (ws) ws.close();
  showAuth();            // vuelve a mostrar el login
  return;
}
```

- Detectar el error HTTP (no es solo "funciona o no").
- Cortar el bucle (WebSocket y polling) cuando la sesión ha muerto.
- Devolver al usuario al login de forma explícita.

> Lección: **el frontend debe reaccionar al estado real de la API**. "No hace nada" y
> "no deja loguear" suelen ser JS roto por un error de filtrado/carga, no magia.

## 11. Accesibilidad frontend (contigo empezando en los retos)

A destacar de cara al temario:
- Texto de enlaces descriptivo ("Portfolio", no "click aquí").
- Los `alt` en las imágenes (descripción significativa).
- Contraste de color y feedback claro de errores (el toast da feedback audible/visible).
- `_blank` en enlaces externos.

## 12. React: arquitectura SPA y estructura con Vite (apuntes de clase)

> Este trimestre se recrea **PcComponentes con React**. JS vanilla (DOM, fetch, SPA) sigue
> valiendo de fundamento; esto es el salto a componentes.

### Arquitectura: SPA / CSR (Client Side Rendering)

```
cliente web ────────────────►  servidor NODEJS
                                   │
                                   ▼
                        proyecto servicios RESTful / API REST
                                   │
                                   ▼
                             servidor BD MongoDB
```

- **Una única descarga al principio** (cuando se pide la URL inicial): `app-REACT` recibe
  el **bundle** (código JS + HTML) y ya se ejecuta en el navegador.
- **A partir de ahí se interactúa en el cliente**: nada de pedirle páginas al servidor.
- ¿¿Persistencia de datos?? El **storage del navegador no sirve** (se limpia). Para
  intercambiar datos puntuales hace falta un servidor: **API REST / RESTful**.

> Lección que ya te pagaste en pedidos: *en memoria se muere*. Aquí el profe te da la
> teoría: la data no vive en el cliente, vive en el servidor (Mongo).

### Crear un proyecto React con Vite

```bash
npm create vite@latest my-app -- --template react
```

Arranca un servidor de desarrollo en el puerto **5173** (`http://localhost:5173`).

```
directorios:
  - public   contenido estático del portal (imágenes, js de paquetes externos, ...)
  - src      contenido de la app React (ficheros de componentes .jsx)
```

### Estructura por defecto

- **`src/main.jsx`** — fichero de entrada principal de la app:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root'))   // monta la jerarquía (árbol) de componentes
  .render(
    <StrictMode>   // 1º componente a insertar en <div id="root">
      <App />      // 2º componente hijo
    </StrictMode>,
  )
```

- **`src/App.jsx`** — componente inicial; usa hooks como `useState`:

```jsx
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <button type="button" onClick={() => setCount((count) => count + 1)}>
        Count is {count}
      </button>
    </>
  )
}
export default App
```

- **`index.html`** — único fichero HTML (SPA).

> El **bundle** de Vite es el mismo concepto del que habla **0614 Despliegue**: construir y
> servir estáticos. Lo estás viendo en dos asignaturas.

## 13. Prácticas del temario y cómo se cubren

- [x] Lista de tareas -> CRUD de tareas en `script.js`.
- [x] Consumo de API -> `fetch` a `/api/tasks` y `/api/auth`.
- [x] Formularios -> registro, login, creación de tarea, cambio de contraseña.
- [x] SPA -> una sola página que se repinta sin recargar.
- [x] Buscador con filtros -> reto completado (sección 9).
- [ ] Carrito de compra / panel admin (fuera de este proyecto, retos aparte).

## Dudas pendientes

- [x] Buscador con filtros sobre la lista de tareas -> hecho.
- [ ] Autenticación en el frontend (cómo se guarda/envía la sesión).

## Repaso

- [ ] Lo entiendo.
- [ ] Lo he practicado (frontend real de PomodoroZion + retos XSS/toast/buscador/sesiones).
- [ ] Podría explicarlo a otra persona.

## 14. Componentes React y Virtual DOM (apuntes de clase, pasados a limpio)

### Virtual DOM (diffing / reconciliación)

React construye **en memoria** un DOM virtual a partir del DOM real. ¿Para qué? Para
evitar el **refresco/repintado continuo** que haría el motor del navegador ante
cualquier cambio del DOM desde el código (muy ineficaz).

> Aclaración: el que pinta es el motor de renderizado del navegador. Cada vez que
> tocas el DOM real, el navegador recalcula estilos, layout y repinta: eso es lo
> caro que se quiere evitar.

A partir de los nodos del DOM real, se mapea cada tag/nodo a un **objeto JS puro**:
eso son los **COMPONENTES de React**. El resultado es el **DOM virtual** (un árbol
en memoria, rápido de crear y de comparar).

Si hay un cambio (por acción del usuario y sus eventos) en alguno de esos componentes:

1. React **compara en el DOM virtual los componentes antiguos con los nuevos**
   ← busca *diferencias* (**DIFFING**).
2. **Modifica en el DOM virtual solo los objetos que han cambiado**, no todo el
   DOM (que sería lo que haría el navegador). *(El profe lo llama "REFACTORING",
   aunque el nombre técnico real es **RECONCILIACIÓN** (reconciliation). No
   confundir con "refactorizar código", que es otra cosa: reorganizar código sin
   cambiar su comportamiento.)*
3. Una vez actualizado el DOM virtual, **lo vuelca al DOM real** y el navegador pinta.

> Matiz fino: en realidad React no edita el DOM virtual "viejo": construye un árbol
> nuevo con el estado nuevo y el **diffing** calcula el conjunto mínimo de cambios
> que aplicar en el DOM real. Para clase basta con el concepto del profe.

**Ventajas:**

- **Rapidez**: no se actualiza continuamente todo el DOM.
- **Eficacia**: no repites nodos de la página; creas componentes reutilizables.
- El diffing **establece prioridades** al aplicar los cambios de los componentes
  modificados para que el usuario tenga **sensación de inmediatez**.

> Eso de "prioridades" en React moderno se llama *concurrent features* / suspensión.
> A nivel de curso, quédate con la idea: React decide qué actualizar primero para
> que la interfaz responda rápido.

### Componentes React: reglas

- Son la **unidad básica** de trabajo: un **fichero con extensión `.jsx`** (JS + HTML).
- Las primeras líneas son las **importaciones** de recursos necesarios:

```jsx
import { useState } from 'react'        // del paquete react
import './Registro.css'                 // estilos del componente
```

- Un componente es una **función JS** y **SIEMPRE empieza en MAYÚSCULA**;
  si no, React no lo reconoce (`<Registro />` funciona, `<registro />` no).

```jsx
function NombreComponente(props) {      // puede recibir props (propiedades)
  // código JS

  return <div>...</div>                 // devuelve UN único nodo HTML (o un fragment)
}

export default NombreComponente         // lo hace reutilizable
```

**Reglas de oro:**

1. Nombre en **Mayúscula** (obligatorio).
2. Devuelve **SIEMPRE un único nodo raíz**... o un **fragmento** `<> ... </>`.

> Con React moderno (16.2+) un componente puede devolver varios nodos si los
> envuelves en un **fragment** `<>...</>`, un "nodo invisible" que no crea etiqueta
> real. Es la razón del `<>` al principio de `Registro.jsx`.

3. Las **props** son los datos que el padre pasa al hijo (solo lectura).
4. `export default` hace el componente **reutilizable/importable** en otros ficheros.

### Conexión con PomodoroZion

El "renderTasks" y el repintado manual con `innerHTML` eran justo lo que React
automatiza con el diffing: tú declaras cómo debe verse la UI según el estado y
React aplica solo los cambios. Mismo concepto, sin "pintar a mano".
