# UT01 · RA2 — Ciclo de vida del Servlet y peticiones HTTP

> Prácticas: `practicas/ut01/jakartaServlet/InitDemoServlet` y `.../JakartaLogin`

## Qué pide el RA2

Escribir sentencias que ejecuta el servidor web e integrar código en lenguajes de marcas.
En UT01 eso es: **servlet + JSP**, el camino manual, antes de que Spring te lo tape todo.

## El contenedor es el que manda

El servlet no se instancia a sí mismo. El **contenedor** (Tomcat) lo crea, lo inicializa,
lo reutiliza y lo destruye. Ese ciclo tiene nombres propios:

```
new AltaServlet()   →   init()   →   doGet()/doPost() ...   →   destroy()
   UNA vez               UNA vez        UNA VEZ POR PETICIÓN       al apagar
```

- **`init()`** — se llama **una sola vez**, al crear la instancia.
- **`doGet` / `doPost`** — se llama **una vez por petición**, sobre la misma instancia.
- **`destroy()`** — se llama al bajar la app (redeploy, parada de Tomcat).

> Por eso la **hora de inicialización de `InitDemoServlet` no cambia al recargar**:
> `init()` ya corrió hace rato. Lo que sube es el contador, porque `doGet` corre cada vez.

## Una instancia, muchas peticiones (y muchos hilos)

El contenedor crea **una** instancia y la reutiliza para todas las peticiones. Además
atiende varias a la vez en hilos distintos. De ahí dos cosas:

1. Los **atributos de instancia** (campos) son el estado que sobrevive entre peticiones.
   Por eso `horaInicializacion` aguanta.
2. **`HttpServlet` no es thread-safe.** Tocar un campo compartido desde varios hilos
   a la vez es una condición de carrera.

`InitDemoServlet` lo demuestra con dos contadores:

```java
private int contadorPeticiones = 0;                              // NO seguro entre hilos
private AtomicInteger contadorPeticionesAtomic = new AtomicInteger(0);  // sí

contadorPeticiones++;                       // lee, suma, escribe
contadorPeticionesAtomic.incrementAndGet(); // atómico de verdad
```

El `int` se puede **perder incrementos**: el hilo A lee 5, el hilo B lee 5, los dos
escriben 6. El `AtomicInteger` usa Compare-And-Swap: si alguien cambió el valor entre
tu lectura y tu escritura, reintenta. Con poca carga nunca lo notarás, pero el
principio es el que se pregunta: *un servlet es un objeto compartido entre hilos*.

> Regla práctica: si un dato necesita ser compartido **y mutado**, `AtomicInteger` o
> `synchronized`. Si solo se **lee**, un `List` inmutable te vale.

## `loadOnStartup`: cuándo se ejecuta `init()`

Por defecto un servlet se crea **de forma perezosa**: en la primera petición que lo toca.

```java
@WebServlet(value = "/alta", loadOnStartup = 1)   // loadOnStartup > 0 → al arrancar
```

Con `loadOnStartup = 1`, `init()` corre al **desplegar la app**, no al primer GET.
Eso cambia dónde ves los fallos: si el fichero que lees no está, con carga perezosa el
error sale en la primera visita; con `loadOnStartup` sale al arrancar.

```java
@Override
public void init() throws ServletException {
    try {
        tecnologias = List.copyOf(FileUtil.leerFichero(getServletContext(),
                        "/WEB-INF/datos/tecnologias.txt"));
    } catch (TxtNoEncontradoException | IOException e) {
        throw new ServletException("no se pudieron cargar los datos", e);
    }
}
```

- **`ServletException` en `init()`** = la app no arranca. La web queda marcada como no
  desplegada. Es el sitio correcto para "fatal de configuración".
- **`List.copyOf(...)`** deja la lista inmutable. `init()` corre en un hilo y las
  peticiones en otros: si la lista fuese mutable, un POST podría cambiarla mientras un
  GET la lee. Inmutable y se acaba el problema.
- `getServletContext()` da acceso a la app entera. Sirve para
  `getResourceAsStream(...)` y para leer ficheros de `/WEB-INF`.

**Por qué no leer los ficheros en `doGet`:** es la decisión de diseño de la práctica.
Releyendo `tecnologias.txt` en cada visita, el disco se convierte en el cuello de
botella y el trabajo se repite N veces para el mismo resultado. Los datos no cambian
en caliente, así que se cargan una vez.

## Los métodos que importan

| Método | Para qué |
| --- | --- |
| `doGet` | Peticiones de lectura. Se puede repintar sin miedo. |
| `doPost` | Envío de formularios. **No** se repinta: se reenvía y duplica el alta. |
| `doPut` / `doDelete` | Igual que el resto, si expones una API. |
| `service` | El padre decide a cuál llamar según el verbo HTTP. No lo sobreescribas. |

`HttpServlet` ya implementa `service()` y **rechaza** los métodos que no implementaste
con `405 Method Not Allowed`. No hace falta comprobar el verbo a mano en cada método.

