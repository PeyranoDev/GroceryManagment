
import './card.css';

const Card = ({ title, children, actions, className = "" }) => {
  return (
    <div
      className={`card ${className}`}
    >
      {title && (
        <div className="card-header">
          <h2 className="card-title">
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
