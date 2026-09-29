# API de PCCOMPONENTES — Node + Express + MongoDB

Manual de construcción. **Tú escribes el código.** Este documento existe para
explicar el *por qué* de cada decisión, que es lo que se queda cuando el
proyecto termina.

---

## 0. Cómo usar este manual

Cada etapa tiene siempre las mismas cinco partes:

| Parte | Qué es |
|---|---|
| **Predice** | Una pregunta que debes responder *antes* de escribir nada |
| **Tu tarea** | Qué tiene que hacer el código, sin decirte cómo |
| **Por qué así** | La decisión y la alternativa descartada |
| **Errores típicos** | Lo que te va a pasar, escrito antes de que pase |
| **Comprobación** | Cómo compruebas que lo tienes, sin adivinar |

Dos reglas:

1. **Si te atascas, mira el §10 (catálogo de errores).** Está escrito para
   que lo reconozcas, no para que lo copies.
2. **Si no está en el catálogo, pregúntame el error y te digo la línea y la
   causa.** No te doy el archivo.

No escribas la etapa *n* sin haber hecho la *n-1*. Cada una se apoya en la
anterior y saltártelas te cuesta más.

---

## 1. El mapa mental

Vuelve a este esquema cuando te pierdas. Todo lo que hagas cuelga de aquí.

```
  petición HTTP (POST /api/auth/login, body: {email, password})
       │
       ▼
  ┌──────────────── Express ───────────────────────────────┐
  │                                                          │
  │  express.json()     ──▶  parsea el body a req.body      │
  │       │                                                  │
  │       ▼                                                  │
  │  middlewares        ──▶  uno tras otro, EN ORDEN         │
  │       │                                                  │
  │       ▼                                                  │
  │  router             ──▶  "¿qué pidió? ¿GET o POST?"     │
  │       │                                                  │
  │       ▼                                                  │
  │  controlador        ──▶  la lógica de verdad             │
  │       │                                                  │
  │       ▼                                                  │
  │  Mongoose           ──▶  traduce objetos JS ↔ MongoDB   │
  │       │                                                  │
  │  (error launcher)   ──▶  next(err) salta al final       │
  │                                                          │
  └──────────────────────────────────────────────────────────┘
       │
       ▼
   MongoDB
       │
       ▼
  respuesta JSON  ←  Express la serializa por ti
```

### Las dos ideas que hacen que todo lo demás tenga sentido

**1. Express es una tubería, no un programa.**

No existe un `main()` que va de arriba abajo. Hay una **lista de
middlewares** y cada petición los recorre **en ese orden**, uno detrás de
otro. Cada uno puede:

- dejar pasar la petición sin hacer nada (`next()`),
- cortarla y responder (`res.json(...)`),
- o lanzar un error (`next(err)`).

Como el orden lo escribes tú, **el orden importa**. Pon el logger antes del
parser y no verás el body. Pon el middleware de errores arriba del todo y
nunca se ejecutará.

**2. El controlador no debería tocar `res`.**

La idea es que el controlador **devuelva datos** y sea Express quien
responde. Esto mantiene la lógica testeable y el transporte (HTTP) separada
del negocio.

**Avísate:** hoy, con 3 endpoints, es perfectamente válido responder
directamente desde el controlador. No te voy a pedir que lo hagas de otra
forma. Pero si un día notas que no puedes reutilizar un controlador porque va
pegado al `res`, ya sabes por qué importa.

---

## 2. Las dependencias y por qué cada una

| Paquete | Para qué | Por qué este y no otro |
|---|---|---|
| `express` | Servidor HTTP y enrutado | Lo estándar. Nada comparable en el ecosistema Node. |
| `mongoose` | Capa de abstracción sobre MongoDB | Te da esquemas, validación y middleware. Con el driver oficial (`mongodb`) tendrías que validar a mano cada campo. |
| `bcryptjs` | Hash de contraseñas | **No** `bcrypt`. El nativo compila C++ en Windows y falla sin toolchain. `bcryptjs` es JS puro y produce **el mismo hash**. |
| `jsonwebtoken` | Firmar tokens | Lo estándar. Alternativas (`jose`, `paseto`) son mejores, pero aquí se usa la que te van a pedir. |
| `dotenv` | Leer `.env` | Sin esto tendrías el secreto de JWT escrito en el código. |
| `nodemon` (dev) | Reiniciar al guardar | Sin esto tendrías que reiniciar el server a cada cambio. |

