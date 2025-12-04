export const isEmpty = (v) => v === undefined || v === null || String(v).trim() === "";

export const isInvalidProduct = (p) => {
  const hasValidProduct = p.selectedItemId || p.selectedProductId;
  return isEmpty(p.name) || isEmpty(p.quantity) || !hasValidProduct || p.invalid || p.invalidProduct || p.invalidQuantity;
};

