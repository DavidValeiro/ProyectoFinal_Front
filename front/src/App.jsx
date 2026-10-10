// Define las rutas de la app y agrupa los providers globales (autenticación,
// moneda, productos y carrito) que necesita el árbol de componentes.

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './components/Layout/Layout'
import Catalog from './pages/Catalog'
import Manage from './pages/Manage'
import Home from './pages/Home'
import ProductDetail from './components/ProductDetail/ProductDetail'
import RequireAdmin from './components/RequireAdmin/RequireAdmin'
import {CartProvider} from './context/CartContext'
import {ProductProvider} from './context/ProductContext'
import {CurrencyProvider} from './context/CurrencyContext'
import {AuthProvider} from './context/AuthContext'

// Tabla de rutas: todas cuelgan del Layout común (cabecera + contenido + pie).
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/Catalog", element: <Catalog /> },
      { path: "/Producto/:slug", element: <ProductDetail /> },
      { path: "/Manage", element: (<RequireAdmin><Manage /></RequireAdmin>) },
    ],
  },
])

// El orden importa: el carrito consume productos y moneda, así que estos van por fuera.
function App() {
  return (
    <AuthProvider>
    <CurrencyProvider>
    <ProductProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ProductProvider>
    </CurrencyProvider>
    </AuthProvider>
  )
}

export default App
