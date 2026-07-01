import RevealOnScroll from '../components/RevealOnScroll';

const QUICK_LINKS = [
  { href: '/', label: 'Início' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' },
];

export default function Footer() {
  return (
    <footer className="bg-card text-text px-4 sm:px-8 border-t border-gray-800/60">
      <div className="max-w-6xl mx-auto py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        <RevealOnScroll delay={0}>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl text-secondary py-1 sm:py-2 font-bold">Barbearia Garcia</h2>
            <p className="text-text/80 leading-relaxed text-sm sm:text-base">
              Tradição e excelência em cada corte. Sua satisfação é nossa prioridade.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={80}>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl text-secondary py-1 sm:py-2 font-bold">Links Rápidos</h2>
            <div className="flex flex-col gap-2 items-center sm:items-start">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-secondary transition-colors duration-200 text-sm sm:text-base"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={160}>
          <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
            <h2 className="text-xl sm:text-2xl text-secondary py-1 sm:py-2 font-bold">Contato Rápido</h2>
            <div className="flex flex-col gap-1 text-text/80 text-sm sm:text-base">
              <p>(31) 9 9592-5295</p>
              <p className="break-all sm:break-normal">contato@barbeariagarcia.com</p>
              <p>Av. A, 343 - Mangueiras</p>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      <RevealOnScroll delay={200}>
        <div className="py-6 sm:py-8 border-t border-gray-800/60 max-w-6xl mx-auto px-2">
          <p className="text-center text-xs sm:text-sm text-text/60">
            © 2025 Barbearia Garcia. Todos os direitos reservados.
          </p>
        </div>
      </RevealOnScroll>
    </footer>
  );
}