**Lo que NO instalamos y por qué:**

- **`cors`** — no hace falta hoy. CORS es un problema *del navegador*: impide
  que una página de un origen pida datos a otro. Mientras pruébes con `curl`
  no hay navegador, luego no hay CORS. Lo añades en la etapa en la que
  conectemos el React, y entonces lo entiendes con contexto.
- **`zod`** (o `express-validator`) — validas a mano con `if`, que además es
  la misma lógica que ya escribiste en `LoginRegistro.jsx`. Cuando te canses
  de repetir `if`, entenderás por qué existe un framework de esquemas.
- **`helmet`**, **`morgan`** — Rate limiting y logs. Se añaden cuando la API
  esté desplegada de verdad.

### ESM, no CommonJS

`"type": "module"` en tu `package.json`, igual que el frontend. En Node 24 es
lo natural. **No mezcles sintaxis**: si usas `import` para cargar, usa
`import` para todo.

### Los puertos

| Servicio | Puerto |
|---|---|
| API (Express) | **3000** |
| MongoDB | **27017** |
| Frontend Vite | 5173 |

No colisionan. Si el 3000 está pillado, avísame y lo movemos.

---

# Etapa 0 — MongoDB

**No hay código. Esto es infraestructura y ya está hecha.**

### Qué hay instalado

- **MongoDB Server 9.0.2**, instalado como **servicio de Windows**.
- **mongosh 2.12.0**, la consola para entrar a mirar la base.

El servicio arrancará solo cada vez que enciendas el PC. No tienes que hacer
nada.

### Tres cosas que parecen detalles y no lo son

**1. Es un servicio, no un programa que lanzas en una terminal.**

Podrías haber ejecutado `mongod.exe` a mano en una ventana. Funciona, pero
en cuanto cierras esa ventana, la base de datos **muere** y tu API se queda
sin nada a los que hablar.

Un servicio es un programa que el sistema arranca, supervisa y **mantiene
vivo**. Esa es exactamente la diferencia entre algo que hay que vigilar y
algo que simplemente está. En cuanto los dos estén desplegados en un
servidor real, esta distinción es la diferencia entre un sistema que se
levanta solo y uno al que hay que resetear a mano cada vez que algo se cae.

Para verlo:

```bash
Get-Service MongoDB          # Status: Running
```

**2. Los datos viven en una carpeta, y por eso hay dos "borrar".**

Aquí está todo lo que guarda la base:

```
C:\Program Files\MongoDB\Server\9.0\data
```

Hay dos cosas distintas que puedes querer borrar, y **no son la misma**:

- **Borrar los datos de una colección** (lo que harás en la etapa 6, si
  quieres empezar limpio) → borras documentos, la base sigue ahí.
- **Borrar la base entera** → borras la carpeta de arriba.

Y hay una trampa: la carpeta está dentro de `Program Files`, que es zona
protegida. Borrarla a mano te pide permisos de administrador. Puedes
parar el servicio y borrar los datos con `mongosh` sin pelear con Windows,
que es la vía limpia:

```bash
mongosh "mongodb://localhost:27017/pccomponentes" --eval "db.dropDatabase()"
```

**3. Docker habría sido mejor, pero en tu máquina no era posible.**

Lo intentamos primero y no funcionó: Docker Desktop necesita **WSL2**, y tu
WSL2 no tiene ninguna distribución de Linux instalada. Arreglarlo exige
instalar una distro y reiniciar el PC, lo que te habría costado la tarde
antes de escribir la primera línea.

MongoDB nativo cumple lo mismo: es el **mismo servidor**, con las mismas
funciones, contra el que vas a entregar la práctica. Lo único que pierdes es
la lección de `volumes` y `healthcheck` de Docker, y no la necesitas para
entender Express.

Por cierto, y esto te servirá cuando lo encuentres: `depends_on` en un
`docker-compose.yml` **no espera a que la base esté lista**, solo a que el
contenedor arranque. Por eso existen los `healthcheck`. Con un servicio de
Windows ese problema desaparece, que es una de las cosas buenas de esta vía.

