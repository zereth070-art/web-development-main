# TimerService — Guía detallada

*PomodoroZion · Spring Boot · Java 17*

## 0. El modelo mental (léelo antes que nada)

Un temporizador de verdad no se implementa "restando 1 cada segundo en el servidor". El servidor no debe ejecutar un bucle. En su lugar guardamos **una foto del instante en que arrancamos** y, cuando alguien pregunta cuánto queda, **recalculamos con matemáticas** comparando esa foto con el reloj del sistema.

```
FOTO GUARDADA EN BD:  { empezó el 26/05 14:30:00, me quedaban 1500s }
                        │
Pregunta: "¿cuánto queda?"        ▸  si no corre  → 1500s
                        │
      ahora son las 14:31:45      ▸  han pasado 105s → 1500 - 105 = 1395s
```

- **Ventaja 1**: si el navegador se recarga o se cae, al volver hacer `GET /timer`, el servidor recalcula y devuelve el tiempo correcto. No hay pérdida.
- **Ventaja 2**: no hace falta lanzar hilos o `ScheduledExecutorService`. Cero coste.
- **Ventaja 3**: `pause()` no tiene que "parar el mundo", solo congelar la foto.

Este es el patrón central del servicio. Todo lo demás (start, pause, finish...) son maniobras sobre esa única foto.

---

## 1. Las piezas del proyecto que ya existen

Antes de leer el servicio, repasa qué hay alrededor:

| Fichero | Qué es |
|---|---|
| `Timer.java` | Entidad JPA. Una sola fila en BD (id=1). Guarda la "foto" y el estado del ciclo. |
| `TimerPhase.java` | Enum `FOCUS`, `SHORT_BREAK`, `LONG_BREAK`. |
| `TimerRepository.java` | Es el puente a la BD. `extends JpaRepository<Timer, Long>` te da `findById`, `save`, `count`... gratis. |
| `TimerState.java` | DTO (objeto de transferencia). Es lo que recibe el frontend. No guarda nada: solo transporta datos. |
| `TaskService.java` | Ya existía. `completePomodoro(id)` suma 1 y marca COMPLETADO si llega al estimado. Lo reutilizamos. |

### Qué guarda `Timer` (la foto + el ciclo)

```java
private TimerPhase phase;              // ¿en qué fase estoy? FOCUS / descanso
private boolean running;               // ¿está el reloj contando?
private long remainingSecondsAtStart;  // cuántos segundos quedaban al GUARDAR/ARRANCAR
private Instant startedAt;             // en qué instante arrancó (si running)
private int focusCountInCycle;         // cuántos FOCUS llevo de este ciclo de 4
private Long selectedTaskId;           // tarea a la que sumo pomodoros
```

Distinción crítica: `remainingSecondsAtStart` **no es** "lo que queda ahora". Es "lo que quedaba cuando se tomó la foto". Lo que queda *ahora* se calcula (método `secondsRemaining`).

---

## 2. Estructura del servicio

```java
@Service
public class TimerService {

    // Dependencias inyectadas (constructor)
    private final TimerRepository timerRepository;
    private final TaskService taskService;

    // Configuración: valores por defecto si no están en application.properties
    @Value("${pomodoro.duration:25}")   private int focusMinutes;
    @Value("${pomodoro.short-break:5}") private int shortBreakMinutes;
    @Value("${pomodoro.long-break:15}") private int longBreakMinutes;
```

- `@Service` → Spring lo registra como bean de negocio (misma idea que `TaskService`).
- **Inyección por constructor**: los campos son `final`. Spring construye el objeto *ya con* `TimerRepository` y `TaskService`. No se puede usar el servicio sin esas dependencias → menos errores.
- `@Value("${pomodoro.duration:25}")` lee la propiedad `pomodoro.duration`. Si no existe (o el `:`), usa `25`. Los minutos, porque la configuración se escribe en minutos humanos; el servicio los convierte a segundos.

---

## 3. Método por método

### 3.1 `getState()`

```java
public TimerState getState() {
    return toState(getTimer());
}
```

- Sin efectos secundarios: no guarda nada. Solo monta la respuesta.
- `getTimer()` garantiza que exista la fila (ver 4.4).
- `toState()` (ver 4.5) calcula el `remainingSeconds` en el acto.

**Cuándo lo usa el cliente**: al abrir la página, tras cada acción, y tras recargar.

---

### 3.2 `start()`

