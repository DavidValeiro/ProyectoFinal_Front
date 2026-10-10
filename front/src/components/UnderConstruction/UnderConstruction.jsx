// Cartel de "sección en obras" reutilizable. Detecta la página actual por la
// ruta y la usa en el título; toda la tarjeta enlaza al catálogo.

import { Link, useLocation } from "react-router-dom";

// Nombres legibles de las rutas conocidas de la app.
const PAGE_NAMES = {
  "/": "Inicio",
  "/catalog": "Catálogo",
  "/manage": "Gestión de productos",
};

// Traduce la ruta actual a un nombre de página. Como respaldo usa el último
// segmento de la URL con la inicial en mayúscula.
function getPageName(pathname) {
  const normalized = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  if (PAGE_NAMES[normalized]) return PAGE_NAMES[normalized];
  if (normalized.startsWith("/producto")) return "Producto";
  const segment = normalized.split("/").filter(Boolean).pop();
  if (!segment) return "Inicio";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

function UnderConstruction({
  title,
  description = "Estamos trabajando en esta sección.",
  icon = "construction",
  statusLabel = "Próximamente",
  to = "/Catalog",
  ctaLabel = "Continúa explorando nuestro catálogo",
  className = "",
}) {
  const { pathname } = useLocation();
  // Título por defecto: "«Página actual» en obras" (se puede sobrescribir).
  const heading = title ?? `${getPageName(pathname)} en obras`;

  return (
    <Link
      to={to}
      className={`group relative overflow-hidden flex flex-col sm:flex-row sm:items-center gap-md rounded-2xl bg-surface-container-high px-md py-md md:px-lg md:py-lg neu-raised neu-card-hover w-full text-left ${className}`}
    >
      {/* Halo decorativo naranja en la esquina superior derecha */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-container/15 blur-3xl"
      />
      {/* Icono destacado de la sección */}
      <span
        aria-hidden="true"
        className="material-symbols-outlined relative grid h-12 w-12 md:h-14 md:w-14 shrink-0 place-items-center rounded-xl bg-primary-container text-on-primary text-2xl md:text-3xl neu-raised"
      >{icon}</span>
      <div className="relative flex flex-col gap-xs sm:flex-1 min-w-0">
        <p className="font-headline-md text-headline-md text-on-background">
          {heading}
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {description}
        </p>
        {/* Llamada a la acción; en móvil lleva su propia flecha pequeña */}
        <span className="inline-flex items-center gap-xs font-body-md text-body-md font-bold text-primary">
          {ctaLabel}
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1 sm:hidden"
          >arrow_forward</span>
        </span>
      </div>
      {/* Etiqueta de estado (solo en pantallas grandes) */}
      <span className="relative hidden sm:inline-flex shrink-0 items-center gap-xs rounded-full bg-surface-container px-sm py-xs font-label-sm text-label-sm uppercase tracking-widest text-primary neu-raised">
        <span aria-hidden="true" className="material-symbols-outlined text-base">schedule</span>
        {statusLabel}
      </span>
      {/* Flecha grande de navegación en escritorio, al extremo derecho */}
      <span
        aria-hidden="true"
        className="material-symbols-outlined relative hidden sm:grid h-12 w-12 md:h-14 md:w-14 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary text-2xl md:text-3xl neu-raised transition-transform duration-300 group-hover:translate-x-1"
      >arrow_forward</span>
    </Link>
  );
}

export default UnderConstruction;
