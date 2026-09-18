<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Formulario de alta</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #F7F5F0; color: #0E2438; }
  .form-card { max-width: 460px; margin: 60px auto; background: #fff; padding: 32px 36px;
               border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,.08); }
  label { display: block; font-weight: bold; margin: 16px 0 6px; }
  input, select { width: 100%; padding: 9px; border: 1px solid #ccc; border-radius: 6px;
                  box-sizing: border-box; font-size: 1rem; }
  button { margin-top: 24px; background: #E8432A; color: #fff; border: none; padding: 12px 28px;
           border-radius: 8px; font-weight: bold; cursor: pointer; }
  button:hover { background: #c93a22; }
</style>
</head>
<body>
  <div class="form-card">
    <h1>Formulario de alta</h1>
    <form action="alta" method="post">

      <label for="nombre">Nombre</label>
      <input type="text" id="nombre" name="nombre" required>

      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>

      <label for="tecnologia">Tecnología con la que más te gustaría trabajar</label>
      <select id="tecnologia" name="tecnologia">

            <option value=" "> </option>
      </select>

      <label for="nivel">Tu nivel actual</label>
      <select id="nivel" name="nivel">
        <option value="Principiante">Principiante</option>
        <option value="Intermedio">Intermedio</option>
        <option value="Avanzado">Avanzado</option>
      </select>

      <button type="submit">Enviar</button>
    </form>
  </div>
</body>
</html>