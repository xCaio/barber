import { useState, useEffect } from 'react';
import { Calendar, X, RefreshCw, MessageCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-primary pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary mb-8">Meus Agendamentos</h1>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-secondary" /> Próximos
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-gray-400 bg-card rounded-xl p-6 text-center">Nenhum agendamento futuro.</p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((a) => (
                <AppointmentCard
                  key={a.id}
                  appointment={a}
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
          <h2 className="text-lg font-bold text-text mb-4">Histórico</h2>
          {history.length === 0 ? (
            <p className="text-gray-400">Nenhum histórico.</p>
          ) : (
            <div className="space-y-3">
              {history.map((a) => (
                <AppointmentCard key={a.id} appointment={a} readonly />
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal
        isOpen={!!rescheduleModal}
        onClose={() => setRescheduleModal(null)}
        title="Reagendar horário"
      >
        <input
          type="date"
          value={newDate}
          min={format(new Date(), DATE_FORMAT)}
          onChange={(e) => {
            setNewDate(e.target.value);
            setSelectedSlot(null);
          }}
          className="w-full px-4 py-2 rounded-xl bg-primary border border-gray-700 text-text mb-4"
        />
        <div className="grid grid-cols-3 gap-2 mb-4 max-h-48 overflow-y-auto">
          {slots.map((slot) => (
            <button
              key={slot.label}
              type="button"
              onClick={() => setSelectedSlot(slot)}
              className={`py-2 rounded-lg border text-sm cursor-pointer ${
                selectedSlot?.label === slot.label ? 'border-secondary bg-secondary text-white' : 'border-gray-700'
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>
        <Button onClick={handleReschedule} className="w-full" loading={actionLoading}>
          Confirmar reagendamento
        </Button>
      </Modal>
    </div>
  );
}

function AppointmentCard({ appointment: a, onCancel, onReschedule, readonly, actionLoading }) {
  const isScheduled = a.status === APPOINTMENT_STATUS.SCHEDULED;
  const whatsappUrl = `${WHATSAPP_BASE_URL}/5531995925295?text=${buildWhatsAppMessage(a)}`;

  return (
    <div className="bg-card rounded-xl border border-gray-800 p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-text text-lg">{a.serviceName}</h3>
          <p className="text-gray-400 text-sm">{a.barberName}</p>
        </div>
        <StatusBadge status={a.status} />
      </div>
      <p className="text-text mb-1">
        {formatDate(a.startAt)} às {formatTime(a.startAt)}
      </p>
      <p className="text-secondary font-bold mb-4">R$ {a.price?.toFixed(2)}</p>
      {!readonly && isScheduled && (
        <div className="flex flex-wrap gap-2">
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
  );
}
