import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { users as mockUsers } from '../data/users';

const AuthContext = createContext(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const DEMO_MODE = false;

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  if (DEMO_MODE) return false;
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

const mockLogin = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Credenciales incorrectas');
  }
  
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    isSuperAdmin: user.isSuperAdmin,
    currentRole: user.isSuperAdmin ? 'Admin' : 'Staff',
    groceryId: 1
  };
  
  return {
    token: 'demo_token_' + Date.now(),
    user: userData
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      if (isTokenExpired(storedToken)) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } else {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = DEMO_MODE 
      ? await mockLogin(email, password)
      : await authAPI.login({ email, password });

    const newToken = response.token || response.Token || '';
    const rawUser = response.user || response.User || {};

    const normalizedUser = {
      id: rawUser.id ?? rawUser.Id,
      name: rawUser.name ?? rawUser.Name,
      email: rawUser.email ?? rawUser.Email,
      isSuperAdmin: rawUser.isSuperAdmin ?? rawUser.IsSuperAdmin ?? false,
      currentRole: (() => {
        const role = rawUser.currentRole ?? rawUser.CurrentRole;
        if (typeof role === 'string') return role;
        const map = { 1: 'Staff', 2: 'Admin', 3: 'SuperAdmin' };
        return map[role] || 'Staff';
      })(),
      currentGroceryId: rawUser.currentGroceryId ?? rawUser.CurrentGroceryId ?? null,
    };

    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));

    setToken(newToken);
    setUser(normalizedUser);

    return normalizedUser;
  }, []);

  const impersonate = useCallback(async (userId) => {
    const response = await authAPI.impersonate(userId);
    const newToken = response.token || response.Token || '';
    const rawUser = response.user || response.User || {};

    const normalizedUser = {
      id: rawUser.id ?? rawUser.Id,
      name: rawUser.name ?? rawUser.Name,
      email: rawUser.email ?? rawUser.Email,
      isSuperAdmin: rawUser.isSuperAdmin ?? rawUser.IsSuperAdmin ?? false,
      currentRole: (() => {
        const role = rawUser.currentRole ?? rawUser.CurrentRole;
        if (typeof role === 'string') return role;
        const map = { 1: 'Staff', 2: 'Admin', 3: 'SuperAdmin' };
        return map[role] || 'Staff';
      })(),
      currentGroceryId: rawUser.currentGroceryId ?? rawUser.CurrentGroceryId ?? null,
    };

    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));

    setToken(newToken);
    setUser(normalizedUser);

    return normalizedUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const hasRole = useCallback((requiredRole) => {
    if (!user) return false;
    if (user.isSuperAdmin) return true;
    
    const roleHierarchy = { Staff: 1, Admin: 2, SuperAdmin: 3 };
    const userRoleLevel = roleHierarchy[user.currentRole] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  }, [user]);

  const isAdmin = useCallback(() => {
    return hasRole('Admin');
  }, [hasRole]);

  const isSuperAdmin = useCallback(() => {
    return user?.isSuperAdmin === true;
  }, [user]);

  const value = {
    user,
    token,
    loading,
    login,
    impersonate,
    logout,
    hasRole,
    isAdmin,
    isSuperAdmin,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
