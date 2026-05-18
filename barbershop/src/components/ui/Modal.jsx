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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-card rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-800 sticky top-0 bg-card z-10">
          <h3 className="text-xl font-bold text-text">{title}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-text cursor-pointer">
            <X size={22} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
