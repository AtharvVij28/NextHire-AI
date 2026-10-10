import { Link } from 'react-router-dom';

/**
 * Reusable button. Renders as Link when `to` is provided.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  type = 'button',
  className = '',
  block = false,
  disabled = false,
  onClick,
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
