export default function InputField({ label, id, error, hint, ...props }) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <input className={`input ${error ? 'input-error' : ''}`} id={id} {...props} />
      {error && <span className="field-error">{error}</span>}
      {!error && hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}