### Comprobación

```bash
Get-Service MongoDB                                    # Running
mongosh "mongodb://localhost:27017/pccomponentes" \
  --quiet --eval "db.adminCommand('ping')"              # {"ok":1}
```

Ese `{"ok":1}` contra la base `pccomponentes` es **exactamente** la
cadena de conexión de tu `.env`. Si responde, tu `.env` está bien.

### Predice para la etapa 1

> Arranca el server de Express **antes** de que MongoDB esté levantado. La
> petición `GET /api/categorias` necesita leer de la base, así que la
> conexión fallará.
> ¿Debería el server arrancar y quedarse escuchando en el 3000 esperando a que
> aparezcan las peticiones, o debería caerse?
>
> Pista: piensa en qué es más útil cuando te equivocas. Arrancar y caerse te
> da un stack trace. Arrancar y esperar te da un aviso limpio en el log.

---

# Etapa 1 — Un Express que responde

**Tu primera etapa de código.** El objetivo es mínimo a propósito: que un
servidor responda. Nada de base de datos todavía.

### Tu tarea

1. `server/package.json` con `"type": "module"`, las 5 dependencias, y un
   script `dev` que arranque con `nodemon`.
2. `server/src/app.js` — la app de Express.
3. `server/src/index.js` — la arranca.

`GET /api/health` debe devolver un JSON con algo tipo `{ "ok": true }`.

### Por qué así

**`express.json()` o no hay `req.body`.**

Express, por defecto, **no lee el cuerpo de las peticiones**. Sin esa
línea, `req.body` es `undefined` y cualquier validación que hagas sobre él
falla con algo tipo *"cannot read properties of undefined"*, un error que no
menciona ni la palabra body ni tu formulario. Es el primer susto de cualquiera
que empieza con Express, y se pierde rápido.

**El middleware de errores tiene que ir SIEMPRE al final.**

No es por capricho del orden: Express recorre la lista hacia abajo y en
cuanto una capa responde, las siguientes no se ejecutan. Si el middleware de
errores está arriba del todo, cuando un controlador lance un error Express
buscará hacia abajo un manejador, no lo encontrará, y usará su respuesta por
defecto. El tuyo nunca se llamará.

**Y se reconoce por tener 4 parámetros, no 3:**

```js
// esto NO es un middleware de error:
function malo(err, req, res) { ... }

// esto SÍ lo es, por el cuarto parámetro:
function bueno(err, req, res, next) { ... }
```

Ese `next` de más no es un descuido. Es la **firma** que Express usa para
identificar un manejador de errores. No lo quites por "limpieza": rompe la
funcionalidad.

**Express 4 no captura los rechazos de `async`.**

Si tu controlador es `async` y lanza (por ejemplo, porque el body no trae
email), en Express 4 ese rechazo **no lo captura nadie**. El proceso se
tumba con un aviso de "unhandled promise rejection" y te quedas sin servidor.

Por hoy, envuélvelo en `try/catch` y llama a `next(err)` tú mismo. Es
incómodo, es temporal, y es exactamente el motivo por el que Express 5
metió soporte nativo. Cuando lo veas te preguntarás por qué.

### Errores típicos de esta etapa

| Lo que ves | Por qué pasa |
|---|---|
| `Cannot read properties of undefined` al leer `req.body` | Falta `express.json()`, o está declarado *después* de la ruta |
| `EADDRINUSE :::3000` | Ya hay algo en el 3000. Cambia el puerto en `.env` |
| El servidor arranca y se cae al instante | Error en la última línea del `index.js`. Mira el stack trace de arriba del todo, no del final |
| El middleware de errores nunca se ejecuta | Está declarado antes de las rutas, o le falta el 4º parámetro |

### Comprobación

```bash
curl http://localhost:3000/api/health
```

Si te devuelve el JSON, **la tubería funciona**. A partir de aquí solo
añades capas: cada etapa es la anterior con una pieza más.

---

# Etapa 2 — Mongoose toca la base

Por fin una base de datos de verdad.

### Tu tarea

1. `server/src/config/db.js` — la conexión.
2. `server/src/models/Categoria.js` — el esquema y el modelo.
3. Añade `GET /api/categorias` a la app.
4. Conecta la base **antes** de escuchar en el puerto.

