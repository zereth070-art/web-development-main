# Documentación del Proyecto: Pomodoro Zion

> **Versión:** 1.0  
> **Fecha:** Agosto 2026  
> **Estado:** En desarrollo (fase de aprendizaje)  
> **Última actualización:** 2026-08-12

---

## Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#3-tecnologías-utilizadas)
4. [Modelo de Dominio](#4-modelo-de-dominio)
5. [Lógica de Negocio](#5-lógica-de-negocio)
6. [API REST](#6-api-rest)
7. [WebSocket y Tiempo Real](#7-websocket-y-tiempo-real)
8. [Frontend](#8-frontend)
9. [Base de Datos](#9-base-de-datos)
10. [Decisiones de Diseño](#10-decisiones-de-diseño)
11. [Guía de Ejecución](#11-guía-de-ejecución)
12. [Mejoras Futuras](#12-mejoras-futuras)

---

## 1. Visión General

### 1.1. ¿Qué es PomodoroZion?

PomodoroZion es una **aplicación web full-stack** que implementa la [Técnica Pomodoro](https://en.wikipedia.org/wiki/Pomodoro_Technique), un método de gestión del tiempo desarrollado por Francesco Cirillo en los años 80. La técnica consiste en dividir el trabajo en intervalos de 25 minutos ("pomodoros") separados por descansos cortos, con un descanso largo cada 4 pomodoros completados.

### 1.2. ¿Qué problema resuelve?

- **Procrastinación:** Al dividir el trabajo en bloques cortos, reduce la resistencia a empezar.
- **Falta de estructura:** Proporciona un framework claro de trabajo y descanso.
- **Olvido del progreso:** Registra automáticamente cuántos pomodoros se han completado por tarea.
- **Falta de métricas:** Muestra estadísticas diarias de enfoque y descanso.

### 1.3. Alcance Actual

| Característica | Estado |
|---|---|
| Temporizador Pomodoro con fases automáticas | Implementado |
| Gestión de tareas (CRUD) | Implementado |
| Vinculación tarea-temporizador | Implementado |
| Actualizaciones en tiempo real (WebSocket) | Implementado |
| Historial de sesiones | Implementado |
| Estadísticas diarias | Implementado |
| Notificaciones de escritorio | Implementado |
| Sonido de alerta | Implementado |
| Autenticación / Login | No implementado |
| Persistencia de configuración de usuario | No implementado |
| Tests unitarios / integración | Pendiente |
| Despliegue en producción | Pendiente |

---

## 2. Arquitectura del Sistema

### 2.1. Diagrama de Capas

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR (Cliente)                    │
│                                                          │
│   ┌──────────┐   ┌──────────┐   ┌──────────────────┐   │
│   │   HTML    │   │   CSS    │   │  JavaScript ES6+ │   │
│   │ (Vista)  │   │(Estilos) │   │  (Controlador)   │   │
│   └──────────┘   └──────────┘   └────────┬─────────┘   │
│                                          │               │
│                          ┌───────────────┴──────────┐   │
│                          │  HTTP REST + WebSocket    │   │
│                          └───────────────┬──────────┘   │
├──────────────────────────────────────────┼──────────────┤
│                    SERVIDOR (Spring Boot)                │
│                                          │               │
│   ┌──────────────────────────────────────┴──────────┐   │
│   │         Controladores REST + WebSocket           │   │
│   │  TimerController / TaskController / SessionsCtrl │   │
│   │  TimerWebSocketHandler / TimerBroadcaster        │   │
│   └──────────────────────┬──────────────────────────┘   │
│                          │                               │
│   ┌──────────────────────┴──────────────────────────┐   │
│   │              Capa de Servicios                   │   │
│   │  TimerService / TaskService / SessionService     │   │
│   └──────────────────────┬──────────────────────────┘   │
│                          │                               │
│   ┌──────────────────────┴──────────────────────────┐   │
│   │           Repositorios (Spring Data JPA)         │   │
│   │  TimerRepository / TaskRepository / SessionsRepo │   │
│   └──────────────────────┬──────────────────────────┘   │
│                          │                               │
│   ┌──────────────────────┴──────────────────────────┐   │
│   │            Hibernate ORM (JPA)                   │   │
│   └──────────────────────┬──────────────────────────┘   │
│                          │                               │
│   ┌──────────────────────┴──────────────────────────┐   │
│   │          Base de Datos H2 (Archivo)              │   │
│   │            ./data/pomodorozion.mv.db              │   │
│   └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 2.2. Flujo de Datos

```
                    ┌─────────────┐
                    │   Usuario   │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         Click "Iniciar"          Click "Crear tarea"
              │                         │
              ▼                         ▼
    POST /api/timer/start       POST /tasks
              │                         │
              ▼                         ▼
     TimerController            TaskController
              │                         │
              ▼                         ▼
      TimerService               TaskService
              │                         │
              ▼                         ▼
     TimerRepository            TaskRepository
              │                         │
              ▼                         ▼
    ┌─────────────────┐       ┌─────────────────┐
    │  Tabla TIMER    │       │   Tabla TASK    │
    │  (1 fila, id=1) │       │  (N filas)      │
    └────────┬────────┘       └─────────────────┘
             │
             ▼
      TimerBroadcaster
      (@Scheduled cada 1s)
             │
             ▼
      WebSocket → Navegador
      (estado actualizado)
```

### 2.3. Estructura de Archivos

```
pomodorozion/
├── pom.xml                          # Descriptor de Maven (dependencias, plugins)
├── mvnw / mvnw.cmd                  # Maven Wrapper (ejecutar sin instalar Maven)
├── .mvn/wrapper/                    # Configuración del wrapper
│
├── src/main/java/com/zion/pomodorozion/
│   ├── PomodorozionApplication.java # Punto de entrada de la aplicación
│   ├── HomeController.java          # Endpoint de salud (/api/health)
│   │
│   ├── ── TIMER ──
│   ├── Timer.java                   # Entidad JPA (estado del temporizador)
│   ├── TimerPhase.java              # Enum: FOCUS, SHORT_BREAK, LONG_BREAK
│   ├── TimerState.java              # DTO enviado al frontend
│   ├── TimerService.java            # Lógica de negocio del timer ★ NÚCLEO
│   ├── TimerRepository.java         # Repositorio JPA del timer
│   ├── TimerController.java         # API REST del timer
│   ├── TimerBroadcaster.java        # Broadcast WebSocket + scheduler
│   ├── TimerWebSocketHandler.java   # Manejador de conexiones WebSocket
│   ├── WebSocketConfig.java         # Configuración del endpoint WebSocket
│   │
│   ├── ── TAREAS ──
│   ├── Task.java                    # Entidad JPA (tarea)
│   ├── TaskStatus.java              # Enum: PENDING, IN_PROGRESS, COMPLETED
│   ├── TaskCreateDTO.java           # DTO de entrada (crear/actualizar)
│   ├── TaskDTO.java                 # DTO de salida (respuesta)
│   ├── TaskRepository.java          # Repositorio JPA de tareas
│   ├── TaskService.java             # Lógica de negocio de tareas
│   ├── TaskController.java          # API REST de tareas
│   │
│   ├── ── SESIONES ──
│   ├── PomodoroSession.java         # Entidad JPA (historial de sesiones)
│   ├── PomodoroSessionDTO.java      # DTO de salida para sesiones
│   ├── SessionsStatsDTO.java        # DTO de estadísticas diarias
│   ├── PomodoroSessionsRepository.java # Repositorio con queries custom
│   ├── PomodoroSessionService.java  # Lógica de negocio de sesiones
│   ├── PomodoroSessionsController.java # API REST de sesiones
│   │
│   ├── GlobalExceptionHandler.java  # Manejo global de errores
│   │
├── src/main/resources/
│   ├── application.properties       # Configuración de Spring Boot
│   └── static/
│       ├── index.html               # SPA (única página)
│       ├── style.css                # Estilos (313 líneas)
│       └── script.js                # Lógica del frontend (360 líneas)
│
├── src/test/java/                   # Tests
│   └── PomodorozionApplicationTests.java
│
├── data/                            # Base de datos H2 (generada en runtime)
│   └── pomodorozion.mv.db
│
├── docs/                            # Documentación
│   ├── TimerService.md              # Doc detallada del TimerService
│   └── DOCUMENTACION-PROYECTO.md    # Este archivo
│
└── .github/modernize/              # Plan de upgrade Java 21→25
```

---

## 3. Tecnologías Utilizadas

### 3.1. Backend

| Tecnología | Versión | Propósito |
|---|---|---|
| **Java** | 25 | Lenguaje de programación principal |
| **Spring Boot** | 4.1.0 | Framework de aplicación (auto-configuración, embedded server) |
| **Spring WebMVC** | (starter) | Controladores REST, manejo de HTTP |
| **Spring Data JPA** | (starter) | Repositorios, mapeo objeto-relacional |
| **Spring WebSocket** | (starter) | Comunicación bidireccional en tiempo real |
| **Spring Validation** | (starter) | Validación de DTOs con anotaciones (`@Valid`, `@NotBlank`) |
| **Hibernate** | 7.4.1.Final | Implementación del estándar JPA |
| **H2 Database** | 2.4.240 | Base de datos embebida (archivo) |
| **Jackson** | (via Spring) | Serialización JSON (entidades → JSON para WebSocket) |

**¿Por qué Spring Boot?** Es el estándar de la industria para Java backend. Maneja la configuración automáticamente, incluye un servidor web embebido (Tomcat), y tiene un ecosistema enorme de starters.

**¿Por qué H2?** Para desarrollo y aprendizaje es perfecta: cero configuración, datos persistentes en archivo, y se puede inspeccionar con la consola web en `/h2-console`.

### 3.2. Frontend

| Tecnología | Propósito |
|---|---|
| **HTML5** | Estructura de la página (SPA) |
| **CSS3** | Estilos con Custom Properties, Flexbox, Grid |
| **JavaScript ES6+** | Toda la lógica del cliente (async/await, WebSocket, Audio API) |
| **Web Audio API** | Sonido de alerta programático (sin archivos de audio) |
| **Notification API** | Notificaciones de escritorio del navegador |

**¿Por qué Vanilla JS (sin framework)?** Es un proyecto de aprendizaje. Entender JavaScript puro antes de usar React/Vue/Angular es fundamental. Domina el DOM, las promesas, el fetch API, los WebSockets desde cero.

### 3.3. Herramientas de Build

| Herramienta | Versión | Propósito |
|---|---|---|
| **Apache Maven** | 3.9.16 | Gestión de dependencias y build |
| **Maven Wrapper** | 3.3.4 | Ejecutar Maven sin instalarlo globalmente |
| **JUnit Jupiter** | 6.0.3 | Framework de testing |
| **Mockito** | 5.23.0 | Crear objetos mock para tests |

---

## 4. Modelo de Dominio

### 4.1. Diagrama de Entidades

```
┌─────────────────────┐        ┌──────────────────────────┐
│       TIMER         │        │          TASK             │
├─────────────────────┤        ├──────────────────────────┤
│ id: Long (PK)       │        │ id: Long (PK)            │
│ phase: TimerPhase   │        │ title: String            │
│ running: boolean    │        │ status: TaskStatus       │
│ remainingSecondsAt  │   ┌───▶│ estimatedPomodoros: int  │
│   Start: long       │   │    │ completedPomodoros: int  │
│ startedAt: Instant  │   │    │ createdAt: Instant      │
│ focusCountInCycle:  │   │    │ updatedAt: Instant      │
│   int               │   │    └──────────┬───────────────┘
│ selectedTaskId: Long│───┘               │
└─────────────────────┘   (FK lógica)     │
                                          │
                         ┌────────────────┘
                         │
┌────────────────────────┴───────────────────┐
│            POMODOROSESSION                 │
├────────────────────────────────────────────┤
│ id: Long (PK)                             │
│ phase: TimerPhase                         │
│ taskId: Long (FK lógica, nullable)        │
│ taskTitle: String (denormalizado)         │
│ startedAt: Instant                        │
│ completedAt: Instant                      │
│ durationSeconds: long                     │
└────────────────────────────────────────────┘
```

### 4.2. Enums

#### TimerPhase (`src/main/java/.../TimerPhase.java`)

Representa las 3 fases del ciclo Pomodoro:

```java
public enum TimerPhase {
    FOCUS,        // 25 minutos de trabajo concentrado
    SHORT_BREAK,  // 5 minutos de descanso
    LONG_BREAK    // 15 minutos de descanso largo (cada 4 pomodoros)
}
```

#### TaskStatus (`src/main/java/.../TaskStatus.java`)

Representa el estado de una tarea:

```java
public enum TaskStatus {
    PENDING,      // Sin pomodoros completados
    IN_PROGRESS,  // Al menos 1 pomodoro, pero menos de los estimados
    COMPLETED     // Pomodoros completados >= estimados
}
```

### 4.3. Entidad Timer (`src/main/java/.../Timer.java`)

**Patrón Singleton:** Solo existe UNA fila en la base de datos (id=1). Esta entidad es una "fotografía" del estado del temporizador en el momento de la última acción.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long | Siempre 1 (singleton) |
| `phase` | TimerPhase | Fase actual del ciclo |
| `running` | boolean | `true` si el timer está activo, `false` si está pausado o detenido |
| `remainingSecondsAtStart` | long | **Campo clave:** los segundos que quedaban en el momento del start/pause/finish |
| `startedAt` | Instant | Momento en que se dio a "Iniciar". `null` cuando está pausado |
| `focusCountInCycle` | int | Cuántas sesiones FOCUS se completaron en el ciclo actual (0-4) |
| `selectedTaskId` | Long | ID de la tarea vinculada (nullable). 0 = sin tarea |

**¿Por qué `remainingSecondsAtStart` y no un countdown?** Porque el timer NO corre en el servidor. El servidor guarda un instantánea ("fotografía") y calcula el tiempo restante matemáticamente: `remainingSecondsAtStart - (ahora - startedAt)`. Esto permite que el timer sobreviva a recargas de página, reinicios del servidor y desconexiones de red.

### 4.4. Entidad Task (`src/main/java/.../Task.java`)

Representa una tarea de trabajo que el usuario quiere completar usando la técnica Pomodoro.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long | ID auto-generado |
| `title` | String | Nombre de la tarea (requerido, no vacío) |
| `status` | TaskStatus | Estado calculado automáticamente |
| `estimatedPomodoros` | int | Cuántos pomodoros estima el usuario (mínimo 1) |
| `completedPomodoros` | int | Cuántos pomodoros se han completado realmente |
| `createdAt` | Instant | Timestamp de creación (`@PrePersist`) |
| `updatedAt` | Instant | Timestamp de última actualización (`@PreUpdate`) |

**Cálculo automático del status:**
```
completedPomodoros == 0              → PENDING
completedPomodoros > 0 && < estimated → IN_PROGRESS
completedPomodoros >= estimated       → COMPLETED
```

### 4.5. Entidad PomodoroSession (`src/main/java/.../PomodoroSession.java`)

Registra cada fase completada (FOCUS o BREAK) como un historial inmutable.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long | ID auto-generado |
| `phase` | TimerPhase | Qué fase se completó |
| `taskId` | Long | ID de la tarea vinculada (0 si ninguna) |
| `taskTitle` | String | **Denormalizado:** nombre de la tarea al momento de completar |
| `startedAt` | Instant | Cuándo empezó esta fase |
| `completedAt` | Instant | Cuándo terminó (`@PrePersist`) |
| `durationSeconds` | long | Duración real en segundos |

**¿Por qué `taskTitle` está duplicado?** Porque si el usuario borra la tarea después, el historial de sesiones sigue mostrando a qué tarea perteneció. Es un diseño intencional para preservar la integridad histórica.

### 4.6. Diagrama de Relaciones

```
Timer (1) ──── selectedTaskId ────▶ (N) Task
                                         │
PomodoroSession (N) ──── taskId ────▶   Task
PomodoroSession (N) ──── taskTitle ──▶  (copia del título)

Nota: Estas son relaciones LÓGICAS (no hay FK física en JPA).
      El Timer y PomodoroSession almacenan el ID directamente.
```

---

## 5. Lógica de Negocio

### 5.1. El Ciclo Pomodoro

El ciclo completo repite este patrón:

```
┌──────────┐    ┌──────────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────┐
│  FOCUS   │───▶│ SHORT_BREAK  │───▶│  FOCUS   │───▶│ SHORT_BREAK  │───▶│  FOCUS   │
│  25 min  │    │   5 min      │    │  25 min  │    │   5 min      │    │  25 min  │
└──────────┘    └──────────────┘    └──────────┘    └──────────────┘    └─────┬────┘
  focusCount=1      focusCount=1     focusCount=2      focusCount=2     focusCount=3
                                                                              │
                    ┌──────────────────────────────────────────────────────────┘
                    ▼
              ┌──────────┐    ┌──────────────┐    ┌──────────┐
              │  FOCUS   │───▶│ LONG_BREAK   │───▶│  FOCUS   │  (nuevo ciclo)
              │  25 min  │    │   15 min     │    │  25 min  │
              └──────────┘    └──────────────┘    └──────────┘
              focusCount=4      focusCount=0(reset)
```

### 5.2. Transiciones de Fase (Reglas)

| Fase Completada | focusCountInCycle | Siguiente Fase | Acción adicional |
|---|---|---|---|
| FOCUS | < 4 | SHORT_BREAK | Incrementa `focusCountInCycle`, registra sesión |
| FOCUS | = 4 | LONG_BREAK | Incrementa `focusCountInCycle`, registra sesión |
| SHORT_BREAK | cualquier | FOCUS | Registra sesión |
| LONG_BREAK | cualquier | FOCUS | Resetea `focusCountInCycle` a 0, registra sesión |

**Nota importante:** Después de cualquier fase, el temporizador **NO se inicia automáticamente**. El usuario debe pulsar "Iniciar" para comenzar la siguiente fase. Esto es intencional para dar control total al usuario.

### 5.3. El Patrón "Fotografía" del Timer

Este es el diseño más importante y original de PomodoroZion:

```
ESTADO: Pausado, 18:30 restantes en FOCUS
┌─────────────────────────────────────┐
│ remainingSecondsAtStart = 1110      │  (18:30 = 1110 segundos)
│ startedAt = null                    │  (pausado)
│ running = false                     │
└─────────────────────────────────────┘

USUARIO PULSA "INICIAR"
┌─────────────────────────────────────┐
│ remainingSecondsAtStart = 1110      │  (no cambia)
│ startedAt = 2026-08-12T14:30:00Z   │  (se guarda el momento)
│ running = true                      │
└─────────────────────────────────────┘

3 MINUTOS DESPUÉS (petición HTTP o WebSocket)
┌─────────────────────────────────────┐
│ remainingSecondsAtStart = 1110      │  (no cambia)
│ startedAt = 2026-08-12T14:30:00Z   │  (no cambia)
│ running = true                      │
│                                     │
│ CÁLCULO: 1110 - (now - startedAt)  │
│         = 1110 - 180 = 930 seg     │
│         = 15:30 restantes           │
└─────────────────────────────────────┘

USUARIO PULSA "PAUSAR"
┌─────────────────────────────────────┐
│ remainingSecondsAtStart = 930       │  (SE ACTUALIZA con el cálculo)
│ startedAt = null                    │  (se borra)
│ running = false                     │
└─────────────────────────────────────┘
```

**¿Por qué este diseño?**
1. **Sobrevive recargas:** Si el usuario recarga la página, el servidor recalcula desde la instantánea.
2. **Sobrevive reinicios del servidor:** Los datos están en la base de datos, no en memoria.
3. **Single source of truth:** El servidor es la autoridad del tiempo, no el navegador.
4. **Sin loops en el servidor:** No hay un `Thread.sleep(1000)` bloqueante. El cálculo es perezoso (lazy).

### 5.4. Integración Timer-Tarea

Cuando el usuario selecciona una tarea y completa una sesión FOCUS:

```
1. Timer.finish() detecta que la fase era FOCUS
2. Verifica que selectedTaskId != 0 (hay tarea vinculada)
3. Llama a taskService.completePomodoro(selectedTaskId)
4. TaskService:
   a. Incrementa completedPomodoros en +1
   b. Calcula nuevo status:
      - 0 completados → PENDING
      - 1+ completados, < estimados → IN_PROGRESS
      - completados >= estimados → COMPLETED
   c. Guarda en base de datos
5. La sesión se registra en PomodoroSession con el taskId y taskTitle
```

### 5.5. Estados del Botón del Temporizador

El frontend habilita/deshabilita botones según el estado:

| Estado | Iniciar | Pausar | Reiniciar |
|---|---|---|---|
| Pausado (`running=false`, `remaining > 0`) | ✅ | ❌ | ✅ |
| Ejecutándose (`running=true`) | ❌ | ✅ | ✅ |
| Finalizado (`remaining = 0`) | ❌ | ❌ | ✅ |
| Sin tiempo configurado (`remaining = 0`, `running=false`) | ❌ | ❌ | ✅ |

---

## 6. API REST

### 6.1. Endpoints del Timer

| Método | Ruta | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/api/timer` | Obtener estado actual | — | `TimerState` JSON |
| `POST` | `/api/timer/start` | Iniciar/reanudar timer | — | `TimerState` JSON |
| `POST` | `/api/timer/pause` | Pausar timer | — | `TimerState` JSON |
| `POST` | `/api/timer/reset` | Reiniciar fase actual | — | `TimerState` JSON |
| `POST` | `/api/timer/finish` | Completar fase manualmente | — | `TimerState` JSON |
| `POST` | `/api/timer/task/{taskId}` | Vincular/desvincular tarea | — | `TimerState` JSON |

**Ejemplo de respuesta TimerState:**
```json
{
  "phase": "FOCUS",
  "running": true,
  "remainingSeconds": 1247,
  "focusCountInCycle": 2,
  "selectedTaskId": 5
}
```

### 6.2. Endpoints de Tareas

| Método | Ruta | Descripción | Body | Respuesta |
|---|---|---|---|---|
| `GET` | `/tasks` | Listar todas las tareas | — | `TaskDTO[]` |
| `GET` | `/tasks/{id}` | Obtener tarea por ID | — | `TaskDTO` |
| `POST` | `/tasks` | Crear tarea | `TaskCreateDTO` | `TaskDTO` |
| `PUT` | `/tasks/{id}` | Actualizar tarea | `TaskCreateDTO` | `TaskDTO` |
| `DELETE` | `/tasks/{id}` | Eliminar tarea | — | 204 No Content |
| `POST` | `/tasks/{id}/pomodoro` | Sumar +1 pomodoro | — | `TaskDTO` |

**DTO de entrada (TaskCreateDTO):**
```json
{
  "title": "Implementar login",
  "estimatedPomodoros": 4
}
```

**DTO de salida (TaskDTO):**
```json
{
  "id": 1,
  "title": "Implementar login",
  "status": "IN_PROGRESS",
  "estimatedPomodoros": 4,
  "completedPomodoros": 2
}
```

### 6.3. Endpoints de Sesiones

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| `GET` | `/api/sessions/recent` | Últimas 20 sesiones | `PomodoroSessionDTO[]` |
| `GET` | `/api/sessions/today` | Estadísticas del día | `SessionsStatsDTO` |

**SessionsStatsDTO:**
```json
{
  "focusSeconds": 1800,
  "breakSeconds": 300,
  "focusCount": 3,
  "breakCount": 2
}
```

### 6.4. Endpoint de Salud

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| `GET` | `/api/health` | Health check | `{"status":"UP","app":"PomodoroZion","version":"1.0"}` |

### 6.5. Manejo de Errores

Todos los errores siguen un formato consistente (definido en `GlobalExceptionHandler.java`):

```json
{
  "timestamp": "2026-08-12T14:30:00Z",
  "status": 400,
  "error": "Validation Error",
  "message": "Validation failed",
  "errors": {
    "title": "El título es requerido"
  }
}
```

| Código HTTP | Causa |
|---|---|
| `400` | Validación fallida, body no legible, task ya completada |
| `404` | Recurso no encontrado (task, timer, etc.) |
| `500` | Error interno del servidor |

---

## 7. WebSocket y Tiempo Real

### 7.1. Configuración

- **Endpoint:** `ws://localhost:8080/ws`
- **Protocolo:** WebSocket estándar
- **Orígenes permitidos:** Todos (`*`)

### 7.2. Flujo de Conexión

```
Navegador                          Servidor
   │                                  │
   │──── GET /ws (upgrade) ──────────▶│
   │◀─── 101 Switching Protocols ─────│
   │                                  │
   │◀─── Estado actual (JSON) ────────│  (enviado al conectarse)
   │                                  │
   │    (cada 1 segundo)              │
   │◀─── Estado actual (JSON) ────────│  (@Scheduled tick())
   │◀─── Estado actual (JSON) ────────│
   │◀─── Estado actual (JSON) ────────│
   │                                  │
   │──── POST /api/timer/start ──────▶│  (acción del usuario)
   │◀─── Estado actualizado (JSON) ───│  (response HTTP)
   │◀─── Estado actualizado (JSON) ───│  (broadcast WebSocket)
```

### 7.3. TimerBroadcaster (`src/main/java/.../TimerBroadcaster.java`)

El broadcaster es el corazón del sistema de tiempo real:

- **`ConcurrentHashMap<String, WebSocketSession>`**: Almacena todas las conexiones activas (key = ID de sesión WebSocket).
- **`@Scheduled(fixedRate = 1000)`**: Cada segundo, si hay clientes conectados, obtiene el estado del timer y lo envía a todos.
- **`broadcast(state)`**: Serializa `TimerState` a JSON y lo envía a cada sesión usando `ConcurrentWebSocketSessionDecorator` (buffer de 1024 bytes, timeout de 5000ms).

### 7.4. Fallback: Polling HTTP

Si el WebSocket se desconecta, el frontend usa un **polling de 1 segundo** como respaldo:

```javascript
// Si no hay conexión WebSocket, se hace polling cada segundo
setInterval(() => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    poll(); // GET /api/timer
  }
}, 1000);
```

### 7.5. Detección de Finalización

El frontend detecta que una fase ha terminado cuando:
1. Recibe un estado con `remainingSeconds == 0` y `running == true`
2. Reproduce un sonido de alerta (Web Audio API, 800 Hz, 0.5s)
3. Envía una notificación de escritorio
4. Llama a `POST /api/timer/finish` para que el servidor procese la transición de fase
5. Recarga las sesiones y estadísticas

---

## 8. Frontend

### 8.1. Estructura de la Página

El frontend es una **Single Page Application (SPA)** servida como archivos estáticos desde Spring Boot.

```html
<body>
  <header>     → Logo SVG + título "Pomodoro Zion"
  <main>
    1. Sección Temporizador   → Display del timer, fase, puntos del ciclo, botones
    2. Sección Tareas          → Formulario de creación + lista de tareas
    3. Sección Estadísticas    → 4 tarjetas con métricas del día
    4. Sección Historial       → Últimas 20 sesiones
  </main>
  <footer>     → Copyright
</body>
```

### 8.2. Diseño Visual (style.css)

**Sistema de diseño con CSS Custom Properties:**

```css
:root {
  --negro: #1a1a1a;          /* Texto principal */
  --verde: #2d6a4f;           /* Color primario */
  --verde-claro: #52b788;     /* Acentos, bordes activos */
  --amarillo: #f4a800;        /* Botones primarios, acentos */
  --amarillo-claro: #ffd166;  /* Hover de botones */
  --fondo: #f9f7f0;           /* Fondo de la página */
  --blanco: #ffffff;          /* Fondo de tarjetas */
}
```

**Tipografía:** Fuente "Righteous" de Google Fonts para el título.

**Layout:**
- Contenedor principal: `max-width: 800px`, centrado
- Tarjetas: fondo blanco, bordes redondeados, borde amarillo superior
- Grid de estadísticas: 4 columnas con CSS Grid
- Formulario de tareas: Flexbox con `flex-wrap` para móvil
- Tareas: borde izquierdo coloreado según estado (naranja=PENDING, azul=IN_PROGRESS, verde=COMPLETED)

### 8.3. Lógica del Frontend (script.js)

**Variables de estado:**
```javascript
let editingTaskId = null;    // null = creando, number = editando
let selectedTaskId = 0;      // 0 = sin tarea seleccionada
const API_URL = "/tasks";    // Base URL de la API de tareas
```

**Funciones principales:**

| Función | Responsabilidad |
|---|---|
| `loadTasks()` | Obtiene todas las tareas y las renderiza en el DOM |
| `createTask()` | Crea o actualiza una tarea (según `editingTaskId`) |
| `deleteTask(id)` | Elimina una tarea tras confirmación |
| `completePomodoro(id)` | Suma +1 pomodoro a una tarea |
| `selectTaskId(id)` | Vincula/desvincula tarea al timer |
| `startEdit(task)` | Carga datos de la tarea en el formulario |
| `renderTimer(state)` | Actualiza display del timer, botones y ciclo |
| `renderCycle(focusCount)` | Renderiza los 4 puntos del ciclo |
| `connectWs()` | Establece conexión WebSocket con reconexión automática |
| `applyState(state)` | Procesa estado recibido: renderiza timer, detecta fin de fase |
| `loadTodayStats()` | Carga y muestra estadísticas del día |
| `loadRecentSessions()` | Carga y muestra historial de sesiones |
| `playBeep()` | Reproduce sonido de alerta (Web Audio API) |
| `notify(message)` | Envía notificación de escritorio |
| `formatTimer(seconds)` | Convierte segundos a `MM:SS` |
| `validateInput()` | Valida formulario y habilita/deshabilita botón crear |

**Ciclo de vida de una acción:**
```
1. Usuario hace click → llama a función JS
2. Función envía HTTP request (fetch API)
3. Backend procesa y responde con nuevo estado
4. Función actualiza el DOM con el nuevo estado
5. WebSocket también envía el estado actualizado (broadcast)
6. Frontend recibe el broadcast y vuelve a actualizar (redundante pero seguro)
```

---

## 9. Base de Datos

### 9.1. Configuración

```properties
# application.properties
spring.datasource.url=jdbc:h2:file:./data/pomodorozion
spring.jpa.hibernate.ddl-auto=update
```

- **Tipo:** H2 file-based (los datos persisten en disco)
- **Archivo:** `./data/pomodorozion.mv.db`
- **Schema management:** Hibernate genera/actualiza las tablas automáticamente (`ddl-auto=update`)

### 9.2. Tablas Generadas

```sql
-- Timer (singleton, siempre 1 fila)
CREATE TABLE timer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    phase VARCHAR(255),           -- 'FOCUS', 'SHORT_BREAK', 'LONG_BREAK'
    running BOOLEAN,
    remaining_seconds_at_start BIGINT,
    started_at TIMESTAMP,
    focus_count_in_cycle INTEGER,
    selected_task_id BIGINT
);

-- Tasks
CREATE TABLE task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(255),          -- 'PENDING', 'IN_PROGRESS', 'COMPLETED'
    estimated_pomodoros INTEGER,
    completed_pomodoros INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Pomodoro Sessions
CREATE TABLE pomodoro_session (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    phase VARCHAR(255),
    task_id BIGINT,
    task_title VARCHAR(255),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds BIGINT
);
```

### 9.3. Consola H2

Disponible en `http://localhost:8080/h2-console` al ejecutar la aplicación:
- JDBC URL: `jdbc:h2:file:./data/pomodorozion`
- Usuario: `sa`
- Contraseña: (vacía)

---

## 10. Decisiones de Diseño

### 10.1. ¿Por qué el timer NO corre en el servidor?

**Decisión:** El timer usa el patrón "fotografía" en vez de un `Thread.sleep` o un countdown en memoria.

**Razón:** Un countdown en memoria se perdería al reiniciar el servidor. La fotografía permite que el tiempo se calcule matemáticamente en cada petición, haciendo el estado completamente persistente y recuperable.

### 10.2. ¿Por qué WebSocket + polling como fallback?

**Decisión:** WebSocket como canal primario, con polling HTTP cada segundo como respaldo.

**Razón:** WebSocket es más eficiente (sin headers HTTP repetidos) y bidireccional. Pero algunos proxies, firewalls o configuraciones de red bloquean WebSockets. El fallback garantiza que la aplicación funcione siempre.

### 10.3. ¿Por qué no auto-iniciar después de un break?

**Decisión:** Después de cada fase (FOCUS o BREAK), el timer se detiene y el usuario debe pulsar "Iniciar" manualmente.

**Razón:** El usuario tiene control total. Quizás necesita un momento antes de empezar el siguiente pomodoro, o quiere cambiar de tarea. Auto-iniciar crearía presión innecesaria.

### 10.4. ¿Por qué TaskTitle está denormalizado en PomodoroSession?

**Decisión:** `PomodoroSession` almacena `taskTitle` directamente, no una referencia a la tarea.

**Razón:** Si el usuario borra una tarea, el historial de sesiones no pierde sentido. Es un principio de diseño: los datos históricos deben ser inmutables e independientes de datos transitorios.

### 10.5. ¿Por qué Timer es singleton (id=1)?

**Decisión:** Solo hay una fila en la tabla `timer`, siempre con id=1.

**Razón:** Solo hay un temporizador por aplicación. Este patrón simplifica la lógica: no hay que buscar, filtrar o gestionar múltiples timers. Se obtiene con `findById(1)` y si no existe, se crea.

### 10.6. ¿Por qué Thymeleaf está incluido pero no se usa?

**Decisión:** `spring-boot-starter-thymeleaf` está en `pom.xml` pero el frontend es HTML estático.

**Razón:** Se incluyó probablemente al crear el proyecto con Spring Initializr. No causa problemas pero es dependencia innecesaria. Podría eliminarse para reducir el tamaño del JAR.

### 10.7. Arquitectura de controladores

**Decisión:** `TaskController` usa `/tasks` como base, mientras `TimerController` usa `/api/timer`.

**Razón:** Parece una inconsistencia. Lo correcto sería que todas las rutas REST usen `/api/` como prefijo. Esto es un área de mejora.

---

## 11. Guía de Ejecución

### 11.1. Requisitos Previos

| Requisito | Versión Mínima | Verificar con |
|---|---|---|
| **Java JDK** | 25 (o superior) | `java -version` |
| **Git** | 2.x | `git --version` |
| **IDE** | Cualquiera (VS Code, IntelliJ, Eclipse) | — |

**Nota:** Maven NO necesita instalarse. El Maven Wrapper (`mvnw` / `mvnw.cmd`) lo descarga automáticamente.

### 11.2. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd pomodorozion
```

### 11.3. Ejecutar la Aplicación

**En Windows (PowerShell/CMD):**
```bash
.\mvnw spring-boot:run
```

**En Linux/macOS:**
```bash
./mvnw spring-boot:run
```

### 11.4. Acceder a la Aplicación

| URL | Descripción |
|---|---|
| `http://localhost:8080` | Aplicación principal |
| `http://localhost:8080/h2-console` | Consola de administración de la BD |
| `http://localhost:8080/api/health` | Health check |

### 11.5. Ejecutar Tests

```bash
.\mvnw test
```

### 11.6. Empaquetar como JAR

```bash
.\mvnw clean package
```
El JAR ejecutable se genera en `target/pomodorozion-0.0.1-SNAPSHOT.jar`.

---

## 12. Mejoras Futuras

### 12.1. Funcionalidad

| Mejora | Prioridad | Descripción |
|---|---|---|
| **Autenticación** | Alta | Login/registro para uso multiusuario |
| **Configuración personalizable** | Alta | Permitir ajustar duración de pomodoros y descansos |
| **Estadísticas semanales/mensuales** | Media | Gráficas de productividad a lo largo del tiempo |
| **Exportar datos** | Media | Descargar historial en CSV o JSON |
| **Categorías/etiquetas** | Baja | Organizar tareas por proyecto o categoría |
| **Temporizador visual** | Baja | Barra de progreso circular o animación |

### 12.2. Técnico

| Mejora | Prioridad | Descripción |
|---|---|---|
| **Tests unitarios** | Alta | Cubrir lógica de negocio (TimerService, TaskService) con Mockito |
| **Tests de integración** | Alta | Testear endpoints REST con MockMvc |
| **Consistencia en rutas API** | Media | Unificar todo bajo `/api/` prefix |
| **Eliminar Thymeleaf innecesario** | Baja | Reducir dependencias del pom.xml |
| **Migrar a base de datos relacional** | Media | PostgreSQL o MySQL para producción |
| **Docker** | Media | Containerizar la aplicación |
| **CI/CD** | Media | GitHub Actions para build y test automático |

### 12.3. Frontend

| Mejora | Prioridad | Descripción |
|---|---|---|
| **Framework JS** | Media | Migrar a React, Vue o Angular para escalabilidad |
| **Diseño responsive mejorado** | Media | Optimización completa para móvil |
| **Modo oscuro** | Baja | Tema oscuro con toggle |
| **Accesibilidad** | Alta | ARIA labels, navegación por teclado, contraste |
| **PWA** | Baja | Service worker para funcionar offline |

---

## Apéndice: Referencia Rápida de Archivos

| Archivo | Líneas | Función |
|---|---|---|
| `TimerService.java` | ~150 | **Núcleo de la aplicación** - toda la lógica del timer |
| `TimerBroadcaster.java` | ~60 | Tiempo real - broadcast WebSocket cada segundo |
| `TaskService.java` | ~80 | CRUD de tareas + cálculo automático de status |
| `PomodoroSessionService.java` | ~60 | Registro de historial + estadísticas |
| `script.js` | ~360 | Toda la lógica del frontend |
| `style.css` | ~313 | Todo el diseño visual |
| `index.html` | ~120 | Estructura de la SPA |

---

> **Nota final:** Este documento es una referencia viva. A medida que el proyecto evolucione, esta documentación debe actualizarse para reflejar los cambios en arquitectura, funcionalidad y decisiones de diseño.
