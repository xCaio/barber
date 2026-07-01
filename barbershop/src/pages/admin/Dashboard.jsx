import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, Database } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getUpcomingAppointments } from '../../services/appointmentService';
import { hasBookingData, seedInitialData } from '../../services/seedService';
import { APPOINTMENT_STATUS } from '../../constants';
import { formatTime, toDate } from '../../utils/dateUtils';
import StatusBadge from '../../components/ui/StatusBadge';
import Loading from '../../components/ui/Loading';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    Promise.all([
      getUpcomingAppointments(null, 50).catch(() => []),
      hasBookingData().catch(() => false),
    ])
      .then(([appts, hasData]) => {
        setAppointments(appts);
        setNeedsSetup(!hasData);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const result = await seedInitialData();
      if (result.barber || result.services > 0 || result.barberUpdated) {
        const parts = [];
        if (result.barber) parts.push(result.barber);
        if (result.barberUpdated) parts.push('horários do barbeiro atualizados');
        if (result.services > 0) parts.push(`${result.services} serviços adicionados`);
        toast.success(`Configurado: ${parts.join(', ')}`);
        setNeedsSetup(false);
      } else {
        toast.success('Dados já existem no sistema.');
        setNeedsSetup(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao configurar. Verifique se seu usuário é admin no Firestore.');
    } finally {
      setSeeding(false);
    }
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(
    (a) => format(toDate(a.startAt), 'yyyy-MM-dd') === today && a.status === APPOINTMENT_STATUS.SCHEDULED
  );
  const scheduled = appointments.filter((a) => a.status === APPOINTMENT_STATUS.SCHEDULED);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary">Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base capitalize">
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {needsSetup && (
        <div className="p-4 sm:p-6 bg-secondary/10 border border-secondary rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Database className="text-secondary shrink-0" size={28} />
            <div className="flex-1 w-full">
              <h2 className="font-bold text-text text-base sm:text-lg mb-2">Configuração inicial</h2>
              <p className="text-gray-400 text-sm mb-4">
                Cadastra o barbeiro <strong className="text-text">Thiago Garcia</strong>, corrige horários e
                adiciona serviços que faltam.
              </p>
              <Button onClick={handleSeed} loading={seeding} className="w-full sm:w-auto">
                Configurar barbearia agora
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Calendar} label="Hoje" value={todayAppointments.length} color="text-secondary" />
        <StatCard icon={Clock} label="Próximos" value={scheduled.length} color="text-blue-400" />
        <StatCard icon={Users} label="Clientes hoje" value={new Set(todayAppointments.map((a) => a.clientId)).size} color="text-green-400" />
        <StatCard icon={CheckCircle} label="Concluídos" value={appointments.filter((a) => a.status === APPOINTMENT_STATUS.COMPLETED).length} color="text-gray-400" />
      </div>

      <div className="bg-card rounded-2xl border border-gray-800 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-text mb-4">Agenda de hoje</h2>
        {todayAppointments.length === 0 ? (
          <p className="text-gray-400 text-center py-8 text-sm">Nenhum agendamento para hoje.</p>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((a) => (
              <div
                key={a.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-4 bg-primary rounded-xl"
              >
                <div className="min-w-0">
                  <p className="font-bold text-text text-sm sm:text-base truncate">
                    {formatTime(a.startAt)} — {a.clientName}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">
                    {a.serviceName} • {a.barberName}
                  </p>
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
    <div className="bg-card rounded-xl border border-gray-800 p-3 sm:p-4">
      <Icon className={`${color} mb-1 sm:mb-2`} size={22} />
      <p className="text-xl sm:text-2xl font-bold text-text">{value}</p>
      <p className="text-xs sm:text-sm text-gray-400">{label}</p>
    </div>
  );
}
