# Select de nivel con scriptlet (experimento)

Código del usuario, guardado aparte. **No está en `formulario.jsp`** para poder probar
otras cosas sin que rompa la app.

## Cuándo quitarlo de aquí

Está aquí porque compila (devuelve 200). Si lo pones en `formulario.jsp` tal cual, esto es
lo que hay que tener en cuenta:

1. El cast debe ser a `List<String>`, no a `String[]`. El atributo `niveles` lo manda el
   servlet como `List` (`List.copyOf(...)` en `init()`), así que `(String[])` da
   `ClassCastException` → 500.
2. Los `<option>` fijos están **dentro** del `for`, así que salen 3 × 3 = 9 opciones.
3. `${'Principiante' == nivel}` **no marca nada**: EL no ve variables locales de scriptlet,
   solo atributos del `request`. Compila, pero el `selected` no funciona.

## El código

```jsp
<label for="nivel">Tu nivel actual</label>
      <select id="nivel" name="nivel" multiple>
        <%
        if(request.getAttribute("niveles") != null){
        java.util.List<String> niveles = (java.util.List<String>)request.getAttribute("niveles");
        for(String nivel: niveles) {
        %>
        <option value="Principiante" ${'Principiante' == nivel ? 'selected': ''}>Principiante</option>
        <option value="Intermedio" ${'Intermedio' == nivel ? 'selected' : ''}>Intermedio</option>
        <option value="Avanzado" ${'Avanzado' == nivel ? 'selected' : ''}>Avanzado</option>
        <% }
        } else {
        %>
        <option value="Principiante">Principiante</option>
        <option value="Intermedio">Intermedio</option>
        <option value="Avanzado">Avanzado</option>
        <% }
        %>
      </select>
```

## Los errores que dio la primera vez

Son los típicos de `<% %>`, por si te sirve para la práctica:

| Error | Causa |
| --- | --- |
| `Syntax error on token "="` | `getAttribute("niveles"=` con un `=` de más |
| `Invalid character constant` | `getAttribute('niveles')` con comillas **simples** |
| `insert "Finally" to complete TryStatement` | Una llave `}` de más al final |
| `Syntax error on token "}"` | Llaves sin cerrar dentro del `<% %>` |

> La llave de cierre `<% } %>` **no** lleva punto y coma. El `<%` de apertura tampoco.
