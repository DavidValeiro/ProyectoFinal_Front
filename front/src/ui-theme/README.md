# ui-theme

Switch día/noche con revelado circular (View Transitions), respaldo en CSS y
**cero destellos** al recargar. Empaquetado como carpeta para copiar/pegar, sin
build ni dependencias nuevas: solo React 19.

Incluye:

- `ThemeProvider` — estado `<html data-theme>` + persistencia + View Transitions.
- `ThemeToggle` — el botón (perilla sol/luna animada, `role="switch"`).
- `useTheme` — `{ theme, isNight, setTheme, toggleTheme, resetTheme }`.
- `theme.css` — 9 tokens de color (`--ui-*`) registrados con `@property` para
  que el navegador interpole al cambiar de tema, los estilos del toggle y los
  keyframes. **No pinta `html`/`body` ni define utilidades**: eso lo decide tu
  app.
- `theme-init.js` — script anti-flash (`getInitScript`) de una sola fuente.
- `tailwind-tokens.css` — opcional, mapea los tokens a `bg-ui-surface` y amigos.
- Eso es todo. No hay `package.json`, node_modules, ni build.

---

## Instalación (3 pasos)

### 1. Copia la carpeta

`ui-theme/` → dentro de tu proyecto, p. ej. `src/ui-theme/`.

### 2. Importa el CSS

**Vite** (`src/main.jsx`):

```js
import './index.css'
import './ui-theme/theme.css'
```

**Next (App Router)** (`src/app/globals.css`, junto al `@import "tailwindcss"`):

```css
@import './ui-theme/theme.css';
```

> Si quieres las utilidades Tailwind (`bg-ui-surface`, `text-ui-accent`, …),
> importa también `tailwind-tokens.css` dentro de la misma hoja de globals.css.
> El host **no** necesita Tailwind para que el toggle funcione: usa CSS puro.

### 3. Monta provider + toggle

Los componentes traen su directiva `'use client'`; en Next puedes montarlos
directamente desde layouts y páginas server.

```jsx
import { ThemeProvider, ThemeToggle, useTheme } from './ui-theme'

// Vite: alrededor de <App /> en main.jsx
// Next (App Router) layout.js o providers: alrededor de {children}
<ThemeProvider>
  <App />
</ThemeProvider>

// En cualquier componente
<ThemeToggle />
```

## Anti-flash (no te saltes este paso)

La recarga en modo noche produce un destello blanco si el tema se resuelve en
React. El script inline se ejecuta en `<head>` antes del primer paint y lee la
**misma** clave de storage que el provider (constante compartida, no se
desincronizan).

**Vite** — `index.html`:

```html
<head>
  <script>
    (function(){try{var d=document.documentElement;var v=localStorage.getItem("ui-theme");var t=v==='day'||v==='night'?v:(matchMedia('(prefers-color-scheme: dark)').matches?'night':'day');d.setAttribute("data-theme",t);d.style.colorScheme=t}catch(e){}})()
  </script>
</head>
```

**Next (App Router)** — `app/layout.js`, patrón oficial de Next 16
(`preventing-flash-before-hydration`):

```jsx
import { themeInitScript } from './ui-theme'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="day" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

Si quieres una clave o atributo propios, pásalos a `getInitScript` **y** al
provider; el default de ambos sale de la misma constante.

---

## API

### `<ThemeProvider>`

| Prop               | Tipo      | Default      | Qué hace                                   |
| ------------------ | --------- | ------------ | ------------------------------------------ |
| `storageKey`       | `string`  | `'ui-theme'` | Clave de `localStorage`.                   |
| `attribute`        | `string`  | `'data-theme'`| Atributo escrito en `<html>`.              |
| `defaultTheme`     | `string`  | `'system'`   | `'day'` · `'night'` · `'system'`.          |
| `palette`          | `object`  | —            | `{ day: {...}, night: {...} }` colores que sobreescriben el CSS. |
| `enableTransition` | `boolean` | `true`       | `false` desactiva View Transitions.        |

### `useTheme()`

```js
const { theme, isNight, setTheme, toggleTheme, resetTheme } = useTheme()
```

- `setTheme('night' | 'day', options?)`
- `toggleTheme(options?)` — alterna.
- `resetTheme(options?)` — borra la clave y vuelve al default/sistema.
- `options = { origin: {x,y}, prepare(next) }` — origen del revelado circular
  y escrituras DOM síncronas antes del snapshot. Internos del toggle; rara vez
  los necesitas a mano.

### `<ThemeToggle>`

```jsx
<ThemeToggle
  className="..."
  labels={{ toDay: 'Cambiar a modo día', toNight: 'Cambiar a modo noche' }}
  onThemeChange={() => {}}
/>
```

Es un `<button role="switch">`: acepta props nativas (aria, `title`, `id`…).

### Cambiar la paleta

Dos vías equivalentes:

```jsx
// 1) Por prop (gana sobre el CSS, se aplica por inline style)
<ThemeProvider
  palette={{
    day:  { bg: '#faf9f7', text: '#1a1917', accent: '#b8752c' },
    night:{ bg: '#0e1016', text: '#edf0f5', accent: '#e2a55c' },
  }}
/>
```

```css
/* 2) Directamente en tu CSS, tras importar theme.css */
:root[data-theme='night'] {
  --ui-bg: #0e1016;
  --ui-accent: #38bdf8;
}
```

Los nombres de la prop `palette` se convierten a `--ui-<nombre>` (o respetan el
prefijo si ya lo llevan). La lista completa: `bg`, `surface`, `surface-2`,
`text`, `muted`, `line`, `accent`, `accent-soft`, `glow`.

---

## Notas de portabilidad

**Si tu app ya tiene dark mode** — hay dos estrategias:

- **Tienes tokens propios** (`--background`, Material 3, …): mapea los `--ui-*`
  a los tuyos en el paso "Cambiar la paleta" y `ThemeToggle` los conmutará.
- **Tienes `@media (prefers-color-scheme: dark)`** aplicando colores: quítalo —
  pelea con `data-theme`. El provider ya sigue al sistema hasta que el usuario
  elige (y `resetTheme` vuelve a ello).

**View Transitions ajenas** — todas las reglas `::view-transition-*` de este
paquete van colgadas de `html.vt-active` (clase que `ThemeProvider` añade solo
durante su transición), así que no secuestran las transiciones de tu app.
Si la tuya lanza sus propias `startViewTransition`, pasarás `enableTransition={false}`.

**Nombres únicos** — los `view-transition-name` (`ui-theme-knob`, `ui-theme-icon`)
los usa solo el primer `ThemeToggle` montado; un duplicado abortaría la
transición. El toggle se encarga de ello con un contador de instancias.

**Lo que NO hace** — no toca `html`/`body` (fondo, tipografía, márgenes), no
define utilidades como `.theme-title`, no monta layout. Es solo estado + un
botón + tokens.

## Fuente

Extraído de `../pruebaIA` (demo original Day/Night). Permanece intacto como
referencia.