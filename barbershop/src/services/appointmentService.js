import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
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

function filterAppointmentsByDate(docs, dateStr) {
  const { start, end } = getDayBounds(dateStr);
  return docs
    .filter((a) => {
      const apptStart = toDate(a.startAt);
      return apptStart >= start && apptStart <= end;
    })
    .sort((a, b) => toDate(a.startAt) - toDate(b.startAt));
}

/** Busca agendamentos do barbeiro no dia (admin — todos os status). */
export async function getAppointmentsByBarberAndDate(barberId, dateStr) {
  const snap = await getDocs(
    query(collection(db, COLLECTION), where('barberId', '==', barberId))
  );

  return filterAppointmentsByDate(
    snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    dateStr
  );
}

/** Agendamentos ativos do barbeiro no dia — usado no cálculo de horários (clientes). */
async function getScheduledAppointmentsByBarberAndDate(barberId, dateStr) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where('barberId', '==', barberId),
      where('status', '==', APPOINTMENT_STATUS.SCHEDULED)
    )
  );

  return filterAppointmentsByDate(
    snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    dateStr
  );
}

export async function getClientAppointments(clientId) {
  const snap = await getDocs(
    query(collection(db, COLLECTION), where('clientId', '==', clientId))
  );

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => toDate(b.startAt) - toDate(a.startAt));
}

export async function getUpcomingAppointments(barberId, limit = 20) {
  const now = new Date();
  let docs;

  if (barberId) {
    const snap = await getDocs(
      query(collection(db, COLLECTION), where('barberId', '==', barberId))
    );
    docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } else {
    const snap = await getDocs(collection(db, COLLECTION));
    docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  return docs
    .filter((a) => toDate(a.startAt) >= now && a.status === APPOINTMENT_STATUS.SCHEDULED)
    .sort((a, b) => toDate(a.startAt) - toDate(b.startAt))
    .slice(0, limit);
}

/** Dados do dashboard admin — inclui hoje (todos os status) e próximos agendados. */
export async function getDashboardData() {
  const today = format(new Date(), DATE_FORMAT);
  const { start, end } = getDayBounds(today);
  const now = new Date();

  const snap = await getDocs(collection(db, COLLECTION));
  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const todayAppointments = all
    .filter((a) => {
      if (a.status === APPOINTMENT_STATUS.CANCELLED) return false;
      const apptStart = toDate(a.startAt);
      return apptStart >= start && apptStart <= end;
    })
    .sort((a, b) => toDate(a.startAt) - toDate(b.startAt));

  const upcomingScheduled = all
    .filter((a) => toDate(a.startAt) >= now && a.status === APPOINTMENT_STATUS.SCHEDULED)
    .sort((a, b) => toDate(a.startAt) - toDate(b.startAt));

  return { todayAppointments, upcomingScheduled };
}

export async function getAvailableSlots({ barberId, dateStr, serviceDurationMinutes }) {
  const duration = Number(serviceDurationMinutes);
  if (!duration || duration <= 0) {
    throw new Error('Duração do serviço inválida.');
  }

  const barber = await getBarberById(barberId);
  if (!barber) return [];

  const availability = await getAvailabilityForBarberAndDate(barber, dateStr);
  if (availability.isDayOff) return [];

  const appointments = await getScheduledAppointmentsByBarberAndDate(barberId, dateStr);

  return calculateAvailableSlots({
    dateStr,
    serviceDurationMinutes: duration,
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
  const snap = await getDocs(
    query(collection(db, COLLECTION), where('barberId', '==', barberId))
  );

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((a) => {
      const apptStart = toDate(a.startAt);
      return apptStart >= start && apptStart <= end;
    })
    .sort((a, b) => toDate(a.startAt) - toDate(b.startAt));
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
