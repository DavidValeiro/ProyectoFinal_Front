// Contexto del carrito de la compra. Mantiene los artículos (persistidos en
// localStorage), controla la apertura del desplegable y expone la "señal"
// que usa la interfaz para animar/confirmar cada vez que se añade un producto.

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "buying-cart";
const ADD_FEEDBACK_MS = 2600;

const CartContext = createContext(null);

// Recupera el carrito guardado; ante cualquier error empieza vacío.
const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Persiste el carrito; si el almacenamiento falla, se conserva en memoria.
const writeStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Si el almacenamiento no está disponible, el carrito sigue en memoria.
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStorage);
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);
  const addSeq = useRef(0);

  // Cada cambio en los artículos se refleja en localStorage.
  useEffect(() => {
    writeStorage(items);
  }, [items]);

  // El aviso de "añadido al carrito" se oculta solo pasado un tiempo.
  useEffect(() => {
    if (!lastAdded) return;

    const timer = setTimeout(() => setLastAdded(null), ADD_FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [lastAdded]);

  // Añade un producto: incrementa la cantidad si ya existe o lo agrega nuevo,
  // y dispara la señal visual (lastAdded con un número de secuencia único).
  const addToCart = (product) => {
    addSeq.current += 1;
    setLastAdded({ seq: addSeq.current, product });

    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.title,
          price: product.price,
          qty: 1,
        },
      ];
    });
  };

  // Sube la cantidad de un artículo.
  const increment = (id) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );

  // Baja la cantidad y elimina el artículo si llega a cero.
  const decrement = (id) =>
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item
        )
        .filter((item) => item.qty > 0)
    );

  // Elimina un artículo del carrito.
  const remove = (id) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  // Vacía el carrito por completo (al completar una compra).
  const clearCart = () => setItems([]);

  const openCart = () => setOpen(true);

  const closeCart = () => setOpen(false);

  // Importe total teniendo en cuenta la cantidad de cada línea.
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      open,
      total,
      lastAdded,
      addToCart,
      increment,
      decrement,
      remove,
      clearCart,
      openCart,
      closeCart,
    }),
    [items, open, total, lastAdded]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook de acceso al carrito; lanza error si se usa fuera del provider.
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