`Categoria` necesita `nombre` y `slug`. Devuelve la lista de categorías.

### Por qué así

**El evento `connected` es tu confirmación.**

Mongoose no falla al conectar: se queda **reintentando en silencio**. Si no
esperas al evento `connected`, tu server escucha en el 3000 y cada petición a
la base falla con un timeout de 30 segundos. La primera petición parece
"colgada" y no sabes por qué. Por eso hay que esperar a la conexión **antes**
de `listen()`.

Y a la inversa, que es lo del predicado de la etapa 0: si la base no está
viva, tu decisión debería ser **caerse y que lo veas en el log**, no esperar
en silencio.

**`unique: true` declara una intención. No la cumple.**

Esta es la trampa más común de Mongoose, y la que más me importa que
entiendas. Escribes:

```js
// CÓDIGO QUE DEBES ESCRIBIR TÚ (forma, no contenido):
email: { type: String, required: true, unique: true }
```

y crees que ya no puede haber dos usuarios con el mismo email. **Falso.**
Lo que has hecho es *declarar* que quieres un índice único. El índice es una
estructura física de MongoDB que tiene que **construirse**. Mongoose lo hace
solo en desarrollo, pero:

- no ocurre hasta que se establece la primera conexión,
- y en producción Mongoose **desactiva `autoIndex`** por seguridad.

Si nadie construye el índice, MongoDB guarda los dos duplicados sin
protestar. Tu comprobación en el controlador ("¿existe ya ese email?") sigue
funcionando... hasta que dos peticiones llegan **a la vez**. Es una condición
de carrera: ambas comprueban antes de que ninguna inserte, y las dos insertan.

Por eso el arranque debe **sincronizar los índices a propósito**, y por eso
el error que MongoDB lanza al saltarse el índice tiene código propio.

**`select: false` esconde el campo por defecto.**

Mongoose puede marcar un campo para que *no* salga en las consultas salvo que
lo pidas explícitamente. En un usuario, ese campo es la contraseña. Que por
defecto no salga significa que un `console.log` de cualquier usuario no
imprime el hash por accidente.

**No es cifrado.** El hash es un valor de una sola dirección: no se
deshace. Está a salvo de que alguien lea la base, no de que alguien lea tu
servidor.

### Errores típicos de esta etapa

| Lo que ves | Por qué pasa |
|---|---|
| La petición tarda 30 s y falla | Conectaste sin esperar al evento `connected` |
| `ECONNREFUSED 127.0.0.1:27017` | Mongo no está levantado, o levantaste el server sin `condition: service_healthy` |
| `MongooseServerSelectionError` | `MONGO_URI` mal escrito, o el nombre de la base no es válido en la cadena |
| `StrictMode: No ...` en el log | Has escrito un campo que no está en el esquema. Mongoose lo ignora **en silencio**: el dato se pierde sin error. Comprueba el nombre exacto |
| Devuelve `[]` siempre | Conectaste a otra base, o a la base de otro entorno. Imprime el `MONGO_URI` |

### Comprobación

`GET /api/categorias` devuelve `[]` (o lo que haya) y **responde rápido**.
Que responda rápido es la prueba de que estás conectado de verdad.

---

# Etapa 3 — Validación y errores con forma

### Tu tarea

1. Un middleware de **validación** reutilizable.
2. El middleware de **errores** centralizado (4 parámetros, último).
3. Un middleware **404** para rutas que no existen.
4. Aplica la validación a `POST /api/auth/register` y `POST /api/auth/login`.

### Por qué así

**El navegador no es una frontera de seguridad.**

Esta es la idea más importante de la etapa. Ya validaste en el formulario:
nombre de 3 caracteres, email correcto, contraseña de 6. Está muy bien, y
**da igual**, porque ese JavaScript corre en la máquina *del usuario*.

Abrir la consola del navegador y escribir esto a mano es un minuto:

```js
// desde la consola del navegador, saltándote TODO tu React
fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'a', email: 'no-es-un-email', password: '123' }),
})
```

Si el servidor acepta eso, tu base se llena de basura. Todo lo que valida el
frontend es **comodidad para el usuario**; todo lo que valida el servidor es
**requisito de seguridad**. Se validan los dos, y por eso se repite.

