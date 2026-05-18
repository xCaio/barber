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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { DEFAULT_WORKING_HOURS, DEFAULT_LUNCH_BREAK } from '../constants';

const COLLECTION = 'barbers';

export async function getActiveBarbers() {
  const q = query(
    collection(db, COLLECTION),
    where('active', '==', true),
    orderBy('name', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllBarbers() {
  const q = query(collection(db, COLLECTION), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getBarberById(id) {
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createBarber(data) {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    active: true,
    workingHours: data.workingHours || DEFAULT_WORKING_HOURS,
    lunchBreak: data.lunchBreak || DEFAULT_LUNCH_BREAK,
    weeklySchedule: data.weeklySchedule || buildDefaultWeeklySchedule(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBarber(id, data) {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

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
