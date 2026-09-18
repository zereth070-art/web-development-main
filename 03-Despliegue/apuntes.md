# Apuntes: Despliegue (módulo 0614)

> Apuntes construidos a partir del despliegue real de **PomodoroZion**
> (Spring Boot + PostgreSQL) en **Render** con **Docker**.

## 1. Concepto de "desplegar"

Poner tu aplicación en **producción** para que cualquier persona por Internet pueda usarla.
Se diferencia de desarrollo y de staging:

- **Local (desarrollo):** la app corre solo en tu máquina, con datos de prueba.
- **Producción:** la app corre en un servidor siempre activo, con datos reales, accesible por URL.
- **Staging:** un entorno de pruebas intermedio, casi igual a producción, para probar antes de publicar.

## 2. Entornos y configuración (variables de entorno)

Una app debe poder cambiar de entorno **sin recompilar**. La forma estándar:
**los secretos y la configuración se pasan por variables de entorno** (en mi proyecto:
`SPRING_PROFILES_ACTIVE`, `DB_URL`, `DB_USER`, `DB_PASSWORD`).

- Los secretos (contraseñas, API keys) **nunca** van en el código ni en Git.
- En `application-prod.properties` uso `${DB_URL}`, `${DB_USER}`, `${DB_PASSWORD}` —
  Spring las lee del entorno del servidor.
- En local uso H2 de archivo; en producción PostgreSQL. Se cambia con un **perfil** (`prod`).

> Regla de oro: **no confiar en el usuario, no exponer secretos, configurar por entorno.**

## 3. Hosting y plataformas (Render)

PaaS ("Platform as a Service"): te facilita subir la app sin gestionar servidores.

- **Web Service** = mi app Spring (contenedor).
- **PostgreSQL** = mi base de datos en la nube.
- **Misma región** para que se conecten por red interna (en mi caso, Oregon).

Plan **Free**: la instancia se duerme por inactividad y tarda ~30-50s en "despertar".
Es un comportamiento esperado del plan gratuito, no un error.

## 4. Docker (contenedores)

Empaqueta la app (JAR + Java + configuración) en una **imagen** reproducible que
funciona igual en cualquier sitio.

### Dockerfile multi-stage (2 fases)

```
FASE 1 (build):  maven + java  -> compila el código y genera el JAR
FASE 2 (run):    solo java     -> imagen final pequeña, solo el JAR
```

```dockerfile
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests clean package

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

- `FROM ... AS build` -> da nombre a la primera fase.
- `COPY --from=build` -> copia el JAR de la fase 1 a la fase 2.
- `EXPOSE 8080` -> puerta HTTP (el puerto real lo asigna el servidor con `${PORT}`).
- `.dockerignore` -> excluye basura (`target/`, `data/`, `.git`) para una imagen ligera.

### Errores clásicos con Docker (los sufrimos)

- **Ruta `./scr` en vez de `./src`**: un typo rompe el build. Docker es estricto.
- **Nombre del archivo**: en Linux es `Dockerfile` (mayúscula). `dockerfile` no funciona allí.
- **Unicode/case**: el sistema de archivos de Linux distingue mayúsculas; Windows no.

## 5. Despliegue paso a paso (lo que hicimos)

1. Subir el código a GitHub (branch `main`).
2. Crear la **base de datos** PostgreSQL en Render (misma región).
3. Crear el **Web Service** apuntando al repo de GitHub.
   - **Root Directory**: `Aprender-DAW/10-Proyectos/pomodorozion` (código no está en la raíz).
   - **Runtime**: Docker (detecta el `Dockerfile`).
   - **Health Check Path**: `/api/health` (endpoint que vigila si está viva).
4. Configurar **variables de entorno** con los datos de la BD.
5. Deploy -> Render construye la imagen y la publica.
6. Probar en la URL asignada.

## 6. Logs

Los logs en Render se ven en la pestaña **"Logs"**. Son cruciales para depurar en producción:
- Errores de conexión a la BD/sm.
- Mensajes de arranque de Spring ("Started Application", "Tomcat started on port").
- Stacktraces.

## 7. CI/CD básico / Auto-Deploy

- **Auto-Deploy = On Commit**: cada push a GitHub despliega automáticamente.
- El flujo "integración continua" mínima: empujar código -> Render lo construye y publica.
- Los **tests** son la red de seguridad: antes de desplegar se comprueba que todo pasa.

## 8. Rotación de credenciales (seguridad)

Cuando una credencial se expone, se debe rotar:
- Se crea un **nuevo usuario** en la BD o se resetea la password.
- Se actualiza la variable de entorno (`DB_USER`, `DB_PASSWORD`).
- Se fuerza un nuevo deploy.
- Se revocan **API keys** que ya no se usan (higiene).

## 9. Checklist de producción (resumen)

- [x] App construida y probada localmente (tests verdes).
- [x] Base de datos remota creada y configurada.
- [x] Variables de entorno sin secretos hardcodeados.
- [x] Imagen Docker reproducible.
- [x] Health check configurado.
- [x] Auto-deploy desde Git.
- [x] Registro/login/tareas probados en producción.
- [ ] (Pendiente) Dominio propio.
- [ ] (Pendiente) HTTPS (Render lo trae por defecto en la URL gratuita).

## Dudas pendientes

- [ ] Investigar un servicio de email (SMTP) para "recuperar contraseña".

## Repaso

- [ ] Lo entiendo.
- [ ] Lo he practicado (despliegue real de PomodoroZion).
- [ ] Podría explicarlo a otra persona.


# APACHE2
si no tenemos enlace directo a norma, la norma no funciona
