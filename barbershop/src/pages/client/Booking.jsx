import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getActiveBarbers } from '../../services/barberService';
import { getActiveServices } from '../../services/serviceService';
import { getAvailableSlots, createAppointment } from '../../services/appointmentService';
import { DATE_FORMAT, formatDate } from '../../utils/dateUtils';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { isFirebaseConfigured } from '../../config/firebase';

const STEPS = ['Barbeiro', 'Serviço', 'Data', 'Horário', 'Confirmar'];

export default function Booking() {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState({
    barber: null,
    service: null,
    date: format(new Date(), DATE_FORMAT),
    slot: null,
  });

  useEffect(() => {
    Promise.all([getActiveBarbers(), getActiveServices()])
      .then(([b, s]) => {
        setBarbers(b);
        setServices(s);
      })
      .catch(() => toast.error('Erro ao carregar dados.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected.barber || !selected.service || !selected.date) return;
    setSlotsLoading(true);
    getAvailableSlots({
      barberId: selected.barber.id,
      dateStr: selected.date,
      serviceDurationMinutes: selected.service.durationMinutes,
    })
      .then(setSlots)
      .catch(() => toast.error('Erro ao buscar horários.'))
      .finally(() => setSlotsLoading(false));
  }, [selected.barber, selected.service, selected.date]);

  const changeDate = (days) => {
    const current = new Date(selected.date + 'T12:00:00');
    const next = addDays(current, days);
    if (next < new Date(new Date().setHours(0, 0, 0, 0))) return;
    setSelected((s) => ({ ...s, date: format(next, DATE_FORMAT), slot: null }));
  };

  const handleConfirm = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/agendar' } } });
      return;
    }
    setSubmitting(true);
    try {
      await createAppointment({
        clientId: user.uid,
        clientName: profile?.displayName || user.displayName,
        clientPhone: profile?.phone || '',
        clientEmail: user.email,
        barberId: selected.barber.id,
        barberName: selected.barber.name,
        serviceId: selected.service.id,
        serviceName: selected.service.name,
        durationMinutes: selected.service.durationMinutes,
        price: selected.service.price,
        startAt: selected.slot.start,
      });
      toast.success('Agendamento confirmado!');
      navigate('/meus-agendamentos');
    } catch {
      toast.error('Erro ao criar agendamento. Tente outro horário.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading fullScreen />;

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-primary pt-24 px-4 flex items-center justify-center">
        <div className="max-w-md bg-card border border-secondary rounded-2xl p-8 text-center">
          <h1 className="text-xl font-bold text-secondary mb-3">Firebase não configurado</h1>
          <p className="text-gray-400 text-sm">
            Crie o arquivo <strong className="text-text">.env</strong> na raiz do projeto com suas credenciais
            (copie de <strong className="text-text">.env.example</strong>) e reinicie o servidor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Agendar Horário</h1>
        <p className="text-gray-400 mb-8">Pagamento realizado presencialmente na barbearia</p>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                i === step ? 'bg-secondary text-white' : i < step ? 'bg-green-900/40 text-green-300' : 'bg-card text-gray-500'
              }`}
            >
              {i < step ? <Check size={14} /> : <span className="w-5 text-center">{i + 1}</span>}
              {label}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-gray-800 p-6">
          {step === 0 && (
            <StepBarber
              barbers={barbers}
              selected={selected.barber}
              onSelect={(barber) => {
                setSelected((s) => ({ ...s, barber, slot: null }));
                setStep(1);
              }}
            />
          )}
          {step === 1 && (
            <StepService
              services={services}
              selected={selected.service}
              onSelect={(service) => {
                setSelected((s) => ({ ...s, service, slot: null }));
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <StepDate
              date={selected.date}
              onChangeDate={changeDate}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <StepTime
              slots={slots}
              loading={slotsLoading}
              selected={selected.slot}
              onSelect={(slot) => {
                setSelected((s) => ({ ...s, slot }));
                setStep(4);
              }}
            />
          )}
          {step === 4 && (
            <StepConfirm
              selected={selected}
              onConfirm={handleConfirm}
              submitting={submitting}
            />
          )}

          {step > 0 && step < 4 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="mt-6 flex items-center gap-1 text-gray-400 hover:text-text cursor-pointer"
            >
              <ChevronLeft size={18} /> Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepBarber({ barbers, selected, onSelect }) {
  if (!barbers.length) {
    return <p className="text-gray-400">Nenhum barbeiro disponível no momento.</p>;
  }
  return (
    <div className="grid gap-3">
      <h2 className="text-xl font-bold text-text mb-2">Escolha o barbeiro</h2>
      {barbers.map((b) => (
        <button
          key={b.id}
          type="button"
          onClick={() => onSelect(b)}
          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
            selected?.id === b.id ? 'border-secondary bg-secondary/10' : 'border-gray-700 hover:border-gray-500'
          }`}
        >
          <p className="font-bold text-text">{b.name}</p>
          {b.bio && <p className="text-sm text-gray-400 mt-1">{b.bio}</p>}
        </button>
      ))}
    </div>
  );
}

