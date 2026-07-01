import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
  setPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured, firebaseConfig } from '../config/firebase';
import { ROLES } from '../constants';

const REQUEST_TIMEOUT_MS = 30000;

function assertFirebase() {
  if (!isFirebaseConfigured || !auth || !db) {
    throw new Error('Firebase não configurado. Crie o arquivo .env com suas credenciais.');
  }
}

function withTimeout(promise, ms = REQUEST_TIMEOUT_MS, message = 'Tempo esgotado. Verifique sua conexão.') {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}

/** Login direto pela REST API — contorna travamentos do SDK no navegador. */
async function loginViaRestApi(email, password) {
  const apiKey = firebaseConfig?.apiKey;
  if (!apiKey) throw new Error('API Key não configurada.');

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim(),
        password,
        returnSecureToken: true,
      }),
    }
  );

  const data = await response.json();

  if (data.error) {
    const err = new Error(data.error.message);
    err.code = `auth/${data.error.message?.includes('INVALID') ? 'invalid-credential' : 'api-error'}`;
    throw err;
  }

  return data;
}

async function signInWithFallback(email, password) {
  const trimmedEmail = email.trim();
  const trySignIn = () => signInWithEmailAndPassword(auth, trimmedEmail, password);

  try {
    const result = await withTimeout(trySignIn(), 10000, 'TIMEOUT_SDK');
    return result.user;
  } catch (firstError) {
    const isTimeout =
      firstError.message === 'TIMEOUT_SDK' || firstError.message?.includes('Tempo esgotado');

    if (!isTimeout) throw firstError;

    console.warn('[Auth] SDK demorou — tentando persistência alternativa...');

    const persistences = [inMemoryPersistence, browserSessionPersistence];

    for (const persistence of persistences) {
      try {
        await setPersistence(auth, persistence);
        const result = await withTimeout(trySignIn(), 15000, 'TIMEOUT_SDK');
        return result.user;
      } catch (err) {
        if (err.message !== 'TIMEOUT_SDK' && !err.message?.includes('Tempo esgotado')) {
          throw err;
        }
      }
    }

    try {
      await loginViaRestApi(trimmedEmail, password);
    } catch (restError) {
      throw restError;
    }

    throw new Error(
      'Suas credenciais estão corretas, mas o navegador bloqueou o login. ' +
        'Limpe os dados do site (F12 → Application → Clear site data) ou libere a API Key para localhost no Google Cloud.'
    );
  }
}

export async function registerUser({ email, password, displayName, phone, role = ROLES.CLIENT }) {
  assertFirebase();

  const credential = await withTimeout(
    createUserWithEmailAndPassword(auth, email.trim(), password),
    REQUEST_TIMEOUT_MS,
    'Tempo esgotado ao criar conta. Verifique sua conexão.'
  );

  try {
    await updateProfile(credential.user, { displayName });

    await setDoc(doc(db, 'users', credential.user.uid), {
      uid: credential.user.uid,
      email: email.trim(),
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
      // ignora
    }
    throw error;
  }

  return credential.user;
}

export async function loginUser(email, password) {
  assertFirebase();
  return signInWithFallback(email, password);
}

export async function logoutUser() {
  if (auth) await signOut(auth);
}

export async function resetPassword(email) {
  assertFirebase();
  await sendPasswordResetEmail(auth, email.trim());
}

export async function getUserProfile(uid) {
  if (!db || !uid) return null;

  try {
    const snap = await withTimeout(
      getDoc(doc(db, 'users', uid)),
      8000,
      'Perfil indisponível.'
    );
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.warn('Não foi possível carregar perfil:', error);
    return null;
  }
}

export function getAuthErrorMessage(error) {
  const code = error?.code || '';
  const message = error?.message || '';

  const authErrors = {
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres).',
    'auth/operation-not-allowed': 'Login por e-mail não está ativado no Firebase Console.',
    'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde e tente novamente.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/api-error': 'Erro na autenticação. Verifique e-mail e senha.',
  };

  if (message.includes('INVALID_LOGIN_CREDENTIALS') || message.includes('INVALID_PASSWORD')) {
    return 'E-mail ou senha incorretos.';
  }

  if (message.includes('API key not valid')) {
    return 'API Key inválida. Verifique o arquivo .env.';
  }

  if (message.includes('REFERER') || message.includes('referer')) {
    return 'API Key bloqueada para localhost. No Google Cloud Console, libere http://localhost:* na chave de API.';
  }

  if (authErrors[code]) return authErrors[code];

  if (code === 'permission-denied' || message.includes('permission')) {
    return 'Permissão negada no Firestore. Execute: npm run firebase:rules';
  }

  if (message.includes('Tempo esgotado') || message.includes('Não foi possível concluir')) {
    return message;
  }

  return message || 'Erro ao processar. Tente novamente.';
}
