// Pie de página común. Muestra la marca, los enlaces de navegación y el aviso
// de copyright con el año actual.

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const currentYear = new Date().getFullYear();

// Enlaces principales del pie, coherentes con los de la cabecera.
const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Catálogo", to: "/Catalog" },
  { label: "Administración", to: "/Manage", adminOnly: true },
];

function Footer({ brand = "MOUSIN" }) {
  const { user } = useAuth();
  // Se ocultan los enlaces solo para administradores si el usuario no lo es.
  const visibleNavItems = navItems.filter(
    (item) => !item.adminOnly || user?.is_admin
  );

  return (
    <footer className="w-full mt-lg md:mt-xl bg-surface-container border-t border-surface-variant/30">
      <div className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg flex flex-col md:flex-row items-center justify-between gap-md">
        {/* Marca que enlaza al inicio */}
        <Link
          to="/"
          className="font-display-lg text-2xl md:text-display-lg font-bold tracking-tighter text-primary w-fit"
        >
          {brand}
        </Link>

        {/* Navegación del pie */}
        <nav
          className="flex flex-wrap justify-center gap-sm md:gap-lg"
          aria-label="Navegación del pie de página"
        >
          {visibleNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="font-body-md text-body-md text-secondary hover:text-primary transition-colors duration-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Aviso de copyright con el año en curso */}
        <p className="font-body-md text-body-md text-on-surface-variant text-center">
          © {currentYear} {brand} Periféricos. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
