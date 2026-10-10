// Capa de acceso a la API del back. Centraliza la URL base y las peticiones
// fetch que usan los contextos y componentes de la tienda.

// URL base de la API del back. Se define en Vercel con VITE_API_URL; sin ella,
// las peticiones son relativas (misma origen). En desarrollo local se usa el
// valor de .env.local.
const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

// Convierte el _id de MongoDB en un id normal para el resto de la app.
const withId = (item) => {
  const { _id, __v, ...rest } = item;
  return { ...rest, id: _id };
};

// Comprueba la respuesta y devuelve el JSON, o lanza el error que envía la API.
const parse = (response) =>
  response.ok
    ? response.json()
    : response.json().then((data) => {
        throw new Error(data.message || "Error de conexión con el servidor.");
      });

// --- Productos ---

// Lista todos los productos del catálogo.
export const getProducts = () =>
  fetch(`${API_URL}/products`)
    .then(parse)
    .then((products) => products.map(withId));

// Crea un producto nuevo.
export const createProduct = (data) =>
  fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(parse)
    .then(withId);

// Guarda los cambios de un producto existente.
export const updateProduct = (id, data) =>
  fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(parse)
    .then(withId);

// Elimina un producto por su id.
export const deleteProduct = (id) =>
  fetch(`${API_URL}/products/${id}`, { method: "DELETE" }).then(parse);

// --- Usuarios ---

// Crea una cuenta nueva a partir de los datos del formulario.
export const registerUser = (data) =>
  fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(parse)
    .then(withId);

// Inicia sesión comprobando email y contraseña.
export const loginUser = (email, password) =>
  fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then(parse)
    .then(withId);

// --- Pedidos ---

// Lista todos los pedidos (con usuario y productos ya rellenados).
export const getOrders = () =>
  fetch(`${API_URL}/orders`)
    .then(parse)
    .then((orders) => orders.map(withId));

// Crea un pedido nuevo a partir del carrito.
export const createOrder = (data) =>
  fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(parse)
    .then(withId);

// Elimina un pedido por su id.
export const deleteOrder = (id) =>
  fetch(`${API_URL}/orders/${id}`, { method: "DELETE" }).then(parse);
