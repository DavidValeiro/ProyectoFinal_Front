// Formulario de registro. Comprueba que las contraseñas coincidan y tengan una
// longitud mínima antes de crear la sesión.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Estilo compartido de los campos del formulario.
const inputCls =
  "neu-input neu-pressed rounded-lg bg-surface-container-low px-sm py-xs font-body-md text-body-md text-on-background w-full";

const RegisterForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // Validaciones locales antes de continuar.
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      onSuccess?.();
      navigate("/");
    } catch (err) {
      setError(err.message || "Error al registrar usuario. Inténtalo de nuevo.");
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

      {/* Nombre completo */}
      <div>
        <label
          htmlFor="name"
          className="block font-label-md text-label-md text-secondary uppercase tracking-widest mb-2"
        >
          Nombre completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className={inputCls}
          placeholder="Tu nombre"
        />
      </div>

      {/* Correo electrónico */}
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

      {/* Contraseña */}
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
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      {/* Confirmación de contraseña */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block font-label-md text-label-md text-secondary uppercase tracking-widest mb-2"
        >
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          className={inputCls}
          placeholder="Repite tu contraseña"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-container text-on-primary font-bold py-sm px-md rounded-xl neu-raised neu-btn-active transition-all font-body-md text-body-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Registrando..." : "Crear cuenta"}
      </button>
    </form>
  );
};

export default RegisterForm;
