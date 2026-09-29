<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Personajes de Springfield</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/estilos.css">
</head>
<body>
<h1>Personajes de Springfield</h1>

<form action="${pageContext.request.contextPath}/personajes" method="get">

    <fieldset>
        <legend>Filtrar</legend>

        <label>Lugar
            <select name="lugar">
                <option value="">— Todos —</option>
                <c:forEach var="l" items="${lugares}">
                    <option value="${l}" ${l == param.lugar ? 'selected' : ''}>${l}</option>
                </c:forEach>
            </select>
        </label>

        <label>Edad máxima
            <input type="number" name="edadMax" min="0" value="">
        </label>
    </fieldset>

    <fieldset>
        <legend>Ordenar</legend>

        <label>Ordenar por
            <select name="ordenarPor">
                <option value="nombre">Nombre</option>
                <option value="apellido">Apellido</option>
                <option value="edad">Edad</option>
            </select>
        </label>

        <label class="check">
            <input type="checkbox" name="descendente" >
            Descendente
        </label>

        <label>Mostrar como máximo
            <input type="number" name="limite" min="0" value="">
        </label>
    </fieldset>

    <button type="submit">Buscar</button>
    <a href="${pageContext.request.contextPath}/personajes">Limpiar filtros</a>
</form>

<p class="resumen"><strong> ${personajes.size()}</strong> personajes encontrados</p>

    <table>
        <thead>
        <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Ocupación</th>
            <th>Lugar</th>
        </tr>
        </thead>
        <tbody>
        <c:forEach var="p" items="${personajes}">
            <tr>
                <td>${p.nombre()}</td>
                <td>${p.edad()}</td>
                <td>${p.ocupacion()}</td>
                <td>${p.lugar()}</td>
                <td>${p.principal()}</td>
            </tr>
        </c:forEach>
        </tbody>
    </table>
</c:if>

</body>
</html>
