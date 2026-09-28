# UT03 · RA7 — Servicios web (REST, Swagger, JWT)

> Referencia: `10-Proyectos/pomodorozion/TaskController`, `AuthController`

## Qué pide el RA7

Desarrollar servicios web que sigue un estándar de API, documentados y verificables.

## Qué es REST (y qué no)

REST = **Representational State Transfer**. En la práctica, un contrato con reglas:

| Regla | Qué significa |
| --- | --- |
| **Recurso con sustantivo en plural** | `/api/tasks`, no `/api/getTasks` |
| **El verbo HTTP dice la acción** | GET=leer, POST=crear, PUT=actualizar, DELETE=borrar |
| **La URL dice QUÉ**, el verbo **QUÉ SE HACE** | `/tasks` + DELETE ≠ `/deleteTask/5` |
| **Stateless** | Cada petición lleva todo lo que necesita (la cookie de sesión) |

### La prueba del verbo

Si tienes que escribir `get`, `create`, `update` o `delete` en el nombre de la ruta, algo
está mal: eso ya lo dice el método HTTP.

```
/api/getTasks      ✗  redundante
/api/tasks         ✓  y GET /api/tasks
```

## Códigos HTTP que se usan siempre

| Código | Cuándo | Ejemplo |
| --- | --- | --- |
| `200 OK` | Lectura correcta | `GET /api/tasks` devuelve la lista |
| `201 Created` | Se creó algo | `POST /api/tasks` |
| `204 No Content` | Borrado, sin cuerpo | `DELETE /api/tasks/5` |
| `400 Bad Request` | Los datos no valen | falta el título |
| `401 Unauthorized` | No estás identificado | sin sesión válida |
| `403 Forbidden` | Estás identificado pero no puedes | tarea de otro usuario |
| `404 Not Found` | El recurso no existe | `GET /api/tasks/999` |
| `500 Internal Server Error` | Fallo nuestro | excepción sin capturar |

### `401` vs `403`: la diferencia que se pregunta

- **`401`**: "no sé quién eres" → **falta autenticación**. Sin cookie, o cookie inválida.
- **`403`**: "sé quién eres, pero no puedes" → **autorización**. Es el usuario 2
  intentando leer la tarea del usuario 1.

> Regla práctica: si puedes obligar al usuario a hacer login, es `401`. Si ya está logueado
> y el problema es de permisos, es `403`.

## Endpoints bien hechos

```java
@RestController
@RequestMapping("/api/tasks")     // prefijo del recurso
public class TaskController {

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAll(Authentication auth) { ... }   // 200

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getOne(@PathVariable Long id) { ... }        // 200 / 404

    @PostMapping
    public ResponseEntity<TaskDTO> create(@Valid @RequestBody TaskCreateDTO dto) { ... }  // 201

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // ...
        return ResponseEntity.noContent().build();                              // 204
    }
}
```

### `ResponseEntity` vs devolver el objeto pelado

| | `return lista;` | `ResponseEntity` |
| --- | --- | --- |
| Código | Siempre 200 | Lo eliges tú |
| Cabeceras | No puedes |Sí (`Location`, `Set-Cookie`) |
| Cuerpo | Siempre hay | Puede ir vacío (`204`) |

Para una API real, casi siempre `ResponseEntity`: te permite devolver `201` al crear y
`204` al borrar, que es lo que la práctica pide.

## `ResponseEntity.created(...)`: la cabecera `Location`

Al crear, lo correcto es devolver **la URL del recurso nuevo**:

```java
URI location = ServletUriComponentsBuilder.fromCurrentRequest()
        .path("/{id}").buildAndExpand(dto.id()).toUri();
return ResponseEntity.created(location).body(dto);   // 201 + Location
```

## Validación: en dos capas

```java
public record TaskCreateDTO(@NotBlank String title) { }
```

```java
@PostMapping
public ResponseEntity<TaskDTO> create(@Valid @RequestBody TaskCreateDTO dto) { ... }
```

- `@NotBlank` = no vacío ni solo espacios. (También `@NotNull`, `@Size`, `@Min`, `@Email`.)
- `@Valid` = Spring comprueba las reglas **antes** de entrar al método. Si falla, salta
  un `400` automático y tu código ni se ejecuta.
