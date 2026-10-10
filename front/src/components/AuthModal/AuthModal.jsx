// Modal de acceso. Alterna entre iniciar sesión y registrarse mediante pestañas
// y bloquea el scroll del fondo mientras está abierto.

import { useEffect } from "react";
import LoginForm from "../Auth/LoginForm";
import RegisterForm from "../Auth/RegisterForm";

// Pestañas disponibles del modal.
const TABS = [
  { id: "login", label: "Iniciar sesión" },
  { id: "register", label: "Registrarse" },
];

// Texto de apoyo que cambia según la pestaña activa.
const SUBTITLES = {
  login: "Accede a tu cuenta de MOUSIN",
  register: "Únete a MOUSIN y descubre nuestros productos",
};

function AuthModal({ view, onClose, onSwitch }) {
  // Con el modal abierto: bloquea el scroll del body y cierra con Escape.
  useEffect(() => {
    if (!view) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [view, onClose]);

  // Sin vista activa no se muestra el modal.
  if (!view) return null;

  return (
    <div
      aria-hidden="true"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Acceso a la cuenta"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md max-h-[calc(100dvh-3rem)] overflow-y-auto rounded-2xl bg-surface-container-low neu-elevated"
      >
        {/* Texto de apoyo y botón de cierre */}
        <div className="flex items-start justify-between gap-sm px-6 pt-6 md:pt-8">
          <p className="font-body-md text-body-md text-secondary">
            {SUBTITLES[view]}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="material-symbols-outlined text-secondary hover:text-primary transition-all p-base neu-button-raised rounded-full shrink-0"
            aria-label="Cerrar ventana"
          >
            close
          </button>
        </div>

        {/* Selector de pestaña login / registro */}
        <div className="mt-4 px-6 md:px-8">
          <div className="grid grid-cols-2 gap-xs p-xs rounded-xl bg-surface-container-low neu-pressed">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSwitch(tab.id)}
                className={`py-xs rounded-lg font-body-md text-body-md transition-all ${
                  view === tab.id
                    ? "bg-primary-container text-on-primary font-bold neu-raised"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Formulario correspondiente a la pestaña activa */}
        <div className="px-6 pb-6 pt-6 md:px-8 md:pb-8">
          {view === "login" ? (
            <LoginForm onSuccess={onClose} />
          ) : (
            <RegisterForm onSuccess={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
