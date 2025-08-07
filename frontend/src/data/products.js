export const mockSaleProducts = [
  // Frutas Tropicales
  { id: 1, name: 'Mango', stock: 25, unit: 'u', unitPrice: 2000, salePrice: 2000, category: 'Frutas Tropicales', emoji: '🥭', promotion: { quantity: 2, price: 3500 } },
  { id: 2, name: 'Banana Bolivia', stock: 30, unit: 'kg', unitPrice: 1500, salePrice: 1500, category: 'Frutas Tropicales', emoji: '🍌', promotion: { quantity: 2, price: 2500 } },
  { id: 3, name: 'Banana Ecuador', stock: 20, unit: 'kg', unitPrice: 2500, salePrice: 2500, category: 'Frutas Tropicales', emoji: '🍌', promotion: { quantity: 2, price: 4500 } },

  // Frutas Cítricas
  { id: 4, name: 'Limón', stock: 40, unit: 'kg', unitPrice: 1500, salePrice: 1500, category: 'Frutas Cítricas', emoji: '🍋', promotion: null },
  { id: 5, name: 'Lima', stock: 15, unit: '1/2 kg', unitPrice: 2500, salePrice: 2500, category: 'Frutas Cítricas', emoji: '🍈', promotion: null },
  { id: 6, name: 'Mandarina', stock: 35, unit: 'kg', unitPrice: 1500, salePrice: 2000, category: 'Frutas Cítricas', emoji: '🍊', promotion: null },
  { id: 7, name: 'Naranja jugo', stock: 50, unit: 'kg', unitPrice: 1000, salePrice: 1000, category: 'Frutas Cítricas', emoji: '🍊', promotion: { quantity: 2, price: 1500 } },
  { id: 8, name: 'Naranja ombligo chica', stock: 45, unit: 'kg', unitPrice: 1000, salePrice: 1000, category: 'Frutas Cítricas', emoji: '🍊', promotion: { quantity: 2, price: 1500 } },
  { id: 9, name: 'Naranja ombligo grande', stock: 30, unit: 'kg', unitPrice: 1500, salePrice: 1500, category: 'Frutas Cítricas', emoji: '🍊', promotion: null },

  // Frutas de Huerta
  { id: 10, name: 'Ciruela', stock: 20, unit: 'kg', unitPrice: 4000, salePrice: 4000, category: 'Frutas de Huerta', emoji: '🍇', promotion: null },
  { id: 11, name: 'Manzana a granel', stock: 60, unit: 'kg', unitPrice: 1000, salePrice: 1000, category: 'Frutas de Huerta', emoji: '🍎', promotion: { quantity: 2, price: 1500 } },
  { id: 12, name: 'Manzana Romme', stock: 25, unit: 'kg', unitPrice: 3000, salePrice: 3000, category: 'Frutas de Huerta', emoji: '🍎', promotion: { quantity: 2, price: 5000 } },
  { id: 13, name: 'Manzana roja "Moño azul"', stock: 20, unit: 'kg', unitPrice: 3000, salePrice: 3000, category: 'Frutas de Huerta', emoji: '🍎', promotion: { quantity: 2, price: 5000 } },
  { id: 14, name: 'Manzana verde', stock: 30, unit: 'kg', unitPrice: 3000, salePrice: 3000, category: 'Frutas de Huerta', emoji: '🍏', promotion: { quantity: 2, price: 5000 } },
  { id: 15, name: 'Pera', stock: 35, unit: 'kg', unitPrice: 2000, salePrice: 2000, category: 'Frutas de Huerta', emoji: '🍐', promotion: { quantity: 2, price: 3000 } },

  // Frutas Exóticas
  { id: 16, name: 'Kiwi', stock: 22, unit: 'kg', unitPrice: 6000, salePrice: 6000, category: 'Frutas Exóticas', emoji: '🥝', promotion: null },

  // Otros
  { id: 17, name: 'Ajo', stock: 100, unit: 'u', unitPrice: 1000, salePrice: 1000, category: 'Otros', emoji: '🧄', promotion: null },
  { id: 18, name: 'Albahaca', stock: 15, unit: 'planta', unitPrice: 1000, salePrice: 1000, category: 'Otros', emoji: '🌿', promotion: null },
  { id: 19, name: 'Brotes de soja', stock: 10, unit: 'bandeja', unitPrice: 3000, salePrice: 3000, category: 'Otros', emoji: '🌱', promotion: null },
  { id: 20, name: 'Champignones', stock: 12, unit: '1/4 kg', unitPrice: 5000, salePrice: 5000, category: 'Otros', emoji: '🍄', promotion: null },
  { id: 21, name: 'Chaucha', stock: 20, unit: '1/2 kg', unitPrice: 3000, salePrice: 3000, category: 'Otros', emoji: '🌱', promotion: null },
  { id: 22, name: 'Ensalada mixta', stock: 8, unit: 'bandeja', unitPrice: 1800, salePrice: 1800, category: 'Otros', emoji: '🥗', promotion: null },
  { id: 23, name: 'Ensalada hervida', stock: 6, unit: 'bandeja', unitPrice: 3000, salePrice: 3000, category: 'Otros', emoji: '🥗', promotion: null },
  { id: 24, name: 'Huevo blanco', stock: 50, unit: 'maple', unitPrice: 7500, salePrice: 7500, category: 'Otros', emoji: '🥚', promotion: null },
  { id: 25, name: 'Huevo colorado', stock: 45, unit: 'maple', unitPrice: 7500, salePrice: 7500, category: 'Otros', emoji: '🥚', promotion: null },
  { id: 26, name: 'Huevo de codorniz', stock: 20, unit: 'x12', unitPrice: 3000, salePrice: 3000, category: 'Otros', emoji: '🪺', promotion: null },
  { id: 27, name: 'Palta', stock: 40, unit: 'u', unitPrice: 1300, salePrice: 1300, category: 'Otros', emoji: '🥑', promotion: { quantity: 2, price: 2000 } },
  { id: 28, name: 'Palta seleccionada', stock: 25, unit: 'u', unitPrice: 1500, salePrice: 1500, category: 'Otros', emoji: '🥑', promotion: { quantity: 2, price: 2500 } },
  { id: 29, name: 'Sopa', stock: 10, unit: 'bandeja', unitPrice: 2500, salePrice: 2500, category: 'Otros', emoji: '🥣', promotion: null },

  // Verduras y Hortalizas
  { id: 30, name: 'Berenjena', stock: 25, unit: 'kg', unitPrice: 1500, salePrice: 1500, category: 'Verduras y Hortalizas', emoji: '🍆', promotion: { quantity: 2, price: 2500 } },
  { id: 31, name: 'Berenjena rayada', stock: 15, unit: 'kg', unitPrice: 2500, salePrice: 2500, category: 'Verduras y Hortalizas', emoji: '🍆', promotion: null },
  { id: 32, name: 'Cabutia', stock: 30, unit: 'kg', unitPrice: 1500, salePrice: 1500, category: 'Verduras y Hortalizas', emoji: '🎃', promotion: null },
  { id: 33, name: 'Calabaza', stock: 35, unit: 'kg', unitPrice: 1500, salePrice: 1500, category: 'Verduras y Hortalizas', emoji: '🎃', promotion: null },
  { id: 34, name: 'Choclo', stock: 50, unit: 'u', unitPrice: 1000, salePrice: 1000, category: 'Verduras y Hortalizas', emoji: '🌽', promotion: { quantity: 2, price: 1500 } },
  { id: 35, name: 'Jengibre', stock: 20, unit: '1/4 kg', unitPrice: 1500, salePrice: 1500, category: 'Verduras y Hortalizas', emoji: '🫚', promotion: null },
  { id: 36, name: 'Pepino', stock: 40, unit: 'kg', unitPrice: 2000, salePrice: 2000, category: 'Verduras y Hortalizas', emoji: '🥒', promotion: null },
  { id: 37, name: 'Tomate', stock: 15, unit: 'kg', unitPrice: 1500, salePrice: 1500, category: 'Verduras y Hortalizas', emoji: '🍅', promotion: { quantity: 2, price: 2500 } },
  { id: 38, name: 'Tomate cherry', stock: 10, unit: 'kg', unitPrice: 6000, salePrice: 6000, category: 'Verduras y Hortalizas', emoji: '🍅', promotion: null },
  { id: 39, name: 'Zapallito', stock: 25, unit: 'kg', unitPrice: 1500, salePrice: 1500, category: 'Verduras y Hortalizas', emoji: '🥒', promotion: { quantity: 2, price: 2500 } },
  { id: 40, name: 'Zucchini', stock: 20, unit: 'kg', unitPrice: 2000, salePrice: 2000, category: 'Verduras y Hortalizas', emoji: '🥒', promotion: null },

  // Pimiento
  { id: 41, name: 'Pimiento Rojo', stock: 15, unit: 'kg', unitPrice: 5000, salePrice: 5000, category: 'Pimiento', emoji: '🌶', promotion: null },
  { id: 42, name: 'Pimiento Verde', stock: 20, unit: 'kg', unitPrice: 3000, salePrice: 3000, category: 'Pimiento', emoji: '🫑', promotion: null },
  { id: 43, name: 'Pimiento Amarillo', stock: 12, unit: 'kg', unitPrice: 6000, salePrice: 6000, category: 'Pimiento', emoji: '🟡', promotion: null },

  // Frutas (adicionales)
  { id: 44, name: 'Uva rosada sin semilla', stock: 18, unit: 'kg', unitPrice: 6000, salePrice: 6000, category: 'Frutas', emoji: '🍇', promotion: null },
  { id: 45, name: 'Frutilla', stock: 15, unit: 'bandeja', unitPrice: 3500, salePrice: 3500, category: 'Frutas', emoji: '🍓', promotion: { quantity: 2, price: 6000 } },

  // Verduras Raíz
  { id: 46, name: 'Papa', stock: 47, unit: 'kg', unitPrice: 1000, salePrice: 1000, category: 'Verduras Raíz', emoji: '🥔', promotion: { quantity: 2, price: 1500 } },
  { id: 47, name: 'Papa lavada', stock: 30, unit: 'kg', unitPrice: 2000, salePrice: 2000, category: 'Verduras Raíz', emoji: '🥔', promotion: null },
  { id: 48, name: 'Papines blancos', stock: 20, unit: '800gr', unitPrice: 3500, salePrice: 3500, category: 'Verduras Raíz', emoji: '🥔', promotion: null },
  { id: 49, name: 'Batata/Camote', stock: 25, unit: 'kg', unitPrice: 2000, salePrice: 2000, category: 'Verduras Raíz', emoji: '🍠', promotion: null },
  { id: 50, name: 'Boniato/Calamote', stock: 20, unit: 'kg', unitPrice: 2500, salePrice: 2500, category: 'Verduras Raíz', emoji: '🍠', promotion: null },
  { id: 51, name: 'Zanahoria', stock: 19, unit: 'kg', unitPrice: 1500, salePrice: 1500, category: 'Verduras Raíz', emoji: '🥕', promotion: { quantity: 2, price: 2000 } },
  { id: 52, name: 'Remolacha', stock: 15, unit: 'atado', unitPrice: 2000, salePrice: 2000, category: 'Verduras Raíz', emoji: '🫜', promotion: null },

  // Verduras de Hoja
  { id: 53, name: 'Apio', stock: 12, unit: 'u', unitPrice: 3000, salePrice: 3000, category: 'Verduras de Hoja', emoji: '🥬', promotion: null },
  { id: 54, name: 'Acelga', stock: 25, unit: 'atado', unitPrice: 1000, salePrice: 1000, category: 'Verduras de Hoja', emoji: '🌿', promotion: { quantity: 2, price: 1500 } },
  { id: 55, name: 'Lechuga arrepollada', stock: 20, unit: 'kg', unitPrice: 3000, salePrice: 3000, category: 'Verduras de Hoja', emoji: '🥬', promotion: null },
  { id: 56, name: 'Lechuga de hoja', stock: 18, unit: 'kg', unitPrice: 3000, salePrice: 3000, category: 'Verduras de Hoja', emoji: '🥬', promotion: null },
  { id: 57, name: 'Espinaca', stock: 22, unit: 'atado', unitPrice: 1500, salePrice: 1500, category: 'Verduras de Hoja', emoji: '🌿', promotion: { quantity: 2, price: 2000 } },
  { id: 58, name: 'Repollo blanco', stock: 30, unit: 'kg', unitPrice: 1500, salePrice: 1500, category: 'Verduras de Hoja', emoji: '🥬', promotion: null },
  { id: 59, name: 'Repollo morado', stock: 15, unit: 'kg', unitPrice: 2000, salePrice: 2000, category: 'Verduras de Hoja', emoji: '🥬', promotion: null },
  { id: 60, name: 'Rúcula', stock: 8, unit: 'atado', unitPrice: 1000, salePrice: 1000, category: 'Verduras de Hoja', emoji: '🌿', promotion: { quantity: 3, price: 2000 } },

  // Verduras de Tallo
  { id: 61, name: 'Cebolla', stock: 35, unit: 'kg', unitPrice: 750, salePrice: 750, category: 'Verduras de Tallo', emoji: '🧅', promotion: { quantity: 2, price: 1000 } },
  { id: 62, name: 'Cebolla de verdeo', stock: 40, unit: '100gr', unitPrice: 500, salePrice: 500, category: 'Verduras de Tallo', emoji: '🧅', promotion: null },
  { id: 63, name: 'Cebolla morada', stock: 20, unit: 'kg', unitPrice: 1500, salePrice: 1500, category: 'Verduras de Tallo', emoji: '🧅', promotion: null },
  { id: 64, name: 'Puerro', stock: 15, unit: '100gr', unitPrice: 500, salePrice: 500, category: 'Verduras de Tallo', emoji: '🧅', promotion: null },

  // Verduras de Flor
  { id: 65, name: 'Brócoli', stock: 18, unit: 'u', unitPrice: 3500, salePrice: 3500, category: 'Verduras de Flor', emoji: '🥦', promotion: null },
  { id: 66, name: 'Coliflor', stock: 15, unit: 'u', unitPrice: 3000, salePrice: 3000, category: 'Verduras de Flor', emoji: '🥦', promotion: null },
  { id: 67, name: 'Repollito de Br.', stock: 10, unit: 'bandeja', unitPrice: 3500, salePrice: 3500, category: 'Verduras de Flor', emoji: '🥦', promotion: null },

  // Fuego
  { id: 68, name: 'Carbón', stock: 25, unit: '4 kg', unitPrice: 3500, salePrice: 3500, category: 'Fuego', emoji: '🔥', promotion: { quantity: 2, price: 6000 } }
];

