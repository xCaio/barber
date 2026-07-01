import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'services';

function normalizeService(data) {
  const result = { ...data };
  if (data.price !== undefined && data.price !== null) {
    result.price = Number(data.price) || 0;
  }
  if (data.durationMinutes !== undefined && data.durationMinutes !== null) {
    const duration = Number(data.durationMinutes);
    result.durationMinutes = duration > 0 ? duration : 30;
  }
  if (data.order !== undefined && data.order !== null) {
    result.order = Number(data.order) || 999;
  }
  return result;
}

function normalizeFromFirestore(id, data) {
  return normalizeService({
    id,
    ...data,
    price: data.price ?? 0,
    durationMinutes: data.durationMinutes ?? 30,
    order: data.order ?? 999,
  });
}

export async function getActiveServices() {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs
    .map((d) => normalizeFromFirestore(d.id, d.data()))
    .filter((s) => s.active !== false)
    .sort((a, b) => a.order - b.order);
}

export async function getAllServices() {
  const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => normalizeService({ id: d.id, ...d.data() }));
}

export async function getServiceById(id) {
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? normalizeService({ id: snap.id, ...snap.data() }) : null;
}

export async function createService(data) {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...normalizeService(data),
    active: data.active ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateService(id, data) {
  await updateDoc(doc(db, COLLECTION, id), {
    ...normalizeService({ ...data, id }),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteService(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
