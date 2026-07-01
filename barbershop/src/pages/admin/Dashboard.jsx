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
      if (result.barber || result.services > 0) {
        toast.success(
          `Configurado: ${result.barber ? result.barber : ''}${result.services ? ` + ${result.services} serviços` : ''}`
        );
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
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8 capitalize">
        {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
      </p>

      {needsSetup && (
        <div className="mb-8 p-6 bg-secondary/10 border border-secondary rounded-2xl">
          <div className="flex items-start gap-4">
            <Database className="text-secondary shrink-0 mt-1" size={28} />
            <div className="flex-1">
              <h2 className="font-bold text-text text-lg mb-2">Configuração inicial</h2>
              <p className="text-gray-400 text-sm mb-4">
                Cadastre o barbeiro <strong className="text-text">Thiago Garcia</strong> e os serviços da barbearia
                para liberar o agendamento online.
              </p>
              <Button onClick={handleSeed} loading={seeding}>
                Configurar barbearia agora
              </Button>
            </div>
          </div>
        </div>
      )}

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
