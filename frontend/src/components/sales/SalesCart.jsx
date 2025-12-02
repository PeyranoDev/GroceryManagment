import Card from "../ui/card/Card";
import SaleItemRow from "./SaleItemRow";

const SalesCart = ({ 
  cart, 
  onQuantityChange, 
  onRemove, 
  onTogglePromotion,
  productSearchComponent,
  footerActions
}) => {
  return (
    <Card
      className="lg:col-span-2 h-fit !w-auto inline-block"
      title="Productos en la Venta"
      actions={productSearchComponent}
    >
      <div className="hidden md:block overflow-x-auto">
        <table className="table-auto text-sm text-left">
          <thead className="text-xs text-[var(--color-secondary-text)] uppercase">
            <tr>
              <th className="p-3">Producto</th>
              <th className="p-3">Cantidad</th>
              <th className="p-3">Unidad</th>
              <th className="p-3">Precio Unit.</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cart.length > 0 ? (
              cart.map((item) => (
                <SaleItemRow
                  key={item.product.id}
                  item={item}
                  onQuantityChange={onQuantityChange}
                  onRemove={onRemove}
                  onTogglePromotion={onTogglePromotion}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-[var(--color-secondary-text)]">
                  Aún no hay productos en la venta.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {cart.length > 0 ? (
          cart.map((item) => (
            <SaleItemRow
              key={item.product.id}
              item={item}
              onQuantityChange={onQuantityChange}
              onRemove={onRemove}
              onTogglePromotion={onTogglePromotion}
              isMobile={true}
            />
          ))
        ) : (
          <div className="text-center p-6 text-[var(--color-secondary-text)]">
            Aún no hay productos en la venta.
          </div>
        )}
      </div>
      {footerActions && (
        <div className="flex justify-between mt-3">
          {footerActions}
        </div>
      )}
    </Card>
  );
};

export default SalesCart;
