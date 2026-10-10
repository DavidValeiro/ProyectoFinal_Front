// Estructura base de todas las páginas: cabecera fija arriba, contenido
// flexible en medio (el Outlet de React Router) y pie de página abajo.

import { Outlet } from "react-router-dom";
import Menu from "../Menu/Menu";
import Footer from "../Footer/Footer";

const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Menu />
    <div className="flex-1 flex flex-col">
      <Outlet />
    </div>
    <Footer />
  </div>
);

export default Layout;
