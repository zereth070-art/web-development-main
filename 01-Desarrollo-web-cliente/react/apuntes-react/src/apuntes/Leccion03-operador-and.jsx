// ============================================================
// Leccion03 — Operador lógico && en JSX
// ============================================================
// a && b devuelve:
//   - si a es VERDADERO → b
//   - si a es FALSO     → a (y ni toca b)
// En JSX, {expresion} pinta lo que devuelva. false/null/undefined
// no se pintan, PERO el 0 sí. De ahí el error del "0 fantasma".
// ============================================================

import { useState } from 'react'

export default function Leccion03() {
  const [cantidad, setCantidad] = useState(0)

  return (
    <div>
      <h3>El "0 fantasma": el error típico</h3>
      <p>
        Sube y baja la cantidad con los botones. La primera línea usa{' '}
        <code>{'{cantidad && ...}'}</code> (MAL con números) y la segunda{' '}
        <code>{'{cantidad &gt; 0 && ...}'}</code> (BIEN).
      </p>

      <button className="caja" onClick={() => setCantidad(cantidad + 1)}>
        +1
      </button>{' '}
      <button className="caja" onClick={() => setCantidad(cantidad - 1)}>
        -1
      </button>{' '}
      <span>Cantidad: {cantidad}</span>

      {/* MAL: cantidad=0 → devuelve 0 → React PINTA un "0" suelto */}
      <div className="resultado mal">
        {'{cantidad && <p>...</p>}'} → con cantidad=0 muestra: <b>"0"</b>
      </div>

      {/* BIEN: cantidad>0 → con 0 es false → no pinta nada */}
      <div className="resultado bien">
        {'{cantidad > 0 && <p>...€...'} → con cantidad=0 no pinta nada ✓
        {cantidad > 0 && <p>Hay {cantidad} artículos en el carrito.</p>}
      </div>

      <h3>Con un booleano de verdad, && va bien</h3>
      <div className="codigo">{`{isLoggedIn && <AdminPanel />}     // true → pinta
                                  // false → false → React ignora ✓`}</div>

      <h3>Resumen-regla</h3>
      <div className="codigo">{`IZQUIERDA BOOLEANA (isLoggedIn, esAdmin)     → && ✅
IZQUIERDA NÚMERO/STRING (count, nombre)   → usa count > 0, !!count
                                            o ternario cond ? <A/> : null`}</div>
    </div>
  )
}