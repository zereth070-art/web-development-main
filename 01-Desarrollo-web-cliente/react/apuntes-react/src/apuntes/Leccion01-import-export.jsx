// ============================================================
// Leccion01 — IMPORT / EXPORT
// ============================================================
// Aquí vemos en la práctica lo que hablamos:
//   - export default  = la exportación PRINCIPAL del fichero (1 sola).
//   - export named    = las SECUNDARIAS, con nombre fijo.
//   - Al importar: default sin llaves (nombre libre) · named entre { }.
// ============================================================

// (1) import DEFAULT → sin llaves, y renombrado a mi gusto.
//     Aquí lo pruebo con DOS alias distintos del mismo componente:
import TarjetaProducto from './ejemplos/TarjetaProducto.jsx'
import TarjetaRebautizada from './ejemplos/TarjetaProducto.jsx' // mismo fichero, otro nombre → legal

// (2) import NAMED → entre { } y con el nombre EXACTO del export.
//     Si escribo { formatearPrecio } no puedes llamarlo de otra forma.
import { IVA, formatearPrecio } from './ejemplos/TarjetaProducto.jsx'

// Un import default Y named del mismo fichero a la vez también vale:
// import Tarjeta, { IVA } from './ejemplos/TarjetaProducto.jsx'

export default function Leccion01() {
  return (
    <div>
      <h3>El mismo componente, dos nombres (default)</h3>
      <p>
        Las dos tarjetas de abajo son el <strong>mismo componente</strong> del
        mismo fichero, importado con alias distintos. El default te deja
        renombrar; solo lo usas si (1) chocan nombres o (2) quieres
        legibilidad. Lo normal: importar con el mismo nombre.
      </p>
      <TarjetaProducto nombre="Teclado mecánico" precio={39} />
      <TarjetaRebautizada nombre="Ratón inalámbrico" precio={19} />

      <h3>Named ({ } con nombre exacto)</h3>
      <p>
        IVA y formatearPrecio llegan con su nombre obligado. La función usa
        el const IVA internamente:
      </p>
      <div className="resultado">
        IVA actual: {(IVA * 100).toFixed(0)}% → {formatearPrecio(100)}
      </div>

      <h3>Código</h3>
      <div className="codigo">{`export default function TarjetaProducto() { ... }   // 1 principal
export const IVA = 0.21                              // named
export function formatearPrecio(p) { ... }           // named

// En otro fichero:
import AliasLibre from './TarjetaProducto'                 // default
import { IVA, formatearPrecio } from './TarjetaProducto'   // named`}</div>
    </div>
  )
}