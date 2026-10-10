// Guarda de ruta para la administración. Solo deja pasar a los usuarios con
// permisos de administrador; al resto los devuelve al inicio sin mostrar nada.

import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RequireAdmin({ children }) {
  const { user } = useAuth();

  // Sin sesión o sin permisos de administrador: no se muestra la página.
  if (!user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RequireAdmin;
