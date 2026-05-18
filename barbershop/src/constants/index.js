export const ROLES = {
  CLIENT: 'client',
  BARBER: 'barber',
  ADMIN: 'admin',
};

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'agendado',
  COMPLETED: 'concluido',
  CANCELLED: 'cancelado',
};

export const SLOT_INTERVAL_MINUTES = 15;

export const DEFAULT_WORKING_HOURS = {
  start: '09:00',
  end: '19:00',
};

export const DEFAULT_LUNCH_BREAK = {
  start: '12:00',
  end: '13:00',
};

export const DAYS_OF_WEEK = [
  { key: 0, label: 'Domingo' },
  { key: 1, label: 'Segunda' },
  { key: 2, label: 'Terça' },
  { key: 3, label: 'Quarta' },
  { key: 4, label: 'Quinta' },
  { key: 5, label: 'Sexta' },
  { key: 6, label: 'Sábado' },
];

export const WHATSAPP_BASE_URL = 'https://wa.me';
