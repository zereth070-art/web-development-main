<%@ page contentType="text/html; charset=UTF-8" isErrorPage="true" language="java" %>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Error - JakartaLogin</title>
<style>
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: #0E2438;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
  }
  .card {
    background: #fff;
    color: #0E2438;
    padding: 44px 40px;
    border-radius: 12px;
    text-align: center;
    max-width: 480px;
    box-shadow: 0 20px 50px rgba(0,0,0,.3);
  }
  .code { font-size: 3rem; font-weight: bold; color: #E8432A; line-height: 1; }
  h1 { margin: 12px 0 8px; }
  p { color: #55606B; margin: 0; }
  dl { text-align: left; background: #F7F5F0; border-radius: 8px; padding: 16px 20px; margin-top: 20px; }
  dt { font-weight: bold; color: #55606B; font-size: .85rem; text-transform: uppercase; margin-top: 8px; }
  dd { margin: 2px 0 0; word-break: break-word; }
  a.boton {
    display: inline-block;
    margin-top: 24px;
    background: #E8432A;
    color: #fff;
    padding: 14px 32px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
  }
  a.boton:hover { background: #c93a22; }
</style>
</head>
<body>
  <div class="card">
    <div class="code">${requestScope['jakarta.servlet.error.status_code']}</div>
    <h1>Algo no ha ido bien</h1>
    <p>${requestScope['jakarta.servlet.error.message']}</p>

    <dl>
      <dt>Estado HTTP</dt>
      <dd>${requestScope['jakarta.servlet.error.status_code']}</dd>
      <dt>Origen</dt>
      <dd>${requestScope['jakarta.servlet.error.request_uri']}</dd>
      <dt>Detalle</dt>
      <dd>${requestScope['jakarta.servlet.error.exception_type'] != null ? requestScope['jakarta.servlet.error.exception_type'].simpleName : 'Sin detalles adicionales'}</dd>
    </dl>

    <a class="boton" href="${pageContext.request.contextPath}/">Volver al inicio</a>
  </div>
</body>
</html>