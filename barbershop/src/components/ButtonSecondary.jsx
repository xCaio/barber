export default function ButtonSecondary({ className = '' }) {
  return (
    <a
      href="#servicos"
      className={`btn-landing w-full sm:w-auto sm:mx-2 px-6 sm:px-8 py-3.5 sm:py-3 text-sm md:text-base shadow-2xl bg-text rounded-2xl cursor-pointer font-bold text-button border-2 border-transparent hover:border-secondary/30 inline-block text-center ${className}`}
    >
      Ver Serviços
    </a>
  );
}
