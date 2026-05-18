const variants = {
  primary: 'bg-button hover:bg-red-700 text-text',
  secondary: 'bg-card border border-secondary text-text hover:bg-secondary/20',
  ghost: 'bg-transparent text-text hover:bg-card',
  danger: 'bg-red-900 hover:bg-red-800 text-text',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`rounded-xl font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
}
