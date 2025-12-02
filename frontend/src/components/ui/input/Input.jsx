import { forwardRef, useState, useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import "./input.css";

const Input = forwardRef(({ 
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  icon,
  readOnly = false,
  format,
  id,
  ariaLabel,
  error = false,
  errorMessage = "",
  onBlur,
  onFocus,
  required = false,
  label,
  forceValidate = false,
  inputClassName = "",
  ...rest
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [didFocus, setDidFocus] = useState(false);
  const [didBlur, setDidBlur] = useState(false);

  const formatDecimalPlain = (val) => {
    if (val === undefined || val === null || val === "") return "";
    let num;
    if (typeof val === "number") {
      num = val;
    } else {
      const str = String(val).trim();
      if (/^\d{1,3}(?:\.\d{3})*,\d{1,}$/.test(str) || /,\d{1,}$/.test(str)) {
        const normalized = str.replace(/\./g, "").replace(/,/g, ".");
        num = parseFloat(normalized);
      } else {
        num = parseFloat(str);
      }
    }
    if (Number.isNaN(num)) return String(val);
    return Number(num || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false });
  };

  const displayValue = useMemo(() => {
    if (format === "currency" && !focused) return formatDecimalPlain(value);
    return value;
  }, [format, focused, value]);

  const handleChange = (e) => {
    if (readOnly) return;
  if (format === "currency") {
      let s = String(e.target.value || "");
      s = s.replace(/\s+/g, "");
      s = s.replace(/,/g, ".");
      s = s.replace(/[^0-9.]/g, "");
      const firstDot = s.indexOf(".");
      if (firstDot !== -1) {
        s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, "");
      }
      const dotPos = s.indexOf('.');
      if (dotPos !== -1) {
        const intPart = s.slice(0, dotPos).replace(/^0+/, '');
        const safeInt = intPart === '' ? '0' : intPart;
        s = safeInt + '.' + s.slice(dotPos + 1);
      } else {
        s = s.replace(/^0+(?=\d)/, '');
        if (s === '') s = '0';
      }
      onChange && onChange({ target: { value: s } });
      return;
    }
    onChange && onChange(e);
  };

  const isEmpty = () => {
    if (value === undefined || value === null) return true;
    if (typeof value === "string") return value.trim() === "";
    return String(value).trim() === "";
  };

  const showRequiredWarning = required && (didBlur || forceValidate) && isEmpty() && !readOnly;

  return (
    <div className={`${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[var(--color-secondary-text)] mb-1">{label}</label>
      )}
      <div className="relative w-full">
        {icon && (
          <div className="icon">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          value={displayValue}
          onChange={handleChange}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`input ${icon ? "pl-10" : "px-3"} w-full ${format === "currency" ? "font-bold" : ""} ${error || showRequiredWarning ? "border-[var(--color-error)] focus:ring-[var(--color-error)] outline-2 outline-[var(--color-error)] pr-10" : ""} ${inputClassName}`}
          id={id}
          aria-label={ariaLabel}
          onFocus={(e) => { setFocused(true); setDidFocus(true); onFocus && onFocus(e); }}
          onBlur={(e) => { setFocused(false); if (didFocus) setDidBlur(true); onBlur && onBlur(e); }}
          {...rest}
        />
        {showRequiredWarning && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-error)]" title="Campo requerido">
            <AlertTriangle size={16} />
          </div>
        )}
      </div>
      {errorMessage && (
        <div className="mt-1 text-xs text-[var(--color-error)]">{errorMessage}</div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