Una regla práctica: **el servidor no se fía de nada que venga del cliente.**

**Los errores se centralizan en un sitio.**

Hay dos tentativas habituales y aquí gana una:

- `try/catch` en cada ruta y responder dentro → repetido 15 veces, y el día
  que añadas una ruta nueva se te olvida.
- **Un middleware al final que recibe el error y decide la respuesta.**

Escribe el error en tu controlador con `next(err)` y olvídate. Quien decide
cómo se ve el error es un solo archivo. Y el día que quieras cambiar el
formato de los errores, tocas **un** sitio.

### La forma de los errores

Que todos los errores se vean iguales te ahorra dolor luego:

```json
{ "error": { "codigo": "EMAIL_DUPLICADO", "mensaje": "texto para humanos" } }
```

Un cliente (tu React del futuro) puede ramificar sobre `codigo`, no sobre un
texto que puede cambiar. Los **mensajes** son para las personas; los
**códigos** son para el código.

### Códigos de estado que vas a usar

| Código | Cuándo | Lo ve el usuario |
|---|---|---|
| `200` | Todo bien, lectura | — |
| `201` | Recurso **creado** (registro) | "Te has registrado" |
| `400` | El cliente mandó basura (validación) | "Falta el email" |
| `401` | No sé quién eres (login malo) | "Credenciales incorrectas" |
| `404` | No existe esa ruta o ese recurso | "No encontrado" |
| `409` | Conflicto con el estado actual (email duplicado) | "Ese email ya existe" |
| `500` | Fallo mío. No filtres detalles al cliente | "Error del servidor" |

**`401` y no `403`:** no autenticado frente a autenticado-pero-sin-permiso.
Hoy solo necesitas `401`.

**En el `500` no filtres el stack trace.** Al cliente le mandas un mensaje
genérico y el detalle te lo quedas tú en el log del servidor. Si filtras,
le regalas al atacante un mapa de tu sistema de ficheros.

### Errores típicos

| Lo que ves | Por qué pasa |
|---|---|
| El middleware de errores nunca se llama | Le falta el 4º parámetro, o está antes de las rutas |
| `req.body` vacío pero el body sí llega | Falta `express.json()`, o la ruta está declarada antes que él |
| `Cannot set headers after they are sent` | Respondiste dos veces: un `res.json()` y luego otro. En una tubería, `next()` tras responder corta el recorrido |
| El error sale pero el cliente recibe HTML | Falta el middleware de errores, así que Express usa su respuesta por defecto |

### Comprobación

`GET /api/ruta-inventada` devuelve **JSON** con un 404, no la página de error
por defecto de Express. Y un `POST` sin body devuelve JSON con 400.

---

# Etapa 4 — `POST /api/auth/register`

### Tu tarea

En este orden exacto:

1. Valida (etapa 3). Si falla, `400`.
2. Normaliza el email a minúsculas.
3. Comprueba si ya existe. Si sí, `409`.
4. **Hashea** la contraseña.
5. Inserta.
6. Devuelve `201` con un token.

### Por qué así

**El orden importa y por un motivo concreto.**

Comprobar duplicados en el paso 3 es una **optimización** para dar un error
amigable ("ese email ya existe"). **No es la garantía.** La garantía real es
el índice único (etapa 2), que se asegura en la base aunque dos peticiones
lleguen en el mismo milisegundo.

Tu código debe funcionar aunque el paso 3 no existiera. Si lo quitas y el
índice sigue ahí, el sistema sigue siendo correcto: cambia el mensaje de
error, no la seguridad. Ese es el test mental que te dice si un chequeo tuyo
es una barrera de seguridad o solo una cortesía de amabilidad.

**Normaliza el email a minúsculas.**

`Ana@correo.com` y `ana@correo.com` son la misma persona. Si no normalizas,
el índice único los considera distintos y tendrías dos cuentas de la misma
persona. Hazlo **antes** de comprobar y **antes** de insertar, o el índice
trabajará con dos formatos distintos.

Un detalle: en Mongo, un índice único sobre un campo normalizado también
distingue mayúsculas a menos que uses collation. Por eso normalizar es
tu responsabilidad, no de la base.

**Hashea ANTES de insertar. Nunca después.**

