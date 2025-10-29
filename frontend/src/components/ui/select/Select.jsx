import { useState } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";

const Select = ({ value, onChange, children, className = "", selectClassName = "", required = false, label, id, forceValidate = false, icon, variant }) => {
  const [didFocus, setDidFocus] = useState(false);
  const [didBlur, setDidBlur] = useState(false);
  const isEmpty = value === undefined || value === null || String(value).trim() === "";
  const showRequiredWarning = required && (didBlur || forceValidate) && isEmpty;

  return (
    <div className={`${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[var(--color-secondary-text)] mb-1">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-[1] pointer-events-none">
            {icon}
          </div>
        )}
        <select
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setDidFocus(true)}
          onBlur={() => { if (didFocus) setDidBlur(true); }}
          required={required}
          className={`appearance-none w-full bg-[var(--color-bg-input)] border ${showRequiredWarning ? 'border-[var(--color-error)] focus:ring-[var(--color-error)] pr-10' : 'border-[var(--color-border)]'} rounded-md py-2 ${icon ? 'pl-10' : 'px-3'} text-[var(--color-text)] text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] pr-8 ${variant === 'success' ? 'border-[var(--color-success)] bg-[var(--color-success)]/15' : variant === 'warning' ? 'border-[var(--color-warning)] bg-[var(--color-warning)]/15' : variant === 'error' ? 'border-[var(--color-error)] bg-[var(--color-error)]/15' : ''} ${selectClassName}`}
        >
          {children}
        </select
        >
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-secondary-text)] pointer-events-none">
          <ChevronDown size={16} />
        </div>
        {showRequiredWarning && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-error)]" title="Campo requerido">
            <AlertTriangle size={16} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
