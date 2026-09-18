<!--
  Created by IntelliJ IDEA.
  User: zeret
  Date: 17/09/2026
  Time: 17:07
  To change this template use File | Settings | File Templates.
-->
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
  <head><meta charset="UTF-8"><title>Demo init()</title></head>
  <body>
   <h1>¿Cuántas veces se llama a init()?</h1>

      <p><b>Hora de inicialización del Servlet:</b> ${horaInit}</p>
      <p><b>Petición número:</b> ${contador}</p>
      <p><b>Identificador de instancia (hashCode):</b> ${instancia}</p>

      <hr />
      <p>Recarga esta página (F5) varias veces:</p>
      <ul>
          <li>El contador atomico <p>${contadorPeticionesAtomic}</p> </li>
          <li>La <b>hora de inicialización</b> no cambia.</li>
          <li>El <b>identificador de instancia</b> tampoco.</li>
          <li>El <b>contador</b> sube en cada recarga.</li>
      </ul>
  </body>
</html>
