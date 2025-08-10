import {
  Calendar,
  Clock,
  DollarSign,
  ShoppingCart,
  Store,
  Smartphone,
  MapPin,
  Phone,
} from "lucide-react";
import Card from "../ui/card/Card";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";

const SalesHeader = ({ details, onDetailChange }) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <ShoppingCart size={22} /> Nueva Venta
        </div>
      }
      actions={
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-300">Tipo de Venta:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDetailChange("isOnline", false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                !details.isOnline
                  ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
            >
              <Store size={16} /> Presencial
            </button>
            <button
              onClick={() => onDetailChange("isOnline", true)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                details.isOnline
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
            >
              <Smartphone size={16} /> Online (WhatsApp)
            </button>
          </div>
        </div>
      }
    >
      <form className="flex flex-col gap-4">
        {/* Campos básicos de la venta */}
        <div className="flex gap-4 justify-around">
          <Input
            type="date"
            value={details.date}
            onChange={(e) => onDetailChange("date", e.target.value)}
            icon={<Calendar size={16} className="text-gray-400" />}
          />
          <Input
            type="time"
            value={details.time}
            onChange={(e) => onDetailChange("time", e.target.value)}
            icon={<Clock size={16} className="text-gray-400" />}
          />
          <Input
            placeholder={
              details.isOnline
                ? "Nombre del cliente"
                : "Nombre del cliente (opcional)"
            }
            value={details.client}
            onChange={(e) => onDetailChange("client", e.target.value)}
            required={details.isOnline}
          />
          <Select
            value={details.paymentMethod}
            onChange={(e) => onDetailChange("paymentMethod", e.target.value)}
          >
            <option>Efectivo</option>
            <option>Tarjeta</option>
            <option>Transferencia</option>
          </Select>
        </div>

        {/* Campos específicos para ventas online */}
        {details.isOnline && (
          <div className="flex gap-4 justify-around">
            <Select
              value={details.deliveryMethod}
              onChange={(e) => onDetailChange("deliveryMethod", e.target.value)}
            >
              <option>Retiro en tienda</option>
              <option>Entrega a domicilio</option>
            </Select>

            {details.deliveryMethod === "Entrega a domicilio" && (
              <>
                <Input
                  type="number"
                  placeholder="Costo de envío"
                  value={details.deliveryCost}
                  onChange={(e) =>
                    onDetailChange("deliveryCost", e.target.value)
                  }
                  icon={<DollarSign size={16} className="text-gray-400" />}
                />
                <Input
                  placeholder="Dirección de entrega"
                  value={details.address || ""}
                  onChange={(e) => onDetailChange("address", e.target.value)}
                  icon={<MapPin size={16} className="text-gray-400" />}
                  required={details.deliveryMethod === "Entrega a domicilio"}
                />
              </>
            )}

            <Input
              placeholder="Teléfono de contacto"
              value={details.phone || ""}
              onChange={(e) => onDetailChange("phone", e.target.value)}
              icon={<Phone size={16} className="text-gray-400" />}
              required={details.isOnline}
            />
          </div>
        )}
      </form>
    </Card>
  );
};

export default SalesHeader;
