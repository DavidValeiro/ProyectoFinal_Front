// Página del catálogo. Muestra la cabecera informativa, la barra de filtros y
// la cuadrícula de tarjetas de producto (o un aviso si no hay resultados).

import ProductCard from "../components/ProductCard/ProductCard";
import ProductFilters from "../components/ProductFilters/ProductFilters";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { useProductFilters } from "../hooks/useProductFilters";

const Cataloge = () => {
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();
  // Estado de búsqueda/filtrado ya calculado por el hook.
  const {
    search,
    setSearch,
    category,
    setCategory,
    categories,
    filtered,
    total,
    clear,
  } = useProductFilters(products);

  // Metadatos de la página (título, descripción e imagen para compartir).
  usePageMeta({
    title: "Catálogo",
    description: `Explora los ${products.length} periféricos de MOUSIN: teclados mecánicos, ratones ópticos, mandos, audio de estudio y herramientas de escritorio con hardware de grado profesional.`,
    image: products[0]?.image,
  });

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-md md:py-lg">
      {/* Cabecera destacada con el resumen del catálogo y el total de productos */}
      <header className="mb-md md:mb-lg">
        <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center gap-md rounded-2xl bg-surface-container-high px-md py-md md:px-lg md:py-lg neu-raised">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-container/15 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="material-symbols-outlined relative grid h-12 w-12 md:h-14 md:w-14 shrink-0 place-items-center rounded-xl bg-primary-container text-on-primary text-2xl md:text-3xl neu-raised"
          >devices_other</span>
          <div className="relative flex flex-col gap-xs">
            <p className="font-headline-md text-headline-md text-on-background">
              Explora la selección de periféricos de MOUSIN
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Hardware de grado profesional.
            </p>
          </div>
          <span className="relative ml-auto hidden sm:inline-flex shrink-0 items-center gap-xs rounded-full bg-surface-container px-sm py-xs font-label-sm text-label-sm uppercase tracking-widest text-primary neu-raised">
            <span aria-hidden="true" className="material-symbols-outlined text-base">inventory_2</span>
            {total} productos
          </span>
        </div>
      </header>

      {/* Controles de búsqueda y filtrado */}
      <ProductFilters
        className="mb-lg"
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        total={total}
        resultCount={filtered.length}
        onClear={clear}
      />

      {/* Listado de productos o mensaje de "sin resultados" */}
      {loading ? (
        <p className="font-body-md text-body-md text-secondary py-xl text-center">
          Cargando productos...
        </p>
      ) : error ? (
        <p className="font-body-md text-body-md text-error py-xl text-center">
          {error}
        </p>
      ) : filtered.length === 0 ? (
        <p className="font-body-md text-body-md text-secondary py-xl text-center">
          No se han encontrado productos que coincidan con la búsqueda.
        </p>
      ) : (
        <section
          aria-label="Listado de productos"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md md:gap-lg"
        >
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </section>
      )}
    </main>
  );
};

export default Cataloge;