export const mockInventory = mockSaleProducts.map(product => ({
  id: product.id,
  name: product.name,
  stock: product.stock,
  unit: product.unit,
  lastUpdated: '2025-07-13T14:30:00Z', // Set default lastUpdated
  salePrice: product.salePrice,
  promotion: product.promotion
}));

export const mockWeeklySales = [
  { day: 'Lun', sales: 115 }, { day: 'Mar', sales: 122 }, { day: 'Mié', sales: 118 },
  { day: 'Jue', sales: 125 }, { day: 'Vie', sales: 190 }, { day: 'Sáb', sales: 165 },
  { day: 'Dom', sales: 82 },
];

export const mockRecentActivity = [
    { id: 1, type: 'Venta', description: 'Venta #1024 finalizada', time: 'hace 5 minutos', user: 'Admin' },
    { id: 2, type: 'Inventario', description: 'Stock de "Papa" ajustado a 47 kg', time: 'hace 1 hora', user: 'Admin' },
    { id: 3, type: 'Compra', description: 'Compra de "Tomates" registrada', time: 'hace 3 horas', user: 'Admin' },
    { id: 4, type: 'Venta', description: 'Venta #1023 finalizada', time: 'hace 5 horas', user: 'Admin' },
];

export const mockReportData = [
  { id: "V-1024", date: "2025-07-13", total: 150.5, user: "Admin" },
  { id: "V-1025", date: "2025-07-13", total: 88.0, user: "Admin" },
  { id: "C-0056", date: "2025-07-12", total: 1200.0, supplier: "Proveedor A" },
  { id: "V-1026", date: "2025-07-14", total: 230.75, user: "Empleado1" },
  { id: "V-1027", date: "2025-07-14", total: 99.99, user: "Empleado2" },
  { id: "C-0057", date: "2025-07-13", total: 800.0, supplier: "Proveedor B" },
  { id: "V-1028", date: "2025-07-15", total: 342.0, user: "Admin" },
  { id: "C-0058", date: "2025-07-15", total: 1500.5, supplier: "Proveedor A" },
  { id: "V-1029", date: "2025-07-16", total: 410.0, user: "Empleado1" },
  { id: "V-1030", date: "2025-07-17", total: 275.25, user: "Empleado2" },
  { id: "C-0059", date: "2025-07-16", total: 920.0, supplier: "Proveedor C" },
  { id: "V-1031", date: "2025-07-18", total: 198.5, user: "Admin" },
  { id: "V-1032", date: "2025-07-18", total: 120.0, user: "Empleado1" },
  { id: "C-0060", date: "2025-07-17", total: 1100.0, supplier: "Proveedor B" },
  { id: "V-1033", date: "2025-07-19", total: 305.0, user: "Empleado2" },
  { id: "V-1034", date: "2025-07-19", total: 89.99, user: "Admin" },
  { id: "C-0061", date: "2025-07-19", total: 990.0, supplier: "Proveedor C" },
  { id: "V-1035", date: "2025-07-20", total: 460.0, user: "Empleado1" },
  { id: "C-0062", date: "2025-07-20", total: 760.0, supplier: "Proveedor A" },
  { id: "V-1036", date: "2025-07-20", total: 189.75, user: "Empleado2" },
];
