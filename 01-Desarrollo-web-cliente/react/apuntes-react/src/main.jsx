// ============================================================
// main.jsx — PUERTA DE ENTRADA de la app React
// ============================================================
// Todo arranca aquí. main.jsx monta (renderiza) tu componente
// raíz dentro del <div id="root"> que hay en index.html.
//
// Ojo con los imports de este fichero:
//   - createRoot     → export NOMBRADO  (va entre llaves {})
//   - App            → export DEFAULT   (sin llaves, nombre libre)
// Es justo la pareja que vimos: {} = nombre exacto, sin llaves = libre.
// ============================================================

import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = createRoot(document.getElementById('root'))

root.render(
  <App />
  // React.StrictMode está intencionadamente fuera (sin él los ejemplos
  // de este proyecto se ven "dobles" en desarrollo). En apps reales
  // suélelo poner: <React.StrictMode><App/></React.StrictMode>
)