# Apuntes: Desarrollo web en servidor (Spring Boot)

> Apuntes construidos a partir de la API de **PomodoroZion**:
> Spring Boot 4 + Java + Spring Security, con login, registro, CRUD de tareas,
> cambio de contraseña y borrado de cuenta en cascada.

## 1. Servidores web y el modelo cliente-servidor

- El **cliente** (navegador) envía peticiones HTTP.
- El **servidor** (Spring Boot) recibe, procesa, toca la BD y devuelve respuestas (JSON).
- Spring Boot incluye un servidor HTTP embebido (Tomcat) -> no hay que montar uno aparte.
- Las rutas por defecto: el puerto se configura con `server.port=${PORT:8080}`
  (usar el puerto que dé el entorno, y 8080 por defecto).

## 2. Rutas y Controladores (Controllers)

Un **Controller** expone los endpoints de la API. Un endpoint = URL + método HTTP + acción.

- `@RestController` -> devuelve JSON directamente.
- `@RequestMapping("/api/tasks")` -> prefijo común del controlador.
- `GetMapping`, `PostMapping`, `PutMapping`, `DeleteMapping` -> métodos HTTP.

```java
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAll() { ... }
    @PostMapping
    public ResponseEntity<TaskDTO> create(@Valid @RequestBody TaskCreateDTO dto) { ... }
}
```

> Lección aprendida: **una ruta clara y consistente por recurso** (`/api/tasks` para todo
> el CRUD de tareas) en vez de rutas sueltas por acción. Evita enlaces rotos y duplicados.

### Rutas dinámicas (`:id`) — Express como el Controller de Spring

En Node con Express definimos rutas como en el Controller de Spring: URL + método
HTTP + lo que se responde. La magia está en el **parámetro de ruta** `:id`:

```js
const tareas = [
  { id: 1, titulo: "Estudiar Node", hecha: false },
  { id: 2, titulo: "Pasear al perro", hecha: true },
];

app.get("/tareas", (req, res) => res.json(tareas));   // el listado

app.get("/tareas/:id", (req, res) => {
  const tarea = tareas.find(t => t.id === Number(req.params.id));  // :id llega como TEXTO
  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" });  // 404 lo manda el SERVIDOR
  }
  res.json(tarea);
});
```

- `req.params.id` → el valor de la ruta; llega como **string**, por eso `Number(...)`.
- `find(...)` → buscar en el array (como en el JS del cliente).
- `res.status(404).json(...)` → el **código del server** dice "no existe"; el navegador
  NO inventa el 404. Un 404 automático (ruta mal escrita) es de Express; un 404 "no
  encontrado en BD" es de nuestro código. Hay que distinguir los dos.
- **El ciclo del desarrollo**: editar → matar el servidor viejo (Ctrl+C) → relanzar
  (`node app.js`) → recargar. Los cambios NO aplican solos. Y si "no cambia nada",
  sospechar **cache del navegador** (F12 → Disable cache → Network).

### API REST (buenas prácticas)

- Usar **sustantivos en plural**: `/api/tasks` (no `/api/getTasks`).
- El **método HTTP** ya dice la acción: GET=leer, POST=crear, PUT=actualizar, DELETE=borrar.
- Prefijo `/api/...` separa las rutas de datos de las de páginas.
- Devolver **status codes** correctos: 200 OK, 201 Created, 400 Bad request, 401/403 sin permiso.

## 3. Modelos y persistencia (JPA)

- `@Entity` -> una clase que se guarda como fila en la BD.
- `@Id @GeneratedValue` -> la clave primaria autoincremental (`id`).
- Unos campos por clase: en `User` -> `id`, `username`, `passwordHash`, `createdAt`.
- En `Task` -> `id`, `title`, `done`, `userId` (a qué usuario pertenece).

**Referencias entre tablas:** en estas entidades guardo `Long userId` (solo el id),
no una relación JPA con `@ManyToOne`. Es más simple, pero **no hay borrado en cascada**
automático en la BD: si borro un usuario, hay que borrar sus datos a mano.
Aquí vemos el debate entre "sencillo" y "correcto con FK/cascada".

## 4. Servicios (Services)

Capa intermedia entre el Controlador y el Repositorio. Contiene la **lógica de negocio**:
qué se puede y qué no, cálculos, reglas.

