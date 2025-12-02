
import './card.css';

const sizeClass = (size) => {
  switch (size) {
    case 'small':
      return 'max-w-[400px] mx-auto';
    case 'narrow':
      return 'max-w-[500px] mx-auto';
    case 'medium':
      return 'max-w-[600px] mx-auto';
    case 'wide':
      return 'max-w-[1100px] mx-auto';
    default:
      return '';
  }
};

const Card = ({ title, children, actions, footer, className = "", size = "auto" }) => {
  return (
    <div role="group" className={`card ${sizeClass(size)} ${className}`}>
      {title && (
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
          {actions && <div className="flex items-center gap-2 min-h-[48px]">{actions}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
