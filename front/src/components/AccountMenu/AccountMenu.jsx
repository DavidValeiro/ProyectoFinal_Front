// Desplegable de cuenta del usuario con sesión iniciada. Reúne el nombre,
// el selector de moneda, el interruptor día/noche y el botón de cerrar sesión.

import { useCurrency } from "../../context/CurrencyContext";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../../ui-theme";

function AccountMenu({ open, onClose }) {
  const { user, logout } = useAuth();
  const { currencyCode, setCurrencyCode, options } = useCurrency();

  // Si está cerrado no renderiza nada.
  if (!open) return null;

  // Nombre a mostrar: el del perfil o, si no, el correo.
  const displayName = user?.name ?? user?.email ?? "Mi cuenta";

  return (
    <>
      {/* Capa transparente para cerrar al hacer clic fuera */}
      <div aria-hidden="true" onClick={onClose} className="fixed inset-0 z-40" />

      <div
        role="dialog"
        aria-label="Cuenta"
        className={`absolute top-full right-0 mt-2.5 z-50 flex flex-col overflow-hidden rounded-2xl w-[min(20rem,calc(100vw-1.5rem))] bg-surface-container border border-surface-variant/30 neu-elevated transition-all duration-300 ease-out origin-top-right motion-reduce:transition-none max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:top-[4.5rem] max-sm:mt-0 max-sm:w-[calc(100vw-1.5rem)]`}
      >
        {/* Pico/flecha que conecta el panel con el botón (oculto en móvil) */}
        <span
          aria-hidden="true"
          className="absolute -top-1.5 right-5 h-3 w-3 rotate-45 rounded-[2px] bg-surface-container border-l border-t border-surface-variant/40 max-sm:hidden"
        />

        {/* Cabecera con el nombre del usuario y botón de cierre */}
        <header className="flex items-center justify-between px-margin-mobile py-md border-b border-surface-variant/40">
          <div className="flex items-center space-x-sm min-w-0">
            <span className="material-symbols-outlined text-primary shrink-0">
              account_circle
            </span>
            <p className="font-body-md text-body-md text-on-background truncate">
              {displayName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="material-symbols-outlined text-secondary hover:text-primary transition-all p-base neu-button-raised rounded-full shrink-0"
            aria-label="Cerrar cuenta"
          >
            close
          </button>
        </header>

        {/* Preferencias: moneda y tema */}
        <div className="flex flex-col gap-md px-margin-mobile py-md">
          <div className="flex items-center justify-between gap-md">
            <label className="flex items-center space-x-sm min-w-0">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-secondary shrink-0"
              >
                payments
              </span>
              <span className="font-body-md text-body-md text-on-background">
                Moneda
              </span>
            </label>
            <select
              value={currencyCode}
              onChange={(event) => setCurrencyCode(event.target.value)}
              className="neu-button-raised rounded-full bg-background text-secondary font-body-md text-body-md px-sm py-xs appearance-none cursor-pointer hover:text-primary transition-all shrink-0"
            >
              {options.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.code}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-md">
            <label className="flex items-center space-x-sm min-w-0">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-secondary shrink-0"
              >
                dark_mode
              </span>
              <span className="font-body-md text-body-md text-on-background">
                Modo día/noche
              </span>
            </label>
            <ThemeToggle />
          </div>
        </div>

        {/* Acción de cerrar sesión */}
        <footer className="border-t border-surface-variant/40 px-margin-mobile py-md">
          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full font-body-md text-body-md text-error bg-error-container neu-raised neu-btn-active transition-all py-md rounded-full flex items-center justify-center gap-xs uppercase tracking-wider font-bold hover:brightness-110"
          >
            <span aria-hidden="true" className="material-symbols-outlined">
              logout
            </span>
            <span>Cerrar sesión</span>
          </button>
        </footer>
      </div>
    </>
  );
}

export default AccountMenu;
