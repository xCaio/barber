import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AppRouter from './routes/AppRouter';
import ErrorBoundary from './components/ui/ErrorBoundary';
import FirebaseBanner from './components/ui/FirebaseBanner';
import { useAuthStore } from './store/authStore';

function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <ErrorBoundary>
      <FirebaseBanner />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E1E1E',
            color: '#d7d7d7',
            border: '1px solid #BD1A1A',
          },
        }}
      />
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;
