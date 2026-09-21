<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Alta correcta</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #0E2438; color: #fff;
         display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
  .card { background: #fff; color: #0E2438; padding: 44px 40px; border-radius: 12px;
          text-align: center; max-width: 440px; box-shadow: 0 20px 50px rgba(0,0,0,.3); }
  .ok { color: #2E8B57; font-size: 2.2rem; }
  dl { text-align: left; margin-top: 20px; }
  dt { font-weight: bold; color: #55606B; font-size: .85rem; text-transform: uppercase; margin-top: 10px; }
  dd { margin: 2px 0 0; }
  a { display: inline-block; margin-top: 24px; color: #E8432A; font-weight: bold; text-decoration: none; }
</style>
</head>
<body>
  <div class="card">
    <div class="ok">&#10003;</div>
    <h1>¡Te has dado de alta correctamente, ${nombre}!</h1>

    <dl>
      <dt>Email</dt><dd>${email}</dd>
      <dt>Tecnología</dt><dd>${tecnologia}</dd>
      <dt>Nivel</dt><dd>${nivel}</dd>
    </dl>

    <a href="index.html">&larr; Volver al inicio</a>
  </div>
</body>
</html>