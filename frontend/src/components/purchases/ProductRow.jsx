import { DollarSign, Edit, Trash2, X, AlertTriangle } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import InventorySuggestions from "./InventorySuggestions.jsx";
import Input from "../ui/input/Input";
import { formatDecimalPlain } from "../../utils/money.js";
import { useDebounced } from "../../hooks/useDebounced";
import { sanitizeInt, clamp } from "../../utils/number.js";
import { getUnitFromProduct } from "../../utils/unit.js";
import { inventoryAPI } from "../../services/api";

export const ProductRow = ({
  index,
  displayIndex,
  autoFocus,
  product,
  onProductChange,
  onRemoveProduct,
  inventory = [],
  onSelectInventoryItem,
  onRequestCreateProduct,
  onAdjustInventoryStock,
  onAdjustClick,
  animState,
}) => {
  const unitPriceRaw = useMemo(() => {
    const total = parseFloat(product.totalPrice) || 0;
    const quantity = parseFloat(product.quantity) || 0;
    return quantity > 0 ? (total / quantity) : 0;
  }, [product.totalPrice, product.quantity]);
  const handleFieldChange = (field, value) =>
    onProductChange(product.id, { ...product, [field]: value });

  const [rawQuery, setRawQuery] = useState("");
  const debouncedQuery = useDebounced(rawQuery, 250);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [suggestionsCache, setSuggestionsCache] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const locked = !!product.selectedItemId || !!product.selectedProductId;
  const unitDisplay = getUnitFromProduct(product);
  const [isFocused, setIsFocused] = useState(false);
  
  useEffect(() => {
    if (autoFocus && inputRef.current && !locked) {
      inputRef.current.focus();
    }
  }, [autoFocus, locked]);
  useEffect(() => {
    if (locked || !isFocused) return;
    setSuggestionsLoading(true);
    const q = (debouncedQuery || '').trim().toLowerCase();
    const source = loadedOnce ? suggestionsCache : (Array.isArray(inventory) ? inventory : []);
    const list = source
      .map((it) => ({
        id: it.id ?? it.Id,
        name: it.product?.name ?? it.name ?? it.Product?.Name ?? "",
        unit: it.unit ?? it.Unit ?? "u",
      }))
      .filter((s) => !!(s.name || '').toLowerCase().includes(q));
    setSuggestions(list.slice(0, 8));
    setActiveIndex(list.length > 0 ? 0 : -1);
    setSuggestionsLoading(false);
  }, [debouncedQuery, isFocused, locked, loadedOnce, suggestionsCache, inventory]);

  const ensureLoadedOnce = async () => {
    if (loadedOnce) return;
    try {
      setSuggestionsLoading(true);
      const resp = await inventoryAPI.getAll();
      const items = resp.data || resp || [];
      setSuggestionsCache(Array.isArray(items) ? items : []);
      setLoadedOnce(true);
    } catch {
      setSuggestionsCache(Array.isArray(inventory) ? inventory : []);
      setLoadedOnce(true);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  useEffect(() => {
    if (loadedOnce) {
      // si el inventario externo cambia (por creación de producto), sincroniza cache
      setSuggestionsCache(Array.isArray(inventory) ? inventory : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventory]);


  return (
    <tr className={`${animState === 'enter' ? 'row-enter' : animState === 'exit' ? 'row-exit' : ''} ${product.isRegistered ? 'bg-[var(--color-bg-input)]/40' : ''}`}>
      <td className="p-2 w-[4%] text-left text-[var(--color-secondary-text)]">{displayIndex ?? ((index ?? 0) + 1)}</td>
      <td className="p-2 w-[16%]">
        <div className="relative">
          {product.isRegistered ? (
            <div className="border border-[var(--color-border)] rounded-md px-3 py-2 max-w-[220px] text-[var(--color-secondary-text)]">
              {product.name}
            </div>
          ) : (
          <Input
            value={product.name}
            onChange={(e) => {
              const val = e.target.value;
              setRawQuery(val);
              handleFieldChange("name", val);
              setIsFocused(true);
              setActiveIndex(-1);
            }}
            className={`${locked ? "pr-8 !bg-[var(--color-bg-input)]/60 cursor-not-allowed text-[var(--color-secondary-text)]" : ""} border border-[var(--color-border)] max-w-[200px] sm:max-w-[220px]`}
            readOnly={locked}
            ref={inputRef}
            required
            error={!!product.invalidProduct && !!(product.name || '').trim()}
            onFocus={async () => {
              if (!locked) {
                await ensureLoadedOnce();
                setIsFocused(true);
                onProductChange(product.id, { ...product, touchedProduct: true, invalidProduct: false });
              }
            }}
            onBlur={(e) => {
              if (locked) return;
              const rt = e.relatedTarget;
              if (dropdownRef.current && rt && dropdownRef.current.contains(rt)) {
                // mantener foco lógico si se interactúa con el dropdown
                setIsFocused(true);
                return;
              }
              setIsFocused(false);
              const val = (e.target.value || "").trim().toLowerCase();
              if (!val) { 
                onProductChange(product.id, { ...product, invalidProduct: true });
                return; 
              }
              const exact = inventory.find((it) => (it.name || "").toLowerCase() === val);
              if (exact) {
                onSelectInventoryItem(product.id, exact);
                setRawQuery("");
              } else {
                onProductChange(product.id, { ...product, invalidProduct: true });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((prev) => Math.max(prev - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                const pick = activeIndex >= 0 ? suggestions[activeIndex] : suggestions[0];
                if (pick) {
                  const full = (loadedOnce ? suggestionsCache : (Array.isArray(inventory) ? inventory : []))
                    .find((it) => (it.id ?? it.Id) === pick.id);
                  if (full) onSelectInventoryItem(product.id, full);
                  setRawQuery("");
                }
              } else if (e.key === "Escape") {
                setIsFocused(false);
              }
            }}
          />
          )}
          {!product.isRegistered && !locked && product.invalidProduct && !!(product.name || '').trim() && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-error)]" title={`${(!product.name || !product.name.trim()) ? 'Campo requerido' : 'Producto no registrado'}` }>
              <AlertTriangle size={16} />
            </div>
          )}
          {!product.isRegistered && locked && (
            <button
              onClick={() => {
                onProductChange(product.id, {
                  ...product,
                  name: "",
                  selectedItemId: null,
                  appliedQuantity: 0,
                  invalidProduct: false,
                });
                setRawQuery("");
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-secondary-text)] hover:text-[var(--color-secondary-text)]/70"
              title="Quitar producto"
            >
              <X size={16} />
            </button>
          )}
          {!locked && (
            <InventorySuggestions
              anchorRef={inputRef}
              open={isFocused}
              suggestions={suggestions}
              activeIndex={activeIndex}
              onHoverIndexChange={(idx) => setActiveIndex(idx)}
              onPick={(sug) => { const full = (loadedOnce ? suggestionsCache : (Array.isArray(inventory) ? inventory : [])).find((it) => (it.id ?? it.Id) === sug.id); if (full) { onSelectInventoryItem(product.id, full); } setRawQuery(""); setIsFocused(false); }}
              onCreateNew={() => { onRequestCreateProduct(product.id, product.name || rawQuery); setIsFocused(false); }}
              query={rawQuery}
              dropdownRef={dropdownRef}
              usePortal={true}
              loading={suggestionsLoading}
            />
          )}
        </div>
      </td>

      <td className="p-2 w-[8%]">
        <div className="relative inline-block w-[100px]">
          {product.isRegistered ? (
            <div className="border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-secondary-text)] font-mono">
              {product.quantity || '0'}
            </div>
          ) : (
          <Input
            type="number"
            value={product.quantity}
            onChange={(e) => {
              const quantityNum = clamp(sanitizeInt(e.target.value), 0, 999);
              onProductChange(product.id, { ...product, quantity: String(quantityNum), appliedQuantity: quantityNum });
            }}
            onFocus={() => {} }
            onBlur={(e) => {
              const val = (e.target.value || '').trim();
              const empty = !val;
              const quantityNum = parseInt(val || '0', 10) || 0;
              onProductChange(product.id, { ...product, invalidQuantity: (!empty ? quantityNum <= 0 : false) });
            }}
            inputClassName={`pr-16`}
            min={1}
            max={999}
            step={1}
            inputMode="numeric"
            required
          />
          )}
          {!product.isRegistered && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3 pointer-events-none transition-all duration-200">
              {product.invalidQuantity && (
                <span className="text-[var(--color-error)]" title={`Cantidad debe ser mayor a 0`}>
                  <AlertTriangle size={16} />
                </span>
              )}
            </div>
          )}
        </div>
      </td>
      <td className="p-2 w-[18%]">
        <div className="relative">
          {product.isRegistered ? (
            <div className="border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-secondary-text)] font-bold">
              <span className="mr-2">$</span>
              <span>{formatDecimalPlain(parseFloat(product.totalPrice || 0))}</span>
            </div>
          ) : (
          <Input
            type="text"
            value={product.totalPrice}
            onChange={(e) => handleFieldChange("totalPrice", e.target.value)}
            icon={<DollarSign size={14} className="text-[var(--color-secondary-text)]" />}
            format="currency"
            ariaLabel="Precio total"
            className="max-w-[160px]"
            onBlur={(e) => {
              const empty = !(e.target.value || '').trim();
              if (empty) {
                onProductChange(product.id, { ...product, totalPrice: '' });
              }
            }}
          />
          )}
          
        </div>
      </td>
      <td className="p-2 w-[14%] text-left text-[var(--color-secondary-text)]">
        <span className="mr-1">$</span><span>{formatDecimalPlain(unitPriceRaw)}</span>
      </td>

      <td className="p-2 w-[10%] text-left">
        <div className="flex items-center justify-start gap-5">
          {product.isRegistered && (
            <button
              onClick={() => onAdjustClick && onAdjustClick(product)}
              disabled={!product.selectedItemId}
              className={`${product.selectedItemId ? 'text-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)]' : 'text-[var(--color-secondary-text)] cursor-not-allowed'}`}
              title="Ajustar"
            >
              <Edit size={30} />
            </button>
          )}
          <button
            onClick={() => onRemoveProduct(product.id)}
            className={`text-[var(--color-error)] hover:text-[var(--color-error-dark)]`}
          >
            <Trash2 size={30} />
          </button>
        </div>
      </td>
    </tr>
  );
};
