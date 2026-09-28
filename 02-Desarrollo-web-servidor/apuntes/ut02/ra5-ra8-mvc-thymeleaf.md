# UT02 · RA5 + RA8 — MVC con Spring y Thymeleaf

> Práctica: `practicas/ut01/thymeleaf-tareas` (+ ejercicios en su `EJERCICIOS.md`)

## Qué piden RA5 y RA8

- **RA5**: uso del patrón **MVC** y de Separation of Concerns en el servidor.
- **RA8**: desarrollo de **aplicaciones web** separando lógica de negocio y
  presentación.

## Qué es MVC

El problema que resuelve: si mezclas todo en un solo fichero, no puedes reutilizar, probar
ni cambiar nada sin romperlo.

```
Petición → [Controller] → [Service] → [Repository] → Base de datos
                ↑              ↑
            HTTP/rutas      LÓGICA DE NEGOCIO
                │
                ▼
          [Vista (Thymeleaf)] → HTML → navegador
```

| Capa | Responde a | Nunca hace |
| --- | --- | --- |
| **Controller** | ¿de dónde vengo? → traduzco y delego | Lógica de negocio |
| **Service** | ¿qué reglas se aplican? | Tocar la BD directamente sin pasar por repositorio |
| **Repository** | ¿cómo se guarda? (SQL) | Decisiones de negocio |
| **Vista** | ¿cómo se ve? | Cálculos de negocio |

> El síntoma de una capa mal puesta: si el Service tiene `if`s de la interfaz, o el
> Controller hace consultas a la BD. Pregunta de examen directa: "¿dónde va esta línea?"

## El flujo de una petición en Thymeleaf

```
[Controlador]  model.addAttribute("tareas", tareas);  return "index";
                                   │
                                   ▼
[resources/templates/index.html]   ← plantilla con th: y ${}
                                   │  el motor la renderiza
                                   ▼
[HTML final]                       ← lo que recibe el navegador
```

- La plantilla vive en **`src/main/resources/templates/`** (convención: el motor la busca ahí).
- El controlador devuelve el **nombre sin extensión**: `"index"` → `templates/index.html`.
- El navegador recibe el HTML **ya relleno**. No hay JSON ni montaje en cliente: por eso es
  "código en lenguajes de marcas" (RA2/RA3).

## `@Controller` vs `@RestController`

| | Devuelve | Se usa en |
| --- | --- | --- |
| `@Controller` | **Vistas** (nombre de plantilla) | HTML con Thymeleaf |
| `@RestController` | **Datos** (JSON) | APIs |

En la misma app los usas los dos: el panel web es `@Controller`, la API es `@RestController`.

## Las expresiones que hay que saber (RA3)

| Expresión | Qué hace |
| --- | --- |
| `${...}` | Acceso a los datos del modelo. Ej.: `${t.titulo()}` |
| `th:each="t : ${tareas}"` | Bucle: repite el elemento por cada tarea |
| `th:if="..."` / `th:unless="..."` | Condicional: mostrar o no el elemento |
| `th:text="..."` | Mete el valor **escapado** (te protege de XSS) |
| `th:utext="..."` | Mete **HTML sin escapar**. Peligroso con datos de usuario |
| `@{...}` | Genera URL desde el contexto de la app. Ej.: `@{/tareas}` |
| `${#lists.size(...)}` | Tamaño de una lista |
| `${#lists.isEmpty(...)}` | ¿Está vacía? |

Ejemplo real de la práctica:

```html
<ul th:if="${!#lists.isEmpty(tareas)}">
    <li th:each="t : ${tareas}">
        <span th:text="${t.titulo()}">Titulo</span>
    </li>
</ul>
<p th:unless="${!#lists.isEmpty(tareas)}">Aún no hay tareas.</p>
```

### `th:text` vs `th:utext` (pregunta segura)

`th:text` escapa por defecto: si el título es `<b>hola</b>`, sale el **texto** `<b>hola</b>`,
no negrita. Con `th:utext` sale la **negrita**, y con datos de usuario eso es XSS.

> Es el equivalente en Thymeleaf de `<c:out>` en JSP. En los dos lenguajes de marcas,
> el valor por defecto escapa. `utext` es el que se salta el escapado.

## `tareas/{id}/hecha`: URL con parámetro

Thymeleaf rellena el `{id}` de la URL:

```html
<form th:action="@{/tareas/{id}/hecha(id=${t.id()})}" method="post">
    <button type="submit">Hecha</button>
</form>
```

Y el controlador lo recibe:

```java
@PostMapping("/tareas/{id}/hecha")
public String hacerTarea(@PathVariable Long id) {
    tareas.replaceAll(t -> t.id().equals(id) ? new Tarea(t.id(), t.titulo(), true) : t);
    return "redirect:/";
}
```

Dos cosas aquí:

- **`@PathVariable`** = el `id` de la URL, ya convertido al tipo que declares
  (`Long`). En JSP tenías que recibirlo como `String` y convertirlo a mano.
- **Los records son inmutables**: no hay `setHecha(true)`. Hay que **reconstruir** la
  tarea con `replaceAll`. Es la diferencia real entre un `record` y una clase con setters.

## POST + redirect: por qué `redirect:/` y no `"index"`

```java
return "redirect:/";   // después de crear algo
```

Si devolvieras `"index"`, el F5 del usuario **volvería a enviar el formulario** y crearía
el registro otra vez. Con `redirect` el navegador pide `/` con un GET limpio.

> Es el patrón **Post/Redirect/Get**. Es el mismo `sendRedirect` de JSP, pero escrito
> distinto: aquí es el valor de retorno, no una llamada al response.

## Verificación: "no hay `th:` ni `${}`"

Después de cargar la página, **Ver código fuente** (Ctrl+U). Si ves `th:each` o `${...}`,
el navegador te está dando la plantilla sin renderizar: o se sirve el fichero estático en
lugar de pasar por el controlador, o faltó el `xmlns:th` en el `<html>`.

```html
<html lang="es" xmlns:th="http://www.thymeleaf.org">
```

Sin ese `xmlns`, las etiquetas `th:` no se reconocen.

## Cambios: cuándo reiniciar

| Cambias | Qué hacer |
| --- | --- |
| Un `.html` de `templates/` | Recargar el navegador (a veces con Ctrl+F5) |
| Una clase `.java` | **Reiniciar** la app (Ctrl+C y `spring-boot:run` otra vez) |

Los cambios en Java no se aplican solos. Si "no cambia nada", es que no reiniciaste o es
caché del navegador (F12 → Network → Disable cache).

## Preguntas de repaso

1. ¿Qué problema resuelve MVC? Pon un ejemplo de "capa mal puesta".
2. ¿Qué capa decide si una tarea es tuya?
3. ¿Qué diferencia hay entre `@Controller` y `@RestController`?
4. ¿Qué devuelve el controlador: `"index"` o `"index.html"`? ¿Por qué?
5. ¿Qué hace `th:each` exactamente, en el HTML de salida?
6. ¿Cuándo usar `th:text` y cuándo `th:utext`? ¿Cuál es peligroso?
7. ¿Por qué en un record hay que usar `replaceAll` en vez de un setter?
8. ¿Por qué se devuelve `redirect:/` y no la vista tras un POST?
9. ¿Qué haces si al ver el código fuente aparece `th:each` sin renderizar?
10. ¿Cuándo hace falta reiniciar la app y cuándo no?
