import { useState, useEffect } from 'react';
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Typography,
  Chip
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const GrocerySelector = () => {
  const { 
    user, 
    currentGroceryId, 
    setCurrentGroceryId, 
    getUserGroceries, 
    getGroceryRole,
    isSuperAdmin 
  } = useAuth();
  
  const [availableGroceries, setAvailableGroceries] = useState([]);

  useEffect(() => {
    // Mock de groceries disponibles - en producción esto vendría de tu API
    const mockGroceries = [
      { id: 1, name: 'Verdulería Central', address: 'Av. Principal 123' },
      { id: 2, name: 'Frutas del Valle', address: 'Calle Comercio 456' },
      { id: 3, name: 'Mercado Fresh', address: 'Plaza Mayor 789' }
    ];

    if (isSuperAdmin()) {
      // SuperAdmin ve todos los groceries
      setAvailableGroceries(mockGroceries);
    } else {
      // Usuario normal solo ve los groceries donde tiene roles
      const userGroceries = getUserGroceries();
      if (Array.isArray(userGroceries)) {
        const filtered = mockGroceries.filter(grocery => 
          userGroceries.some(ug => ug.groceryId === grocery.id)
        );
        setAvailableGroceries(filtered);
      }
    }

    // Seleccionar el primer grocery por defecto si no hay ninguno seleccionado
    if (!currentGroceryId && availableGroceries.length > 0) {
      setCurrentGroceryId(availableGroceries[0].id);
    }
  }, [user, isSuperAdmin, getUserGroceries, currentGroceryId, setCurrentGroceryId]);

  const handleGroceryChange = (event) => {
    setCurrentGroceryId(event.target.value);
  };

  const getCurrentRole = () => {
    if (!currentGroceryId) return null;
    return getGroceryRole(currentGroceryId);
  };

  if (!user || availableGroceries.length === 0) {
    return null;
  }

  return (
    <Box sx={{ minWidth: 200, mr: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Verdulería</InputLabel>
        <Select
          value={currentGroceryId || ''}
          label="Verdulería"
          onChange={handleGroceryChange}
        >
          {availableGroceries.map((grocery) => (
            <MenuItem key={grocery.id} value={grocery.id}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {grocery.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {grocery.address}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {currentGroceryId && (
        <Box sx={{ mt: 1 }}>
          <Chip 
            label={`Rol: ${getCurrentRole()}`} 
            size="small" 
            color={
              getCurrentRole() === 'super_admin' ? 'error' :
              getCurrentRole() === 'admin' ? 'warning' : 'primary'
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default GrocerySelector;
