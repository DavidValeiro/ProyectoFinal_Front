'use client';

import { createContext, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { THEME_STORAGE_KEY, THEME_ATTRIBUTE, THEMES } from './theme-init.js'

/**
 * Hook isomórfico: useLayoutEffect en el cliente (re-sincroniza el DOM
 * antes del paint y sobrevive al remount de Strict Mode en Next dev),
 * useEffect en SSR para no producir warnings de hidratación.
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const ThemeContext = createContext(null)

const DARK_QUERY = '(prefers-color-scheme: dark)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function readStoredTheme(storageKey) {
  try {
    const value = window.localStorage.getItem(storageKey)
    return THEMES.includes(value) ? value : null
  } catch {
    return null
  }
}

function readSystemTheme() {
  return typeof window !== 'undefined' && window.matchMedia(DARK_QUERY).matches
    ? 'night'
    : 'day'
}

/** Guarda la elección del usuario para que sobreviva a futuras cargas. */
function persistTheme(storageKey, theme) {
  try {
    window.localStorage.setItem(storageKey, theme)
  } catch {
    /* ignorado (p.ej. navegación privada) */
  }
}

/** Convierte 'bg' → '--ui-bg' (o respeta un nombre que ya venga con prefijo). */
function toToken(name) {
  return name.startsWith('--') ? name : `--ui-${name}`
}

/**
 * Escribe el tema en <html> de forma imperativa: dentro del callback de
 * startViewTransition tiene que estar puesto antes de que el navegador
 * capture el snapshot, y un setState no llega a tiempo (react@19.3 ya no
 * exporta flushSync).
 */
function writeTheme(root, { theme, attribute }) {
  root.setAttribute(attribute, theme)
  root.style.colorScheme = theme
}

/** Aplica la paleta recibida por prop como estilos inline (ganan sobre el CSS). */
function applyPalette(root, palette, theme) {
  if (!palette?.[theme]) return
  for (const [name, value] of Object.entries(palette[theme])) {
    if (value == null) continue
    root.style.setProperty(toToken(name), value)
  }
}

/** Quita los estilos inline que aplicó la paleta. */
function clearPalette(root, palette, theme) {
  if (!palette?.[theme]) return
  for (const name of Object.keys(palette[theme])) {
    root.style.removeProperty(toToken(name))
  }
}

export function ThemeProvider({
  children,
  storageKey = THEME_STORAGE_KEY,
  attribute = THEME_ATTRIBUTE,
  defaultTheme = 'system',
  palette,
  enableTransition = true,
}) {
  const [theme, setTheme] = useState(() => {
    const stored = readStoredTheme(storageKey)
    if (stored) return stored
    return !defaultTheme || defaultTheme === 'system' ? readSystemTheme() : defaultTheme
  })

  // Mantiene el DOM sincronizado con el estado (montaje, StrictMode, HMR).
  // La paleta inline se aplica ANTES de escribir el tema, para que el primer
  // paint ya use los colores configurados.
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement
    applyPalette(root, palette, theme)
    writeTheme(root, { theme, attribute })
    return () => clearPalette(root, palette, theme)
  }, [theme, palette, attribute])

  // Mientras el usuario no elija nada, seguimos la preferencia del sistema.
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const onChange = (event) => {
      if (readStoredTheme(storageKey)) return
      setTheme(event.matches ? 'night' : 'day')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [storageKey])

  /**
   * @param next     tema destino ('day' | 'night')
   * @param options  { origin: {x, y} de donde sale el revelado circular;
   *                   prepare: escrituras DOM críticas para el snapshot }
   */
  const commit = useCallback(
    (next, options = {}) => {
      const root = document.documentElement
      const { origin, prepare } = options
      const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches
      const canTransition =
        enableTransition && typeof document.startViewTransition === 'function'

      const apply = () => {
        clearPalette(root, palette, theme)
        writeTheme(root, { theme: next, attribute })
        applyPalette(root, palette, next)
        prepare?.(next)
        setTheme(next)
      }

      if (reducedMotion || !canTransition) {
        apply()
        return
      }

      root.style.setProperty('--ui-vt-x', `${origin?.x ?? window.innerWidth / 2}px`)
      root.style.setProperty('--ui-vt-y', `${origin?.y ?? window.innerHeight / 2}px`)
      root.classList.add('vt-active')

      let transition
      try {
        transition = document.startViewTransition(apply)
      } catch {
        apply()
        root.classList.remove('vt-active')
        return
      }

      // .then(ok, ko) en lugar de .finally: si la promesa se rechaza, el
      // .finally devolvería otra promesa rechazada y sin capturar.
      const clear = () => root.classList.remove('vt-active')
      transition.finished.then(clear, clear)
    },
    [attribute, enableTransition, palette, theme],
  )

  const setThemeWithUI = useCallback(
    (next, options) => {
      const resolved = THEMES.includes(next) ? next : THEMES[0]
      persistTheme(storageKey, resolved)
      commit(resolved, options)
    },
    [commit, storageKey],
  )

  const toggleTheme = useCallback(
    (options) => {
      const next = theme === 'night' ? 'day' : 'night'
      persistTheme(storageKey, next)
      commit(next, options)
    },
    [commit, theme, storageKey],
  )

  const resetTheme = useCallback(
    (options) => {
      try {
        window.localStorage.removeItem(storageKey)
      } catch {
        /* ignorado */
      }
      commit(!defaultTheme || defaultTheme === 'system' ? readSystemTheme() : defaultTheme, options)
    },
    [commit, defaultTheme, storageKey],
  )

  const value = useMemo(
    () => ({
      theme,
      isNight: theme === 'night',
      setTheme: setThemeWithUI,
      toggleTheme,
      resetTheme,
    }),
    [theme, setThemeWithUI, toggleTheme, resetTheme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}