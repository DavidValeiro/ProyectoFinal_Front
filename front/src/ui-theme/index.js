export { ThemeProvider, ThemeContext } from './ThemeProvider.jsx'
export { useTheme } from './useTheme.js'
export { ThemeToggle, ThemeToggle as default } from './ThemeToggle.jsx'
export { THEME_STORAGE_KEY, THEME_ATTRIBUTE, THEMES, getInitScript, themeInitScript } from './theme-init.js'

/**
 * CSS: importa './theme.css' en tu entry (main.jsx / globals.css).
 * Tailwind: si quieres utilidades como bg-ui-surface, importa además
 * './tailwind-tokens.css' dentro de un archivo que Tailwind procese
 * (tiene que estar en una hoja con @import "tailwindcss" ya cargado).
 */