function StepService({ services, selected, onSelect }) {
  return (
    <div className="grid gap-3">
      <h2 className="text-xl font-bold text-text mb-2">Escolha o serviço</h2>
      {services.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(s)}
          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
            selected?.id === s.id ? 'border-secondary bg-secondary/10' : 'border-gray-700 hover:border-gray-500'
          }`}
        >
          <div className="flex justify-between items-start">
            <p className="font-bold text-text">{s.name}</p>
            <p className="text-secondary font-bold">R$ {s.price?.toFixed(2)}</p>
          </div>
          {s.description && <p className="text-sm text-gray-400 mt-1">{s.description}</p>}
          <p className="text-xs text-gray-500 mt-2">{s.durationMinutes} min</p>
        </button>
      ))}
    </div>
  );
}

function StepDate({ date, onChangeDate, onNext }) {
  const display = format(new Date(date + 'T12:00:00'), "EEEE, dd 'de' MMMM", { locale: ptBR });
  return (
    <div>
      <h2 className="text-xl font-bold text-text mb-4">Escolha a data</h2>
      <div className="flex items-center justify-between bg-primary rounded-xl p-4 mb-4">
        <button type="button" onClick={() => onChangeDate(-1)} className="p-2 hover:text-secondary cursor-pointer">
          <ChevronLeft />
        </button>
        <span className="font-medium capitalize">{display}</span>
        <button type="button" onClick={() => onChangeDate(1)} className="p-2 hover:text-secondary cursor-pointer">
          <ChevronRight />
        </button>
      </div>
      <Button onClick={onNext} className="w-full">Continuar</Button>
    </div>
  );
}

function StepTime({ slots, loading, selected, onSelect }) {
  if (loading) return <Loading message="Buscando horários disponíveis..." />;
  if (!slots.length) {
    return <p className="text-gray-400 text-center py-8">Nenhum horário disponível nesta data. Tente outro dia.</p>;
  }
  return (
    <div>
      <h2 className="text-xl font-bold text-text mb-4">Escolha o horário</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.label}
            type="button"
            onClick={() => onSelect(slot)}
            className={`py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
              selected?.label === slot.label
                ? 'border-secondary bg-secondary text-white'
                : 'border-gray-700 hover:border-secondary text-text'
            }`}
          >
            {slot.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepConfirm({ selected, onConfirm, submitting }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-text mb-4">Confirmar agendamento</h2>
      <div className="space-y-3 bg-primary rounded-xl p-4">
        <Row label="Barbeiro" value={selected.barber?.name} />
        <Row label="Serviço" value={selected.service?.name} />
        <Row label="Duração" value={`${selected.service?.durationMinutes} min`} />
        <Row label="Data" value={formatDate(selected.date)} />
        <Row label="Horário" value={selected.slot?.label} />
        <Row label="Valor" value={`R$ ${selected.service?.price?.toFixed(2)}`} highlight />
        <p className="text-xs text-gray-500 pt-2">* Pagamento na barbearia</p>
      </div>
      <Button onClick={onConfirm} className="w-full mt-6" loading={submitting}>
        Confirmar Agendamento
      </Button>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className={highlight ? 'text-secondary font-bold' : 'text-text'}>{value}</span>
    </div>
  );
}

