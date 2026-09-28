# UT01 · RA2 + RA3 — JSP, EL y JSTL (lenguajes de marcas)

> Práctica: `practicas/ut01/jakartaServlet/JakartaLogin`

## Qué piden RA2 y RA3

- **RA2**: escribir sentencias que ejecuta el servidor web e **integrar código en
  lenguajes de marcas** (el HTML no es estático: lo genera el servidor).
- **RA3**: escribir **bloques de sentencias embebidos en la página** (bucles,
  condicionales dentro del HTML).

## La idea

El HTML por sí solo es estático: lo mismo para todo el mundo. Para meter lógica dentro
hay tres tecnologías que se combinan:

| Pieza | Qué es | Ejemplo |
| --- | --- | --- |
| **Scriptlet** | Código Java dentro de la página | `<% out.println("hola"); %>` |
| **EL** (`${}`) | Leer datos | `${nombre}` |
| **JSTL** (`<c:...>`) | Etiquetas para bucles y condicionales | `<c:forEach ...>` |

Scriptlets son Java "suelto" dentro del HTML: funcionan, pero ensucian la página. **EL +
JSTL** hacen lo mismo sin código Java, y es lo que se usa. Tu profesor dejó un ejemplo
de cada uno en `formulario.jsp` commented out, justamente para que se vea el "antes" y el
"después".

### Declarar el taglib

Sin esta línea, `<c:forEach>` no se reconoce y da error:

```jsp
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
```

Y para usar `List` en un scriptlet, el import:

```jsp
<%@ page import="java.util.List" %>
```

## EL: leer datos

`${...}` es una expresión. Busca la variable en este orden, y para en el primero que
encuentre:

```
page  →  request  →  session  →  application
```

| Expresión | Devuelve |
| --- | --- |
| `${nombre}` | Busca en los 4 ámbitos. El primero que exista gana. |
| `${requestScope.nombre}` | Solo en la petición. Sin ambigüedad. |
| `${param.nombre}` | Los **parámetros** que mandó el cliente (formulario, URL). |
| `${sessionScope.usuario}` | Solo sesión. |
| `${initParam.timeout}` | Parámetros de `web.xml`. |

Los dos que más se confunden:

- **`${nombre}`** = lo que puso el **servidor** con `setAttribute`.
- **`${param.nombre}`** = lo que el **usuario** escribió en el formulario.

Son fuentes distintas de datos. Mezclarlas es un clásico de errores.

### `${...}` NO escapa

Punto clave de seguridad:

```jsp
<h1>${nombre}</h1>              <%-- si nombre = <script>alert(1)</script>, se EJECUTA --%>
<h1><c:out value="${nombre}"/></h1>   <%-- se ve el texto, no se ejecuta --%>
```

En JSP, `${}` es Java puro: si el texto parece HTML, se inserta como HTML. **Siempre** que
el dato venga del usuario, `<c:out>`. Esto es XSS reflejado y se pregunta mucho.

## JSTL: bucles y condicionales

### Recorrer una lista

```jsp
<ul>
  <c:forEach var="t" items="${tecnologias}">
    <li><c:out value="${t}"/></li>
  </c:forEach>
</ul>
```

- `var="t"` = el nombre de la variable dentro del bucle (el "elemento actual").
- `items="${tecnologias}"` = de dónde saca los elementos.

La salida es **HTML repetido**: por cada elemento de la lista, una copia del `<li>`. Si la
lista tiene 7 entradas, salen 7 `<li>`.

### Marcar la opción seleccionada

```jsp
<select name="tecnologia">
  <c:forEach var="t" items="${tecnologias}">
    <option value="${t}" ${t == tecnologia ? 'selected' : ''}><c:out value="${t}"/></option>
  </c:forEach>
</select>
```

Desglose de la expresión, que parece difícil pero son dos cosas:

- `t == tecnologia` → ¿coincide este elemento con lo que eligió el usuario?
- `? 'selected' : ''` → el **ternario** de toda la vida: si es cierto, escribe
  `selected`; si no, escribe nada.

`${t == tecnologia ? 'selected' : ''}` dentro de una etiqueta HTML es **EL normal**, no
JSTL. Las dos tecnologías se mezclan en la misma línea.

> Sin el `selected`, el `<select>` vuelve a marcar la **primera opción** por defecto.
> Es el bug típico al repintar un formulario tras un error.

