
const Card = ({ title, children, actions, className = "" }) => {
  return (
    <div
      className={`bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text">
            {title}
          </h2>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Card;
