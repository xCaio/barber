import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { format } from 'date-fns';
import { DATE_FORMAT } from '../utils/dateUtils';
import { DEFAULT_WORKING_HOURS, DEFAULT_LUNCH_BREAK } from '../constants';

const COLLECTION = 'availability';

function availabilityDocId(barberId, dateStr) {
  return `${barberId}_${dateStr}`;
}

function getWeeklyDay(schedule, dayOfWeek) {
  if (!schedule) return null;
  return schedule[dayOfWeek] ?? schedule[String(dayOfWeek)] ?? null;
}

export async function getDayAvailability(barberId, dateStr) {
  const id = availabilityDocId(barberId, dateStr);
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function upsertDayAvailability(barberId, dateStr, data) {
  const id = availabilityDocId(barberId, dateStr);
  const ref = doc(db, COLLECTION, id);
  const existing = await getDoc(ref);

  const payload = {
    barberId,
    date: dateStr,
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (existing.exists()) {
    await updateDoc(ref, payload);
  } else {
    await setDoc(ref, {
      ...payload,
      blockedSlots: data.blockedSlots || [],
      isDayOff: data.isDayOff ?? false,
      createdAt: serverTimestamp(),
    });
  }
}

export async function setDayOff(barberId, dateStr, isDayOff = true) {
  await upsertDayAvailability(barberId, dateStr, { isDayOff });
}

export async function setLunchBreak(barberId, dateStr, lunchBreak) {
  await upsertDayAvailability(barberId, dateStr, { lunchBreak });
}

export async function addBlockedSlot(barberId, dateStr, slot) {
  const current = await getDayAvailability(barberId, dateStr);
  const blockedSlots = [...(current?.blockedSlots || []), slot];
  await upsertDayAvailability(barberId, dateStr, { blockedSlots });
}

export async function removeBlockedSlot(barberId, dateStr, index) {
  const current = await getDayAvailability(barberId, dateStr);
  const blockedSlots = (current?.blockedSlots || []).filter((_, i) => i !== index);
  await upsertDayAvailability(barberId, dateStr, { blockedSlots });
}

export async function getAvailabilityForBarberAndDate(barber, dateStr) {
  const dayAvailability = await getDayAvailability(barber.id, dateStr);
  const date = new Date(dateStr + 'T12:00:00');
  const dayOfWeek = date.getDay();

  if (dayAvailability?.isDayOff) {
    return { isDayOff: true, workingHours: null, lunchBreak: null, blockedSlots: [] };
  }

  const weekly = getWeeklyDay(barber.weeklySchedule, dayOfWeek);
  const enabled = weekly?.enabled ?? (dayOfWeek >= 1 && dayOfWeek <= 6);

  if (!enabled) {
    return { isDayOff: true, workingHours: null, lunchBreak: null, blockedSlots: [] };
  }

  const workingHours =
    dayAvailability?.workingHours ||
    weekly?.workingHours ||
    barber.workingHours ||
    DEFAULT_WORKING_HOURS;

  const lunchBreak =
    dayAvailability?.lunchBreak ||
    weekly?.lunchBreak ||
    barber.lunchBreak ||
    DEFAULT_LUNCH_BREAK;

  return {
    isDayOff: false,
    workingHours,
    lunchBreak,
    blockedSlots: dayAvailability?.blockedSlots || [],
  };
}

export function todayStr() {
  return format(new Date(), DATE_FORMAT);
}
