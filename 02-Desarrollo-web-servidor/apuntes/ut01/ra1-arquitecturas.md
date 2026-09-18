# UT01 · RA1 — Arquitecturas y herramientas de programación

## Qué pide el RA1

Seleccionar arquitecturas y tecnologías de programación en entorno servidor,
analizando sus capacidades y características.

## Modelo cliente/servidor (con pomodorozion)

```
Navegador ──HTTP──> Tomcat embebido (Spring Boot) ──JPA──> H2/PostgreSQL
```

- El **cliente** manda peticiones HTTP. El **servidor** las procesa y devuelve respuestas.
- Spring Boot trae un **servidor de aplicaciones embebido** (Tomcat): no hay que instalarlo aparte.
- **MVC en capas**: `Controller` → `Service` → `Repository`. Cada capa tiene un solo trabajo.
- El frontend (HTML/JS) vive en `resources/static/`; la lógica en el paquete de Java.

## El stack del ciclo (todo aplicado en pomodorozion)

| Herramienta | Para qué sirve | Dónde lo ves |
| --- | --- | --- |
| **Git / GitHub** | Control de versiones + remoto | Subir avances, trabajar en ramas, `.gitignore` |
| **Maven** | Build + dependencias | `pom.xml`, `mvnw`, ciclo `clean test package` |
| **Java 25** | Lenguaje del servidor | `.java` en `src/main/java` |
| **Spring Boot** | Framework web + seguridad + datos | Starters (`webmvc`, `security`, `data-jpa`) |
| **JUnit** | Pruebas | `src/test/java`, `mvnw test` |

## Preguntas típicas de examen de papel

- ¿Qué es una arquitectura cliente/servidor y en qué se diferencia de un modelo de escritorio?
- ¿Qué es un servidor de aplicaciones embebido? Ejemplo: Tomcat en Spring Boot.
- ¿Qué aporta Maven? Dos cosas: compilar/empaquetar/testear (build) y descargar/gestionar librerías (dependencias).
- ¿Por qué separar capas? Mantenibilidad y pruebas: cada capa cambia sin romper las otras.