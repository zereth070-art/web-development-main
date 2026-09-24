import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import LoginRegistro from './Componentes/zonaCliente/login/LoginRegistro.jsx'
import Layout from './Componentes/ZonaTienda/Layout/Layout.jsx'
import Home from './Componentes/ZonaTienda/Home/Home.jsx'
import ProductosCat from './Componentes/ZonaTienda/Productos/ProductosCat.jsx'
import NotFound from './Componentes/error/NotFound.jsx'

// configuracion del modulo de enrutamiento react-router:
// createBrowserRouter recibe un array de objetos ruta (path + element)
// las rutas hijas se renderizan dentro del <Outlet/> del componente padre (Layout)
const routerObjects = createBrowserRouter([
  {
    // layout principal y rutas hijas de la zona tienda
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'Productos', element: <ProductosCat /> },
    ],
  },
  // ruta de login y registro de clientes
  { path: '/Cliente/LoginRegistro', element: <LoginRegistro /> },
  // ruta comodin para paginas inexistentes (404)
  { path: '*', element: <NotFound /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routerObjects} />
  </StrictMode>,
)