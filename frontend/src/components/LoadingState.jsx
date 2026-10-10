export default function LoadingState({
  title = 'Loading...',
  message = 'Please wait a moment.',
}) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
