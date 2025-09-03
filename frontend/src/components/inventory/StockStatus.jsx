
const StockStatus = ({ stock }) => {
  if (stock === 0)
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[var(--color-error)]"></span>
        <span className="text-[var(--color-error)]">Sin Stock</span>
      </div>
    );

  if (stock <= 10)
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[var(--color-warning)]"></span>
        <span className="text-[var(--color-warning)]">Bajo Stock</span>
      </div>
    );

  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-[var(--color-success)]"></span>
      <span className="text-[var(--color-success)]">En Stock</span>
    </div>
  );
};

export default StockStatus;
