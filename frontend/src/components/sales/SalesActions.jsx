import { Save, MessageCircle, Trash2 } from "lucide-react";
import Card from "../ui/card/Card";

const SalesActions = ({ 
  cart,
  details,
  onSave,
  onClear,
  onShowWhatsApp,
  isLoading 
}) => {
  const canSave = cart.length > 0;
  const canGenerateMessage = cart.length > 0 && details?.isOnline;

  return (
    <Card title="Acciones" className="">
      <div className="flex flex-col gap-3">
        <button
          onClick={onSave}
          disabled={!canSave || isLoading}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {isLoading ? "Guardando..." : "Guardar Venta"}
        </button>
        
        {details?.isOnline && (
          <button
            onClick={onShowWhatsApp}
            disabled={!canGenerateMessage}
            className="w-full btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle size={18} />
            Generar Mensaje WhatsApp
          </button>
        )}
        
        <button
          onClick={onClear}
          disabled={cart.length === 0}
          className="w-full bg-red-600 hover:bg-red-700 text-[var(--color-text)] py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={18} />
          Limpiar Carrito
        </button>
      </div>
    </Card>
  );
};

export default SalesActions;