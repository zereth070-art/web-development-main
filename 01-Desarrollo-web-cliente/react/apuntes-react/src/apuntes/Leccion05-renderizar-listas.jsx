// ============================================================
// Leccion05 — RENDERIZAR LISTAS (react.dev/learn/rendering-lists)
// ============================================================
// Contenido clave de la página:
//   1. map()   → transforma cada dato en un elemento JSX.
//   2. filter()→ se queda solo con los que cumplen la condición.
//   3. key     → id único y ESTABLE por elemento (lo exige React).
// ============================================================

import { productos } from './ejemplos/datos-productos.js'

export default function Leccion05() {
  // filter(): me quedo solo con los que tienen stock (stock > 0).
  // Esto devuelve un array NUEVO, no toca el original.
  const enStock = productos.filter((producto) => producto.stock > 0)

  return (
    <div>
      <h3>1. map() + key — todos los productos</h3>
      {/* map() recibe cada producto y devuelve un <li>. Como el body no
          usa {}, el return es IMPLÍCITO (la flecha devuelve sola).
          key={producto.id}: id único y estable de los datos. */}
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} — {producto.precio}€ (stock {producto.stock})
          </li>
        ))}
      </ul>

      <h3>2. filter() + map() — solo con stock</h3>
      <p>
        Componemos los dos: <code>filter()</code> primero y <code>map()</code>{' '}
        después. Y dentro del item, <code>{'&&'}</code> pinta un detalle si
        aplica (lección 03).
      </p>
      <ul>
        {enStock.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} — {producto.precio}€
            {producto.stock > 0 && (
              <span style={{ color: '#4ade80' }}> (disponible)</span>
            )}
          </li>
        ))}
      </ul>

      <h3>3. Reglas de las key (importante para aprobar)</h3>
      <div className="codigo">{`// ✓ BIEN: id de la base de datos o crypto.randomUUID()
<li key={producto.id}>

// ✗ MAL: el índice de la array (si reordenas/borras, se lía)
<li key={index}>

// ✗ MAL: generarla al vuelo (reinventa todo en cada render)
<li key={Math.random()}>`}</div>
      <p>
        La key va sobre el elemento DENTRO del <code>map()</code> (en el{' '}
        <code>li</code> o en el componente extraído, nunca dentro de él), y
        <strong> no llega como prop</strong> al componente: es solo una pista
        para React. Si el componente necesita el id, pásalo aparte:
        <code>{' <Tarjeta key={id} id={id} />'}</code>.
      </p>

      <h3>4. Un solo componente por item (extraer)</h3>
      <p>
        Fíjate en cómo App.jsx hace exactamente esto: guarda las lecciones en
        un array y las pinta con <code>map()</code>. Cada <code>leccion</code>{' '}
        es un objeto con su <code>id</code> único → su key.
      </p>
      <div className="codigo">{`// Fragment con key (si el item son variós nodos DOM):
{productos.map((p) => (
  <Fragment key={p.id}>          // import { Fragment } from 'react'
    <h3>{p.nombre}</h3>
    <p>{p.precio}€</p>
  </Fragment>
))}`}</div>
    </div>
  )
}