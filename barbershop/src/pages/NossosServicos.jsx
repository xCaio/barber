import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Loading from '../components/ui/Loading';
import SectionHeading from '../components/SectionHeading';
import RevealOnScroll from '../components/RevealOnScroll';
import { getActiveServices } from '../services/serviceService';

const SERVICE_IMAGES = {
  'Corte Masculino':
    'https://img.freepik.com/fotos-gratis/macho-obtendo-seu-corte-cabelo_23-2148256903.jpg',
  'Barba Completa':
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  'Combo Completo':
    'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
  'Tratamento Premium':
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300',
  Pigmentação:
    'https://images.unsplash.com/photo-1527512950678-b88a241e9f4b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0',
  'Platinado / Descoloração':
    'https://www.gazetadigital.com.br/storage/webdisco/2022/12/28/1200x900/1c85c7b72de5987786bacfa560472814.jpg',
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';

function formatDuration(minutes) {
  const value = Number(minutes) || 0;
  if (value >= 60) {
    const hours = Math.floor(value / 60);
    const mins = value % 60;
    return mins ? `${hours}h ${mins} min.` : `${hours}h`;
  }
  return `${value} min.`;
}

function toCardItem(service) {
  return {
    image: service.image || SERVICE_IMAGES[service.name] || FALLBACK_IMAGE,
    title: service.name,
    subtitle: service.description || '',
    price: `R$${Number(service.price).toFixed(0)}`,
    duration: formatDuration(service.durationMinutes),
  };
}

export default function NossosServicos() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveServices()
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="servicos" className="pt-12 sm:pt-16 pb-10 sm:pb-12 bg-primary w-full px-4 sm:px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(189,26,26,0.06)_0%,transparent_50%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <SectionHeading
          title="Nossos Serviços"
          subtitle="Oferecemos uma gama completa de serviços para cuidar do seu estilo com maestria"
        />

        {loading ? (
          <Loading message="Carregando serviços..." />
        ) : services.length === 0 ? (
          <RevealOnScroll>
            <p className="text-center text-gray-400 pb-10 sm:pb-12 text-sm sm:text-base px-2">
              Serviços em breve. O administrador pode configurá-los no painel.
            </p>
          </RevealOnScroll>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full pb-6 sm:pb-8">
            {services.map((service, index) => (
              <Card key={service.id} item={toCardItem(service)} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
