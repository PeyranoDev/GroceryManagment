export const isEmpty = (v) => v === undefined || v === null || String(v).trim() === "";

export const isInvalidProduct = (p) => {
  return isEmpty(p.name) || isEmpty(p.quantity) || !p.selectedItemId || p.invalid || p.invalidProduct || p.invalidQuantity;
};

