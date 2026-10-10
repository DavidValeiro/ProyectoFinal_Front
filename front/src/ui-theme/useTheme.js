import { use } from 'react'
import { ThemeContext } from './ThemeProvider.jsx'

/**
 * Expone el estado del tema. Separado del provider para que el archivo de
 * componentes no mezcle exports (evita el aviso de only-export-components
 * en oxlint / eslint-plugin-react-refresh).
 */
export function useTheme() {
  const context = use(ThemeContext)
  if (!context) {
    throw new Error('useTheme() sólo puede usarse dentro de <ThemeProvider>')
  }
  return context
}