import RevealOnScroll from './RevealOnScroll';

export default function SectionHeading({ title, subtitle, className = '' }) {
  return (
    <div className={`flex flex-col text-center mb-8 sm:mb-10 px-1 sm:px-0 ${className}`}>
      <RevealOnScroll>
        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-secondary pb-3 sm:pb-4 leading-tight">
          {title}
        </h2>
        <div className="section-accent mx-auto mb-3 sm:mb-4" aria-hidden="true" />
      </RevealOnScroll>
      {subtitle && (
        <RevealOnScroll delay={120}>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-text max-w-3xl mx-auto leading-snug sm:leading-normal px-2 sm:px-4">
            {subtitle}
          </p>
        </RevealOnScroll>
      )}
    </div>
  );
}