```java
@Service
public class TaskService {
    public TaskDTO createTask(TaskCreateDTO dto, Long userId) {
        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setUserId(userId);   // la tarea pertenece a un usuario
        return toDTO(taskRepository.save(task));
    }
    private Task findOwnedTask(Long id, Long userId) {
        Task task = taskRepository.findById(id).orElseThrow(...);
        if (!task.getUserId().equals(userId)) {   // solo el dueño puede tocarla
            throw new ...("No tienes permiso");
        }
        return task;
    }
}
```

> Idea clave: **cada usuario solo ve y modifica SUS datos** (el `userId` se filtra en todo).
> Eso es la base de la seguridad de a quién pertenece la información.

## 5. Validación

Con `@Valid` + anotaciones de validación en los DTO:

```java
public class CambiarPasswordDTO {
    @NotBlank private String currentPassword;
    @NotBlank private String newPassword;
}
```

- `@NotBlank` -> no puede ser vacío ni solo espacios.
- `@Valid @RequestBody` -> Spring comprueba las reglas antes de entrar al método.
- Solo el **Backend** debe validar de verdad; el frontend es amable pero no fiable.

## 6. Sesiones, Autenticación y Autorización

- **Autenticación** = confirmar QUIÉN eres (el login: usuario + contraseña correctos).
- **Autorización** = confirmar QUÉ puedes hacer (solo tu propio usuario / tus propias tareas).
- Spring Security intercepta las rutas y pide identificación.

### Qué es una cookie y cómo viaja la sesión (el "quién eres" en cada request)

La sesión NO viaja en el JSON: viaja en una **cookie**. En 2 pasos:

1. El servidor loguea (valida usuario en BD) y en la **respuesta** manda
   `Set-Cookie: JSESSIONID=ABC123`.
2. El navegador **guarda esa cookie** y en CADA petición siguiente la manda sola
   en la **cabecera del request**: `Cookie: JSESSIONID=ABC123`. Tu JS no hace nada;
   el navegador lo rellena automáticamente.

La **cookie** = el número de la caja. La **sesión** = la caja (con tus datos) que
guarda el servidor. Por eso no se guarda la contraseña en cookie: el servidor te da
solo "el número", y la caja está a salvo en el servidor.

> La **cabecera** dice QUIÉN eres (y qué tipo de contenido manda). El **cuerpo**
> dice QUÉ me mandas (el JSON). Un `GET` no lleva body — pero lleva igualmente la
> cookie en la cabecera. El pase va en TODAS las peticiones, siempre.

Si borras la cookie → la próxima petición llega sin pase → el servidor no te
reconoce → 401/403 (deslogueado). Eso es lo que arreglamos en el reto de borrar cuenta.

### Gestión del usuario autenticado

```java
@Service
public class AuthenticatedUserService {
    public Long getUserId() {   // objeto del usuario que hace la petición
        ...
    }
}
```

Con esto, cada controlador obtiene **el `userId` de la sesión** y filtra sus datos.
Nunca se confía en que el cliente diga "soy el 3" desde el navegador.

## 7. Seguridad en el backend

- **Contraseñas con hash** (`passwordEncoder`): nunca se guardan en texto plano.
  `encode()` al guardar, `matches()` para comparar al iniciar sesión.

```java
public void changePassword(User user, String old, String newPw) {
    if (!passwordEncoder.matches(old, user.getPasswordHash())) {
        throw new ...("Contraseña actual incorrecta");
    }
    user.setPasswordHash(passwordEncoder.encode(newPw));
}
```

- **No filtrar campos sensibles**: el `passwordHash` nunca debe ir en las respuestas API
  (se devuelve un `UserDTO` sin él).
- **Identificar al usuario por servidor/sesión**, no por parámetros del cliente.

## 8. Cambio de contraseña (flujo completo)

1. El usuario envía `currentPassword` y `newPassword` a `POST /api/auth/change-password`.
2. El servicio verifica que `currentPassword` coincide (`matches`).
3. Guarda `newPassword` con `encode`.
4. Devuelve el `UserDTO` actualizado.
5. Sin verificar antes, peticiones con contraseña vieja devuelven 401 y con la nueva 200.

## 9. Reto: Borrar cuenta con borrado en cascada manual

Endpoint: `DELETE /api/auth/account` -> `204 No Content`.
Como las entidades guardan `Long userId` sin `@ManyToOne`, no hay cascada automática
en la BD: **la integridad la garantiza el código**, borrando hijos antes que al padre.

