/**
 * Constantes compartidas por el provider y el script anti-flash.
 * Cambia THEME_STORAGE_KEY aquí si quieres una clave propia; provider e
 * init script la leerán de este mismo sitio, así es imposible que se
 * desincronicen.
 */
export const THEME_STORAGE_KEY = 'ui-theme'
export const THEME_ATTRIBUTE = 'data-theme'
export const THEMES = ['day', 'night']

function jsString(value) {
  return JSON.stringify(value)
}

/**
 * Devuelve el script inline anti-flash como string.
 *
 * Se resuelve el tema antes del primer paint: evita el destello blanco al
 * recargar en modo noche. Debe ejecutarse en <head>, sin defer.
 *
 * - Vite: pégalo dentro de <script> en index.html.
 * - Next (App Router) layout.js:
 *     <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
 * - Añade también suppressHydrationWarning a <html> y el atributo por
 *   defecto (data-theme="system") para que el SSR y el script coincidan.
 *
 * Los parámetros sólo son necesarios si el <ThemeProvider> se monta con
 * props distintas a las de por defecto.
 */
export function getInitScript({
  storageKey = THEME_STORAGE_KEY,
  attribute = THEME_ATTRIBUTE,
  defaultTheme = 'system',
} = {}) {
  const resolved = THEMES.includes(defaultTheme) ? defaultTheme : 'system'
  return `(function(){try{var d=document.documentElement;var v=localStorage.getItem(${jsString(storageKey)});var t=v==='day'||v==='night'?v:(${jsString(resolved)}==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'night':'day'):${jsString(resolved)});d.setAttribute(${jsString(attribute)},t);d.style.colorScheme=t}catch(e){}})()`
}

/** Conveniencia: script por defecto, listo para pegar en <head>. */
export const themeInitScript = getInitScript()