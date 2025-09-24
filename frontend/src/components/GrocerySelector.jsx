import { useEffect, useMemo } from 'react';
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
    getGroceryRole
  } = useAuth();

  const groceries = [
    { id: 1, name: 'Verdulería Central', address: 'Av. Principal 123' },
    { id: 2, name: 'Frutas del Valle', address: 'Calle Comercio 456' },
    { id: 3, name: 'Mercado Fresh', address: 'Plaza Mayor 789' }
  ];

  const availableGroceries = useMemo(() => {
    if (user?.isSuperAdmin) {
      return groceries;
    }
    return groceries.filter(grocery => 
      user?.roles?.some(role => role.groceryId === grocery.id)
    );
  }, [user, groceries]);

  useEffect(() => {
    // Seleccionar el primer grocery por defecto si no hay ninguno seleccionado
    if (!currentGroceryId && availableGroceries.length > 0) {
      setCurrentGroceryId(availableGroceries[0].id);
    }
  }, [currentGroceryId, setCurrentGroceryId, availableGroceries]);

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