```java
// AuthService
@Transactional          // (2) una transacción para todo el bloque
public void deleteAccount(Long userId) {
    taskRepository.deleteByUserId(userId);          // hijo 1
    pomodoroSessionsRepository.deleteByUserId(userId); // hijo 2
    timerRepository.deleteByUserId(userId);         // hijo 3
    userRepository.deleteById(userId);              // el padre, AL FINAL
}
```

```java
// AuthController
@DeleteMapping("/account")
public ResponseEntity<Void> deleteAccount(Authentication authentication,
    HttpServletRequest request, HttpServletResponse response) {
    User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
    authService.deleteAccount(user.getId());            // (1) borro la BD
    new SecurityContextLogoutHandler().logout(request, response, null); // (3) sesión
    return ResponseEntity.noContent().build();
}
```

**Conceptos que dejó el reto:**

1. **`deleteByUserId(...)`** — Spring Data genera el `DELETE ... WHERE user_id = ?`
   solo con el nombre del método en el repositorio (no hay que escribir SQL).
2. **`@Transactional`** — "JPA necesita un inicio y final claros, no algo genérico:
   como dar pasos en un camino." Los borrados de JPA por nombre necesitan una
   **transacción abierta**; sin ella sale el error críptico
   *"No EntityManager with actual transaction available"* (salía como 500).
   Además hace la cascada **atómica**: si un paso falla, se deshace todo.
3. **Orden hijos → padre** — si borras al usuario antes, sus datos quedarían huérfanos
   (y con FK reales, la BD directamente se negaría). El `id` ya lo tienes en la mano
   como parámetro: el motivo no es "encontrarlo", es integridad.
4. **Borrar la BD no es cerrar la sesión** — son dos planos: la cuenta vive en la BD,
   la sesión vive en memoria del servidor + cookie del navegador. Tras borrar
   la cuenta hay que matar la sesión con `SecurityContextLogoutHandler().logout(...)`.
5. **Sesión muerta != cookie borrada** — la cookie sigue en el navegador pero es una
   "llave muerta": el servidor ya no la reconoce y responde **403** en la siguiente
   petición (no 401). Resultó que Spring Security no da 401 a sesiones inválidas.
6. **Ownership del borrado** — el `userId` sale de `Authentication.getName()` (quiéres
   tú, decídelo el servidor), nunca de un id que envíe el cliente: así no puedes
   borrar la cuenta de otro.

**Tests (TDD):** `borrarCuentaEnCascadaBorraTodoYLaSesion` (crea tarea + timer, borra,
sesión muerta → 403, y ya no se puede volver a loguear) y `borrarCuentaNoTocaLosDatosDeOtro`
(otro usuario queda intacto tras el borrado ajeno).

## 10. Logs (lado servidor)

Spring/Java emiten logs (info, warn, error). En producción se leen desde Render.
Los `System.out` y los loggers de Spring ayudan a seguir qué petición entra y qué falla.

## 11. Prácticas del temario y cómo se cubren

- [x] API de tareas -> `TaskController` (CRUD de `/api/tasks`).
- [x] CRUD de usuarios -> registro + autenticación de `User`.
- [x] Login y registro -> `AuthController` (`/api/auth`).
- [x] Panel privado -> cada usuario ve solo sus datos (filtro por `userId`).
- [x] API conectada a base de datos -> JPA/hibernate + PostgreSQL/H2.
- [x] **Reto: borrar cuenta con cascada manual** -> `DELETE /api/auth/account` +
      `@Transactional` + cierre de sesión (ver sección 9).

## 12. La API en Node/Express + MongoDB (proyecto apuntes-api)

Un backend real en Node replicando lo que Spring hace: el **CRUD de tareas** completo
con Express + MongoDB. Es lo mismo que el `TaskController`, solo que en JS.

### Cómo se arranca
```bash
npm install          # instala express + mongodb + mongodb-memory-server
node app.js          # levanta Mongo (en memoria) + Express en el puerto 3000
```
- `db.js` levanta un **MongoDB en memoria** (`MongoMemoryServer`): no instala nada en
  el PC, perfecto para practicar. Cada ejecucción es un Mongo NUEVO (puerto aleatorio).
