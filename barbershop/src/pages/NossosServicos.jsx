import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Loading from '../components/ui/Loading';
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
    <section id="servicos" className="pt-12 bg-primary w-full px-4">
      <div className="flex flex-col text-center mb-10">
        <h2 className="text-4xl sm:text-4xl md:text-6xl font-bold text-secondary pb-4">
          Nossos Serviços
        </h2>
        <p className="text-lg sm:text-2xl md:text-4xl font-bold text-text">
          Oferecemos uma gama completa de serviços para cuidar do seu estilo com
          maestria
        </p>
      </div>

      {loading ? (
        <Loading message="Carregando serviços..." />
      ) : services.length === 0 ? (
        <p className="text-center text-gray-400 pb-12">
          Serviços em breve. O administrador pode configurá-los no painel.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {services.map((service) => (
            <Card key={service.id} item={toCardItem(service)} />
          ))}
        </div>
      )}
    </section>
  );
}
