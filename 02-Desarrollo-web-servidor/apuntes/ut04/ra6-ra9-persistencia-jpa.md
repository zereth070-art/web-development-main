# UT04 · RA6 + RA9 — Persistencia con JPA

> Práctica de referencia: `10-Proyectos/pomodorozion` (`User`, `Task`, `Timer`)

## Qué piden RA6 y RA9

- **RA6**: uso de **ORM** (mapeo objeto-relacional) para persistir datos.
- **RA9**: desarrollo de **aplicaciones híbridas** (web + persistencia).

## Qué es un ORM y qué te ahorra

Un ORM mapea **clases ↔ tablas**. Antes escribías SQL a mano para cada operación; con
JPA describes la tabla con **anotaciones** y el framework genera el SQL.

```
@Entity class Task  ←→  tabla tasks
   id, title, done, user_id
```

## Las anotaciones que aparecen siempre

```java
@Entity                    // esta clase = una tabla
@Table(name = "tasks")     // nombre real de la tabla
public class Task {

    @Id                     // clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // autoincremental
    private Long id;

    private String title;
    private boolean done;
}
```

- `@Entity` = la clase se guarda como filas.
- `@Id` = la clave primaria. Sin ella, Hibernate no sabe qué fila es cuál.
- `@GeneratedValue` = la BD pone el id (autoincremental). Por eso en Java el `id` es
  `null` hasta que guardas, y **no** es `int` sino `Long` (envoltorio, para poder ser null).

## DTO: por qué no devuelves la entidad directamente

```java
public record TaskDTO(Long id, String title, boolean done) { }
```

Devolver la entidad tal cual es un error de seguridad, no solo de diseño:

- La entidad tiene el `passwordHash`. Si la serializas al JSON, **se filtra la contraseña**.
- Añadir un campo a la entidad cambia el contrato de la API sin que te des cuenta.
- El DTO es la "frontera": lo que entra y lo que sale, controlado.

> Regla: la entidad no sale de la capa de persistencia. Todo pasa por un DTO.

## La decisión: `Long userId` o `@ManyToOne`

En PomodoroZion se guarda solo el id:

```java
@Entity
public class Task {
    private Long id;
    private String title;
    private Long userId;    // solo el id, sin relación JPA
}
```

**Ventaja**: simple, sin joins implícitos, sin surprises de carga perezosa.
**Inconveniente**: no hay cascada automática. Si borras un usuario, sus tareas quedan
huérfanas y la integridad la tienes que garantizar **tú**, en código.

La alternativa:

```java
@ManyToOne
@JoinColumn(name = "user_id")
private User user;    // relación real
```

**Ventaja**: la BD pone la FK y puede poner `ON DELETE CASCADE`.
**Inconveniente**: tienes que unmanaged la carga perezosa (`fetch = LAZY`) o te salta
`LazyInitializationException`.

> No hay respuesta única. Lo que se mira en el examen es que **sepas explicar el
> intercambio**, no cuál de las dos es "la buena".

## `@Transactional` en una frase

```java
@Transactional
public void deleteAccount(Long userId) { ... }
```

Una transacción es un **bloque de trabajo atómico**: o se aplica todo, o nada.

- **Sin ella**, JPA lanza `No EntityManager with actual transaction available for current
  thread` y acabas con un 500 sin explicación.
- Con ella, si el paso 3 de 4 falla, los otros 3 **se deshacen**.

Ver más en `ut02/ra4-sesiones-auth.md`, donde es el corazón del reto del borrado.

## Configuración: H2 en local, Postgres en producción

```properties
# application.properties (local)
spring.datasource.url=jdbc:h2:file:./data/pomodorozion
spring.jpa.hibernate.ddl-auto=update
```

```properties
# application-prod.properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
```

- `ddl-auto=update` = Hibernate crea/ajusta las tablas solo. Cómodo en desarrollo,
  **nunca en producción** (en producción las migraciones son explícitas, con Flyway).
- `${DB_URL}` = **variable de entorno**. Las credenciales **jamás** en el repo. Render
  las defines en su panel y las inyecta al arrancar.

## Spring Data: métodos con nombre

No escribes SQL. El nombre del método **es** la consulta:

```java
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
```

Spring genera `SELECT ... WHERE user_id = ?` y `DELETE ... WHERE user_id = ?`. El prefijo
indica la operación (`find`, `delete`, `count`) y el resto son los filtros.

> El nombre tiene que ser **exacto**: `deleteByUserId` y no `deleteByUser_Id` o
> `borraPorUsuario`. Si te equivocas, no compila, no que funcione mal.

## Consultas que no salen del nombre

Cuando el nombre se queda corto, se usa `@Query`:

```java
@Query("select t from Task t where t.done = false and t.userId = ?1")
List<Task> pendientesDe(Long userId);
```

O JPQL con nombres de **propiedades Java** (`t.done`, no `t.done_column`). La alternativa
es SQL nativo con `@Query(nativeQuery = true)`, y ahí escribes los nombres de columnas
reales.

## Preguntas de repaso

1. ¿Qué problema resuelve un ORM? Pon el mapeo clase ↔ tabla.
2. ¿Qué pasa si una entidad no tiene `@Id`?
3. ¿Por qué `id` es `Long` y no `int`?
4. ¿Por qué no devuelves la entidad en la API? Nombra el riesgo de seguridad.
5. Compara `Long userId` con `@ManyToOne`: ventaja e inconveniente de cada uno.
6. ¿Qué es una transacción y qué garantiza `@Transactional`?
7. ¿Qué error da una operación JPA sin transacción abierta?
8. ¿Qué hace `ddl-auto=update` y por qué no se usa en producción?
9. ¿Por qué las credenciales van en variables de entorno?
10. ¿Cómo genera Spring Data el SQL de `deleteByUserId`? ¿Qué pasa si el nombre falla?
11. ¿Diferencia entre JPQL y SQL nativo?
