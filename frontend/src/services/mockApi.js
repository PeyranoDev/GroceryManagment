import { 
  mockSaleProducts, 
  mockInventory, 
  mockWeeklySales, 
  mockRecentActivity, 
  mockReportData 
} from '../data/products.js';
import { users as mockUsers } from '../data/users.js';

// Simulate network delay for realistic demo
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock response - returns data directly (no wrapper needed for demo mode)
const mockResponse = (data) => data;

// Mock local storage for demo persistence
  let mockSalesData = [
    {
      id: 1032,
      date: '2025-11-15T14:23:00Z',
      type: 'Presencial',
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
      items: [
        { productId: 1, productName: 'Mango', quantity: 2, unitPrice: 2000, promotionApplied: false, totalPrice: 4000 },
        { productId: 2, productName: 'Banana Bolivia', quantity: 1, unitPrice: 1500, promotionApplied: false, totalPrice: 1500 }
      ],
      subtotal: 5500,
      deliveryCost: 0,
      total: 5500,
      userId: 1,
      customerName: 'Carlos',
      customerPhone: '',
      deliveryAddress: '',
      paymentMethod: 'Efectivo'
    },
    {
      id: 1033,
      date: '2025-11-15T18:45:00Z',
      type: 'OnlineDelivery',
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
      items: [
        { productId: 23, productName: 'Ensalada hervida', quantity: 2, unitPrice: 3000, promotionApplied: false, totalPrice: 6000 },
        { productId: 27, productName: 'Palta', quantity: 3, unitPrice: 1300, promotionApplied: false, totalPrice: 3900 }
      ],
      subtotal: 9900,
      deliveryCost: 3000,
      total: 12900,
      userId: 1,
      customerName: 'Ana',
      customerPhone: '+54 9 11 5555-1111',
      deliveryAddress: 'Av. Siempre Viva 742',
      paymentMethod: 'Transferencia'
    },
    {
      id: 1034,
      date: '2025-11-16T10:05:00Z',
      type: 'Presencial',
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
      items: [
        { productId: 20, productName: 'Champignones', quantity: 3, unitPrice: 5000, promotionApplied: false, totalPrice: 15000 },
        { productId: 29, productName: 'Sopa', quantity: 1, unitPrice: 2500, promotionApplied: false, totalPrice: 2500 }
      ],
      subtotal: 17500,
      deliveryCost: 0,
      total: 17500,
      userId: 1,
      customerName: 'Lucía',
      customerPhone: '',
      deliveryAddress: '',
      paymentMethod: 'Tarjeta'
    },
    {
      id: 1035,
      date: '2025-11-16T12:30:00Z',
      type: 'OnlineDelivery',
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
      items: [
        { productId: 37, productName: 'Tomate', quantity: 5, unitPrice: 1500, promotionApplied: false, totalPrice: 7500 },
        { productId: 7, productName: 'Naranja jugo', quantity: 4, unitPrice: 1000, promotionApplied: false, totalPrice: 4000 }
      ],
      subtotal: 11500,
      deliveryCost: 5000,
      total: 16500,
      userId: 1,
      customerName: 'Mariano',
      customerPhone: '+54 9 11 5555-2222',
      deliveryAddress: 'Calle Falsa 123',
      paymentMethod: 'Efectivo'
    },
    {
      id: 1036,
      date: '2025-11-16T16:10:00Z',
      type: 'Presencial',
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
      items: [
        { productId: 24, productName: 'Huevo blanco', quantity: 1, unitPrice: 7500, promotionApplied: false, totalPrice: 7500 },
        { productId: 68, productName: 'Carbón', quantity: 2, unitPrice: 3500, promotionApplied: false, totalPrice: 7000 }
      ],
      subtotal: 14500,
      deliveryCost: 0,
      total: 14500,
      userId: 1,
      customerName: 'Sofía',
      customerPhone: '',
      deliveryAddress: '',
      paymentMethod: 'Transferencia'
    }
  ];
  let mockActivitiesData = [...mockRecentActivity];
  let saleIdCounter = 1037;

  (() => {
    const mkItem = (pid, qty) => {
      const p = mockSaleProducts.find(x => x.id === pid);
      const up = (p?.unitPrice ?? p?.salePrice) || 0;
      return {
        productId: pid,
        productName: p?.name || '',
        quantity: qty,
        unitPrice: up,
        promotionApplied: false,
        totalPrice: qty * up,
      };
    };
    const mkSale = (items, extra = {}) => {
      const subtotal = items.reduce((s, i) => s + (i.totalPrice || 0), 0);
      const deliveryCost = extra.deliveryCost || 0;
      return {
        id: saleIdCounter++,
        date: new Date().toISOString(),
        type: extra.type || 'Presencial',
        orderStatus: 'Delivered',
        paymentStatus: 'Paid',
        items,
        subtotal,
        deliveryCost,
        total: subtotal + deliveryCost,
        userId: 1,
        customerName: extra.customerName || 'Cliente',
        customerPhone: extra.customerPhone || '',
        deliveryAddress: extra.deliveryAddress || '',
        paymentMethod: extra.paymentMethod || 'Efectivo',
      };
    };
    const todaySales = [
      mkSale([mkItem(1, 2), mkItem(7, 3)], { type: 'Presencial', customerName: 'Luis', paymentMethod: 'Efectivo' }),
      mkSale([mkItem(24, 1), mkItem(27, 2)], { type: 'OnlineDelivery', deliveryCost: 3000, customerName: 'Marta', customerPhone: '+54 9 11 5555-3333', deliveryAddress: 'Av. Siempre Viva 123', paymentMethod: 'Transferencia' }),
      mkSale([mkItem(37, 4)], { type: 'Presencial', customerName: 'Pedro', paymentMethod: 'Tarjeta' }),
    ];
    mockSalesData = todaySales.concat(mockSalesData);
  })();

  // Mock purchases data (latest purchase with 5 items, date 2025-11-13)
  const mockPurchasesData = [
    {
      id: 'C-20251113-001',
      date: '2025-11-13',
      supplier: 'Proveedor A',
      total: 22345.89,
      items: [
        { productName: 'Banana Bolivia', quantity: 30, unit: 'kg', totalPrice: 45000 },
        { productName: 'Mango', quantity: 20, unit: 'u', totalPrice: 40000 },
        { productName: 'Papa', quantity: 50, unit: 'kg', totalPrice: 50000 },
        { productName: 'Tomate', quantity: 25, unit: 'kg', totalPrice: 37500 },
        { productName: 'Lechuga arrepollada', quantity: 15, unit: 'kg', totalPrice: 15000 },
      ],
    },
  ];

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
      type: cartData.type || (cartData.deliveryAddress ? 'OnlineDelivery' : (cartData.customerPhone ? 'OnlinePickup' : 'Presencial')),
      orderStatus: cartData.orderStatus || 'Created',
      paymentStatus: cartData.paymentStatus || 'Pending',
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
      whatsappMessage: cartData.whatsappMessage,
      payments: cartData.payments || []
    };
    
    mockSalesData.unshift(sale);
    
    // Stock deduction only when order moves to InPreparation (simulado si orderStatus ya es InPreparation)
    if (sale.orderStatus === 'InPreparation' || sale.orderStatus === 'Delivered' || sale.orderStatus === 'OutForDelivery' || sale.orderStatus === 'ReadyForPickup') {
      cartData.items.forEach(item => {
        const inventoryItem = mockInventory.find(inv => inv.id === item.product.id);
        if (inventoryItem) {
          inventoryItem.stock = Math.max(0, inventoryItem.stock - item.quantity);
          inventoryItem.lastUpdated = new Date().toISOString();
        }
      });
    }
    
    return mockResponse(sale);
  },
  updateOrderStatus: async (id, newStatus) => {
    await delay();
    const sale = mockSalesData.find(s => s.id === id);
    if (!sale) throw new Error('Venta no encontrada');
    const prev = sale.orderStatus;
    sale.orderStatus = newStatus;
    // Deduct stock when moving into InPreparation; Restock if reverting to Created
    if (prev !== 'InPreparation' && newStatus === 'InPreparation') {
      (sale.items || []).forEach(it => {
        const inventoryItem = mockInventory.find(inv => inv.id === it.productId);
        if (inventoryItem) {
          inventoryItem.stock = Math.max(0, inventoryItem.stock - it.quantity);
          inventoryItem.lastUpdated = new Date().toISOString();
        }
      });
    } else if (prev === 'InPreparation' && newStatus === 'Created') {
      (sale.items || []).forEach(it => {
        const inventoryItem = mockInventory.find(inv => inv.id === it.productId);
        if (inventoryItem) {
          inventoryItem.stock = inventoryItem.stock + it.quantity;
          inventoryItem.lastUpdated = new Date().toISOString();
        }
      });
    }
    return mockResponse(sale);
  },
  addPayment: async (id, payment) => {
    await delay();
    const sale = mockSalesData.find(s => s.id === id);
    if (!sale) throw new Error('Venta no encontrada');
    sale.payments = sale.payments || [];
    sale.payments.push({ ...payment, recordedAt: new Date().toISOString() });
    const paid = sale.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    if (paid <= 0) sale.paymentStatus = 'Pending';
    else if (paid < (sale.total || 0)) sale.paymentStatus = 'PartiallyPaid';
    else sale.paymentStatus = 'Paid';
    return mockResponse({ sale, paid });
  },
  updatePaymentStatus: async (id, status) => {
    await delay();
    const sale = mockSalesData.find(s => s.id === id);
    if (!sale) throw new Error('Venta no encontrada');
    sale.paymentStatus = status;
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
  getData: async (activitiesCount = 4, activitiesDays = 30) => {
    await delay();
    const lowStockCount = mockInventory.filter(item => item.stock < 10).length;
    const now = new Date();
    const todayStr = now.toDateString();
    const year = now.getFullYear();
    const month = now.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
    const startOfPrevMonth = new Date(year, month - 1, 1);
    const endOfPrevMonth = new Date(year, month, 0, 23, 59, 59, 999);
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toDateString();

    const todaySales = mockSalesData.filter(s => new Date(s.date).toDateString() === todayStr).length;
    const yesterdaySales = mockSalesData.filter(s => new Date(s.date).toDateString() === yesterday).length;

    const thisMonthSales = mockSalesData.filter(s => {
      const d = new Date(s.date);
      return d >= startOfMonth && d <= endOfMonth;
    });
    const prevMonthSales = mockSalesData.filter(s => {
      const d = new Date(s.date);
      return d >= startOfPrevMonth && d <= endOfPrevMonth;
    });

    const monthlyRevenue = thisMonthSales.reduce((sum, s) => sum + (s.total || 0), 0);
    const prevMonthlyRevenue = prevMonthSales.reduce((sum, s) => sum + (s.total || 0), 0);
    const monthlyCount = thisMonthSales.length;
    const prevMonthlyCount = prevMonthSales.length;
    const averageTicket = monthlyCount > 0 ? monthlyRevenue / monthlyCount : 0;
    const prevAverageTicket = prevMonthlyCount > 0 ? prevMonthlyRevenue / prevMonthlyCount : 0;

    const pct = (a, b) => {
      if (!b && !a) return 'Sin datos de comparación';
      if (!b && a) return '+100%';
      const diff = ((a - b) / (b || 1)) * 100;
      const sign = diff >= 0 ? '+' : '';
      return `${sign}${diff.toFixed(0)}%`;
    };

    return mockResponse({
      stats: {
        todaySales,
        todaySalesComparison: pct(todaySales, yesterdaySales),
        monthlyRevenue,
        monthlyRevenueComparison: pct(monthlyRevenue, prevMonthlyRevenue),
        averageTicket,
        averageTicketComparison: pct(averageTicket, prevAverageTicket),
        lowStockCount
      },
      weeklySales: mockWeeklySales,
      recentActivities: mockActivitiesData.slice(0, activitiesCount)
    });
  },
  getStats: async () => {
    const data = await mockDashboardAPI.getData(0, 0);
    return mockResponse(data.stats);
  },
  getWeeklySales: async () => {
    await delay();
    return mockResponse(mockWeeklySales);
  },
};