## `forward` vs `sendRedirect` (el clásico que siempre se pregunta)

| | `forward` (dentro de servidor) | `sendRedirect` (manda al navegador) |
| --- | --- | --- |
| Responde con | la página, status 200 | 302 + cabecera `Location` |
| El navegador ve | **nada**: cree que es una sola página | una **petición nueva** a la URL |
| Sirve para | ir a un JSP interno (`/WEB-INF/...`) | ir a otra URL tras un POST |
| ¿Puede ir a `/WEB-INF/`? | **Sí**, es la razón de existir | **No**, es invisible desde fuera |

`forward` es lo que te deja usar JSP que viven en `/WEB-INF/` (inaccesibles por URL
directa, como `formulario.jsp` y `confirmacion.jsp` de `JakartaLogin`).

```java
request.getRequestDispatcher("/WEB-INF/formulario.jsp").forward(request, response);
```

> El **POST/Redirect/GET** de `thymeleaf-tareas` es el patrón de web: tras crear algo
> mandas `redirect:/` en vez de `forward`, así el F5 del usuario no vuelve a enviar el
> formulario. `forward` = "el servidor le enseña otra página"; `redirect` = "que vaya él
> a buscarla".

## `request.setAttribute`: cómo viajan los datos al JSP

Los atributos viven **solo durante esa petición**. El servlet rellena, el JSP lee:

```java
request.setAttribute("tecnologias", tecnologias);   // servlet
```

```jsp
<c:forEach var="t" items="${tecnologias}">          <!-- JSP -->
```

- Nombre `String`, valor `Object`. Lo que metas, lo que salga (con el cast acordado).
- **No sobrevive** a la siguiente petición. Es por diseño: evita que una petición de un
  usuario vea datos de otra.
- Para lo que sí persiste (quién está logueado) existe `HttpSession`.

## Los 3 atributos de la petición que se usan siempre

```java
request.getParameter("nombre");   // lo que MANDA el cliente: <input>, query string
request.getAttribute("mensaje");  // lo que puso el SERVLET antes
request.getSession();             // la sesión del usuario
```

La diferencia entre `getParameter` y `getAttribute` es **la confianza**:
`getParameter` lo controla el usuario (mándale `/etc/passwd` como nombre y lo pruebas),
`getAttribute` lo pusiste tú. Nunca uses un `getParameter` para decidir permisos.

Y el orden de codificación, que se te olvida y da mil errores raros:

```java
request.setCharacterEncoding("UTF-8");   // ANTES de leer cualquier parámetro
String nombre = request.getParameter("nombre");
```

Sin esa línea, un nombre con `ñ` o tildes llega roto.

## Formularios: validar en el sitio que toca

Hay **dos** validaciones y las dos hacen falta:

- **HTML** (`required`, `type="email"`) → feedback inmediato, gratis, pero **el cliente
  siempre puede saltárselo** (o ni siquiera usar tu formulario).
- **Servlet** (`if (nombre == null || nombre.isBlank())`) → la única que **no se puede
  saltar**, porque es tu código y el usuario no lo controla.

En la práctica de tu profe, `nombre` **no** lleva `required` a propósito: si lo tuviera,
el navegador bloquearía el envío vacío y el `if` del servidor nunca se ejecutaría. Para
ver la validación del servidor tienes que poder enviar vacío.

### Repintar el formulario tras un error

El usuario se fastidia si al equivocarse pierde todo lo escrito. La regla es simple:
**el servlet devuelve exactamente los valores que recibió**, y el JSP los pinta.

```java
if (nombre == null || nombre.isBlank()) {
    setListas(request);
    request.setAttribute("mensaje", "El nombre es obligatorio");
    request.setAttribute("email", email);        // ← lo que ya escribió
    request.setAttribute("tecnologia", tecnologia);
    request.setAttribute("nivel", nivel);
    request.getRequestDispatcher("/WEB-INF/formulario.jsp").forward(request, response);
    return;
}
```

Y para los `<select>`, la opción elegida se marca comparando con la variable del bucle:

```jsp
<c:forEach var="t" items="${tecnologias}">
  <option value="${t}" ${t == tecnologia ? 'selected' : ''}>${t}</option>
</c:forEach>
```

- `${t == tecnologia ? 'selected' : ''}` → si coincide, mete el atributo `selected`.
- Sin esto, el `<select>` vuelve a la **primera opción** y el usuario pierde su elección
  aunque el servidor la hubiera recibido bien.
- El `${...}` fuera de una etiqueta JSTL es **EL** (Expression Language), no JSP. Es el
  mismo lenguaje dentro de `${}`.

## Escapar siempre lo que viene del usuario (XSS reflejado)

Este es el fallo que más se cuela y más se pregunta. Si pintas un valor del usuario tal
cual, el usuario puede mandar HTML y **ejecutarse en el navegador de quien lo ve**.

```jsp
<!-- MAL: XSS reflejado -->
<input value="${nombre}">
<h1>Hola ${nombre}</h1>

<!-- BIEN: escapado -->
<input value="<c:out value='${nombre}'/>">
<h1>Hola <c:out value="${nombre}"/></h1>
```