```java
public TimerState start() {
    Timer timer = getTimer();

    if (!timer.isRunning()) {
        long remaining = secondsRemaining(timer);
        if (remaining == 0) {
            remaining = fullDuration(timer.getPhase());
        }
        timer.setRemainingSecondsAtStart(remaining);
        timer.setStartedAt(Instant.now());
        timer.setRunning(true);
        timerRepository.save(timer);
    }

    return toState(timer);
}
```

Paso a paso:
1. `if (!running)` → **idempotente**: si ya corre, no se toca nada (volver a dar a Iniciar no resetea). El `if` exterior es la guarda.
2. `remaining = secondsRemaining(timer)` → cuánto queda *justo antes* de arrancar. Si estaba parado tras `pause()`, es lo que quedaba congelado; si es un arranque fresco, la duración completa.
3. **Caso límite**: si queda `0` (p. ej. terminó pero nadie llamó a `finish()`, o el `Math.max(0,...)` dio 0), se restaura la duración completa de la fase para que pueda arrancar de cero.
4. Se toma **la foto**: guardamos `remaining` (que es lo que queda) y `startedAt = Instant.now()` (desde cuándo).
5. `running = true` y guardamos los 3 campos. Eso es todo: el "temporizador" ya está corriendo, aunque no haya ningún hilo. El tiempo fluye solo porque el reloj del sistema avanza.

---

### 3.3 `pause()`

```java
public TimerState pause() {
    Timer timer = getTimer();

    if (timer.isRunning()) {
        timer.setRemainingSecondsAtStart(secondsRemaining(timer));
        timer.setStartedAt(null);
        timer.setRunning(false);
        timerRepository.save(timer);
    }

    return toState(timer);
}
```

La lógica invisible es: **mover la foto al presente y "desenchufar" el reloj**.

- `secondsRemaining(timer)` calcula el tiempo que queda *ahora mismo*, con la foto antigua.
- Ese valor se copia a `remainingSecondsAtStart` (la nueva foto de referencia).
- `startedAt = null` y `running = false`: ya no hay referencia contra el reloj. Si dejáramos `startedAt` con un valor aunque `running=false`, el cálculo `remainingSecondsAtStart - (ahora - startedAt)` restaría tiempo que ya no corre → perderíamos segundos.
- La **guarda** `if (isRunning())`: pausar un timer ya pausado no debe corromper la foto.

Info adicional para que cuaje: guardamos siempre el valor *calculado*, nunca el de la BD. Si `secondsRemaining` da un valor distinto del guardado (porque corría), es EL momento de congelarlo.

---

### 3.4 `reset()`

```java
public TimerState reset() {
    Timer timer = getTimer();

    timer.setRemainingSecondsAtStart(fullDuration(timer.getPhase()));
    timer.setStartedAt(null);
    timer.setRunning(false);
    timerRepository.save(timer);

    return toState(timer);
}
```

- Desecha la foto actual y pone `remainingSecondsAtStart = duración completa de la fase actual`.
- Para el reloj (`running=false`) y borra `startedAt`.
- **No hay guarda `if`**: reset siempre es válido, esté como esté.
- **Importante**: NO cambia la fase. Si estás en `SHORT_BREAK`, reset a 5 min de descanso. Cambiar de fase es exclusivo de `finish()`.

*Discusión de diseño (a elegir en el futuro)*: ¿preferirías que "Reiniciar" volviera siempre a FOCUS? Sería válido; aquí lo dejamos en "reinicias la fase en la que estás" por simpleza.

---

### 3.5 `finish()` — la transición (lo más trabajado)

Se invoca **desde el frontend** cuando el contador llega a 0. No decide ninguna fecha/hora: decide *qué viene después*.

```java
public TimerState finish() {
    Timer timer = getTimer();

    if (timer.getPhase() == TimerPhase.FOCUS) {
        timer.setFocusCountInCycle(timer.getFocusCountInCycle() + 1);   // 1
        completePomodoroIfSelected(timer);                              // 2
        boolean longBreak = timer.getFocusCountInCycle() % 4 == 0;      // 3
        timer.setPhase(longBreak ? TimerPhase.LONG_BREAK : TimerPhase.SHORT_BREAK); // 4
    } else {
        boolean wasLongBreak = timer.getPhase() == TimerPhase.LONG_BREAK; // 5
        timer.setPhase(TimerPhase.FOCUS);
        if (wasLongBreak) {
            timer.setFocusCountInCycle(0);                              // 6
        }
    }

    timer.setRemainingSecondsAtStart(fullDuration(timer.getPhase()));   // 7
    timer.setStartedAt(null);
    timer.setRunning(false);
    timerRepository.save(timer);

    return toState(timer);
}
```