- Los datos viven en **memoria**: al apagar el proceso se borran (eso es la RAM).
  Una BD real (Atlas) los guarda en disco y sobreviven a reinicios.

### El CRUD (misma lógica que Spring)
```js
app.get("/tareas", async (req, res) => {          // leer todas
  res.json(await tareas.find().toArray());        // find() = cursor, toArray() = materializar
});

app.get("/tareas/:id", async (req, res) => {      // leer una
  const tarea = await tareas.findOne({ _id: new ObjectId(req.params.id) });
  ...
});

app.post("/tareas", async (req, res) => {         // crear (con validación)
  if (!req.body.titulo || typeof req.body.titulo !== "string") {
    return res.status(400).json({ error: "El título es obligatorio y debe ser texto" });
  }
  const resultado = await tareas.insertOne(req.body);
  res.status(201).json({ _id: resultado.insertedId, ...req.body });
});

app.put("/tareas/:id", async (req, res) => {      // actualizar
  const r = await tareas.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
  if (r.matchedCount === 0) return res.status(404).json({ error: "No encontrada" });
  res.json({ ok: true, actualizado: r.modifiedCount });
});

app.delete("/tareas/:id", async (req, res) => {   // borrar
  const r = await tareas.deleteOne({ _id: new ObjectId(req.params.id) });
  if (r.deletedCount === 0) return res.status(404).json({ error: "No encontrada" });
  res.json({ ok: true, borrado: r.deletedCount });
});
```

### Piezas clave (las que preguntan)
- **`req.params.id`** = el `:id` de la URL, llega como **texto** -> `new ObjectId(...)` lo
  convierte al `_id` real de Mongo (es la clave primaria que Mongo inventa y NO se repite).
- **`_id` vs `id`**: el `_id` lo genera Mongo (garantiza unicidad); nuestro `id: 1` era
  inventado (podía chocar). Por eso `GET/PUT/DELETE` necesitan `_id` y el `POST` no
  (para crear, el id lo da el servidor; para tocar una, necesitas saber cuál).
- **GET = leer** (nunca modifica), **POST = crear**, **PUT = actualizar**, **DELETE = borrar**.
  La URL dice QUÉ recurso, el verbo dice QUÉ SE HACE con él.
- **`express.json()`** (middleware): desenvuelve el `body` solo si el cliente manda
  `Content-Type: application/json`. Sin esa cabecera -> `req.body` es `undefined` ->
  `Cannot read properties of undefined` (el error cuenta la historia: mira la línea).
- **Códigos**: 200 ok, 201 creado, 400 petición mala (validación), 404 no existe,
  500 error interno. El 404 "no encontrado" lo manda NUESTRO código (no el navegador).
- **`await`**: la BD está fuera del proceso -> el dato tarda -> `await` aguanta la
  respuesta hasta que llega (por eso las rutas son `async`).
- **`resultado.matchedCount`** (encontró la tarea?) vs **`modifiedCount`** (la cambió).

### Errores de hoy que valen oro
- **`ECONNREFUSED 127.0.0.1:27017`** = "no hay nadie en ese puerto": el servidor de BD
  no está levantado (o no existe). No es bug del código, es que el servicio no corre.
- **"X is not a constructor"** = import mal: `import { MongoClient } from "mongodb"`
  (con `{}`) porque es un export con nombre; sin `{}` traes el default y no es constructor.
- **Dos rutas iguales definidas** (`app.post` x2) = Express ejecuta la PRIMERA, la segunda
  jamás se ve. Si "una ruta no hace lo que espero", contar cuántas veces está definida
  (Ctrl+F) es el primer sospechoso.
- **"El código no da error" ≠ funciona**: si falta `app.listen()`, el servidor existe
  pero nunca abre puerto -> "conexión denegada". Sin `listen`, no hay nada atendiendo.
- **Cambios que no se ven** = servidor viejo sin reiniciar (`Ctrl+C` + `node app.js`) o
  cache del navegador. Editar sin reiniciar = hablar con un fantasma.
- **Git**: `node_modules/` NUNCA se commitea (miles de archivos, binario de 781 MB). Se
  ignora con `.gitignore`; si ya se subió, `git rm -r --cached node_modules` lo saca
  del control de versiones sin borrar nada local.

## 13. Proyecto real: pedidos de forros y camisas (grupo scout)

