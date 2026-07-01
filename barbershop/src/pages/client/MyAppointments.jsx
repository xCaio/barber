import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, X, RefreshCw, MessageCircle, Clock, User, CalendarPlus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import {
  getClientAppointments,
  cancelAppointment,
  rescheduleAppointment,
  getAvailableSlots,
  buildWhatsAppMessage,
} from '../../services/appointmentService';
import { APPOINTMENT_STATUS, WHATSAPP_BASE_URL } from '../../constants';
import { formatDate, formatTime, toDate, DATE_FORMAT } from '../../utils/dateUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ClientPageShell from '../../components/layout/ClientPageShell';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export default function MyAppointments() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [slots, setSlots] = useState([]);
  const [newDate, setNewDate] = useState(format(new Date(), DATE_FORMAT));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    if (!user) return;
    try {
      const data = await getClientAppointments(user.uid);
      setAppointments(data);
    } catch {
      toast.error('Erro ao carregar agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  useEffect(() => {
    if (!rescheduleModal) return;
    getAvailableSlots({
      barberId: rescheduleModal.barberId,
      dateStr: newDate,
      serviceDurationMinutes: rescheduleModal.durationMinutes,
    }).then(setSlots);
  }, [rescheduleModal, newDate]);

  const handleCancel = async (id) => {
    if (!confirm('Deseja cancelar este agendamento?')) return;
    setActionLoading(true);
    try {
      await cancelAppointment(id);
      toast.success('Agendamento cancelado.');
      load();
    } catch {
      toast.error('Erro ao cancelar.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedSlot) {
      toast.error('Selecione um horário.');
      return;
    }
    setActionLoading(true);
    try {
      await rescheduleAppointment(rescheduleModal.id, {
        startAt: selectedSlot.start,
        durationMinutes: rescheduleModal.durationMinutes,
      });
      toast.success('Agendamento reagendado!');
      setRescheduleModal(null);
      load();
    } catch {
      toast.error('Erro ao reagendar.');
    } finally {
      setActionLoading(false);
    }
  };

  const upcoming = appointments.filter(
    (a) => a.status === APPOINTMENT_STATUS.SCHEDULED && toDate(a.startAt) > new Date()
  );
  const history = appointments.filter(
    (a) => a.status !== APPOINTMENT_STATUS.SCHEDULED || toDate(a.startAt) <= new Date()
  );

  if (loading) return <Loading fullScreen />;

  return (
    <ClientPageShell
      title="Meus Agendamentos"
      subtitle="Acompanhe seus horários, reagende ou cancele quando precisar."
    >
      <section className="mb-10 sm:mb-12">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-bold text-text flex items-center gap-2">
            <Calendar size={20} className="text-secondary shrink-0" />
            Próximos
          </h2>
          <Link
            to="/agendar"
            className="text-xs sm:text-sm text-secondary hover:underline font-medium whitespace-nowrap"
          >
            + Novo agendamento
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="client-panel p-8 sm:p-10 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-secondary/10 text-secondary mb-4">
              <CalendarPlus size={28} />
            </div>
            <p className="text-text font-medium mb-2">Nenhum agendamento futuro</p>
            <p className="text-gray-400 text-sm mb-5 max-w-xs mx-auto">
              Que tal reservar seu próximo horário na barbearia?
            </p>
            <Link to="/agendar">
              <Button>Agendar horário</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                upcoming
                onCancel={() => handleCancel(a.id)}
                onReschedule={() => {
                  setRescheduleModal(a);
                  setNewDate(format(toDate(a.startAt), DATE_FORMAT));
                  setSelectedSlot(null);
                }}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-base sm:text-lg font-bold text-text mb-4 sm:mb-5">Histórico</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">Nenhum histórico ainda.</p>
        ) : (
          <div className="space-y-3">
            {history.map((a) => (
              <AppointmentCard key={a.id} appointment={a} readonly />
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={!!rescheduleModal}
        onClose={() => setRescheduleModal(null)}
        title="Reagendar horário"
      >
        <p className="text-sm text-gray-400 mb-4">
          {rescheduleModal?.serviceName} com {rescheduleModal?.barberName}
        </p>
        <label className="block text-sm text-gray-400 mb-1.5">Nova data</label>
        <input
          type="date"
          value={newDate}
          min={format(new Date(), DATE_FORMAT)}
          onChange={(e) => {
            setNewDate(e.target.value);
            setSelectedSlot(null);
          }}
          className="w-full px-4 py-2.5 rounded-xl bg-primary border border-gray-700 text-text mb-4 focus:border-secondary outline-none"
        />
        <label className="block text-sm text-gray-400 mb-2">Horário disponível</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-5 max-h-48 overflow-y-auto pr-1">
          {slots.length === 0 ? (
            <p className="col-span-full text-sm text-gray-500 py-4 text-center">Nenhum horário nesta data.</p>
          ) : (
            slots.map((slot) => (
              <button
                key={slot.label}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                  selectedSlot?.label === slot.label
                    ? 'border-secondary bg-secondary text-white'
                    : 'border-gray-700 hover:border-secondary/60 text-text'
                }`}
              >
                {slot.label}
              </button>
            ))
          )}
        </div>
        <Button onClick={handleReschedule} className="w-full" loading={actionLoading} disabled={!selectedSlot}>
          Confirmar reagendamento
        </Button>
      </Modal>
    </ClientPageShell>
  );
}

function AppointmentCard({ appointment: a, onCancel, onReschedule, readonly, upcoming, actionLoading }) {
  const isScheduled = a.status === APPOINTMENT_STATUS.SCHEDULED;
  const whatsappUrl = `${WHATSAPP_BASE_URL}/5531995925295?text=${buildWhatsAppMessage(a)}`;
  const startDate = toDate(a.startAt);
  const dayNum = format(startDate, 'd');
  const month = format(startDate, 'MMM', { locale: ptBR });

  return (
    <div
      className={`appointment-card client-panel p-4 sm:p-5 ${
        upcoming ? 'appointment-card-upcoming' : 'opacity-90'
      }`}
    >
      <div className="flex gap-3 sm:gap-4">
        <div
          className={`flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl shrink-0 border ${
            upcoming
              ? 'bg-secondary/15 border-secondary/40 text-secondary'
              : 'bg-gray-800/60 border-gray-700 text-gray-400'
          }`}
        >
          <span className="text-[10px] sm:text-xs uppercase font-bold leading-none">{month}</span>
          <span className="text-xl sm:text-2xl font-bold text-text leading-tight">{dayNum}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex justify-between items-start gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="font-bold text-text text-base sm:text-lg leading-tight truncate">{a.serviceName}</h3>
              <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                <User size={13} className="shrink-0" /> {a.barberName}
              </p>
            </div>
            <StatusBadge status={a.status} />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-3">
            <span className="text-text flex items-center gap-1">
              <Clock size={13} className="text-gray-500 shrink-0" />
              {formatDate(a.startAt)} às {formatTime(a.startAt)}
            </span>
            <span className="text-secondary font-bold">R$ {a.price?.toFixed(2)}</span>
          </div>

          {!readonly && isScheduled && (
            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="sm" variant="secondary" onClick={onReschedule} disabled={actionLoading}>
                <RefreshCw size={14} className="inline mr-1" /> Reagendar
              </Button>
              <Button size="sm" variant="danger" onClick={onCancel} disabled={actionLoading}>
                <X size={14} className="inline mr-1" /> Cancelar
              </Button>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="ghost">
                  <MessageCircle size={14} className="inline mr-1" /> WhatsApp
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
