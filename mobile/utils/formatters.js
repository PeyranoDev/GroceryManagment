// Format currency values
export const formatCurrency = (value) => {
    if (value === undefined || value === null || value === '') return '$0.00';

    const num = typeof value === 'number' ? value : parseFloat(value);

    if (isNaN(num)) return '$0.00';

    return num.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

// Format USD currency
export const formatUSD = (value) => {
    if (value === undefined || value === null || value === '') return 'US$ 0.00';

    const num = typeof value === 'number' ? value : parseFloat(value);

    if (isNaN(num)) return 'US$ 0.00';

    return `US$ ${num.toFixed(2)}`;
};

// Format date to readable string
export const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

// Format time to HH:MM
export const formatTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
    });
};