export const mockRecentActivitiesAPI = {
  // Simplified API matching new backend endpoint
  getAll: async (count = 10, days = 30) => {
    await delay();
    return mockResponse(mockActivitiesData.slice(0, count));
  },
  getRecent: async (count = 10, days = 30) => {
    await delay();
    return mockResponse(mockActivitiesData.slice(0, count));
  },
};

export const mockPurchasesAPI = {
  getAll: async () => {
    await delay();
    return mockResponse(mockPurchasesData);
  },
  getLatest: async () => {
    await delay();
    return mockResponse(mockPurchasesData[0]);
  },
  getByDate: async (date) => {
    await delay();
    const d = typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0];
    const purchases = mockPurchasesData.filter(p => p.date === d);
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

export const mockUsersAPI = {
  getAll: async () => {
    await delay();
    return mockResponse([...mockUsers]);
  },
  getById: async (id) => {
    await delay();
    const user = mockUsers.find(u => u.id === parseInt(id));
    if (!user) throw new Error('Usuario no encontrado');
    return mockResponse(user);
  },
  create: async (user) => {
    await delay();
    const nextId = Math.max(...mockUsers.map(u => u.id)) + 1;
    const newUser = { id: nextId, isSuperAdmin: !!user.isSuperAdmin, ...user };
    mockUsers.push(newUser);
    return mockResponse(newUser);
  },
  update: async (id, user) => {
    await delay();
    const idx = mockUsers.findIndex(u => u.id === parseInt(id));
    if (idx === -1) throw new Error('Usuario no encontrado');
    mockUsers[idx] = { ...mockUsers[idx], ...user, id: parseInt(id) };
    return mockResponse(mockUsers[idx]);
  },
  delete: async (id) => {
    await delay();
    const idx = mockUsers.findIndex(u => u.id === parseInt(id));
    if (idx === -1) throw new Error('Usuario no encontrado');
    mockUsers.splice(idx, 1);
    return mockResponse({ success: true });
  },
};
