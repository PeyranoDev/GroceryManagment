export const clamp = (n, min, max) => {
  const num = Number(n || 0);
  if (Number.isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
};

export const sanitizeInt = (value) => {
  let s = String(value ?? '').replace(/[^0-9]/g, '');
  if (s === '') return 0;
  return parseInt(s, 10) || 0;
};

