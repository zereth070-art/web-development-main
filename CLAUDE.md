# CLAUDE.md

## Propósito del repositorio

Este repositorio es mi workspace principal para estudiar 2º de DAW y desarrollar proyectos relacionados con desarrollo web.

No es un único proyecto de aplicación: contiene apuntes, prácticas, ejercicios, recursos, plantillas y proyectos integradores.

El objetivo general es aprender progresivamente a crear, probar, desplegar y mantener aplicaciones web completas.

## Estructura principal

* `01-Desarrollo-web-cliente/`

  * JavaScript
  * DOM
  * Fetch
  * React
  * Frontend
  * Apuntes y prácticas

* `02-Desarrollo-web-servidor/`

  * Backend
  * APIs REST
  * Servlets
  * Thymeleaf
  * Sesiones
  * Autenticación
  * Seguridad

* `03-Despliegue/`

  * Hosting
  * Docker
  * Servidores
  * Dominios
  * HTTPS
  * CI/CD

* `04-Diseno-interfaces-web/`

  * UX/UI
  * Responsive
  * Diseño visual
  * Accesibilidad

* `10-Proyectos/`

  * Proyectos integradores
  * Portfolio
  * Proyectos personales
  * `pomodorozion`
  * `web-alfacentauro-291`

* `11-Recursos/`

  * Documentación
  * Libros
  * Enlaces
  * Recursos de aprendizaje
  * Planificación de estudio

* `12-Plantillas/`

  * Plantillas para apuntes
  * Ejercicios
  * Proyectos

## Entorno

El README del repositorio establece como referencia:

* Node.js 20+
* npm
* JDK 25
* Apache Tomcat 11
* Maven Wrapper

Los proyectos Java utilizan sus propios wrappers (`mvnw` / `mvnw.cmd`), por lo que no es necesario asumir que Maven está instalado globalmente.

## Filosofía de trabajo

Este repositorio es principalmente educativo.

Cuando ayudes con ejercicios o prácticas, prioriza el aprendizaje sobre simplemente producir una solución.

Si estoy intentando aprender un concepto:

1. Explica qué problema resuelve.
2. Explica cómo funciona.
3. Muestra una solución razonable.
4. Explica las partes importantes.
5. Si tiene sentido, propón una pequeña modificación o ejercicio para comprobar que lo he entendido.

No conviertas ejercicios sencillos en arquitecturas innecesariamente complejas.

## Código existente

Antes de modificar código:

* Revisa la estructura existente.
* Comprueba cómo está implementada actualmente la funcionalidad.
* Respeta las convenciones utilizadas en ese proyecto.
* Evita introducir dependencias innecesarias.
* No reorganices archivos o carpetas sin una razón clara.
* No modifiques partes no relacionadas con la tarea.

Distingue entre una corrección necesaria y una mejora opcional.

Si encuentras una mala práctica, puedes señalarla, pero no la cambies automáticamente si no forma parte del objetivo de la tarea.

## Apuntes

Los apuntes forman parte del proceso de aprendizaje.

Cuando corrijas o amplíes apuntes:

* Mantén la estructura existente cuando sea razonable.
* Prioriza explicaciones claras y prácticas.
* Añade ejemplos pequeños.
* Evita llenar los apuntes de información que todavía no sea relevante para el nivel actual.
* Si detectas información incorrecta, señálala claramente.

## React / Vite

Los proyectos React utilizan Vite.

Antes de modificar un proyecto React, revisa su `package.json` para conocer exactamente sus dependencias y scripts.

No asumas que todos los proyectos React del repositorio utilizan exactamente la misma estructura.

En particular, existe un proyecto principal en:

`01-Desarrollo-web-cliente/react/PCCOMPONENTES`

y otro proyecto relacionado con apuntes en:

`01-Desarrollo-web-cliente/react/apuntes-react`

## Node.js

Hay proyectos que utilizan Node.js como parte del backend/frontend.

Revisa siempre `package.json` y la estructura del proyecto antes de asumir cómo se ejecuta.

No mezcles automáticamente la configuración de los diferentes proyectos Node.

## Java / Spring Boot

`10-Proyectos/pomodorozion` es un proyecto Spring Boot más completo que el resto del repositorio.

Utiliza Java 25 y contiene, entre otras cosas:

* Controllers
* Services
* Repositories
* DTOs
* entidades
* configuración de seguridad
* WebSockets
* tests

Cuando trabajes en este proyecto, respeta su arquitectura existente.

No simplifiques su estructura únicamente para hacer una respuesta más corta.

## Servlets / Tomcat

Los ejercicios de Servlets se ejecutan mediante Maven y pueden desplegarse como WAR en Tomcat.

No asumas que todos los proyectos de servidor utilizan Spring Boot.

Comprueba siempre el `pom.xml` y la estructura concreta del ejercicio.

## Proyectos personales

Los directorios dentro de `10-Proyectos` pueden tener objetivos y arquitecturas completamente diferentes.

Antes de trabajar en uno de ellos, identifica primero qué proyecto se está modificando.

Especialmente:

* `10-Proyectos/pomodorozion`
* `10-Proyectos/web-alfacentauro-291`

no deben tratarse como si fueran el mismo proyecto.

## Git

El repositorio utiliza Git y GitHub como sistema de control de versiones.

Cuando propongas cambios importantes, indica qué archivos deberían cambiar y por qué.

No borres ni sobrescribas trabajo existente sin comprobar primero su propósito.

No hagas commits automáticamente salvo que se solicite explícitamente.

## Cómo ayudarme

Quiero aprender desarrollo web de verdad, no simplemente conseguir que el código funcione.

Por tanto:

* Sé directo.
* Señala errores.
* Cuestiona decisiones técnicas cuando sea necesario.
* Explica el razonamiento detrás de las decisiones importantes.
* No me des la razón automáticamente.
* No inventes información sobre el proyecto.
* Si puedes comprobar algo en el repositorio, compruébalo antes de preguntarme.
* Si no tienes suficiente información, dilo.

Adapta la profundidad de la respuesta al problema.

Para un error sencillo, una solución sencilla.

Para una cuestión de arquitectura, una explicación más profunda.

Para una duda conceptual, prioriza que entienda el concepto.

## Regla fundamental

El repositorio es la fuente de verdad sobre su estado actual.

No asumas que una descripción anterior, una conversación pasada o una convención habitual coincide con el código actual.

Comprueba el código antes de afirmar cómo funciona una parte concreta del proyecto.
