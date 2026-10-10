// Convierte un texto (por ejemplo el título de un producto) en una cadena
// válida para URL: sin acentos, en minúsculas y con guiones en vez de espacios.

export const toSlug = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
