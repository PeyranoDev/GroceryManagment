import { memo } from "react";
import StockStatus from "./StockStatus";
import { Edit, Trash, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";

const DesktopTable = memo(function DesktopTable({ items, onAdjustClick, sortBy, sortDir, onSort, onDeleteClick, isAdmin = false }) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-t-md">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-[var(--color-secondary-text)] uppercase bg-[var(--color-border)]">
          <tr>
            <th className="p-3">
              <button
                onClick={() => onSort("name")}
                className="flex items-center gap-1 cursor-pointer select-none"
              >
                Producto
                {sortBy === "name" ? (
                  sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                ) : (
                  <ArrowUpDown size={14} />
                )}
              </button>
            </th>
            <th className="p-3">Stock Actual</th>
            <th className="p-3">Precio Venta</th>
            <th className="p-3">Estado</th>
            <th className="p-3">
              <button
                onClick={() => onSort("lastUpdated")}
                className="flex items-center gap-1 cursor-pointer select-none"
              >
                Última Actualización
                {sortBy === "lastUpdated" ? (
                  sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                ) : (
                  <ArrowUpDown size={14} />
                )}
              </button>
            </th>
            {isAdmin && (<th className="p-3 text-center">Acciones</th>)}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-[var(--color-border)]">
              <td className="p-3 font-medium text-[var(--color-text)]">
                {item.product?.name || item.name || "Producto sin nombre"}
              </td>
              <td className="p-3 font-mono text-[var(--color-secondary-text)]">
                {item.stock || 0} {item.product?.unit || item.unit || "u"}
              </td>
              <td className="p-3 font-mono text-[var(--color-secondary-text)]">
                ${((item.product?.salePrice ?? item.salePrice) || 0).toFixed(2)}
              </td>
              <td className="p-3">
                <StockStatus stock={item.stock || 0} />
              </td>
              <td className="p-3 text-[var(--color-secondary-text)]">
                {item.lastUpdated
                  ? new Date(item.lastUpdated).toLocaleString("es-AR")
                  : "—"}
              </td>
              {isAdmin && (
                <td className="p-3">
                  <div className="flex justify-center gap-5">
                    <button
                      onClick={() => onAdjustClick(item)}
                      className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)]"
                      title="Ajustar"
                    >
                      <Edit size={30} />
                    </button>
                    <button
                      onClick={() => onDeleteClick(item)}
                      className="text-[var(--color-error)] hover:text-[var(--color-error-dark)]"
                      title="Eliminar"
                    >
                      <Trash size={30} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="p-4 text-sm text-center text-[var(--color-secondary-text)]">
          No se encontraron productos.
        </div>
      )}
    </div>
  );
});

const MobileCards = memo(function MobileCards({ items, onAdjustClick, onDeleteClick, isAdmin = false }) {
  return (
    <div className="md:hidden space-y-4">
      {items.length > 0 ? (
        items.map((p) => (
          <div
            key={p.id}
            className="bg-[var(--surface)] border border-[var(--color-border)] rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-[var(--color-text)] text-base">
                  {p.name}
                </h3>
                <p className="text-sm text-[var(--color-secondary-text)] font-mono mt-1">
                  {p.stock} {p.unit}
                </p>
                <p className="text-sm text-[var(--color-secondary-text)] font-mono mt-1">
                  Precio: ${((p.salePrice) || 0).toFixed(2)}
                </p>
              </div>
              <StockStatus stock={p.stock} />
            </div>
            
            <div className="text-sm">
              <span className="text-[var(--color-secondary-text)]">Última actualización:</span>
              <p className="text-[var(--color-secondary-text)] mt-1">
                {p.lastUpdated
                  ? new Date(p.lastUpdated).toLocaleString("es-AR")
                  : "—"}
              </p>
            </div>
            
            {isAdmin && (
              <div className="flex justify-center gap-5 pt-2">
                <button
                  onClick={() => onAdjustClick(p)}
                  className="text-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)]"
                  title="Ajustar"
                >
                  <Edit size={30} />
                </button>
                <button
                  onClick={() => onDeleteClick(p)}
                  className="text-[var(--color-error)] hover:text-[var(--color-error-dark)]"
                  title="Eliminar"
                >
                  <Trash size={30} />
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="p-4 text-sm text-center text-[var(--color-secondary-text)]">
          No se encontraron productos.
        </div>
      )}
    </div>
  );
});

const InventoryList = memo(function InventoryList({ items, onAdjustClick, sortBy, sortDir, onSort, onDeleteClick, isAdmin = false }) {
  return (
    <>
      <DesktopTable items={items} onAdjustClick={onAdjustClick} sortBy={sortBy} sortDir={sortDir} onSort={onSort} onDeleteClick={onDeleteClick} isAdmin={isAdmin} />
      <MobileCards items={items} onAdjustClick={onAdjustClick} onDeleteClick={onDeleteClick} isAdmin={isAdmin} />
    </>
  );
});

export default InventoryList;
