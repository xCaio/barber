import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { DEFAULT_WORKING_HOURS, DEFAULT_LUNCH_BREAK } from '../constants';
import { createBarber, updateBarber } from './barberService';
import { createService } from './serviceService';

const DEFAULT_BARBER = {
  name: 'Thiago Garcia',
  bio: 'Barbeiro profissional — tradição, qualidade e estilo em cada corte.',
  active: true,
};

export const DEFAULT_SERVICES = [
  { name: 'Corte Masculino', description: 'Corte personalizado com acabamento perfeito.', price: 25, durationMinutes: 45, order: 1 },
  { name: 'Barba Completa', description: 'Aparar, modelar e finalizar sua barba.', price: 10, durationMinutes: 20, order: 2 },
  { name: 'Combo Completo', description: 'Corte + barba + sobrancelhas.', price: 45, durationMinutes: 50, order: 3 },
  { name: 'Tratamento Premium', description: 'Hidratação capilar e massagem relaxante.', price: 25, durationMinutes: 45, order: 4 },
  { name: 'Pigmentação', description: 'Pigmentação profissional para barba e cabelo.', price: 20, durationMinutes: 45, order: 5 },
  { name: 'Platinado / Descoloração', description: 'Descoloração ou platinado profissional.', price: 70, durationMinutes: 90, order: 6 },
];

function buildDefaultWeeklySchedule() {
  const schedule = {};
  for (let i = 0; i <= 6; i++) {
    schedule[i] = {
      enabled: i >= 1 && i <= 6,
      workingHours: { ...DEFAULT_WORKING_HOURS },
      lunchBreak: { ...DEFAULT_LUNCH_BREAK },
    };
  }
  return schedule;
}

export async function seedInitialData() {
  const barbersSnap = await getDocs(collection(db, 'barbers'));
  const servicesSnap = await getDocs(collection(db, 'services'));

  const results = { barber: null, services: 0, barberUpdated: false };

  if (barbersSnap.empty) {
    await createBarber({
      ...DEFAULT_BARBER,
      workingHours: DEFAULT_WORKING_HOURS,
      lunchBreak: DEFAULT_LUNCH_BREAK,
      weeklySchedule: buildDefaultWeeklySchedule(),
    });
    results.barber = DEFAULT_BARBER.name;
  } else {
    for (const docSnap of barbersSnap.docs) {
      const data = docSnap.data();
      if (!data.workingHours || !data.lunchBreak) {
        await updateBarber(docSnap.id, {
          workingHours: data.workingHours || DEFAULT_WORKING_HOURS,
          lunchBreak: data.lunchBreak || DEFAULT_LUNCH_BREAK,
          weeklySchedule: data.weeklySchedule || buildDefaultWeeklySchedule(),
        });
        results.barberUpdated = true;
      }
    }
  }

  const existingNames = new Set(
    servicesSnap.docs.map((d) => (d.data().name || '').toLowerCase().trim())
  );

  for (const service of DEFAULT_SERVICES) {
    if (!existingNames.has(service.name.toLowerCase())) {
      await createService(service);
      results.services += 1;
    }
  }

  return results;
}

export async function hasBookingData() {
  const [barbersSnap, servicesSnap] = await Promise.all([
    getDocs(collection(db, 'barbers')),
    getDocs(collection(db, 'services')),
  ]);
  return !barbersSnap.empty && !servicesSnap.empty;
}
