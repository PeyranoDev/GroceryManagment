import { forwardRef } from "react";
import "./input.css";

const Input = forwardRef(({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  icon,
}, ref) => {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="icon">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input ${icon ? "pl-10" : "px-3"} ${className}`}
      />
    </div>
  );
});

Input.displayName = "Input";

export default Input;
