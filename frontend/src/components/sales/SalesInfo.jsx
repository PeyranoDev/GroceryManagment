import { Calendar, Clock, ShoppingCart, Store, ShoppingBag, Truck, MapPin, Phone, DollarSign } from "lucide-react";
import { useState } from "react";
import Card from "../ui/card/Card";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";

const SalesInfo = ({ details, onDetailChange, onNext }) => {
  const requiredValid = () => {
    const isOnline = !!details.isOnline;
    const hasDate = !!details.date;
    const hasTime = !!details.time;
    const hasClient = !isOnline || !!details.client?.trim();
    return hasDate && hasTime && hasClient;
  };
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const handleNext = () => {
    if (requiredValid()) {
      onNext && onNext();
    } else {
      setSubmitAttempt(true);
    }
  };
  return (
    <Card
      size="medium"
      title={
        <div className="flex items-center gap-2">
          <ShoppingCart size={22} /> Datos de Venta
        </div>
      }
      footer={
        <button
          type="button"
          onClick={handleNext}
          disabled={submitAttempt && !requiredValid()}
          className={`min-h-[48px] px-4 py-2 rounded-md font-semibold ${submitAttempt && !requiredValid() ? 'bg-[var(--color-secondary)]/50 text-[var(--color-secondary-text)] cursor-not-allowed' : 'bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-dark)] text-[var(--color-text)]'}`}
        >
          Siguiente
        </button>
      }
    >
      <form className="flex flex-col gap-6">
        {/* Tipo de Venta */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-medium text-[var(--color-secondary-text)] text-sm sm:text-base">Tipo de Venta:</span>
          <div className="flex items-center">
            <div className="flex rounded-full border border-[var(--color-border)] overflow-hidden">
              <button
                type="button"
                onClick={() => { onDetailChange("saleType", "Presencial"); onDetailChange("isOnline", false); onDetailChange("deliveryMethod", "Retiro en tienda"); }}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors select-none ${
                  (details.saleType || (!details.isOnline ? "Presencial" : "")) === "Presencial"
                    ? "bg-[var(--color-success-dark)]/60 text-[var(--color-success)]/80"
                    : "bg-transparent text-[var(--color-secondary-text)]"
                }`}
              >
                <Store size={16} /> Presencial
              </button>
              <button
                type="button"
                onClick={() => { onDetailChange("saleType", "Para Retirar"); onDetailChange("isOnline", true); onDetailChange("deliveryMethod", "Retiro en tienda"); }}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors select-none ${
                  (details.saleType || (details.isOnline ? "Para Retirar" : "")) === "Para Retirar"
                    ? "bg-[var(--color-success-dark)]/60 text-[var(--color-success)]/80"
                    : "bg-transparent text-[var(--color-secondary-text)]"
                }`}
              >
                <ShoppingBag size={16} /> Para Retirar
              </button>
              <button
                type="button"
                onClick={() => { onDetailChange("saleType", "Delivery"); onDetailChange("isOnline", true); onDetailChange("deliveryMethod", "Entrega a domicilio"); }}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors select-none ${
                  (details.saleType || (details.isOnline ? "Delivery" : "")) === "Delivery"
                    ? "bg-[var(--color-success-dark)]/60 text-[var(--color-success)]/80"
                    : "bg-transparent text-[var(--color-secondary-text)]"
                }`}
              >
                <Truck size={16} /> Delivery
              </button>
            </div>
          </div>
        </div>

        {/* Datos principales en dos columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Input
              type="date"
              value={details.date}
              onChange={(e) => onDetailChange("date", e.target.value)}
              icon={<Calendar size={16} className="text-[var(--color-secondary-text)] z-[1]" />}
              className="w-full"
              required
              label="Fecha"
              forceValidate={submitAttempt}
            />
          </div>
          <div>
            <Input
              type="time"
              value={details.time}
              onChange={(e) => onDetailChange("time", e.target.value)}
              icon={<Clock size={16} className="text-[var(--color-secondary-text)] z-[1]" />}
              className="w-full"
              required
              label="Hora"
              forceValidate={submitAttempt}
            />
          </div>
          
          {details.isOnline && (
            <>
              <div>
                <Input
                  placeholder={"Ej. Juan Pérez"}
                  value={details.client}
                  onChange={(e) => onDetailChange("client", e.target.value)}
                  className="w-full"
                  required
                  label="Nombre del cliente"
                  forceValidate={submitAttempt}
                />
              </div>
              <div>
                <Input
                  placeholder="Ej. 3413736789"
                  value={details.phone || ""}
                  onChange={(e) => onDetailChange("phone", e.target.value)}
                  icon={<Phone size={16} className="text-[var(--color-secondary-text)] z-[1]" />}
                  className="w-full"
                  required
                  label="Teléfono de contacto"
                  forceValidate={submitAttempt}
                />
              </div>
              {details.deliveryMethod === "Entrega a domicilio" && (
                <>
                  <div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Ej. Santa Fe 1234"
                          value={details.address || ""}
                          onChange={(e) => onDetailChange("address", e.target.value)}
                          icon={<MapPin size={16} className="text-[var(--color-secondary-text)] z-[1]" />}
                          className="w-full"
                          required
                          label="Dirección del cliente"
                          forceValidate={submitAttempt}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const q = (details.address || "").trim();
                          if (!q) return;
                          const url = `https://www.google.com/maps/search/${encodeURIComponent(q)}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className="relative group rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!details.address || !details.address.trim()}
                        aria-label="Abrir dirección en Google Maps"
                        title="Abrir en Google Maps"
                      >
                        <img src="https://static.vecteezy.com/system/resources/previews/016/716/478/non_2x/google-maps-icon-free-png.png" alt="Google Maps" className="w-10 h-10" />
                        <span className="absolute inset-0 rounded-md bg-[var(--color-bg-dark)]/40 opacity-0 transition-opacity group-hover:opacity-100"></span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <Input
                      placeholder="Ej. 1500"
                      value={details.deliveryCost || ""}
                      onChange={(e) => onDetailChange("deliveryCost", e.target.value)}
                      icon={<DollarSign size={16} className="text-[var(--color-secondary-text)] z-[1]" />}
                      className="w-full"
                      label="Costo de envío"
                      format="currency"
                    />
                  </div>
                </>
              )}
            </>
          )}
        
        </div>
      </form>
    </Card>
  );
};

export default SalesInfo;
