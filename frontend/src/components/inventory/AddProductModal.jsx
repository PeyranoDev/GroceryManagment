import { useState, useEffect } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";

const AddProductModal = ({ isOpen, onClose, onSave, defaultName = "" }) => {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("kg");

  useEffect(() => {
    if (isOpen) {
      setName(defaultName || "");
    }
  }, [isOpen, defaultName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      unit,
    };
    if (onSave) onSave(payload);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Producto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-3 sm:p-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--color-secondary-text)]">Nombre</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Manzanas"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex-1">
            <label htmlFor="unit" className="block text-sm font-medium text-[var(--color-secondary-text)]">Unidad</label>
            <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="kg">Peso (kg)</option>
              <option value="u">Unidad (u)</option>
            </Select>
          </div>

          
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md text-sm sm:text-base"
          >
            Guardar Producto
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;