Si insertas la contraseña en claro y luego la hasheas, hay una ventana en la
que la contraseña está en la base en texto plano. Puede que un `read`
concurrente la lea, puede que una copia de seguridad la capture.

**Hashear tiene un coste deliberado.** `bcrypt` es lento a propósito: unos
100 ms. Hacerlo rápido lo haría barato para un atacante que quisiese probar
contraseñas a porfuerzo. Ese coste es tu defensa. Si alguna vez "optimizas" el
hasheo para que vaya más rápido, has destruido la única protección que te daba.

**Qué es un hash, exactamente.**

- Es de **una sola dirección**. No hay "des-hashear". Nunca tendrás la
  contraseña original de un usuario, y **nunca debes poder**.
- Lleva **sal** incorporada: dos usuarios con la misma contraseña tienen
  hashes distintos. Sin sal, dos hashes iguales delatan que las
  contraseñas son iguales.
- No lleva los datos dentro. No puedes recuperar nada de un hash.

Consecuencia de diseño que te va a doler: **"olvidé mi contraseña" no puede
devolverte la antigua.** Obligatoriamente es un token de un solo uso que
manda al correo. Si alguna vez te piden la contraseña antigua, no se puede,
y no es un fallo: es el objetivo.

**El error 11000.**

Cuando MongoDB rechaza un insert por violar un índice único, lanza un error
cuyo código es **11000**. Mongoose lo envuelve, pero conserva ese código
dentro. Lo necesitas porque es **la** señal de "email duplicado" y te
permite convertirla en un `409` en el middleware de errores, en vez de
comprobarlo antes y necesitar dos caminos para el mismo problema.

Fíjate en que el 11000 **no distingue** qué campo falló (unique en
`nombre` o en `email`) sin que se lo preguntes. Es información que puedes
extraer del error, pero no te la esperes sin pedirla.

### Errores típicos

| Lo que ves | Por qué pasa |
|---|---|
| `E11000 duplicate key error collection...` | Llegó hasta el índice: la garantía funciona. Cónvelo a 409 |
| Se registra con contraseña en texto plano | Insertaste antes de hashear, o guardaste la variable equivocada |
| El `console.log` del usuario **no** muestra el password | `select: false` funcionando. Pídelo explícito cuando lo necesites |
| Dos usuarios con `Ana@x.com` y `ana@x.com` | No normalizaste antes de comprobar ni de insertar |

### Comprobación

Regístrate, y comprueba **en la base** (no en la respuesta del servidor) que
la contraseña es un hash y no un texto plano.

---

# Etapa 5 — `POST /api/auth/login`

### Tu tarea

1. Valida (mismo esquema que register, sin `nombre`).
2. Busca el usuario por email normalizado.
3. Compara contraseñas con bcrypt.
4. Si falla, `401`. **El mismo mensaje** que si el usuario no existe.
5. Si sale bien, firma un token y devuélvelo con `200`.

### Por qué así

**El mismo error para "no existe" y "contraseña incorrecta".**

Si respondes "ese email no está registrado" a unos y "contraseña
incorrecta" a otros, has construido un **oráculo**: cualquiera puede
descubrir si una persona tiene cuenta en tu tienda probando emails. Es una
filtración de información por un mensaje de error, y es la razón por la que
el login devuelve un `401` genérico.

Y un detalle de Mongoose que te va a morder aquí: si el campo tiene
`select: false`, **no viene en la búsqueda por defecto**, y `password` será
`undefined`. Es intencionado y aquí hay que pedirlo explícitamente. Olvidarte
de eso produce un `undefined` que bcrypt **no sabe comparar**, y el error que
sale no tiene nada que ver con contraseñas.

**Qué es un JWT de verdad.**

Un JWT son **tres partes separadas por puntos**:

```
eyJhbGciOi... . eyJzdWIiOi... . 4m9kL8x...
└─ header ──────┘ └─ payload ────┘ └ firma ────┘
```

- **Header**: con qué algoritmo se firmó.
- **Payload**: lo que firmaste. Ejemplo `{"id": "...", "iat": 12345}`.
- **Firma**: que el header y el payload no se han tocado.

Lo esencial: **el payload está codificado, no cifrado.** Cualquiera puede
decodificarlo sin secreto. `base64` no es cifrado, es solo un formato de
transporte.

