# Ejercicios RA2/RA3 — thymeleaf-tareas

> Intenta resolverlos tú. Cuando los tengas (o te atascas), los revisamos juntos.
> Recuerda: los cambios en **plantillas** se ven al recargar (cache desactivado),
> los cambios en **Java** requieren reiniciar la app (Ctrl+C y de nuevo `.\mvnw.cmd spring-boot:run`).
> Verificación siempre: navegador + "Ver código fuente" → no debe haber `th:` ni `${}`.

---

## Ejercicio 1 · Contador de tareas (fácil, sin tocar Java)

Añade en `index.html` un párrafo que diga **"Tienes X tareas."** con el número real.

- **Pista:** no hace falta cambiar el controlador. Thymeleaf tiene utilidades:
  `${#lists.size(tareas)}` te da el tamaño de la lista. Mételo con `th:text` dentro del `<p>`.

Resultado esperado (con las 2 tareas de ejemplo): `Tienes 2 tareas.`

---

## Ejercicio 2 · Marcar una tarea como hecha (el gordo — toca Java y plantilla)

Queremos que cada tarea tenga un botón **"Hecha"** que la tache.

**Parte Java:**
- `Tarea` (record) ahora tendrá un tercer campo: `boolean hecha`.
- El constructor del controlador debe actualizarse (las 2 tareas de ejemplo nacen con `false`).
- Nuevo endpoint: `POST /tareas/{id}/hecha` que busca y marca la tarea.
  - **Pista 1:** los records son inmutables, no puedes hacer `tarea.setHecha(true)`.
    Usa `replaceAll` reconstruyendo la tarea: `t -> t.id().equals(id) ? nueva : t`.
  - **Pista 2:** para leer el id de la URL, firma el método como
    `crear(@PathVariable Long id)`. Devuelve `"redirect:/"`.

**Parte plantilla:**
- Dentro del `<li th:each>`, añade un formulario `POST` con el botón "Hecha".
- La URL debe llevar el id de esa tarea. Sintaxis Thymeleaf para URL con parámetro:

  ```html
  <form th:action="@{/tareas/{id}/hecha(id=${t.id()})}" method="post">
      <button type="submit">Hecha</button>
  </form>
  ```

- Para tachar: dentro del `<span th:if="${t.hecha()}">`... o más fácil:
  ```
  <s th:if="${t.hecha()}" th:text="${t.titulo()}">título</s>
  <span th:unless="${t.hecha()}" th:text="${t.titulo()}">título</span>
  ```

Resultado esperado: clicas "Hecha" → se recarga → la tarea sale tachada (elemento `<s>`).

---

## Ejercicio 3 · Borrar tarea (medio)

Mismo patrón que el 2, pero un botón **"Eliminar"**:

- Endpoint `POST /tareas/{id}/borrar` que hace `tareas.removeIf(t -> t.id().equals(id))`.
- Botón/form en la plantilla igual que el ejercicio 2 (cuidado: botón distinto).

Resultado esperado: clicas "Eliminar" → la tarea desaparece.

---

## Ejercicio 4 · Extra: estilar lo hecho (bonus)

En lugar de (o además de) `<s>`, usa un `class` condicional para tachar en CSS:

```html
<li th:classappend="${t.hecha()} ? 'tarea-hecha' : 'tarea-pendiente'">
```

Y en el `<style>`:
```css
.tarea-hecha { color: #999; text-decoration: line-through; }
```

Resultado esperado: lo hecho sale gris y tachado por CSS.

---

## Para comprobar que lo has entendido (preguntas al acabar)

1. ¿Por qué el `th:if` del ejercicio 2 tacha unas y no otras, si la plantilla es la misma?
2. ¿Qué viaja por la red: el `<li>` con `th:` o el `<li>` ya tachado?
3. ¿Por qué el botón "Eliminar" usa `POST` y no `GET`?