import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { ROLES } from '../constants';

function assertFirebase() {
  if (!isFirebaseConfigured || !auth || !db) {
    throw new Error('Firebase não configurado. Crie o arquivo .env com suas credenciais.');
  }
}

export async function registerUser({ email, password, displayName, phone, role = ROLES.CLIENT }) {
  assertFirebase();

  const credential = await createUserWithEmailAndPassword(auth, email, password);

  try {
    await updateProfile(credential.user, { displayName });

    await setDoc(doc(db, 'users', credential.user.uid), {
      uid: credential.user.uid,
      email,
      displayName,
      phone: phone || '',
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    try {
      await deleteUser(credential.user);
    } catch {
      // usuário auth pode precisar de login recente para deletar; ignora
    }
    throw error;
  }

  return credential.user;
}

export async function loginUser(email, password) {
  assertFirebase();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() {
  if (auth) await signOut(auth);
}

export async function resetPassword(email) {
  assertFirebase();
  await sendPasswordResetEmail(auth, email);
}

export async function getUserProfile(uid) {
  assertFirebase();
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function getAuthErrorMessage(error) {
  const code = error?.code || '';

  const authErrors = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres).',
    'auth/operation-not-allowed': 'Login por e-mail não está ativado no Firebase Console.',
    'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde e tente novamente.',
  };

  if (authErrors[code]) return authErrors[code];

  if (code === 'permission-denied' || error?.message?.includes('permission')) {
    return 'Permissão negada no Firestore. Execute: npm run firebase:rules';
  }

  return error?.message || 'Erro ao processar. Tente novamente.';
}
