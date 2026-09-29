<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %> <%@
taglib uri="jakarta.tags.core" prefix="c" %> <%-- solo la version JSTL --%> <%@
taglib uri="jakarta.tags.functions" prefix="fn" %> <%-- solo la version JSTL
--%>
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title></title>
  </head>
  <body>
    <h1>Repintado del select multiple</h1>

    <form action="sandbox" method="post">
      <%-- según el servlet que hagas --%>

      <label for="nivel">Tu nivel actual</label>
      <select id="nivel" name="nivel" multiple>
        <% /* === AQUI, TU PARTE: version scriptlet === */ %>
      </select>

      <select id="nivel2" name="nivel" multiple>
        <% /* === AQUI, TU PARTE: version EL + JSTL === */ %>
      </select>

      <button type="submit">Enviar</button>
    </form>
  </body>
</html>
