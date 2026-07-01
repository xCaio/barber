import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Scissors,
  Calendar,
  Clock,
  Banknote,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getActiveBarbers } from '../../services/barberService';
import { getActiveServices } from '../../services/serviceService';
import { getAvailableSlots, createAppointment } from '../../services/appointmentService';
import { DATE_FORMAT, formatDate } from '../../utils/dateUtils';
import ClientPageShell from '../../components/layout/ClientPageShell';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { isFirebaseConfigured } from '../../config/firebase';

const STEPS = ['Barbeiro', 'Serviços', 'Data', 'Horário', 'Confirmar'];
const BOOKING_DRAFT_KEY = 'bookingDraft';

const STEP_ICONS = [User, Scissors, Calendar, Clock, Check];

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

function StepIndicator({ steps, currentStep }) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 mb-2.5 px-0.5">
        <span>
          Passo <span className="text-text font-medium">{currentStep + 1}</span> de {steps.length}
        </span>
        <span className="text-secondary font-semibold">{steps[currentStep]}</span>
      </div>

      <div className="h-1.5 bg-gray-800/80 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-secondary/80 to-secondary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {steps.map((label, i) => {
          const Icon = STEP_ICONS[i];
          const isActive = i === currentStep;
          const isDone = i < currentStep;

          return (
            <div
              key={label}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap shrink-0 border transition-colors ${
                isActive
                  ? 'bg-secondary text-white border-secondary shadow-[0_4px_16px_rgba(189,26,26,0.35)]'
                  : isDone
                    ? 'bg-green-950/50 text-green-300 border-green-800/50'
                    : 'bg-primary/60 text-gray-500 border-gray-800'
              }`}
            >
              {isDone ? (
                <Check size={14} className="shrink-0" />
              ) : (
                <Icon size={14} className="shrink-0 opacity-80" />
              )}
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
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
      <ClientPageShell title="Agendar Horário" subtitle="Configure o Firebase para continuar">
        <div className="client-panel p-6 sm:p-8 text-center">
          <h2 className="text-lg font-bold text-secondary mb-3">Firebase não configurado</h2>
          <p className="text-gray-400 text-sm">
            Crie o arquivo <strong className="text-text">.env</strong> na raiz do projeto com suas credenciais
            (copie de <strong className="text-text">.env.example</strong>) e reinicie o servidor.
          </p>
        </div>
      </ClientPageShell>
    );
  }

  return (
    <ClientPageShell
      title="Agendar Horário"
      subtitle="Escolha barbeiro, serviços e horário. Pagamento presencial na barbearia."
    >
      <StepIndicator steps={STEPS} currentStep={step} />

      <div className="client-panel p-4 sm:p-6 md:p-8">
        {loadError && (
          <div className="mb-5 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
            className="mt-6 sm:mt-8 flex items-center gap-1.5 text-sm text-gray-400 hover:text-secondary cursor-pointer transition-colors"
          >
            <ChevronLeft size={18} /> Voltar
          </button>
        )}
      </div>
    </ClientPageShell>
  );
}

function StepBarber({ barbers, selected, onSelect }) {
  if (!barbers.length) {
    return <p className="text-gray-400 text-center py-6">Nenhum barbeiro disponível no momento.</p>;
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      <StepTitle icon={User} title="Escolha o barbeiro" />
      {barbers.map((b) => {
        const isSelected = selected?.id === b.id;
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelect(b)}
            className={`booking-option p-4 sm:p-5 rounded-xl border text-left cursor-pointer ${
              isSelected ? 'booking-option-selected' : 'border-gray-700/80 bg-primary/40'
            }`}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? 'bg-secondary/20 text-secondary' : 'bg-gray-800 text-gray-400'}`}>
                <User size={22} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-text text-base sm:text-lg">{b.name}</p>
                {b.bio && <p className="text-sm text-gray-400 mt-1 leading-relaxed">{b.bio}</p>}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function StepServices({ services, selected, onToggle, onContinue }) {
  if (!services.length) {
    return (
      <p className="text-gray-400 text-center py-6">
        Nenhum serviço disponível. O administrador precisa cadastrar os serviços.
      </p>
    );
  }

  const totalDuration = sumDuration(selected);
  const totalPrice = sumPrice(selected);

  return (
    <div className="grid gap-3 sm:gap-4">
      <StepTitle icon={Scissors} title="Escolha os serviços" subtitle="Você pode selecionar mais de um serviço." />

      {services.map((s) => {
        const isSelected = selected.some((item) => item.id === s.id);
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onToggle(s)}
            className={`booking-option p-4 sm:p-5 rounded-xl border text-left cursor-pointer ${
              isSelected ? 'booking-option-selected' : 'border-gray-700/80 bg-primary/40'
            }`}
          >
            <div className="flex justify-between items-start gap-3 sm:gap-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                    isSelected ? 'border-secondary bg-secondary text-white' : 'border-gray-600 bg-transparent'
                  }`}
                >
                  {isSelected ? <Check size={12} /> : null}
                </span>
                {s.image && (
                  <img
                    src={s.image}
                    alt=""
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0 border border-gray-700 hidden sm:block"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-bold text-text text-base">{s.name}</p>
                  {s.description && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{s.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock size={12} /> {s.durationMinutes} min
                  </p>
                </div>
              </div>
              <p className="text-secondary font-bold shrink-0 text-sm sm:text-base">
                R$ {s.price?.toFixed(2)}
              </p>
            </div>
          </button>
        );
      })}

      {selected.length > 0 && (
        <div className="rounded-xl bg-primary/70 border border-secondary/30 p-4 sm:p-5 text-sm">
          <p className="text-text">
            <span className="text-gray-400">Selecionados:</span>{' '}
            <span className="font-medium">{selected.length} serviço(s)</span>
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-text">
            <span><span className="text-gray-400">Duração:</span> {totalDuration} min</span>
            <span className="text-secondary font-bold">Total: R$ {totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      <Button onClick={onContinue} className="w-full mt-1" disabled={!selected.length}>
        Continuar
      </Button>
    </div>
  );
}

function StepDate({ date, onChangeDate, onNext }) {
  const dateObj = new Date(date + 'T12:00:00');
  const display = format(dateObj, "EEEE, dd 'de' MMMM", { locale: ptBR });
  const dayNum = format(dateObj, 'd');
  const month = format(dateObj, 'MMM', { locale: ptBR });

  return (
    <div>
      <StepTitle icon={Calendar} title="Escolha a data" />

      <div className="flex items-center justify-between gap-2 bg-primary/60 rounded-2xl border border-gray-700/80 p-3 sm:p-4 mb-5">
        <button
          type="button"
          onClick={() => onChangeDate(-1)}
          className="p-2.5 sm:p-3 rounded-xl hover:bg-gray-800 hover:text-secondary cursor-pointer transition-colors shrink-0"
          aria-label="Dia anterior"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 justify-center">
          <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-secondary/15 border border-secondary/40 shrink-0">
            <span className="text-[10px] sm:text-xs uppercase text-secondary font-bold leading-none">{month}</span>
            <span className="text-xl sm:text-2xl font-bold text-text leading-tight">{dayNum}</span>
          </div>
          <span className="font-medium capitalize text-sm sm:text-base text-center leading-snug">{display}</span>
        </div>

        <button
          type="button"
          onClick={() => onChangeDate(1)}
          className="p-2.5 sm:p-3 rounded-xl hover:bg-gray-800 hover:text-secondary cursor-pointer transition-colors shrink-0"
          aria-label="Próximo dia"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <Button onClick={onNext} className="w-full">Continuar</Button>
    </div>
  );
}

function LoginPrompt({ onLogin }) {
  return (
    <div className="text-center py-8 sm:py-10 px-2">
      <div className="inline-flex p-4 rounded-2xl bg-secondary/10 text-secondary mb-4">
        <User size={32} />
      </div>
      <p className="text-text font-medium mb-2 text-lg">Faça login para continuar</p>
      <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
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
      <p className="text-gray-400 text-center py-8 sm:py-10 leading-relaxed">
        A barbearia não abre aos domingos. Volte e escolha outra data.
      </p>
    );
  }

  if (!slots.length) {
    return (
      <p className="text-gray-400 text-center py-8 sm:py-10 leading-relaxed">
        Nenhum horário disponível nesta data. Tente outro dia ou menos serviços ({totalDuration} min no total).
      </p>
    );
  }

  return (
    <div>
      <StepTitle
        icon={Clock}
        title="Escolha o horário"
        subtitle={`Duração total: ${totalDuration} min`}
      />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-2.5">
        {slots.map((slot) => {
          const isSelected = selected?.label === slot.label;
          return (
            <button
              key={slot.label}
              type="button"
              onClick={() => onSelect(slot)}
              className={`py-2.5 sm:py-3 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                isSelected
                  ? 'border-secondary bg-secondary text-white shadow-[0_4px_16px_rgba(189,26,26,0.35)]'
                  : 'border-gray-700/80 bg-primary/40 hover:border-secondary/60 text-text'
              }`}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepConfirm({ selected, onConfirm, submitting }) {
  const totalDuration = sumDuration(selected.services);
  const totalPrice = sumPrice(selected.services);

  return (
    <div>
      <StepTitle icon={Check} title="Confirmar agendamento" />

      <div className="space-y-0 bg-primary/50 rounded-2xl border border-gray-700/80 overflow-hidden divide-y divide-gray-800/80">
        <ConfirmRow icon={User} label="Barbeiro" value={selected.barber?.name} />
        <ConfirmRow icon={Scissors} label="Serviços" value={formatServiceNames(selected.services)} />
        <ConfirmRow icon={Clock} label="Duração" value={`${totalDuration} min`} />
        <ConfirmRow icon={Calendar} label="Data" value={formatDate(selected.date)} />
        <ConfirmRow icon={Clock} label="Horário" value={selected.slot?.label} />
        <ConfirmRow icon={Banknote} label="Valor" value={`R$ ${totalPrice.toFixed(2)}`} highlight />
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">* Pagamento na barbearia</p>

      <Button onClick={onConfirm} className="w-full mt-6" loading={submitting}>
        Confirmar Agendamento
      </Button>
    </div>
  );
}

function StepTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4 sm:mb-5">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-secondary/15 text-secondary shrink-0">
          <Icon size={18} />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-text">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-gray-400 mt-2 ml-11 sm:ml-12">{subtitle}</p>}
    </div>
  );
}

function ConfirmRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3.5 sm:px-5 sm:py-4">
      <div className="flex items-center gap-2 text-gray-400 shrink-0">
        <Icon size={15} className="opacity-70" />
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-right text-sm sm:text-base font-medium ${highlight ? 'text-secondary font-bold' : 'text-text'}`}>
        {value}
      </span>
    </div>
  );
}
