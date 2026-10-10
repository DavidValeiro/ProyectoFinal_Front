// Barra de navegación principal de la app: marca, enlaces de escritorio y
// móvil, acceso al carrito y al menú de cuenta.

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../AuthModal/AuthModal";
import Buying from "../Buying/Buying";
import CartToast from "../CartToast/CartToast";
import AccountMenu from "../AccountMenu/AccountMenu";

// Enlaces mostrados por defecto en la cabecera.
const defaultNavItems = [
  { label: "Inicio", to: "/" },
  { label: "Catálogo", to: "/Catalog" },
  { label: "Administración", to: "/Manage", adminOnly: true },
];

// Renderiza los enlaces de navegación. Cada elemento puede ser un enlace de
// ruta (`to`), un botón que abre una vista (`view`) o un enlace externo.
function NavLinks({ items, onNavigate, onView, pathname }) {
  return items.map((item, index) => {
    const baseClasses =
      "font-body-md text-body-md transition-colors duration-300 py-1";
    // El enlace se marca como activo si coincide con la ruta actual.
    const isActive = item.to && pathname === item.to;

    if (item.view) {
      return (
        <button
          key={index}
          type="button"
          className={`${baseClasses} text-left text-secondary hover:text-primary-fixed-dim`}
          onClick={() => {
            onView(item.view);
            onNavigate?.();
          }}
        >
          {item.label}
        </button>
      );
    }

    if (isActive) {
      return (
        <Link
          key={index}
          className={`${baseClasses} text-primary font-bold border-b-2 border-primary transition-all`}
          to={item.to}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      );
    }

    if (item.to) {
      return (
        <Link
          key={index}
          className={`${baseClasses} text-secondary hover:text-primary-fixed-dim`}
          to={item.to}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      );
    }

    return (
      <a
        key={index}
        className={`${baseClasses} text-secondary hover:text-primary-fixed-dim`}
        href={item.href}
        onClick={onNavigate}
      >
        {item.label}
      </a>
    );
  });
}

function Menu({
  brand = "MOUSIN",
  navItems = defaultNavItems,
  showCart = true,
  showAccount = true,
  onAccountClick,
}) {
  // Estado de la navegación móvil, del desplegable de cuenta y del modal de acceso.
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [authView, setAuthView] = useState(null);
  const { openCart, items, lastAdded } = useCart();
  const { user } = useAuth();
  const { pathname } = useLocation();

  // Los enlaces solo para administradores se ocultan si el usuario no lo es.
  const visibleNavItems = navItems.filter(
    (item) => !item.adminOnly || user?.is_admin
  );

  const close = () => setOpen(false);

  // Carrito visible solo si el componente lo permite.
  // Al pulsar la cuenta: usa el callback externo si existe, abre el desplegable
  // si hay sesión o muestra el modal de acceso si no la hay.
  const handleAccount = () => {
    if (onAccountClick) {
      onAccountClick();
      return;
    }
    if (user) {
      setAccountOpen((prev) => !prev);
      return;
    }
    setAuthView("login");
  };

  return (
    <>
    <header className="w-full top-0 sticky z-50 bg-background neu-shadow-header">
      <div className="flex w-full justify-between items-center gap-sm px-margin-mobile md:px-margin-desktop py-sm md:py-md">
        {/* Marca de la tienda */}
        <div className="font-display-lg text-2xl md:text-display-lg font-bold tracking-tighter text-primary shrink-0">
          {brand}
        </div>
        {/* Navegación de escritorio */}
        <nav className="hidden md:flex items-center space-x-lg">
          <NavLinks items={visibleNavItems} pathname={pathname} onView={setAuthView} />
        </nav>
        <div className="flex items-center space-x-sm md:space-x-md">
          {/* Botón del carrito con contador y aviso de "añadido" animado */}
          {showCart && (
            <div className="relative">
              <button
                type="button"
                onClick={() => openCart()}
                className="p-base neu-button-raised rounded-full text-secondary hover:text-primary transition-all"
                aria-label={
                  items.length > 0
                    ? `Carrito de compra, ${items.length} artículos`
                    : "Carrito de compra"
                }
              >
                <span
                  key={lastAdded?.seq ?? 0}
                  className={`material-symbols-outlined block ${
                    lastAdded ? "animate-cart-bump" : ""
                  }`}
                >
                  shopping_cart
                </span>
                {items.length > 0 && (
                  <span className="buying-count absolute -top-0.5 -right-0.5">
                    {items.length}
                  </span>
                )}
              </button>
              <Buying />
              <CartToast />
            </div>
          )}
          {showAccount && (
            <div className="relative">
              {/* Botón de cuenta: abre el modal o el desplegable según la sesión */}
              <button
                type="button"
                onClick={handleAccount}
                className="material-symbols-outlined text-secondary hover:text-primary transition-all p-base neu-button-raised rounded-full"
                aria-label="Cuenta"
                aria-expanded={accountOpen}
              >
                account_circle
              </button>
              {user && (
                <AccountMenu
                  open={accountOpen}
                  onClose={() => setAccountOpen(false)}
                />
              )}
            </div>
          )}
          {/* Botón hamburguesa (solo móvil) */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="material-symbols-outlined text-secondary hover:text-primary transition-all p-base neu-button-raised rounded-full md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? "close" : "menu"}
          </button>
        </div>
      </div>
      {/* Navegación móvil desplegable (se anima con grid-template-rows) */}
      <nav
        className={`md:hidden bg-surface-container grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] border-t border-surface-variant/20" : "grid-rows-[0fr]"
        }`}
      >
        <div
          className={`overflow-hidden min-h-0 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col px-margin-mobile py-sm space-y-xs">
            <NavLinks items={visibleNavItems} onNavigate={close} pathname={pathname} onView={setAuthView} />
          </div>
        </div>
      </nav>
    </header>
    <AuthModal
      view={authView}
      onClose={() => setAuthView(null)}
      onSwitch={setAuthView}
    />
    </>
  );
}

export default Menu;
