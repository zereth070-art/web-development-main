import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import LoginRegistro from './Componentes/zonaCliente/login/LoginRegistro.jsx'
//import './index.css'
// import App from './App.jsx'
// punto de entrada principal para la app, sin esto todo react peta
createRoot(document.getElementById('root')).render(
//dice a react que monte la jerarquia(arbol) de componentes dentro del <div id='root'...>
  <StrictMode> 
    <LoginRegistro />
  </StrictMode>,
)

// StrictMode --> 1º componente a insertar en el <div..>
// App  ---> 2º componente a insertar en el <div>