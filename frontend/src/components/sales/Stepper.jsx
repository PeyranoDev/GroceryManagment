const Stepper = ({ current = 1 }) => {
  const steps = [
    { id: 1, label: "Datos" },
    { id: 2, label: "Productos" },
    { id: 3, label: "Resumen" },
    { id: 4, label: "Pago" },
  ];
  return (
    <div className="flex items-center justify-center gap-6">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${current >= s.id ? 'bg-[var(--color-primary-dark)] text-[var(--color-text)]' : 'bg-[var(--surface)] text-[var(--color-secondary-text)]'}`}
            >
              {s.id}
            </div>
            <span className={`text-sm ${current >= s.id ? 'text-[var(--color-text)]' : 'text-[var(--color-secondary-text)]'}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-10 h-[2px] self-center ${current > s.id ? 'bg-[var(--color-primary-dark)]' : 'bg-[var(--surface)]'}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
