import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole = null, fallback = null }) => {
  const { isAuthenticated, isLoading, hasRole, login } = useAuth();

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        gap={2}
      >
        <Typography variant="h4" gutterBottom>
          Acceso Requerido
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Necesitas iniciar sesión para acceder a esta página
        </Typography>
        <button 
          onClick={login}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Iniciar Sesión
        </button>
      </Box>
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        gap={2}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Acceso Denegado
        </Typography>
        <Typography variant="body1">
          No tienes permisos suficientes para acceder a esta página
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rol requerido: {requiredRole}
        </Typography>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
