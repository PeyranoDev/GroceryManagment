import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import { Leaf, User, Key, Eye, EyeOff, AlertTriangle, Loader2 } from "lucide-react";
import Input from "../ui/input/Input";

const Login = ({ handleLogin }) => {
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const u = location.state && location.state.user;
    if (u && handleLogin) {
      handleLogin(u);
    }
  }, [location.state, handleLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);

    try {
      const userData = await login(email, password);
      handleLogin(userData);
    } catch (error) {
      setAuthError(error.message || "Credenciales incorrectas");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePasswordView = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <section
        className="w-full max-w-md space-y-8 bg-[var(--color-bg-secondary)] shadow-xl shadow-black/40 rounded-xl p-8"
        aria-labelledby="login-title"
      >
        <header className="flex justify-center">
          <div className="w-16 h-16 bg-[var(--color-bg)] rounded-full flex items-center justify-center shadow-md shadow-black/50">
            <Leaf className="w-8 h-8 text-[var(--color-primary)]" aria-hidden="true" />
          </div>
        </header>

        <div className="text-center space-y-2">
          <h1 id="login-title" className="text-2xl font-semibold text-[var(--color-text)]">
            Bienvenido a <strong>VerduSoft</strong>
          </h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="on" noValidate>
          <fieldset className="space-y-4">
            <legend className="sr-only">Formulario de inicio de sesión</legend>
            <input type="text" name="username" autoComplete="username" value={email || ''} readOnly className="hidden" aria-hidden="true" />

            <div className="space-y-2">
              <label htmlFor="email" className="text-[var(--color-secondary-text)] text-sm block">
                Dirección de correo
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setAuthError(null); setEmail(e.target.value); }}
                  required
                  ariaLabel="Dirección de correo"
                  icon={<User className="w-5 h-5 text-[var(--color-secondary-text)]" />}
                  error={!!authError}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[var(--color-secondary-text)] text-sm block">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => { setAuthError(null); setPassword(e.target.value); }}
                  type={showPassword ? "text" : "password"}
                  required
                  ariaLabel="Contraseña"
                  icon={<Key className="w-5 h-5 text-[var(--color-secondary-text)]" aria-hidden="true" />}
                  inputClassName="pr-10"
                  error={!!authError}
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={handleChangePasswordView}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-secondary-text)] hover:text-[var(--color-secondary-text)]/70 transition-colors cursor-pointer"
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

          {authError && (
            <div className="flex items-center gap-2 bg-[var(--color-error)] text-[var(--color-text)] text-sm px-4 py-2 rounded-md">
              <AlertTriangle size={16} />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !String(email || '').trim() || !String(password || '').trim()}
            className={`w-full font-medium py-3 rounded-md transition-colors shadow-md ${submitting ? 'bg-[var(--color-primary)]/70 text-[var(--color-text)] cursor-wait' : (!String(email || '').trim() || !String(password || '').trim()) ? 'bg-[var(--color-primary)]/50 text-[var(--color-secondary-text)] cursor-not-allowed' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white cursor-pointer'}`}
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Iniciar Sesión'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;
