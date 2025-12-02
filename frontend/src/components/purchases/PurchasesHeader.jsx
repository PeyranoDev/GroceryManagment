import { useRef } from "react";
import { Calendar, Save, Copy } from "lucide-react";
import Input from "../ui/input/Input";

const PurchasesHeader = ({ onLoadPrevious, saveDisabled = false, onRequestSave, date, onDateChange, onRequestCopyExcel }) => {
  const dateInputRef = useRef(null);

  const handleSave = () => {
    onRequestSave && onRequestSave();
  };

  return (
    <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg border border-[var(--color-border)] space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
          Registro de Compras
        </h1>
        <p className="text-[var(--color-secondary-text)] text-sm sm:text-base">
          Gestión de productos y promociones de venta
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Input
            ref={dateInputRef}
            type="date"
            value={date}
            onChange={(e) => onDateChange && onDateChange(e.target.value)}
            className="w-full sm:w-auto"
            icon={<Calendar size={18} className="text-[var(--color-secondary-text)] cursor-pointer" onClick={() => dateInputRef.current?.showPicker?.()} />}
          />
        </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={onLoadPrevious}
            className="flex items-center justify-center gap-2 bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md"
          >
            Compra Anterior
          </button>
          <button
            onClick={onRequestCopyExcel}
            className="flex items-center justify-center gap-2 bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md"
          >
            <Copy size={18} /> Copiar Excel
          </button>
          <button
            onClick={handleSave}
            disabled={saveDisabled}
            className={`flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-md ${saveDisabled ? 'bg-[var(--color-secondary)]/50 cursor-not-allowed text-[var(--color-secondary-text)]' : 'bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-dark)] text-[var(--color-text)]'}`}
          >
            <Save size={18} /> Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasesHeader;
