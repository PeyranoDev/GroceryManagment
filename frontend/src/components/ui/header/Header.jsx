// src/components/Header/Header.jsx
import { Leaf, LogIn, LogOut, Moon, Sun, UserCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = ({ user, onLogin, onLogout }) => {
  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Ventas", path: "/ventas" },
    { name: "Pedidos", path: "/pedidos" },
    { name: "Compras", path: "/compras" },
    { name: "Inventario", path: "/inventario" },
    { name: "Reportes", path: "/reportes" },
  ];

  return (
    <header className="header-container">
      <div className="header-inner">
        <div className="header-content-wrapper">
          {/* Logo */}
          <div className="header-left-section">
            <div className="header-logo">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="header-logo-text">VerduSoft</span>
            </div>

            {/* Navegación */}
            <nav className="header-nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-item-base ${isActive ? "nav-item-active" : "nav-item-inactive"}`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Usuario */}
          <div className="header-right-section">
            {user ? (
              <div className="user-info-container">
                <span className="user-name">{user.name}</span>
                <UserCircle
                  size={28}
                  className="text-gray-400"
                />
                <button onClick={onLogout} className="theme-toggle-button">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="auth-button-group">
                <button onClick={onLogin} className="login-button">
                  <LogIn size={16} /> Iniciar Sesión
                </button>
                <button className="register-button">Registrarse</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
