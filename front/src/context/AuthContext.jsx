// Contexto de autenticación de la tienda. Comprueba las credenciales contra la
// API del back, guarda al usuario en localStorage para recordar la sesión entre
// recargas y expone las acciones login/logout.

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { loginUser, registerUser } from "../api/api";

const STORAGE_KEY = "user";

const AuthContext = createContext(null);

// Lee el usuario guardado; si no hay nada o el JSON es inválido devuelve null.
const readUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Recorta los datos del usuario para guardar solo lo necesario (sin contraseña).
const toSession = (data) => ({
  id: data.id,
  name: data.name,
  email: data.email,
  is_admin: data.is_admin,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  // Guarda la sesión en el estado y en localStorage.
  const persist = useCallback((data) => {
    const next = toSession(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Si el almacenamiento no está disponible, mantenemos la sesión en memoria.
    }
    setUser(next);
    return next;
  }, []);

  // Inicia sesión comprobando email y contraseña en la API.
  const login = useCallback(
    ({ email, password }) => loginUser(email, password).then(persist),
    [persist]
  );

  // Crea una cuenta nueva en la API y deja la sesión iniciada.
  const register = useCallback(
    ({ name, email, password }) =>
      registerUser({ name, email, password }).then(persist),
    [persist]
  );

  // Cierra la sesión eliminando el usuario guardado.
  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Si el almacenamiento no está disponible no hay nada que borrar.
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook de acceso al contexto; lanza error si se usa fuera del provider.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
