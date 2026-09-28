# UT02 · RA4 — Sesiones, autenticación y autorización

> Práctica de referencia: `10-Proyectos/pomodorozion` (`AuthController`, `SecurityConfig`)

## Qué pide el RA4

Distinguir **autenticación** (quién eres) de **autorización** (qué puedes hacer), y
gestionar la sesión de forma segura.

## Las dos palabras que no son sinónimos

| | Pregunta que responde | Cómo se resuelve |
| --- | --- | --- |
| **Autenticación** | ¿QUIÉN eres? | Login: usuario + contraseña correctos. |
| **Autorización** | ¿QUÉ puedes hacer? | ¿Es esta tarea tuya? ¿Eres admin? |

Login sin autorización = cualquiera que se registre ve los datos de todos. Es el fallo
más común y el más caro.

## Qué es una cookie y cómo viaja la sesión

La sesión **no viaja en el JSON**: viaja en una **cookie**, en dos pasos:

1. El servidor valida el login y en la **respuesta** manda
   `Set-Cookie: JSESSIONID=ABC123`.
2. El navegador guarda esa cookie y en **cada petición siguiente** la manda solo, en la
   cabecera: `Cookie: JSESSIONID=ABC123`.

Tu JavaScript no hace nada ahí. El navegador lo rellena solo.

La analogía: la **cookie** es el número de la caja, la **sesión** es la caja con tus datos
que guarda el servidor. Por eso no se guarda la contraseña en la cookie: el servidor te da
solo el número, y la caja está a salvo.

> **Cabecera** = QUIÉN eres y qué tipo de contenido mandas.
> **Cuerpo** = QUÉ me mandas (el JSON).
> Un GET no lleva cuerpo, pero lleva igualmente la cookie. El pase va en todas.

Si borras la cookie → la siguiente petición llega sin pase → el servidor no te reconoce →
401/403. Eso es exactamente lo que hay que arreglar al borrar una cuenta.

## Sesión vs JWT (y cuándo cada una)

| | Sesión (cookie) | JWT (token) |
| --- | --- | --- |
| Dónde está el estado | En el **servidor** | En el **cliente** (el token) |
| Si roban el token | Sirve hasta que expire la sesión | Sirve hasta que expire el token |
| Revocar antes de tiempo | Fácil (borras la sesión) | Difícil (tendrías que lista negra) |
| Uso típico | Web con JSP/Thymeleaf | APIs, SPA, móvil |

En DWES usan sesiones. JWT entra en UT03 (RA7).

## Passwords: nunca en texto plano

```java
if (!passwordEncoder.matches(old, user.getPasswordHash())) {
    throw new ...("Contraseña actual incorrecta");
}
user.setPasswordHash(passwordEncoder.encode(newPassword));
```

- `encode()` al **guardar**, `matches()` al **comparar**.
- El hash es unidireccional: no se "deshashea". Por eso comparas, no comparas contraseñas.
- Cada `encode()` da un resultado **distinto** aunque el texto sea igual (por la sal).
  Por eso `equals()` no vale y `matches()` sí: sabe tener en cuenta la sal.

Y dos reglas de no filtrar:

- El `passwordHash` **nunca** va en la respuesta de la API: se devuelve un `UserDTO` sin él.
- El usuario se identifica **por la sesión**, nunca por un id que mande el cliente.

```java
Long userId = authenticatedUserService.getUserId();   // del contexto de seguridad
```

Si haces `request.getParameter("userId")` para saber de quién son los datos, cualquiera
pide los de otro cambiando el número en la URL.

## Cambiar contraseña: el flujo

1. `POST /api/auth/change-password` con `currentPassword` y `newPassword`.
2. El servicio verifica que la actual coincide (`matches`).
3. Guarda la nueva con `encode`.
4. Devuelve el `UserDTO` actualizado.

El paso 2 es el que se olvida: si cambias la contraseña **sin** verificar la anterior,
cualquiera con la sesión abierta te la cambia.

## El reto: borrar cuenta en cascada manual

`DELETE /api/auth/account` → `204 No Content`.

