# Apuntes · Desarrollo web en servidor (DWES 0613)

Un fichero por **RA**, no un `apuntes.md` gigante. Cada uno se lee solo y acaba con
preguntas de repaso para repasar sin mirar.

## Por dónde va el temario

| UT | Contenido | Pesos | Apuntes |
| --- | --- | --- | --- |
| UT01 | Introducción: Git, Maven, Java, servlets | RA1+2+3 = 20% | ↓ abajo |
| UT02 (I) | Páginas dinámicas y MVC | RA5+8 = 24% | [`ut02/ra5-ra8-mvc-thymeleaf.md`](ut02/ra5-ra8-mvc-thymeleaf.md) |
| UT02 (II) | Sesiones y autenticación | RA4 = 12% | [`ut02/ra4-sesiones-auth.md`](ut02/ra4-sesiones-auth.md) |
| UT03 | Servicios web (REST, Swagger, JWT) | RA7 = 12% | [`ut03/ra7-servicios-web-rest.md`](ut03/ra7-servicios-web-rest.md) |
| UT04 | Persistencia e híbridas (JPA) | RA6+9 = 44% | [`ut04/ra6-ra9-persistencia-jpa.md`](ut04/ra6-ra9-persistencia-jpa.md) |

**9 RA independientes, media ≥ 5 cada una.** Fallas una y la nota trimestral es 4. No hay
compensar con el resto. Por eso los ficheros están separados por RA: sabrás exactamente
cuál te falta.

## UT01

| Apunte | Qué cubre |
| --- | --- |
| [`ut01/ra1-arquitecturas.md`](ut01/ra1-arquitecturas.md) | Cliente/servidor, Maven, capas, stack del ciclo |
| [`ut01/ra2-servlet-ciclo-vida.md`](ut01/ra2-servlet-ciclo-vida.md) | `init`/`doGet`/`destroy`, hilos, `forward` vs `redirect`, despliegue, **XSS** |
| [`ut01/ra2-ra3-jsp-jstl.md`](ut01/ra2-ra3-jsp-jstl.md) | Scriptlet vs EL vs JSTL, `c:forEach`, `c:out`, leer ficheros |

Prácticas: `practicas/ut01/jakartaServlet/` (InitDemoServlet, JakartaLogin) y
`practicas/ut01/thymeleaf-tareas/`.

## Cómo estudiar con esto

1. Lee **un** fichero, no todos. Cierra los demás.
2. Al final hay **preguntas de repaso**. Responde en voz alta y en blanco, sin mirar.
3. Lo que no sepas contestar, vuelve al apartado y léelo otra vez.
4. Explica el fichero entero a alguien (o en voz alta). Si te atascas, ese es el hueco.
5. Haz un reto: en `practicas/` siempre hay algo que hacer mejor.

> La regla del curso: **el que escribe el código aprende, el que solo lo lee, mira.**
> Los apuntes explican el POR QUÉ; el CÓMO lo escribes tú.

## Cross-references

- Servlet ↔ JSTL: [`ra2-servlet-ciclo-vida.md`](ut01/ra2-servlet-ciclo-vida.md) y
  [`ra2-ra3-jsp-jstl.md`](ut01/ra2-ra3-jsp-jstl.md) son la misma práctica.
- `@Transactional` aparece en [`ut02/ra4-sesiones-auth.md`](ut02/ra4-sesiones-auth.md) y se
  explica el porqué en [`ut04/ra6-ra9-persistencia-jpa.md`](ut04/ra6-ra9-persistencia-jpa.md).
- Sesión ↔ JWT: comparación en
  [`ut02/ra4-sesiones-auth.md`](ut02/ra4-sesiones-auth.md) y
  [`ut03/ra7-servicios-web-rest.md`](ut03/ra7-servicios-web-rest.md).
- El XSS de `<c:out>` (JSP) y `th:text` (Thymeleaf) es el mismo tema visto dos veces.
