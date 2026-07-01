export default function ClientPageShell({ title, subtitle, children, maxWidth = 'max-w-3xl' }) {
  return (
    <div className="client-page min-h-screen bg-primary relative overflow-x-clip">
      <div className="client-page-bg" aria-hidden="true" />

      <div className={`relative z-10 ${maxWidth} mx-auto px-4 sm:px-6 pb-12 sm:pb-16`}>
        <header className="text-center mb-8 sm:mb-10 pt-[calc(var(--header-height)+1.25rem)] sm:pt-[calc(var(--header-height)+1.75rem)]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary leading-tight px-1">
            {title}
          </h1>
          <div className="section-accent mx-auto my-3 sm:my-4" aria-hidden="true" />
          {subtitle && (
            <p className="text-sm sm:text-base text-gray-400 max-w-lg mx-auto leading-relaxed px-2">
              {subtitle}
            </p>
          )}
        </header>

        {children}
      </div>
    </div>
  );
}
