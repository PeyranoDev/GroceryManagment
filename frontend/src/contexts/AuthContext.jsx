import { useState, useEffect } from "react";
import { users } from "../data/users";
import { toast } from "react-toastify";
import { AuthContext } from "./auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const { email, password, remember } = credentials;

      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error("Credenciales inválidas");
      }

      const userWithRemember = { ...foundUser, remember };
      setUser(userWithRemember);

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("app_user", JSON.stringify(userWithRemember));

      const otherStorage = remember ? sessionStorage : localStorage;
      otherStorage.removeItem("app_user");

      toast.success(`¡Bienvenido, ${foundUser.name}!`);
      return foundUser;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("app_user");
    sessionStorage.removeItem("app_user");
    toast.info("Sesión cerrada correctamente");
  };

  const hasRole = (role) => {
    if (!user) return false;

    const userRoles = [];
    if (user.isSuperAdmin) {
      userRoles.push("admin", "superadmin");
    } else {
      userRoles.push("user");
    }

    return userRoles.includes(role.toLowerCase());
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    userRoles: user
      ? user.isSuperAdmin
        ? ["admin", "superadmin"]
        : ["user"]
      : [],
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
