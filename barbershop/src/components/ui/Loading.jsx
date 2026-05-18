export default function Loading({ message = 'Carregando...', fullScreen = false }) {
  const wrapper = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-primary/90'
    : 'flex items-center justify-center py-12';

  return (
    <div className={wrapper}>
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-text text-sm">{message}</p>
      </div>
    </div>
  );
}