Proyecto en `10-Proyectos/pedidos`, producción real: el cliente rellena un
formulario web -> la API valida y guarda en MongoDB -> el sistema avisa por
correo al cliente y a los encargados. Todo gratis (Render + MongoDB Atlas M0).

### Arquitectura (una web, dos vistas)

```
[Formulario web  /] -> POST /api/pedidos -> [API valida] -> [MongoDB]
                                                          |
                               nodemailer: correo al cliente + correo a encargados
[Panel admin  /admin] -> GET /api/pedidos (con clave) -> [lista pedidos]
```

- **`/`** = el formulario para el CLIENTE (público).
- **`/admin`** = el panel para el ENCARGADO (protegido con una clave).
- No son dos webs: es UN servidor Express con dos rutas y una BD compartida.

### Los archivos que vas a escribir (y para qué sirve cada uno)

- **`db.js`** — la conexión a Mongo. Lee `process.env.MONGODB_URI`:
  - si la variable NO existe -> levanta `MongoMemoryServer` (memoria, desarrollo);
  - si existe -> conecta a esa URI (Atlas, producción).
  - Exporta la colección `pedidos`. (Hay que decidir si exportar la colección 
    directamente o la conexión `cliente` + `db` — decisión de diseño tuya.)
- **`app.js`** — el servidor Express: rutas, validación, estáticos, `listen`.
- **`correos.js`** — el envío de correos con `nodemailer`. Sin SMTP configurado
  lo simula por consola (para no quemar la cuenta en local = la lección del
  phishing). Con SMTP, manda confirmación al cliente + aviso a encargados.
- **`public/formulario.html`** — el formulario del cliente, con un
  `<select>` de secciones, `<select>` de artículo (forro/camisa) y tallas.
- **`public/panel.html`** — el panel del encargado que pide la clave y lista
  los pedidos vía `GET /api/pedidos`.

### Datos reales del catálogo (los tienes en tus Excels RS2526)

- **Secciones**: Manada, Tropa, Escultas, Clan, Castores, Scouter.
- **Forros**: tallas 8/10, 10/12, 12/14, S, M, L, XL.
- **Camisas**: tallas 12-13, XS, S, M, L, XL, XXL.

### Las reglas de validación (Ticket 3)

- Nombre: obligatorio y texto.
- Sección: tiene que estar en la lista.
- Artículo: solo `forro` o `camisa`; la talla debe ser válida PARA ese artículo.
- Cantidad: entero entre 1 y 99.
- Correo del cliente: obligatorio y con formato válido.
- Fallos -> `400` con mensaje claro. Éxito -> `201` con el `_id`.

### Los códigos HTTP que ya usas (repaso rápido)

- `400` = la petición del cliente está mal (valida ANTES de tocar la BD).
- `401` = no autorizado (falla la clave del admin).
- `201` = creado correctamente.
- `200` = OK (listar pedidos, catálogo).
- `404` = no existe el recurso.

### Seguridad (lección que ya te pagaste)

- La clave del admin y los datos del SMTP NUNCA van a fuego en el código:
  se leen de `process.env` (variables de entorno: Render las deja poner en el
  panel sin subirlas al repo).
- El correo que tiene el cliente es con el que se le confirma: eso evita
  mandar confirmaciones a direcciones inventadas.
- `nodemailer` no cae en phishing si el envío sale de una cuenta/conexión
  verificada y con límites de envío sanos. En local: mejor SIMULAR.

### Checklist de arranque

1. `db.js` -> `node db.js` no da error (o eliminando el `listen` del final).
2. `app.js` -> `node app.js` -> abrir http://localhost:3000.
3. Lanzar un POST por PowerShell (`Invoke-RestMethod`) y ver 201.
4. Ver en `/admin` que el pedido aparece.
5. Ver en la consola los correos simulados.
6. (Producción) Variable `MONGODB_URI` + `SMTP_*` + `CLAVE_ADMIN` en Render.

### Lección que deja hoy el jefe

> "El que escribe el código aprende; el que solo lo lee, mira. Los apuntes
> explican POR QUÉ. Tú escribes el CÓMO, y el porqué se te queda solo."

## Repaso

- [x] Lo entiendo (reto de borrado de cuenta escrito y explicado con tests en verde).
- [x] Lo he practicado (registro, login, CRUD, cambio de contraseña, borrado en cascada).
- [x] Podría explicarlo a otra persona (@Transactional, orden de cascada, cierre de sesión).
