import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { APPOINTMENT_STATUS } from '../constants';
import { toDate, getDayBounds } from '../utils/dateUtils';
import { getAvailabilityForBarberAndDate } from './availabilityService';
import { getBarberById } from './barberService';
import { calculateAvailableSlots } from '../utils/slotCalculator';
import { format } from 'date-fns';
import { DATE_FORMAT } from '../utils/dateUtils';

const COLLECTION = 'appointments';

export async function getAppointmentsByBarberAndDate(barberId, dateStr) {
  const { start, end } = getDayBounds(dateStr);
  const q = query(
    collection(db, COLLECTION),
    where('barberId', '==', barberId),
    where('startAt', '>=', Timestamp.fromDate(start)),
    where('startAt', '<=', Timestamp.fromDate(end)),
    orderBy('startAt', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getClientAppointments(clientId) {
  const q = query(
    collection(db, COLLECTION),
    where('clientId', '==', clientId),
    orderBy('startAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getUpcomingAppointments(barberId, limit = 20) {
  const now = Timestamp.now();
  const constraints = [
    where('startAt', '>=', now),
    orderBy('startAt', 'asc'),
  ];
  if (barberId) {
    constraints.unshift(where('barberId', '==', barberId));
  }
  const q = query(collection(db, COLLECTION), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).slice(0, limit);
}

export async function getAvailableSlots({ barberId, dateStr, serviceDurationMinutes }) {
  const barber = await getBarberById(barberId);
  if (!barber) return [];

  const availability = await getAvailabilityForBarberAndDate(barber, dateStr);
  if (availability.isDayOff) return [];

  const appointments = await getAppointmentsByBarberAndDate(barberId, dateStr);

  return calculateAvailableSlots({
    dateStr,
    serviceDurationMinutes,
    workingHours: availability.workingHours,
    lunchBreak: availability.lunchBreak,
    appointments,
    blockedSlots: availability.blockedSlots,
    isDayOff: availability.isDayOff,
  });
}

export async function createAppointment({
  clientId,
  clientName,
  clientPhone,
  clientEmail,
  barberId,
  barberName,
  serviceId,
  serviceName,
  durationMinutes,
  price,
  startAt,
  notes = '',
}) {
  const endAt = new Date(toDate(startAt).getTime() + durationMinutes * 60000);

  const ref = await addDoc(collection(db, COLLECTION), {
    clientId,
    clientName,
    clientPhone: clientPhone || '',
    clientEmail: clientEmail || '',
    barberId,
    barberName,
    serviceId,
    serviceName,
    durationMinutes,
    price,
    startAt: Timestamp.fromDate(toDate(startAt)),
    endAt: Timestamp.fromDate(endAt),
    status: APPOINTMENT_STATUS.SCHEDULED,
    notes,
    paymentMethod: 'presencial',
    whatsappNotified: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

export async function updateAppointmentStatus(id, status) {
  await updateDoc(doc(db, COLLECTION, id), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function rescheduleAppointment(id, { startAt, durationMinutes }) {
  const endAt = new Date(toDate(startAt).getTime() + durationMinutes * 60000);
  await updateDoc(doc(db, COLLECTION, id), {
    startAt: Timestamp.fromDate(toDate(startAt)),
    endAt: Timestamp.fromDate(endAt),
    status: APPOINTMENT_STATUS.SCHEDULED,
    updatedAt: serverTimestamp(),
  });
}

export async function cancelAppointment(id) {
  await updateAppointmentStatus(id, APPOINTMENT_STATUS.CANCELLED);
}

export async function getAppointmentById(id) {
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getAppointmentsByDateRange(barberId, startDate, endDate) {
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T23:59:59');
  const q = query(
    collection(db, COLLECTION),
    where('barberId', '==', barberId),
    where('startAt', '>=', Timestamp.fromDate(start)),
    where('startAt', '<=', Timestamp.fromDate(end)),
    orderBy('startAt', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function buildWhatsAppMessage(appointment) {
  const date = format(toDate(appointment.startAt), "dd/MM/yyyy 'às' HH:mm");
  return encodeURIComponent(
    `Olá! Confirmo meu agendamento:\n` +
      `Serviço: ${appointment.serviceName}\n` +
      `Barbeiro: ${appointment.barberName}\n` +
      `Data: ${date}\n` +
      `Valor: R$ ${appointment.price?.toFixed(2)}`
  );
}
