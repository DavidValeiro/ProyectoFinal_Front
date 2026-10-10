// Formulario de inicio de sesión. Valida los campos básicos, registra al
// usuario en el contexto de auth y redirige al inicio.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Estilo compartido de los campos del formulario.
const inputCls =
  "neu-input neu-pressed rounded-lg bg-surface-container-low px-sm py-xs font-body-md text-body-md text-on-background w-full";

const LoginForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Actualiza el campo modificado manteniendo el resto del formulario.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email: formData.email, password: formData.password });
      onSuccess?.();
      navigate("/");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mensaje de error, solo si existe */}
      {error && (
        <div className="bg-error-container text-on-error-container rounded-lg p-4 font-body-md text-body-md">
          {error}
        </div>
      )}

      {/* Campo de correo */}
      <div>
        <label
          htmlFor="email"
          className="block font-label-md text-label-md text-secondary uppercase tracking-widest mb-2"
        >
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={inputCls}
          placeholder="tu@email.com"
        />
      </div>

      {/* Campo de contraseña */}
      <div>
        <label
          htmlFor="password"
          className="block font-label-md text-label-md text-secondary uppercase tracking-widest mb-2"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className={inputCls}
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-container text-on-primary font-bold py-sm px-md rounded-xl neu-raised neu-btn-active transition-all font-body-md text-body-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </form>
  );
};

export default LoginForm;
