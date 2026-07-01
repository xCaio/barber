import imgCortes from '../assets/imgCortes.png';
import CountUp from '../components/CountUp';
import RevealOnScroll from '../components/RevealOnScroll';
import SectionHeading from '../components/SectionHeading';

const STATS = [
  { value: '8+', label: 'Anos de experiência' },
  { value: '2000+', label: 'Clientes Satisfeitos' },
  { value: '1', label: 'Barbeiro Especialista' },
  { value: '100%', label: 'Dedicação Profissional' },
];

export default function Sobre() {
  return (
    <section id="sobre" className="pt-12 sm:pt-16 pb-10 sm:pb-12 bg-primary w-full relative overflow-hidden">
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/5 blur-3xl rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 w-full">
        <SectionHeading title="Sobre nossa Barbearia" />

        <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-14">
          <div className="flex-1 w-full min-w-0">
            <RevealOnScroll delay={100}>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-center md:text-left font-bold text-text pb-8 sm:pb-10 max-w-xl mx-auto md:mx-0 leading-relaxed">
                Há mais de 8 anos, a Barbearia Garcia tem sido sinônimo de tradição e excelência no
                cuidado masculino. Nossa paixão pela arte da barbearia se reflete em cada detalhe:
                desde o ambiente acolhedor até o atendimento personalizado que cada cliente recebe.
                Combinamos técnicas tradicionais com tendências modernas, utilizando apenas produtos
                premium para garantir resultados excepcionais.
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-md mx-auto md:mx-0 w-full">
              {STATS.map((stat, index) => (
                <RevealOnScroll key={stat.label} delay={180 + index * 80}>
                  <div className="stat-pill flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-800/80 bg-card/40 min-h-[5.5rem] sm:min-h-[6.5rem]">
                    <span className="text-lg sm:text-xl md:text-3xl font-bold text-secondary">
                      <CountUp value={stat.value} />
                    </span>
                    <p className="text-[10px] sm:text-xs md:text-sm text-text font-bold mt-1 leading-tight px-0.5">
                      {stat.label}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <RevealOnScroll
            direction="up"
            delay={200}
            className="flex-shrink-0 w-full md:w-auto md:max-w-md"
          >
            <div className="relative mx-auto max-w-xs sm:max-w-sm md:max-w-md">
              <div
                className="absolute -inset-2 sm:-inset-3 rounded-3xl bg-secondary/10 blur-xl"
                aria-hidden="true"
              />
              <img
                src={imgCortes}
                alt="Foto dos cortes"
                className="relative w-full h-auto rounded-2xl border border-gray-800/60 shadow-2xl shadow-black/40 md:transition-transform md:duration-500 md:hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
