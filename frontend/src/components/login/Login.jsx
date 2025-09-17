import {
  Leaf,
  User,
  Key,
  Eye,
  EyeOff,
  Github,
  Chrome,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import { useLoginFormValidation } from "../../hooks/useLoginFormValidation";
import { toast } from "react-toastify";

const Login = () => {
  const {
    values: { email, password },
    errors,
    handleChange,
    validateForm,
  } = useLoginFormValidation();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    validateForm();

    if (Object.keys(errors).length === 0) {
      // Peyran conecta el backend
      toast.success("Inicio de sesión exitoso");
    } else {
      Object.values(errors).forEach((err) => toast.error(err));
    }
  };

  const handleChangePasswordView = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <main className="flex items-center justify-center p-4">
      <section
        className="w-full max-w-md space-y-8 bg-[var(--color-bg-secondary)] shadow-xl shadow-black/40 rounded-xl p-8"
        aria-labelledby="login-title"
      >
        <header className="flex justify-center">
          <div className="w-16 h-16 bg-[var(--color-bg)] rounded-full flex items-center justify-center shadow-md shadow-black/50">
            <Leaf className="w-8 h-8 text-green-500" aria-hidden="true" />
          </div>
        </header>

        <div className="text-center space-y-2">
          <h1 id="login-title" className="text-2xl font-semibold text-gray-50">
            Bienvenido a <strong>VerduSoft</strong>
          </h1>
          <p className="text-gray-400">
            ¿No tienes una cuenta aún?{" "}
            <a href="#" className="text-green-500 hover:underline">
              Regístrate
            </a>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <fieldset className="space-y-4">
            <legend className="sr-only">Formulario de inicio de sesión</legend>

            <div className="space-y-2">
              <label htmlFor="email" className="text-gray-300 text-sm block">
                Dirección de correo
              </label>
              <div className="relative">
                <User className="z-[1] absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={email}
                  onChange={handleChange}
                  type="email"
                  name="email"
                  autoComplete="username"
                  required
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-bg-input)] text-gray-50 placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 pl-10 pr-3 py-2 rounded-md outline-none transition-colors"
                  placeholder="tu@ejemplo.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-gray-300 text-sm block">
                Contraseña
              </label>
              <div className="relative">
                <Key
                  className="z-[1] absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  value={password}
                  onChange={handleChange}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-bg-input)] text-gray-50 placeholder:text-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 pl-10 pr-10 py-2 rounded-md outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={handleChangePasswordView}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Eye className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-md transition-colors cursor-pointer shadow-md shadow-green-900/40"
          >
            Iniciar Sesión
          </button>

          <div className="relative" role="separator" aria-label="o">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--color-bg-input)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="text-gray-400">o</span>
            </div>
          </div>

          <ul
            className="grid grid-cols-3 gap-3"
            aria-label="Iniciar sesión con redes sociales"
          >
            <li>
              <button
                type="button"
                className="w-full bg-[var(--color-bg)] border border-[var(--color-bg-input)] hover:bg-[var(--color-border)] text-white p-3 rounded-md transition-colors cursor-pointer shadow-sm"
              >
                <Github className="w-5 h-5 mx-auto" aria-hidden="true" />
                <span className="sr-only">Iniciar con GitHub</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="w-full bg-[var(--color-bg)] border border-[var(--color-bg-input)] hover:bg-[var(--color-border)] text-white p-3 rounded-md transition-colors cursor-pointer shadow-sm"
              >
                <Chrome className="w-5 h-5 mx-auto" aria-hidden="true" />
                <span className="sr-only">Iniciar con Google</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="w-full bg-[var(--color-bg)] border border-[var(--color-bg-input)] hover:bg-[var(--color-border)] text-white p-3 rounded-md transition-colors cursor-pointer shadow-sm"
              >
                <Twitter className="w-5 h-5 mx-auto" aria-hidden="true" />
                <span className="sr-only">Iniciar con Twitter</span>
              </button>
            </li>
          </ul>
        </form>
      </section>
    </main>
  );
};

export default Login;
