import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getUpcomingAppointments } from '../../services/appointmentService';
import { APPOINTMENT_STATUS } from '../../constants';
import { formatTime, toDate } from '../../utils/dateUtils';
import StatusBadge from '../../components/ui/StatusBadge';
import Loading from '../../components/ui/Loading';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUpcomingAppointments(null, 50)
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, []);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(
    (a) => format(toDate(a.startAt), 'yyyy-MM-dd') === today && a.status === APPOINTMENT_STATUS.SCHEDULED
  );
  const scheduled = appointments.filter((a) => a.status === APPOINTMENT_STATUS.SCHEDULED);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8 capitalize">
        {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Calendar} label="Hoje" value={todayAppointments.length} color="text-secondary" />
        <StatCard icon={Clock} label="Próximos" value={scheduled.length} color="text-blue-400" />
        <StatCard icon={Users} label="Clientes hoje" value={new Set(todayAppointments.map((a) => a.clientId)).size} color="text-green-400" />
        <StatCard icon={CheckCircle} label="Concluídos" value={appointments.filter((a) => a.status === APPOINTMENT_STATUS.COMPLETED).length} color="text-gray-400" />
      </div>

      <div className="bg-card rounded-2xl border border-gray-800 p-6">
        <h2 className="text-lg font-bold text-text mb-4">Agenda de hoje</h2>
        {todayAppointments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Nenhum agendamento para hoje.</p>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 bg-primary rounded-xl">
                <div>
                  <p className="font-bold text-text">{formatTime(a.startAt)} — {a.clientName}</p>
                  <p className="text-sm text-gray-400">{a.serviceName} • {a.barberName}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-card rounded-xl border border-gray-800 p-4">
      <Icon className={`${color} mb-2`} size={24} />
      <p className="text-2xl font-bold text-text">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
