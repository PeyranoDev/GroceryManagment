import "./input.css";

const Input = ({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  icon,
}) => {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="icon">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input ${icon ? "pl-10" : "px-3"} ${className}`}
      />
    </div>
  );
};
export default Input;
