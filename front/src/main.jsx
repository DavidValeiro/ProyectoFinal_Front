// Punto de entrada de la aplicación. Monta React en el div#root y envuelve
// todo con el ThemeProvider para habilitar el modo día/noche.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Hojas de estilo: base de la app, utilidades del tema y paleta propia de MOUSIN.
import './index.css'
import './ui-theme/theme.css'
import './theme/palette.css'
import App from './App.jsx'
import { ThemeProvider } from './ui-theme'

// El tema arranca en "night" para conservar el aspecto original de la tienda.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="night">
      <App />
    </ThemeProvider>
  </StrictMode>,
)
