const Select = ({ value, onChange, children, className = "" }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-md py-2 px-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] ${className}`}
    >
      {children}
    </select>
  );
};

export default Select;
