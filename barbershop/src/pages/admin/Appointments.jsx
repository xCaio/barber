import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import {
  getAppointmentsByBarberAndDate,
  cancelAppointment,
  rescheduleAppointment,
  updateAppointmentStatus,
  getAvailableSlots,
  createAppointment,
} from '../../services/appointmentService';
import { getActiveBarbers } from '../../services/barberService';
import { getActiveServices } from '../../services/serviceService';
import { APPOINTMENT_STATUS } from '../../constants';
import { DATE_FORMAT, formatTime, toDate } from '../../utils/dateUtils';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Loading from '../../components/ui/Loading';
import toast from 'react-hot-toast';

export default function AdminAppointments() {
  const [barbers, setBarbers] = useState([]);
  const [barberId, setBarberId] = useState('');
  const [date, setDate] = useState(format(new Date(), DATE_FORMAT));
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = async () => {
    if (!barberId) return;
    setLoading(true);
    try {
      const data = await getAppointmentsByBarberAndDate(barberId, date);
      setAppointments(data);
    } catch {
      toast.error('Erro ao carregar agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getActiveBarbers().then((b) => {
      setBarbers(b);
      if (b.length) setBarberId(b[0].id);
    });
  }, []);

  useEffect(() => {
    if (barberId) load();
  }, [barberId, date]);

  const handleStatus = async (id, status) => {
    await updateAppointmentStatus(id, status);
    toast.success('Status atualizado.');
    load();
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancelar agendamento?')) return;
    await cancelAppointment(id);
    toast.success('Cancelado.');
    load();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-secondary">Agendamentos</h1>
        <Button onClick={() => setModal('create')}>+ Novo agendamento</Button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Select
          label="Barbeiro"
          value={barberId}
          onChange={(e) => setBarberId(e.target.value)}
          options={barbers.map((b) => ({ value: b.id, label: b.name }))}
          className="min-w-[180px]"
        />
        <div>
          <label className="block text-sm text-gray-400 mb-1">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-card border border-gray-700 text-text"
          />
        </div>
        <div className="flex items-end gap-2">
          <button type="button" onClick={() => setDate(format(addDays(new Date(date + 'T12:00:00'), -1), DATE_FORMAT))} className="px-3 py-2 bg-card rounded-lg cursor-pointer">←</button>
          <button type="button" onClick={() => setDate(format(addDays(new Date(date + 'T12:00:00'), 1), DATE_FORMAT))} className="px-3 py-2 bg-card rounded-lg cursor-pointer">→</button>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : appointments.length === 0 ? (
        <p className="text-gray-400 text-center py-12 bg-card rounded-xl">Nenhum agendamento nesta data.</p>
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => (
            <div key={a.id} className="bg-card rounded-xl border border-gray-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-text">{formatTime(a.startAt)} — {a.clientName}</p>
                <p className="text-sm text-gray-400">{a.serviceName} • R$ {a.price?.toFixed(2)} • {a.durationMinutes}min</p>
                <p className="text-xs text-gray-500">{a.clientPhone || a.clientEmail}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={a.status} />
                {a.status === APPOINTMENT_STATUS.SCHEDULED && (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => setModal({ type: 'reschedule', appointment: a })}>Reagendar</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleStatus(a.id, APPOINTMENT_STATUS.COMPLETED)}>Concluir</Button>
                    <Button size="sm" variant="danger" onClick={() => handleCancel(a.id)}>Cancelar</Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === 'create' && (
        <CreateAppointmentModal barbers={barbers} barberId={barberId} date={date} onClose={() => setModal(null)} onSuccess={load} />
      )}
      {modal?.type === 'reschedule' && (
        <RescheduleModal appointment={modal.appointment} onClose={() => setModal(null)} onSuccess={load} />
      )}
    </div>
  );
}

function CreateAppointmentModal({ barbers, barberId, date, onClose, onSuccess }) {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ barberId, serviceId: '', clientName: '', clientPhone: '', date, slot: null });
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getActiveServices().then(setServices);
  }, []);

  const service = services.find((s) => s.id === form.serviceId);

  useEffect(() => {
    if (!form.barberId || !service) return;
    getAvailableSlots({ barberId: form.barberId, dateStr: form.date, serviceDurationMinutes: service.durationMinutes }).then(setSlots);
  }, [form.barberId, form.serviceId, form.date, service]);

  const submit = async () => {
    if (!form.slot || !form.clientName || !service) {
      toast.error('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      await createAppointment({
        clientId: 'manual',
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        barberId: form.barberId,
        barberName: barbers.find((b) => b.id === form.barberId)?.name,
        serviceId: service.id,
        serviceName: service.name,
        durationMinutes: service.durationMinutes,
        price: service.price,
        startAt: form.slot.start,
      });
      toast.success('Agendamento criado!');
      onSuccess();
      onClose();
    } catch {
      toast.error('Erro ao criar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Novo agendamento manual" size="lg">
      <div className="space-y-4">
        <Select label="Barbeiro" value={form.barberId} onChange={(e) => setForm({ ...form, barberId: e.target.value, slot: null })} options={barbers.map((b) => ({ value: b.id, label: b.name }))} />
        <Select label="Serviço" value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value, slot: null })} options={[{ value: '', label: 'Selecione...' }, ...services.map((s) => ({ value: s.id, label: `${s.name} (${s.durationMinutes}min)` }))]} />
        <Input label="Nome do cliente" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
        <Input label="Telefone" value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} />
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value, slot: null })} className="w-full px-4 py-2 rounded-xl bg-primary border border-gray-700 text-text" />
        <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
          {slots.map((s) => (
            <button key={s.label} type="button" onClick={() => setForm({ ...form, slot: s })} className={`py-2 rounded-lg border text-sm cursor-pointer ${form.slot?.label === s.label ? 'border-secondary bg-secondary' : 'border-gray-700'}`}>{s.label}</button>
          ))}
        </div>
        <Button onClick={submit} className="w-full" loading={loading}>Criar agendamento</Button>
      </div>
    </Modal>
  );
}

function RescheduleModal({ appointment, onClose, onSuccess }) {
  const [date, setDate] = useState(format(toDate(appointment.startAt), DATE_FORMAT));
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAvailableSlots({ barberId: appointment.barberId, dateStr: date, serviceDurationMinutes: appointment.durationMinutes }).then(setSlots);
  }, [date]);

  const submit = async () => {
    if (!selected) return;
    setLoading(true);
    await rescheduleAppointment(appointment.id, { startAt: selected.start, durationMinutes: appointment.durationMinutes });
    toast.success('Reagendado!');
    onSuccess();
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} title={`Reagendar — ${appointment.clientName}`}>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-primary border border-gray-700 text-text mb-4" />
      <div className="grid grid-cols-4 gap-2 mb-4 max-h-40 overflow-y-auto">
        {slots.map((s) => (
          <button key={s.label} type="button" onClick={() => setSelected(s)} className={`py-2 rounded-lg border text-sm cursor-pointer ${selected?.label === s.label ? 'border-secondary bg-secondary' : 'border-gray-700'}`}>{s.label}</button>
        ))}
      </div>
      <Button onClick={submit} className="w-full" loading={loading}>Confirmar</Button>
    </Modal>
  );
}