- **El backend valida siempre.** El frontend valida para dar feedback rápido, pero es
  amable, no fiable: cualquiera puede llamar a tu API con `curl`.

### El `handle` global de excepciones

Para que los errores salgan como JSON y no como un HTML de Tomcat:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TxtNoEncontradoException.class)
    public ResponseEntity<Map<String, String>> notFound(...) {
        return ResponseEntity.status(404).body(Map.of("error", "No encontrado"));
    }
}
```

`@RestControllerAdvice` = "esto aplica a todos los controladores". Sin esto, cada
excepción se va al `error.html` de Tomcat y el cliente recibe HTML donde esperaba JSON.

## Swagger / OpenAPI: documentar para que otros te entiendan

Una API sin documentación es una API que nadie usa. Springdoc añade la interfaz
automáticamente leyendo el código:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.x</version>
</dependency>
```

Se accede en `/swagger-ui.html` y describe **lo que has escrito**: rutas, parámetros,
cuerpos y respuestas. Las anotaciones (`@Operation`, `@ApiResponse`) añaden lo que el
código no dice:

```java
@Operation(summary = "Crea una tarea")
@ApiResponse(responseCode = "201", description = "Creada")
```

> Ventaja clave: **la documentación no puede quedarse obsoleta**, porque se genera del
> código. Si cambias el controlador, cambia el Swagger.

## JWT: sesiones sin estado

Ya visto en [RA4](../ut02/ra4-sesiones-auth.md), la versión "token":

```
POST /api/auth/login  {usuario, contraseña}
   → 200 { "token": "eyJhbGci..." }

GET /api/tasks   Authorization: Bearer eyJhbGci...
```

El token lleva dentro los datos (usuario, caducidad) **firmados**. El servidor no guarda
sesión: cada petición se valida sola leyendo la firma.

| | Cookie de sesión | JWT |
| --- | --- | --- |
| Estado | En el servidor | En el token |
| Revocar antes de tiempo | Fácil (borras la sesión) | Difícil (lista negra) |
| Uso | Web con JSP/Thymeleaf | APIs, SPA, móvil |

El token **se guarda en el cliente**, así que va en `localStorage` o en una cookie
`HttpOnly`. Nunca en ambos: si va en `localStorage`, cualquier XSS se lo lleva.

## Errores que vais a ver

- **`Cannot deserialize`** = el JSON no encaja con el DTO. Mira qué campo falta o sobra.
- **Falta `Authorization` o empieza mal** = 401. Formato exacto: `Bearer ` + token.
- **El token caduca** = 401 aunque acabe de generarlo. Mira el `exp` de los claims.
- **Devuelve HTML donde esperabas JSON** = saltó una excepción y fue al `error.html` de
  Tomcat. Mira los logs del servidor, no la respuesta.
- **`LazyInitializationException`** = cerraste la sesión de JPA antes de usar la relación
  perezosa. O `fetch = EAGER`, o `@Transactional`, o cargarlo dentro del servicio.

## El ciclo de desarrollo con la API

Editar → **matar el servidor viejo (Ctrl+C)** → relanzar → recargar. Los cambios de Java
**no** aplican solos. Y si "no cambia nada", sospechar **caché** (F12 → Disable cache →
Network).

## Preguntas de repaso

1. ¿Qué significa REST? Pon tres reglas concretas.
2. ¿Por qué `/api/tasks` y no `/api/getTasks`?
3. ¿Cuándo `201` y cuándo `204`?
4. Diferencia entre `401` y `403`, con ejemplo de cada uno.
5. ¿Por qué usar `ResponseEntity` en vez de devolver el objeto?
6. ¿Qué devuelve `ResponseEntity.created(...).body(...)` además del cuerpo?
7. ¿Qué hace `@Valid` y qué pasa si falla la validación?
8. ¿Por qué el frontend no basta para validar?
9. ¿Para qué sirve `@RestControllerAdvice`?
10. ¿Qué es Swagger y por qué no se queda obsoleto?
11. ¿Qué lleva dentro un JWT y qué pasa si caduca?
12. Diferencia entre cookie de sesión y JWT: ¿cuándo usar cada una?