De ahí sale la regla que no se rompe: **en un JWT no va jamás una
contraseña.** Ni un hash. Nada secreto. Es legible por cualquiera que tenga
el token.

Lo que un JWT resuelve de verdad: **no guarda estado en el servidor**. No
hay tabla de sesiones. Firmas, el token lo lleva el cliente, y cada petición
se valida verificando la firma. Eso permite escalar horizontalmente sin
compartir sesión.

Y lo que **no** resuelve: **no se puede revocar**. Si alguien te roba el
token, funciona hasta que caduca. Para poder revocarlo necesitas una lista
negra en servidor, y en ese momento ya tienes sesiones otra vez. Que sepas
esto antes de que te lo pregunten.

** invariably firma con caducidad.** Sin expiración, un token robado vale
para siempre. Ponle caducidad corta.

### Errores típicos

| Lo que ves | Por qué pasa |
|---|---|
| `password` es `undefined` al comparar | `select: false`. Pídelo explícito en la búsqueda |
| Compare falla con un error que no menciona contraseñas | Estás comparando contra algo que no es un hash válido |
| Login siempre falla aunque la contraseña sea correcta | Insertaste sin hashear, en la etapa 4 |
| El token decodificado trae el email en claro | Correcto, es así. Solo confirma que **nunca** debe llevar la contraseña |

### Comprobación

Regístrate, haz login, coge el token y **decodifícalo a mano**. Verás el
payload en claro. Es el mejor momento para internalizar por qué no va una
contraseña ahí.

---

# Etapa 6 — Seed y la matriz de pruebas

### Tu tarea

1. `server/src/seed/categorias.seed.js` que inserte las 4 categorías.
2. Un script `seed` en `package.json`.
3. Ejecuta la matriz de pruebas de abajo y anota qué devuelve cada una.

Las categorías son las que **ya tienes hardcodeadas** en
`OffCanvasCats.jsx` (líneas 47-79):

```
Componentes
Ordenadores
Perifericos
Consolas
```

### Por qué así

**Usa `upsert`, no `insert`.**

Un seed con `insert` ejecutado dos veces te crea duplicados. `upsert` dice
"si existe, actualiza; si no, crea". El seed se vuelve **idempotente**: puedes
ejecutarlo las veces que quieras y el resultado es el mismo. Es la diferencia
entre un seed que da miedo y uno que puedes correr sin pensarlo.

**La matriz de fallos es la mitad del trabajo.**

Todo el mundo prueba que el camino feliz funciona (registro correcto, login
correcto). Eso prueba poco: tu código está preparado para el caso fácil.

Un `POST` con el email duplicado, con contraseña corta, con email inválido, o
un login con contraseña incorrecta, recorren caminos de código que el camino
feliz **nunca toca**. Si un día alguien rompe tu validación y tú solo
probabas el camino bueno, no te enteras.

Escribe la tabla con lo que devuelve cada caso **de verdad**, no lo que crees
que devuelve. Si se diferencia de lo que esperabas, ya tienes un bug.

### La matriz

| # | Qué pruebas | Debería dar |
|---|---|---|
| 1 | `GET /api/categorias` | 200 con las 4 |
| 2 | `GET /api/ruta-que-no-existe` | 404 JSON |
| 3 | Register con email duplicado | 409 |
| 4 | Register con contraseña de 3 caracteres | 400 |
| 5 | Register sin campo `email` | 400 |
| 6 | Register con email inválido | 400 |
| 7 | Login con contraseña incorrecta | 401 |
| 8 | Login con email inexistente | 401 **con el mismo texto que el 7** |
| 9 | Login correcto | 200 + token |
| 10 | El token de un login, reutilizado | sigue funcionando (es lo que significa "sin estado") |

Si el **7 y el 8** devuelven textos distintos, tienes una fuga de
información. Vuelve a la etapa 5.

### Comprobación

Las 10 filas anotadas con el resultado **real**, y todos los códigos de
estado dentro de lo esperado.

---

# Etapa 7 — Arreglo de `main.jsx` (bonus)

### Tu tarea

`src/main.jsx` importa así:

```js
import LoginRegistro from "./Componentes/zonaCliente/login/LoginRegistro.jsx";
```

