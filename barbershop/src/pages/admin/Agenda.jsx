import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getActiveBarbers } from '../../services/barberService';
import { getAppointmentsByDateRange } from '../../services/appointmentService';
import { toDate, formatTime } from '../../utils/dateUtils';
import { APPOINTMENT_STATUS } from '../../constants';
import Select from '../../components/ui/Select';
import Loading from '../../components/ui/Loading';

const STATUS_COLORS = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'bg-blue-600/80 border-blue-500',
  [APPOINTMENT_STATUS.COMPLETED]: 'bg-green-700/80 border-green-600',
  [APPOINTMENT_STATUS.CANCELLED]: 'bg-gray-700/50 border-gray-600 line-through opacity-60',
};

export default function AdminAgenda() {
  const [barbers, setBarbers] = useState([]);
  const [barberId, setBarberId] = useState('');
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    getActiveBarbers().then((b) => {
      setBarbers(b);
      if (b.length) setBarberId(b[0].id);
    });
  }, []);

  useEffect(() => {
    if (!barberId) return;
    const start = format(weekDays[0], 'yyyy-MM-dd');
    const end = format(weekDays[6], 'yyyy-MM-dd');
    setLoading(true);
    getAppointmentsByDateRange(barberId, start, end)
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, [barberId, weekStart]);

  const getForDay = (day) =>
    appointments.filter((a) => isSameDay(toDate(a.startAt), day));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-secondary">Calendário</h1>
        <div className="flex gap-2">
          <button type="button" onClick={() => setWeekStart(addDays(weekStart, -7))} className="px-3 py-2 bg-card rounded-lg cursor-pointer">← Semana</button>
          <button type="button" onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))} className="px-3 py-2 bg-card rounded-lg cursor-pointer">Hoje</button>
          <button type="button" onClick={() => setWeekStart(addDays(weekStart, 7))} className="px-3 py-2 bg-card rounded-lg cursor-pointer">Semana →</button>
        </div>
      </div>

      <Select
        label="Barbeiro"
        value={barberId}
        onChange={(e) => setBarberId(e.target.value)}
        options={barbers.map((b) => ({ value: b.id, label: b.name }))}
        className="mb-6 max-w-xs"
      />

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const dayAppts = getForDay(day);
            const isToday = isSameDay(day, new Date());
            return (
              <div
                key={day.toISOString()}
                className={`bg-card rounded-xl border p-3 min-h-[200px] ${isToday ? 'border-secondary' : 'border-gray-800'}`}
              >
                <p className={`font-bold text-sm mb-3 capitalize ${isToday ? 'text-secondary' : 'text-text'}`}>
                  {format(day, 'EEE dd/MM', { locale: ptBR })}
                </p>
                <div className="space-y-2">
                  {dayAppts.length === 0 ? (
                    <p className="text-gray-600 text-xs">—</p>
                  ) : (
                    dayAppts.map((a) => (
                      <div
                        key={a.id}
                        className={`text-xs p-2 rounded-lg border ${STATUS_COLORS[a.status] || STATUS_COLORS[APPOINTMENT_STATUS.SCHEDULED]}`}
                      >
                        <p className="font-bold">{formatTime(a.startAt)}</p>
                        <p className="truncate">{a.clientName}</p>
                        <p className="truncate opacity-80">{a.serviceName}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
