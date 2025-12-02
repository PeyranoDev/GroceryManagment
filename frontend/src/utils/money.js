export const formatCurrency = (n) => {
  const str = Number(n || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const parts = str.split(',');
  return { int: parts[0] || '0', dec: parts[1] || '00' };
};

export const formatCurrencyAR = (n) => {
  return Number(n || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const parseCurrencyAR = (val) => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return val;
  let s = String(val).trim();
  s = s.replace(/\s+/g, '');
  s = s.replace(/\./g, '');
  s = s.replace(/,/g, '.');
  const num = parseFloat(s);
  return Number.isNaN(num) ? 0 : num;
};

export const formatDecimalPlain = (n, digits = 2) => {
  return Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping: false });
};

