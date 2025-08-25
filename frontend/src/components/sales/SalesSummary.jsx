import { Info } from "lucide-react";
import Card from "../ui/card/Card";

const SalesSummary = ({ 
  subtotal, 
  total, 
  deliveryCost, 
  isOnline 
}) => {
  return (
    <Card title="Resumen de Venta">
      <div className="space-y-2">
        <div className="flex justify-between text-gray-300">
          <p>Subtotal:</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>
        {isOnline && deliveryCost > 0 && (
          <div className="flex justify-between text-gray-300">
            <p>Costo de Envío:</p>
            <p>${parseFloat(deliveryCost).toFixed(2)}</p>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold text-white border-t border-gray-600 pt-2 mt-2">
          <p>Total:</p>
          <p>${total.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-4 p-3 bg-blue-900/30 rounded-lg flex items-start gap-2 text-blue-300 text-sm">
        <Info size={18} className="flex-shrink-0 mt-0.5" />
        <p>
          {isOnline
            ? "Venta online: Se pueden generar mensajes de WhatsApp para el cliente."
            : "Se aplicaron promociones automáticamente. Revise los precios antes de finalizar."}
        </p>
      </div>
    </Card>
  );
};

export default SalesSummary;