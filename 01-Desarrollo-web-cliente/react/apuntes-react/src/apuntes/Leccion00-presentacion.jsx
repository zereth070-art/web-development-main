// ============================================================
// Leccion00 — Introducción
// ============================================================
// Este proyecto es un "cuaderno de apuntes" hecho con React.
// Cada lección es un componente y cada una usa por lo menos un
// concepto de los que hemos ido viendo. Léete los comentarios
// de cada código: están puestos para estudiar.
// ============================================================

// export DEFAULT: este fichero entrega UN componente principal,
// y al importarlo puedes ponerle el nombre que quieras.
export default function Leccion00() {
  return (
    <div>
      <h3>¿Cómo usar este proyecto?</h3>
      <p>1. npm install · 2. npm run dev · 3. abrir http://localhost:5173</p>
      <p>
        El fichero <code>App.jsx</code> guarda un array de lecciones y las
        pinta con <code>map()</code> y <code>key</code>. Cada lección vive
        en su propio fichero y se importa con <code>export default</code>.
      </p>
      <p>
        Orden propuesto: 01 → 02 → 03 → 04 → 05. La 05 es lo que estás
        viendo ahora en react.dev/learn (Rendering Lists).
      </p>
    </div>
  )
}