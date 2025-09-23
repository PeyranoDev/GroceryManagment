import { 
  mockSaleProducts, 
  mockInventory, 
  mockWeeklySales, 
  mockRecentActivity, 
  mockReportData 
} from '../data/products.js';

// Simulate network delay for realistic demo
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock response wrapper to match API format
const mockResponse = (data) => ({ data });

// Mock local storage for demo persistence
let mockSalesData = [];
let mockActivitiesData = [...mockRecentActivity];
let saleIdCounter = 1037;

export const mockProductsAPI = {
  getAll: async () => {
    await delay();
    return mockResponse(mockSaleProducts);
  },
  getById: async (id) => {
    await delay();
    const product = mockSaleProducts.find(p => p.id === parseInt(id));
    if (!product) throw new Error('Producto no encontrado');
    return mockResponse(product);
  },
  create: async (product) => {
    await delay();
    const newProduct = { ...product, id: Math.max(...mockSaleProducts.map(p => p.id)) + 1 };
    mockSaleProducts.push(newProduct);
    return mockResponse(newProduct);
  },
  update: async (id, product) => {
    await delay();
    const index = mockSaleProducts.findIndex(p => p.id === parseInt(id));
    if (index === -1) throw new Error('Producto no encontrado');
    mockSaleProducts[index] = { ...product, id: parseInt(id) };
    return mockResponse(mockSaleProducts[index]);
  },
  delete: async (id) => {
    await delay();
    const index = mockSaleProducts.findIndex(p => p.id === parseInt(id));
    if (index === -1) throw new Error('Producto no encontrado');
    mockSaleProducts.splice(index, 1);
    return mockResponse({ success: true });
  },
};

export const mockInventoryAPI = {
  getAll: async () => {
    await delay();
    return mockResponse(mockInventory);
  },
  getFiltered: async (params = {}) => {
    await delay();
    let filtered = [...mockInventory];
    
    if (params.category) {
      filtered = filtered.filter(item => 
        mockSaleProducts.find(p => p.id === item.id)?.category === params.category
      );
    }
    
    if (params.lowStock) {
      filtered = filtered.filter(item => item.stock < 20);
    }
    
    return mockResponse(filtered);
  },
  getById: async (id) => {
    await delay();
    const item = mockInventory.find(i => i.id === parseInt(id));
    if (!item) throw new Error('Item de inventario no encontrado');
    return mockResponse(item);
  },
  getStockStatus: async (id) => {
    await delay();
    const item = mockInventory.find(i => i.id === parseInt(id));
    if (!item) throw new Error('Item no encontrado');
    
    let status = 'normal';
    if (item.stock === 0) status = 'out-of-stock';
    else if (item.stock < 10) status = 'low-stock';
    else if (item.stock < 20) status = 'medium-stock';
    
    return mockResponse({ status, stock: item.stock });
  },
  adjustStock: async (id, newStock) => {
    await delay();
    const item = mockInventory.find(i => i.id === parseInt(id));
    if (!item) throw new Error('Item no encontrado');
    
    item.stock = newStock;
    item.lastUpdated = new Date().toISOString();
    
    // Add activity
    const product = mockSaleProducts.find(p => p.id === parseInt(id));
    mockActivitiesData.unshift({
      id: Date.now(),
      type: 'Inventario',
      description: `Stock de "${product?.name}" ajustado a ${newStock} ${product?.unit}`,
      time: 'hace unos segundos',
      user: 'Admin'
    });
    
    return mockResponse(item);
  },
  getLowStock: async (threshold = 10) => {
    await delay();
    const lowStock = mockInventory.filter(item => item.stock < threshold);
    return mockResponse(lowStock);
  },
  getOutOfStock: async () => {
    await delay();
    const outOfStock = mockInventory.filter(item => item.stock === 0);
    return mockResponse(outOfStock);
  },
  create: async (item) => {
    await delay();
    const newItem = { ...item, id: Math.max(...mockInventory.map(i => i.id)) + 1 };
    mockInventory.push(newItem);
    return mockResponse(newItem);
  },
  update: async (id, item) => {
    await delay();
    const index = mockInventory.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Item no encontrado');
    mockInventory[index] = { ...item, id: parseInt(id) };
    return mockResponse(mockInventory[index]);
  },
  delete: async (id) => {
    await delay();
    const index = mockInventory.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Item no encontrado');
    mockInventory.splice(index, 1);
    return mockResponse({ success: true });
  },
};

