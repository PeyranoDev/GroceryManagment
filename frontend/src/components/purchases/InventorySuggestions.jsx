import { createPortal } from "react-dom";
import { useDropdownPosition } from "../../hooks/useDropdownPosition";
import { Loader2 } from "lucide-react";

const InventorySuggestions = ({
  anchorRef,
  open,
  suggestions = [],
  activeIndex = -1,
  onHoverIndexChange,
  onPick,
  onCreateNew,
  query = "",
  dropdownRef,
  usePortal = true,
  loading = false,
}) => {
  const enabled = !!open && !!(query || "").trim();
  const { pos } = useDropdownPosition(anchorRef, usePortal && enabled);

  if (!enabled) return null;

  const content = (
    <div
      className="bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-md shadow-lg overflow-y-auto"
      style={usePortal && pos ? { position: "absolute", top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight, zIndex: 10000 } : { position: "absolute", top: "100%", left: 0, right: 0, maxHeight: 240 }}
      ref={dropdownRef}
    >
      {loading && (
        <div className="px-3 py-2 text-[var(--color-secondary-text)] flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Buscando...</div>
      )}
      {suggestions.length > 0 ? (
        suggestions.map((sug, idx) => (
          <button
            key={sug.id}
            type="button"
            onMouseDown={(ev) => { ev.preventDefault(); onPick && onPick(sug); }}
            className={`w-full text-left px-3 py-2 text-[var(--color-text)] whitespace-normal break-words flex items-center justify-between ${activeIndex === idx ? 'bg-[var(--color-primary-dark)]/60' : 'hover:bg-[var(--color-primary-dark)]/30'}`}
            onMouseEnter={() => onHoverIndexChange && onHoverIndexChange(idx)}
          >
            <span>{sug.name}</span>
            <span className="text-[var(--color-secondary-text)] font-mono">{sug.unit}</span>
          </button>
        ))
      ) : (
        !loading && <div className="px-3 py-2 text-[var(--color-secondary-text)]">Sin coincidencias</div>
      )}
      <div className="px-3 py-2 border-t border-[var(--color-border)]">
        <button type="button" onMouseDown={(ev) => { ev.preventDefault(); onCreateNew && onCreateNew(); }} className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-[var(--color-text)] font-semibold py-1 px-2 rounded-md text-xs">Crear producto</button>
      </div>
    </div>
  );

  if (usePortal && pos) return createPortal(content, document.body);
  return content;
};

export default InventorySuggestions;

