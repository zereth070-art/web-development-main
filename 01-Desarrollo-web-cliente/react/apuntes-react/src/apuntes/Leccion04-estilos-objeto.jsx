// ============================================================
// Leccion04 — Estilos: ¿por qué doble { { } }?
// ============================================================
// Porque son DOS cosas distintas que usan el mismo símbolo:
//   - Par EXTERIOR { }  → sintaxis JSX: "aquí va una expresión".
//   - Par INTERIOR { }  → el "objeto" JavaScript con las propiedades.
// Una norma CSS es un objeto clave/valor; React la recibe como objeto.
// ============================================================

const estiloCaja = { border: '2px solid #38bdf8', borderRadius: '8px', fontSize: '1rem' }

export default function Leccion04() {
  return (
    <div>
      {/* Doble llave: expresión + objeto. Propiedades en camelCase. */}
      <div style={{ backgroundColor: '#0ea5e9', padding: '0.75rem 1rem', color: '#082f49' }}>
        Doble llave: expresión JSX + objeto. Propiedades en camelCase.
      </div>

      {/* Objeto creado FUERA → un solo {} JSX: */}
      <div style={estiloCaja} className="resultado">
        style={estiloCaja} → el objeto se define fuera, aquí solo { } de JSX
      </div>

      <div className="codigo">{`// El objeto es lo mismo en los dos casos:
//  style={{ backgroundColor: '#0ea5e9', padding: '0.75rem', color: '#082f49' }}

// En HTML sería:  style="background-color: ... ; padding ... ; color ..."
// En React, CSS se pasa como OBJETO y kebab-case → camelCase
// ( background-color  →  backgroundColor ).`}</div>

      <h3>CSS (norma) vs JS (objeto)</h3>
      <div className="codigo">{`/* CSS */
.caja {
  background-color: red;    // ; para separar, kebab-case, valor sin comillas
  font-size: 14px;
}

// JS (React)
const objeto = {
  backgroundColor: 'red',    // , para separar, camelCase, value con '' o número
  fontSize: '14px',
}`}</div>

      <h3>Regla memoria</h3>
      <div className="codigo">{`style={{ clave: 'valor' }}   → ` + '{{' + ' = "EXP De JSX" + Objeto'}</div>
    </div>
  )
}