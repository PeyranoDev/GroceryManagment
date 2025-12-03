import { useState, useEffect } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Toast from "../ui/toast/Toast";
import { categoriesAPI } from "../../services/api";

const CreateCategoryModal = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setIcon("");
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSubmitting(true);
      const res = await categoriesAPI.create({ name: name.trim(), icon: (icon || "").trim() });
      const created = res.data || res;
      setToastMsg("Categoría creada correctamente");
      setToastType("success");
      setToastOpen(true);
      if (onCreated) onCreated(created);
      onClose && onClose();
    } catch (err) {
      setToastMsg(err.message || "No se pudo crear la categoría");
      setToastType("info");
      setToastOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Categoría">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-3 sm:p-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--color-secondary-text)]">Nombre</label>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Verduras" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--color-secondary-text)]">Icono (opcional)</label>
          <Input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Ej. 🥕" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--color-text)] font-semibold py-2 px-4 rounded-md text-sm sm:text-base">Cancelar</button>
          <button type="submit" disabled={submitting || !name.trim()} className={`bg-[var(--color-primary)] ${submitting || !name.trim() ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[var(--color-primary-dark)]'} text-[var(--color-text)] font-semibold py-2 px-4 rounded-md text-sm sm:text-base`}>
            {submitting ? 'Procesando...' : 'Crear'}
          </button>
        </div>
      </form>
      <Toast open={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />
    </Modal>
  );
};

export default CreateCategoryModal;
