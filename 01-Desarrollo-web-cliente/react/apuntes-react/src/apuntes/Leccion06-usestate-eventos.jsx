// ============================================================
// Leccion06 — useState y eventos
// ============================================================
// Ideas:
//   - El estado ES del componente (useState).
//   - El botón NO trae la lógica: solo anuncia "me han clicado".
//   - El HANDLER (la función que hace el QUÉ) la defines arriba
//     y se la pasas al botón vía onClick. Nada de addEventListener.
//   - Ciclo: click → handler → setEstado → React vuelve a renderizar.
// ============================================================

import { useState } from 'react'

export default function Leccion06() {
  // --- Contador (state que es un número) ---
  const [contador, setContador] = useState(0)

  function sumar() {
    setContador(contador + 1)     // "dame el nuevo valor del estado"
  }

  function restar() {
    setContador(contador - 1)
  }

  function ponerACero() {
    setContador(0)
  }

  // --- Input controlado (state que es un string) ---
  const [nombre, setNombre] = useState('')

  // --- Toggle (state que es un booleano) ---
  const [encendida, setEncendida] = useState(true)

  return (
    <div>
      <h3>1. Contador — el handler se define ARRIBA y se pasa al botón</h3>
      <button className="caja" onClick={sumar}>+1</button>{' '}
      <button className="caja" onClick={restar}>-1</button>{' '}
      <button className="caja" onClick={ponerACero}>Cero</button>{' '}
      <strong>Contador: {contador}</strong>
      <p>
        <code>sumar</code>, <code>restar</code>, <code>ponerACero</code> son
        funciones normales: viven arriba, el botón no sabe lo que hacen, solo
        que <code>onClick</code> las invoca. Esto sustituye al{' '}
        <code>addEventListener</code> de vanilla JS.
      </p>

      <h3>2. Input controlado — el value viene del state</h3>
      <input
        value={nombre}                                    // el texto lo manda el state
        onChange={(evento) => setNombre(evento.target.value)}  // cada tecla actualiza
        placeholder="Escribe tu nombre"
      />
      <p>
        Tu nombre en MAYÚSCULAS: <strong>{nombre.toUpperCase() || '...'}</strong>
      </p>
      <p>
        Nada de leer el DOM ni <code>querySelector</code>: el input es un
        "espejo" del state. Al escribir, <code>onChange</code> dispara{' '}
        <code>setNombre</code> y React repinta la página entera.
      </p>

      <h3>3. Toggle — booleano + {`&&`} (enlaza con la lección 03)</h3>
      <button className="caja" onClick={() => setEncendida(!encendida)}>
        {encendida ? 'Apagar' : 'Encender'}
      </button>{' '}
      <span style={encendida ? { color: '#fbbf24' } : undefined}>
        {encendida ? '💡 Luz encendida' : 'Luz apagada'}
      </span>
      {encendida && <p style={{ color: '#fbbf24' }}>La bombilla está ON (&&)</p>}

      <h3>Recap del ciclo</h3>
      <div className="codigo">{`click                         pasas el handler
   ▼                              ▼
button onClick={sumar}  ········>  sumar()
                                    ▼
                            setContador(nuevoValor)
                                    ▼
                    React re-renderiza Contador con el nuevo state`}</div>
    </div>
  )
}