import { isFirebaseConfigured } from '../../config/firebase';

export default function FirebaseBanner() {
  if (isFirebaseConfigured) return null;

  const isProd = import.meta.env.PROD;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary text-white text-sm p-3 text-center">
      Firebase não detectado.
      {isProd ? (
        <> Rode <strong>npm run preview</strong> (já faz o build automaticamente) ou <strong>npm run build</strong> antes do preview.</>
      ) : (
        <> Verifique o arquivo <strong>.env</strong> na raiz e reinicie com <strong>npm run dev</strong>.</>
      )}
    </div>
  );
}