Pero las carpetas se llaman `componentes` y `zonaTienda`, en minúsculas.

En Windows funciona porque el sistema de ficheros **no distingue mayúsculas
de minúsculas**. En Linux, macOS y CI **sí lo hace**, así que esto se rompe
en cuanto compiles en otro sitio.

Son 5 imports. Corrige las mayúsculas y comprueba que `npm run dev` sigue
arrancando.

No es cosmético: es el tipo de cosa que te hace perder una hora el día que
subes a GitHub Actions y falla sin decir por qué.

---

# 10. Catálogo de errores

Para que los reconozcas en vez de perderte. Busca el **síntoma**, no el error
literal.

| Síntoma | Causa real | Dónde mirar |
|---|---|---|
| `Cannot read properties of undefined (reading 'body')` | Falta `express.json()`, o la ruta se declaró antes | Etapa 1 |
| `EADDRINUSE :::3000` | Algo ya ocupa el 3000 | Cambia `PORT` en `.env` |
| Unhandled promise rejection y el server se cae | `async` que lanza sin `try/catch` | Etapa 1, punto 3 |
| El middleware de errores nunca se ejecuta | Le falta el 4º parámetro, o está antes de las rutas | Etapa 1, punto 2 |
| `Cannot set headers after they are sent` | Dos respuestas, o `next()` después de responder | Etapa 3 |
| La petición tarda 30 s y falla | Conectaste a la base sin esperar `connected` | Etapa 2 |
| `ECONNREFUSED 127.0.0.1:27017` | El servicio `MongoDB` no está Running. Mira `Get-Service MongoDB` | Etapa 0 |
| `MongooseServerSelectionError` | `MONGO_URI` mal escrito | Etapa 2 |
| `StrictMode: No ...` en el log | Campo que no está en el esquema: **se pierde en silencio** | Etapa 2 |
| `E11000 duplicate key error` | Índice único violado. Funciona: conviértelo a 409 | Etapa 4 |
| Dos usuarios con el email en distinto case | No normalizaste | Etapa 4 |
| Contraseña guardada en texto plano | Insertaste antes de hashear | Etapa 4 |
| `password` es `undefined` al comparar | `select: false`, pídelo explícito | Etapa 5 |
| Login siempre falla con contraseña correcta | Se registró sin hashear | Etapas 4-5 |
| `GET` devuelve `[]` siempre | Conectaste a otra base. Imprime el `MONGO_URI` | Etapa 2 |

---

# 11. Lo que NO hemos hecho

Apunta, porque el curso va a seguir por aquí:

- **Conectar el React.** En cuanto lo hagas aparecerán dos problemas nuevos:
  **CORS** (el navegador, por fin) y un **proxy de Vite** para no repetir la
  URL. Es el motivo por el que quitamos `cors` hoy: cuando llegue, lo
  entenderás de verdad.
- **Tests automáticos** (`supertest` + `mongodb-memory-server`). La matriz de
  la etapa 6 es la versión manual de lo que hará `supertest` por ti.
- **Refresh tokens** y rotación.
- **Roles.** Un usuario y un admin no son lo mismo, y "autenticado" no
  significa "autorizado".
- **Rate limiting** en el login. Sin él, tu login es un ataque de diccionario
  gratis.
- **Dockerizar la API.** Requiere WSL2 con una distro de Linux instalada, que
  hoy no tienes. Es el camino natural cuando esto salga a un servidor.

---

# 12. Comandos

```bash
# ---- Base de datos (servicio de Windows: arranca solo) ----
Get-Service MongoDB            # ver si está Running
Start-Service MongoDB          # arrancarlo si lo paraste
Stop-Service  MongoDB          # pararlo (necesita admin)

# ---- Mirar la base con mongosh ----
mongosh "mongodb://localhost:27017/pccomponentes"                 # entrar
mongosh "mongodb://localhost:27017/pccomponentes" --eval "db.getCollectionNames()"
mongosh "mongodb://localhost:27017/pccomponentes" --eval "db.dropDatabase()"

# ---- API ----
npm run dev                    # nodemon, en el 3000
npm run seed                   # meter las 4 categorías
```

Prueba rápida sin Postman:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/categorias
```