### Condicionales

```jsp
<c:if test="${requestScope.mensaje != null}">
  <div class="error-msg"><c:out value="${mensaje}"/></div>
</c:if>
```

`test="${...}"` es la condición (el `test` de `if` de Java). Y en scriptlet, la versión
equivalente con Java de verdad:

```jsp
<% if (request.getAttribute("mensaje") != null) { %>
  <div class="error-msg">${mensaje}</div>
<% } %>
```

> Ojo con `<% } %>`: si le falta el punto y coma, falla. El `<% %>` de cierre **no**
> lleva punto y coma; el de apertura tampoco.

### Utilidades de JSTL

```jsp
${#lists.size(tecnologias)}      <%-- tamaño de la lista --%>
${#lists.isEmpty(tecnologias)}   <%-- ¿está vacía? --%>
```

Se usan con el prefijo `#`, que indica "esto es una función de biblioteca, no una
variable".

## Scriptlet: cuándo y por qué no

Funciona, y a veces no hay otra opción (leer algo del `request` que EL no expone).
Pero para todo lo demás, JSTL es mejor:

| | Scriptlet `<% %>` | EL + JSTL |
| --- | --- | --- |
| Mezcla Java con HTML | Sí, mucho | No |
| Se lee rápido | Regular | Bien |
| Mantenible | Mal | Bien |
| Riesgo de XSS | Alto (concatenas sin escapar) | Bajo si usas `<c:out>` |

> Regla: usa scriptlet para lo que EL no cubre, y `c:out` para todo lo que venga del
> usuario. Nunca construyas HTML concatenando texto del usuario.

## WEB-INF: por qué los JSP están ahí

`formulario.jsp` y `confirmacion.jsp` viven en `/WEB-INF/`, así que **no se pueden pedir
por URL**:

```
http://localhost:8080/app/WEB-INF/formulario.jsp   →  404
```

Se llega a ellos con `forward` desde el servlet. Es una medida de seguridad: nadie puede
saltarse tu servlet y ver la página directamente. `index.jsp` sí está fuera, y por eso es
la portada.

## Estructura típica de una app servlet

```
src/main/webapp/
  index.jsp                      ← público (portada)
  WEB-INF/
    web.xml                      ← configuración
    formulario.jsp               ← privado, solo vía forward
    confirmacion.jsp             ← privado
    datos/                       ← ficheros de datos (txt, csv)
      tecnologias.txt
      niveles.txt
```

## Leer ficheros del servidor

Los ficheros de `WEB-INF/datos/` se leen con el `ServletContext`, no con `File`:

```java
InputStream is = getServletContext().getResourceAsStream("/WEB-INF/datos/tecnologias.txt");
```

- `getResourceAsStream` devuelve un **`InputStream`** (bytes).
- `InputStream` → `InputStreamReader` (bytes a caracteres) → `BufferedReader` (leer línea
  a línea) son **tres envoltorios**, cada uno añade una cosa.
- Con `try (...)` todo se cierra solo, aunque haya excepción.
- `readLine()` devuelve `null` al acabarse el fichero: de ahí el `while`.

Como en esta práctica los datos no cambian, se leen **una vez en `init()`** y se guardan
como listas inmutables (`List.copyOf`). Ver `ra2-servlet-ciclo-vida.md`.

## Preguntas de repaso

1. ¿Qué diferencia hay entre un scriptlet, EL y JSTL? ¿Cuándo usas cada uno?
2. ¿Qué hay que declarar para usar `<c:forEach>`?
3. ¿En qué orden busca una variable `${nombre}`?
4. ¿Cuál es la diferencia entre `${nombre}` y `${param.nombre}`?
5. ¿Por qué `${nombre}` sin `<c:out>` es un problema de seguridad?
6. ¿Qué hace exactamente `${t == tecnologia ? 'selected' : ''}`?
7. ¿Por qué los JSP están en `/WEB-INF/`? ¿Cómo se llega a ellos?
8. ¿Qué tres envoltorios se ponen al leer un fichero, y para qué sirve cada uno?
9. ¿Por qué se leen los ficheros en `init()` y no en `doGet()`?
10. ¿Qué pasa si en un scriptlet te olvidas del `;` del `<% } %>`?
