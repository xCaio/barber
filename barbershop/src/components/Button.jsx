import { Link } from 'react-router-dom';

const Button = () => {
  return (
    <Link
      to="/agendar"
      className="mx-5 px-5 py-3 text-sm md:text-base shadow-2xl bg-button rounded-2xl cursor-pointer hover:scale-105 transition-transform font-bold text-text inline-block"
    >
      Agende seu Horário
    </Link>
  );
};

export default Button;
