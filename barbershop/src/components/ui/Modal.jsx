import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden />
      <div
        className={`relative w-full ${sizes[size]} bg-card rounded-t-2xl sm:rounded-2xl border border-gray-800 shadow-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-800 sticky top-0 bg-card z-10 gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-text truncate">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-text cursor-pointer shrink-0 p-1"
            aria-label="Fechar"
          >
            <X size={22} />
          </button>
        </div>
        <div className="p-4 sm:p-5 pb-6 sm:pb-5">{children}</div>
      </div>
    </div>
  );
}
