// Panel desplegable del carrito. Lista los artículos añadidos y permite cambiar
// cantidades, eliminarlos y ver el total con la moneda activa.

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../api/api";
import CheckoutModal from "../CheckoutModal/CheckoutModal";

// Fila de un artículo del carrito: nombre, precio unitario, cantidad y subtotal.
function CartRow({ item, onIncrement, onDecrement, onRemove }) {
  const { format } = useCurrency();

  return (
    <li className="buying-row neu-flat rounded-xl px-margin-mobile py-md flex flex-col gap-sm">
      <div className="flex items-center justify-between gap-md">
        <span className="font-body-md text-body-md text-on-background flex-1 min-w-0 truncate">
          {item.name}
        </span>
        {/* Quitar el artículo del carrito */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="material-symbols-outlined text-secondary hover:text-error transition-all p-base shrink-0"
          aria-label={`Remove ${item.name}`}
        >
          delete
        </button>
      </div>

      <div className="flex items-center justify-between gap-md">
        {/* Precio unitario */}
        <span className="font-label-sm text-label-sm text-secondary uppercase shrink-0">
          {format(item.price)}
        </span>

        {/* Control de cantidad: menos / valor / más */}
        <div className="flex items-center neu-pressed rounded-full shrink-0">
          <button
            type="button"
            onClick={() => onDecrement(item.id)}
            className="material-symbols-outlined text-secondary hover:text-primary transition-all px-sm py-sm"
            aria-label={`Decrease quantity of ${item.name}`}
          >
            remove
          </button>
          <span className="font-body-md text-body-md text-on-background min-w-6 text-center">
            {item.qty}
          </span>
          <button
            type="button"
            onClick={() => onIncrement(item.id)}
            className="material-symbols-outlined text-secondary hover:text-primary transition-all px-sm py-sm"
            aria-label={`Increase quantity of ${item.name}`}
          >
            add
          </button>
        </div>

        {/* Subtotal de la línea */}
        <span className="font-body-md text-body-md text-primary shrink-0">
          {format(item.price * item.qty)}
        </span>
      </div>
    </li>
  );
}

function Buying({ showOverlay = false }) {
  const {
    open,
    closeCart,
    items,
    increment,
    decrement,
    remove,
    clearCart,
    total,
  } = useCart();
  const { format } = useCurrency();
  const { user } = useAuth();
  // Estado del proceso de compra: visibilidad del modal, envío y errores.
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // "Comprar": si hay sesión abre el modal; si no, avisa en el propio carrito.
  const openCheckout = () => {
    if (!user) {
      setCheckoutError("Inicia sesión para completar la compra.");
      return;
    }
    setCheckoutError("");
    setCheckoutOpen(true);
  };

  // Crea el pedido con el usuario actual y los artículos del carrito.
  const confirmCheckout = async () => {
    setCheckoutError("");

    if (!user) {
      setCheckoutError("Inicia sesión para completar la compra.");
      return;
    }

    setCheckoutLoading(true);

    try {
      await createOrder({
        user: user.id,
        products: items.map((item) => ({
          product: item.id,
          quantity: item.qty,
        })),
      });
      setCheckoutOpen(false);
      clearCart();
      closeCart();
    } catch (err) {
      setCheckoutError(err.message || "No se ha podido completar la compra.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      {/* Fondo para cerrar el carrito al pulsar fuera. En pantallas pequeñas con
          overlay difuminado; en el resto, una capa invisible. */}
      {showOverlay ? (
        <div
          aria-hidden="true"
          onClick={closeCart}
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      ) : (
        open && (
          <div aria-hidden="true" onClick={closeCart} className="fixed inset-0 z-40" />
        )
      )}

      <div
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute top-full right-0 mt-2.5 z-50 flex flex-col overflow-hidden rounded-2xl w-[min(22rem,calc(100vw-1.5rem))] max-h-[calc(100dvh-6rem)] bg-surface-container border border-surface-variant/30 neu-elevated transition-all duration-300 ease-out origin-top-right motion-reduce:transition-none max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:top-[4.5rem] max-sm:mt-0 max-sm:w-[calc(100vw-1.5rem)] ${
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        {/* Pico que conecta el panel con el botón (oculto en móvil) */}
        <span
          aria-hidden="true"
          className="absolute -top-1.5 right-5 h-3 w-3 rotate-45 rounded-[2px] bg-surface-container border-l border-t border-surface-variant/40 max-sm:hidden"
        />

        {/* Cabecera del carrito con el recuento de artículos */}
        <header className="flex items-center justify-between px-margin-mobile py-md border-b border-surface-variant/40">
          <div className="flex items-center space-x-sm">
            <span className="material-symbols-outlined text-primary">
              shopping_cart
            </span>
            <p className="font-headline-md text-headline-md text-on-background">
              Carrito
            </p>
            {items.length > 0 && (
              <span className="font-label-sm text-label-sm text-on-primary bg-primary-container rounded-full px-sm py-xs">
                {items.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="material-symbols-outlined text-secondary hover:text-primary transition-all p-base neu-button-raised rounded-full"
            aria-label="Close shopping cart"
          >
            close
          </button>
        </header>

        {/* Carrito vacío o listado de artículos + resumen */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-md px-margin-mobile py-lg text-center">
            <span className="material-symbols-outlined text-secondary text-5xl">
              shopping_basket
            </span>
            <p className="font-body-md text-body-md text-secondary">
              Tu carrito está vacío.
            </p>
          </div>
        ) : (
          <>
            {/* Lista desplazable de artículos */}
            <ul className="flex-1 overflow-y-auto px-margin-mobile py-md space-y-md max-h-[60dvh]">
              {items.map((item) => (
                <CartRow
                  key={item.id}
                  item={item}
                  onIncrement={increment}
                  onDecrement={decrement}
                  onRemove={remove}
                />
              ))}
            </ul>

            {/* Pie con el total y el botón de compra */}
            <footer className="border-t border-surface-variant/40 px-margin-mobile py-md flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md text-secondary">
                  Total
                </span>
                <span className="font-display-lg text-display-lg text-primary font-bold">
                  {format(total)}
                </span>
              </div>
              {/* Aviso de error al completar la compra */}
              {checkoutError && (
                <p className="font-body-md text-body-md text-error text-center">
                  {checkoutError}
                </p>
              )}
              <button
                type="button"
                onClick={openCheckout}
                className="font-body-md text-body-md text-on-primary bg-primary-container hover:bg-primary-fixed-dim transition-all py-md rounded-full flex items-center justify-center gap-xs uppercase tracking-wider font-bold"
              >
                <span aria-hidden="true" className="material-symbols-outlined">
                  shopping_cart
                </span>
                <span>Comprar</span>
              </button>
            </footer>
          </>
        )}
      </div>

      {/* Modal de confirmación del pedido, tras pulsar "Comprar" */}
      {checkoutOpen && (
        <CheckoutModal
          items={items}
          total={total}
          error={checkoutError}
          loading={checkoutLoading}
          onConfirm={confirmCheckout}
          onCancel={() => setCheckoutOpen(false)}
        />
      )}
    </>
  );
}

export default Buying;