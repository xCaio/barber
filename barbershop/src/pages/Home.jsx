import logoHome from '../assets/logoHome.png';
import bgImage from '../assets/background.png';
import Button from '../components/Button';
import ButtonSecondary from '../components/ButtonSecondary';
import RevealOnScroll from '../components/RevealOnScroll';

export default function Home() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col bg-primary overflow-x-clip pt-[calc(var(--header-height)+1.5rem)] sm:pt-[calc(var(--header-height)+2rem)] md:pt-[calc(var(--header-height)+2.5rem)] pb-10 sm:pb-16">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="hero-bg-zoom absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/80 to-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(189,26,26,0.18)_0%,transparent_55%)]" />
        <div className="hero-glow absolute top-[20%] left-1/2 -translate-x-1/2 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 sm:px-6 text-center w-full max-w-4xl mx-auto">
        <RevealOnScroll direction="scale" delay={0} className="w-full flex justify-center">
          <div className="animate-float mb-4 sm:mb-6">
            <img
              src={logoHome}
              alt="Logo da Barbearia Garcia"
              className="w-36 sm:w-48 md:w-56 lg:w-64 max-w-[78vw] h-auto drop-shadow-[0_8px_32px_rgba(189,26,26,0.35)]"
            />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={150}>
          <div className="section-accent mx-auto mb-4 sm:mb-6" aria-hidden="true" />
        </RevealOnScroll>

        <RevealOnScroll delay={220}>
          <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl text-text leading-relaxed sm:leading-normal md:leading-tight max-w-xl sm:max-w-2xl font-bold px-1">
            Tradição, qualidade e estilo em cada corte. Onde a arte da barbearia encontra a
            excelência.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={340} className="w-full">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 w-full max-w-xs sm:max-w-none mx-auto px-1 sm:px-0">
            <Button />
            <ButtonSecondary />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={480}>
          <a
            href="#servicos"
            className="mt-10 sm:mt-14 flex flex-col items-center gap-2 text-gray-500 hover:text-secondary transition-colors group"
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-widest">Explore</span>
            <span className="block w-px h-6 sm:h-8 bg-gradient-to-b from-secondary/80 to-transparent group-hover:h-8 sm:group-hover:h-10 transition-all duration-300" />
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
