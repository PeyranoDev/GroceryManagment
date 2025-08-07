import Card from "../ui/card/Card";
import SaleItemRow from "./SaleItemRow";

const SalesCart = ({ 
  cart, 
  onQuantityChange, 
  onRemove, 
  onTogglePromotion,
  productSearchComponent // Recibir el componente como prop
}) => {
  return (
    <Card
      className="lg:col-span-2 h-fit min-h-[400px]"
      title="Productos en la Venta"
      actions={productSearchComponent} // Usar el componente pasado como prop
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase">
            <tr>
              <th className="p-3">Producto</th>
              <th className="p-3">Cantidad</th>
              <th className="p-3">Unidad</th>
              <th className="p-3">Precio Unit.</th>
              <th className="p-3">Total</th>
              <th className="p-3">Promoción</th>
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
                <td colSpan="7" className="text-center p-6 text-gray-500">
                  Aún no hay productos en la venta.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default SalesCart;