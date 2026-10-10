// Página de administración de productos. Permite buscar/filtrar, editar cada
// producto en un modal y eliminarlo tras una confirmación.

import { useState } from "react";
import ProductManageList from "../components/ProductManageList/ProductManageList";
import ProductEditModal from "../components/ProductEditModal/ProductEditModal";
import ProductFilters from "../components/ProductFilters/ProductFilters";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import OrdersList from "../components/OrdersList/OrdersList";
import { useProducts } from "../context/ProductContext";
import { useProductFilters } from "../hooks/useProductFilters";

const Manage = () => {
  const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();
  // Producto que se está editando, alta en curso y producto pendiente de confirmar borrado.
  const [editingProduct, setEditingProduct] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
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

  return (
    <div className="flex flex-col items-center py-md md:py-lg px-margin-mobile w-full">
        <h1 className="font-display-lg text-3xl md:text-display-lg text-on-background tracking-tight text-center">
            Gestión de productos
        </h1>
        <div className="flex flex-col gap-3 md:gap-4 mt-6 md:mt-8 w-full max-w-4xl">
            {/* Botón para dar de alta un producto nuevo */}
            <button
                type="button"
                onClick={() => setCreating(true)}
                className="flex items-center justify-center gap-xs self-stretch sm:self-end bg-primary-container text-on-primary font-bold py-sm px-md rounded-xl neu-raised neu-btn-active transition-all hover:bg-primary font-body-md text-body-md"
            >
                <span className="material-symbols-outlined">add</span>
                Añadir producto
            </button>

            {/* Controles de búsqueda y filtrado */}
            <ProductFilters
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
                categories={categories}
                total={total}
                resultCount={filtered.length}
                onClear={clear}
            />

            {/* Lista de productos o mensaje de "sin resultados" */}
            {loading ? (
                <p className="font-body-md text-body-md text-secondary py-lg text-center">
                    Cargando productos...
                </p>
            ) : error ? (
                <p className="font-body-md text-body-md text-error py-lg text-center">
                    {error}
                </p>
            ) : filtered.length === 0 ? (
                <p className="font-body-md text-body-md text-secondary py-lg text-center">
                    No se han encontrado productos que coincidan con la búsqueda.
                </p>
            ) : (
                filtered.map((product) => (
                    <ProductManageList
                        key={product.id}
                        product={product}
                        onEdit={(id) => setEditingProduct(products.find((p) => p.id === id))}
                        onDelete={(id) => setDeletingProduct(products.find((p) => p.id === id))}
                    />
                ))
            )}
        </div>

        {/* Pedidos cargados desde la API del back */}
        <section className="flex flex-col gap-3 md:gap-4 mt-10 w-full max-w-4xl">
            <h2 className="font-display-lg text-3xl md:text-display-lg text-on-background tracking-tight text-center">
                Pedidos
            </h2>
            <OrdersList />
        </section>

        {/* Modal de alta: crea un producto nuevo en el catálogo */}
        {creating && (
          <ProductEditModal
            product={{}}
            categories={categories}
            onClose={() => setCreating(false)}
            onSave={async (created) => {
              await createProduct(created);
              setCreating(false);
            }}
          />
        )}

        {/* Modal de edición: guarda los cambios en el catálogo */}
        {editingProduct && (
          <ProductEditModal
            product={editingProduct}
            categories={categories}
            onClose={() => setEditingProduct(null)}
            onSave={async (updated) => {
              await updateProduct(updated);
              setEditingProduct(null);
            }}
          />
        )}

        {/* Confirmación antes de eliminar un producto */}
        {deletingProduct && (
          <ConfirmModal
            title="Eliminar producto"
            description={`¿Seguro que quieres eliminar "${deletingProduct.title}"? Esta acción no se puede deshacer.`}
            confirmLabel="Eliminar"
            onCancel={() => setDeletingProduct(null)}
            onConfirm={async () => {
              await deleteProduct(deletingProduct.id);
              setDeletingProduct(null);
            }}
          />
        )}
    </div>
    );
};

export default Manage;
