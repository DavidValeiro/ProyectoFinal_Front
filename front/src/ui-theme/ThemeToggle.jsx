'use client';

import { useCallback, useEffect, useRef } from 'react'
import { useTheme } from './useTheme.js'

/**
 * Los view-transition-name deben ser únicos en el documento, así que sólo el
 * primer ThemeToggle montado los usa. Si hubiera dos, el navegador abortaría
 * la transición entera con "Unexpected duplicate view-transition-name".
 */
let namedInstances = 0

function SunGlyph() {
  return (
    <svg
      data-glyph="sun"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
      className="ui-theme-toggle__glyph size-3.5"
    >
      <circle cx="12" cy="12" r="4.1" />
      <path d="M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5" />
    </svg>
  )
}

function MoonGlyph() {
  return (
    <svg
      data-glyph="moon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="ui-theme-toggle__glyph size-3.5"
    >
      <path d="M20.4 14.6A8.6 8.6 0 0 1 9.4 3.6a8.6 8.6 0 1 0 11 11Z" />
    </svg>
  )
}

export function ThemeToggle({
  className,
  labels = { toDay: 'Cambiar a modo día', toNight: 'Cambiar a modo noche' },
  onThemeChange,
  ...rest
}) {
  const { isNight, toggleTheme } = useTheme()
  const buttonRef = useRef(null)

  useEffect(() => {
    const node = buttonRef.current
    if (!node || namedInstances > 0) return
    namedInstances += 1
    node.dataset.vtOwner = 'true'
    return () => {
      delete node.dataset.vtOwner
      namedInstances -= 1
    }
  }, [])

  const handleClick = useCallback(
    (event) => {
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      toggleTheme({
        // origin: de dónde sale el revelado circular.
        origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
        // prepare: sincrónico y antes del snapshot; así el "new" se captura
        // ya con la perilla en su sitio y el icono correcto. React lo
        // confirmará después, pero a esas alturas la transición está hecha.
        prepare: (next) => {
          button.dataset.night = String(next === 'night')
        },
      })
      onThemeChange?.()
    },
    [toggleTheme, onThemeChange],
  )

  return (
    <button
      ref={buttonRef}
      type="button"
      role="switch"
      aria-checked={isNight}
      aria-label={isNight ? labels.toDay : labels.toNight}
      onClick={handleClick}
      data-night={isNight}
      className={['ui-theme-toggle', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <span className="ui-theme-toggle__knob" aria-hidden="true">
        <SunGlyph />
        <MoonGlyph />
      </span>
      <span className="ui-theme-toggle__outer" aria-hidden="true">
        <SunGlyph />
        <MoonGlyph />
      </span>
    </button>
  )
}

export default ThemeToggle