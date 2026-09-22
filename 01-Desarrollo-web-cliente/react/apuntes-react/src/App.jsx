// ============================================================
// App.jsx — el componente RAÍZ del proyecto-apuntes
// ============================================================
// Fíjate en este fichero porque él MISMO es un ejemplo:
//   - Import contactos de cada lección con import default (sin {}).
//   - Renderiza una lista de lecciones usando map() + key (Lección 05).
//   - Usa devolver con return ( ... ) (Lección 02).
// ============================================================

// Import default: sin llaves, y MIROS eliges el nombre.
// De hecho, para demostrarlo, le pongo a "Leccion00" otro nombre
// (Presentacion) solo para que veas que funciona igual.
import Presentacion from './apuntes/Leccion00-presentacion.jsx'
import Leccion01 from './apuntes/Leccion01-import-export.jsx'
import Leccion02 from './apuntes/Leccion02-parentesis-return.jsx'
import Leccion03 from './apuntes/Leccion03-operador-and.jsx'
import Leccion04 from './apuntes/Leccion04-estilos-objeto.jsx'
import Leccion05 from './apuntes/Leccion05-renderizar-listas.jsx'
import Leccion06 from './apuntes/Leccion06-usestate-eventos.jsx'

// Los datos de las lecciones: cada una es un objeto con id, título y
// el componente que la dibuja. La lista de buenas te dirá por qué
// cada <Leccion/> lleva key={leccion.id} (mirar Lección 05).
const lecciones = [
  { id: 'l00', titulo: 'Introducción', Leccion: Presentacion },
  { id: 'l01', titulo: 'Import / Export', Leccion: Leccion01 },
  { id: 'l02', titulo: 'return ( ) en JSX', Leccion: Leccion02 },
  { id: 'l03', titulo: 'Operador &&', Leccion: Leccion03 },
  { id: 'l04', titulo: 'Estilos { { } }', Leccion: Leccion04 },
  { id: 'l05', titulo: 'Renderizar listas', Leccion: Leccion05 },
  { id: 'l06', titulo: 'useState y eventos', Leccion: Leccion06 },
]

export default function App() {
  return (
    <div className="app">
      <h1 className="titulo-app">Apuntes React</h1>
      <p className="subtitulo-app">
        Conceptos de react.dev/learn explicados y comentados en código.
      </p>

      {/* Índice rápido de la lista: también es un map() con key */}
      <ul className="indice">
        {lecciones.map((leccion) => (
          <li key={leccion.id}>
            <a href={'#' + leccion.id}>{leccion.titulo}</a>
          </li>
        ))}
      </ul>

      {/* Render de cada lección: map() + key. Cada una es un componente. */}
      {lecciones.map((leccion) => {
        // Block body de arrow function => FALTA el return y esto
        // no devuelve nada (pruébalo borrándole el return).
        return (
          <section id={leccion.id} key={leccion.id} className="tarjeta">
            <h2>{leccion.titulo}</h2>
            <leccion.Leccion />
          </section>
        )
      })}
    </div>
  )
}