**Caso A — termina un FOCUS:**
1. `focusCountInCycle++` → anota que has completado un pomodoro de trabajo en este ciclo.
2. `completePomodoroIfSelected(timer)` → si hay tarea seleccionada, suma el pomodoro a esa tarea (ver 4.1).
3. `focusCountInCycle % 4 == 0` → operador módulo: ¿es el 4º? 1%4=1, 2%4=2, 3%4=3, 4%4=0 → solo el 4º da 0.
4. Asignamos fase según el módulo: 4º → `LONG_BREAK` (15 min), si no → `SHORT_BREAK` (5 min).

**Caso B — termina un descanso:**
5. Averiguamos si el descanso que termina era el largo (para saber si toca reiniciar ciclo).
6. Volvemos a `FOCUS` y, si el descanso era largo, `focusCountInCycle = 0`: el ciclo de 4 empieza de nuevo.

**En ambos casos (7):** el nuevo `remainingSecondsAtStart` es la duración de la fase a la que acabamos de entrar, y el timer se queda **parado** esperando `start()`. El descanso no empieza solo: el usuario elige cuándo arrancarlo. Decisión de UX deliberada.

---

### 3.6 `selectTask(Long taskId)`

```java
public TimerState selectTask(Long taskId) {
    Timer timer = getTimer();

    if (taskId == null || taskId <= 0) {
        timer.setSelectedTaskId(0);          // deseleccionar
    } else {
        taskService.getTaskById(taskId);     // validación: lanza 404 si no existe
        timer.setSelectedTaskId(taskId);
    }
    timerRepository.save(timer);

    return toState(timer);
}
```

- **Deseleccionar**: `null` o `≤0` → ponemos el centinela `0` (tu entidad usa `long`, no `Long`; el "sin tarea" es 0).
- **Seleccionar**: `taskService.getTaskById(taskId)` es una *validación*: si la tarea no existe, lanza 404 y **nunca llega a la línea del save**. No queremos referencias huérfanas en BD.
- La selección solo se guarda en la fila del timer; no toca `Task`.

---

## 4. Los helpers (donde vive la magia)

### 4.1 `completePomodoroIfSelected(Timer timer)`

```java
private void completePomodoroIfSelected(Timer timer) {
    long taskId = timer.getSelectedTaskId();
    if (taskId <= 0) {
        return;                                // no hay tarea vinculada
    }

    TaskDTO task = taskService.getTaskById(taskId);
    if (task.getStatus() != TaskStatus.COMPLETED) {
        taskService.completePomodoro(taskId);
    }
}
```

- Si no hay tarea seleccionada → `return` (nada que hacer).
- **Doble comprobación antes de sumar**: miramos si la tarea ya está `COMPLETED`. Si lo está, `taskService.completePomodoro` lanzaría un 400 ("Task already completed"); aquí lo evitamos silenciosamente en lugar de que el descanso se rompa por el error.
- Reutiliza la lógica de negocio que ya existía en `TaskService` (no duplica reglas).

### 4.2 `secondsRemaining(Timer timer)` — el corazón

```java
private long secondsRemaining(Timer timer) {
    if (!timer.isRunning()) {
        return timer.getRemainingSecondsAtStart();      // foto "congelada"
    }

    long elapsed = Duration.between(timer.getStartedAt(), Instant.now()).getSeconds();
    return Math.max(0, timer.getRemainingSecondsAtStart() - elapsed);
}
```

- **Parado**: lo que quede es, literalmente, lo que se guardó (`remainingSecondsAtStart`). La foto ya está "congelada" en el tiempo de la pausa.
- **Corriendo**: `startedAt` es el instante de la foto. `Duration.between(startedAt, Instant.now()).getSeconds()` = segundos transcurridos. Restamos a lo que quedaba en el arranque.
- `Math.max(0, ...)`: si por cualquier deriva el reloj da negativo (reloj del sistema atrasado, por ejemplo), jamás devolveremos un tiempo negativo. El mínimo absoluto es 0.

*Nota de rigor*: `Duration.between` trunca los subsegundos. Si arrancó a las 14:30:00.900 y preguntamos a las 14:30:01.100, elapsed=1 s aunque solo pasaron 0.2 s. A efectos de un pomodoro (minutos) es irrelevante.

### 4.3 `fullDuration(TimerPhase phase)`

```java
private long fullDuration(TimerPhase phase) {
    long minutes = switch (phase) {
        case FOCUS -> focusMinutes;
        case SHORT_BREAK -> shortBreakMinutes;
        case LONG_BREAK -> longBreakMinutes;
    };
    return minutes * 60;
}
```

