export default function Card({ children, className = '', title, subtitle, ...rest }) {
  return (
    <div className={`card ${className}`.trim()} {...rest}>
      {title && <h3 className="card-title">{title}</h3>}
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
      {children}
    </div>
  );
}
