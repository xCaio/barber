import { APPOINTMENT_STATUS } from '../../constants';

const styles = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'bg-blue-900/50 text-blue-300 border-blue-700',
  [APPOINTMENT_STATUS.COMPLETED]: 'bg-green-900/50 text-green-300 border-green-700',
  [APPOINTMENT_STATUS.CANCELLED]: 'bg-red-900/50 text-red-300 border-red-700',
};

const labels = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'Agendado',
  [APPOINTMENT_STATUS.COMPLETED]: 'Concluído',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelado',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles[APPOINTMENT_STATUS.SCHEDULED]}`}>
      {labels[status] || status}
    </span>
  );
}