- `switch` **expresión** (Java 14+): cada rama devuelve un valor, sin `break`. Las flechas `->` lo hacen legible y exhaustivo: si mañana añades `PAUSED` al enum, el compilador se queja porque falta el caso.
- Centraliza las duraciones en UNA función: si cambias la config, todo el servicio se propaga.

### 4.4 `getTimer()` — la garantía de fila única

```java
private Timer getTimer() {
    return timerRepository.findById(1L).orElseGet(() -> {
        Timer timer = new Timer();
        timer.setId(1L);                                   // fila única forzada
        timer.setPhase(TimerPhase.FOCUS);
        timer.setRemainingSecondsAtStart(fullDuration(TimerPhase.FOCUS));
        timer.setRunning(false);
        return timerRepository.save(timer);
    });
}
```

- EL temporizador es la fila con `id = 1`. No tiene sentido tener muchos.
- `orElseGet(...)` (no `orElse(...)`): el callback solo se ejecuta SI la fila no existe (semántica perezosa). Si usaras `findById().orElse(new Timer())`, el `new Timer()` se construiría siempre, incluso cuando ya existe.
- Si falta (primera ejecución o BD vacía), la **siembra** (`seed`): FOCUS, duración completa, parado.

### 4.5 `toState(Timer timer)`

```java
private TimerState toState(Timer timer) {
    return new TimerState(
        timer.getPhase(),
        timer.isRunning(),
        secondsRemaining(timer),        // ← calcula, no copia el campo crudo
        timer.getFocusCountInCycle(),
        timer.getSelectedTaskId());
}
```

- Traduce la entidad (persistente, con la "foto" cruda) al DTO (lo que ve el cliente).
- En `remainingSeconds` **no** pasamos `getRemainingSecondsAtStart()` bruto, sino el resultado de `secondsRemaining()`: el cliente siempre recibe el tiempo real.
- `selectedTaskId` de `long` a `Long` en el DTO: Java autoboxea (0 sin tarea → `0L`).

---

## 5. El ciclo completo de un pomodoro (leer para consolidar)

```
BD: FOCUS, running=false, remaining=1500, focus=0, task=3

[start]  remaining=1500, startedAt=14:00:00, running=true
   │        (el servidor no hace NADA más: solo guardó la foto)
   │  ...pasan 25 min...  el frontend hace GET /timer cada segundo:
   │        el servidor RECALCULA: 1500 - (ahora - 14:00:00) → baja
   ▼
en 0 → [finish]
        ⚫ FOCUS termina → focus=1, (1%4≠0) → phase=SHORT_BREAK
        ⚫ task 3: aún no COMPLETED → completePomodoro(3) → task 3 = 2/4 pomodoros
        ⚫ remaining=300 (5 min), running=false

[start]  ...descanso de 5 min...
[finish]  ⚫ era SHORT_BREAK → phase=FOCUS, focus sigue =1, remaining=1500

  ...repites 3 veces más (focus 2, 3, 4)...
[finish] con focus=4 → (4%4=0) → phase=LONG_BREAK, remaining=900

[finish] ⚫ era LONG_BREAK → phase=FOCUS, focusCount=0 ← ciclo nuevo
```

---

## 6. Preguntas y ejercicios para hacerlo tuyo

1. **¿Por qué `startedAt=null` al pausar?** Piensa qué pasaría si dejáramos `startedAt=14:30:00` con `running=false`: `secondsRemaining` restaría `14:30` de la hora actual → los segundos continuarían "pasando" mientras está pausado. `null` es la señal de "la foto está congelada".

2. **¿Qué pasaría si dos usuarios usan la app a la vez?** Ambos comparten la fila id=1. Spring Boot + H2 en memoria no está pensado para multiusuario. Es un proyecto de aprendizaje; vale como está.

3. **Reto**: ¿cambiarías `reset()` para volver siempre a FOCUS? ¿Qué línea tocarías?

4. **Reto**: modifica `finish()` para que el descanso *se inicie automáticamente* (`running=true`, `startedAt=now`) al terminar un FOCUS. ¿Dónde harías el cambio y qué implicaciones tiene a nivel de UX?

5. **Reto**: ¿por qué `secondsRemaining` usa `Math.max(0, ...)`? Imagina que el reloj del sistema retrocede de golpe (cambio de hora). ¿Qué pasaría sin esa protección?

6. **Bonus**: prueba a escribir tests unitarios de `finish()`: `Mockito` para el repositorio + un `Timer` real, comprueba la secuencia FOCUS → SHORT_BREAK → FOCUS → ... → LONG_BREAK. Es la mejor manera de interiorizarlo.