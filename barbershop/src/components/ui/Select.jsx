export default function Select({ label, error, options = [], className = '', id, ...props }) {
  const selectId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-text mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-4 py-2.5 rounded-xl bg-card border border-gray-700 text-text focus:outline-none focus:border-secondary transition-colors cursor-pointer ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}
