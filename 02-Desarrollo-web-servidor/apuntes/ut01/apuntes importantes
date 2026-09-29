# Aclaración: ¿qué es Jakarta EE y quién hace cada cosa?

![alt text](image-6.png)

https://jakarta.ee/

## 1. ¿Qué es Jakarta EE?

- Es un conjunto de **especificaciones**: normas públicas y gratuitas.
- Dicen **cómo tiene que funcionar** cada tecnología Java para aplicaciones web y empresariales: Servlets, JSP, JSTL, etc.
- Funcionan como un **protocolo**: si todos siguen las mismas normas, todo encaja.
- Las gestiona la **Eclipse Foundation**.
  - Antes se llamaba **Java EE** y era de Oracle.
  - En 2017 Oracle la donó a Eclipse y pasó a llamarse **Jakarta EE**.
  - Por eso los paquetes cambiaron de `javax.*` a `jakarta.*`.

---

## 2. ¿Qué incluye cada especificación?

| Parte | Qué es | Ejemplo (Servlet) |
|---|---|---|
| **Documento** | Las normas escritas | «Un servlet tiene un ciclo de vida: `init` → `service` → `destroy`» |
| **API** | Paquetes, clases e interfaces Java que usamos al programar | `HttpServlet`, `HttpServletRequest`, `HttpServletResponse` |
| **TCK** | Pruebas para comprobar que un servidor cumple las normas | Si un servidor las pasa → es **compatible** |

---

## 3. La API de Jakarta: ¿quién la escribe?

- Cuando creas un proyecto **Jakarta EE 11** en IntelliJ, Maven descarga la API:

```xml
<dependency>
    <groupId>jakarta.platform</groupId>
    <artifactId>jakarta.jakartaee-api</artifactId>
    <version>11.0.0</version>
    <scope>provided</scope>
</dependency>
```

- Ese código lo escriben los **desarrolladores del proyecto Jakarta EE** (Eclipse Foundation):
  - En su mayoría son **ingenieros de empresas miembro**: Oracle, IBM, Red Hat, Payara, Fujitsu…
  - Y también **colaboradores independientes**.
- Es **código abierto** y está publicado en GitHub (`github.com/jakartaee`).


### ¿Por qué nuestro proyecto JakartaEE 11 creado automáticamente por IntelliJ incluye otra dependencia?

Revisa el pom.xml de tu proyecto de clase.

**¿Ves algo raro?**

![alt text](image-7.png)

---

## 4. Ojo: la API está casi «vacía»

- La mayor parte de la API son **interfaces**.
- Una interfaz **solo dice qué métodos deben existir**, pero **no tiene el código** que los hace funcionar.
- Es la forma de **obligar** a quien la implemente a cumplir la norma.

Ejemplo: en la API, `HttpServletRequest` es solo esto:

```java
public interface HttpServletRequest extends ServletRequest {
    String getParameter(String name);   // sin código dentro
    HttpSession getSession();           // sin código dentro
    // ...
}
```

| Tipo | Ejemplos | ¿Tiene código? |
|---|---|---|
| **Interfaces** (la mayoría) | `HttpServletRequest`, `HttpServletResponse`, `HttpSession` | ❌ No, solo la «norma» |
| **Clases de apoyo** (pocas) | `HttpServlet`, `Cookie`, `ServletException` | ✅ Sí, pero poca lógica |

---

## 5. Entonces, ¿quién implementa ese código?

➡️ **El servidor de aplicaciones** (Tomcat, GlassFish, WildFly…).

- El servidor tiene **sus propias clases** que implementan esas interfaces.
- Ahí está el **código real**: leer la petición HTTP, obtener los parámetros, gestionar sesiones, ejecutar servlets y JSP…

### Reparto de papeles

| Quién | Qué hace | Idea |
|---|---|---|
| **Eclipse Foundation** (proyecto Jakarta EE) | Escribe las normas y la API | El **QUÉ** |
| **Servidor** (p. ej. Tomcat, de Apache) | Implementa la API con código real | El **CÓMO** |
| **Nosotros** | Programamos usando la API | Nuestro código funciona en cualquier servidor compatible |

### ¿Por qué `<scope>provided</scope>`?

- La API de Eclipse solo se usa para **compilar**.
- Al **ejecutar**, es el servidor quien **proporciona** (*provides*) las clases.
- Por eso la API no se mete dentro de nuestro `.war`.

---

## 6. Tomcat

- Es de la **Apache Software Foundation**. Es **libre y de código abierto**.
- **No** implementa todo Jakarta EE. Es un **contenedor web** y solo incluye algunas especificaciones:
  - Servlet, JSP (Pages), Expression Language y WebSocket.
- **JSTL no viene incluido**: hay que añadirlo como dependencia del proyecto.

---

## 7. Otros servidores

| Servidor | Organización | Tipo |
|---|---|---|
| GlassFish | Eclipse Foundation | Libre (implementación de referencia) |
| WildFly | Red Hat | Libre (versión de pago con soporte: JBoss EAP) |
| Payara | Payara Services | Libre, con edición de pago |
| Open Liberty | IBM | Libre |
| WebLogic | Oracle | De pago, código cerrado |
| WebSphere (tradicional) | IBM | De pago, código cerrado |

