# Aprender DAW

Directorio de estudio para aprender Desarrollo de Aplicaciones Web de forma ordenada.

## Cómo usar esta carpeta

1. Avanza módulo a módulo: `01-Desarrollo-web-cliente` y `02-Desarrollo-web-servidor` forman el núcleo; después pasa a `03-Despliegue` y `04-Diseno-interfaces-web`.
2. Guarda tus apuntes en cada carpeta.
3. Resuelve prácticas pequeñas antes de pasar a proyectos grandes.
4. Usa `10-Proyectos` para construir portfolio.
5. Apóyate en `11-Recursos` y en las plantillas de `12-Plantillas`.

## Estructura

- `01-Desarrollo-web-cliente`: JavaScript moderno, DOM, fetch, SPAs y frontend.
- `02-Desarrollo-web-servidor`: backend, APIs REST, sesiones, autenticación y seguridad.
- `03-Despliegue`: hosting, Docker, servidores, dominios, HTTPS y CI/CD.
- `04-Diseno-interfaces-web`: UX/UI, responsive, diseño visual y accesibilidad.
- `10-Proyectos`: proyectos integradores para practicar y crear portfolio.
- `11-Recursos`: enlaces, libros, canales, documentación y herramientas.
- `12-Plantillas`: plantillas reutilizables para apuntes, ejercicios y proyectos.

## Requisitos

- **Node.js 20+** e `npm` para los proyectos frontend (React/Vite).
- **JDK 17+** para las prácticas de servidor; `10-Proyectos/pomodorozion` usa **JDK 25** (`java.version=25` en su `pom.xml`).
- **Apache Tomcat 11** no está incluido en el repo: descárgalo en [tomcat.apache.org](https://tomcat.apache.org/) si vas a desplegar los WAR de servlets.
- Maven no hace falta instalarlo: los proyectos tienen wrapper (`mvnw` en Linux/macOS, `mvnw.cmd` en Windows). En Windows conviene tener `JAVA_HOME` apuntando al JDK.

## Puesta en marcha

### Frontend (Vite + React)

```bash
cd 01-Desarrollo-web-cliente/react/PCCOMPONENTES
npm install
npm run dev        # desarrollo  → http://localhost:5173
npm run build      # build de producción
```

### Backend Spring (pomodorozion)

```bash
cd 10-Proyectos/pomodorozion
./mvnw spring-boot:run            # Linux/macOS
mvnw.cmd spring-boot:run          # Windows
```

### Prácticas de servidor (servlets / Thymeleaf)

Cada proyecto tiene su propio `mvnw`. Para generar el WAR:

```bash
cd 02-Desarrollo-web-servidor/practicas/ut01/jakartaServlet/InitDemoServlet
./mvnw package
```

Copia el `*.war` de `target/` a `webapps/` de tu Tomcat o despliégalo con IntelliJ.

## Objetivo final

Terminar con una base sólida para crear, probar, desplegar y mantener aplicaciones web completas.