```java
@Transactional          // (2) una transacción para todo el bloque
public void deleteAccount(Long userId) {
    taskRepository.deleteByUserId(userId);            // hijo 1
    pomodoroSessionsRepository.deleteByUserId(userId); // hijo 2
    timerRepository.deleteByUserId(userId);           // hijo 3
    userRepository.deleteById(userId);               // el padre, AL FINAL
}
```

Cinco cosas que dejó el reto:

**1. `deleteByUserId(...)`** — Spring Data genera el `DELETE ... WHERE user_id = ?` solo
con el nombre del método. No escribes SQL, pero el nombre **tiene que ser exacto**.

**2. `@Transactional`** — los borrados de JPA necesitan una **transacción abierta**. Sin
ella sale el error críptico:

```
No EntityManager with actual transaction available for current thread
```

que se manifestaba como un 500 sin explicación. Además hace la cascada **atómica**: si un
paso falla, se deshace todo. O se borra todo o no se borra nada.

**3. Orden hijos → padre** — si borras al usuario antes, sus datos quedan huérfanos. Con
FK reales en la base de datos, la BD directamente se negaría. El `id` ya lo tienes en la
mano como parámetro: el motivo no es "encontrarlo", es **integridad**.

**4. Borrar la BD no es cerrar la sesión** — son dos planos distintos:

| Plano | Dónde vive | Cómo se mata |
| --- | --- | --- |
| La cuenta | La base de datos | `userRepository.deleteById(...)` |
| La sesión | Memoria del servidor + cookie | `SecurityContextLogoutHandler().logout(...)` |

Si borras la cuenta y **no** la sesión, el usuario sigue "logueado" con un `JSESSIONID`
que ya no corresponde a nadie.

**5. Sesión muerta ≠ cookie borrada** — la cookie sigue en el navegador, pero es una
llave muerta: el servidor ya no la reconoce. En este caso respondió **403**, no 401.

## Ownership: la regla de oro

> El `userId` sale de `Authentication.getName()` (**quién eres, lo decide el servidor**),
> nunca de un id que envíe el cliente.

Así es imposible borrar la cuenta de otro. Y el mismo filtro se aplica al leer:

```java
private Task findOwnedTask(Long id, Long userId) {
    Task task = taskRepository.findById(id).orElseThrow();
    if (!task.getUserId().equals(userId)) {   // solo el dueño puede tocarla
        throw new ...("No tienes permiso");
    }
    return task;
}
```

## Tests de seguridad (TDD)

Dos tests que vale la pena escribir siempre:

- `borrarCuentaEnCascadaBorraTodoYLaSesion` — crea tarea + timer, borra, comprueba que la
  sesión queda muerta (403) y que ya no se puede volver a loguear.
- `borrarCuentaNoTocaLosDatosDeOtro` — otro usuario queda intacto tras el borrado ajeno.

El segundo es el importante: es el que demuestra que el aislamiento por `userId` funciona.

## Logs

Spring y Java emiten logs (`info`, `warn`, `error`). En producción se leen desde la
plataforma (Render, en este caso). Un `LOGGER.info` en el punto de entrada de cada petición
te dice qué entró y qué falló sin tener que reproducing pasos.

## Preguntas de repaso

1. Diferencia entre autenticación y autorización, con ejemplo.
2. Explica el viaje de la sesión en dos pasos. ¿Qué pasa si borro la cookie?
3. ¿Por qué `encode` da resultados distintos y por eso sirve `matches` y no `equals`?
4. ¿Por qué el `passwordHash` nunca va en la respuesta?
5. ¿Por qué el `userId` sale de la sesión y no de un parámetro?
6. ¿Qué pasa si cambias la contraseña sin verificar la anterior?
7. ¿Por qué el borrado en cascada va hijos → padre?
8. ¿Qué error da la ausencia de `@Transactional` y por qué sale como 500?
9. ¿Por qué hay que cerrar la sesión además de borrar la cuenta?
10. ¿Por qué `GET /api/tasks` de otro usuario debe devolver 403 y no 404?
