export const getUnitFromProduct = (product) => {
  const label = product?.unitLabel;
  if (label && String(label).trim() !== '') return label;
  const type = product?.unitType;
  if (type === 'peso') return 'kg';
  if (type === 'unidad') return 'u';
  return 'u';
};

