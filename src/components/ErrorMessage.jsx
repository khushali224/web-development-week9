export default function ErrorMessage({ children, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <span className="error-icon">!</span>
      <div><strong>We hit a snag</strong><p>{children}</p>{onRetry && <button className="text-button" onClick={onRetry}>Try again</button>}</div>
    </div>
  );
}
