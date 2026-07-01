import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  const getForDay = (day) => appointments.filter((a) => isSameDay(toDate(a.startAt), day));

  const weekLabel = `${format(weekDays[0], 'dd/MM')} – ${format(weekDays[6], 'dd/MM/yyyy')}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-secondary">Calendário</h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-gray-400 text-sm">{weekLabel}</p>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setWeekStart(addDays(weekStart, -7))}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2.5 bg-card border border-gray-800 rounded-xl text-sm cursor-pointer hover:border-gray-600"
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <button
              type="button"
              onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-secondary rounded-xl text-sm font-medium cursor-pointer"
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={() => setWeekStart(addDays(weekStart, 7))}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2.5 bg-card border border-gray-800 rounded-xl text-sm cursor-pointer hover:border-gray-600"
            >
              Próxima <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <Select
        label="Barbeiro"
        value={barberId}
        onChange={(e) => setBarberId(e.target.value)}
        options={barbers.map((b) => ({ value: b.id, label: b.name }))}
        className="w-full sm:max-w-xs"
      />

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Mobile: lista vertical por dia */}
          <div className="md:hidden space-y-3">
            {weekDays.map((day) => {
              const dayAppts = getForDay(day);
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={day.toISOString()}
                  className={`bg-card rounded-xl border p-4 ${isToday ? 'border-secondary' : 'border-gray-800'}`}
                >
                  <p className={`font-bold text-sm mb-3 capitalize ${isToday ? 'text-secondary' : 'text-text'}`}>
                    {format(day, "EEEE, dd/MM", { locale: ptBR })}
                  </p>
                  {dayAppts.length === 0 ? (
                    <p className="text-gray-600 text-xs">Sem agendamentos</p>
                  ) : (
                    <div className="space-y-2">
                      {dayAppts.map((a) => (
                        <AppointmentChip key={a.id} appointment={a} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tablet+: grid semanal com scroll horizontal em telas médias */}
          <div className="hidden md:block overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="grid grid-cols-7 gap-2 lg:gap-3 min-w-[640px] lg:min-w-0">
              {weekDays.map((day) => {
                const dayAppts = getForDay(day);
                const isToday = isSameDay(day, new Date());
                return (
                  <div
                    key={day.toISOString()}
                    className={`bg-card rounded-xl border p-2 lg:p-3 min-h-[160px] lg:min-h-[200px] ${
                      isToday ? 'border-secondary' : 'border-gray-800'
                    }`}
                  >
                    <p className={`font-bold text-xs lg:text-sm mb-2 capitalize truncate ${isToday ? 'text-secondary' : 'text-text'}`}>
                      {format(day, 'EEE dd/MM', { locale: ptBR })}
                    </p>
                    <div className="space-y-1.5">
                      {dayAppts.length === 0 ? (
                        <p className="text-gray-600 text-xs">—</p>
                      ) : (
                        dayAppts.map((a) => (
                          <AppointmentChip key={a.id} appointment={a} compact />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AppointmentChip({ appointment: a, compact = false }) {
  return (
    <div
      className={`${compact ? 'text-[10px] lg:text-xs p-1.5 lg:p-2' : 'text-xs p-2.5'} rounded-lg border ${
        STATUS_COLORS[a.status] || STATUS_COLORS[APPOINTMENT_STATUS.SCHEDULED]
      }`}
    >
      <p className="font-bold">{formatTime(a.startAt)}</p>
      <p className="truncate">{a.clientName}</p>
      {!compact && <p className="truncate opacity-80">{a.serviceName}</p>}
      {compact && <p className="truncate opacity-80 hidden lg:block">{a.serviceName}</p>}
    </div>
  );
}
