import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useState } from 'react';
import httpService from '../services/httpService';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  } = useAuth0();

  const [token, setToken] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  const [currentGroceryId, setCurrentGroceryId] = useState(null);

  const getToken = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
        return accessToken;
      } catch (error) {
        console.error('Error getting access token:', error);
        return null;
      }
    }
    return null;
  }, [isAuthenticated, getAccessTokenSilently]);

  const getRoles = useCallback(() => {
    if (user && user['https://grocery-management-api/roles']) {
      return user['https://grocery-management-api/roles'];
    }
    return [];
  }, [user]);

  const getGroceryRole = useCallback((groceryId) => {
    const roles = getRoles();
    
    // Si es SuperAdmin global, tiene acceso total
    if (user?.['https://grocery-management-api/is_super_admin']) {
      return 'super_admin';
    }
    
    // Buscar rol específico para este grocery
    const groceryRole = roles.find(role => role.groceryId === groceryId);
    return groceryRole?.role || null;
  }, [getRoles, user]);

  const hasRole = useCallback((role, groceryId = null) => {
    // SuperAdmin global tiene acceso a todo
    if (user?.['https://grocery-management-api/is_super_admin']) {
      return true;
    }
    
    if (groceryId) {
      const groceryRole = getGroceryRole(groceryId);
      if (!groceryRole) return false;
      
      // Mapear roles del enum: Staff=1, Admin=2, SuperAdmin=3
      const roleHierarchy = { 'staff': 1, 'admin': 2, 'super_admin': 3 };
      const userRoleLevel = roleHierarchy[groceryRole.toLowerCase()] || 0;
      const requiredRoleLevel = roleHierarchy[role.toLowerCase()] || 0;
      
      return userRoleLevel >= requiredRoleLevel;
    }
    
    // Para roles globales, verificar si es admin en alguna tienda
    const roles = getRoles();
    return roles.some(r => {
      const roleLevel = { 'staff': 1, 'admin': 2, 'super_admin': 3 }[r.role?.toLowerCase()] || 0;
      const requiredLevel = { 'staff': 1, 'admin': 2, 'super_admin': 3 }[role.toLowerCase()] || 0;
      return roleLevel >= requiredLevel;
    });
  }, [getRoles, getGroceryRole, user]);

  const isAdmin = useCallback((groceryId = null) => {
    return hasRole('admin', groceryId);
  }, [hasRole]);

  const isSuperAdmin = useCallback((groceryId = null) => {
    return user?.['https://grocery-management-api/is_super_admin'] || 
           hasRole('super_admin', groceryId);
  }, [hasRole, user]);

  const getUserGroceries = useCallback(() => {
    if (user?.['https://grocery-management-api/is_super_admin']) {
      // SuperAdmin tiene acceso a todos los groceries
      return 'all';
    }
    
    const roles = getRoles();
    return roles.map(role => ({
      groceryId: role.groceryId,
      role: role.role
    }));
  }, [getRoles, user]);

  const switchGrocery = useCallback((groceryId) => {
    // Verificar si el usuario tiene acceso a este grocery
    if (hasRole('staff', groceryId)) {
      setCurrentGroceryId(groceryId);
      return true;
    }
    return false;
  }, [hasRole]);

  const login = useCallback(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  const logoutUser = useCallback(() => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }, [logout]);

  useEffect(() => {
    if (isAuthenticated) {
      getToken();
      setUserRoles(getRoles());
      
      httpService.setTokenCallback(getToken);
    } else {
      httpService.setTokenCallback(null);
    }
  }, [isAuthenticated, getToken, getRoles]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    token,
    userRoles,
    currentGroceryId,
    login,
    logout: logoutUser,
    getToken,
    getRoles,
    getGroceryRole,
    hasRole,
    isAdmin,
    isSuperAdmin,
    getUserGroceries,
    switchGrocery,
    setCurrentGroceryId
  };
};
