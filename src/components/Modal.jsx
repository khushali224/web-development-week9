import { X } from 'lucide-react';

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
        <h2 id="modal-title">{title}</h2>{children}
      </section>
    </div>
  );
}