export const mockSalesAPI = {
  getAll: async () => {
    await delay();
    return mockResponse(mockSalesData);
  },
  getById: async (id) => {
    await delay();
    const sale = mockSalesData.find(s => s.id === id);
    if (!sale) throw new Error('Venta no encontrada');
    return mockResponse(sale);
  },
  getByDateRange: async (startDate, endDate) => {
    await delay();
    const filtered = mockSalesData.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
    return mockResponse(filtered);
  },
  getByUserId: async (userId) => {
    await delay();
    const filtered = mockSalesData.filter(sale => sale.userId === userId);
    return mockResponse(filtered);
  },
  create: async (sale) => {
    await delay();
    const newSale = {
      ...sale,
      id: saleIdCounter++,
      date: new Date().toISOString(),
    };
    mockSalesData.unshift(newSale);
    return mockResponse(newSale);
  },
  createFromCart: async (cartData) => {
    await delay();
    
    const sale = {
      id: saleIdCounter++,
      date: new Date().toISOString(),
      items: cartData.items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.unitPrice,
        promotionApplied: item.promotionApplied,
        totalPrice: item.promotionApplied && item.product.promotion 
          ? (Math.floor(item.quantity / item.product.promotion.quantity) * item.product.promotion.price) +
            (item.quantity % item.product.promotion.quantity * item.product.unitPrice)
          : item.quantity * item.product.unitPrice
      })),
      subtotal: cartData.subtotal,
      deliveryCost: cartData.deliveryCost || 0,
      total: cartData.total,
      userId: cartData.userId,
      customerName: cartData.customerName,
      customerPhone: cartData.customerPhone,
      deliveryAddress: cartData.deliveryAddress,
      paymentMethod: cartData.paymentMethod,
      whatsappMessage: cartData.whatsappMessage
    };
    
    mockSalesData.unshift(sale);
    
    // Update inventory
    cartData.items.forEach(item => {
      const inventoryItem = mockInventory.find(inv => inv.id === item.product.id);
      if (inventoryItem) {
        inventoryItem.stock = Math.max(0, inventoryItem.stock - item.quantity);
        inventoryItem.lastUpdated = new Date().toISOString();
      }
    });
    
    return mockResponse(sale);
  },
  generateWhatsApp: async (id, details) => {
    await delay();
    const sale = mockSalesData.find(s => s.id === id);
    if (!sale) throw new Error('Venta no encontrada');
    
    const message = `🛒 *Detalle de tu pedido #${sale.id}*\n\n` +
      sale.items.map(item => 
        `• ${item.productName} x${item.quantity} - $${item.totalPrice}`
      ).join('\n') +
      `\n\n💰 *Total: $${sale.total}*` +
      (sale.deliveryAddress ? `\n📍 *Dirección: ${sale.deliveryAddress}*` : '') +
      `\n\n¡Gracias por tu compra! 😊`;
    
    return mockResponse({ message, url: `https://wa.me/${details.phone}?text=${encodeURIComponent(message)}` });
  },
  delete: async (id) => {
    await delay();
    const index = mockSalesData.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Venta no encontrada');
    mockSalesData.splice(index, 1);
    return mockResponse({ success: true });
  },
};

export const mockDashboardAPI = {
  getStats: async () => {
    await delay();
    const totalProducts = mockSaleProducts.length;
    const lowStockCount = mockInventory.filter(item => item.stock < 10).length;
    const todaySales = mockSalesData.filter(sale => {
      const today = new Date().toDateString();
      return new Date(sale.date).toDateString() === today;
    }).length;
    
    const totalRevenue = mockSalesData.reduce((sum, sale) => sum + sale.total, 0);
    
    return mockResponse({
      totalProducts,
      lowStockCount,
      todaySales,
      totalRevenue,
      outOfStockCount: mockInventory.filter(item => item.stock === 0).length
    });
  },
  getWeeklySales: async () => {
    await delay();
    return mockResponse(mockWeeklySales);
  },
};

export const mockRecentActivitiesAPI = {
  getAll: async () => {
    await delay();
    return mockResponse(mockActivitiesData);
  },
  getRecent: async (count = 10) => {
    await delay();
    return mockResponse(mockActivitiesData.slice(0, count));
  },
  getById: async (id) => {
    await delay();
    const activity = mockActivitiesData.find(a => a.id === parseInt(id));
    if (!activity) throw new Error('Actividad no encontrada');
    return mockResponse(activity);
  },
  create: async (activity) => {
    await delay();
    const newActivity = {
      ...activity,
      id: Date.now(),
      time: 'hace unos segundos'
    };
    mockActivitiesData.unshift(newActivity);
    return mockResponse(newActivity);
  },
  delete: async (id) => {
    await delay();
    const index = mockActivitiesData.findIndex(a => a.id === parseInt(id));
    if (index === -1) throw new Error('Actividad no encontrada');
    mockActivitiesData.splice(index, 1);
    return mockResponse({ success: true });
  },
};

