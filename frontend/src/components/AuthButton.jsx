import { useAuth } from '../hooks/useAuth';
import { 
  Button, 
  Menu, 
  MenuItem, 
  Avatar, 
  Box, 
  Typography, 
  Divider,
  Chip
} from '@mui/material';
import { useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AuthButton = () => {
  const { isAuthenticated, isLoading, user, login, logout, userRoles } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  if (isLoading) {
    return (
      <Button disabled variant="outlined">
        Cargando...
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button 
        variant="contained" 
        startIcon={<LoginIcon />}
        onClick={login}
        sx={{ textTransform: 'none' }}
      >
        Iniciar Sesión
      </Button>
    );
  }

  return (
    <Box>
      <Button
        onClick={handleMenuOpen}
        startIcon={
          user?.picture ? (
            <Avatar 
              src={user.picture} 
              alt={user.name}
              sx={{ width: 24, height: 24 }}
            />
          ) : (
            <AccountCircleIcon />
          )
        }
        sx={{ textTransform: 'none' }}
      >
        {user?.name || user?.email}
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, minWidth: 250 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
          
          {userRoles.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Roles:
              </Typography>
              <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {userRoles.map((role, index) => (
                  <Chip 
                    key={index} 
                    label={role} 
                    size="small" 
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Cerrar Sesión
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AuthButton;
