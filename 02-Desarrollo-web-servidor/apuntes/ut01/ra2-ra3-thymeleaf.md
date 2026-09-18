# UT01 · RA2 + RA3 — Código servidor embebido en lenguajes de marcas (Thymeleaf)

> Práctica: `practicas/ut01/thymeleaf-tareas`

## Qué piden RA2 y RA3

- **RA2**: escribir sentencias que ejecuta el servidor web e **integrar código en lenguajes de marcas** (el HTML no es estático: lo genera el servidor).
- **RA3**: escribir **bloques de sentencias embebidos en la página** (bucles, condicionales dentro del HTML).

Con Spring Boot eso es **Thymeleaf**: un motor de plantillas que convierte tu `HTML + expresiones` en una página final que se envía al navegador.

## Anatomía mínima

```
[Controlador] model.addAttribute("tareas", tareas); return "index";
                                   │
                                   ▼
[resources/templates/index.html]  ← plantilla Thymeleaf
                                   │ renderiza con las expresiones
                                   ▼
[HTML final]  ← lo que llega al navegador
```

- La plantilla vive en **`src/main/resources/templates/`** (por convención, Thymeleaf las busca ahí).
- El método del controlador devuelve el **nombre de la plantilla** sin extensión: `"index"` → `templates/index.html`.
- `@GetMapping("/")` y `@PostMapping("/tareas")` en el mismo `@Controller` (no `@RestController`: aquí devolvemos vistas, no JSON).

## Las expresiones que hay que saber (RA3)

| Expresión | Qué hace |
| --- | --- |
| `${...}` | Acceso a los datos del modelo. Ej.: `${t.titulo()}` |
| `th:each="t : ${tareas}"` | Bucle: repite el elemento por cada tarea |
| `th:if="..."` / `th:unless="..."` | Condicional: mostrar o no el elemento |
| `th:text="..."` | Mete el valor como texto (escapado: te protege de XSS) |
| `@{...}` | Genera URL desde contexto de la app. Ej.: `@{/tareas}` |
| `#lists.isEmpty(...)` | Utilidad Thymeleaf para lists |

Ejemplo real de la práctica:

```html
<ul th:if="${#lists.isEmpty(tareas)} == false">
    <li th:each="t : ${tareas}">
        <span th:text="${t.titulo()}">Titulo</span>
    </li>
</ul>
<p th:unless="${#lists.isEmpty(tareas)} == false">Aún no hay tareas.</p>
```

## Formulario que crea datos (POST + redirect)

```html
<form th:action="@{/tareas}" method="post">
    <input type="text" name="titulo" required>
</form>
```

```java
@PostMapping("/tareas")
public String crear(@RequestParam String titulo) {
    if (titulo != null && !titulo.isBlank()) {
        tareas.add(new Tarea(siguienteId++, titulo.trim()));
    }
    return "redirect:/";   // evita reenviar el formulario con F5
}
```

## Diferencias clave (posible pregunta de examen)

- **`@Controller` vs `@RestController`**: el primero devuelve vistas (HTML), el segundo devuelve datos (JSON). En UT02/UT03 vas a usar los dos en la misma app.
- **`th:text` escapa por defecto**: pone `<b>` como texto, no como HTML. Para HTML de verdad es `th:utext` (riesgo XSS: no lo uses con datos del usuario sin pensarlo).
- **La página no es estática**: el navegador recibe el HTML ya "relleno"; con JS+fetch recibirías JSON y montarías el HTML en el cliente. Los dos modelos son válidos; RA2/RA3 son sobre generarlo en el servidor.

## Verificación

- `.\mvnw.cmd spring-boot:run` → abrir `http://localhost:8080`
- Añadir una tarea → aparece en la lista (POST + redirect).
- Si metes HTML (`<b>hola</b>`) como título, se muestra como texto (escapado).