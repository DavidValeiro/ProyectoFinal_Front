// Contexto de productos. Carga el catálogo desde la API del back y expone las
// operaciones de actualización y borrado que usa la página de administración.

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getProducts,
  createProduct as createProductRequest,
  updateProduct as updateProductRequest,
  deleteProduct as deleteProductRequest,
} from "../api/api";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Carga el catálogo al arrancar la app.
  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Crea un producto en la API y lo añade a la lista local.
  const createProduct = async (data) => {
    const saved = await createProductRequest(data);
    setProducts((prev) => [...prev, saved]);
    return saved;
  };

  // Guarda los cambios de un producto en la API y actualiza la lista local.
  const updateProduct = async (updated) => {
    const saved = await updateProductRequest(updated.id, updated);
    setProducts((prev) =>
      prev.map((product) => (product.id === saved.id ? saved : product))
    );
    return saved;
  };

  // Elimina un producto de la API y lo quita de la lista local.
  const deleteProduct = async (id) => {
    await deleteProductRequest(id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const value = useMemo(
    () => ({ products, loading, error, createProduct, updateProduct, deleteProduct }),
    [products, loading, error]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

// Hook de acceso al catálogo; lanza error si se usa fuera del provider.
export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
