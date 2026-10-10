// Barra de filtros reutilizable (se usa en el catálogo y en la administración):
// buscador por nombre, contador de resultados y chips de categoría con recuento.

// Chip individual de categoría; `count` es opcional y aparece junto a la etiqueta.
function CategoryChip({ active, count, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-xs px-sm py-xs rounded-full font-label-sm text-label-sm uppercase tracking-wide transition-all ${
        active
          ? "bg-primary-container text-on-primary font-bold"
          : "neu-button-raised text-secondary hover:text-primary"
      }`}
    >
      {label}
      {typeof count === "number" && (
        <span
          className={`text-[0.625rem] leading-none ${
            active ? "text-on-primary/80" : "text-secondary"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories = [],
  total = 0,
  resultCount = total,
  onClear,
  className = "",
}) {

  // Verifica si hay algún filtro activo (texto de búsqueda o categoría elegida).
  const hasFilters = Boolean(search.trim() || category);

  return (
    <div className={`flex flex-col gap-sm ${className}`}>
      <div className="flex flex-col sm:flex-row gap-sm sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Buscar productos por nombre</span>
          <span
            aria-hidden="true"
            className="material-symbols-outlined absolute inset-y-0 left-sm flex items-center leading-none text-secondary pointer-events-none"
          >
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por nombre..."
            className="neu-input neu-pressed w-full rounded-full bg-surface-container-low pl-10 pr-sm py-sm font-body-md text-body-md text-on-background"
          />
        </label>

        <div className="flex items-center gap-sm shrink-0">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
            {resultCount} / {total}
          </span>
          {hasFilters && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-xs px-sm py-xs rounded-full neu-button-raised text-secondary hover:text-primary transition-all font-label-sm text-label-sm uppercase tracking-wide"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-base">
                filter_alt_off
              </span>
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-xs">
        <CategoryChip
          label="Todas"
          count={total}
          active={category === ""}
          onClick={() => onCategoryChange("")}
        />
        {categories.map((option) => (
          <CategoryChip
            key={option.value}
            label={option.label}
            count={option.count}
            active={category === option.value}
            onClick={() => onCategoryChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductFilters;
