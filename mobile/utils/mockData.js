// Mock data for demo mode
export const mockProducts = [
    {
        id: 1,
        name: 'Coca Cola 2.25L',
        barcode: '7790895001239',
        unitPrice: 1250,
        stock: 45,
        promotion: {
            quantity: 2,
            price: 2200,
        },
    },
    {
        id: 2,
        name: 'Pan Lactal Bimbo',
        barcode: '7790310051234',
        unitPrice: 950,
        stock: 30,
        promotion: null,
    },
    {
        id: 3,
        name: 'Leche La Serenísima 1L',
        barcode: '7790120001456',
        unitPrice: 850,
        stock: 5, // Bajo stock
        promotion: {
            quantity: 3,
            price: 2400,
        },
    },
    {
        id: 4,
        name: 'Arroz Gallo Oro 1kg',
        barcode: '7790310087654',
        unitPrice: 1150,
        stock: 60,
        promotion: null,
    },
    {
        id: 5,
        name: 'Aceite Girasol Natura 900ml',
        barcode: '7790742001234',
        unitPrice: 1680,
        stock: 25,
        promotion: null,
    },
    {
        id: 6,
        name: 'Fideos Matarazzo 500g',
        barcode: '7790520001567',
        unitPrice: 720,
        stock: 8, // Bajo stock
        promotion: {
            quantity: 4,
            price: 2500,
        },
    },
    {
        id: 7,
        name: 'Yerba Mate Taragüi 1kg',
        barcode: '7790387000123',
        unitPrice: 2850,
        stock: 40,
        promotion: null,
    },
    {
        id: 8,
        name: 'Galletitas Oreo 118g',
        barcode: '7622300408596',
        unitPrice: 680,
        stock: 0, // Sin stock
        promotion: null,
    },
    {
        id: 9,
        name: 'Cerveza Quilmes 1L',
        barcode: '7790742900123',
        unitPrice: 950,
        stock: 75,
        promotion: {
            quantity: 6,
            price: 5200,
        },
    },
    {
        id: 10,
        name: 'Azúcar Ledesma 1kg',
        barcode: '7790070200456',
        unitPrice: 980,
        stock: 35,
        promotion: null,
    },
];

export const mockDashboardStats = {
    todaySales: 24,
    monthlyRevenue: 487500,
    averageTicket: 3250,
    lowStockCount: 3,
};

export const mockWeeklySales = [
    { day: 'Lun', sales: 45000 },
    { day: 'Mar', sales: 52000 },
    { day: 'Mié', sales: 38000 },
    { day: 'Jue', sales: 61000 },
    { day: 'Vie', sales: 72000 },
    { day: 'Sáb', sales: 85000 },
    { day: 'Dom', sales: 48000 },
];

export const mockInventory = mockProducts.map(product => ({
    ...product,
    id: product.id,
    name: product.name,
    barcode: product.barcode,
    unitPrice: product.unitPrice,
    stock: product.stock,
    promotion: product.promotion,
}));
