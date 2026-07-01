import Home from './Home';
import NossosServicos from './NossosServicos';
import Sobre from './Sobre';
import Contato from './Contato';
import Footer from './Footer';

export default function Landing() {
  return (
    <div className="overflow-x-clip w-full">
      <Home />
      <NossosServicos />
      <Sobre />
      <Contato />
      <Footer />
    </div>
  );
}
