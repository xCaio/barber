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

const STEPS = ['Barbeiro', 'Serviços', 'Data', 'Horário', 'Confirmar'];
const BOOKING_DRAFT_KEY = 'bookingDraft';

function sumDuration(services) {
  return services.reduce((acc, s) => acc + Number(s.durationMinutes || 0), 0);
}

function sumPrice(services) {
  return services.reduce((acc, s) => acc + Number(s.price || 0), 0);
}

function formatServiceNames(services) {
  return services.map((s) => s.name).join(' + ');
}

function isPermissionError(err) {
  const code = err?.code || '';
  const message = (err?.message || '').toLowerCase();
  return code === 'permission-denied' || message.includes('permission') || message.includes('insufficient');
}

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
    services: [],
    date: format(new Date(), DATE_FORMAT),
    slot: null,
  });

  const [loadError, setLoadError] = useState(null);

  const saveDraft = (nextStep) => {
    if (!selected.barber || !selected.services.length) return;
    sessionStorage.setItem(
      BOOKING_DRAFT_KEY,
      JSON.stringify({
        barberId: selected.barber.id,
        serviceIds: selected.services.map((s) => s.id),
        date: selected.date,
        step: nextStep,
      })
    );
  };

  const redirectToLogin = (nextStep = 2) => {
    saveDraft(nextStep);
    toast('Faça login para continuar o agendamento.', { icon: '🔒' });
    navigate('/login', { state: { from: { pathname: '/agendar' } } });
  };

  const requireLogin = (nextStep = 2) => {
    if (user) return true;
    redirectToLogin(nextStep);
    return false;
  };

  const loadData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [b, s] = await Promise.all([getActiveBarbers(), getActiveServices()]);
      setBarbers(b);
      setServices(s);
      if (!b.length) {
        setLoadError('Nenhum barbeiro cadastrado. Peça ao administrador para configurar a barbearia.');
      } else if (!s.length) {
        setLoadError('Nenhum serviço cadastrado. Peça ao administrador para configurar os serviços.');
      }
    } catch (err) {
      console.error('Erro ao carregar agendamento:', err);
      setLoadError('Não foi possível carregar barbeiros e serviços. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (loading || !barbers.length || !services.length) return;

    const raw = sessionStorage.getItem(BOOKING_DRAFT_KEY);
    if (!raw) return;

    try {
      const draft = JSON.parse(raw);
      sessionStorage.removeItem(BOOKING_DRAFT_KEY);

      const barber = barbers.find((b) => b.id === draft.barberId);
      const restoredServices = (draft.serviceIds || [])
        .map((id) => services.find((s) => s.id === id))
        .filter(Boolean);

      if (barber && restoredServices.length) {
        setSelected((prev) => ({
          ...prev,
          barber,
          services: restoredServices,
          date: draft.date || prev.date,
          slot: null,
        }));
        setStep(typeof draft.step === 'number' ? draft.step : 2);
        toast.success('Continue de onde parou.');
      }
    } catch {
      sessionStorage.removeItem(BOOKING_DRAFT_KEY);
    }
  }, [loading, barbers, services]);

  useEffect(() => {
    if (step !== 3 || !user || !selected.barber || !selected.services.length || !selected.date) return;

    const duration = sumDuration(selected.services);
    if (!duration || duration <= 0) {
      toast.error('Os serviços selecionados não têm duração configurada. Peça ao admin para corrigir.');
      return;
    }

    setSlotsLoading(true);
    getAvailableSlots({
      barberId: selected.barber.id,
      dateStr: selected.date,
      serviceDurationMinutes: duration,
    })
      .then((result) => {
        setSlots(result);
        if (result.length === 0) {
          const day = new Date(selected.date + 'T12:00:00').getDay();
          if (day === 0) {
            toast('Domingo: barbearia fechada. Escolha outro dia.', { icon: '📅' });
          }
        }
      })
      .catch((err) => {
        console.error('Erro ao buscar horários:', err);
        if (isPermissionError(err)) {
          redirectToLogin(3);
          return;
        }
        toast.error(err.message || 'Erro ao buscar horários.');
        setSlots([]);
      })
      .finally(() => setSlotsLoading(false));
  }, [step, user, selected.barber, selected.services, selected.date]);

  const changeDate = (days) => {
    const current = new Date(selected.date + 'T12:00:00');
    const next = addDays(current, days);
    if (next < new Date(new Date().setHours(0, 0, 0, 0))) return;
    setSelected((s) => ({ ...s, date: format(next, DATE_FORMAT), slot: null }));
  };

  const handleConfirm = async () => {
    if (!requireLogin(4)) return;
    setSubmitting(true);
    try {
      await createAppointment({
        clientId: user.uid,
        clientName: profile?.displayName || user.displayName,
        clientPhone: profile?.phone || '',
        clientEmail: user.email,
        barberId: selected.barber.id,
        barberName: selected.barber.name,
        serviceId: selected.services.map((s) => s.id).join(','),
        serviceName: formatServiceNames(selected.services),
        durationMinutes: sumDuration(selected.services),
        price: sumPrice(selected.services),
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
          {loadError && (
            <div className="mb-4 p-4 rounded-xl bg-red-900/30 border border-red-800 text-red-200 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span>{loadError}</span>
              <Button size="sm" variant="secondary" onClick={loadData}>Tentar novamente</Button>
            </div>
          )}
          {step === 0 && (
            <StepBarber
              barbers={barbers}
              selected={selected.barber}
              onSelect={(barber) => {
                setSelected((s) => ({ ...s, barber, services: [], slot: null }));
                setStep(1);
              }}
            />
          )}
          {step === 1 && (
            <StepServices
              services={services}
              selected={selected.services}
              onToggle={(service) => {
                setSelected((s) => {
                  const exists = s.services.some((item) => item.id === service.id);
                  const nextServices = exists
                    ? s.services.filter((item) => item.id !== service.id)
                    : [...s.services, service];
                  return { ...s, services: nextServices, slot: null };
                });
              }}
              onContinue={() => {
                if (!selected.services.length) {
                  toast.error('Selecione pelo menos um serviço.');
                  return;
                }
                if (!requireLogin(2)) return;
                setStep(2);
              }}
            />
          )}
          {step === 2 && (
            <StepDate
              date={selected.date}
              onChangeDate={changeDate}
              onNext={() => {
                if (!requireLogin(3)) return;
                setStep(3);
              }}
            />
          )}
          {step === 3 && (
            !user ? (
              <LoginPrompt onLogin={() => redirectToLogin(3)} />
            ) : (
              <StepTime
                slots={slots}
                loading={slotsLoading}
                selected={selected.slot}
                dateStr={selected.date}
                totalDuration={sumDuration(selected.services)}
                onSelect={(slot) => {
                  setSelected((s) => ({ ...s, slot }));
                  setStep(4);
                }}
              />
            )
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

function StepServices({ services, selected, onToggle, onContinue }) {
  if (!services.length) {
    return <p className="text-gray-400">Nenhum serviço disponível. O administrador precisa cadastrar os serviços.</p>;
  }

  const totalDuration = sumDuration(selected);
  const totalPrice = sumPrice(selected);

  return (
    <div className="grid gap-3">
      <h2 className="text-xl font-bold text-text mb-2">Escolha os serviços</h2>
      <p className="text-sm text-gray-400 -mt-1 mb-2">Você pode selecionar mais de um serviço.</p>
      {services.map((s) => {
        const isSelected = selected.some((item) => item.id === s.id);
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onToggle(s)}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
              isSelected ? 'border-secondary bg-secondary/10' : 'border-gray-700 hover:border-gray-500'
            }`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    isSelected ? 'border-secondary bg-secondary text-white' : 'border-gray-600'
                  }`}
                >
                  {isSelected ? <Check size={12} /> : null}
                </span>
                <div>
                  <p className="font-bold text-text">{s.name}</p>
                  {s.description && <p className="text-sm text-gray-400 mt-1">{s.description}</p>}
                  <p className="text-xs text-gray-500 mt-2">{s.durationMinutes} min</p>
                </div>
              </div>
              <p className="text-secondary font-bold shrink-0">R$ {s.price?.toFixed(2)}</p>
            </div>
          </button>
        );
      })}

      {selected.length > 0 && (
        <div className="rounded-xl bg-primary border border-gray-700 p-4 text-sm">
          <p className="text-text">
            <span className="text-gray-400">Selecionados:</span> {selected.length} serviço(s)
          </p>
          <p className="text-text mt-1">
            <span className="text-gray-400">Duração total:</span> {totalDuration} min
          </p>
          <p className="text-secondary font-bold mt-1">Total: R$ {totalPrice.toFixed(2)}</p>
        </div>
      )}

      <Button onClick={onContinue} className="w-full" disabled={!selected.length}>
        Continuar
      </Button>
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

function LoginPrompt({ onLogin }) {
  return (
    <div className="text-center py-8 px-4">
      <p className="text-text font-medium mb-2">Você precisa fazer login antes de continuar.</p>
      <p className="text-gray-400 text-sm mb-6">
        Entre na sua conta para ver os horários disponíveis e confirmar o agendamento.
      </p>
      <Button onClick={onLogin} className="w-full max-w-xs mx-auto">
        Fazer login
      </Button>
    </div>
  );
}

function StepTime({ slots, loading, selected, onSelect, dateStr, totalDuration }) {
  if (loading) return <Loading message="Buscando horários disponíveis..." />;

  const day = new Date(dateStr + 'T12:00:00').getDay();
  if (day === 0) {
    return (
      <p className="text-gray-400 text-center py-8">
        A barbearia não abre aos domingos. Volte e escolha outra data.
      </p>
    );
  }

  if (!slots.length) {
    return (
      <p className="text-gray-400 text-center py-8">
        Nenhum horário disponível nesta data. Tente outro dia ou menos serviços ({totalDuration} min no total).
      </p>
    );
  }
  return (
    <div>
      <h2 className="text-xl font-bold text-text mb-2">Escolha o horário</h2>
      <p className="text-sm text-gray-400 mb-4">Duração total: {totalDuration} min</p>
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
  const totalDuration = sumDuration(selected.services);
  const totalPrice = sumPrice(selected.services);

  return (
    <div>
      <h2 className="text-xl font-bold text-text mb-4">Confirmar agendamento</h2>
      <div className="space-y-3 bg-primary rounded-xl p-4">
        <Row label="Barbeiro" value={selected.barber?.name} />
        <Row label="Serviços" value={formatServiceNames(selected.services)} />
        <Row label="Duração" value={`${totalDuration} min`} />
        <Row label="Data" value={formatDate(selected.date)} />
        <Row label="Horário" value={selected.slot?.label} />
        <Row label="Valor" value={`R$ ${totalPrice.toFixed(2)}`} highlight />
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
    <div className="flex justify-between gap-4">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className={`text-right ${highlight ? 'text-secondary font-bold' : 'text-text'}`}>{value}</span>
    </div>
  );
}
