// ============================================================
// Leccion02 — ¿Por qué return ( ... )?
// ============================================================
// Motivo: la "inserción automática de punto y coma" (ASI).
// JavaScript mete un ; donde cree que acaba una línea. Si escribes
// un return seguido de un salto de línea, JS lo corta ahí → la
// función devuelve undefined y el JSX de abajo no se pinta.
// Los ( ) le dicen a JS: "esto sigue en la línea de abajo".
// ============================================================

// === Componente que FUNCIONA: usa return ( ... ) ===
function VersionBuena() {
  return (
    <div className="resultado bien">
      ✓ return ( ... ) → devuelve el JSX que cuelga de los paréntesis.
    </div>
  )
}

export default function Leccion02() {
  return (
    <div>
      <h3>¿Cuál de las dos rompe?</h3>
      <VersionBuena />
      <div className="resultado mal">
        ✗ La que hace <code>return</code> + salto de línea sin ( ): el ; se
        mete detrás del return y la función devuelve <code>undefined</code>.
      </div>

      {/* ESTO NO SE PUEDE EJECUTAR, es el ejemplo del bug:
      function VersionRota() {
        return
          <div>Hola</div>     // ASI mete ; tras return → undefined ✗
      }
      */}

      <h3>El porqué en código</h3>
      <div className="codigo">{`return
  <div>Hola</div>              // ASI mete ; tras return → undefined ✗

return (
  <div>Hola</div>              // ( ) agrupa TODO como una expresión ✓
)

// En UNA sola línea ni harían falta paréntesis:
return <div>Hola</div>          // ✓`}</div>

      <p>
        Y un matiz con las arrow functions:
      </p>
      <div className="codigo">{`// Return IMPLÍCITO: la flecha devuelve sola lo de la derecha.
person => <li>...</li>

// Block body { }: ya no devuelve solo, el return lo escribes TÚ.
person => {
  return <li>...</li>          // si lo olvidas → nada se devuelve ✗
}`}</div>
    </div>
  )
}