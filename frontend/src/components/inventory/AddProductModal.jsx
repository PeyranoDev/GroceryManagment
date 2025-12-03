import { useState, useEffect, useMemo, useRef } from "react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Select from "../ui/select/Select";
import Toast from "../ui/toast/Toast";
import { categoriesAPI } from "../../services/api";
import CreateCategoryModal from "../category/CreateCategoryModal";
import { X, AlertTriangle } from "lucide-react";

const AddProductModal = ({ isOpen, onClose, onSave, defaultName = "" }) => {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("kg");
  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryLocked, setCategoryLocked] = useState(false);
  const [invalidCategory, setInvalidCategory] = useState(false);
  const [createCatOpen, setCreateCatOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");
  const categoryInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName || "");
      setCategoryQuery("");
      setSelectedCategory(null);
      setCategoryLocked(false);
    }
  }, [isOpen, defaultName]);

  const filteredCategories = useMemo(() => {
    const q = (categoryQuery || "").trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [categories, categoryQuery]);

  const loadCategoriesOnce = async () => {
    if (categoriesLoaded) return;
    try {
      const res = await categoriesAPI.getAll();
      const data = res.data || res;
      setCategories(Array.isArray(data) ? data : []);
      setCategoriesLoaded(true);
    } catch (err) {
      setToastMsg(err.message || "No se pudieron cargar las categorías");
      setToastType("info");
      setToastOpen(true);
    }
  };

  const handleCategoryKeyDown = (e) => {
    if (categoryLocked) return;
    if (!categoriesLoaded) return;
    const total = filteredCategories.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, Math.max(total - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = activeIndex >= 0 ? filteredCategories[activeIndex] : filteredCategories[0];
      if (pick) {
        setSelectedCategory(pick);
        setCategoryQuery(pick.name || pick.Name || "");
        setCategoryLocked(true);
        setInvalidCategory(false);
      } else {
        setInvalidCategory(true);
      }
    } else if (e.key === "Escape") {
      setActiveIndex(-1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      unit,
      categoryId: selectedCategory?.id ?? selectedCategory?.Id,
    };
    if (!payload.categoryId) {
      setInvalidCategory(true);
      return;
    }
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

          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-[var(--color-secondary-text)]">Categoría</label>
            {!categoryLocked ? (
              <div className="relative">
                <Input
                  ref={categoryInputRef}
                  type="text"
                  value={categoryQuery}
                  onFocus={loadCategoriesOnce}
                  onChange={(e) => setCategoryQuery(e.target.value)}
                  onKeyDown={handleCategoryKeyDown}
                  placeholder="Escribe para buscar categorías..."
                />
                {categoriesLoaded && (
                  <div ref={dropdownRef} className="absolute z-20 mt-1 w-full max-h-40 overflow-auto border border-[var(--color-border)] rounded-md bg-[var(--surface)]">
                    {filteredCategories.map((c, idx) => (
                      <button
                        key={c.id || c.Id}
                        type="button"
                        className={`w-full text-left px-3 py-2 ${idx === activeIndex ? 'bg-[var(--color-primary-dark)]' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]'} text-[var(--color-text)]`}
                        onClick={() => { setSelectedCategory(c); setCategoryLocked(true); setCategoryQuery(c.name || c.Name || ""); setInvalidCategory(false); }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{c.name || c.Name}</span>
                          <span className="opacity-80">{c.icon || c.Icon || ''}</span>
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-[var(--color-border)] bg-[var(--surface)]">
                      <div className="px-3 py-2">
                        <button type="button" className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-text)] hover:bg-[var(--color-primary-dark)] font-semibold py-1.5 px-3 rounded-md" onClick={() => setCreateCatOpen(true)}>
                          Crear categoría
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {!categoryLocked && invalidCategory && !!(categoryQuery || '').trim() && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-error)]" title="Categoría no registrada">
                    <AlertTriangle size={16} />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input type="text" value={categoryQuery} readOnly />
                <button type="button" onClick={() => { setCategoryLocked(false); setSelectedCategory(null); setCategoryQuery(""); setInvalidCategory(false); }} className="text-[var(--color-secondary-text)] hover:text-[var(--color-secondary-text)]/70" title="Quitar categoría">
                  <X size={16} />
                </button>
              </div>
            )}
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
      <CreateCategoryModal
        isOpen={createCatOpen}
        onClose={() => setCreateCatOpen(false)}
        onCreated={(cat) => { setCategories((prev)=>[...(Array.isArray(prev)?prev:[]), cat]); setCategoriesLoaded(true); setSelectedCategory(cat); setCategoryQuery(cat.name || cat.Name || ""); setCategoryLocked(true); setInvalidCategory(false); setCreateCatOpen(false); }}
      />
      <Toast open={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />
    </Modal>
  );
};

export default AddProductModal;
