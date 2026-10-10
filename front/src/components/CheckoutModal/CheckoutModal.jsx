// Modal de confirmación de compra. Muestra el resumen del pedido (artículos y
// total) y deja confirmar o cancelar antes de crear el pedido en la API.

import { useEffect } from "react";
import { useCurrency } from "../../context/CurrencyContext";

function CheckoutModal({
  items,
  total,
  error,
  loading,
  onConfirm,
  onCancel,
}) {
  const { format } = useCurrency();

  // Permite cerrar el diálogo con la tecla Escape.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div
      aria-hidden="true"
      onClick={onCancel}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Confirmar compra"
        onClick={(event) => event.stopPropagation()}
        className="flex flex-col w-full max-w-md overflow-hidden rounded-2xl bg-surface-container neu-elevated"
      >
        {/* Cabecera con icono de compra y título */}
        <header className="flex items-center gap-sm px-margin-mobile py-md border-b border-surface-variant/40">
          <span className="material-symbols-outlined text-primary shrink-0">
            shopping_cart_checkout
          </span>
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-md text-headline-md text-on-background">
              Confirmar compra
            </h2>
            <p className="font-body-md text-body-md text-secondary">
              Revisa tu pedido antes de finalizar.
            </p>
          </div>
        </header>

        {/* Resumen del pedido: artículos y total */}
        <div className="px-margin-mobile py-md flex flex-col gap-sm max-h-[50dvh] overflow-y-auto">
          <ul className="flex flex-col gap-sm">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-sm font-body-md text-body-md"
              >
                <span className="text-on-background flex-1 min-w-0 truncate">
                  {item.name} <span className="text-secondary">× {item.qty}</span>
                </span>
                <span className="text-primary shrink-0">
                  {format(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-surface-variant/40 pt-sm">
            <span className="font-body-md text-body-md text-secondary">Total</span>
            <span className="font-body-lg text-body-lg text-primary font-bold">
              {format(total)}
            </span>
          </div>
        </div>

        {/* Aviso de error al crear el pedido, si lo hay */}
        {error && (
          <div className="px-margin-mobile pb-sm">
            <p className="font-body-md text-body-md bg-error-container text-on-error-container rounded-lg p-sm">
              {error}
            </p>
          </div>
        )}

        {/* Acciones: cancelar y confirmar el pedido */}
        <footer className="flex flex-col-reverse sm:flex-row sm:justify-end gap-sm px-margin-mobile py-md border-t border-surface-variant/40">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto text-center bg-surface-container-high text-primary font-bold py-sm px-md rounded-xl neu-raised neu-btn-active transition-all hover:bg-primary-container hover:text-on-primary font-body-md text-body-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto text-center bg-primary text-on-primary font-bold py-sm px-md rounded-xl neu-raised neu-btn-active transition-all hover:bg-primary-container hover:text-on-primary font-body-md text-body-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : "Confirmar pedido"}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default CheckoutModal;