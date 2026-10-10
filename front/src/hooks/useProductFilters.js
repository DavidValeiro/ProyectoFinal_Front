// Hook reutilizable que gestiona la búsqueda por nombre y el filtrado por
// categoría del listado de productos, devolviendo listas ya calculadas.

import { useMemo, useState } from "react";

// Normaliza un texto para comparar: quita acentos, pasa a minúsculas y recorta.
const normalize = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export function useProductFilters(products) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Calcula las categorías disponibles y cuántos productos tiene cada una.
  // La etiqueta visible es la parte posterior a la barra ("Periféricos / Ratones").
  const categories = useMemo(() => {
    const counts = new Map();
    for (const product of products) {
      if (!product.category) continue;
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    }
    return Array.from(counts, ([value, count]) => ({
      value,
      count,
      label: value.split("/").pop().trim(),
    })).sort((a, b) => a.label.localeCompare(b.label, "es"));
  }, [products]);

  // Aplica el filtro de categoría y la búsqueda por título en tiempo real.
  const filtered = useMemo(() => {
    const query = normalize(search);
    return products.filter((product) => {
      if (category && product.category !== category) return false;
      if (!query) return true;
      return normalize(product.title).includes(query);
    });
  }, [products, search, category]);

  // Restablece búsqueda y categoría de una sola vez.
  const clear = () => {
    setSearch("");
    setCategory("");
  };

  return {
    search,
    setSearch,
    category,
    setCategory,
    categories,
    filtered,
    total: products.length,
    hasFilters: Boolean(search.trim() || category),
    clear,
  };
}
