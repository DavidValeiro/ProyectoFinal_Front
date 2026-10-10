// Modal de confirmación reutilizable. Se usa, por ejemplo, antes de eliminar
// un producto en la administración. Cierra con Escape o al pulsar el fondo.

import { useEffect } from "react";

function ConfirmModal({
  title = "¿Estás seguro?",
  description,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}) {
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="flex flex-col w-full max-w-md overflow-hidden rounded-2xl bg-surface-container neu-elevated"
      >
        {/* Cabecera con icono de aviso y título */}
        <header className="flex items-center gap-sm px-margin-mobile py-md border-b border-surface-variant/40">
          <span className="material-symbols-outlined text-error">warning</span>
          <h2 className="font-headline-md text-headline-md text-on-background">
            {title}
          </h2>
        </header>

        {/* Mensaje explicativo de la acción */}
        <div className="px-margin-mobile py-md">
          <p className="font-body-md text-body-md text-on-surface-variant">
            {description}
          </p>
        </div>

        {/* Acciones: cancelar a la izquierda y confirmar (destructivo) a la derecha */}
        <footer className="flex flex-col-reverse sm:flex-row sm:justify-end gap-sm px-margin-mobile py-md border-t border-surface-variant/40">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto text-center bg-surface-container-high text-primary font-bold py-sm px-md rounded-xl neu-raised neu-btn-active transition-all hover:bg-primary-container hover:text-on-primary font-body-md text-body-md"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto text-center bg-error text-on-error font-bold py-sm px-md rounded-xl neu-raised neu-btn-active transition-all hover:bg-error-container hover:text-on-error-container font-body-md text-body-md"
          >
            {confirmLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default ConfirmModal;
