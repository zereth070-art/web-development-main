// ============================================================
// ejemplos/TarjetaProducto.jsx — fichero DEMO para Lección 01
// ============================================================
// Este fichero mezcla los DOS tipos de export a propósito:
//
//   export default TarjetaProducto   → LA PRINCIPAL (1 sola por fichero)
//   export const IVA / formatearPrecio → SECUNDARIAS (named, varias)
//
// Reglas que viste:
//   default  → al importar: sin llaves, con el nombre que tú quieras.
//   named    → al importar: entre {} y con el nombre EXACTO.
// ============================================================

// export default puede ir delante de function o al final de la línea 16.
export default function TarjetaProducto({ nombre, precio }) {
  return (
    <div className="resultado">
      <strong>{nombre}</strong> — {formatearPrecio(precio)}
    </div>
  )
}

// --- export "named" (secundarias, con nombre fijo) ---

// Un "constante" exportada con nombre. Al importar: { IVA }
export const IVA = 0.21

// Una función exportada con nombre. Al importar: { formatearPrecio }
export function formatearPrecio(precio) {
  return `${(precio * (1 + IVA)).toFixed(2)} € (IVA incl.)`
}