export const mockPurchasesAPI = {
  getAll: async () => {
    await delay();
    // Generate some mock purchases from report data
    const purchases = mockReportData
      .filter(item => item.id.startsWith('C-'))
      .map(item => ({
        id: item.id,
        date: item.date,
        supplier: item.supplier,
        total: item.total,
        items: [
          {
            productName: 'Productos varios',
            quantity: Math.floor(Math.random() * 50) + 10,
            unitPrice: Math.floor(item.total / (Math.floor(Math.random() * 50) + 10)),
          }
        ]
      }));
    return mockResponse(purchases);
  },
  getById: async (id) => {
    await delay();
    const purchase = mockReportData
      .filter(item => item.id.startsWith('C-'))
      .find(item => item.id === id);
    if (!purchase) throw new Error('Compra no encontrada');
    return mockResponse({
      id: purchase.id,
      date: purchase.date,
      supplier: purchase.supplier,
      total: purchase.total,
      items: []
    });
  },
  getBySupplier: async (supplier) => {
    await delay();
    const purchases = mockReportData
      .filter(item => item.id.startsWith('C-') && item.supplier === supplier);
    return mockResponse(purchases);
  },
  getByDateRange: async (startDate, endDate) => {
    await delay();
    const purchases = mockReportData
      .filter(item => {
        const itemDate = new Date(item.date);
        return item.id.startsWith('C-') && 
               itemDate >= new Date(startDate) && 
               itemDate <= new Date(endDate);
      });
    return mockResponse(purchases);
  },
  create: async (purchase) => {
    await delay();
    const newPurchase = {
      ...purchase,
      id: `C-${String(Math.max(...mockReportData.map(r => r.id.startsWith('C-') ? parseInt(r.id.split('-')[1]) : 0)) + 1).padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0]
    };
    
    // Add to report data
    mockReportData.unshift({
      id: newPurchase.id,
      date: newPurchase.date,
      total: newPurchase.total,
      supplier: newPurchase.supplier
    });
    
    // Add activity
    mockActivitiesData.unshift({
      id: Date.now(),
      type: 'Compra',
      description: `Compra ${newPurchase.id} registrada por $${newPurchase.total}`,
      time: 'hace unos segundos',
      user: 'Admin'
    });
    
    return mockResponse(newPurchase);
  },
  update: async (id, purchase) => {
    await delay();
    const reportIndex = mockReportData.findIndex(r => r.id === id);
    if (reportIndex === -1) throw new Error('Compra no encontrada');
    
    mockReportData[reportIndex] = {
      ...mockReportData[reportIndex],
      total: purchase.total,
      supplier: purchase.supplier
    };
    
    return mockResponse({ ...purchase, id });
  },
  delete: async (id) => {
    await delay();
    const index = mockReportData.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Compra no encontrada');
    mockReportData.splice(index, 1);
    return mockResponse({ success: true });
  },
};

export const mockReportsAPI = {
  getFilteredReports: async (filters) => {
    await delay();
    let filtered = [...mockReportData];
    
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= new Date(filters.startDate) && 
               itemDate <= new Date(filters.endDate);
      });
    }
    
    if (filters.type) {
      if (filters.type === 'sales') {
        filtered = filtered.filter(item => item.id.startsWith('V-'));
      } else if (filters.type === 'purchases') {
        filtered = filtered.filter(item => item.id.startsWith('C-'));
      }
    }
    
    return mockResponse(filtered);
  },
  getSalesSummary: async () => {
    await delay();
    const sales = mockReportData.filter(item => item.id.startsWith('V-'));
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const avgSale = sales.length > 0 ? totalSales / sales.length : 0;
    
    return mockResponse({
      totalSales,
      salesCount: sales.length,
      averageSale: avgSale,
      lastSale: sales[0]?.date || null
    });
  },
  getTotalSales: async (startDate, endDate) => {
    await delay();
    const sales = mockReportData
      .filter(item => {
        const itemDate = new Date(item.date);
        return item.id.startsWith('V-') && 
               itemDate >= new Date(startDate) && 
               itemDate <= new Date(endDate);
      });
    
    const total = sales.reduce((sum, sale) => sum + sale.total, 0);
    return mockResponse({ total, count: sales.length });
  },
  getTotalPurchases: async (startDate, endDate) => {
    await delay();
    const purchases = mockReportData
      .filter(item => {
        const itemDate = new Date(item.date);
        return item.id.startsWith('C-') && 
               itemDate >= new Date(startDate) && 
               itemDate <= new Date(endDate);
      });
    
    const total = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
    return mockResponse({ total, count: purchases.length });
  },
};

export const mockCategoriesAPI = {
  getAll: async () => {
    await delay();
    const categories = [...new Set(mockSaleProducts.map(p => p.category))].map((name, index) => ({
      id: index + 1,
      name,
      productCount: mockSaleProducts.filter(p => p.category === name).length
    }));
    return mockResponse(categories);
  },
  getById: async (id) => {
    await delay();
    const categories = [...new Set(mockSaleProducts.map(p => p.category))];
    const category = categories[id - 1];
    if (!category) throw new Error('Categoría no encontrada');
    return mockResponse({
      id,
      name: category,
      productCount: mockSaleProducts.filter(p => p.category === category).length
    });
  },
  create: async (category) => {
    await delay();
    // In a real implementation, this would create a new category
    return mockResponse({ ...category, id: Date.now() });
  },
  update: async (id, category) => {
    await delay();
    return mockResponse({ ...category, id });
  },
  delete: async () => {
    await delay();
    return mockResponse({ success: true });
  },
};