Probado: mandando `<script>alert(1)</script>` como nombre, la versión sin escapar lo
imprime tal cual; con `<c:out>` sale `&lt;script&gt;` — se ve el texto, no se ejecuta.

Dos matices:

- `<c:out>` escapa `<`, `>`, `&`, `"` y `'`. Es lo que necesitas **tanto dentro de
  contenido HTML como dentro de un atributo**.
- `${...}` **nunca** escapa. Esa es la diferencia entre JSP y Thymeleaf, donde `th:text`
  sí escapa por defecto y `th:utext` es el que se salta el escapado.

## Desplegar en Tomcat: el flujo real

1. `packaging` debe ser **`war`** en el `pom.xml` (no `jar`):

```xml
<packaging>war</packaging>
```

2. `jakarta.servlet-api` va con scope **`provided`**: la aporta Tomcat, no la empaquetes.

```xml
<dependency>
    <groupId>jakarta.servlet</groupId>
    <artifactId>jakarta.servlet-api</artifactId>
    <version>6.0.0</version>
    <scope>provided</scope>
</dependency>
```

3. `./mvnw package` genera `target/<artifactId>-<version>.war`.
4. Copiar el `.war` a `tomcat/webapps/` y al arrancar se descomprime solo.
   El **nombre del WAR es el path de la app**:

```
webapps/JakartaLogin-1.0-SNAPSHOT.war  →  http://localhost:8080/JakartaLogin-1.0-SNAPSHOT/alta
```

> Por eso el contextPath sale con la versión pegada. Si molesta, renombra el WAR
> (sin versión) o accede siempre con esa parte.
>
> No llames a la aplicación `/root`, `/examples` o `/manager`: son rutas que ya existen
> en Tomcat y te vas a confundir.

5. Cambios en **Java** → recompackage y recopia el WAR (o redeploy desde IntelliJ).
   Cambios en **JSP** → a veces basta con recargar; si no, redeploy.

## La trampa de las versiones

El `web.xml` declara contra qué versión del **espec** está escrito, y tiene que encajar
con tu Tomcat:

| Tomcat | Servlet | `web.xml` version | Java mínimo |
| --- | --- | --- | --- |
| 9 | 5.0 (`javax`) | `5_0.xsd` | 8 |
| 10.1 | 6.0 (`jakarta`) | `6_0.xsd` | 11 |
| 11 | 6.1 (`jakarta`) | `6_1.xsd` | 17 |

- `javax.*` (Tomcat 9) y `jakarta.*` (Tomcat 10.1+) son **paquetes distintos**, no un
  import que se pueda arreglar. Tomcat 9 con código `jakarta` = `ClassNotFoundException`.
- Con **Tomcat 10.1**, un `web.xml` con `version="6.1"` **no rompe el despliegue**, pero
  se lee en `logs/catalina.out`:

  ```
  ADVERTENCIA WebXml.setVersion Unknown version string [6.1]. Default version will be used.
  ```

  O sea: se despliega pero declarando algo que el contenedor no conoce. Con Tomcat 10.1
  pon `version="6.0"`.
- Compilar contra `servlet-api 6.1` y correr en Tomcat 10.1 es la misma historia: si
  usas un método que solo existe en 6.1, en runtime sale `NoSuchMethodError`.

## Los 3 estados de un Servlet (reparto de esta UT)

| Concepto | Dónde vive | Cuándo se crea |
| --- | --- | --- |
| **Atributo de petición** | `request.setAttribute(...)` | En cada petición. Muere al terminar. |
| **Atributo de sesión** | `session.setAttribute(...)` | Al loguearse. Muere al cerrar sesión o timeout. |
| **Atributo de contexto** | `getServletContext().setAttribute(...)` | Una vez. Vive toda la app. |

Ejemplo: "el usuario logueado" es de **sesión**; "el catálogo de productos" es de
**contexto** (como tus `tecnologias.txt`, que de hecho lees en `init()` y guardas en
campo de instancia, que es lo mismo pero por la vía de un servlet).

## Preguntas de repaso

1. ¿Cuántas veces se ejecuta `init()`? ¿Y `doGet()`?
2. ¿Qué pasa si `init()` lanza `ServletException`?
3. ¿Por qué `loadOnStartup = 1` y no dejarlo por defecto?
4. ¿Por qué una instancia de servlet se comparte entre hilos? ¿Qué se rompe?
5. ¿Cuándo uso `forward` y cuándo `sendRedirect`? ¿Cuál me deja usar `/WEB-INF/`?
6. ¿Por qué `required` en el HTML no sustituye a validar en el servlet?
7. ¿Cómo se repinta un `<select>` para que conserve la opción elegida?
8. ¿Qué Rompe `${nombre}` sin `<c:out>`?
9. ¿Qué pasa si pones `version="6.1"` en el `web.xml` y usas Tomcat 10.1?
10. ¿Por qué `jakarta.servlet-api` va con `provided`?
