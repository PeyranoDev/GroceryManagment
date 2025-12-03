import {
  Leaf,
  LogOut,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./header.css";

const Header = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.isSuperAdmin || user?.currentRole === 'Admin' || user?.currentRole === 2;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", end: true, adminOnly: true },
    { name: "Caja", path: "/caja", end: true },
    { name: "Ventas", path: "/ventas/registradas" },
    { name: "Compras", path: "/compras", end: true, adminOnly: true },
    { name: "Inventario", path: "/inventario", end: true },
    { name: "Usuarios", path: "/usuarios", end: true, adminOnly: true },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const canShowItem = (item) => {
    if (!item.adminOnly) return true;
    return isAdmin;
  };

  return (
    <header className="header-container">
      <div className="header-inner">
        <div className="header-content-wrapper">
          <div className="header-left-section">
            <div className="header-logo">
              <Leaf className="h-8 w-8 text-[var(--color-primary)]" />
              <span className="header-logo-text">VerduSoft</span>
            </div>

            <nav className="header-nav">
              {navItems.map((item) =>
                !canShowItem(item) ? null : (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-item-base ${
                        isActive ? "nav-item-active" : "nav-item-inactive"
                      }`
                    }
                    end={item.end}
                  >
                    {item.name}
                  </NavLink>
                )
              )}
            </nav>
          </div>

          <button
            className="mobile-menu-button md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="header-right-section">
            <div className="user-info-container">
              <span className="user-name">{user.name}</span>
              <UserCircle size={28} className="text-[var(--color-secondary-text)]" />
              <button onClick={onLogout} className="theme-toggle-button">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-nav-overlay">
            <nav className="mobile-nav">
              {navItems.map((item) =>
                !canShowItem(item) ? null : (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `mobile-nav-item ${
                        isActive
                          ? "mobile-nav-item-active"
                          : "mobile-nav-item-inactive"
                      }`
                    }
                    end={item.end}
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </NavLink>
                )
              )}

              <div className="mobile-auth-section">
                <div className="mobile-user-info">
                  <div className="flex items-center gap-2 mb-4">
                    <UserCircle size={24} className="text-[var(--color-secondary-text)]" />
                    <span className="text-[var(--color-text)]">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      closeMobileMenu();
                    }}
                    className="mobile-logout-button"
                  >
                    <LogOut size={16} /> Cerrar Sesión
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
