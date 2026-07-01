import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID
);

export const firebaseConfig = isFirebaseConfigured
  ? {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    }
  : null;

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured && firebaseConfig) {
  const isNewApp = getApps().length === 0;
  app = isNewApp ? initializeApp(firebaseConfig) : getApp();

  if (isNewApp) {
    auth = initializeAuth(app, {
      persistence: [browserLocalPersistence, browserSessionPersistence],
    });
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  } else {
    auth = getAuth(app);
    db = getFirestore(app);
  }
} else if (import.meta.env.DEV) {
  console.warn(
    '[Barbearia] Firebase não configurado. Crie o arquivo .env na raiz do projeto (copie de .env.example).'
  );
}

export { auth, db };
export default app;
