import { Link } from 'react-router-dom';

export default function Button({ className = '' }) {
  return (
    <Link
      to="/agendar"
      className={`btn-landing w-full sm:w-auto sm:mx-2 px-6 py-3.5 sm:py-3 text-sm md:text-base shadow-2xl bg-button rounded-2xl cursor-pointer font-bold text-text inline-block text-center ${className}`}
    >
      Agende seu Horário
    </Link>
  );
}
