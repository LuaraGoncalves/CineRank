export default function FeedbackState({
  variant = 'empty',
  title,
  message,
  actionLabel,
  onAction,
  compact = false
}) {
  const role =
    variant === 'error' || variant === 'warning' ? 'alert' : 'status';
  const indicatorLabel = {
    empty: 'i',
    error: '!',
    loading: '...',
    warning: '!'
  }[variant];

  return (
    <div
      className={`feedback-state feedback-state-${variant} ${
        compact ? 'feedback-state-compact' : ''
      }`}
      role={role}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
    >
      <span className="feedback-state-indicator" aria-hidden="true">
        {indicatorLabel}
      </span>
      <div className="feedback-state-content">
        <h3>{title}</h3>
        {message && <p>{message}</p>}
      </div>
      {actionLabel && onAction && (
        <button type="button" className="retry-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
