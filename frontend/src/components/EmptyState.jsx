import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  message = 'Content will appear once available.',
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="state-block">
      <div className="state-icon" aria-hidden="true">
        <Icon size={24} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && (actionTo || onAction) && (
        <Button to={actionTo} onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
